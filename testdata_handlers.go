package main

import (
	"fmt"
	"narou-watcher/cmd/model"
	"narou-watcher/narou"
	"net/http"
	"strings"
)

// testDataIsNoticeListHandler returns test data for the IsNoticeList endpoint
func testDataIsNoticeListHandler(provider *narou.TestDataProvider) NarouApiHandlerType {
	return func(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
		page, err := provider.GetIsNoticeListPage(1)
		if err != nil {
			return nil, err
		}

		var result []model.IsNoticeListRecord
		for _, item := range page.Items {
			result = append(result, model.IsNoticeListRecord{
				BaseURL:         fmt.Sprintf("https://%v.syosetu.com/%v/", item.SiteID, item.NovelID),
				UpdateTime:      item.UpdateTime,
				BookmarkEpisode: item.BookmarkEpisode,
				LatestEpisode:   item.LatestEpisode,
				Title:           item.Title,
				AuthorName:      item.AuthorName,
				Completed:       item.Completed,
			})
		}
		return ReturnJson(w, result)
	}
}

// testDataFavNovelCategoryHandler returns test data for bookmark categories
func testDataFavNovelCategoryHandler(provider *narou.TestDataProvider, r18 bool) NarouApiHandlerType {
	return func(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
		categories := provider.GetFavNovelCategory(r18)
		var result []model.FavNovelCategory
		for _, cat := range categories {
			result = append(result, model.FavNovelCategory{
				No:       cat.No,
				Name:     cat.Name,
				NumItems: cat.NumItems,
			})
		}
		return ReturnJson(w, result)
	}
}

// testDataFavNovelListHandler returns test data for bookmark list
func testDataFavNovelListHandler(provider *narou.TestDataProvider, category uint) NarouApiHandlerType {
	return func(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
		page, err := provider.GetFavNovelListPage(category, 1)
		if err != nil {
			return nil, err
		}

		var result []model.FavNovelListRecord
		for _, item := range page.Items {
			result = append(result, model.FavNovelListRecord{
				BaseURL:         fmt.Sprintf("https://%v.syosetu.com/%v/", item.SiteID, item.NovelID),
				UpdateTime:      item.UpdateTime,
				BookmarkEpisode: item.BookmarkEpisode,
				LatestEpisode:   item.LatestEpisode,
				Title:           item.Title,
				AuthorName:      item.AuthorName,
				IsNotice:        item.IsNotice,
				Completed:       item.Completed,
				IsShort:         item.IsShort,
				Memo:            item.Memo,
			})
		}
		return ReturnJson(w, result)
	}
}

// testDataNovelInfoHandler returns test data for novel info
func testDataNovelInfoHandler(provider *narou.TestDataProvider, ncode string) NarouApiHandlerType {
	return func(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
		novelInfo, err := provider.GetNovelInfo(ncode)
		if err != nil {
			return nil, err
		}

		var contents []model.NovelInfoChapter
		if novelInfo.Index != nil {
			episodes := make([]model.NovelInfoEpisode, 0, len(novelInfo.Index.Episodes))
			for _, ep := range novelInfo.Index.Episodes {
				episodes = append(episodes, model.NovelInfoEpisode{
					SubTitle: ep.SubTitle,
					No:       ep.No,
					Date:     ep.PublishTime,
					Update:   ep.UpdateTime,
				})
			}
			contents = append(contents, model.NovelInfoChapter{
				Episodes: episodes,
			})
		}

		return ReturnJson(w, model.NovelInfoRecord{
			BaseURL:         fmt.Sprintf("https://ncode.syosetu.com/%s/", ncode),
			Title:           novelInfo.Title,
			AuthorName:      novelInfo.AuthorName,
			Keywords:        strings.Split(novelInfo.Keywords, " "),
			Abstract:        novelInfo.Abstract,
			AuthorURL:       novelInfo.AuthorURL,
			BookmarkURL:     novelInfo.BookmarkURL,
			BookmarkNo:      novelInfo.BookmarkNo,
			BookmarkEpisode: novelInfo.BookmarkEpisode,
			Contents:        contents,
		})
	}
}

// testDataCheckNovelAccessHandler returns test data for episode accessibility check
func testDataCheckNovelAccessHandler(provider *narou.TestDataProvider, ncode string, episode uint) NarouApiHandlerType {
	return func(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
		accessible := provider.IsEpisodeAccessible(ncode, episode)
		result := struct {
			Accessible bool `json:"accessible"`
			StatusCode int  `json:"statusCode"`
		}{
			Accessible: accessible,
			StatusCode: 200,
		}
		if !accessible {
			result.StatusCode = 404
		}

		return ReturnJson(w, result)
	}
}

// testDataFavUserUpdatesHandler returns test data for favorite user updates
func testDataFavUserUpdatesHandler(provider *narou.TestDataProvider) NarouApiHandlerType {
	return func(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
		info, err := provider.GetFavUserUpdates()
		if err != nil {
			return nil, err
		}

		result := &model.FavUserUpdatesRecord{
			R18PassiveCount: info.R18PassiveCount,
			BlogListHTML:    info.BlogListHTML,
			NovelListHTML:   info.NovelListHTML,
			PassiveCount:    info.PassiveCount,
		}

		return ReturnJson(w, result)
	}
}
