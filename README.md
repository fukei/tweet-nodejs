* Twitter Client for Terminal (tweet-nodejs)

* What is this?
 Rubygemsのtw(http://shokai.github.com/tw/)がカッコ良かったので、
 真似てNode.jsで作ってみたターミナル用Twitterクライアントです。
 twに比べて機能は不足しています。

* How to use?
 node tweet.js -a
 // ブラウザでPINコードを取得して入力
 node tweet.js -t 30 // get timeline (latest 30 rows)
 node tweet.js 'tweet message' // tweet
 node tweet.js -r REPLY_ID '@USER reply message.' // reply tweet

* Release Note
** 0.0.1 2013/02/12 初版: アカウント登録、タイムライン表示、つぶやく、返信機能に対応

---
* TODO
** マルチユーザ対応
** 最後に取得したTLをローカルキャッシュする
** 毎回TL取得するんじゃなくて基準時間(1min)以内だったらキャッシュを表示する
** npm, githubに登録する
** オブジェクト指向プログラミングに書きなおし
** Reply時の@ユーザ名の自動入力補助
*** 自分の名前を抜く
*** 日本語replyするときにバックスペースでカーソル位置がズレる
*** reply相手以外を削除できるようにする
** APIの残り回数を表示する
** Replyされてるメッセージの表示形式を検討する(話の流れが分からない)
** @ユーザ名のカラー対応(256colorいけるときは256色で)
** pipe処理の対応
** 投稿時に日本語でカーソル位置がズレる対策

* DEBUG

* DONE
** jsonで結果を取得するパラメータの追加
*** Reply時の@ユーザ名の自動入力補助 基本機能
** 共通機能の関数化
** 取得するTLの数を設定できるように
