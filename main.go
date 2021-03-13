package main

import (
	"bufio"
	"fmt"
	"log"
	"narou-watcher/scraper"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"
)

type NovelInfo struct {
	NovelID     string
	Title       string
	LastEpisode uint
}

type NovelEpisode struct {
	NovelID    string
	Episode    uint
	LastUpdate time.Time
}

type Bookmark struct {
	NovelID string
	Episode uint
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

func ExtractNovelURL(url string) (id string, episode uint) {
	id = ""
	episode = 0
	re := regexp.MustCompile(`https?://ncode\.syosetu\.com/([^/]*)/([0-9]*)`)

	found := re.FindStringSubmatch(url)
	if len(found) > 1 {
		id = found[1]
		if len(found) > 2 {
			parsed, err := strconv.ParseUint(found[2], 10, 32)
			if err == nil {
				episode = uint(parsed)
			}
		}
	}
	return id, episode
}

func main() {
	var logger scraper.ConsoleLogger
	session := scraper.NewSession("narou", logger)
	session.FilePrefix = "log/"
	session.SaveToFile = true
	//session.NotUseNetwork = true // replay
	session.ShowRequestHeader = true
	session.ShowResponseHeader = true

	err := session.LoadCookie()
	if err != nil {
		log.Fatalf("* LoadCookie error! %v", err)
	}

	page, err := session.GetPage("https://syosetu.com/user/top/")
	if err != nil {
		log.Fatalf("* GetPage (1) error! %v", err)
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
			log.Fatalf("* Form() error! %v", err)
		}

		var prompter Prompter

		id, err := prompter.prompt("IDまたはメールアドレス")
		if err != nil {
			log.Fatalf("%v", err)
		}
		password, err := prompter.prompt("パスワード")
		if err != nil {
			log.Fatalf("%v", err)
		}

		_ = form.Set("narouid", id)
		_ = form.Set("pass", password)
		resp, err := session.Submit(form)
		if err != nil {
			log.Fatalf("* session.Submit() error! %v", err)
		}
		page, err = resp.Page()
		if err != nil {
			log.Fatalf("* resp.Page() error! %v", err)
		}

		if isLoginPage(page) {
			log.Fatalf("Login failed.")
		}
	}

	// cookie を保存
	err = session.SaveCookie() // TODO 何故か何も保存されない
	if err != nil {
		log.Fatalf("* SaveCookie error! %v", err)
	}

	// お気に入り新着をパース
	items := page.Find("div.favnovel_list")
	for i := 0; i < items.Length(); i++ {
		item := items.Eq(i)
		ch := item.Children()
		title := ch.Eq(0).Find("span.favnovel_title").Text()
		session.Printf("title: '%v'", title)
		var novel_id string
		if url, ok := ch.Eq(0).Attr("href"); ok {
			novel_id, _ = ExtractNovelURL(url)
		}

		var bookmark uint
		var latest uint

		if url, ok := ch.Find("span.no a").Eq(0).Attr("href"); ok {
			_, bookmark = ExtractNovelURL(url)
		}

		if url, ok := ch.Find("span.favnovel_info a").Eq(0).Attr("href"); ok {
			_, latest = ExtractNovelURL(url)
		}

		session.Printf("%v: %v/%v", novel_id, bookmark, latest)
	}

}
