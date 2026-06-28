package narou

import (
	"fmt"
	"regexp"

	"github.com/koizuka/scraper"
)

const (
	UserTopURL = "https://syosetu.com/user/top/"
)

type UserTopInfo struct {
	// Token はユーザートップのインラインスクリプトに埋め込まれた
	// async API 用トークン。
	Token string
	// LogoutURL はログアウトリンクの URL。
	LogoutURL string
}

// usertopTokenRe はユーザートップページのインラインスクリプトに埋め込まれた
// async API URL からトークンを抽出する。
//
//	var usertop_url = "https://api.syosetu.com/async/usertop/?token=XXXX";
//
// 旧デザインでは a#logout の data-token 属性にトークンがあったが、
// 現行デザインではこのスクリプト変数に移動している。
var usertopTokenRe = regexp.MustCompile(`usertop_url\s*=\s*"[^"]*[?&]token=([^"&]+)`)

func ParseUserTop(page *scraper.Page) (*UserTopInfo, error) {
	const wantTitle = "ユーザホーム | ユーザページ | 小説家になろう"
	title := page.Find("title").Text()
	if title != wantTitle {
		return nil, TitleMismatchError{title, wantTitle}
	}

	m := usertopTokenRe.FindStringSubmatch(page.Find("script").Text())
	if len(m) < 2 {
		return nil, fmt.Errorf("ParseUserTop: token not found in usertop_url script")
	}

	logoutURL, ok := page.Find("a[href*='/login/logout/']").Attr("href")
	if !ok {
		return nil, fmt.Errorf("ParseUserTop: logout link not found")
	}

	return &UserTopInfo{Token: m[1], LogoutURL: logoutURL}, nil
}
