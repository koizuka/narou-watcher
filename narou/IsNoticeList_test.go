package narou

import (
	"bytes"
	"github.com/PuerkitoBio/goquery"
	"github.com/google/go-cmp/cmp"
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

const TestHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="日本最大級のWeb小説投稿サイト「小説家になろう」。作品数100万以上、登録者数240万人以上、小説閲覧数月間25億PV以上。パソコン・スマートフォンのどれでも使えて完全無料！">
<meta name="keywords" content="Web小説, ネット小説,携帯小説,ケータイ小説,オンライン小説,縦書き小説,小説投稿,小説投稿サイト">
<meta name="format-detection" content="telephone=no">
<meta name="viewport" content="width=1088, maximum-scale=1.0, user-scalable=yes">

<title>更新チェック中のブックマーク | ユーザページ | 小説家になろう</title>

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

<div class="remodal c-modal" data-remodal-id="delete-bookmark">
<button class="c-modal__close" data-remodal-action="close"></button>
<div class="c-modal__group">
<p class="c-modal__headline">「<span class="js-delete_title"></span>」のブックマークを解除します。よろしいですか？</p>
</div><!-- /.c-modal__group -->
<div class="c-modal__group c-button-box-right">
<div class="c-button-combo c-button-combo--horizon">
<button class="c-button c-button--outline" data-remodal-action="close">キャンセル</button>
<a class="c-button c-button--delete js-delete_bookmark">実行する</a>
</div>
</div><!-- /.c-modal__group -->
</div><!-- /.c-modal -->

<div class="l-header">
<div class="p-up-header-pc">
<div class="p-up-header-pc__content">

<h1 class="p-up-header-pc__logo">
<a href="https://syosetu.com/"><img src="https://static.syosetu.com/view/images/common/logo_narou.png?psawph" alt="小説家になろう"></a>
</h1>

<ul class="p-up-header-pc__nav">
<li class="p-up-header-pc__nav-item">
<div class="p-up-header-pc__account">
<span class="p-up-header-pc__nav-label p-up-header-pc__username">
<span class="p-icon p-icon--user p-up-header-pc__nav-icon" aria-hidden="true"></span>koizuka</span>
<div class="p-up-header-pc__account-menu">
<div class="p-up-header-pc__account-detail">
koizuka [ID:(MyUserID)]
</div>
<ul class="p-up-header-pc__account-menu-list">
<li><a href="https://syosetu.com/useredit/input/">ユーザ情報編集</a></li>
<li><a href="https://mypage.syosetu.com/(MyUserID)/">マイページ</a></li>
</ul>
<ul class="p-up-header-pc__account-menu-list">
<li><a href="https://syosetu.com/login/logout/"><span class="p-icon p-icon--logout" aria-hidden="true"></span>&nbsp;ログアウト</a></li>
</ul>
</div><!-- /.p-up-header-pc__account-menu -->
</div><!-- /.p-up-header-pc__account -->
</li>
<li class="p-up-header-pc__nav-item">
<a class="p-up-header-pc__nav-label" href="https://syosetu.com/messagebox/top/"><span class="p-icon p-icon--envelope p-up-header-pc__nav-icon" aria-hidden="true"></span>メッセージ</a>
</li>
<li class="p-up-header-pc__nav-item">
<a class="p-up-header-pc__nav-label" href="https://syosetu.com/user/top/"><span class="p-icon p-icon--home p-up-header-pc__nav-icon" aria-hidden="true"></span>ユーザホーム</a>
</li>

<li class="p-up-header-pc__nav-item">
<div class="p-up-header-pc__gmenu">
<span class="p-icon p-icon--menubars p-up-header-pc__nav-icon" aria-hidden="true"></span>メニュー
<div class="p-up-header-pc__gmenu-list">
<div class="p-up-header-pc__gmenu-column">
<div class="p-up-header-pc__gmenu-headline"><span class="p-icon p-icon--star-line" aria-hidden="true"></span>お気に⼊り</div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/favnovelmain/list/">ブックマーク</a></div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/favuser/list/">お気に⼊りユーザ</a></div>

<div class="p-up-header-pc__gmenu-headline"><span class="p-icon p-icon--pen" aria-hidden="true"></span>投稿</div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/usernovel/list/">作品の作成・編集</a></div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/novelseriesmanage/list/">シリーズ設定</a></div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/novelinitialsetting/updateinput/">作品初期設定</a></div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/userwrittingnovel/backup/">執筆バックアップ</a></div>

<div class="p-up-header-pc__gmenu-headline"><span class="p-icon p-icon--article" aria-hidden="true"></span>活動報告</div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/userblog/list/">活動報告</a></div>
</div><!-- /.p-up-header-pc__gmenu-column -->

<div class="p-up-header-pc__gmenu-column">
<div class="p-up-header-pc__gmenu-headline"><span class="p-icon p-icon--comment-dots-line" aria-hidden="true"></span>リアクション</div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/usernovelimpression/passivelist/">感想</a></div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/usernovelreview/passivelist/">イチオシレビュー</a></div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/userblogcomment/passivelist/">活動報告コメント</a></div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/usernovelreport/passivelist/">誤字報告</a></div>

<div class="p-up-header-pc__gmenu-headline"><span class="p-icon p-icon--block" aria-hidden="true"></span>ブロック・ミュート</div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/userblock/list/">ユーザのブロック</a></div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/mute/list/">ユーザのミュート</a></div>

<div class="p-up-header-pc__gmenu-headline"><span class="p-icon p-icon--home" aria-hidden="true"></span>Xユーザページ</div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/xuser/top/">Xユーザホーム</a></div>
</div><!-- /.p-up-header-pc__gmenu-column -->

<div class="p-up-header-pc__gmenu-column">
<div class="p-up-header-pc__gmenu-headline"><span class="p-icon p-icon--search" aria-hidden="true"></span>作品を探す</div>
<div class="p-up-header-pc__gmenu-item"><a href="https://yomou.syosetu.com/search.php">作品検索</a></div>
<div class="p-up-header-pc__gmenu-item"><a href="https://yomou.syosetu.com/rireki/list/">閲覧履歴</a></div>
<div class="p-up-header-pc__gmenu-item"><a href="https://yomou.syosetu.com/rank/top/">ランキング</a></div>
<div class="p-up-header-pc__gmenu-item"><a href="https://yomou.syosetu.com/reviewlist/list/">イチオシレビュー一覧</a></div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/pickup/list/">⼩説PickUp!一覧</a></div>

<div class="p-up-header-pc__gmenu-headline"><span class="p-icon p-icon--question" aria-hidden="true"></span>お困りの方は</div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/helpcenter/top/">ヘルプセンター</a></div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/bbs/top/">質問板</a></div>
<div class="p-up-header-pc__gmenu-item"><a href="https://syosetu.com/inquire/input/">お問い合わせ</a></div>
</div><!-- /.p-up-header-pc__gmenu-column -->
</div><!-- /.p-up-header-pc__gmenu-list -->
</div><!-- /.p-up-header-pc__gmenu -->
</li>
</ul><!-- /.p-up-header-pc__nav -->
</div><!-- /.p-up-header-pc__content -->
</div><!-- /.p-up-header -->

</div><!-- .l-header -->

<div class="l-page-title">
<div class="c-up-page-title">
<h2 class="c-up-page-title__text">ブックマーク</h2>
</div><!-- /.c-up-page-title -->
</div><!-- /.l-page-title -->

<div class="l-container">
<div class="l-main">
<div class="c-up-page-description">
<div class="c-up-page-description__group">お気に入りの作品を登録できる機能です。<a class="c-up-page-description__help" href="https://syosetu.com/helpcenter/helpcategory/helpcategoryid/6#22" target="_blank">ヘルプを見る</a></div>
</div><!-- /.c-up-page-description -->
<h3 class="c-up-headline">ブックマーク一覧</h3>

<div class="c-up-tab">
<div class="c-up-tab__item">
<a class="c-up-tab__label" href="https://syosetu.com/favnovelmain/list/">カテゴリ別</a>
</div><!-- /.c-up-tab__item -->
<div class="c-up-tab__item is-active">
<a  class="c-up-tab__label" href="https://syosetu.com/favnovelmain/isnoticelist/">更新チェック中</a>
</div><!-- /.c-up-tab__item -->
</div><!-- /.c-up-tab -->


<div class="c-up-list-tools">
<div class="c-up-hit-number"><span class="c-up-hit-number__item">
全306件中</span><span class="c-up-hit-number__item">1件目～30件目を表示</span>
</div><!-- /.c-up-hit-number -->
<div class="c-up-list-tools__pager">
<div class="c-up-pager c-up-pager--sm">
<span class="c-up-pager__item is-disabled" title="最初のページ"><span class="p-icon p-icon--angle-double-left" aria-hidden="true"></span></span>

<span class="c-up-pager__item is-disabled" title="前のページ"><span class="p-icon p-icon--angle-left" aria-hidden="true"></span> 前</span>

<div class="c-up-pager__num">
<span class="c-up-pager__item is-current">1</span><a href="?p=2" class="c-up-pager__item" title="2ページ">2</a><a href="?p=3" class="c-up-pager__item" title="3ページ">3</a><a href="?p=4" class="c-up-pager__item" title="4ページ">4</a><a href="?p=5" class="c-up-pager__item" title="5ページ">5</a>
</div><!-- /.c-up-pager__num -->

<a href="?p=2" class="c-up-pager__item" title="次のページ">次 <span class='p-icon p-icon--angle-right' aria-hidden='true'></span></a>

<a href="?p=11" class="c-up-pager__item" title="最後のページ"><span class='p-icon p-icon--angle-double-right' aria-hidden='true'></span></a>

</div><!-- /.c-up-pager -->
</div><!-- /.c-up-list-tools__pager -->
</div><!-- /.c-up-list-tools -->

<div class="c-up-panel">
<form method="post" action="/favnovelmain/update/?token=xxxx">
<div class="c-up-panel__body">
<ul class="c-up-panel__list js-favnovel">
<li class="c-up-panel__list-item p-up-bookmark-item">
<div class="p-up-bookmark-item__header">
<div class="p-up-bookmark-item__title">
<a href="https://ncode.syosetu.com/作品1/"><span class="c-up-label c-up-label--novel-long">連載</span>&nbsp;タイトル1
</a>
</div><!-- /.p-up-bookmark-item__title -->

<div class="p-up-bookmark-item__menu c-up-dropdown c-up-dropdown--hover">
<span class="p-icon p-icon--ellipsis-v" aria-hidden="true"></span>設定
<ul class="c-up-dropdown__list c-up-dropdown__list--delimit">
<li class="c-up-dropdown__item"><a href="/favnovelmain/updateinput/useridfavncode/xxxx_xxxx?isnotice=true">設定変更</a></li>
<li class="c-up-dropdown__item c-up-dropdown__item--delete js-delete_bookmark_confirm" data-remodal-target="delete-bookmark" data-useridfavncode="xxxx_xxxx" data-title="タイトル1"><a href="JavaScript:void(0);">登録解除</a></li>
</ul><!-- /.c-up-dropdown__list -->
</div><!-- /.p-up-bookmark-item__menu -->
</div><!-- /.p-up-bookmark-item__header -->

<div class="p-up-bookmark-item__info-button">
<div class="p-up-bookmark-item__info">

<div class="p-up-bookmark-item__data"><a href="https://mypage.syosetu.com/author1" class="p-up-bookmark-item__data-item">作者1</a><span class="p-up-bookmark-item__data-item">全2エピソード</span><span class="p-up-bookmark-item__data-item p-up-bookmark-item__complete">完結済</span></div>

<div class="p-up-bookmark-item__status">
<span class="p-up-bookmark-item__date">2000年01月02日 03時04分&nbsp;更新</span>
<span class="p-up-bookmark-item__setting">
<span class="p-up-bookmark-item__notice" title="更新通知ON"></span>
<span class="p-up-bookmark-item__private" title="非公開ブックマーク"></span>
</span><!-- /.p-up-bookmark-item__setting -->
</div><!-- /.p-up-bookmark-item__status -->
</div><!-- /.p-up-bookmark-item__info -->
<div class="p-up-bookmark-item__button-group">
<a href="https://ncode.syosetu.com/作品1/1/" class="p-up-bookmark-item__button c-button c-button--outline c-button__text-sm c-button--sm"><span class="p-icon p-icon--siori" aria-hidden="true" class="p-up-bookmark-item__siori-icon"></span>ep.1</a>
<a href="https://ncode.syosetu.com/作品1/2/" class="p-up-bookmark-item__button c-button c-button--primary c-button__text-sm c-button--sm">ep.2<span class="p-up-bookmark-item__unread">未読<span class="p-up-bookmark-item__unread-num">1<span><span></a>
</div><!-- /.p-up-bookmark-item__button-group -->
</div><!-- /.p-up-bookmark-item__info-button -->


</li><!-- /.c-up-panel__list-item -->
<li class="c-up-panel__list-item p-up-bookmark-item">
<div class="p-up-bookmark-item__header">
<div class="p-up-bookmark-item__title">
<a href="https://ncode.syosetu.com/作品2/"><span class="c-up-label c-up-label--novel-long">連載</span>&nbsp;タイトル2
</a>
</div><!-- /.p-up-bookmark-item__title -->

<div class="p-up-bookmark-item__menu c-up-dropdown c-up-dropdown--hover">
<span class="p-icon p-icon--ellipsis-v" aria-hidden="true"></span>設定
<ul class="c-up-dropdown__list c-up-dropdown__list--delimit">
<li class="c-up-dropdown__item"><a href="/favnovelmain/updateinput/useridfavncode/xxxx_xxxx?isnotice=true">設定変更</a></li>
<li class="c-up-dropdown__item c-up-dropdown__item--delete js-delete_bookmark_confirm" data-remodal-target="delete-bookmark" data-useridfavncode="xxxx_xxxx" data-title="タイトル2"><a href="JavaScript:void(0);">登録解除</a></li>
</ul><!-- /.c-up-dropdown__list -->
</div><!-- /.p-up-bookmark-item__menu -->
</div><!-- /.p-up-bookmark-item__header -->

<div class="p-up-bookmark-item__info-button">
<div class="p-up-bookmark-item__info">

<div class="p-up-bookmark-item__data"><a href="https://mypage.syosetu.com/author2" class="p-up-bookmark-item__data-item">作者2</a><span class="p-up-bookmark-item__data-item">全4エピソード</span></div>

<div class="p-up-bookmark-item__status">
<span class="p-up-bookmark-item__date">2001年02月03日 04時05分&nbsp;更新</span>
<span class="p-up-bookmark-item__setting">
<span class="p-up-bookmark-item__notice" title="更新通知ON"></span>
<span class="p-up-bookmark-item__private" title="非公開ブックマーク"></span>
</span><!-- /.p-up-bookmark-item__setting -->
</div><!-- /.p-up-bookmark-item__status -->
</div><!-- /.p-up-bookmark-item__info -->
<div class="p-up-bookmark-item__button-group">
<a href="https://ncode.syosetu.com/作品2/3/" class="p-up-bookmark-item__button c-button c-button--outline c-button__text-sm c-button--sm"><span class="p-icon p-icon--siori" aria-hidden="true" class="p-up-bookmark-item__siori-icon"></span>ep.3</a>
<a href="https://ncode.syosetu.com/作品2/4/" class="p-up-bookmark-item__button c-button c-button--primary c-button__text-sm c-button--sm">ep.2<span class="p-up-bookmark-item__unread">未読<span class="p-up-bookmark-item__unread-num">1<span><span></a>
</div><!-- /.p-up-bookmark-item__button-group -->
</div><!-- /.p-up-bookmark-item__info-button -->


</li><!-- /.c-up-panel__list-item -->
<li class="c-up-panel__list-item p-up-bookmark-item">
<div class="p-up-bookmark-item__header">
<div class="p-up-bookmark-item__title">
<a href="https://ncode.syosetu.com/作品3/"><span class="c-up-label c-up-label--novel-long">連載</span>&nbsp;タイトル3
</a>
</div><!-- /.p-up-bookmark-item__title -->

<div class="p-up-bookmark-item__menu c-up-dropdown c-up-dropdown--hover">
<span class="p-icon p-icon--ellipsis-v" aria-hidden="true"></span>設定
<ul class="c-up-dropdown__list c-up-dropdown__list--delimit">
<li class="c-up-dropdown__item"><a href="/favnovelmain/updateinput/useridfavncode/xxxx_xxxx?isnotice=true">設定変更</a></li>
<li class="c-up-dropdown__item c-up-dropdown__item--delete js-delete_bookmark_confirm" data-remodal-target="delete-bookmark" data-useridfavncode="xxxx_xxxx" data-title="タイトル3"><a href="JavaScript:void(0);">登録解除</a></li>
</ul><!-- /.c-up-dropdown__list -->
</div><!-- /.p-up-bookmark-item__menu -->
</div><!-- /.p-up-bookmark-item__header -->

<div class="p-up-bookmark-item__info-button">
<div class="p-up-bookmark-item__info">
<div class="p-up-bookmark-item__data"><a href="https://mypage.syosetu.com/author3" class="p-up-bookmark-item__data-item">作者3</a><span class="p-up-bookmark-item__data-item">全3エピソード</span></div>
<div class="p-up-bookmark-item__status">
<span class="p-up-bookmark-item__date">最新掲載日：2002年03月04日 05時06分</span>
<span class="p-up-bookmark-item__setting">
<span class="p-up-bookmark-item__notice" title="更新通知ON"></span>
<span class="p-up-bookmark-item__private" title="非公開ブックマーク"></span>
</span><!-- /.p-up-bookmark-item__setting -->
</div><!-- /.p-up-bookmark-item__status -->
</div><!-- /.p-up-bookmark-item__info -->
<div class="p-up-bookmark-item__button-group">
<a class="p-up-bookmark-item__button c-button c-button--outline c-button__text-sm c-button--sm" href="https://ncode.syosetu.com/作品3/1/">最初から読む</a>
<a href="https://ncode.syosetu.com/作品3/3/" class="p-up-bookmark-item__button c-button c-button--outline c-button__text-sm c-button--sm">最新 ep.3</a>
</div><!-- /.p-up-bookmark-item__button-group -->
</div><!-- /.p-up-bookmark-item__info-button -->


</li><!-- /.c-up-panel__list-item -->
</ul>
</div><!-- /.c-up-panel__body -->
</form>
</div><!--/.c-up-panel-->

<div class="c-up-list-tools">
<div class="c-up-hit-number"><span class="c-up-hit-number__item">
全306件中</span><span class="c-up-hit-number__item">1件目～30件目を表示</span>
</div><!-- /.c-up-hit-number -->
<div class="c-up-list-tools__pager">
<div class="c-up-pager c-up-pager--sm">
<span class="c-up-pager__item is-disabled" title="最初のページ"><span class="p-icon p-icon--angle-double-left" aria-hidden="true"></span></span>

<span class="c-up-pager__item is-disabled" title="前のページ"><span class="p-icon p-icon--angle-left" aria-hidden="true"></span> 前</span>

<div class="c-up-pager__num">
<span class="c-up-pager__item is-current">1</span><a href="?p=2" class="c-up-pager__item" title="2ページ">2</a><a href="?p=3" class="c-up-pager__item" title="3ページ">3</a><a href="?p=4" class="c-up-pager__item" title="4ページ">4</a><a href="?p=5" class="c-up-pager__item" title="5ページ">5</a>
</div><!-- /.c-up-pager__num -->

<a href="?p=2" class="c-up-pager__item" title="次のページ">次 <span class='p-icon p-icon--angle-right' aria-hidden='true'></span></a>

<a href="?p=11" class="c-up-pager__item" title="最後のページ"><span class='p-icon p-icon--angle-double-right' aria-hidden='true'></span></a>

</div><!-- /.c-up-pager -->
</div><!-- /.c-up-list-tools__pager -->
</div><!-- /.c-up-list-tools -->

<div class="c-ad">
<div id="80f3793d724f656f3c8d5d34b530240b">
<script type="text/javascript">
microadCompass.queue.push({
"spot": "80f3793d724f656f3c8d5d34b530240b",
"url": "${COMPASS_EXT_URL}",
"referrer": "${COMPASS_EXT_REF}"
});
</script>
</div>


</div><!-- /.c-ad -->
</div><!-- /.l-main -->
<div class="l-sidebar">
<div class="c-up-aside">
<div class="c-up-aside__box">
<div class="c-up-aside__nav">
<div class="c-up-aside__nav-headline">お気に入り</div>
<ul class="c-up-aside__nav-list">
<li class="c-up-aside__nav-item is-selected"><a href="https://syosetu.com/favnovelmain/list/">ブックマーク</a></li>
<li class="c-up-aside__nav-item"><a href="https://syosetu.com/favuser/list/">お気に⼊りユーザ</a></li>
</ul>
<div class="c-up-aside__nav-headline-secondary">Xユーザページ</div>
<ul class="c-up-aside__nav-list">
<li class="c-up-aside__nav-item"><a href="https://syosetu.com/favnovelmain18/list/">Xブックマーク</a></li>
<li class="c-up-aside__nav-item"><a href="https://syosetu.com/favuser18/list/">お気に⼊りXユーザ</a></li>
</ul>
</div><!-- /.c-up-aside__nav --></div><!-- /.c-up-aside__box -->
</div><!-- /.c-up-aside -->
<div class="c-ad">
<div id="1e3982f87c5c88f2c9de1d2c1fd4f1c9" >
<script type="text/javascript">
microadCompass.queue.push({
"spot": "1e3982f87c5c88f2c9de1d2c1fd4f1c9"
});
</script>
</div>


</div><!-- /.c-ad -->
</div><!-- /.l-sidebar -->
</div><!-- /.l-container -->

<div class="l-footer">
<div class="p-up-footer">
<div class="p-up-footer__body">
<div class="p-up-footer__nav">
<div class="p-up-footer__nav-item"><a href="https://syosetu.com/">小説家になろう</a></div>
<div class="p-up-footer__nav-item"><a href="https://yomou.syosetu.com/">小説を読もう！</a></div>
</div>

<div class="p-up-footer__nav">
<div class="p-up-footer__nav-item"><a href="https://syosetu.com/site/guideline/">ガイドライン</a></div>
<div class="p-up-footer__nav-item"><a href="https://syosetu.com/site/rule/">利用規約</a></div>
<div class="p-up-footer__nav-item"><a href="https://syosetu.com/site/privacy/">プライバシーポリシー</a></div>
</div>
<div class="p-up-footer__nav">
<div class="p-up-footer__nav-item"><a href="https://syosetu.com/helpcenter/top/">ヘルプセンター</a></div>
<div class="p-up-footer__nav-item"><a href="https://syosetu.com/inquire/input/">お問い合わせ</a></div>
</div>
</div><!-- /.p-up-footer__body -->
<div class="p-up-footer__foot">
<a class="p-up-footer__copyright" href="https://hinaproject.co.jp/">HinaProject Inc.</a>
</div>
</div><!-- /.p-up-footer --></div>

<script type="text/javascript" src="//d-cache.microad.jp/js/td_sn_access.js"></script>
<script type="text/javascript">
  microadTd.SN.start({})
</script>


<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-1TH9CF4FPC"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-1TH9CF4FPC');
  if(location.pathname.match(/^\/(bbs|bbstopic)\//)){
    gtag('config', 'G-XHLVBYBZNK');
  }
</script>

</body>
</html>
`

func TestParseIsNoticeList(t *testing.T) {
	datetime := func(s string) time.Time {
		const layout = "2006/01/02 15:04"
		result, _ := time.ParseInLocation(layout, s, NarouLocation)
		return result
	}
	wantTitle := "更新チェック中のブックマーク | ユーザページ | 小説家になろう"
	type args struct {
		html string
	}
	tests := []struct {
		name    string
		args    args
		want    *IsNoticeListPage
		wantErr error
	}{
		{"更新チェック中一覧テスト", args{TestHtml},
			&IsNoticeListPage{
				NumItems:     306,
				NextPageLink: "http://localhost/?p=2",
				Items: []IsNoticeList{
					{"ncode", "作品1", "タイトル1", "作者1", datetime("2000/01/02 03:04"), 1, 2, true},
					{"ncode", "作品2", "タイトル2", "作者2", datetime("2001/02/03 04:05"), 3, 4, false},
					{"ncode", "作品3", "タイトル3", "作者3", datetime("2002/03/04 05:06"), 0, 3, false},
				},
			},
			nil,
		},
		{"タイトルエラー", args{"<html><head><title>invalid title</title></head></html>"},
			nil,
			TitleMismatchError{"invalid title", "更新チェック中のブックマーク | ユーザページ | 小説家になろう"},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			page, err := NewPageFromText(tt.args.html)
			if err != nil {
				t.Errorf("ParseIsNoticeList() html error = %v", err)
			}
			got, err := ParseIsNoticeList(page, wantTitle)
			if !reflect.DeepEqual(err, tt.wantErr) {
				t.Errorf("ParseIsNoticeList()\n error = %v,\n wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				diff := cmp.Diff(tt.want, got)
				t.Errorf("ParseIsNoticeList() (-want +got)\n%v", diff)
			}
		})
	}
}
