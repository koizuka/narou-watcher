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
</body>`

func TestParseFavNovelCategory(t *testing.T) {
	type args struct {
		html string
	}
	tests := []struct {
		name    string
		args    args
		want    *[]FavNovelCategory
		wantErr bool
	}{
		{"test", args{FavNovelCategoryTestHtml},
			&[]FavNovelCategory{
				{1, "カテゴリ1・test"},
				{2, "カテゴリ2・test"},
			}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			html, err := NewPageFromText(tt.args.html)
			if err != nil {
				t.Errorf("ParseFavNovelCategory() html error = %v", err)
				return
			}
			got, err := ParseFavNovelCategory(html)
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
