package main

import (
	"bufio"
	"fmt"
	"log"
	"github.com/koizuka/scraper"
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

func ExtractNovelURL(url string) (id string, episode uint, err error) {
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
		return id, episode, nil
	}
	return "", 0, fmt.Errorf("invalid URL: '%v'", url)
}

type EpisodeURL struct {
	NovelID string
	Episode uint
}

func (decoded *EpisodeURL) Unmarshal(s string) error {
	id, episode, err := ExtractNovelURL(s)
	if err == nil {
		decoded.NovelID = id
		decoded.Episode = episode
	}
	return err
}

type TopFavItem struct {
	NovelURL    EpisodeURL `find:"a.favnovel_hover" attr:"href"`
	Title       string     `find:"span.favnovel_title"`
	BookmarkURL EpisodeURL `find:"span.no a" attr:"href"`
	LatestURL   EpisodeURL `find:"span.favnovel_info a" attr:"href"`
}

// お気に入り新着をパース
func parseFavNovelList(session *scraper.Session, page *scraper.Page) error {
	items := page.Find("div.favnovel_list")
	for i := 0; i < items.Length(); i++ {
		item := items.Eq(i)

		var parsed TopFavItem
		err := scraper.Unmarshal(&parsed, item, scraper.UnmarshalOption{})
		if err != nil {
			return fmt.Errorf("favnovel_list %v: %v", i, err)
		}

		session.Printf("title: '%v'", parsed.Title)
		session.Printf("%v: %v/%v",
			parsed.NovelURL.NovelID,
			parsed.BookmarkURL.Episode,
			parsed.LatestURL.Episode,
		)
	}
	return nil
}

func main() {
	var logger scraper.ConsoleLogger
	session := scraper.NewSession("narou", logger)
	session.FilePrefix = "log/"
	session.SaveToFile = true
	//session.NotUseNetwork = true // replay
	//session.ShowRequestHeader = true
	//session.ShowResponseHeader = true

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
	err = session.SaveCookie()
	if err != nil {
		log.Fatalf("* SaveCookie error! %v", err)
	}

	err = parseFavNovelList(session, page)
	if err != nil {
		log.Fatalf("* parseFavNovelList error! %v", err)
	}

	// こっちから取るほうがいい?
	_, _ = session.GetPage("https://syosetu.com/favnovelmain/isnoticelist/")
}
