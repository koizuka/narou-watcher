package narou

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

const (
	UserTopApiURL = "https://api.syosetu.com/async/usertop/"
)

type UserTopApiResult struct {
	R18PassiveCount int    `json:"favuser18passivecnt"`
	BlogListHTML    string `json:"favuserblogList"`
	NovelListHTML   string `json:"favusernovelList"`
	PassiveCount    int    `json:"favuserpassivecnt"`
	NewsHTML        string `json:"news"`
}

func ParseUserTopApiJson(JSON string) (*UserTopApiResult, error) {
	var info UserTopApiResult
	err := json.Unmarshal([]byte(JSON), &info)
	if err != nil {
		return nil, fmt.Errorf("ParseUserTopApiJson: json.Unmarshal error %w", err)
	}
	return &info, nil
}

// ParseUserTopNews はユーザートップの「新着通知」(news) HTML 断片から
// 通知の有無と件数を返す。
// 判定は特定の通知種別(ランクイン等)に依存せず、news が空でなければ通知ありとする。
// 件数は <div class="p-up-home-notification__item"> の数を数えるが、
// その要素が見つからない場合でも news が非空なら hasNotification は true を返す。
func ParseUserTopNews(newsHTML string) (hasNotification bool, count int) {
	if strings.TrimSpace(newsHTML) == "" {
		return false, 0
	}

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(newsHTML))
	if err == nil {
		count = doc.Find("div.p-up-home-notification__item").Length()
	}
	return true, count
}
