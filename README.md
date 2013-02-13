Twitter Client for Terminal (tweet-nodejs)
===========

## What is this?
Rubygemsで公開されている[tw](http://shokai.github.com/tw/)がカッコ良かったので、
真似てNode.jsで作ってみたターミナル用Twitterクライアントです。

twに比べて機能は不足しています。

## How to use?

ダウンロードして初期設定

※node.jsとnpmが入っている前提です

    npm -g install tweet-nodejs
    
    または
    
    git clone https://github.com/fukei/tweet-nodejs.git
    cd tweet-nodejs
    npm install

ユーザ登録。ブラウザで認証して表示されたPINコードを取得して入力。

    tweet -a
    oauth_token : XXXXXX
    oauth_token_secret : XXXXXX
    Open this URL your browser. : https://twitter.com/oauth/authenticate?oauth_token=XXXXXX
    And input PIN code : ←PINを入力

最新30件のTL取得

    tweet -t 30
    
ツイート

    tweet 'tweet message'
    
リプライ

    tweet -r REPLY_ID '@USER reply message.'

## Release Note

### 0.0.1 (2013/02/13)
* 初版: アカウント登録、タイムライン表示、つぶやく、返信機能に対応 


## TODO
* マルチユーザ対応
* 最後に取得したTLをローカルキャッシュする
* 毎回TL取得するんじゃなくて基準時間(1min)以内だったらキャッシュを表示する
* オブジェクト指向プログラミングに書きなおし
* Reply時の@ユーザ名の自動入力補助
  * 自分の名前を抜く
  * 日本語replyするときにバックスペースでカーソル位置がズレる
  * reply相手以外を削除できるようにする
* APIの残り回数を表示する
* Replyされてるメッセージの表示形式を検討する(話の流れが分からない)
* @ユーザ名のカラー対応(256colorいけるときは256色で)
* pipe処理の対応
* 投稿時に日本語でカーソル位置がズレる対策

## DONE
* jsonで結果を取得するパラメータの追加
  * Reply時の@ユーザ名の自動入力補助 基本機能
* 共通機能の関数化
* 取得するTLの数を設定できるように
* npm, githubに登録する
