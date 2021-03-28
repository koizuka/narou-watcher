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

実行すると更新チェックサーバーが起動しつつ、新着更新リストがブラウザで表示されます。
未読があったら上に出るのでクリックで別タブで開いて1作品読めます。
![image](https://user-images.githubusercontent.com/864587/112756827-d7932f80-9021-11eb-99d1-6eda063df264.png)


## メモ

https://github.com/koizuka/scraper を使ってます。
