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
|-public-url 文字列|""|公開サーバーからreverse proxyするときの外に見えるアドレス(httpsにするときは必須)|
|-open||サーバーが起動したら公開アドレスをブラウザで開く(ローカル起動用)|

#### API
* `POST /login`
    * form post形式で、 `id` にIDまたはメールアドレス、`password` にパスワードを入れて POSTすると、「小説家になろう」にログインを試みます。
        * 成功したら HTTP status=200, レスポンスボディは true を返すとともに、セッションキーをクッキーで返します(後述)。このため、ログイン情報はサーバーに保持せず、ユーザーのブラウザに覚えさせます。
        * 失敗したら HTTP status=401 を返します。
* `GET /logout`
    * 「小説家になろう」からログアウトし、こちらのセッションクッキーも削除します。
* `GET /narou/isnoticelist`
    * ログイン状態でなければ HTTP status=401 を返します。
    * ログイン状態で、新着更新チェック中小説一覧の1ページ目を取得して以下のオブジェクトを配列にしてJSONにして返します。

|key|type|説明|
|---|---|---|
|base_url|string|小説自体のURL|
|update_time|ISO8601形式の日時|更新時刻(分解能は分まで)|
|bookmark|uint|しおりの部分番号|
|latest|uint|最終更新の部分番号|
|title|string|小説のタイトル|
|author_name|string|著者の名前|

* `GET /r18/isnoticelist`
    * Xユーザーページ(R18)の側の新着更新チェック中小説を取得します。

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
![image](https://user-images.githubusercontent.com/864587/114964390-9caa4c00-9ea9-11eb-99eb-692a510d39dc.png)

無事ログインすると、新着更新チェック中一覧の新しい順の数十件が出ます。タブをアクティブにするたびに更新します。また、5分ごとにも更新します。
未読数はページタイトルに設定されます。

![image](https://user-images.githubusercontent.com/864587/114964354-83090480-9ea9-11eb-9eb9-e67d889bd098.png)

未読があるとバッジにそれぞれの未読数がでて、そのうち一番更新が古い作品の色が変わっていてこの状態で Enter キーを押すとそれが新しいタブで開きます。
開いた作品を読んでしおりを更新してタブを閉じると、再びこのページに戻ってくると即座に更新され、次の未読が選択されます。

## 開発

### サーバーの開発
Go言語がビルドできる環境で
`go build`

で `./narou-watcher` のバイナリができます。

`./narou-watcher` を実行すると localhost:7676 をlisten して起動します。

`./narou-watcher -open` で起動すると、上記に加えてブラウザで `localhost:7676` を開きますが、フロントエンドは `https://koizuka.github.io/narou-watcher/` にデプロイされているものを reverse-proxyして読み込みます。

### フロントエンドの開発
`./narou-react` ディレクトリで、 node + yarn を入れた状態で
```bash
yarn install # (初回)
yarn start
```

でビルドしたフロントエンドを読み込む localhost:3000 が開き、localhost:7676 のサーバーに接続する動作をします。

## メモ

https://github.com/koizuka/scraper を使ってます。
