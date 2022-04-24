package narou

import (
	"encoding/json"
	"fmt"
)

const (
	UserTopApiURL = "https://api.syosetu.com/async/usertop/"
)

type UserTopApiResult struct {
	R18PassiveCount int    `json:"favuser18passivecnt"`
	BlogListHTML    string `json:"favuserblogList"`
	NovelListHTML   string `json:"favusernovelList"`
	PassiveCount    int    `json:"favuserpassivecnt"`
}

func ParseUserTopApiJson(JSON string) (*UserTopApiResult, error) {
	var info UserTopApiResult
	err := json.Unmarshal([]byte(JSON), &info)
	if err != nil {
		return nil, fmt.Errorf("ParseFavuserUpdatesJson: json.Unmarshal error %v", err)
	}
	return &info, nil
}
