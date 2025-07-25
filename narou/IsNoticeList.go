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

type ParsedIsNoticeList struct {
	// <div class="p-up-bookmark-item__title">
	// <a href="https://ncode.syosetu.com/作品1/"><span class="c-up-label c-up-label--novel-long">連載</span>&nbsp;タイトル1
	// Title    string     `find:"div.p-up-bookmark-item__title a"`

	// <li class="c-up-dropdown__item c-up-dropdown__item--delete js-delete_bookmark_confirm" data-remodal-target="delete-bookmark" data-useridfavncode="870350_1913052" data-title="タイトル1"><a href="JavaScript:void(0);">登録解除</a></li>
	Title string `find:"li.c-up-dropdown__item--delete" attr:"data-title"`

	NovelURL EpisodeURL `find:"div.p-up-bookmark-item__title a" attr:"href"`
	// <div class="p-up-bookmark-item__author"><a href="https://mypage.syosetu.com/作者1ID">作者1</a></div>
	AuthorName string `find:"div.p-up-bookmark-item__data a"`

	// <span class="p-up-bookmark-item__date">最新掲載日：2000年01月02日 03時04分</span>
	UpdateTime      time.Time `find:"span.p-up-bookmark-item__date" re:"([0-9]{4}年[0-9]+月[0-9]+日 [0-9]+時[0-9]+分)" time:"2006年01月02日 15時04分"`
	BookmarkEpisode *uint     `find:"div.p-up-bookmark-item__button-group a:first-of-type" re:"ep.([0-9]+)"`
	LastEpisode     *uint     `find:"span.p-up-bookmark-item__data-item" re:"全([0-9]+)エピソード"`
	Completed       *string   `find:"span.p-up-bookmark-item__complete"` // <span class="p-up-bookmark-item__complete">完結済</span>
}

type ParsedIsNoticeListPage struct {
	NumItems     uint                 `find:"div.c-up-tab + div span.c-up-hit-number__item:first-of-type" re:"全([0-9]+)件中"`
	NextPageLink []string             `find:"a[title='次のページ']" attr:"href"`
	Items        []ParsedIsNoticeList `find:"li.c-up-panel__list-item"`
}

type IsNoticeListPage struct {
	NumItems     uint
	NextPageLink string
	Items        []IsNoticeList
}

/** 更新通知チェック中一覧の先頭ページの内容を解読して返す
 * @param page 更新チェック中小説一覧ページ(IsNoticeListURL)を取得した結果を与えること
 */
func ParseIsNoticeList(page *scraper.Page, wantTitle string) (*IsNoticeListPage, error) {
	const maintenanceTitle = "メンテナンス中 | 小説家になろうグループ"
	title := page.Find("title").Text()
	if title == maintenanceTitle {
		return nil, fmt.Errorf("under maintenance")
	}
	if title != wantTitle {
		return nil, TitleMismatchError{title, wantTitle}
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
		page.Find("div.l-main"),
		scraper.UnmarshalOption{Loc: NarouLocation},
	)
	if err != nil {
		return result, UnmarshalError{err}
	}

	result.NumItems = parsed.NumItems
	if len(parsed.NextPageLink) >= 1 {
		result.NextPageLink, err = page.ResolveLink(parsed.NextPageLink[0])
		if err != nil {
			return nil, fmt.Errorf("ResolvedLink error: %v", parsed.NextPageLink)
		}
	}

	for _, item := range parsed.Items {
		var bookmarkEpisode uint
		var latestEpisode uint
		if item.BookmarkEpisode != nil {
			bookmarkEpisode = *item.BookmarkEpisode
		}
		if item.LastEpisode != nil {
			latestEpisode = *item.LastEpisode
		}

		result.Items = append(result.Items, IsNoticeList{
			Title:           item.Title,
			SiteID:          item.NovelURL.SiteID,
			NovelID:         item.NovelURL.NovelID,
			AuthorName:      item.AuthorName,
			UpdateTime:      item.UpdateTime,
			BookmarkEpisode: bookmarkEpisode,
			LatestEpisode:   latestEpisode,
			Completed:       item.Completed != nil,
		})
	}

	return result, nil
}
