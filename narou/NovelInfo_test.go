package narou

import (
	"github.com/google/go-cmp/cmp"
	"reflect"
	"testing"
	"time"
)

const html = `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>TITLE</title>

<meta property="og:type" content="website" />
<meta property="og:title" content="TITLE" />
<meta property="og:url" content="https://ncode.syosetu.com/NCODE/" />
<meta property="og:description" content="TAGS" />
<meta property="og:image" content="https://sbo.syosetu.com/NCODE/twitter.png" />
<meta property="og:site_name" content="小説家になろう" />
<meta name="twitter:site" content="@syosetu">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:creator" content="AUTHOR">

<meta name="WWWC" content="2021/05/13 19:00" /><meta name="description" content="ABSTRACT_SHORT" />
</head>
<body onload="initRollovers();">

<a id="pageBottom" href="#footer">↓</a>
<div id="novel_header">
<ul id="head_nav">
<li id="login">
<a href="https://syosetu.com/user/top/">ホーム</a>
</li>
<li><a href="https://ncode.syosetu.com/novelview/infotop/ncode/NCODE/">小説情報</a></li>
<li><a href="https://novelcom.syosetu.com/impression/list/ncode/NOVELID2/">感想</a></li>
<li><a href="https://novelcom.syosetu.com/novelreview/list/ncode/NOVELID2/">レビュー</a></li>
<li><a href="https://pdfnovels.net/NCODE/" class="menu" target="_blank">縦書きPDF</a></li>
<li class="booklist_now">
<a href="javascript:void(0)" class="bookmark_delete_url">ブックマーク解除</a>
<input type="hidden" name="bookmark_deleteconf_url" value="https://syosetu.com/favnovelmain/deleteconfirmajax/favncode/NOVELID2/">
</li>

</ul>

<div id="novelnavi_right">

<div class="novelview_navi">


</div><!--novelview_navi-->
</div><!-- novelnavi_right -->

</div><!--novel_header-->

<div id="container">


  <div class="contents1">
<span class="attention">＜R15＞</span>
</div><!--contents1-->
<div id="novel_contents">
<div id="novel_color">


<p class="novel_title">TITLE</p>


<div class="novel_writername">
作者：AUTHOR
</div><!--novel_writername-->


<div id="novel_ex">ABSTRACT<br />ABSTRACT
</div>

<div class="novellingindex_bookmarker_no"><a href="/NCODE/3/">3部分</a></div>


<div class="index_box">
 <div class="chapter_title">CHAPTER1</div>
 
<dl class="novel_sublist2">
<dd class="subtitle">
<a href="/NCODE/1/">第1-1話</a>
</dd>
<dt class="long_update">
2021/05/03 23:44<span title="2021/05/07 15:54 改稿">（<u>改</u>）</span></dt>
</dl>
 
<dl class="novel_sublist2">
<dd class="subtitle">
<a href="/NCODE/2/">第1-2話</a>
</dd>
<dt class="long_update">
2021/05/03 23:58<span title="2021/05/07 15:55 改稿">（<u>改</u>）</span></dt>
</dl>
 <div class="chapter_title">CHAPTER2</div>
 
<dl class="novel_sublist2">
<dd class="subtitle">
<a href="/NCODE/3/">第2-1話</a>
<span class="bookmarker_now">　</span></dd>
<dt class="long_update">
2021/05/06 19:00</dt>
</dl>
</div><!--index_box-->

</div><!--novel_color-->

<div class="wrap_menu_novelview_after">
<div class="box_menu_novelview_after clearfix">
<ul class="menu_novelview_after">

<li class="list_menu_novelview_after"><a href="https://syosetu.com/favnovelmain/list/?nowcategory=2">ブックマーク</a></li>

</ul>

<ul class="footerbookmark"><li class="booklist_now">
<a href="javascript:void(0)" class="bookmark_delete_url">ブックマーク解除</a>
<input type="hidden" name="bookmark_deleteconf_url" value="https://syosetu.com/favnovelmain/deleteconfirmajax/favncode/NOVELID2/">
</li>

</ul>
</div><!-- footer_bookmark -->
</div><!-- wrap -->

<div id="novel_attention">
+注意+<br />
</div><!--novel_attention-->

<div id="novel_footer">
<ul class="undernavi">
<li><a href="https://mypage.syosetu.com/AUTHORID/">作者マイページ</a></li>
<li><a href="https://ncode.syosetu.com/novelview/infotop/ncode/NCODE/#trackback">トラックバック</a></li>

<li><a href="https://ncode.syosetu.com/txtdownload/top/ncode/NOVELID2/" onclick="javascript:window.open('https://ncode.syosetu.com/txtdownload/top/ncode/NOVELID2/','a','width=600,height=450'); return false;">TXTダウンロード</a></li>


<li><a href="https://syosetu.com/ihantsuhou/input/ncode/NOVELID2/">情報提供</a></li>
</ul>
</div><!--novel_footer-->

</div><!--novel_contents-->

<div id="recommend">
<h3>この小説をブックマークしている人はこんな小説も読んでいます！</h3>
<div class="recommend_novel">

<a href="https://ncode.syosetu.com/REC1NCODE/"><span class="reconovel_title">REC1TITLE</span></a>
<p class="recommend_ex">REC1ABSTRACT
//</p>
<ul class="reco">
<li class="genre">
REC1GENRE
</li>
<li>
連載(全303部分)
</li>
</ul>
<ul class="reco">
<li class="user">2 user</li>
<li>
最終掲載日：2021/01/15 12:00
</li>
</ul>

</div><!--recommend_novel-->
<div class="recommend_novel">

<a href="https://ncode.syosetu.com/REC2NCODE/"><span class="reconovel_title">REC2TITLE</span></a>
<p class="recommend_ex">REC2ABSTRACT
//</p>
<ul class="reco">
<li class="genre">
REC2GENRE
</li>
<li>
連載(全243部分)
</li>
</ul>
<ul class="reco">
<li class="user">2 user</li>
<li>
最終掲載日：2021/03/01 19:45
</li>
</ul>

</div><!--recommend_novel-->
</div><!--recommend-->

<a id="pageTop" href="#main">↑ページトップへ</a>

</div><!--container-->

<!-- フッタここから -->
<div id="footer">
<ul class="undernavi">
<li><a href="https://syosetu.com">小説家になろう</a></li>
<li><a href="https://pdfnovels.net">タテ書き小説ネット</a></li>
<li><a href="https://yomou.syosetu.com">小説を読もう！</a></li>
<li id="search">
<form action="https://yomou.syosetu.com/search.php">
<input name="word" size="21" type="text" />
<input value="検索" type="submit" />
</form>
</li>
</ul>
</div><!--footer-->
<!-- フッタここまで -->

</body></html>
</html>
`

func TestParseNovelInfo(t *testing.T) {
	type args struct {
		html string
	}
	var episode uint = 3
	var bookmark uint = 2
	var bookmarkUrl = "https://syosetu.com/favnovelmain/list/?nowcategory=2"

	Ep1UpdateTime := time.Date(2021, time.May, 7, 15, 54, 0, 0, NarouLocation)
	Ep1 := SubList2{
		SubTitle:    "第1-1話",
		Link:        "/NCODE/1/",
		No:          1,
		PublishTime: time.Date(2021, time.May, 3, 23, 44, 0, 0, NarouLocation),
		UpdateTime:  &Ep1UpdateTime,
	}

	Ep2UpdateTime := time.Date(2021, time.May, 7, 15, 55, 0, 0, NarouLocation)
	Ep2 := SubList2{
		SubTitle:    "第1-2話",
		Link:        "/NCODE/2/",
		No:          2,
		PublishTime: time.Date(2021, time.May, 3, 23, 58, 0, 0, NarouLocation),
		UpdateTime:  &Ep2UpdateTime,
	}
	Ep3 := SubList2{
		SubTitle:    "第2-1話",
		Link:        "/NCODE/3/",
		No:          3,
		PublishTime: time.Date(2021, time.May, 6, 19, 00, 0, 0, NarouLocation),
		UpdateTime:  nil,
	}

	tests := []struct {
		name    string
		args    args
		want    *NovelInfo
		wantErr bool
	}{
		{"NovelInfo", args{html}, &NovelInfo{
			Title:      "TITLE",
			AuthorName: "AUTHOR",
			Keywords:   "TAGS",

			Abstract:        "ABSTRACT<br/>ABSTRACT\n",
			AuthorURL:       "https://mypage.syosetu.com/AUTHORID/",
			BookmarkURL:     &bookmarkUrl,
			BookmarkNo:      &bookmark,
			BookmarkEpisode: &episode,

			Index: &NovelIndex{
				Chapters:     []string{"CHAPTER1", "CHAPTER2"},
				ChapterHeads: []SubList2{Ep1, Ep3},
				Episodes:     []SubList2{Ep1, Ep2, Ep3},
			},
		}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			page, err := NewPageFromText(tt.args.html)
			if err != nil {
				t.Errorf("html error = %v", err)
			}
			got, err := ParseNovelInfo(page)
			if (err != nil) != tt.wantErr {
				t.Errorf("ParseNovelInfo() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				diff := cmp.Diff(tt.want, got)
				t.Errorf("ParseNovelInfo() (-want +got)\n%v", diff)
			}
		})
	}
}
