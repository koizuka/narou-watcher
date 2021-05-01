package narou

import (
	"fmt"
	"github.com/koizuka/scraper"
	"time"
)

const (
	IsNoticeListURL    = "https://syosetu.com/favnovelmain/isnoticelist/"
	IsNoticeListR18URL = "https://syosetu.com/favnovelmain18/isnoticelist/"
)

type IsNoticeList struct {
	SiteID          string
	NovelID         string
	Title           string
	AuthorName      string
	UpdateTime      time.Time
	BookmarkEpisode uint
	LatestEpisode   uint
	Completed       bool
}

func (i *IsNoticeList) NextEpisode() EpisodeURL {
	return EpisodeURL{
		SiteID:  i.SiteID,
		NovelID: i.NovelID,
		Episode: i.BookmarkEpisode + 1,
	}
}

type IsNoticelistTitleInfo struct {
	Title      string     `find:"a.title"`
	NovelURL   EpisodeURL `find:"a.title" attr:"href"`
	AuthorName string     `find:"span.fn_name" re:".*（(.*)）.*"`
}
type IsNoticelistUpdateInfo struct {
	UpdateTime  time.Time  `find:"td.info2 p:nth-of-type(1)" re:"([0-9]+/[0-9]+/[0-9]+ [0-9]+:[0-9]+)" time:"2006/01/02 15:04"`
	BookmarkURL EpisodeURL `find:"span.no a:nth-of-type(1)" attr:"href"`
	LatestURL   EpisodeURL `find:"span.no a:nth-of-type(2)" attr:"href"`
	Completed   *string    `find:"span.no a:last-of-type" re:"(最終)"`
}
type ParsedIsNoticeList struct {
	TitleInfo  IsNoticelistTitleInfo  `find:"tr:nth-of-type(1)"`
	UpdateInfo IsNoticelistUpdateInfo `find:"tr:nth-of-type(2)"`
}

type ParsedIsNoticeListPage struct {
	NumItems     uint                 `find:"h3.isnoticelist" re:"更新通知チェック中一覧 ([0-9]+)/[0-9]+"`
	NextPageLink *string              `find:"form div:nth-of-type(1) a[title='next page']" attr:"href"`
	Items        []ParsedIsNoticeList `find:"table.favnovel"`
}

type IsNoticeListPage struct {
	NumItems     uint
	NextPageLink string
	Items        []IsNoticeList
}

/** 更新通知チェック中一覧の先頭ページの内容を解読して返す
 * @param page 更新チェック中小説一覧ページ(IsNoticeListURL)を取得した結果を与えること
 */
func ParseIsNoticeList(page *scraper.Page) (*IsNoticeListPage, error) {
	const wantTitle = "更新通知チェック中一覧"
	title := page.Find("title").Text()
	if title != wantTitle {
		return nil, fmt.Errorf("title mismatch: got:'%v', want:'%v'", title, wantTitle)
	}
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
	//             &nbsp;207部分
	//           a[@href=リンク]
	//             最新208部分
	//       p.right
	//         a[@href=リンク]
	//           設定
	result := &IsNoticeListPage{}

	var parsed ParsedIsNoticeListPage
	err := scraper.Unmarshal(
		&parsed,
		page.Find("div#main"),
		scraper.UnmarshalOption{Loc: NarouLocation},
	)
	if err != nil {
		return result, fmt.Errorf("unmarshal failed: %v", err)
	}

	result.NumItems = parsed.NumItems
	if parsed.NextPageLink != nil {
		result.NextPageLink, err = page.ResolveLink(*parsed.NextPageLink)
		if err != nil {
			return nil, fmt.Errorf("ResolvedLink error: %v", parsed.NextPageLink)
		}
	}

	for _, item := range parsed.Items {
		titleInfo := item.TitleInfo
		updateInfo := item.UpdateInfo

		result.Items = append(result.Items, IsNoticeList{
			Title:           titleInfo.Title,
			SiteID:          titleInfo.NovelURL.SiteID,
			NovelID:         titleInfo.NovelURL.NovelID,
			AuthorName:      titleInfo.AuthorName,
			UpdateTime:      updateInfo.UpdateTime,
			BookmarkEpisode: updateInfo.BookmarkURL.Episode,
			LatestEpisode:   updateInfo.LatestURL.Episode,
			Completed:       updateInfo.Completed != nil,
		})
	}

	return result, nil
}
