package model

import (
	"log"
	"narou-watcher/narou"
	"time"
)

type IsNoticeListRecord struct {
	BaseURL         string    `json:"base_url"`
	UpdateTime      time.Time `json:"update_time"`
	BookmarkEpisode uint      `json:"bookmark"`
	LatestEpisode   uint      `json:"latest"`
	Title           string    `json:"title"`
	AuthorName      string    `json:"author_name"`
}

func (rec *IsNoticeListRecord) NextEpisode() narou.EpisodeURL {
	episode, err := narou.ParseEpisodeURL(rec.BaseURL)
	if err != nil {
		log.Fatalf("parseEpisodeURl failed: '%v'", rec.BaseURL)
	}
	episode.Episode = rec.BookmarkEpisode + 1
	return episode
}
