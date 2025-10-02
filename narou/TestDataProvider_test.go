package narou

import (
	"testing"
	"time"
)

func TestTestDataProvider_GetIsNoticeListPage(t *testing.T) {
	startTime := time.Date(2025, 10, 2, 20, 40, 0, 0, time.Local)
	provider := NewTestDataProvider(startTime)

	// Test first page
	page, err := provider.GetIsNoticeListPage(1)
	if err != nil {
		t.Fatalf("GetIsNoticeListPage(1) error: %v", err)
	}

	if len(page.Items) != 10 {
		t.Errorf("Expected 10 items, got %d", len(page.Items))
	}

	// Check first item has correct start time
	if !page.Items[0].UpdateTime.Equal(startTime) {
		t.Errorf("First item UpdateTime = %v, want %v", page.Items[0].UpdateTime, startTime)
	}

	// Check n0002bb has correct update time (should be startTime, not future)
	if page.Items[1].NovelID != "n0002bb" {
		t.Errorf("Second item NovelID = %v, want n0002bb", page.Items[1].NovelID)
	}
	if !page.Items[1].UpdateTime.Equal(startTime) {
		t.Errorf("n0002bb UpdateTime = %v, want %v", page.Items[1].UpdateTime, startTime)
	}

	// Test second page (should be empty)
	page2, err := provider.GetIsNoticeListPage(2)
	if err != nil {
		t.Fatalf("GetIsNoticeListPage(2) error: %v", err)
	}
	if len(page2.Items) != 0 {
		t.Errorf("Expected 0 items on page 2, got %d", len(page2.Items))
	}
}

func TestTestDataProvider_GetNovelInfo(t *testing.T) {
	startTime := time.Now()
	provider := NewTestDataProvider(startTime)

	// Test regular novel
	info, err := provider.GetNovelInfo("n0001aa")
	if err != nil {
		t.Fatalf("GetNovelInfo error: %v", err)
	}

	if info.Index == nil {
		t.Fatal("Index is nil")
	}

	if len(info.Index.Episodes) != 10 {
		t.Errorf("Expected 10 episodes, got %d", len(info.Index.Episodes))
	}

	// Test n0002bb before 1 minute elapsed (should have 10 episodes)
	info2, err := provider.GetNovelInfo("n0002bb")
	if err != nil {
		t.Fatalf("GetNovelInfo(n0002bb) error: %v", err)
	}

	if len(info2.Index.Episodes) != 10 {
		t.Errorf("Expected 10 episodes before 1 minute, got %d", len(info2.Index.Episodes))
	}

	// Test n0002bb after 1 minute elapsed (should have 11 episodes)
	providerPast := NewTestDataProvider(startTime.Add(-61 * time.Second))
	info3, err := providerPast.GetNovelInfo("n0002bb")
	if err != nil {
		t.Fatalf("GetNovelInfo(n0002bb) after 1min error: %v", err)
	}

	if len(info3.Index.Episodes) != 11 {
		t.Errorf("Expected 11 episodes after 1 minute, got %d", len(info3.Index.Episodes))
	}
}

func TestTestDataProvider_IsEpisodeAccessible(t *testing.T) {
	startTime := time.Now()
	provider := NewTestDataProvider(startTime)

	tests := []struct {
		name    string
		ncode   string
		episode uint
		wait    time.Duration
		want    bool
	}{
		{"regular episode immediately", "n0001aa", 1, 0, true},
		{"n0002bb ep11 immediately", "n0002bb", 11, 0, false},
		{"n0002bb ep11 after 1 minute", "n0002bb", 11, 61 * time.Second, true},
		{"n0002bb ep10 immediately", "n0002bb", 10, 0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.wait > 0 {
				// Create new provider with past start time
				provider = NewTestDataProvider(startTime.Add(-tt.wait))
			}
			got := provider.IsEpisodeAccessible(tt.ncode, tt.episode)
			if got != tt.want {
				t.Errorf("IsEpisodeAccessible(%s, %d) = %v, want %v", tt.ncode, tt.episode, got, tt.want)
			}
		})
	}
}

func TestTestDataProvider_GetFavNovelCategory(t *testing.T) {
	provider := NewTestDataProvider(time.Now())

	// Test regular categories
	cats := provider.GetFavNovelCategory(false)
	if len(cats) != 4 {
		t.Errorf("Expected 4 regular categories, got %d", len(cats))
	}

	// Test R18 categories
	r18Cats := provider.GetFavNovelCategory(true)
	if len(r18Cats) != 2 {
		t.Errorf("Expected 2 R18 categories, got %d", len(r18Cats))
	}
}

func TestTestDataProvider_GetFavNovelListPage(t *testing.T) {
	startTime := time.Date(2025, 10, 2, 20, 40, 0, 0, time.Local)
	provider := NewTestDataProvider(startTime)

	page, err := provider.GetFavNovelListPage(1, 1)
	if err != nil {
		t.Fatalf("GetFavNovelListPage error: %v", err)
	}

	if len(page.Items) != 5 {
		t.Errorf("Expected 5 items, got %d", len(page.Items))
	}

	// Check that n0001aa has IsNotice=true
	found := false
	for _, item := range page.Items {
		if item.NovelID == "n0001aa" {
			found = true
			if !item.IsNotice {
				t.Error("n0001aa should have IsNotice=true")
			}
			break
		}
	}
	if !found {
		t.Error("n0001aa not found in bookmark list")
	}
}

func TestTestDataProvider_GetFavUserUpdates(t *testing.T) {
	provider := NewTestDataProvider(time.Now())

	result, err := provider.GetFavUserUpdates()
	if err != nil {
		t.Fatalf("GetFavUserUpdates error: %v", err)
	}

	if result.PassiveCount != 3 {
		t.Errorf("PassiveCount = %d, want 3", result.PassiveCount)
	}

	if result.BlogListHTML == "" {
		t.Error("BlogListHTML should not be empty")
	}

	if result.NovelListHTML == "" {
		t.Error("NovelListHTML should not be empty")
	}
}
