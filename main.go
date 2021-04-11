package main

import (
	"context"
	"encoding/json"
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
	"strings"
	"syscall"
	"time"
)

type NarouWatcherService struct {
	session     *narou.NarouWatcher
	credentials *narou.Credentials
}

func (service *NarouWatcherService) SetCredentials(id, password string) {
	service.credentials.Id = id
	service.credentials.Password = password
}

func NewNarouWatcherService(logDir string, sessionName string) NarouWatcherService {
	credentials := &narou.Credentials{}

	getLoginInfo := func() (*narou.Credentials, error) {
		log.Print("LOGIN REQUIRED")
		if credentials.Id == "" || credentials.Password == "" {
			return nil, nil
		} else {
			return credentials, nil
		}
	}

	session, err := narou.NewNarouWatcher(narou.Options{
		SessionName:         sessionName,
		FilePrefix:          logDir,
		GetCredentials:      getLoginInfo,
		NotSaveCookieToFile: true,
	})
	if err != nil {
		log.Fatal(err)
	}

	return NarouWatcherService{
		session:     session,
		credentials: credentials,
	}
}

func (service *NarouWatcherService) GetIsNoticeList(url string) ([]model.IsNoticeListRecord, error) {
	page, err := service.session.GetPage(url)
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

func getProjectDirectory() string {
	out, err := exec.Command("git", "rev-parse", "--show-toplevel").Output()
	if err != nil {
		log.Fatalf("git failed: %v", err)
	}
	return strings.TrimSpace(string(out))
}

func main() {
	const ListenPort = 7676

	projectDir := getProjectDirectory()
	fmt.Printf("project directory: '%v'\n", projectDir)

	logDir := path.Join(projectDir, "log")
	fmt.Printf("log directory: '%v'\n", logDir)

	sessionName := "narou"
	fmt.Printf("session name: '%v'\n", sessionName)

	dirName := path.Join(logDir, sessionName)
	if _, err := os.Stat(dirName); os.IsNotExist(err) {
		fmt.Printf("creating directory: %v¥n", dirName)
		err = os.Mkdir(dirName, 0700)
		if err != nil {
			log.Fatalf("Mkdir failed: %v", err)
		}
	}

	type NarouApiHandlerType = func(w http.Header, service *NarouWatcherService) ([]byte, error)

	isNoticeListHandler := func(url string) NarouApiHandlerType {
		return func(w http.Header, service *NarouWatcherService) ([]byte, error) {
			results, err := service.GetIsNoticeList(url)
			if err != nil {
				return nil, err
			}

			bin, err := json.Marshal(results)
			if err != nil {
				return nil, err
			}

			w.Set("Content-Type", "application/json")
			return bin, nil
		}
	}

	NarouPrefix := "narou-"
	narouUrl, _ := url.Parse("https://syosetu.com")

	narouApiHandler := func(w http.ResponseWriter, r *http.Request, handler NarouApiHandlerType) {
		service := NewNarouWatcherService(logDir+"/", sessionName)

		if id, password, ok := r.BasicAuth(); ok {
			service.SetCredentials(id, password)
		}

		// リクエストのcookieを session に中継
		var cookies []*http.Cookie
		for _, cookie := range r.Cookies() {
			if strings.HasPrefix(cookie.Name, NarouPrefix) {
				cookies = append(cookies, &http.Cookie{Name: cookie.Name[len(NarouPrefix):], Value: cookie.Value})
			}
		}
		service.session.SetCookies(narouUrl, cookies)

		body, err := handler(w.Header(), &service)
		if err != nil {
			switch err.(type) {
			case narou.LoginError:
				w.Header().Add("WWW-Authenticate", `Basic realm="小説家になろうのログイン情報"`)
				http.Error(w, "Unauthorized", 401)
			default:
				log.Printf("%v %v: error %v: %v", r.Method, r.URL, 503, err)
				http.Error(w, fmt.Sprintf("Internal Server Error: %v", err), 503)
			}
			return
		}

		// session で設定されたcookieを返却する
		for _, cookie := range service.session.Cookies(narouUrl) {
			http.SetCookie(w, &http.Cookie{Name: NarouPrefix + cookie.Name, Value: cookie.Value})
		}

		_, _ = w.Write(body)
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/narou/isnoticelist", func(w http.ResponseWriter, r *http.Request) {
		narouApiHandler(w, r, isNoticeListHandler(narou.IsNoticeListURL))
	})
	mux.HandleFunc("/r18/isnoticelist", func(w http.ResponseWriter, r *http.Request) {
		narouApiHandler(w, r, isNoticeListHandler(narou.IsNoticeListR18URL))
	})

	remote, err := url.Parse("https://koizuka.github.io/narou-watcher/")
	if err != nil {
		log.Fatalf("proxy URL parse error: %v", err)
	}

	proxy := NewReverseProxyReplacingHost(remote)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		proxy.ServeHTTP(w, r)
	})

	fmt.Printf("Listening port %v...\n", ListenPort)
	l, err := net.Listen("tcp", fmt.Sprintf(":%v", ListenPort))
	if err != nil {
		log.Fatalf("Listen Error: %v", err)
	}

	host := fmt.Sprintf("http://localhost:%v", ListenPort)
	openAddress, err := url.Parse(host)
	if err != nil {
		log.Fatalf("URL Parse error: '%v' -> %v", host, err)
	}
	openAddress.RawQuery = url.Values{"server": {host}}.Encode()

	fmt.Printf("open in browser: %v\n", openAddress)
	_ = open.Run(openAddress.String())

	srv := &http.Server{Handler: cors.Default().Handler(mux)}

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
