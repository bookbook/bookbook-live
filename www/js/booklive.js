

//Twitter settings
var callbackUrl = "https://bookbook-live.appspot.com/";
var oauth = OAuth({
    consumerKey: "JwNiIBGN3TvGNFSjOacaAwr16",
    consumerSecret: "8dipQUFo74WED4UJFreR0F4lcFnlQgRsGn76PVd9ItzVCjg3bE",
    callbackUrl: callbackUrl,
    requestTokenUrl: "https://api.twitter.com/oauth/request_token",
    authorizationUrl: "https://api.twitter.com/oauth/authorize",
    accessTokenUrl: "https://api.twitter.com/oauth/access_token"
});

$(function() {
    
    $("#connect").on("click", function(){
        connect();
    })
    
    loadSchedule();
    

})

function openbr() {
    var aaa = window.open("https://bookbook-live.appspot.com", '_blank', 'location=no,presentationstyle=fullscreen,toolbar=no')
//    aaa.addEventListener('loadstop', function() {
//        aaa.insertCSS({file: "browse.css"});
//    });
}

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
        loadSchedule();
        browser.close();
      }, function (data) {
        console.log(JSON.stringify(data));
      });
    }
  });
}

function loadSchedule(){

    $.get(
    	'https://bookbook-live.appspot.com/api/get_events',
		{'arg' : 'schedule'},
		function(data){
            if (data){
			    $('#event_list').append($(data).filter("#events").html());
            } else {
                alert("can not load events");
            }

		}
    )
}
