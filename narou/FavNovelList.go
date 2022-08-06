package narou

import (
	"fmt"
	"github.com/koizuka/scraper"
	"time"
)

const (
	FavNovelListURL      = "https://syosetu.com/favnovelmain/list/"
	FavNovelListTitle    = "ブックマーク"
	FavNovelListR18URL   = "https://syosetu.com/favnovelmain18/list/"
	FavNovelListR18Title = "Xブックマーク"
)

type FavNovelList struct {
	SiteID          string
	NovelID         string
	Title           string
	AuthorName      string
	UpdateTime      time.Time
	BookmarkEpisode uint
	LatestEpisode   uint
	IsNotice        bool
	Completed       bool
	Memo            string
}

func (i *FavNovelList) NextEpisode() EpisodeURL {
	return EpisodeURL{
		SiteID:  i.SiteID,
		NovelID: i.NovelID,
		Episode: i.BookmarkEpisode + 1,
	}
}

type FavNovelListTitleInfo struct {
	Title      string     `find:"a.title"`
	NovelURL   EpisodeURL `find:"a.title" attr:"href"`
	AuthorName string     `find:"span.fn_name" re:"[^（]*（(.*)）[^）]*"`
}
type FavNovelListUpdateInfo struct {
	IsNotice   *string      `find:"span.isnotice"`
	UpdateTime time.Time    `find:"p:nth-of-type(1)" re:"([0-9]+/[0-9]+/[0-9]+ [0-9]+:[0-9]+)" time:"2006/01/02 15:04"`
	ItemURL    []EpisodeURL `find:"span.no a" attr:"href"`
	Completed  *string      `find:"span.no a:last-of-type" re:"(最終)"`
}
type ParsedFavNovelList struct {
	TitleInfo  FavNovelListTitleInfo  `find:"tr:nth-of-type(1)"`
	Memo       *string                `find:"td.bkm_memo" re:"メモ(.*)"`
	UpdateInfo FavNovelListUpdateInfo `find:"td.info"`
}

type ParsedFavNovelListPage struct {
	NumItems     uint                 `find:"div#sub ul.category_box li.now a" re:".*\\(([0-9]+)\\)$"`
	TotalItems1  *uint                `find:"div#main div.nowcategory" re:"\\(全([0-9]+)件\\)"`
	TotalItems2  *uint                `find:"div#contents h2" re:"\\(全([0-9]+)件\\)"`
	NextPageLink *string              `find:"div#main form div:nth-of-type(1) a[title='next page']" attr:"href"`
	Items        []ParsedFavNovelList `find:"div#main table.favnovel"`
}

type FavNovelListPage struct {
	NumItems     uint
	TotalItems   uint
	NextPageLink string
	Items        []FavNovelList
}

// ParseFavNovelList parses /favnovelmain/list page and returns []FavNovelList
func ParseFavNovelList(page *scraper.Page, wantTitle string) (*FavNovelListPage, error) {
	title := page.Find("title").Text()
	if title != wantTitle {
		return nil, fmt.Errorf("favnobel title mismatch: got:'%v', want:'%v'", title, wantTitle)
	}
	//
	// table.favnovel
	//   tr
	//     td.kyokyo1[@rowspan=2]
	//     td.title
	//       a.title[@href=<link>] タイトル
	//       span.fn_name 著者名
	//   tr
	//     td.info
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
	result := &FavNovelListPage{}

	var parsed ParsedFavNovelListPage
	err := scraper.Unmarshal(
		&parsed,
		page.Find("body"),
		scraper.UnmarshalOption{Loc: NarouLocation},
	)
	if err != nil {
		return result, fmt.Errorf("favnovel unmarshal failed: %v", err)
	}

	result.NumItems = parsed.NumItems
	if parsed.TotalItems1 == nil && parsed.TotalItems2 == nil {
		return nil, fmt.Errorf("Total Items not found")
	}
	if parsed.TotalItems1 != nil {
		result.TotalItems = *parsed.TotalItems1
	} else {
		result.TotalItems = *parsed.TotalItems2
	}
	if parsed.NextPageLink != nil {
		result.NextPageLink, err = page.ResolveLink(*parsed.NextPageLink)
		if err != nil {
			return nil, fmt.Errorf("ResolvedLink error: %v", parsed.NextPageLink)
		}
	}

	for _, item := range parsed.Items {
		titleInfo := item.TitleInfo
		updateInfo := item.UpdateInfo
		var memo string
		if item.Memo != nil {
			memo = *item.Memo
		}
		var bookmarkEpisode uint
		var latestEpisode uint
		switch len(updateInfo.ItemURL) {
		case 1:
			latestEpisode = updateInfo.ItemURL[0].Episode
		case 2:
			bookmarkEpisode = updateInfo.ItemURL[0].Episode
			latestEpisode = updateInfo.ItemURL[1].Episode
		}

		result.Items = append(result.Items, FavNovelList{
			Title:           titleInfo.Title,
			SiteID:          titleInfo.NovelURL.SiteID,
			NovelID:         titleInfo.NovelURL.NovelID,
			AuthorName:      titleInfo.AuthorName,
			UpdateTime:      updateInfo.UpdateTime,
			BookmarkEpisode: bookmarkEpisode,
			LatestEpisode:   latestEpisode,
			IsNotice:        updateInfo.IsNotice != nil,
			Completed:       updateInfo.Completed != nil,
			Memo:            memo,
		})
	}

	return result, nil
}
