
function loadEvent(arg){
    $.get(
        'https://bookbook-live.appspot.com/api/get_events',
		{'arg' : arg},
		function(data){
			$('#'+arg).html($(data).filter("#events").html());
			$('#'+arg+'_cursor').html($(data).filter("#cursor").html());
                        
            //追加ボタンのcss処理
            $(".add:contains('-')").css('color', 'gray')
            $(".add:contains('+')").css('color', 'dodgerblue')
            //お気に入りボタンのcss処理
        	$(".fav:contains('☆')").css('color', 'gray')
        	$(".fav:contains('★')").css('color', '#ffc800')
		}
	);
};


$(document).on('pageinit', '#timeline_page', function(){
    loadEvent('timeline')
});

$(document).on('pageinit', '#favorite_page', function(){
    loadEvent('favorite')
});

$(function(){
    $.get(
        'https://bookbook-live.appspot.com/api/get_user',
        {'arg':'login'},
        function(data){
            if (data=="nouser"){
                $("#login").popup("open");
            } else{
                loadEvent('schedule');
            }
        }
    )
});


function twitter_connect() {
    var browser = window.open('https://bookbook-live.appspot.com/twitter_aouth', '_blank', 'location=yes');
    browser.addEventListener('loadstart', function(event) {
        if (event.url == 'https://bookbook-live.appspot.com') {
            $("#login").popup("close");
            loadEvent('schedule');
            browser.close();
        }
    });

}

//jsOauthの設定
var callbackUrl = "https://bookbook-live.appspot.com/twitter_callback";
var oauth = OAuth({
    consumerKey: "VqPKanuHnMhj3zhnElWX3EQNR",
    consumerSecret: "XdToFZS01cKk20yWjwx86wMgP5gPtYGOwKglffiZ8zV32J0rdu",
    callbackUrl: callbackUrl,
    requestTokenUrl: "https://api.twitter.com/oauth/request_token",
    authorizationUrl: "https://api.twitter.com/oauth/authorize",
    accessTokenUrl: "https://api.twitter.com/oauth/access_token"
});
function connect() {
    oauth.fetchRequestToken(function (url) {
      console.log("Opening Request Token URL: " + url);
      showAuthWindow(url);
    }, function (data) {
      console.log(JSON.stringify(data));
    });
}
function showAuthWindow(url) {
    var browser = window.open(url, '_blank', 'location=yes');
    browser.addEventListener('loadstart', function(event) {
        if (event.url.indexOf(callbackUrl) >= 0) {
            event.url.match(/oauth_verifier=([a-zA-Z0-9]+)/);
            oauth.setVerifier(RegExp.$1);
    
//            $("#login").popup("close");
//            loadEvent('schedule');
//            browser.close();
        }
    });
}


