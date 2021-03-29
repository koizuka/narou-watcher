# narou-watcher
小説家になろうの新着小説をチェックしたい

## ビルド
Go言語がビルドできる & node + yarn を入れた環境で

`go build`

で `narou-watcher` のバイナリができます。

あと、 `cd narou-react` して、

```bash
yarn install
yarn build
```
でフロントエンドもビルドする必要があります。

## 実行
`./narou-watcher` でサーバーを実行します。

実行すると更新チェックサーバーが起動しつつ、新着更新リストがブラウザで表示されます(5分ごとまたはタブをアクティブにする毎に更新チェックします)。

初回はBASIC認証で小説家になろうの ID, password が聞かれ、入力すると以後cookieを `log/narou/cookie` というファイルに保存するので次回以降はすぐに動作します。
(このファイルを消すとログアウトw)

未読があったら上に出るのでクリックで別タブで開いて1作品読めます。読んだらブックマークを更新して、そのタブを閉じる、という使い方を想定しています。
![image](https://user-images.githubusercontent.com/864587/112756827-d7932f80-9021-11eb-99d1-6eda063df264.png)

サーバー終了は ctrl+C で(雑)。
残ったブラウザのページも閉じましょう。

## メモ

https://github.com/koizuka/scraper を使ってます。
