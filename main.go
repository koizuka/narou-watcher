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

func ExtractNovelURL(url string) (site string, id string, episode uint, err error) {
	id = ""
	episode = 0
	re := regexp.MustCompile(`https?://(ncode|novel18)\.syosetu\.com/([^/]*)/([0-9]*)`)

	found := re.FindStringSubmatch(url)
	if len(found) > 2 {
		site = found[1]
		id = found[2]
		if len(found) > 2 {
			parsed, err := strconv.ParseUint(found[3], 10, 32)
			if err == nil {
				episode = uint(parsed)
			}
		}
		return site, id, episode, nil
	}
	return "", "", 0, fmt.Errorf("invalid URL: '%v'", url)
}

type EpisodeURL struct {
	SiteID  string // "ncode" or "novel18"
	NovelID string
	Episode uint
}

func (decoded *EpisodeURL) Unmarshal(s string) error {
	site, id, episode, err := ExtractNovelURL(s)
	if err == nil {
		decoded.SiteID = site
		decoded.NovelID = id
		decoded.Episode = episode
	}
	return err
}

type IsNoticeList struct {
	SiteID          string
	NovelID         string
	Title           string
	UpdateTime      time.Time
	BookmarkEpisode uint
	LatestEpisode   uint
}

type IsNoticeList_TitleInfo struct {
	Title      string     `find:"a.title"`
	NovelURL   EpisodeURL `find:"a.title" attr:"href"`
	AuthorName string     `find:"span.fn_name"`
}
type IsNoticeList_UpdateInfo struct {
	IsNotice    string     `find:"span.isnotice"`
	UpdateTime  time.Time  `find:"td.info2 p:nth-of-type(1)" re:"([0-9]+/[0-9]+/[0-9]+ [0-9]+:[0-9]+)" time:"2006/01/02 15:04"`
	BookmarkURL EpisodeURL `find:"span.no a:nth-of-type(1)" attr:"href"`
	LatestURL   EpisodeURL `find:"span.no a:nth-of-type(2)" attr:"href"`
}
type ParsedIsNoticeList struct {
	TitleInfo  IsNoticeList_TitleInfo  `find:"tr:nth-of-type(1)"`
	UpdateInfo IsNoticeList_UpdateInfo `find:"tr:nth-of-type(2)"`
}

// 更新通知チェック中一覧
func getIsNoticeList(session *scraper.Session, url string, loc *time.Location) ([]IsNoticeList, error) {
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
	var result []IsNoticeList

	page, err := getNarouPage(session, url)
	if err != nil {
		return result, fmt.Errorf("getNarouPage failed: %v", err)
	}

	var parsed []ParsedIsNoticeList
	err = scraper.Unmarshal(
		&parsed,
		page.Find("table.favnovel"),
		scraper.UnmarshalOption{Loc: loc},
	)
	if err != nil {
		return result, fmt.Errorf("unmarshal failed: %v", err)
	}

	for _, item := range parsed {
		titleInfo := item.TitleInfo
		updateInfo := item.UpdateInfo

		result = append(result, IsNoticeList{
			Title:           titleInfo.Title,
			SiteID:          titleInfo.NovelURL.SiteID,
			NovelID:         titleInfo.NovelURL.NovelID,
			UpdateTime:      updateInfo.UpdateTime,
			BookmarkEpisode: updateInfo.BookmarkURL.Episode,
			LatestEpisode:   updateInfo.LatestURL.Episode,
		})
	}

	return result, nil
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
			return nil, fmt.Errorf("login form not found: %v", err)
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
			return nil, fmt.Errorf("session.Submit() failed: %v", err)
		}
		page, err = resp.Page()
		if err != nil {
			return nil, fmt.Errorf("resp.Page() failed: %v", err)
		}

		if isLoginPage(page) {
			return nil, fmt.Errorf("login failed")
		}
	}

	// cookie を保存
	err = session.SaveCookie()
	if err != nil {
		return nil, fmt.Errorf("SaveCookie failed: %v", err)
	}

	return page, nil
}

type BookmarkTypes struct {
	Name            string
	SiteID          string
	IsNoticeListURL string
}

func main() {
	var logger scraper.ConsoleLogger
	session := scraper.NewSession("narou", logger)
	session.FilePrefix = "log/"
	// session.SaveToFile = true
	//session.NotUseNetwork = true // replay
	//session.ShowRequestHeader = true
	//session.ShowResponseHeader = true

	loc := time.Local

	err := session.LoadCookie()
	if err != nil {
		log.Fatalf("* LoadCookie error! %v", err)
	}

	bookmarks := []BookmarkTypes{
		{"小説化になろう", "ncode", "https://syosetu.com/favnovelmain/isnoticelist/"},
		{"小説化になろう(R18)", "novel18", "https://syosetu.com/favnovelmain18/isnoticelist/"},
	}

	for _, bookmark := range bookmarks {
		session.Printf("")
		session.Printf("%v(%v)", bookmark.Name, bookmark.SiteID)
		session.Printf("")

		items, err := getIsNoticeList(session, bookmark.IsNoticeListURL, loc)
		if err != nil {
			log.Fatalf("* parseIsNoticeList error! %v", err)
		}

		for _, item := range items {
			if item.BookmarkEpisode == item.LatestEpisode {
				continue
			}

			session.Printf("%v: %v %v/%v(未読%v) '%v'",
				item.NovelID,
				item.UpdateTime.Format("2006/01/02 15:04"),
				item.BookmarkEpisode,
				item.LatestEpisode,
				item.LatestEpisode-item.BookmarkEpisode,
				item.Title,
			)
		}
	}
}
