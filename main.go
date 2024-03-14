package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"github.com/koizuka/scraper"
	"github.com/rs/cors"
	"github.com/skratchdot/open-golang/open"
	"log"
	"narou-watcher/cmd/model"
	"narou-watcher/narou"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/exec"
	"os/signal"
	"path"
	"strconv"
	"strings"
	"syscall"
	"time"
)

func GetFavNovelCategory(watcher *narou.NarouWatcher, url, wantTitle string) ([]model.FavNovelCategory, error) {
	page, err := watcher.GetPage(url)
	if err != nil {
		switch err.(type) {
		case narou.LoginError:
			return nil, err
		default:
			return nil, fmt.Errorf("GetPage(%v) failed: %v", url, err)
		}
	}

	items, err := narou.ParseFavNovelCategory(page, wantTitle)
	if err != nil {
		return nil, err
	}

	var result []model.FavNovelCategory
	for _, item := range *items {
		result = append(result, model.FavNovelCategory{
			No:       item.No,
			Name:     item.Name,
			NumItems: item.NumItems,
		})
	}
	return result, nil
}

func GetFavNovelListPage(watcher *narou.NarouWatcher, url string, wantTitle string) (*narou.FavNovelListPage, error) {
	page, err := watcher.GetPage(url)
	if err != nil {
		switch err.(type) {
		case narou.LoginError:
			return nil, err
		default:
			return nil, fmt.Errorf("GetPage(%v) failed: %v", url, err)
		}
	}

	itemsPage, err := narou.ParseFavNovelList(page, wantTitle)
	if err != nil {
		return nil, err
	}
	return itemsPage, nil
}

func GetFavNovelList(watcher *narou.NarouWatcher, url, wantTitle string, maxPage uint) ([]model.FavNovelListRecord, error) {
	var items []narou.FavNovelList

	for i := uint(0); i < maxPage; i++ {
		page, err := GetFavNovelListPage(watcher, url, wantTitle)
		if err != nil {
			return nil, err
		}

		items = append(items, page.Items...)

		if page.NextPageLink == "" {
			break
		}
		url = page.NextPageLink
	}

	var result []model.FavNovelListRecord
	for _, item := range items {
		result = append(result, model.FavNovelListRecord{
			BaseURL:         fmt.Sprintf("https://%v.syosetu.com/%v/", item.SiteID, item.NovelID),
			UpdateTime:      item.UpdateTime,
			BookmarkEpisode: item.BookmarkEpisode,
			LatestEpisode:   item.LatestEpisode,
			Title:           item.Title,
			AuthorName:      item.AuthorName,
			IsNotice:        item.IsNotice,
			Completed:       item.Completed,
			Memo:            item.Memo,
		})
	}
	return result, nil
}

func GetIsNoticeListPage(watcher *narou.NarouWatcher, url string, wantTitle string) (*narou.IsNoticeListPage, error) {
	page, err := watcher.GetPage(url)
	if err != nil {
		switch err.(type) {
		case narou.LoginError:
			return nil, err
		default:
			return nil, fmt.Errorf("GetPage(%v) failed: %v", url, err)
		}
	}

	itemsPage, err := narou.ParseIsNoticeList(page, wantTitle)
	if err != nil {
		return nil, fmt.Errorf("%v from %v", err, url)
	}
	return itemsPage, nil
}

func GetIsNoticeList(watcher *narou.NarouWatcher, url string, wantTitle string, maxPage uint) ([]model.IsNoticeListRecord, error) {
	var items []narou.IsNoticeList

	for i := uint(0); i < maxPage; i++ {
		page, err := GetIsNoticeListPage(watcher, url, wantTitle)
		if err != nil {
			return nil, err
		}

		items = append(items, page.Items...)

		if page.NextPageLink == "" {
			break
		}
		url = page.NextPageLink
	}

	var result []model.IsNoticeListRecord
	for _, item := range items {
		result = append(result, model.IsNoticeListRecord{
			BaseURL:         fmt.Sprintf("https://%v.syosetu.com/%v/", item.SiteID, item.NovelID),
			UpdateTime:      item.UpdateTime,
			BookmarkEpisode: item.BookmarkEpisode,
			LatestEpisode:   item.LatestEpisode,
			Title:           item.Title,
			AuthorName:      item.AuthorName,
			Completed:       item.Completed,
		})
	}
	return result, nil
}

func GetFavUserUpdates(watcher *narou.NarouWatcher, URL string) (*model.FavUserUpdatesRecord, error) {
	j, err := watcher.GetJSONP(URL, "func")
	if err != nil {
		return nil, err
	}

	info, err := narou.ParseUserTopApiJson(j)
	if err != nil {
		return nil, err
	}
	// TODO BLogListHTML, NovelListHTML を分解する
	// 構造
	// BlogListHTML
	//  h3
	//  ul
	//    li アイテム一つ
	//      a タイトル
	//      a 作者
	// NovelListHTML
	//  h3
	//  div#fanusernovel_list アイテム一つ
	//    div#fanusernovel_title
	//      a タイトル
	//    div#fanusernovel_type
	//      div#fanusernovel_info 月日時分
	//      a 作者
	result := &model.FavUserUpdatesRecord{
		R18PassiveCount: info.R18PassiveCount,
		BlogListHTML:    info.BlogListHTML,
		NovelListHTML:   info.NovelListHTML,
		PassiveCount:    info.PassiveCount,
	}

	return result, nil
}

func parseURLForCookie(url *url.URL) (isHttps bool, cookiePath string) {
	isHttps = url.Scheme == "https"
	cookiePath = url.Path
	if cookiePath == "" {
		cookiePath = "/"
	}
	return isHttps, cookiePath
}

type NarouApiHandlerType = func(w http.Header, r *http.Request, service *narou.NarouWatcher) ([]byte, error)

type NarouApiService struct {
	logDir       string
	sessionName  string
	cookiePrefix string
	cookieDomain *url.URL
	isHttps      bool
	cookiePath   string
	debug        bool
}

func NewNarouApiService(logDir, sessionName string, openAddress *url.URL, debug bool) NarouApiService {
	dirName := path.Join(logDir, sessionName)
	isHttps, cookiePath := parseURLForCookie(openAddress)

	if _, err := os.Stat(dirName); os.IsNotExist(err) {
		log.Printf("creating directory: %v", dirName)
		err = os.Mkdir(dirName, 0700)
		if err != nil {
			log.Fatalf("Mkdir failed: %v", err)
		}
	}

	cookiePrefix := "narou-"
	narouUrl, _ := url.Parse("https://syosetu.com")

	return NarouApiService{
		logDir,
		sessionName,
		cookiePrefix,
		narouUrl,
		isHttps,
		cookiePath,
		debug,
	}
}

type BadRequestError struct {
	Message string
}

func (e BadRequestError) Error() string {
	return e.Message
}

func (apiService *NarouApiService) HandlerFunc(handler NarouApiHandlerType) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		watcher, err := narou.NewNarouWatcher(narou.Options{
			SessionName: apiService.sessionName,
			FilePrefix:  apiService.logDir + "/",
			GetCredentials: func() (*narou.Credentials, error) {
				if id, password, ok := r.BasicAuth(); ok {
					return &narou.Credentials{Id: id, Password: password}, nil
				}
				return nil, nil
			},
			NotSaveCookieToFile: true,
			SaveToFile:          apiService.debug,
			ShowResponseHeader:  apiService.debug,
		})
		if err != nil {
			log.Fatal(err)
		}

		// リクエストのcookieを session に中継
		var cookies []*http.Cookie
		for _, cookie := range r.Cookies() {
			if strings.HasPrefix(cookie.Name, apiService.cookiePrefix) {
				cookies = append(cookies, &http.Cookie{Name: cookie.Name[len(apiService.cookiePrefix):], Value: cookie.Value})
			}
		}
		watcher.SetCookies(apiService.cookieDomain, cookies)

		body, err := handler(w.Header(), r, watcher)
		if err != nil {
			switch err.(type) {
			case narou.LoginError:
				http.Error(w, "Unauthorized", 401)
			case scraper.RequestError:
				e := err.(scraper.RequestError)
				http.Error(w, fmt.Sprintf("Request Failed: %#v: %v", e.RequestURL.String(), e.Err), 503)
			case scraper.ResponseError:
				e := err.(scraper.ResponseError)
				http.Error(w, fmt.Sprintf("%v: %#v", e.Response.Status, e.RequestURL.String()), e.Response.StatusCode)
			case BadRequestError:
				http.Error(w, fmt.Sprintf("Bad Request: %v", err), 400)
			default:
				log.Printf("%v %v: error %v: %v", r.Method, r.URL, 503, err)
				http.Error(w, fmt.Sprintf("Internal Server Error: %v", err), 503)
			}
			return
		}

		// session で設定されたcookieを返却する(削除されたものは削除)
		deleteCookies := make(map[string]string)
		for _, cookie := range r.Cookies() {
			if strings.HasPrefix(cookie.Name, apiService.cookiePrefix) {
				deleteCookies[cookie.Name] = cookie.Value
			}
		}

		setCookie := func(name, value string, delete bool) {
			cookie := &http.Cookie{Name: name, Value: value, Path: apiService.cookiePath}
			if delete {
				cookie.MaxAge = -1
			} else {
				cookie.MaxAge = 30 * 24 * 60 * 60 // 30 days to expire
			}
			if apiService.isHttps {
				cookie.Secure = true
				cookie.SameSite = http.SameSiteNoneMode
			}

			http.SetCookie(w, cookie)
		}

		for _, cookie := range watcher.Cookies(apiService.cookieDomain) {
			name := apiService.cookiePrefix + cookie.Name
			setCookie(name, cookie.Value, false)
			if _, ok := deleteCookies[name]; ok {
				delete(deleteCookies, name)
			}
		}
		for name, value := range deleteCookies {
			setCookie(name, value, true)
		}

		_, _ = w.Write(body)
	}
}

func ReturnJson(w http.Header, body interface{}) ([]byte, error) {
	bin, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}

	w.Set("Content-Type", "application/json")
	return bin, nil
}

func NarouLoginHandler(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
	credentials := narou.Credentials{
		Id:       r.PostFormValue("id"),
		Password: r.PostFormValue("password"),
	}
	err := watcher.Login(&credentials)
	if err != nil {
		return nil, err
	}

	return ReturnJson(w, true)
}

func NarouLogoutHandler(w http.Header, _ *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
	err := watcher.Logout()
	if err != nil {
		return nil, err
	}

	return ReturnJson(w, true)
}

func favNovelCategoryHandler(url, wantTitle string) NarouApiHandlerType {
	return func(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
		results, err := GetFavNovelCategory(watcher, url, wantTitle)
		if err != nil {
			return nil, err
		}
		return ReturnJson(w, results)
	}
}

func favNovelListHandler(baseUrl, title string, category uint, order string, page, maxPage uint) NarouApiHandlerType {
	u, _ := url.Parse(baseUrl)
	query := url.Values{}
	if category > 1 {
		query.Add("nowcategory", fmt.Sprintf("%v", category))
	}
	if order != "" {
		query.Add("order", order)
	}
	if page > 1 {
		query.Add("p", fmt.Sprintf("%v", page))
	}
	u.RawQuery = query.Encode()

	return func(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
		results, err := GetFavNovelList(watcher, u.String(), title, maxPage)
		if err != nil {
			return nil, err
		}
		return ReturnJson(w, results)
	}
}

/*
_ga=GA1.2.480990279.1606738764;
__td_signed=true;
ses=BS61zXxUXZZ4uCAEaApV13;
autologin=870350<>9d6c6ccc27380d5bf6fbbf8da3a0741eb0489e521a39b727e84dff9c0dea6461;
ks2=p9dsy5affbf;
sasieno=0;
lineheight=0;
fontsize=0;
fix_menu_bar=1;
novellayout=2;
OX_plg=pm;
adr_id=Cjag6FpghKfJeNu8fgwu4uoAx3h1stntiCq4GyJqWcHtd6I2;
over18=yes;
__gads=ID=2531297594aec20f:T=1608919401:S=ALNI_MZFxrvRPPqrgzrjvehQRZl09NKqrQ;
_im_vid=01F4EF0APZ5D0QQ9VEBGJANCGP;
smplineheight=0;
smpfontsize=0;
smpnovellayout=0;
_gid=GA1.2.1578484011.1621610916;
nlist3=11w31.v-wrk1.k-ukjd.q-jsbu.1c-u9la.1a-rt12.2j-10jqn.y-11dl1.7;
nlist1=pijl.46-cagn.j-11dxw.19-k0av.t7-axgr.23-ithk.rn-xkje.1-y62b.1-i6d3.40-ov8q.6o-w5gw.2d-tdut.2e-10c4q.1g-12nco.t-12unt.0-12s5n.2-xahs.53-11bkv.1y-qvkr.48-10xw4.1c-12opl.b-vgsp.5b-12new.p-vc92.33-10dnk.3g-10s97.2v-zijf.2v-10ski.19-xm6a.2y-10rbj.1p;
_td=45948fd9-4fc6-4adf-a6bc-4e5540c04d5a;
_gat=1
*/
func novelInfoHandler(ncode, baseUrl string, r18 bool) NarouApiHandlerType {
	domain := strings.TrimSuffix(baseUrl, "/") + "/"
	getUrl := domain + ncode + "/"

	domainURL, err := url.Parse(domain)
	if err != nil {
		log.Fatalf("novelInfoHandler: baseUrl %#v is invalid", baseUrl)
	}

	return func(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
		if r18 {
			watcher.SetCookies(domainURL, []*http.Cookie{{Name: "over18", Value: "yes"}})
		}

		// autologinがあるとログイン判定されるが、これはどこで付与されるのか...?
		autologinExists := false
		for _, c := range watcher.Cookies(domainURL) {
			if c.Name == "autologin" {
				autologinExists = true
				break
			}
		}
		if !autologinExists {
			// 適当に採取した値を入れてみたが...
			watcher.SetCookies(domainURL, []*http.Cookie{{
				Name:  "autologin",
				Value: "870350<>9d6c6ccc27380d5bf6fbbf8da3a0741eb0489e521a39b727e84dff9c0dea6461",
			}})
		}

		page, err := watcher.GetPage(getUrl)
		if err != nil {
			switch err.(type) {
			case narou.LoginError:
			case scraper.RequestError:
			case scraper.ResponseError:
				return nil, err
			default:
				return nil, fmt.Errorf("%#v: %v", getUrl, err)
			}
			return nil, err
		}

		confirm, err := narou.IsAgeConfirmPage(page)
		if err != nil {
			return nil, err
		}
		if confirm {
			return nil, fmt.Errorf("年連認証で停止")
		}

		novelInfo, err := narou.ParseNovelInfo(page)
		if err != nil {
			return nil, fmt.Errorf("%#v: %v", getUrl, err)
		}

		var contents []model.NovelInfoChapter
		if len(novelInfo.Index.ChapterHeads) == 0 {
			episodes := make([]model.NovelInfoEpisode, 0, len(novelInfo.Index.Episodes))
			for _, ep := range novelInfo.Index.Episodes {
				episodes = append(episodes, model.NovelInfoEpisode{
					SubTitle: ep.SubTitle,
					No:       ep.No,
					Date:     ep.PublishTime,
					Update:   ep.UpdateTime,
				})
			}
			contents = append(contents, model.NovelInfoChapter{
				Episodes: episodes,
			})
		} else {
			var indexes []int
			cur := 0
			for _, n := range novelInfo.Index.ChapterHeads {
				for ; cur < len(novelInfo.Index.Episodes); cur++ {
					if novelInfo.Index.Episodes[cur].Link == n.Link {
						indexes = append(indexes, cur)
						break
					}
				}
			}
			indexes = append(indexes, len(novelInfo.Index.Episodes))

			for c := range novelInfo.Index.ChapterHeads {
				start := indexes[c]
				end := indexes[c+1]
				episodes := make([]model.NovelInfoEpisode, end-start)
				for i := 0; i < end-start; i++ {
					ep := novelInfo.Index.Episodes[start+i]
					episodes[i] = model.NovelInfoEpisode{
						SubTitle: ep.SubTitle,
						No:       ep.No,
						Date:     ep.PublishTime,
						Update:   ep.UpdateTime,
					}
				}
				contents = append(contents, model.NovelInfoChapter{
					Chapter:  novelInfo.Index.Chapters[c],
					Episodes: episodes,
				})
			}
		}

		return ReturnJson(w, model.NovelInfoRecord{
			BaseURL:         getUrl,
			Title:           novelInfo.Title,
			AuthorName:      novelInfo.AuthorName,
			Keywords:        strings.Split(novelInfo.Keywords, " "),
			Abstract:        novelInfo.Abstract,
			AuthorURL:       novelInfo.AuthorURL,
			BookmarkURL:     novelInfo.BookmarkURL,
			BookmarkNo:      novelInfo.BookmarkNo,
			BookmarkEpisode: novelInfo.BookmarkEpisode,
			Contents:        contents,
		})
	}
}

func isNoticeListHandler(url string, wantTitle string) NarouApiHandlerType {
	return func(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
		query := r.URL.Query()
		var maxPage uint = 1
		if p, ok := query["max_page"]; ok {
			p, err := strconv.ParseUint(p[0], 10, 32)
			if err != nil {
				return nil, BadRequestError{"max_page must greater or equal to 1"}
			}
			maxPage = uint(p)
		}

		results, err := GetIsNoticeList(watcher, url, wantTitle, maxPage)
		if err != nil {
			return nil, err
		}
		return ReturnJson(w, results)
	}
}

func favUserUpdatesHandler(URL string) NarouApiHandlerType {
	return func(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
		query := r.URL.Query()
		token, ok := query["token"]
		if !ok {
			page, err := watcher.GetPage(narou.UserTopURL)
			if err != nil {
				return nil, err
			}
			info, err := narou.ParseUserTop(page)
			if err != nil {
				return nil, err
			}
			token = []string{info.Logout.Token}
			w.Set("token", token[0])
		}
		u, err := url.Parse(URL)
		if err != nil {
			return nil, err
		}
		q := u.Query()
		q.Add("token", token[0])
		u.RawQuery = q.Encode()
		result, err := GetFavUserUpdates(watcher, u.String())
		if err != nil {
			return nil, err
		}
		return ReturnJson(w, result)
	}
}

func getProjectDirectory() (string, error) {
	out, err := exec.Command("git", "rev-parse", "--show-toplevel").Output()
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(string(out)), nil
}

func main() {
	projectDir, err := getProjectDirectory()
	if err != nil {
		projectDir, err = os.Getwd()
		if err != nil {
			log.Fatal("getwd failed", err)
		}
	}

	listenPort := flag.Uint("port", 7676, "listen port")
	openFlag := flag.Bool("open", false, "ブラウザを自動で開く")
	reverseProxyAddress := flag.String("reverse-proxy", "https://koizuka.github.io/narou-watcher/", "reverse proxy to")
	logDirectory := flag.String("log-dir", path.Join(projectDir, "log"), "debug log directory(-debug 指定時)")
	publicAddress := flag.String("public-url", "", "外から見えるアドレス(http://localhost:7676)の上書き")
	debugFlag := flag.Bool("debug", false, "log directoryにデバッグ情報を記録する")
	flag.Parse()

	var host string
	if *publicAddress != "" {
		host = *publicAddress
	} else {
		host = fmt.Sprintf("http://localhost:%v", *listenPort)
	}
	openAddress, err := url.Parse(host)
	if err != nil {
		log.Fatalf("URL Parse error: '%v' -> %v", host, err)
	}

	logDir := *logDirectory
	log.Printf("log directory: '%v'", logDir)

	sessionName := "narou"
	log.Printf("session name: '%v'", sessionName)

	narouApiService := NewNarouApiService(logDir, sessionName, openAddress, *debugFlag)

	mux := http.NewServeMux()

	setHandler := func(path string, handler NarouApiHandlerType) {
		mux.HandleFunc(path, narouApiService.HandlerFunc(handler))
	}

	setBookmarksHandler := func(pattern, getURL, title string) {
		base := path.Clean(pattern)
		mux.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
			subPath := path.Clean(path.Clean(r.URL.Path)[len(base):])
			// log.Printf("bookmarks: subPath=%v", subPath)
			if subPath == "." {
				narouApiService.HandlerFunc(favNovelCategoryHandler(getURL, title))(w, r)
				return
			} else {
				category, err := strconv.ParseUint(subPath[1:], 10, 32)
				if err != nil {
					http.NotFound(w, r)
					return
				}
				query := r.URL.Query()
				var order string
				if o, ok := query["order"]; ok {
					order = o[0]
				}
				var page uint
				if p, ok := query["page"]; ok {
					p, err := strconv.ParseUint(p[0], 10, 32)
					if err != nil {
						http.NotFound(w, r)
						return
					}
					page = uint(p)
				}
				var maxPage uint = 1
				if p, ok := query["max_page"]; ok {
					p, err := strconv.ParseUint(p[0], 10, 32)
					if err != nil {
						http.NotFound(w, r)
						return
					}
					maxPage = uint(p)
				}
				narouApiService.HandlerFunc(favNovelListHandler(getURL, title, uint(category), order, page, maxPage))(w, r)
				return
			}
		})
	}
	setBookmarksHandler("/narou/bookmarks/", narou.FavNovelListURL, narou.FavNovelListTitle)
	setBookmarksHandler("/r18/bookmarks/", narou.FavNovelListR18URL, narou.FavNovelListR18Title)

	setNovelInfoHandler := func(pattern, baseUrl string, r18 bool) {
		base := path.Clean(pattern)
		mux.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
			subPath := path.Clean(path.Clean(r.URL.Path)[len(base):])
			if subPath == "." {
				http.NotFound(w, r)
				return
			} else {
				ncode := subPath[1:]
				narouApiService.HandlerFunc(novelInfoHandler(ncode, baseUrl, r18))(w, r)
				return
			}
		})
	}
	setNovelInfoHandler("/narou/novels/", "https://ncode.syosetu.com/", false)
	setNovelInfoHandler("/r18/novels/", "https://novel18.syosetu.com/", true)

	setHandler("/narou/isnoticelist", isNoticeListHandler(narou.IsNoticeListURL, narou.IsNoticeListTitle))
	setHandler("/r18/isnoticelist", isNoticeListHandler(narou.IsNoticeListR18URL, narou.IsNoticeListR18Title))

	setHandler("/narou/fav-user-updates", favUserUpdatesHandler(narou.UserTopApiURL))

	setHandler("/narou/login", NarouLoginHandler)
	setHandler("/narou/logout", NarouLogoutHandler)

	remote, err := url.Parse(*reverseProxyAddress)
	if err != nil {
		log.Fatalf("proxy URL parse error: %v", err)
	}

	proxy := NewReverseProxyReplacingHost(remote)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		proxy.ServeHTTP(w, r)
	})

	log.Printf("Listening port %v...", *listenPort)
	l, err := net.Listen("tcp", fmt.Sprintf(":%v", *listenPort))
	if err != nil {
		log.Fatalf("Listen Error: %v", err)
	}

	log.Printf("open in browser: %v", openAddress)
	if *openFlag {
		_ = open.Run(openAddress.String())
	}

	srv := &http.Server{Handler: cors.New(cors.Options{
		AllowOriginFunc: func(_ string) bool {
			return true
		},
		AllowCredentials: true,
	}).Handler(mux)}

	log.Print("^C to shutdown.")

	go func() {
		err := srv.Serve(l)
		if err != nil {
			log.Print(err)
		}
	}()

	// ^C で終了する
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT)
	<-sigCh
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Print(err)
	}
	log.Print("shutdown.")
}

func NewReverseProxyReplacingHost(target *url.URL) *httputil.ReverseProxy {
	proxyDirector := httputil.NewSingleHostReverseProxy(target).Director
	return &httputil.ReverseProxy{
		Director: func(req *http.Request) {
			proxyDirector(req)
			req.Host = target.Host // <--------- ここがポイント
		},
	}
}
