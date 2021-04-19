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
}

func (i *FavNovelList) NextEpisode() EpisodeURL {
	return EpisodeURL{
		SiteID:  i.SiteID,
		NovelID: i.NovelID,
		Episode: i.BookmarkEpisode + 1,
	}
}

type FavNovelListTitleinfo struct {
	Title      string     `find:"a.title"`
	NovelURL   EpisodeURL `find:"a.title" attr:"href"`
	AuthorName string     `find:"span.fn_name" re:".*（(.*)）.*"`
}
type FavNovelListUpdateinfo struct {
	IsNotice    *string     `find:"span.isnotice"`
	UpdateTime  time.Time   `find:"td.info p:nth-of-type(1)" re:"([0-9]+/[0-9]+/[0-9]+ [0-9]+:[0-9]+)" time:"2006/01/02 15:04"`
	BookmarkURL *EpisodeURL `find:"span.no a:nth-of-type(1)" attr:"href"`
	LatestURL   *EpisodeURL `find:"span.no a:nth-of-type(2)" attr:"href"`
}
type ParsedFavNovelList struct {
	TitleInfo  FavNovelListTitleinfo  `find:"tr:nth-of-type(1)"`
	UpdateInfo FavNovelListUpdateinfo `find:"tr:nth-of-type(2)"`
}

// ParseFavNovelList parses /favnovelmain/list page and returns []FavNovelList
func ParseFavNovelList(page *scraper.Page, wantTitle string) ([]FavNovelList, error) {
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
	var result []FavNovelList

	var parsed []ParsedFavNovelList
	err := scraper.Unmarshal(
		&parsed,
		page.Find("table.favnovel"),
		scraper.UnmarshalOption{Loc: NarouLocation},
	)
	if err != nil {
		return result, fmt.Errorf("favnovel unmarshal failed: %v", err)
	}

	for _, item := range parsed {
		titleInfo := item.TitleInfo
		updateInfo := item.UpdateInfo
		var bookmarkEpisode uint
		var latestEpisode uint
		if updateInfo.BookmarkURL != nil {
			bookmarkEpisode = updateInfo.BookmarkURL.Episode
		}
		if updateInfo.LatestURL != nil {
			latestEpisode = updateInfo.LatestURL.Episode
		}

		result = append(result, FavNovelList{
			Title:           titleInfo.Title,
			SiteID:          titleInfo.NovelURL.SiteID,
			NovelID:         titleInfo.NovelURL.NovelID,
			AuthorName:      titleInfo.AuthorName,
			UpdateTime:      updateInfo.UpdateTime,
			BookmarkEpisode: bookmarkEpisode,
			LatestEpisode:   latestEpisode,
			IsNotice:        updateInfo.IsNotice != nil,
		})
	}

	return result, nil
}
