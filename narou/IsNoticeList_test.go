package narou

import (
	"bytes"
	"errors"
	"github.com/PuerkitoBio/goquery"
	"github.com/koizuka/scraper"
	"net/url"
	"reflect"
	"testing"
	"time"
)

func NewPageFromText(html string) (*scraper.Page, error) {
	testUrl, err := url.Parse("http://localhost/")
	if err != nil {
		return nil, err
	}
	logger := &scraper.BufferedLogger{}
	buf := bytes.NewBufferString(html)
	doc, err := goquery.NewDocumentFromReader(buf)
	if err != nil {
		return nil, err
	}

	page := &scraper.Page{doc, testUrl, logger}

	return page, nil
}

const TestHtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>更新通知チェック中一覧</title>
</head>
<body>
<div id="header">
</div><!-- header -->

<!--for  get userid from js -->
<span id="userid" style="display:none;" >0</span>

<div id="container">
<div id="contents2">
<div id="main">
<h3 class="isnoticelist">更新通知チェック中一覧 218/400</h3>


<form method="post" action="/favnovelmain/update/?token=TOKEN">

<div class="pager_idou"><span>1</span>&nbsp;<a href="index.php?p=2" title="page 2">2</a>&nbsp;<a href="index.php?p=3" title="page 3">3</a>&nbsp;<a href="index.php?p=4" title="page 4">4</a>&nbsp;<a href="index.php?p=5" title="page 5">5</a>&nbsp;<a href="index.php?p=6" title="page 6">6</a>&nbsp;<a href="index.php?p=7" title="page 7">7</a>&nbsp;<a href="index.php?p=8" title="page 8">8</a>&nbsp;<a href="index.php?p=2" title="next page">Next &gt;&gt;</a>&nbsp;</div>



<table class="favnovel">
<tr>
<td rowspan="2" class="jyokyo2"></td>
<td class="title2">
<a class="title" href="https://ncode.syosetu.com/作品1/">タイトル1</a>
<span class="fn_name">
（作者1）
</span></td>
</tr>
<tr>
<td class="info2">
<p>
<span class="isnotice">チェック中</span>
更新日：2000/01/02 03:04

<span class="no">
<a href="//ncode.syosetu.com/作品1/1/"><img src="" />&nbsp;1部分</a>&nbsp;-

<a href="https://ncode.syosetu.com/作品1/2/">
最新2部分</a></span>

</p>
<p class="right">
<a href="">設定</a>
</p>
</td>
</tr>
</table>


<table class="favnovel">
<tr>
<td rowspan="2" class="jyokyo2"></td>
<td class="title2">
<a class="title" href="https://ncode.syosetu.com/作品2/">タイトル2</a>
<span class="fn_name">
（作者2）
</span></td>
</tr>
<tr>
<td class="info2">
<p>
<span class="isnotice">チェック中</span>
更新日：2001/02/03 04:05

<span class="no">
<a href="//ncode.syosetu.com/作品2/3/"><img src="" />&nbsp;3部分</a>&nbsp;-

<a href="https://ncode.syosetu.com/作品2/4/">
最終4部分</a>〔完結済〕</span>

</p>
<p class="right">
<a href="">設定</a>
</p>
</td>
</tr>
</table>
<div class="pager_idou"><span>1</span>&nbsp;<a href="index.php?p=2" title="page 2">2</a>&nbsp;<a href="index.php?p=3" title="page 3">3</a>&nbsp;<a href="index.php?p=4" title="page 4">4</a>&nbsp;<a href="index.php?p=5" title="page 5">5</a>&nbsp;<a href="index.php?p=6" title="page 6">6</a>&nbsp;<a href="index.php?p=7" title="page 7">7</a>&nbsp;<a href="index.php?p=8" title="page 8">8</a>&nbsp;<a href="index.php?p=2" title="next page">Next &gt;&gt;</a>&nbsp;</div>
</form>
</div><!--main-->
</div><!--contents2-->
</div><!--container-->
</body></html>`

func TestParseIsNoticeList(t *testing.T) {
	datetime := func(s string) time.Time {
		const layout = "2006/01/02 15:04"
		result, _ := time.ParseInLocation(layout, s, NarouLocation)
		return result
	}
	type args struct {
		html string
	}
	tests := []struct {
		name    string
		args    args
		want    []IsNoticeList
		wantErr error
	}{
		{"更新チェック中一覧テスト", args{TestHtml},
			[]IsNoticeList{
				{"ncode", "作品1", "タイトル1", "作者1", datetime("2000/01/02 03:04"), 1, 2, false},
				{"ncode", "作品2", "タイトル2", "作者2", datetime("2001/02/03 04:05"), 3, 4, true},
			},
			nil,
		},
		{"タイトルエラー", args{"<html><head><title>invalid title</title></head></html>"},
			nil,
			errors.New("title mismatch: got:'invalid title', want:'更新通知チェック中一覧'"),
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			page, err := NewPageFromText(tt.args.html)
			if err != nil {
				t.Errorf("ParseIsNoticeList() html error = %v", err)
			}
			got, err := ParseIsNoticeList(page)
			if !reflect.DeepEqual(err, tt.wantErr) {
				t.Errorf("ParseIsNoticeList()\n error = %v,\n wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("ParseIsNoticeList()\n got = %v,\n  want %v", got, tt.want)
			}
		})
	}
}
