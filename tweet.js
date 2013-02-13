const ANSI = [
  '[31m',
  '[32m',
  '[33m',
  '[34m',
  '[35m',
  '[36m',
];

// config
process.env['NODE_CONFIG_DIR'] =  __dirname + '/config/';
var conf = require('config');
//console.log(conf);
var consumer_key = conf.consumer_key,
    consumer_secret = conf.consumer_secret,
    access_token = conf.token, 
    access_token_secret = conf.secret;

var argv = require('argv'),
    util = require('util');

argv.option([
  {
    name: 'timeline',
    short: 't',
    type: 'string',
    description: 'get your timeline. (default: 20, max: 200)',
    example: "'tweet -t (optional 50)' or 'tweet --timeline (optional 50)'"
  },
  {
    name: 'add',
    short: 'a',
    type: 'string',
    description: 'login with twitter',
    example: "'tweet -a USERNAME' or 'tweet --add USERNAME'"
  },
  {
    name: 'reply',
    short: 'r',
    type: 'string',
    description: 'reply tweet',
    example: "'tweet -r STATUS_ID STATUS' or 'tweet --reply STATUS_ID STATUS'"
  },
  {
    name: 'debug',
    short: 'd',
    type: 'string',
    description: 'debug tweet',
    example: "'tweet -d' or 'tweet --debug'"
  }
]);
// @debug
//console.log(argv.run());



// getRequestToken
if( argv.run().options.add ) {

  var OAuth = require('oauth').OAuth;
  var oa = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    consumer_key,
    consumer_secret,
    "1.0",
    null,
    "HMAC-SHA1"
  );

  oa.getOAuthRequestToken(function(error, request_oauth_token, request_oauth_token_secret, results){
    if (error) console.log(error);
    else {
      console.log('oauth_token :' + request_oauth_token);
      console.log('oauth_token_secret :' + request_oauth_token_secret);
      //console.log('results :' + util.inspect(results));
      console.log("Open this URL your browser. : https://twitter.com/oauth/authenticate?oauth_token=" + request_oauth_token);

      var readline = require('readline'),
          rl = readline.createInterface(process.stdin, process.stdout);
      rl.question('And input PIN code : ', function(code) {
        console.log('code : ' + code);
        rl.close();

        // getAccessToken
        oa.getOAuthAccessToken(request_oauth_token, request_oauth_token_secret, code, function(error2, oauth_access_token, oauth_access_token_secret, results2) {
          if (error2) console.log( error2 );
          else {
            conf.token = oauth_access_token;
            conf.secret = oauth_access_token_secret;
            conf.user_id = results2.user_id;
            conf.screen_name = results2.screen_name;
            console.log( 'oauth_access_token :' + oauth_access_token );
            console.log( 'oauth_access_token_secret :' + oauth_access_token_secret );
            console.log( 'accesstoken results :' + util.inspect(results2) );
          }
        });
      });
    }
  });
}


// getStatus ntwitter版
if( argv.run().options.timeline ) {

  var ntwitter = require('ntwitter');

  var nt = ntwitter({
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    access_token_key: access_token,
    access_token_secret: access_token_secret
  });

  var params = {};
  if( argv.run().options.timeline > 0 ) {
    var params = {
      count: argv.run().options.timeline
    }
  }
  //console.log( argv.run().options.timeline + 'params:' + util.inspect(params) );

  nt.getHomeTimeline(params, function(err, data){
    if(err) {
      console.log(err);
    }else{
      if( argv.run().options.debug ) {
        console.log(data);
      } else {
        //return false;
        for ( var i= data.length - 1; i >= 0; i-- ) {
          var date = new Date(data[i].created_at);
          var hour = date.getHours();
          var minute = date.getMinutes();
          if (hour < 10) { hour = "0" + hour; }
          if (minute < 10) { minute = "0" + minute; }
          var created_at = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" "+ hour +":"+ minute;
          var randnum = ( data[i].user.id % ANSI.length );
          console.log( "ID:" + data[i].id_str + " [" + created_at + "] " + data[i].user.name + "(" + putcolor("@" + data[i].user.screen_name, randnum) + ") : " + data[i].text );
        }
      }
    }
  });

}

// tweet, reply
if( argv.run().targets.length > 0 && !argv.run().options.timeline ) {

  var readline = require('readline'),
      rl = readline.createInterface(process.stdin, process.stdout);
  console.log('tweet : "' + argv.run().targets[0] + "\"? (" + argv.run().targets[0].length + " chars)");
  rl.question("[Y/n] ", function(answer) {
    //console.log('answer : ' + answer);
    rl.close();

    if ( answer == 'y' || answer == 'Y' ) {

      // set reply params
      if( argv.run().options.reply ) {
        var params = {
          in_reply_to_status_id: argv.run().options.reply,
          in_reply_to_status_id_str: argv.run().options.reply
        };
      } else {
        var params = {};
      }

      tweet( argv.run().targets, params );

    } else {
      console.log("Cancel.");
    }
  });
}


// make reply template
if( argv.run().targets.length < 1 && argv.run().options.reply ) {
  var in_reply_to_status_id_str = argv.run().options.reply;
  var ntwitter = require('ntwitter');
  var reply_txt = null;

  var nt = new ntwitter({
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    access_token_key: access_token,
    access_token_secret: access_token_secret
  });

  var params = {};
  nt.getHomeTimeline(params, function(err, data){
    if(err) {
      console.log(err);
    }else{

      //console.log(data);

      // @todo 毎回2回もAPI叩くのでキャッシュぐらいしろ
      for ( var i= data.length - 1; i >= 0; i-- ) {
        if( data[i].id_str == in_reply_to_status_id_str ) {

          // @todo メッセージの整形処理は共通関数化しる
          //console.log( data[i].text );
          var date = new Date(data[i].created_at);
          var hour = date.getHours();
          var minute = date.getMinutes();
          if (hour < 10) { hour = "0" + hour; }
          if (minute < 10) { minute = "0" + minute; }
          var created_at = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" "+ hour +":"+ minute;
          var randnum = ( data[i].user.id % ANSI.length );
          console.log( data[i].id_str + " [" + created_at + "] " + data[i].user.name + " " + putcolor("@" + data[i].user.screen_name, randnum) + " " + data[i].text );


          if( data[i].text.match(/@([^ ].*?) /g) ) {
            var txt = data[i].text.match(/@([^ ].*?) /g).join("");
          } else {
            var txt = '';
          }
          reply_txt = "@" + data[i].user.screen_name + " " + txt;
          //console.log("reply: " + reply_txt);
          break;
        }
      }

      var readline = require('readline'),
          rl = readline.createInterface(process.stdin, process.stdout);

      console.log('Input your Reply Message.');
      rl.setPrompt('reply : ' + reply_txt);
      rl.prompt();

      rl.on('line', function(answer) {
      //rl.question('Input your Reply Message.\nreply : ' + reply_txt, function(answer) {

        if( answer.length > 0 ){
          var tweet_txt = reply_txt + answer;

          if( reply_txt.length > 120 ) {
            rl.close();
            console.log("message length is over 120 chars.");
          } else {

            console.log('reply : "' + tweet_txt + "\"? (" + tweet_txt.length + " chars)");
            rl.question("[Y/n] ", function(answer) {
              //console.log('answer : ' + answer);

              rl.close();
              if ( answer == 'y' || answer == 'Y' ) {
                console.log("Reply : " + tweet_txt);

                // set reply params
                if( argv.run().options.reply ) {
                  var params = {
                    in_reply_to_status_id: argv.run().options.reply,
                    in_reply_to_status_id_str: argv.run().options.reply
                  };
                } else {
                  var params = {};
                }
                // tweet
                tweet( tweet_txt, params );

              } else {
                console.log("Cancel Reply.");
              }
            });

          }
        }
      });
    }
  });
}


// function putcolor
function putcolor( text, color ) {
  return '\033[4m\033' + ANSI[color] + text  + '\033[0m';
}

// function tweet
function tweet( tweet_txt, params ) {
  var ntwitter = require('ntwitter');

  var nt = new ntwitter({
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    access_token_key: access_token,
    access_token_secret: access_token_secret
  });

  if( !params ) {
    params = {};
  }

  nt.verifyCredentials(function (err, data) {
    //console.log(data);
  })
  .updateStatus( tweet_txt , params,
    function (err, data) {
      if( argv.run().options.debug ) {
        console.log(err, data);
      } else {
        console.log("Tweet: " + data.id_str);
      }
    }
  );
}
