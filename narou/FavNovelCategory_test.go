package narou

import (
	"reflect"
	"testing"
)

const FavNovelCategoryTestHtml = `
<head>
<title>ブックマーク</title>
</head>
<body>
<form>
<select name="categoryid">
<option value="1" disabled="disabled">カテゴリ1・test</option>
<option value="2">カテゴリ2・test</option>
</select>
</form>

<div id="sub">
<ul class="category_box">
<li class="now"><a href="/favnovelmain/list/?nowcategory=1&order=updated_at">カテゴリ1・test(123)</a></li>
<li><a href="/favnovelmain/list/?nowcategory=2&order=updated_at">カテゴリ2・test(456)</a></li>
</ul>
</div><!--sub-->

</body>`

func TestParseFavNovelCategory(t *testing.T) {
	type args struct {
		html  string
		title string
	}
	tests := []struct {
		name    string
		args    args
		want    *[]FavNovelCategory
		wantErr bool
	}{
		{"test", args{FavNovelCategoryTestHtml, "ブックマーク"},
			&[]FavNovelCategory{
				{1, "カテゴリ1・test", 123},
				{2, "カテゴリ2・test", 456},
			}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			html, err := NewPageFromText(tt.args.html)
			if err != nil {
				t.Errorf("ParseFavNovelCategory() html error = %v", err)
				return
			}
			got, err := ParseFavNovelCategory(html, tt.args.title)
			if (err != nil) != tt.wantErr {
				t.Errorf("ParseFavNovelCategory() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("ParseFavNovelCategory() got = %v, want %v", got, tt.want)
			}
		})
	}
}
