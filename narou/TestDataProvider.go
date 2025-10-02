package narou

import (
	"fmt"
	"time"
)

// TestDataProvider provides test data for development and testing
type TestDataProvider struct {
	startTime time.Time
}

// NewTestDataProvider creates a new test data provider with the given start time
func NewTestDataProvider(startTime time.Time) *TestDataProvider {
	return &TestDataProvider{
		startTime: startTime,
	}
}

// GetIsNoticeListPage returns test data for the IsNoticeList page
func (t *TestDataProvider) GetIsNoticeListPage(page uint) (*IsNoticeListPage, error) {
	if page > 1 {
		return &IsNoticeListPage{
			NumItems:     10,
			NextPageLink: "",
			Items:        []IsNoticeList{},
		}, nil
	}

	items := []IsNoticeList{
		{
			SiteID:          "ncode",
			NovelID:         "n0001aa",
			Title:           "【テスト】更新したばかりの作品",
			AuthorName:      "テスト作者A",
			UpdateTime:      t.startTime,
			BookmarkEpisode: 5,
			LatestEpisode:   6,
			Completed:       false,
		},
		{
			SiteID:          "ncode",
			NovelID:         "n0002bb",
			Title:           "【テスト】1分後に読めるようになる作品",
			AuthorName:      "テスト作者B",
			UpdateTime:      t.startTime,
			BookmarkEpisode: 10,
			LatestEpisode:   11,
			Completed:       false,
		},
		{
			SiteID:          "ncode",
			NovelID:         "n0003cc",
			Title:           "【テスト】1時間前に更新された作品",
			AuthorName:      "テスト作者C",
			UpdateTime:      t.startTime.Add(-1 * time.Hour),
			BookmarkEpisode: 20,
			LatestEpisode:   21,
			Completed:       false,
		},
		{
			SiteID:          "ncode",
			NovelID:         "n0004dd",
			Title:           "【テスト】1日前に更新された作品",
			AuthorName:      "テスト作者D",
			UpdateTime:      t.startTime.Add(-24 * time.Hour),
			BookmarkEpisode: 30,
			LatestEpisode:   32,
			Completed:       false,
		},
		{
			SiteID:          "ncode",
			NovelID:         "n0005ee",
			Title:           "【テスト】1週間前に更新された完結作品",
			AuthorName:      "テスト作者E",
			UpdateTime:      t.startTime.Add(-7 * 24 * time.Hour),
			BookmarkEpisode: 48,
			LatestEpisode:   50,
			Completed:       true,
		},
		{
			SiteID:          "ncode",
			NovelID:         "n0006ff",
			Title:           "【テスト】2週間前に更新された作品",
			AuthorName:      "テスト作者F",
			UpdateTime:      t.startTime.Add(-14 * 24 * time.Hour),
			BookmarkEpisode: 99,
			LatestEpisode:   100,
			Completed:       false,
		},
		{
			SiteID:          "ncode",
			NovelID:         "n0007gg",
			Title:           "【テスト】30分前に更新された作品（未読多数）",
			AuthorName:      "テスト作者G",
			UpdateTime:      t.startTime.Add(-30 * time.Minute),
			BookmarkEpisode: 1,
			LatestEpisode:   5,
			Completed:       false,
		},
		{
			SiteID:          "novel18",
			NovelID:         "n0008hh",
			Title:           "【テスト】R18作品（2時間前更新）",
			AuthorName:      "テスト作者H",
			UpdateTime:      t.startTime.Add(-2 * time.Hour),
			BookmarkEpisode: 15,
			LatestEpisode:   16,
			Completed:       false,
		},
		{
			SiteID:          "ncode",
			NovelID:         "n0009ii",
			Title:           "【テスト】最新話まで読了済み",
			AuthorName:      "テスト作者I",
			UpdateTime:      t.startTime.Add(-3 * 24 * time.Hour),
			BookmarkEpisode: 25,
			LatestEpisode:   25,
			Completed:       false,
		},
		{
			SiteID:          "ncode",
			NovelID:         "n0010jj",
			Title:           "【テスト】短編作品",
			AuthorName:      "テスト作者J",
			UpdateTime:      t.startTime.Add(-5 * 24 * time.Hour),
			BookmarkEpisode: 0,
			LatestEpisode:   1,
			Completed:       true,
		},
	}

	return &IsNoticeListPage{
		NumItems:     uint(len(items)),
		NextPageLink: "",
		Items:        items,
	}, nil
}

// GetFavNovelListPage returns test data for the FavNovelList page
func (t *TestDataProvider) GetFavNovelListPage(category uint, page uint) (*FavNovelListPage, error) {
	if page > 1 {
		return &FavNovelListPage{
			NumItems:     15,
			NextPageLink: "",
			Items:        []FavNovelList{},
		}, nil
	}

	items := []FavNovelList{
		{
			SiteID:          "ncode",
			NovelID:         "n0001aa",
			Title:           "【テスト】更新したばかりの作品",
			IsShort:         false,
			AuthorName:      "テスト作者A",
			UpdateTime:      t.startTime,
			BookmarkEpisode: 5,
			LatestEpisode:   6,
			IsNotice:        true,
			Completed:       false,
			Memo:            "最優先で読む",
		},
		{
			SiteID:          "ncode",
			NovelID:         "n0002bb",
			Title:           "【テスト】1分後に読めるようになる作品",
			IsShort:         false,
			AuthorName:      "テスト作者B",
			UpdateTime:      t.startTime,
			BookmarkEpisode: 10,
			LatestEpisode:   11,
			IsNotice:        true,
			Completed:       false,
			Memo:            "",
		},
		{
			SiteID:          "ncode",
			NovelID:         "n0003cc",
			Title:           "【テスト】1時間前に更新された作品",
			IsShort:         false,
			AuthorName:      "テスト作者C",
			UpdateTime:      t.startTime.Add(-1 * time.Hour),
			BookmarkEpisode: 20,
			LatestEpisode:   21,
			IsNotice:        true,
			Completed:       false,
			Memo:            "",
		},
		{
			SiteID:          "ncode",
			NovelID:         "n0011kk",
			Title:           "【テスト】更新通知オフの作品",
			IsShort:         false,
			AuthorName:      "テスト作者K",
			UpdateTime:      t.startTime.Add(-2 * 24 * time.Hour),
			BookmarkEpisode: 40,
			LatestEpisode:   42,
			IsNotice:        false,
			Completed:       false,
			Memo:            "気が向いたら読む",
		},
		{
			SiteID:          "ncode",
			NovelID:         "n0010jj",
			Title:           "【テスト】短編作品",
			IsShort:         true,
			AuthorName:      "テスト作者J",
			UpdateTime:      t.startTime.Add(-5 * 24 * time.Hour),
			BookmarkEpisode: 0,
			LatestEpisode:   0,
			IsNotice:        false,
			Completed:       true,
			Memo:            "",
		},
	}

	return &FavNovelListPage{
		NumItems:     uint(len(items)),
		NextPageLink: "",
		Items:        items,
	}, nil
}

// GetNovelInfo returns test data for novel information
func (t *TestDataProvider) GetNovelInfo(ncode string) (*NovelInfo, error) {
	// Simulate the "just updated" novel with episodes becoming available after 1 minute
	elapsedTime := time.Since(t.startTime)

	var episodes []SubList2
	baseTime := t.startTime.Add(-30 * 24 * time.Hour)

	// Generate 10 episodes
	for i := 1; i <= 10; i++ {
		publishTime := baseTime.Add(time.Duration(i) * 24 * time.Hour)
		updateTimeVal := publishTime

		// Episode 6 is the "just updated" one
		if i == 6 {
			publishTime = baseTime.Add(5 * 24 * time.Hour)
			updateTimeVal = t.startTime
		}

		// Episode 11 becomes available after 1 minute
		if ncode == "n0002bb" && i == 10 {
			publishTime = baseTime.Add(9 * 24 * time.Hour)
			updateTimeVal = t.startTime.Add(1 * time.Minute)
		}

		episodes = append(episodes, SubList2{
			SubTitle:    fmt.Sprintf("第%d話：テストエピソード", i),
			Link:        fmt.Sprintf("https://ncode.syosetu.com/%s/%d/", ncode, i),
			No:          uint(i),
			PublishTime: publishTime,
			UpdateTime:  &updateTimeVal,
		})
	}

	// For n0002bb, add episode 11 only if 1 minute has elapsed
	if ncode == "n0002bb" && elapsedTime >= 1*time.Minute {
		updateTimeVal := t.startTime.Add(1 * time.Minute)
		episodes = append(episodes, SubList2{
			SubTitle:    "第11話：1分後に現れるエピソード",
			Link:        fmt.Sprintf("https://ncode.syosetu.com/%s/11/", ncode),
			No:          11,
			PublishTime: t.startTime.Add(-1 * 24 * time.Hour),
			UpdateTime:  &updateTimeVal,
		})
	}

	bookmarkURL := fmt.Sprintf("https://syosetu.com/favnovelmain/updateinput/useridfavncode/test_%s", ncode)
	bookmarkNo := uint(1)
	bookmarkEpisode := uint(5)

	return &NovelInfo{
		Title:           fmt.Sprintf("【テスト】%sの作品詳細", ncode),
		AuthorName:      "テスト作者",
		Keywords:        "テスト ファンタジー 異世界",
		Abstract:        "これはテストデータです。実際のなろう作品ではありません。",
		AuthorURL:       "https://mypage.syosetu.com/test_author/",
		BookmarkURL:     &bookmarkURL,
		BookmarkNo:      &bookmarkNo,
		BookmarkEpisode: &bookmarkEpisode,
		Index: &NovelIndex{
			ChapterHeads: []SubList2{},
			Chapters:     []string{},
			Episodes:     episodes,
		},
	}, nil
}

// IsEpisodeAccessible checks if an episode is accessible at the current time
func (t *TestDataProvider) IsEpisodeAccessible(ncode string, episode uint) bool {
	elapsedTime := time.Since(t.startTime)

	// For n0002bb episode 11, it becomes accessible after 1 minute
	if ncode == "n0002bb" && episode == 11 {
		return elapsedTime >= 1*time.Minute
	}

	// All other episodes are immediately accessible
	return true
}

// GetFavNovelCategory returns test bookmark categories
func (t *TestDataProvider) GetFavNovelCategory(r18 bool) []FavNovelCategory {
	if r18 {
		return []FavNovelCategory{
			{No: 1, Name: "R18お気に入り", NumItems: 3},
			{No: 2, Name: "R18後で読む", NumItems: 5},
		}
	}

	return []FavNovelCategory{
		{No: 1, Name: "最優先", NumItems: 5},
		{No: 2, Name: "お気に入り", NumItems: 15},
		{No: 3, Name: "後で読む", NumItems: 8},
		{No: 4, Name: "完結待ち", NumItems: 12},
	}
}

// GetFavUserUpdates returns test data for favorite user updates
func (t *TestDataProvider) GetFavUserUpdates() (*UserTopApiResult, error) {
	return &UserTopApiResult{
		PassiveCount:    3,
		R18PassiveCount: 1,
		BlogListHTML:    "<h3>活動報告</h3><ul><li><a href='#'>テスト活動報告</a> by <a href='#'>テスト作者A</a></li></ul>",
		NovelListHTML:   fmt.Sprintf("<h3>お気に入りユーザの更新</h3><div id='fanusernovel_list'><div id='fanusernovel_title'><a href='#'>更新したばかりのお気に入りユーザ作品</a></div><div id='fanusernovel_type'><div id='fanusernovel_info'>%s</div><a href='#'>テスト作者A</a></div></div>", t.startTime.Format("01月02日 15時04分")),
	}, nil
}
