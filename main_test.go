package main

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"

	"narou-watcher/narou"
)

// TestHandlerFuncSetsNoCacheHeaders は、全 API エンドポイント共通の HandlerFunc 経路で
// no-cache ヘッダが付与されることを検証する(成功・エラーいずれの応答でも)。
func TestHandlerFuncSetsNoCacheHeaders(t *testing.T) {
	openAddress, _ := url.Parse("http://localhost:7676")
	svc := NewNarouApiService(t.TempDir(), "test-session", openAddress, false)

	tests := []struct {
		name    string
		handler NarouApiHandlerType
	}{
		{
			name: "success",
			handler: func(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
				return ReturnJson(w, map[string]bool{"ok": true})
			},
		},
		{
			name: "error",
			handler: func(w http.Header, r *http.Request, watcher *narou.NarouWatcher) ([]byte, error) {
				return nil, errors.New("boom")
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/narou/notification", nil)
			rec := httptest.NewRecorder()
			svc.HandlerFunc(tt.handler)(rec, req)

			res := rec.Result()
			if got := res.Header.Get("Cache-Control"); !strings.Contains(got, "no-store") {
				t.Errorf("Cache-Control = %q, want to contain no-store", got)
			}
			if got := res.Header.Get("Pragma"); got != "no-cache" {
				t.Errorf("Pragma = %q, want no-cache", got)
			}
		})
	}
}
