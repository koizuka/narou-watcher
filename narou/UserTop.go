package narou

import (
	"fmt"
	"github.com/koizuka/scraper"
)

const (
	UserTopURL = "https://syosetu.com/user/top/"
)

type LogoutInfo struct {
	URL   string `attr:"href"`
	Token string `attr:"data-token"`
}

type UserTopInfo struct {
	Logout LogoutInfo `find:"div#header a#logout"`
}

func ParseUserTop(page *scraper.Page) (*UserTopInfo, error) {
	const wantTitle = "ホーム｜ユーザページ"
	title := page.Find("title").Text()
	if title != wantTitle {
		return nil, fmt.Errorf("title mismatch: got:'%v', want:'%v'", title, wantTitle)
	}

	var userTopInfo UserTopInfo
	err := scraper.Unmarshal(&userTopInfo, page.Find("body"), scraper.UnmarshalOption{})
	if err != nil {
		return nil, fmt.Errorf("unmarshal failed: %v", err)
	}

	return &userTopInfo, nil
}
