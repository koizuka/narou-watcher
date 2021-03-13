# narou-watcher
小説化になろうの新着小説をチェックしたい

## 実行
いまのところ login.txt にID, passwordを1行ずつ書いて
```bash
go build && ./narou-watcher < login.txt
```
で実行すると取れる
なぜかcookieが保存されないのでログイン状態が継続されないなぁ
