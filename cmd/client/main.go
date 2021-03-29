package main

import (
	"encoding/json"
	"fmt"
	"github.com/koizuka/scraper"
	"github.com/skratchdot/open-golang/open"
	"log"
	"narou-watcher/cmd/model"
	"net/http"
	"time"
)

const (
	maxOpen          = 2                   // この数まで一度に最大でブラウザを開く
	durationToIgnore = 30 * 24 * time.Hour // 30日以上前の更新作品は無視する
)

type DurationUnit struct {
	Name string
	Unit time.Duration
}

func FormatDuration(d time.Duration) string {
	result := ""

	units := []DurationUnit{
		{"d", 24 * time.Hour},
		{"h", time.Hour},
		{"m", time.Minute},
	}

	for _, u := range units {
		if d >= u.Unit {
			result = result + fmt.Sprintf("%d%s", d/u.Unit, u.Name)
			d = d % u.Unit
		}
	}

	return result
}

func filterUpdates(from []model.IsNoticeListRecord) []model.IsNoticeListRecord {
	var result []model.IsNoticeListRecord
	for _, item := range from {
		if item.BookmarkEpisode == item.LatestEpisode {
			continue
		}
		if time.Since(item.UpdateTime) >= durationToIgnore {
			continue
		}
		result = append(result, item)
	}
	return result
}

func main() {
	var console scraper.ConsoleLogger
	logger := scraper.BufferedLogger{}
	defer logger.Flush(console)

	type Site struct {
		Name            string
		IsNoticeListURL string
	}
	sites := []Site{
		{"小説家になろう", "http://localhost:7676/narou/isnoticelist"},
		{"小説家になろう(R18)", "http://localhost:7676/r18/isnoticelist"},
	}

	openCount := 0

	for _, site := range sites {
		resp, err := http.Get(site.IsNoticeListURL)
		if err != nil {
			log.Fatalf("GetPage(%v) failed: %v", site.IsNoticeListURL, err)
		}

		if resp.StatusCode != 200 {
			log.Fatalf("Status %v", resp.Status)
		}

		decoder := json.NewDecoder(resp.Body)

		var results []model.IsNoticeListRecord
		err = decoder.Decode(&results)
		if err != nil {
			log.Fatalf("invalid JSON: %v", err)
		}

		updates := filterUpdates(results)
		if len(updates) == 0 {
			continue
		}

		logger.Printf("\n")
		logger.Printf("%v\n", site.Name)
		logger.Printf("\n")

		for _, item := range updates {
			logger.Printf("%v(%v) %v/%v(未読%v) '%v'\n",
				item.UpdateTime.Format("2006/01/02 15:04"),
				FormatDuration(time.Since(item.UpdateTime)),
				item.BookmarkEpisode,
				item.LatestEpisode,
				item.LatestEpisode-item.BookmarkEpisode,
				item.Title,
			)
			logger.Printf(" -> %v\n", item.NextEpisode())
			if openCount < maxOpen && item.NextEpisode().Episode <= item.LatestEpisode {
				openCount++
				_ = open.Run(item.NextEpisode().URL())
			}
		}
		logger.Printf("%v items.\n", len(updates))
	}
}
