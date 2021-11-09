package narou

import (
	"testing"
)

const NaroWatcher_TestHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="日本最大級の小説投稿サイト「小説家になろう」。作品数40万以上、登録者数80万人以上、小説閲覧数月間11億PV以上。パソコン・スマートフォン・フィーチャーフォンのどれでも使えて完全無料！">
<meta name="keywords" content="携帯小説,ケータイ小説,オンライン小説,縦書き小説,小説投稿,小説投稿サイト">
<meta name="format-detection" content="telephone=no">
<meta name="viewport" content="width=1088, maximum-scale=1.0, user-scalable=yes">

<title>ログイン | 小説家になろう</title>

<link rel="shortcut icon" href="https://static.syosetu.com/view/images/narou.ico?psawph">
<link rel="apple-touch-icon-precomposed" href="https://static.syosetu.com/view/images/apple-touch-icon-precomposed.png?ojjr8x">


<link rel="stylesheet" href="https://static.syosetu.com/view/css/base_narou-pc.css?qugxct">

<link rel="stylesheet" href="https://static.syosetu.com/view/css/p_login-pc.css?r0lbw5">
<script><!--
var domain = 'syosetu.com';
var isSmartPhone = false;
//--></script>

<script src="https://static.syosetu.com/view/js/lib/jquery/1.12.4/jquery.min.js?oks8j8"></script>

<link rel="stylesheet" href="https://static.syosetu.com/view/css/lib/jqueryui/1.12.1/jquery-ui.min.css?oks8j8">
<script src="https://static.syosetu.com/view/js/lib/jqueryui/1.12.1/jquery-ui.min.js?oks8j8"></script>

<script src="https://static.syosetu.com/view/js/lib/jquery.hina.js?oyez8w"></script>
<script src="https://static.syosetu.com/view/js/event/global_menu.js?psawph"></script>
<script src="https://static.syosetu.com/view/js/global.js?r1ocie"></script>

<script src="https://static.syosetu.com/sslview/js/event/login_input.js?q2n4b9"></script>


</head>
<body>

<div class="l-header">
<div class="p-login-header">
<div class="p-login-header__inner"><a href="https://syosetu.com"><img class="p-login-header__logo" src="https://static.syosetu.com/view/images/common/logo_narou_w.png?psawph" alt="小説家になろう"></a></div>
</div><!-- .p-login-header -->
</div><!-- .l-header -->

<div class="l-container">
<div class="l-main">

<noscript>
<div class="c-alert c-alert--warning">
あなたの端末はJavaScriptが無効化されています。<br>この状態では一部利用できない機能がございますので、ブラウザの設定でJavaScriptを有効にしていただきますようお願い致します。なお、設定の変更方法については利用ブラウザの提供元へお問い合わせください。
</div>
</noscript>

<div class="c-panel">
<h2 class="c-panel__headline">ログイン</h2>
<div class="c-panel__body">

<div class="c-panel__item">

<form class="c-form" action="/login/login/" method="post">

<div class="c-form__group">
<label class="c-form__label">IDまたはメールアドレス</label>
<input class="c-form__input-text" name="narouid" type="text">
</div><!-- /.c-form__group -->

<div class="c-form__group">
<label class="c-form__label">パスワード</label>
<input class="c-form__input-text" size="20" name="pass" type="password">
</div><!-- /.c-form__group -->

<div class="c-form__group">
<p><a href="https://ssl.syosetu.com/login/replacepasswordinput/">パスワードを忘れた方はこちら</a></p>
</div><!-- /.c-form__group -->

<div class="c-form__group">
<div class="c-form__checkbox">
<input class="c-form__checkbox-input" name="skip" value="1" id="skip" type="checkbox">
<label class="c-form__checkbox-label" for="skip">次回から自動的にログイン</label>
</div><!-- .c-form__checkbox -->
</div><!-- /.c-form__group -->

<div class="c-form__group">
<p class="c-form__help-block">ネットカフェや公共の場所、学校など、自分専用のパソコン以外では自動ログインのチェックをせず、使用後は必ずログアウトしてください。</p>

</div><!-- /.c-form__group -->

<div class="c-form__group">
<input type="hidden" name="redirectlink" value="/favnovelmain/list/">
<input type="hidden" name="redirecthash" value="xxx">

<div class="js-progress-button p-progress-button">
<input id="mainsubmit" class="js-progress-button__button c-button c-button--half c-button--primary" type="submit" value="ログイン" >
</div><!-- .js-progress-button.p-progress-button -->

</div><!-- /.c-form__group -->
</form>
<form action="/twitter/login/" method="post">
<div class="c-form__group">
<input type="hidden" name="redirectlink" value="/favnovelmain/list/">
<input type="hidden" name="redirecthash" value="xxx">
<input type="hidden" class="js-twitter-login-skip" name="skip" value="0">
<div class="js-progress-button p-progress-button">
<input class="js-progress-button__button c-button c-button--half c-button--twitter-login" type="submit" value="Twitterアカウントでログイン">
</div><!-- .js-progress-button.p-progress-button -->
</div><!-- /.c-form__group -->
</form>
</div><!-- .c-panel__item -->
<div class="c-panel__item">
<a class="c-button c-button--half c-button--useradd" href="/useradd/mailinput/">新規ユーザ登録</a>
</div><!-- .c-panel__item -->
</div><!-- .c-panel__body -->

</div><!-- .c-panel -->

<div class="c-panel">
<h2 class="c-panel__headline">お困りの方は</h2>
<div class="c-panel__body">
<div class="c-panel__list-navigation">
<a href="https://syosetu.com/help/list/categoriid/e383ade382b0e382a4e383b3/" class="c-panel__navigation">ヘルプ</a>
<a href="https://syosetu.com/man/loginout/" class="c-panel__navigation">各種マニュアル</a>
<a href="https://syosetu.com/searchuser/search/" class="c-panel__navigation">ユーザIDを調べる</a>
</div><!-- .c-panel__list-navigation -->
</div><!-- /.c-panel__body -->
</div><!-- .c-panel -->

</div><!-- .l-main -->
<div class="l-sidebar">

<div class="c-ad">
</div>
</div><!-- .l-sidebar -->
</div><!-- .l-container -->


<div class="l-footer">
<div class="p-footer">
<a class="p-footer__logo" href="//syosetu.com/">
<div class="p-footer__site-outline">みんなのための小説投稿サイト</div>
<img src="//static.syosetu.com/view/images/common/logo_narou_w.png?psawph" alt="小説家になろう">
</a>

<div class="p-footer__nav c-navlist c-navlist--dark">
<div class="c-navlist__category">
<div class="c-navlist__headline">小説家になろうについて</div>
<ul class="c-navlist__list">
<li class="c-navlist__list-item"><a href="//syosetu.com/site/about/">サイト案内</a></li>
<li class="c-navlist__list-item"><a href="//syosetu.com/site/guideline/">ガイドライン</a></li>
<li class="c-navlist__list-item"><a href="//syosetu.com/site/man/">各種マニュアル</a></li>
<li class="c-navlist__list-item"><a href="//syosetu.com/site/rule/">利用規約</a></li>
<li class="c-navlist__list-item"><a href="//syosetu.com/site/privacy/">プライバシーポリシー</a></li>
<li class="c-navlist__list-item"><a href="https://hinaproject.co.jp/">運営会社</a></li>
</ul>
</div>

<div class="c-navlist__category">
<div class="c-navlist__headline">お困りの方は</div>
<ul class="c-navlist__list">
<li class="c-navlist__list-item"><a href="//syosetu.com/bbs/attention/">質問板</a></li>
<li class="c-navlist__list-item"><a href="//syosetu.com/help/top/">ヘルプ</a></li>
<li class="c-navlist__list-item"><a href="//ssl.syosetu.com/inquire/input/">お問い合わせ</a></li>
</ul>
</div>

<div class="c-navlist__category">
<div class="c-navlist__headline">小説家になろうグループ</div>
<ul class="c-navlist__list">
<li class="c-navlist__list-item"><a href="//syosetu.com/">小説家になろう</a></li>
<li class="c-navlist__list-item"><a href="//yomou.syosetu.com/">小説を読もう！</a></li>
<li class="c-navlist__list-item"><a href="//pdfnovels.net/">タテ書き小説ネット</a></li>
<li class="c-navlist__list-item"><a href="//lovenove.syosetu.com/">ラブノベ</a></li>
<li class="c-navlist__list-item"><a href="//mitemin.net/">みてみん</a></li>
<li class="c-navlist__list-item"><a href="//dev.syosetu.com/">なろうデベロッパー</a></li>
<li class="c-navlist__list-item"><a href="//syosetu.com/site/group/">なろうグループ一覧</a></li>
<li class="c-navlist__list-item"><a href="//mid.syosetu.com/">ミッドナイトノベルズ</a></li>
</ul>
</div>

<div class="c-navlist__category">
<div class="c-navlist__headline">小説を探す</div>
<ul class="c-navlist__list">
<li class="c-navlist__list-item"><a href="//yomou.syosetu.com/search.php">小説検索</a></li>
<li class="c-navlist__list-item"><a href="//yomou.syosetu.com/search/keyword/">人気キーワード</a></li>
<li class="c-navlist__list-item"><a href="//syosetu.com/pickup/list/">小説PickUp！</a></li>
<li class="c-navlist__list-item"><a href="//yomou.syosetu.com/reviewlist/list/">イチオシレビュー</a></li>
<li class="c-navlist__list-item"><a href="//syosetu.com/syuppan/list/">書報 (出版作品紹介)</a></li>
<li class="c-navlist__list-item"><a href="//yomou.syosetu.com/rireki/list/">閲覧履歴</a></li>
<li class="c-navlist__list-item"><a href="//yomou.syosetu.com/nolist/nopointlist/">未評価作品一覧</a></li>
<li class="c-navlist__list-item"><a href="//yomou.syosetu.com/nolist/noimpressionlist/">未感想作品一覧</a></li>
</ul>
</div>
</div>
</div><!-- p-footer -->
</body>
</html>
`

func Test_isNarouLoginPage(t *testing.T) {
	type args struct {
		html string
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		{
			name: "loginPage",
			args: args{NaroWatcher_TestHtml},
			want: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			page, err := NewPageFromText(tt.args.html)
			if err != nil {
				t.Error(err)
			}
			if got := isNarouLoginPage(page); got != tt.want {
				t.Errorf("isNarouLoginPage() = %v, want %v", got, tt.want)
			}
		})
	}
}
