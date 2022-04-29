package model

import "time"

type NovelInfoEpisode struct {
	SubTitle string     `json:"subtitle"`
	No       uint       `json:"no"`
	Date     time.Time  `json:"date"`
	Update   *time.Time `json:"update,omitempty"`
}

type NovelInfoChapter struct {
	Chapter  string             `json:"chapter,omitempty"`
	Episodes []NovelInfoEpisode `json:"episodes"`
}

type NovelInfoRecord struct {
	BaseURL    string   `json:"base_url"`
	Title      string   `json:"title"`
	Abstract   string   `json:"abstract"`
	AuthorName string   `json:"author_name"`
	AuthorURL  string   `json:"author_url"`
	Keywords   []string `json:"keywords"`

	BookmarkURL     *string `json:"bookmark_url,omitempty"`
	BookmarkNo      *uint   `json:"bookmark_no,omitempty"`
	BookmarkEpisode *uint   `json:"bookmark_episode,omitempty"`

	Contents []NovelInfoChapter `json:"contents"`
}
