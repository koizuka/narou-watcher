package narou

import (
	"reflect"
	"testing"
)

// TestParseUserTop は、ユーザートップページのタイトル検証・トークン抽出・
// ログアウトURL抽出を固定する。
// なろうがページタイトルや構造を変更すると token 取得経路
// (notification / fav-user-updates) やログアウトが壊れるため、現行構造を
// 回帰テストとして固定しておく。トークンは旧デザインの a#logout[data-token] から
// インラインスクリプトの var usertop_url = "...?token=XXX" へ移動した。
func TestParseUserTop(t *testing.T) {
	const wantTitle = "ユーザホーム | ユーザページ | 小説家になろう"

	t.Run("正常: スクリプトからトークン、リンクからログアウトURLを抽出", func(t *testing.T) {
		html := `<html><head><title>` + wantTitle + `</title></head>` +
			`<body>` +
			`<li><a href="https://syosetu.com/login/logout/"><span class="p-icon p-icon--logout"></span>ログアウト</a></li>` +
			`<script>` + "\n" +
			`var usertop_url = "https://api.syosetu.com/async/usertop/?token=abc123";` + "\n" +
			`</script>` +
			`</body></html>`
		page, err := NewPageFromText(html)
		if err != nil {
			t.Fatalf("NewPageFromText error: %v", err)
		}
		info, err := ParseUserTop(page)
		if err != nil {
			t.Fatalf("ParseUserTop error: %v", err)
		}
		if info.Token != "abc123" {
			t.Errorf("Token = %q, want %q", info.Token, "abc123")
		}
		if info.LogoutURL != "https://syosetu.com/login/logout/" {
			t.Errorf("LogoutURL = %q, want %q", info.LogoutURL, "https://syosetu.com/login/logout/")
		}
	})

	t.Run("タイトル不一致はエラー", func(t *testing.T) {
		html := `<html><head><title>ホーム｜ユーザページ</title></head><body></body></html>`
		page, err := NewPageFromText(html)
		if err != nil {
			t.Fatalf("NewPageFromText error: %v", err)
		}
		_, err = ParseUserTop(page)
		wantErr := TitleMismatchError{"ホーム｜ユーザページ", wantTitle}
		if !reflect.DeepEqual(err, wantErr) {
			t.Errorf("error = %v, want %v", err, wantErr)
		}
	})

	t.Run("トークンが無ければエラー", func(t *testing.T) {
		html := `<html><head><title>` + wantTitle + `</title></head>` +
			`<body><a href="https://syosetu.com/login/logout/">ログアウト</a></body></html>`
		page, err := NewPageFromText(html)
		if err != nil {
			t.Fatalf("NewPageFromText error: %v", err)
		}
		if _, err := ParseUserTop(page); err == nil {
			t.Error("expected error when token is missing, got nil")
		}
	})
}

func TestParseUserTopNews(t *testing.T) {
	tests := []struct {
		name      string
		newsHTML  string
		wantHas   bool
		wantCount int
	}{
		{
			name:      "通知あり(実レスポンス)",
			newsHTML:  "\t<div class=\"p-up-home-notification__item\"><a href=\"/ranknovel18log/search/\">R18作品がランクインしました</a></div>\n",
			wantHas:   true,
			wantCount: 1,
		},
		{
			name:      "通知あり(複数件)",
			newsHTML:  "<div class=\"p-up-home-notification__item\"><a href=\"#\">通知1</a></div><div class=\"p-up-home-notification__item\"><a href=\"#\">通知2</a></div>",
			wantHas:   true,
			wantCount: 2,
		},
		{
			name:      "通知なし(空文字列)",
			newsHTML:  "",
			wantHas:   false,
			wantCount: 0,
		},
		{
			name:      "通知なし(空白のみ)",
			newsHTML:  "\t\n ",
			wantHas:   false,
			wantCount: 0,
		},
		{
			name:      "非空だが既知のクラスなし(フォールバックで有り判定)",
			newsHTML:  "<div class=\"unknown\">なにかの通知</div>",
			wantHas:   true,
			wantCount: 0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			has, count := ParseUserTopNews(tt.newsHTML)
			if has != tt.wantHas {
				t.Errorf("hasNotification = %v, want %v", has, tt.wantHas)
			}
			if count != tt.wantCount {
				t.Errorf("count = %v, want %v", count, tt.wantCount)
			}
		})
	}
}

// TestParseUserTopApiJsonNoNews は、通知が無いとき usertop async API のレスポンスから
// "news" キー自体が省略されることを実環境で確認した挙動を固定する。
// キー欠落・null・空文字列のいずれでも NewsHTML は空となり、通知なしと判定される。
func TestParseUserTopApiJsonNoNews(t *testing.T) {
	tests := []struct {
		name string
		json string
	}{
		{
			name: "newsキーが省略されている(実環境で確認)",
			json: `{"favuserblogList":"<ul></ul>","favusernovelList":"<ul></ul>","cheersprogram":""}`,
		},
		{
			name: "newsがnull",
			json: `{"news":null,"favusernovelList":"<ul></ul>"}`,
		},
		{
			name: "newsが空文字列",
			json: `{"news":"","favusernovelList":"<ul></ul>"}`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			info, err := ParseUserTopApiJson(tt.json)
			if err != nil {
				t.Fatalf("ParseUserTopApiJson error: %v", err)
			}
			has, count := ParseUserTopNews(info.NewsHTML)
			if has {
				t.Errorf("hasNotification = true, want false (NewsHTML=%q)", info.NewsHTML)
			}
			if count != 0 {
				t.Errorf("count = %v, want 0", count)
			}
		})
	}
}
