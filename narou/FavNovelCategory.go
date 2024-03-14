package narou

import (
	"github.com/koizuka/scraper"
)

type FavNovelCategory struct {
	// <option value="/favnovelmain/list/?nowcategory=1&order=updated_at">カテゴリ1・未完/最新追いかけ(187)</option>
	No       uint   `attr:"value" re:"nowcategory=([0-9]+)"`
	Name     string `re:"(.*)\\([0-9]+\\)$"`
	NumItems uint   `re:"\\(([1-9][0-9]*)\\)$"`
}

func ParseFavNovelCategory(page *scraper.Page, wantTitle string) (*[]FavNovelCategory, error) {
	title := page.Find("title").Text()
	if title != wantTitle {
		return nil, TitleMismatchError{title, wantTitle}
	}

	var parsed []FavNovelCategory
	// <select class="c-form__select p-up-bookmark-category__select js-bookmark_list_form_select">
	err := scraper.Unmarshal(&parsed, page.Find("select.js-bookmark_list_form_select option"), scraper.UnmarshalOption{})
	if err != nil {
		return nil, UnmarshalError{err}
	}

	return &parsed, nil
}
