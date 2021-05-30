package narou

import (
	"fmt"
	"github.com/koizuka/scraper"
)

type NovelInfo struct {
	Title      string `find:"head title"`
	AuthorName string `find:"head meta[name='twitter:creator']" attr:"content"`
	Keywords   string `find:"head meta[property='og:description']" attr:"content"`

	Abstract        string  `find:"body div#novel_ex" html:""`
	AuthorURL       string  `find:"body div#novel_footer ul.undernavi li:nth-of-type(1) a" attr:"href"`
	BookmarkURL     *string `find:"body li.list_menu_novelview_after a" attr:"href"`
	BookmarkNo      *uint   `find:"body li.list_menu_novelview_after a" re:"nowcategory=([0-9]+)" attr:"href"`
	BookmarkEpisode *uint   `find:"body div.novellingindex_bookmarker_no a" attr:"href" re:"\\/[a-zA-z0-9]*\\/([0-9]+)\\/$"`
}

func ParseNovelInfo(page *scraper.Page) (*NovelInfo, error) {
	var parsed NovelInfo
	err := scraper.Unmarshal(&parsed, page.Selection, scraper.UnmarshalOption{})
	if err != nil {
		return nil, fmt.Errorf("unmarshal error: %v", err)
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
		return false, fmt.Errorf("unmarshal error: %v", err)
	}

	return parsed.Confirm != nil && *parsed.Confirm == "年齢確認", nil
}
