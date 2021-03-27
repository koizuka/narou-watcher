package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/koizuka/scraper"
	"github.com/skratchdot/open-golang/open"
)

const (
	maxOpen          = 2                   // この数まで一度に最大でブラウザを開く
	durationToIgnore = 30 * 24 * time.Hour // 30日以上前の更新作品は無視する
)

type Prompter struct {
	reader *bufio.Reader
}

func (prompter *Prompter) prompt(prompt string) (string, error) {
	fmt.Printf("%s: ", prompt)
	if prompter.reader == nil {
		prompter.reader = bufio.NewReader(os.Stdin)
	}
	line, err := prompter.reader.ReadString('\n')
	// fmt.Println(line)
	if err == nil {
		line = strings.TrimSuffix(line, "\n")
		line = strings.TrimSuffix(line, "\r")
	}
	return line, err
}

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

func filterUpdates(from []IsNoticeList) []IsNoticeList {
	var result []IsNoticeList
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
		{"小説化になろう", IsNoticeListURL},
		{"小説化になろう(R18)", IsNoticeListR18URL},
	}

	getLoginInfo := func() (id, password string, err error) {
		var prompter Prompter

		id, err = prompter.prompt("IDまたはメールアドレス")
		if err != nil {
			return "", "", fmt.Errorf("prompt for id error: %v", err)
		}
		password, err = prompter.prompt("パスワード")
		if err != nil {
			return "", "", fmt.Errorf("prompt for password error: %v", err)
		}
		return id, password, nil
	}

	narou, err := NewNarouWatcher(Options{
		SessionName:    "narou",
		FilePrefix:     "log/",
		GetCredentials: getLoginInfo,
	})
	if err != nil {
		narou.Flush(&logger)
		log.Fatal(err)
	}

	openCount := 0

	for _, site := range sites {
		page, err := narou.GetPage(site.IsNoticeListURL)
		if err != nil {
			log.Fatalf("GetPage(%v) failed: %v", site.IsNoticeListURL, err)
		}

		results, err := ParseIsNoticeList(page)
		if err != nil {
			narou.Flush(&logger)
			log.Fatal(err)
		}

		updates := filterUpdates(results)
		if len(updates) == 0 {
			continue
		}

		logger.Printf("\n")
		logger.Printf("%v\n", site.Name)
		logger.Printf("\n")

		for _, item := range updates {
			logger.Printf("%v: %v(%v) %v/%v(未読%v) '%v'\n",
				item.NovelID,
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
				open.Run(item.NextEpisode().URL())
			}
		}
		logger.Printf("%v items.\n", len(updates))
	}
}
