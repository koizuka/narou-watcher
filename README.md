# narou-watcher
小説家になろうの新着小説をチェックしたい

## 構成

### サーバー (narou-watcher)
場所: `./`

「小説家になろう」の新着チェック中小説ページ(isnoticelist)をパースしてJSONにして返すAPIおよび、login/logout、ログインセッションクッキーを中継する仕組みを提供します。
デフォルトで port 7676 を listen します。

実行中に SIGINT (キーであれば CTRL+C ) を送ると正常にシャットダウンします。

#### コマンドライン引数
|option|default|説明|
|---|---|---|
|-port 数値|7676|HTTPリッスンポート|
|-reverse-proxy 文字列|https://koizuka.github.io/narou-watcher/|フロントエンドを読み込むアドレス|
|-log-dir 文字列|githubの作業ディレクトリのトップ/log/narou|開発ログの保存先|
|-public-url 文字列|""|公開サーバーからreverse proxyするときの外に見えるアドレス(httpsにするときは必須)。パスは `/` より下も可能。|
|-open|bool|サーバーが起動したら公開アドレスをブラウザで開く(ローカル起動用)|
|-debug|bool|-log-dir のディレクトリに通信ログを記録する(ローカル起動用)|

#### API
* `POST /login`
    * form post形式で、 `id` にIDまたはメールアドレス、`password` にパスワードを入れて POSTすると、「小説家になろう」にログインを試みます。
        * 成功したら HTTP status=200, レスポンスボディは true を返すとともに、セッションキーをクッキーで返します(後述)。このため、ログイン情報はサーバーに保持せず、ユーザーのブラウザに覚えさせます。
        * 失敗したら HTTP status=401 を返します。
* `GET /logout`
    * 「小説家になろう」からログアウトし、こちらのセッションクッキーも削除します。
* `GET /narou/isnoticelist` `GET /r18/isnoticelist`
    * ログイン状態でなければ HTTP status=401 を返します。
    * ログイン状態で、新着更新チェック中小説一覧の1ページ目を取得して以下のオブジェクトを配列にしてJSONにして返します。
    * クエリパラメータ `max_page` は指定分、次ページを合成する。1(初期値)なら指定ページのみ。

|key|type|説明|
|---|---|---|
|base_url|string|小説自体のURL|
|update_time|ISO8601形式の日時|更新時刻(分解能は分まで)|
|bookmark|uint|しおりの部分番号|
|latest|uint|最終更新の部分番号|
|title|string|小説のタイトル|
|author_name|string|著者の名前|

* `GET /narou/bookmarks` `GET /r18/bookmarks`
    * ブックマーク名一覧。以下のオブジェクトが登録分並ぶ。
      
|key|type|説明|
|---|---|---|
|no|number|1〜10|
|name|string|ブックマーク名|
|num_items|number|登録アイテム数|
    
* `GET /narou/bookmarks/:no` `GET /r18/bookmarsk/:no`
    * ブックマークの内容の1ページ
    * `:no` は1〜10
    * クエリパラメータ `page` をつけるとページング。1が先頭
    * クエリパラメータ `order` はソートオーダー。そのまま中継される。
      * `updated_at` がブックマーク更新順
      * `new` はブックマーク追加順
    * クエリパラメータ `max_page` は指定分、次ページを合成する。1(初期値)なら指定ページのみ。
      
| key         | type         | 説明               |
|-------------|--------------|------------------|
| base_url    | string       | 小説自体のURL         |
| update_time | ISO8601形式の日時 | 更新時刻(分解能は分まで)    |
| bookmark    | uint         | しおりの部分番号(短篇なら0)  |
| latest      | uint         | 最終更新の部分番号(短篇なら0) |
| title       | string       | 小説のタイトル          |
| author_name | string       | 著者の名前            |
| is_notice   | boolean      | 更新チェック中ならtrue    |
| completed   | boolean      | 完結ならtrue         |
| memo        | string       | メモ(存在する場合のみ)     |
    
* `GET /narou/novels/:ncode` `GET /r18/novels/:ncode`
    * 小説のncodeから概要ページの内容の抜粋を得る
      
|key|type| 説明                               |
|---|---|----------------------------------|
|base_url|string| 小説のURL                           |
|title|string| 小説のタイトル                          |
|abstract|string| 小説の概要(HTML)                      |
|author_name|string| 著者の名前                            |
|author_url|string| 著者ページのURL                        |
|keywords|[]string| キーワード                            |
|bookmark_url|string| ブックマークカテゴリURL(登録されていなければフィールドなし) |
|bookmark_no|uint| ブックマークのカテゴリ番号(登録されていなければフィールドなし) |
|bookmark_episode|uint| しおり部分(登録されていなければフィールドなし)         |
|contents|[]chapter| 章一覧                              |

  * chapter

| key      | type      | 説明                             |
|----------|-----------|--------------------------------|
| chapter  | string    | 章のタイトル。章設定をしていない作品にはこのキーは付かない。 |
| episodes | []episode | エピソード一覧                        |

  * episode

| key      | type    | 説明                  |
|----------|---------|---------------------|
| subtitle | string  | サブタイトル              |
| no       | uint    | エピソード番号(1〜)         |
| date     | ISO8601 | 投稿日時                |
| update   | ISO8601 | 改稿日時(改稿されていない場合は省略) |

  * `GET /narou/fav-user-updates`
    * お気に入りユーザーの更新情報

| key              | type   | 説明           |
|------------------|--------|--------------|
| r18passive_count | int    | 不明           |
| blog_list_html   | string | WIP(現在はHTML) |
| novel_list_html  | string | WIP(現在はHTML) |
| passive_count    | int    | 不明           |

#### ログインセッションクッキー
小説家になろうのサイトが Set-Cookieしてきたものの名前の前に `narou-` をつけてこちらのクッキーとして Set-Cookie にして返し、ブラウザに覚えさせます。

ブラウザからのリクエストについているクッキーに `narou-` で始まるものがあれば、この後の名前にして「小説家になろう」に送信します。

### フロントエンド (narou-react)
場所: `./narou-react/`

開くとまずサーバーのアドレスを以下のルールで決定します。
1. クエリパラメータに `server` があれば、その値をサーバーURLとする
2. 自分のURLをみて、URLスキームが `http:` であれば、 `localhost:7676` をサーバーURLとする
3. ドメインをみて、 `github.io` でなければ、自分のアドレスをサーバーURLとする
4. 上記に該当しなければエラー

ログイン状態で無ければ、ログイン画面が開きます。
![image](https://user-images.githubusercontent.com/864587/116656634-f7729600-a9c7-11eb-852d-71baa8ce3f91.png)

無事ログインすると、新着更新チェック中一覧の新しい順の数十件が出ます。タブをアクティブにするたびに更新します。また、5分ごとにも更新します。
未読数はページタイトルに設定されます。

![image](https://user-images.githubusercontent.com/864587/121801775-05c4fa80-cc74-11eb-8d9b-0feaf4cd333c.png)

未読があるとバッジにそれぞれの未読数がでて、そのうち一番更新が古い作品の色が変わっていてこの状態で Enter キーを押すとそれが新しいタブで開きます。
開いた作品を読んでしおりを更新してタブを閉じると、再びこのページに戻ってくると即座に更新され、次の未読が選択されます。

ログアウトは、一番下にボタンがあります。

## 開発

### サーバーの開発
Go言語がビルドできる環境で
`go build`

で `./narou-watcher` のバイナリができます。

`./narou-watcher` を実行すると localhost:7676 をlisten して起動します。

`./narou-watcher -open` で起動すると、上記に加えてブラウザで `localhost:7676` を開きますが、フロントエンドは `https://koizuka.github.io/narou-watcher/` にデプロイされているものを reverse-proxyして読み込みます。

### フロントエンドの開発
`./narou-react` ディレクトリで、 node + npm を入れた状態で
```bash
npm install # (初回)
npm start
```

でビルドしたフロントエンドを読み込む localhost:3000 が開き、localhost:7676 のサーバーに接続する動作をします。

### サーバーの公開
サーバー上でGitHubから git clone, go buildした `narou-watcher` に `-public-url` を設定して起動し、 nginxなどで `localhost:7676` (デフォルト) にリバースプロキシすることでhttpsな自分のサーバーで公開することができます。フロントエンドのコードも自作にする場合は `-reverse-proxy` 引数に置き場所のURLを与えます。

## メモ

https://github.com/koizuka/scraper を使ってます。
