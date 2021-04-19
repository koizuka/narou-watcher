package narou

import (
	"reflect"
	"testing"
	"time"
)

const FavNovelListTestHtml = `
<head>
<title>ブックマーク</title>
</head>
<body>
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
（author2）
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
最新4部分</a></span>

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
<a class="title" href="https://ncode.syosetu.com/novel3/">短篇</a>
<span class="fn_name">
（author3）
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
		want    []FavNovelList
		wantErr bool
	}{
		{"test", args{FavNovelListTestHtml, "ブックマーク"}, []FavNovelList{
			{"ncode", "novel1", "title1", "author1", datetime("2000/01/02 03:04"), 1, 2, false},
			{"ncode", "novel2", "title2", "author2", datetime("2001/02/03 04:05"), 3, 4, true},
			{"ncode", "novel3", "短篇", "author3", datetime("2002/03/04 05:06"), 0, 0, false},
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
				t.Errorf("ParseFavNovelList() got = %v, want %v", got, tt.want)
			}
		})
	}
}
