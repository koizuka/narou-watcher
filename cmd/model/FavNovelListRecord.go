package model

import "time"

type FavNovelListRecord struct {
	BaseURL         string    `json:"base_url"`
	UpdateTime      time.Time `json:"update_time"`
	BookmarkEpisode uint      `json:"bookmark,omitempty"`
	LatestEpisode   uint      `json:"latest,omitempty"`
	Title           string    `json:"title"`
	AuthorName      string    `json:"author_name"`
	IsNotice        bool      `json:"is_notice,omitempty"`
	Completed       bool      `json:"completed,omitempty"`
}
