package narou

import (
	"fmt"
	"github.com/koizuka/scraper"
	"time"
)

const (
	FavNovelListURL      = "https://syosetu.com/favnovelmain/list/"
	FavNovelListTitle    = "ブックマーク | ユーザページ | 小説家になろう"
	IsNoticeListTitle    = "更新チェック中のブックマーク | ユーザページ | 小説家になろう"
	FavNovelListR18URL   = "https://syosetu.com/favnovelmain18/list/"
	IsNoticeListR18Title = "更新チェック中のXブックマーク | Xユーザページ | 小説家になろう"

	FavNovelListR18Title = "Xブックマーク | Xユーザページ | 小説家になろう"
)

type FavNovelList struct {
	SiteID          string
	NovelID         string
	Title           string
	IsShort         bool
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

type ParsedFavNovelList struct {
	// <li class="c-up-dropdown__item c-up-dropdown__item--delete js-delete_bookmark_confirm" data-remodal-target="delete-bookmark" data-useridfavncode="870350_2244062" data-title="title1"><a href="JavaScript:void(0);">登録解除</a></li>
	Title      string  `find:"li.c-up-dropdown__item--delete" attr:"data-title"`
	ShortLabel *string `find:"span.c-up-label--novel-short"`
	// <div class="p-up-bookmark-item__title">
	// <a href="https://ncode.syosetu.com/novel1/"><span class="c-up-label c-up-label--novel-long">連載</span>&nbsp;title1
	NovelURL EpisodeURL `find:"div.p-up-bookmark-item__title a" attr:"href"`
	// <div class="p-up-bookmark-item__author"><a href="https://mypage.syosetu.com/author1id">author1</a></div>
	AuthorName string `find:"div.p-up-bookmark-item__data a"`
	// <span class="p-up-bookmark-item__notice" title="更新通知ON"></span>
	IsNotice *string `find:"span.p-up-bookmark-item__notice"`
	// <span class="p-up-bookmark-item__date">最新掲載日：2024年03月14日 12時00分</span>
	UpdateTime      time.Time `find:"span.p-up-bookmark-item__date" re:"([0-9]+年[0-9]+月[0-9]+日 [0-9]+時[0-9]+分)" time:"2006年01月02日 15時04分"`
	BookmarkEpisode *uint     `find:"div.p-up-bookmark-item__button-group a:first-of-type" re:"ep.([0-9]+)"`
	LastEpisode     *uint     `find:"span.p-up-bookmark-item__data-item" re:"全([0-9]+)エピソード"`
	Completed       *string   `find:"span.p-up-bookmark-item__complete"`
	Memo            *string   `find:"div.c-up-memo" re:"^\\s*(\\S*(?:\\s+\\S+)*)"`
}

type ParsedFavNovelListPage struct {
	// <div class="c-up-hit-number"><span class="c-up-hit-number__item">
	// 全187件中</span><span class="c-up-hit-number__item">1件目～50件目を表示</span>
	NumItems uint `find:"span.c-up-hit-number__item" re:"全([0-9]+)件中"`
	// <a href="index.php?p=2" class="c-pager__item" title="次のページ">次へ <span class='p-icon p-icon--angle-right' aria-hidden='true'></span></a>
	NextPageLink []string `find:"a[title='次のページ']" attr:"href"`
	// <li class="c-up-panel__list-item p-up-bookmark-item">
	Items []ParsedFavNovelList `find:"li.p-up-bookmark-item"`
}

type FavNovelListPage struct {
	NumItems     uint
	NextPageLink string
	Items        []FavNovelList
}

// ParseFavNovelList parses /favnovelmain/list page and returns []FavNovelList
func ParseFavNovelList(page *scraper.Page, wantTitle string) (*FavNovelListPage, error) {
	title := page.Find("title").Text()
	if title != wantTitle {
		return nil, TitleMismatchError{title, wantTitle}
	}
	result := &FavNovelListPage{}

	var parsed ParsedFavNovelListPage
	err := scraper.Unmarshal(
		&parsed,
		page.Find("body"),
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
		var memo string
		if item.Memo != nil {
			memo = *item.Memo
		}
		isShort := item.ShortLabel != nil
		var bookmarkEpisode uint
		var latestEpisode uint
		if item.BookmarkEpisode != nil {
			bookmarkEpisode = *item.BookmarkEpisode
		}
		if item.LastEpisode != nil && !isShort {
			latestEpisode = *item.LastEpisode
		}

		result.Items = append(result.Items, FavNovelList{
			Title:           item.Title,
			IsShort:         isShort,
			SiteID:          item.NovelURL.SiteID,
			NovelID:         item.NovelURL.NovelID,
			AuthorName:      item.AuthorName,
			UpdateTime:      item.UpdateTime,
			BookmarkEpisode: bookmarkEpisode,
			LatestEpisode:   latestEpisode,
			IsNotice:        item.IsNotice != nil,
			Completed:       item.Completed != nil,
			Memo:            memo,
		})
	}

	return result, nil
}
