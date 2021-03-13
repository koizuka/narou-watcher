# narou-watcher
小説化になろうの新着小説をチェックしたい

## 実行
いまのところ初回は login.txt にID, passwordを1行ずつ書いて
```bash
go build && ./narou-watcher < login.txt
```
で実行すると取れる。以後はcookieが永続化する

## メモ
https://github.com/juju/persistent-cookiejar は max-age がないクッキーを永続化してくれないので
https://github.com/orirawlings/persistent-cookiejar を使ったらいけた。神

