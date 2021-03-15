package main

import (
	"bufio"
	"fmt"
	"github.com/koizuka/scraper"
	"log"
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
func getFavNovelList(session *scraper.Session) error {
	page, err := getNarouPage(session, "https://syosetu.com/user/top/")
	if err != nil {
		return fmt.Errorf("get user/top error! %v", err)
	}

	var parsed []TopFavItem
	err = scraper.Unmarshal(
		&parsed,
		page.Find("div.favnovel_list"),
		scraper.UnmarshalOption{},
	)
	if err != nil {
		return fmt.Errorf("favnovel_list: %v", err)
	}

	for _, item := range parsed {
		newMark := ""
		if item.BookmarkURL.Episode < item.LatestURL.Episode {
			newMark = "* "
		}

		session.Printf("%v'%v' (%v) %v/%v",
			newMark,
			item.Title,
			item.NovelURL.NovelID,
			item.BookmarkURL.Episode,
			item.LatestURL.Episode,
		)
	}

	return nil
}

type IsNoticeListItemOdd struct {
	Title      string     `find:"a.title"`
	NovelURL   EpisodeURL `find:"a.title" attr:"href"`
	AuthorName string     `find:"span.fn_name"`
}
type IsNoticeListItemEven struct {
	IsNotice    string     `find:"span.isnotice"`
	UpdateTime  time.Time  `find:"td.info2 p:nth-of-type(1)" re:"([0-9]+/[0-9]+/[0-9]+ [0-9]+:[0-9]+)" time:"2006/01/02 15:04"`
	BookmarkURL EpisodeURL `find:"span.no a:nth-of-type(1)" attr:"href"`
	LatestURL   EpisodeURL `find:"span.no a:nth-of-type(2)" attr:"href"`
}

func getIsNoticeList(session *scraper.Session) error {
	//
	// table.favnovel
	//   tr
	//     td.kyokyo1[@rowspan=2]
	//     td.title2
	//       a.title[@href=<link>] タイトル
	//       span.fn_name 著者名
	//   tr
	//     td.info2
	//       p
	//         span.isnotice チェック中
	//         更新日：2021/03/13 13:50
	//         span.no
	//           a[@href=リンク]
	//             img[src=アイコン画像]
	//             &nbps;207部分
	//           a[@href=リンク]
	//             最新208部分
	//       p.right
	//         a[@href=リンク]
	//           設定

	page, err := getNarouPage(session, "https://syosetu.com/favnovelmain/isnoticelist/")
	if err != nil {
		log.Fatalf("* get isnoticelist error! %v", err)
	}

	var odd []IsNoticeListItemOdd
	var even []IsNoticeListItemEven
	err = scraper.Unmarshal(
		&odd,
		page.Find("table.favnovel tr:nth-of-type(odd)"),
		scraper.UnmarshalOption{},
	)
	if err != nil {
		return fmt.Errorf("favnovel_list: %v", err)
	}

	err = scraper.Unmarshal(
		&even,
		page.Find("table.favnovel tr:nth-of-type(even)"),
		scraper.UnmarshalOption{},
	)
	if err != nil {
		return fmt.Errorf("favnovel_list: %v", err)
	}

	for i, item := range even {
		newMark := ""
		if item.BookmarkURL.Episode < item.LatestURL.Episode {
			newMark = "* "
		}

		session.Printf("%v'%v' (%v) %v/%v",
			newMark,
			odd[i].Title,
			odd[i].NovelURL.NovelID,
			item.BookmarkURL.Episode,
			item.LatestURL.Episode,
		)
	}

	return nil
}

func getNarouPage(session *scraper.Session, url string) (*scraper.Page, error) {
	page, err := session.GetPage(url)
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
			return nil, fmt.Errorf("* Form() error! %v", err)
		}

		var prompter Prompter

		id, err := prompter.prompt("IDまたはメールアドレス")
		if err != nil {
			return nil, fmt.Errorf("prompt for id error: %v", err)
		}
		password, err := prompter.prompt("パスワード")
		if err != nil {
			return nil, fmt.Errorf("prompt for password error: %v", err)
		}

		_ = form.Set("narouid", id)
		_ = form.Set("pass", password)
		resp, err := session.Submit(form)
		if err != nil {
			return nil, fmt.Errorf("session.Submit() error: %v", err)
		}
		page, err = resp.Page()
		if err != nil {
			return nil, fmt.Errorf("resp.Page() error: %v", err)
		}

		if isLoginPage(page) {
			return nil, fmt.Errorf("login failed")
		}
	}

	// cookie を保存
	err = session.SaveCookie()
	if err != nil {
		return nil, fmt.Errorf("* SaveCookie error! %v", err)
	}

	return page, nil
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

	err = getFavNovelList(session)
	if err != nil {
		log.Fatalf("* parseFavNovelList error! %v", err)
	}

	// こっちから取るほうがいい?
	err = getIsNoticeList(session)
	if err != nil {
		log.Fatalf("* parseIsNoticeList error! %v", err)
	}
}
