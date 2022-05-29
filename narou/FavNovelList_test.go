package narou

import (
	"github.com/google/go-cmp/cmp"
	"reflect"
	"testing"
	"time"
)

const FavNovelListTestHtml = `
<head>
<title>ブックマーク</title>
</head>
<body>

<div id="main">
<div class="nowcategory">
カテゴリ1・未完/最新追いかけ(156件) <span class="numItems">/&nbsp;ブックマーク(全832件)</span>
</div>

<form action="/favnovelmain/update/?token=xxxx" method="post">
<div class="pager_idou"><span>1</span>&nbsp;<a href="index.php?p=2" title="page 2">2</a>&nbsp;<a href="index.php?p=3" title="page 3">3</a>&nbsp;<a href="index.php?p=4" title="page 4">4</a>&nbsp;<a href="index.php?p=2" title="next page">Next &gt;&gt;</a>&nbsp;</div>

<table class="favnovel">
<tr>
<td rowspan="2" class="jyokyo1"></td>
<td rowspan="2" class="check"><input type="checkbox" name="useridfavncode[]" value="xxxxxx_xxxxxxx" data-noveltype="1" /></td>
<td class="title">
<a class="title" href="https://ncode.syosetu.com/novel1/">title1</a>
<span class="fn_name">
（author1）
</span></td>
</tr>
<tr>
<td class="bkm_memo">
<span>メモ</span>楽しい
</td>
</tr>
<tr>
<td class="info">
<p>

更新日：2000/01/02 03:04

<span class="no">
<a href="https://ncode.syosetu.com/novel1/1/"><img src="//static.syosetu.com/view/images/ui-icon/bookmarker_now.png" />&nbsp;1部分</a>&nbsp;-

<a href="https://ncode.syosetu.com/novel1/2/">
最新2部分</a></span>

</p>
<p class="right">
<a href="/favnovelmain/updateinput/useridfavncode/xxxxxx_xxxxxxx/">設定</a>
</p>
</td>
</tr>
</table>


<table class="favnovel">
<tr>
<td rowspan="2" class="jyokyo1"></td>
<td rowspan="2" class="check"><input type="checkbox" name="useridfavncode[]" value="xxxxxx_xxxxxxx" data-noveltype="1" /></td>
<td class="title">
<a class="title" href="https://ncode.syosetu.com/novel2/">title2</a>
<span class="fn_name">
（author2（test））
</span></td>
</tr>
<tr>
<td class="info">
<p>
<span class="isnotice">チェック中</span>
更新日：2001/02/03 04:05

<span class="no">
<a href="https://ncode.syosetu.com/novel2/3/"><img src="//static.syosetu.com/view/images/ui-icon/bookmarker_now.png" />&nbsp;3部分</a>&nbsp;-

<a href="https://ncode.syosetu.com/novel2/4/">
最終4部分</a>〔完結済〕</span>

</p>
<p class="right">
<a href="/favnovelmain/updateinput/useridfavncode/xxxxxx_xxxxxxx/">設定</a>
</p>
</td>
</tr>
</table>

<table class="favnovel">
<tr>
<td rowspan="2" class="jyokyo1"></td>
<td rowspan="2" class="check"><input type="checkbox" name="useridfavncode[]" value="xxxxxx_xxxxxxx" data-noveltype="1" /></td>
<td class="title">
<a class="title" href="https://ncode.syosetu.com/novel3/">title3</a>
<span class="fn_name">
（author3）
</span></td>
</tr>
<tr>
<td class="info">
<p>
<span class="isnotice">チェック中</span>
更新日：2001/02/03 04:06

<span class="no">

<a href="https://ncode.syosetu.com/novel3/5/">
最新5部分</a></span>

</p>
<p class="right">
<a href="/favnovelmain/updateinput/useridfavncode/xxxxxx_xxxxxxx/">設定</a>
</p>
</td>
</tr>
</table>

<table class="favnovel">
<tr>
<td rowspan="2" class="jyokyo1"></td>
<td rowspan="2" class="check"><input type="checkbox" name="useridfavncode[]" value="xxxxxx_xxxxxxx" data-noveltype="2" /></td>
<td class="title">
<a class="title" href="https://ncode.syosetu.com/short/">短篇</a>
<span class="fn_name">
（author_short）
</span></td>
</tr>
<tr>
<td class="info">
<p>

更新日：2002/03/04 05:06


</p>
<p class="right">
<a href="/favnovelmain/updateinput/useridfavncode/xxxxxx_xxxxxxx/">設定</a>
</p>
</td>
</tr>
</table>

<div class="pager_idou"><span>1</span>&nbsp;<a href="index.php?p=2" title="page 2">2</a>&nbsp;<a href="index.php?p=3" title="page 3">3</a>&nbsp;<a href="index.php?p=4" title="page 4">4</a>&nbsp;<a href="index.php?p=2" title="next page">Next &gt;&gt;</a>&nbsp;</div>
</form>
</div><!--main-->

<div id="sub">
<a href="/favnovelmain/isnoticelist/" id="noticelist">更新通知チェック中一覧</a>

<a href="/favnovelcategory/list/" id="category_manage">カテゴリ名管理</a>

<ul class="category_box">
<li class="now"><a href="/favnovelmain/list/?nowcategory=1&order=updated_at">カテゴリ1・未完/最新追いかけ(156)</a></li>
<li><a href="/favnovelmain/list/?nowcategory=2&order=updated_at">カテゴリ2・完結/短篇読了(359)</a></li>
<li><a href="/favnovelmain/list/?nowcategory=3&order=updated_at">カテゴリ3・未読/読みかけ(315)</a></li>
<li><a href="/favnovelmain/list/?nowcategory=4&order=updated_at">カテゴリ4・知人枠(2)</a></li>
</ul>
<div class="fav_box">
<ul>
<li class="menu_favnove"><a href="/favnovelmain/list/">ブックマーク</a></li>
<li class="menu_favuser"><a href="/favuser/list/">お気に入りユーザ</a></li>
<li><a href="/favuser/passivelist/">逆お気に入りユーザ</a></li>
</ul>
</div>
<div class="fav_box">
<ul>
<li class="xmenu_favnove"><a href="/favnovelmain18/list/">Xブックマーク</a></li>
<li class="xmenu_favuser"><a href="/favuser18/list/">お気に入りXユーザ</a></li>
<li><a href="/favuser18/passivelist/">逆お気に入りXユーザ</a></li>
</ul>
</div>

</div><!--sub-->

</body>
`

func TestParseFavNovelList(t *testing.T) {
	datetime := func(s string) time.Time {
		const layout = "2006/01/02 15:04"
		result, _ := time.ParseInLocation(layout, s, NarouLocation)
		return result
	}

	type args struct {
		html  string
		title string
	}
	tests := []struct {
		name    string
		args    args
		want    *FavNovelListPage
		wantErr bool
	}{
		{"test", args{FavNovelListTestHtml, "ブックマーク"}, &FavNovelListPage{
			NumItems:     156,
			TotalItems:   832,
			NextPageLink: "http://localhost/index.php?p=2",
			Items: []FavNovelList{
				{"ncode", "novel1", "title1", "author1", datetime("2000/01/02 03:04"), 1, 2, false, false, "楽しい"},
				{"ncode", "novel2", "title2", "author2（test）", datetime("2001/02/03 04:05"), 3, 4, true, true, ""},
				{"ncode", "novel3", "title3", "author3", datetime("2001/02/03 04:06"), 0, 5, true, false, ""},
				{"ncode", "short", "短篇", "author_short", datetime("2002/03/04 05:06"), 0, 0, false, false, ""},
			},
		}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			page, err := NewPageFromText(tt.args.html)
			if err != nil {
				t.Errorf("ParseFavNovelList() html error = %v", err)
				return
			}
			got, err := ParseFavNovelList(page, tt.args.title)
			if (err != nil) != tt.wantErr {
				t.Errorf("ParseFavNovelList() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				diff := cmp.Diff(tt.want, got)
				t.Errorf("ParseFavNovelList() (-want +got)\n%v", diff)
			}
		})
	}
}
