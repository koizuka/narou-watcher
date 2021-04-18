package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
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

func GetFavNovelCategory(watcher *narou.NarouWatcher, url string) ([]model.FavNovelCategory, error) {
	page, err := watcher.GetPage(url)
	if err != nil {
		switch err.(type) {
		case narou.LoginError:
			return nil, err
		default:
			return nil, fmt.Errorf("GetPage(%v) failed: %v", url, err)
		}
	}

	items, err := narou.ParseFavNovelCategory(page)
	if err != nil {
		return nil, err
	}

	var result []model.FavNovelCategory
	for _, item := range *items {
		result = append(result, model.FavNovelCategory{
			No:   item.No,
			Name: item.Name,
		})
	}
	return result, nil
}

func GetFavNovelList(watcher *narou.NarouWatcher, url string) ([]model.FavNovelListRecord, error) {
	page, err := watcher.GetPage(url)
	if err != nil {
		switch err.(type) {
		case narou.LoginError:
			return nil, err
		default:
			return nil, fmt.Errorf("GetPage(%v) failed: %v", url, err)
		}
	}

	items, err := narou.ParseFavNovelList(page)
	if err != nil {
		return nil, err
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
		})
	}
	return result, nil
}

func GetIsNoticeList(watcher *narou.NarouWatcher, url string) ([]model.IsNoticeListRecord, error) {
	page, err := watcher.GetPage(url)
	if err != nil {
		switch err.(type) {
		case narou.LoginError:
			return nil, err
		default:
			return nil, fmt.Errorf("GetPage(%v) failed: %v", url, err)
		}
	}

	items, err := narou.ParseIsNoticeList(page)
	if err != nil {
		return nil, err
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
		})
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

func favNovelCategoryHandler(url string) NarouApiHandlerType {
	return func(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
		results, err := GetFavNovelCategory(watcher, url)
		if err != nil {
			return nil, err
		}
		return ReturnJson(w, results)
	}
}

func favNovelListHandler(baseUrl string, category uint, order string, page uint) NarouApiHandlerType {
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
		results, err := GetFavNovelList(watcher, u.String())
		if err != nil {
			return nil, err
		}
		return ReturnJson(w, results)
	}
}

func isNoticeListHandler(url string) NarouApiHandlerType {
	return func(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
		results, err := GetIsNoticeList(watcher, url)
		if err != nil {
			return nil, err
		}
		return ReturnJson(w, results)
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

	mux.HandleFunc("/narou/bookmarks/", func(w http.ResponseWriter, r *http.Request) {
		base := path.Clean("/narou/bookmarks")
		path := path.Clean(path.Clean(r.URL.Path)[len(base):])
		// log.Printf("bookmarks: path=%v", path)
		if path == "." {
			narouApiService.HandlerFunc(favNovelCategoryHandler(narou.FavNovelCategoryURL))(w, r)
			return
		} else {
			category, err := strconv.ParseUint(path[1:], 10, 32)
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
			// log.Printf("bookmarks: category=%v, order=%v, page=%v", category, order, page)
			narouApiService.HandlerFunc(favNovelListHandler(narou.FavNovelListURL, uint(category), order, page))(w, r)
			return
		}
	})

	mux.HandleFunc("/narou/isnoticelist", narouApiService.HandlerFunc(isNoticeListHandler(narou.IsNoticeListURL)))
	mux.HandleFunc("/r18/isnoticelist", narouApiService.HandlerFunc(isNoticeListHandler(narou.IsNoticeListR18URL)))

	mux.HandleFunc("/narou/login", narouApiService.HandlerFunc(NarouLoginHandler))
	mux.HandleFunc("/narou/logout", narouApiService.HandlerFunc(NarouLogoutHandler))

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
