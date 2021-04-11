package narou

import (
	"fmt"
	"github.com/koizuka/scraper"
	"net/http"
	"net/url"
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
	return fmt.Sprintf("Login Error: %v", e.LoginErrorMessage)
}

type Options struct {
	SessionName         string
	FilePrefix          string
	SaveToFile          bool
	NotUseNetwork       bool
	ShowRequestHeader   bool
	ShowResponseHeader  bool
	GetCredentials      func() (params *Credentials, err error)
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

// GetPage retrieves narou's page. try login when login is required.
func (narou *NarouWatcher) GetPage(url string) (*scraper.Page, error) {
	page, err := narou.session.GetPage(url)
	if err != nil {
		return nil, err
	}

	LoginFormSelector := "div#login_box>form"

	isLoginPage := func(page *scraper.Page) bool {
		forms := page.Find(LoginFormSelector)
		return forms.Length() > 0
	}

	// ログイン
	if isLoginPage(page) {
		form, err := page.Form(LoginFormSelector)
		if err != nil {
			return nil, fmt.Errorf("login form not found: %v", err)
		}

		credentials, err := narou.options.GetCredentials()
		if err != nil {
			return nil, fmt.Errorf("GetCredentials failed: %v", err)
		}
		if credentials == nil {
			return nil, LoginError{"GetCredentials returned nil"}
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

		if isLoginPage(page) {
			return nil, LoginError{"login failed"}
		}
	}

	// cookie を保存
	err = narou.session.SaveCookie()
	if err != nil {
		return nil, fmt.Errorf("SaveCookie failed: %v", err)
	}

	return page, nil
}
