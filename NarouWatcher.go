package main

import (
	"fmt"
	"github.com/koizuka/scraper"
	"time"
)

type Options struct {
	SessionName        string
	FilePrefix         string
	SaveToFile         bool
	NotUseNetwork      bool
	ShowRequestHeader  bool
	ShowResponseHeader bool
	GetCredentials     func() (id, password string, err error)
}

type NarouWatcher struct {
	session  *scraper.Session
	log      *scraper.BufferedLogger
	location *time.Location
	options  Options
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

	// なろうの時刻表示は日本時間
	loc, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		return nil, fmt.Errorf("LoadLocation failed: %v", err)
	}

	err = session.LoadCookie()
	if err != nil {
		return nil, fmt.Errorf("* LoadCookie error! %v", err)
	}

	return &NarouWatcher{
		session:  session,
		log:      log,
		location: loc,
		options:  opt,
	}, nil
}

func (narou *NarouWatcher) getPage(url string) (*scraper.Page, error) {
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

		id, password, err := narou.options.GetCredentials()
		if err != nil {
			return nil, fmt.Errorf("GetCredentials failed: %v", err)
		}

		_ = form.Set("narouid", id)
		_ = form.Set("pass", password)
		resp, err := narou.session.Submit(form)
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
	err = narou.session.SaveCookie()
	if err != nil {
		return nil, fmt.Errorf("SaveCookie failed: %v", err)
	}

	return page, nil
}

type IsNoticeList struct {
	SiteID          string
	NovelID         string
	Title           string
	UpdateTime      time.Time
	BookmarkEpisode uint
	LatestEpisode   uint
}

func (i *IsNoticeList) NextEpisode() EpisodeURL {
	return EpisodeURL{
		SiteID:  i.SiteID,
		NovelID: i.NovelID,
		Episode: i.BookmarkEpisode + 1,
	}
}

type IsnoticelistTitleinfo struct {
	Title      string     `find:"a.title"`
	NovelURL   EpisodeURL `find:"a.title" attr:"href"`
	AuthorName string     `find:"span.fn_name"`
}
type IsnoticelistUpdateinfo struct {
	IsNotice    string     `find:"span.isnotice"`
	UpdateTime  time.Time  `find:"td.info2 p:nth-of-type(1)" re:"([0-9]+/[0-9]+/[0-9]+ [0-9]+:[0-9]+)" time:"2006/01/02 15:04"`
	BookmarkURL EpisodeURL `find:"span.no a:nth-of-type(1)" attr:"href"`
	LatestURL   EpisodeURL `find:"span.no a:nth-of-type(2)" attr:"href"`
}
type ParsedIsNoticeList struct {
	TitleInfo  IsnoticelistTitleinfo  `find:"tr:nth-of-type(1)"`
	UpdateInfo IsnoticelistUpdateinfo `find:"tr:nth-of-type(2)"`
}

/** 更新通知チェック中一覧
 */
func (narou *NarouWatcher) GetIsNoticeList(url string) ([]IsNoticeList, error) {
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

	page, err := narou.getPage(url)
	if err != nil {
		return result, fmt.Errorf("getPage failed: %v", err)
	}

	var parsed []ParsedIsNoticeList
	err = scraper.Unmarshal(
		&parsed,
		page.Find("table.favnovel"),
		scraper.UnmarshalOption{Loc: narou.location},
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
