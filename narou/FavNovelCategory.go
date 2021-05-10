package narou

import (
	"fmt"
	"github.com/koizuka/scraper"
)

type FavNovelCategory struct {
	No       uint   `attr:"href" re:"nowcategory=([0-9]+)"`
	Name     string `re:"(.*)\\([0-9]+\\)$"`
	NumItems uint   `re:"\\(([1-9][0-9]*)\\)$"`
}

func ParseFavNovelCategory(page *scraper.Page, wantTitle string) (*[]FavNovelCategory, error) {
	title := page.Find("title").Text()
	if title != wantTitle {
		return nil, fmt.Errorf("title mismatch: got:'%v', want:'%v'", title, wantTitle)
	}

	var parsed []FavNovelCategory
	err := scraper.Unmarshal(&parsed, page.Find("div#sub ul.category_box li a"), scraper.UnmarshalOption{})
	if err != nil {
		return nil, fmt.Errorf("unmarshal error: %v", err)
	}

	return &parsed, nil
}
