package narou

import (
	"fmt"
	"regexp"
	"strconv"
)

type EpisodeURL struct {
	SiteID  string // "ncode" or "novel18"
	NovelID string
	Episode uint
}

func ParseEpisodeURL(url string) (result EpisodeURL, err error) {
	result.SiteID = ""
	result.Episode = 0
	re := regexp.MustCompile(`(https?:)?//(ncode|novel18)\.syosetu\.com/([^/]*)/([0-9]*)`)

	found := re.FindStringSubmatch(url)
	if len(found) > 3 {
		result.SiteID = found[2]
		result.NovelID = found[3]
		if len(found) > 3 {
			parsed, err := strconv.ParseUint(found[4], 10, 32)
			if err == nil {
				result.Episode = uint(parsed)
			}
		}
		return result, nil
	}
	return result, fmt.Errorf("invalid URL: '%v'", url)
}

func (e EpisodeURL) URL() string {
	siteId := e.SiteID
	if siteId == "" {
		siteId = "ncode"
	}

	return fmt.Sprintf(
		"https://%v.syosetu.com/%v/%v/",
		siteId,
		e.NovelID,
		e.Episode,
	)
}

func (e EpisodeURL) String() string {
	return e.URL()
}

func (decoded *EpisodeURL) Unmarshal(s string) error {
	temp, err := ParseEpisodeURL(s)
	if err == nil {
		*decoded = temp
	}
	return err
}
