package narou

import (
	"fmt"
	"github.com/koizuka/scraper"
	"net/http"
	"net/url"
	"regexp"
	"time"
)

var NarouLocation, _ = time.LoadLocation("Asia/Tokyo") // なろうの時刻表示は日本時間

type Credentials struct {
	Id       string
	Password string
}

type LoginError struct {
	LoginErrorMessage string
}

func (e LoginError) Error() string {
	return fmt.Sprintf("login Error: %v", e.LoginErrorMessage)
}

type Options struct {
	SessionName         string
	FilePrefix          string
	SaveToFile          bool
	NotUseNetwork       bool
	ShowRequestHeader   bool
	ShowResponseHeader  bool
	GetCredentials      func() (params *Credentials, err error)
	UserAgent           string
	NotSaveCookieToFile bool
}

type NarouWatcher struct {
	session *scraper.Session
	log     *scraper.BufferedLogger
	options Options
}

func (narou *NarouWatcher) Cookies(u *url.URL) []*http.Cookie {
	return narou.session.Cookies(u)
}

func (narou *NarouWatcher) SetCookies(u *url.URL, cookies []*http.Cookie) {
	narou.session.SetCookies(u, cookies)
}

func (narou *NarouWatcher) Printf(format string, a ...interface{}) {
	narou.log.Printf(format, a...)
}

func (narou *NarouWatcher) Flush(logger scraper.Logger) {
	narou.log.Flush(logger)
}

func NewNarouWatcher(opt Options) (*NarouWatcher, error) {
	if opt.SessionName == "" {
		opt.SessionName = "narou" // random?
	}

	log := &scraper.BufferedLogger{}
	session := scraper.NewSession(opt.SessionName, log)

	session.FilePrefix = opt.FilePrefix
	session.SaveToFile = opt.SaveToFile
	session.NotUseNetwork = opt.NotUseNetwork
	session.ShowRequestHeader = opt.ShowRequestHeader
	session.ShowResponseHeader = opt.ShowResponseHeader
	session.UserAgent = opt.UserAgent
	session.BodyFilter = func(resp *scraper.Response, body []byte) ([]byte, error) {
		// HTML構文エラーがあるのを置換でつぶす
		body = regexp.MustCompile(`<span><span></a>`).ReplaceAll(body, []byte("</span></span></a>"))
		return body, nil
	}

	if !opt.NotSaveCookieToFile {
		err := session.LoadCookie()
		if err != nil {
			return nil, fmt.Errorf("LoadCookie failed: %v", err)
		}
	}

	return &NarouWatcher{
		session: session,
		log:     log,
		options: opt,
	}, nil
}

const NarouLoginFormSelector = "form[action='/login/login/']"

func isNarouLoginPage(page *scraper.Page) bool {
	forms := page.Find(NarouLoginFormSelector)
	return forms.Length() > 0
}

func isNarouUserPage(page *scraper.Page) bool {
	return page.Url.Path == "/user/top/"
}

func (narou *NarouWatcher) login(page *scraper.Page, credentials *Credentials) (*scraper.Page, error) {
	form, err := page.Form(NarouLoginFormSelector)
	if err != nil {
		return nil, err
	}

	_ = form.Set("narouid", credentials.Id)
	_ = form.Set("pass", credentials.Password)
	resp, err := narou.session.Submit(form)
	if err != nil {
		return nil, fmt.Errorf("session.Submit() failed: %v", err)
	}
	page, err = resp.Page()
	if err != nil {
		return nil, fmt.Errorf("resp.Page() failed: %v", err)
	}

	return page, nil
}

func (narou *NarouWatcher) Login(credentials *Credentials) error {
	page, err := narou.session.GetPage("https://syosetu.com/login/input/")
	if err != nil {
		return err
	}

	if isNarouUserPage(page) {
		return nil
	}

	if !isNarouLoginPage(page) {
		return fmt.Errorf("login page not recognized: %v", err)
	}

	page, err = narou.login(page, credentials)
	if err != nil {
		return err
	}

	if !isNarouUserPage(page) {
		return LoginError{"login failed"}
	}

	// cookie を保存
	err = narou.session.SaveCookie()
	if err != nil {
		return fmt.Errorf("SaveCookie failed: %v", err)
	}

	return nil
}

func (narou *NarouWatcher) Logout() error {
	page, err := narou.session.GetPage(UserTopURL)
	if err != nil {
		return err
	}
	if isNarouLoginPage(page) {
		return nil // already logged out
	}

	info, err := ParseUserTop(page)
	if err != nil {
		return err
	}
	form := &scraper.Form{
		Action: info.Logout.URL,
		Method: "post",
	}
	_ = form.Set("token", info.Logout.Token)
	_, err = narou.session.Submit(form)
	if err != nil {
		return err
	}

	// cookie を保存
	err = narou.session.SaveCookie()
	if err != nil {
		return fmt.Errorf("SaveCookie failed: %v", err)
	}

	return nil
}

// GetPage retrieves narou's page. try login when login is required.
func (narou *NarouWatcher) GetPage(url string) (*scraper.Page, error) {
	page, err := narou.session.GetPage(url)
	if err != nil {
		return nil, err
	}

	// ログイン
	if isNarouLoginPage(page) {
		if narou.options.GetCredentials == nil {
			return nil, LoginError{"login is required"}
		}
		credentials, err := narou.options.GetCredentials()
		if err != nil {
			return nil, fmt.Errorf("GetCredentials failed: %v", err)
		}
		if credentials == nil {
			return nil, LoginError{"GetCredentials returned nil"}
		}

		page, err = narou.login(page, credentials)
		if err != nil {
			return nil, err
		}
	}

	// cookie を保存
	err = narou.session.SaveCookie()
	if err != nil {
		return nil, fmt.Errorf("SaveCookie failed: %v", err)
	}

	return page, nil
}

func (narou *NarouWatcher) GetJSONP(URL string, callback string) (string, error) {
	u, err := url.Parse(URL)
	if err != nil {
		return "", fmt.Errorf("GetJSONP(%v): url.Parse error: %v", URL, err)
	}
	q := u.Query()
	q.Add("callback", callback)
	u.RawQuery = q.Encode()
	URL = u.String()

	response, err := narou.session.Get(u.String())
	if err != nil {
		return "", fmt.Errorf("GetJSONP(%v): Get error: %v", URL, err)
	}
	regex := regexp.MustCompile(`\b` + `application/javascript` + `\b`)
	if !regex.MatchString(response.ContentType) {
		return "", fmt.Errorf("GetJSONP(%v): Content-Type missmatch: %v", URL, response.ContentType)
	}

	bytes, err := response.Body()
	if err != nil {
		return "", fmt.Errorf("GetJSONP(%v): get body failed: %v", URL, err)
	}
	body := string(bytes)
	extractor := regexp.MustCompile(`\s*(\w+)\s*\(\s*(\S.*\S)\s*\)\s*;`)
	matched := extractor.FindStringSubmatch(body)
	if matched == nil {
		return "", fmt.Errorf("GetJSONP(%v): invalid response", URL)
	}
	funcName := matched[1]
	json := matched[2]
	if funcName != callback {
		return "", fmt.Errorf("GetJSONP(%v): returned callback '%v' is not '%v'", URL, funcName, callback)
	}

	return json, nil
}
