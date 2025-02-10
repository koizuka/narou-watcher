package model

import "time"

type FavNovelListRecord struct {
	BaseURL         string    `json:"base_url"`
	UpdateTime      time.Time `json:"update_time"`
	BookmarkEpisode uint      `json:"bookmark"`
	LatestEpisode   uint      `json:"latest"`
	Title           string    `json:"title"`
	AuthorName      string    `json:"author_name"`
	IsNotice        bool      `json:"is_notice,omitempty"`
	Completed       bool      `json:"completed,omitempty"`
	IsShort         bool      `json:"is_short,omitempty"`
	Memo            string    `json:"memo,omitempty"`
}
