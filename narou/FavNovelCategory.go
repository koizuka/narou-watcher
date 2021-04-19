package narou

import (
	"fmt"
	"github.com/koizuka/scraper"
)

type FavNovelCategory struct {
	No   uint `attr:"value"`
	Name string
}

func ParseFavNovelCategory(page *scraper.Page, wantTitle string) (*[]FavNovelCategory, error) {
	title := page.Find("title").Text()
	if title != wantTitle {
		return nil, fmt.Errorf("title mismatch: got:'%v', want:'%v'", title, wantTitle)
	}

	var parsed []FavNovelCategory
	err := scraper.Unmarshal(&parsed, page.Find("select[name=categoryid] option"), scraper.UnmarshalOption{})
	if err != nil {
		return nil, fmt.Errorf("unmarshal error: %v", err)
	}

	return &parsed, nil
}
