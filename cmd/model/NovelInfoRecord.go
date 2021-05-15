package model

type NovelInfoRecord struct {
	Title      string   `json:"title"`
	Abstract   string   `json:"abstract"`
	AuthorName string   `json:"author_name"`
	AuthorURL  string   `json:"author_url"`
	Keywords   []string `json:"keywords"`

	BookmarkNo      *uint `json:"bookmark_no,omitempty"`
	BookmarkEpisode *uint `json:"bookmark_episode,omitempty"`
}
