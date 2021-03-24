# narou-watcher
小説化になろうの新着小説をチェックしたい

## ビルド
Go言語がビルドできる環境で

`go build`

で `narou-watcher` のバイナリができます。

## 実行
`./narou-watcher` で実行します。

いまのところ初回は ID, password が聞かれ、入力すると以後cookieを `log/narou/cookie` というファイルに保存するので次回以降はすぐに動作します。
(このファイルを消すとログアウトw)

手打ちが面倒なら、 login.txt にID, passwordを1行ずつ書いて
```bash
./narou-watcher < login.txt
```
で実行するといいかな。

実行すると、とりあえずユーザーページとXユーザーページのそれぞれの新着チェック小説をみて、更新があったら最大3件、ブックマークの次の部分をブラウザで開きます。

## メモ

https://github.com/koizuka/scraper を使ってます。
