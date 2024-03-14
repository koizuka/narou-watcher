package narou

import (
	"github.com/google/go-cmp/cmp"
	"reflect"
	"testing"
)

const FavNovelCategoryTestHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="日本最大級のWeb小説投稿サイト「小説家になろう」。作品数100万以上、登録者数240万人以上、小説閲覧数月間25億PV以上。パソコン・スマートフォンのどれでも使えて完全無料！">
<meta name="keywords" content="Web小説, ネット小説,携帯小説,ケータイ小説,オンライン小説,縦書き小説,小説投稿,小説投稿サイト">
<meta name="format-detection" content="telephone=no">
<meta name="viewport" content="width=1088, maximum-scale=1.0, user-scalable=yes">

<title>ブックマーク | ユーザページ | 小説家になろう</title>

<link rel="shortcut icon" href="https://static.syosetu.com/view/images/narou.ico?psawph">
<link rel="apple-touch-icon-precomposed" href="https://static.syosetu.com/view/images/apple-touch-icon-precomposed.png?ojjr8x">


<link rel="stylesheet" href="https://static.syosetu.com/view/css/base_userpage-pc.css?sabr03">

<link rel="stylesheet" type="text/css" media="all" href="https://static.syosetu.com/view/css/lib/remodal.css?oqe20g" />
<link rel="stylesheet" type="text/css" media="all" href="https://static.syosetu.com/view/css/lib/remodal-default-theme.css?oqe20g" />
<link rel="stylesheet" type="text/css" media="all" href="https://static.syosetu.com/view/css/p_up-bookmark-pc.css?sabr01" />

<script><!--
var domain = 'syosetu.com';
var isSmartPhone = false;
//--></script>

<script src="https://static.syosetu.com/view/js/lib/jquery/1.12.4/jquery.min.js?oks8j8"></script>

<link rel="stylesheet" href="https://static.syosetu.com/view/css/lib/jqueryui/1.12.1/jquery-ui.min.css?oks8j8">
<script src="https://static.syosetu.com/view/js/lib/jqueryui/1.12.1/jquery-ui.min.js?oks8j8"></script>

<script src="https://static.syosetu.com/view/js/lib/jquery.hina.js?rq7apb"></script>
<script src="https://static.syosetu.com/view/js/event/global_menu.js?s43k5e"></script>
<script src="https://static.syosetu.com/view/js/global.js?s9wyda"></script>

<script type="text/javascript" src="https://unpkg.com/@popperjs/core@2"></script>
<script type="text/javascript" src="https://unpkg.com/tippy.js@6"></script>
<script type="text/javascript" src="https://static.syosetu.com/view/js/event/user_global.js?sabr07"></script>
<script type="text/javascript" src="https://static.syosetu.com/view/js/favnovelmain.js?sabr05"></script>
<script type="text/javascript" src="https://static.syosetu.com/view/js/event/favnovelmain_list.js?sabr04"></script>
<script type="text/javascript" src="https://static.syosetu.com/view/js/lib/remodal.min.js?oqe1mv"></script>




<script type="text/javascript">
var microadCompass = microadCompass || {};
microadCompass.queue = microadCompass.queue || [];
</script>
<script type="text/javascript" charset="UTF-8" src="//j.microad.net/js/compass.js" onload="new microadCompass.AdInitializer().initialize();" async></script>




</head>
<body>

<div class="p-up-bookmark-category">
<form class="c-form">
<div class="c-form__group">
<div class="c-form__label">
カテゴリ選択
<span class="p-up-bookmark-category__setting"><a href="/favnovelcategory/list/">カテゴリ名編集</a></span>
</div><!-- /.c-form__label -->
<select class="c-form__select p-up-bookmark-category__select js-bookmark_list_form_select">
<option value="/favnovelmain/list/?nowcategory=1&order=updated_at">カテゴリ1・test(123)</option>
<option value="/favnovelmain/list/?nowcategory=2&order=updated_at">カテゴリ2・test(456)</option>
</select><!-- /.c-form__select -->
</div><!-- /.c-form__group -->
</form><!-- /.c-form -->
</div><!-- /.p-up-bookmark-category -->

</body>
</html>
`

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
		{"test", args{FavNovelCategoryTestHtml, FavNovelListTitle},
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
				diff := cmp.Diff(tt.want, got)
				t.Errorf("ParseFavNovelCategory() (-want +got)\n%v", diff)
			}
		})
	}
}
