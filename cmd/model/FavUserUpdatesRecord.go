package model

type FavUserUpdatesRecord struct {
	R18PassiveCount int    `json:"r18passive_count"`
	BlogListHTML    string `json:"blog_list_html"`
	NovelListHTML   string `json:"novel_list_html"`
	PassiveCount    int    `json:"passive_count"`
}
