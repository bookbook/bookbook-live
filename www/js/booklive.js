
$(function() {
    document.addEventListener("deviceready", openBookLive, false);
});

function openBookLive() {
    var ref = window.open("https://bookbook-live.appspot.com", '_blank', 'location=no,presentationstyle=fullscreen,toolbar=yes,transitionstyle=coververtical');
    ref.addEventListener('loaderror', function(){ref.close()});
    setTimeout(function(){
        $("#btnOpen button").html("接続に失敗しました<br>タップして読み込んでください");
    }, 3000)
}