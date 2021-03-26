package main

import (
	"fmt"
	"reflect"
	"testing"
)

func TestEpisodeURL_String(t *testing.T) {
	type fields struct {
		SiteID  string
		NovelID string
		Episode uint
	}
	tests := []struct {
		name   string
		fields fields
		want   string
	}{
		{"simple", fields{"ncode", "abc123", 42}, "https://ncode.syosetu.com/abc123/42/"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			e := EpisodeURL{
				SiteID:  tt.fields.SiteID,
				NovelID: tt.fields.NovelID,
				Episode: tt.fields.Episode,
			}
			if got := fmt.Sprint(e); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("String() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestEpisodeURL_URL(t *testing.T) {
	type fields struct {
		SiteID  string
		NovelID string
		Episode uint
	}
	tests := []struct {
		name   string
		fields fields
		want   string
	}{
		{"simple", fields{"ncode", "abc123", 42}, "https://ncode.syosetu.com/abc123/42/"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			e := EpisodeURL{
				SiteID:  tt.fields.SiteID,
				NovelID: tt.fields.NovelID,
				Episode: tt.fields.Episode,
			}
			if got := e.URL(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("URL() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestEpisodeURL_Unmarshal(t *testing.T) {
	type args struct {
		s string
	}
	tests := []struct {
		name       string
		args       args
		wantResult EpisodeURL
		wantErr    error
	}{
		{"simple", args{"https://ncode.syosetu.com/def/42/"}, EpisodeURL{"ncode", "def", 42}, nil},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var target EpisodeURL
			gotErr := target.Unmarshal(tt.args.s)
			if !reflect.DeepEqual(target, tt.wantResult) {
				t.Errorf("Unmarshal() = %v, want %v", target, tt.wantResult)
			}
			if !reflect.DeepEqual(gotErr, tt.wantErr) {
				t.Errorf("Unmarshal() gotErr = %v, want %v", gotErr, tt.wantErr)
			}
		})
	}
}

func TestParseEpisodeURL(t *testing.T) {
	type args struct {
		url string
	}
	tests := []struct {
		name       string
		args       args
		wantResult EpisodeURL
		wantErr    error
	}{
		{"simple", args{"https://ncode.syosetu.com/abc123/42/"}, EpisodeURL{"ncode", "abc123", 42}, nil},
		{"unknown sitename", args{"https://unknown.syosetu.com/abc123/42/"}, EpisodeURL{}, fmt.Errorf("invalid URL: 'https://unknown.syosetu.com/abc123/42/'")},
		{"error", args{"test"}, EpisodeURL{}, fmt.Errorf("invalid URL: 'test'")},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotResult, gotErr := ParseEpisodeURL(tt.args.url)
			if !reflect.DeepEqual(gotResult, tt.wantResult) {
				t.Errorf("ParseEpisodeURL() gotResult = %v, want %v", gotResult, tt.wantResult)
			}
			if !reflect.DeepEqual(gotErr, tt.wantErr) {
				t.Errorf("ParseEpisodeURL() gotErr = %v, want %v", gotErr, tt.wantErr)
			}
		})
	}
}
