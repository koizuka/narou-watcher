package narou

import (
	"github.com/koizuka/scraper"
	"time"
)

type SubList2 struct {
	SubTitle string `find:"a"`
	Link     string `find:"a" attr:"href"`
	No       uint   `find:"a" attr:"href" re:"/.*/([0-9]+)/"`

	PublishTime time.Time  `find:"div.p-eplist__update" re:"([0-9]+/[0-9]+/[0-9]+ [0-9]+:[0-9]+)" time:"2006/01/02 15:04"`
	UpdateTime  *time.Time `find:"div.p-eplist__update span" attr:"title" re:"([0-9]+/[0-9]+/[0-9]+ [0-9]+:[0-9]+)" time:"2006/01/02 15:04"`
}

type NovelIndex struct {
	Chapters     []string   `find:"div.p-eplist__chapter-title"`
	ChapterHeads []SubList2 `find:"div.p-eplist__chapter-title + div.p-eplist__sublist"`
	Episodes     []SubList2 `find:"div.p-eplist__sublist"`
}

type NovelInfo struct {
	Title      string `find:"head title"`
	AuthorName string `find:"head meta[name='twitter:creator']" attr:"content"`
	Keywords   string `find:"head meta[property='og:description']" attr:"content"`

	Abstract        string      `find:"body div#novel_ex" html:""`
	AuthorURL       string      `find:"body div.p-novel__author a" attr:"href"`
	BookmarkURL     *string     `find:"body a.p-bookmark-bar__bkm-link" attr:"href"`
	BookmarkNo      *uint       `find:"body a.p-bookmark-bar__bkm-link" re:"nowcategory=([0-9]+)" attr:"href"`
	BookmarkEpisode *uint       `find:"body div.novellingindex_bookmarker_no a" attr:"href" re:"\\/[a-zA-z0-9]*\\/([0-9]+)\\/$"`
	Index           *NovelIndex `find:"body div.p-eplist"`
}

func ParseNovelInfo(page *scraper.Page) (*NovelInfo, error) {
	var parsed NovelInfo
	err := scraper.Unmarshal(&parsed, page.Selection, scraper.UnmarshalOption{Loc: NarouLocation})
	if err != nil {
		return nil, UnmarshalError{err}
	}

	return &parsed, nil
}

func IsAgeConfirmPage(page *scraper.Page) (bool, error) {
	type AgeConfirm struct {
		Confirm *string `find:"div#modal h1"`
	}
	var parsed AgeConfirm
	err := scraper.Unmarshal(&parsed, page.Selection, scraper.UnmarshalOption{})
	if err != nil {
		return false, UnmarshalError{err}
	}

	return parsed.Confirm != nil && *parsed.Confirm == "年齢確認", nil
}
