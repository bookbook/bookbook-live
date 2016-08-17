
function loadEvent(arg){
    alert(arg)
    $.get(
        'https://bookbook-live.appspot.com/api/get_events',
		{'arg' : arg},
		function(data){
			$('#'+arg).html($(data).filter("#events").html());
			$('#'+arg+'_cursor').html($(data).filter("#cursor").html());
            
            alert("return:"+data);
            
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

//jsOauthの設定
var callbackUrl = "https://bookbook-live.appspot.com";
var oauth = OAuth({
    consumerKey: "JwNiIBGN3TvGNFSjOacaAwr16",
    consumerSecret: "8dipQUFo74WED4UJFreR0F4lcFnlQgRsGn76PVd9ItzVCjg3bE",
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
      oauth.fetchAccessToken(function (data) {
        $("#login").popup("close");
        loadEvent('schedule');
        browser.close();
        
      }, function (data) {
        console.log(JSON.stringify(data));
      });
    }
  });
}


