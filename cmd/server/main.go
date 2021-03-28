package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"narou-watcher/cmd/model"
	"narou-watcher/narou"
	"net/http"
	"os"
	"strings"
)

type NarouWatcherService struct {
	session *narou.NarouWatcher
}

type Prompter struct {
	reader *bufio.Reader
}

func (prompter *Prompter) prompt(prompt string) (string, error) {
	fmt.Printf("%s: ", prompt)
	if prompter.reader == nil {
		prompter.reader = bufio.NewReader(os.Stdin)
	}
	line, err := prompter.reader.ReadString('\n')
	// fmt.Println(line)
	if err == nil {
		line = strings.TrimSuffix(line, "\n")
		line = strings.TrimSuffix(line, "\r")
	}
	return line, err
}

func NewNarouWatcherService() NarouWatcherService {

	getLoginInfo := func() (*narou.Credentials, error) {
		var prompter Prompter

		id, err := prompter.prompt("IDまたはメールアドレス")
		if err != nil {
			return nil, fmt.Errorf("prompt for id error: %v", err)
		}
		password, err := prompter.prompt("パスワード")
		if err != nil {
			return nil, fmt.Errorf("prompt for password error: %v", err)
		}
		return &narou.Credentials{Id: id, Password: password}, nil
	}

	session, err := narou.NewNarouWatcher(narou.Options{
		SessionName:    "narou",
		FilePrefix:     "log/",
		GetCredentials: getLoginInfo,
	})
	if err != nil {
		log.Fatal(err)
	}

	return NarouWatcherService{
		session: session,
	}
}

func (service *NarouWatcherService) GetIsNoticeList(url string) ([]model.IsNoticeListRecord, error) {
	page, err := service.session.GetPage(url)
	if err != nil {
		return nil, fmt.Errorf("GetPage(%v) failed: %v", url, err)
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
		})
	}
	return result, nil
}

func main() {
	const ListenPort = 7676

	service := NewNarouWatcherService()

	handler := func(w http.ResponseWriter, r *http.Request, url string) {
		results, err := service.GetIsNoticeList(url)
		if err != nil {
			w.WriteHeader(503)
			return
		}

		bin, err := json.Marshal(results)
		if err != nil {
			w.WriteHeader(503)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write(bin)
	}

	http.HandleFunc("/narou/isnoticelist", func(w http.ResponseWriter, r *http.Request) {
		handler(w, r, narou.IsNoticeListURL)
	})
	http.HandleFunc("/r18/isnoticelist", func(w http.ResponseWriter, r *http.Request) {
		handler(w, r, narou.IsNoticeListR18URL)
	})
	fmt.Printf("Listening port %v...\n", ListenPort)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%v", ListenPort), nil))
}
