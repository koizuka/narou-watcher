package main

import (
	"fmt"
	"github.com/koizuka/scraper"
	"time"
)

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

/** 更新通知チェック中一覧の先頭ページの内容を返す
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
