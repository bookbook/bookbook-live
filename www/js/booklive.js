$(function(){

    console.log("start!");

    var current_scrollY;
    var touchst;
    var touchen;
    var currentPage;
    var user_schedule_name="";
    
    reloadEvents();
    
    //１．初期化処理
    //ログインされていなければログインへ誘導
    //ログイン済みの場合はスケジュールを読み込み
    $.get(
        'https://bookbook-live.appspot.com/api/get_user',
        {'arg':'login'},
        function(data){
            if (data=="nouser"){
                $("#login_modal").modal("show");
            } else{
                showPage('schedule');
                loadSettings();
            }
        }
    );

    //２．フッタメニューを選択してページの切り替え
    $("#menu_schedule").on("click", function(){
        showPage('schedule');
    });
    $("#menu_timeline").on("click", function(){
        showPage('timeline');
    });
    $("#menu_ranking").on("click", function(){
        showPage('ranking');
    });
    $("#menu_settings").on("click", function(){
        showPage('settings');
    });
    
    //３．インプットモーダルの表示
    $("#plus_btn").on("click", function(){
        $("#input_event_modal").modal('show');
    });
    //インプットモーダルの初期化
    $("#input_event_modal").on("show.bs.modal", function(){        
    	$("body").addClass("modal-open");

		//モーダルが開いているときに背景をスクロールさせない
		current_scrollY = $( window ).scrollTop(); 
		$( 'body' ).css( {
			position: 'fixed',
			width: '100%',
			top: -1 * current_scrollY
		} );

		//初期化（新規登録と編集を入れ替え）
		mode = $('#input_event_mode').val();
		if (mode=="reg"){
			$('#modal_title_reg').show();
			$('#modal_submit_reg').show();
			$('#modal_title_edit').hide();
			$('#modal_submit_edit').hide();
		}else if (mode=="edit"){
			$('#modal_title_reg').hide();
			$('#modal_submit_reg').hide();
			$('#modal_title_edit').show();
			$('#modal_submit_edit').show();
		};
        
        //一般用/運営用フォームを切り替え
        if($("#account_type_input:checked").val()=='1'){
            $("#input_form_0").hide();
            $("#input_form_1").show();
        }else{
            $("#input_form_0").show();
            $("#input_form_1").hide();
        }
	});
    //インプットモーダルの終了処理
	$("#input_event_modal").on("hidden.bs.modal", function(){
		$("body").removeClass("modal-open");

		//モーダルが開いているときに背景をスクロールさせない
		$("body").attr( { style: '' } );
		$("body").prop( { scrollTop: current_scrollY } );

		//インプット内容をクリア
		$('#input_event_mode').val("reg");
		$('#input_event_key').val("");		
		$('#event_type_input').selectpicker('val','1');
		$('#date_input').val("");
        $('#time_input').val("");
		$('#start_time_input').val("");
		$('#date_determined_input').val("");
		$('#title_input').val("");
		$('#text_input').val("");
        $('#date_input_0').val("");
    	$('#time_input_0').val("");
    	$('#title_input_0').val("");
    	$('#text_input_0').val("");
	});
    
	//日付入力bootstrap-datepickerの設定
	$('.date_input').datepicker({
		format: "yyyy/mm/dd",
		language: "ja",
		autoclose: true,
		orientation: "auto",
		container:'#input_event_modal'
	}).on('show', function(e){
		$('body').addClass('modal-open');
	}).on('hide', function(e) {
		$("body").removeClass("modal-open");
	});

	//時刻入力bootstrap-timepickerの設定
	$('.time_input').timepicker({
		//'template': 'modal',
		'showMeridian': false,
		'appendWidgetTo': '#input_event_modal'
	}).on('show.timepicker', function(e){
		$('body').addClass('modal-open');
	}).on('hide.timepicker', function(e) {
		$("body").removeClass("modal-open");
	});

	//セレクトボタンbootstrap-selectの設定
	$('.selectpicker').selectpicker({
		width: '100%'
	}).on('shown.bs.select', function(e){
		$('body').addClass('modal-open');
	}).on('hidden.bs.select', function(e){
		$("body").removeClass("modal-open");
	});
	$("#event_type_input").change(function () {
		type = $('#event_type_input').val();
		event_type_select(type);
	});

    //新規イベントの登録
    $('#input_event_submit').on('click', function() {
        account_type = $("#account_type_input:checked").val();
        //運営用
        if(account_type=='1'){
    		$.post(
    			url='https://bookbook-live.appspot.com/reg_event',
    			data={
    				'key'	: $('#input_event_key').val(),
    				'type'  : $('#event_type_input').val(),
    				'date'  : $('#date_input').val(),
    				'start_time' : $('#start_time_input').val(),
    				'date_determined': $('#date_determined_input').prop('checked'),
    				'time'  : $('#time_input').val(),
    				'title' : $('#title_input').val(),
    				'text'  : $('#text_input').val(),
    			}
    		);
        //一般用
        } else {
            $.post(
        		url='https://bookbook-live.appspot.com/reg_event',
    			data={
    				'key'	: $('#input_event_key').val(),
    				'date'  : $('#date_input_0').val(),
    				'time'  : $('#time_input_0').val(),
    				'title' : $('#title_input_0').val(),
    				'text'  : $('#text_input_0').val(),
    			}
    		);
        }
		setTimeout(function(){location.reload()},1000);
	});
    
	//イベント編集
	$("#contents").on('click', '.edit', function() {
    	//インプットボックスの初期化
		event_type = $(this).parents('.event').attr('type');
		if (event_type=="0"){event_type="2"}
		event_type_select(event_type);

		kari = $(this).parents('.event').find('.kari').text();
        
		$('#input_event_mode').val("edit");
		$('#input_event_key').val($(this).parents('.event').attr('key'));
		$('#event_type_input').selectpicker('val',event_type);
        event_date = $(this).parents('.event').find('.event_date_hide').text();
		$('#date_input').val(event_date);
        $('#date_input_0').val(event_date);
		if (event_type=="0" || event_type=="1" || event_type=="2"){
            event_time = $(this).parents('.event').find('.event_time').text();
			$('#time_input').val(event_time);
            $('#time_input_0').val(event_time);
		}
		if (event_type=="1") {
			$('#start_time_input').val($(this).parents('.event').find('.event_start_time').text());
		}
		if (kari=="（予定）"){ $('#date_determined_input').prop("checked",true) };
        event_title = $(this).parents('.event').find('.event_title').text();
		$('#title_input').val(event_title);
        $('#title_input_0').val(event_title);
        event_text = $(this).parents('.event').find('.event_text').text();
		$('#text_input').val(event_text);
        $('#text_input_0').val(event_text);
		$('#input_event_modal').modal('show');
	});

    //イベント削除
	$("#contents").on('click', '.del', function() {
		var key = $(this).parents('.event').attr('key');
		$('#del_event_key').val(key);
		$('#del_event').modal('show');
	});
	$('#del_event_submit').on('click', function() {
		var key = $('#del_event_key').val();
		$.post(
			url='https://bookbook-live.appspot.com/del_event',
			data={'key':key}
		);
		$("[key="+key+"]").remove();
		$('#del_event_key').val("");
		$('#del_event').modal('hide');
	});

    //４．tweetボタンの処理
    window.twttr = (function (d,s,id) {
    var t, js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return; js=d.createElement(s); js.id=id;
        js.src="https://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
        return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });
    }(document, "script", "twitter-wjs"));

    //５．イベントの単体表示
	$("#contents").on('click', '.share', function() {
    	event_id = $(this).parents('.event').attr('id');
        showPage('event', event_id);
    });
    
    //６．イベントを予定に追加/削除
    $("#contents").on('click', '.add', function() {
		var key = $(this).parents('.event').attr('key');
		$('#add_event_key').val(key);
		if ($(this).text().charAt(0)=="-"){
			$('#add_modal_title').text("イベントを追加");
			$('#add_modal_body').text("イベントを自分の予定に追加しますか？");
			$('#add_event_submit').text("　追加　");
			$('#add_event_arg').val('add');
			$('#add_event').modal('show');
		}else if($(this).text().charAt(0)=="+"){
			$('#add_modal_title').text("予定から削除");
			$('#add_modal_body').text("イベントを自分の予定から削除しますか？");
			$('#add_event_submit').text("　削除　");
			$('#add_event_arg').val('rem');
			$('#add_event').modal('show');
		}
	});
	$('#add_event_submit').on('click', function() {
		var key = $('#add_event_key').val();
		var arg = $('#add_event_arg').val();
		$.post(
			'https://bookbook-live.appspot.com/add_event',
			{'key':key, 'arg':arg}
		);
		if (arg=='add'){
			obj = $("[key='"+key+"']");
			num = Number(obj.find(".add").text().substr(1))+1;
			obj.find(".add").text("+"+num);
			obj.find(".add").css("color","dodgerblue");
			if ($("#title_schedule").text()=='スケジュール') {
				obj.css("background-color", "#ffffff");
				obj.find(".event_text").show();
			}
		} else if (arg=='rem'){
			obj = $("[key='"+key+"']");
			num = Number(obj.find(".add").text().substr(1))-1;
			if (num<=0){num=""}
			obj.find(".add").text("-"+num);
			obj.find(".add").css("color","gray");
			if ($("#title_schedule").text()=='スケジュール') {
				obj.css("background-color", "#dcdcdc");
				obj.find(".event_text").hide();
			}
		}
		$('#add_event_key').val("");
		$('#add_event_arg').val("");
		$('#add_event').modal('hide');
	});

    //７．イベントをお気に入りに追加/削除
	$("#contents").on('click', '.fav', function() {
		var key = $(this).parents('.event').attr('key');
		if ($(this).text().charAt(0)=="☆"){
			num = Number($(this).text().substr(1))+1;
			$(this).text("★"+num);
			$(this).css('color','#ffc800');
			$.post(
				url='https://bookbook-live.appspot.com/fav_event',
				data={'key':key, 'arg':'add'}
			);
		}else if($(this).text().charAt(0)=="★"){
			num = Number($(this).text().substr(1))-1;
			if (num<=0){num=""}
			$(this).text("☆"+num);
			$(this).css('color','gray');
			$.post(
				url='https://bookbook-live.appspot.com/fav_event',
				data={'key':key, 'arg':'rem'}
			);
		}
	});

    //８．フォローボタンの処理
	$(document).on('click', '.follow_btn', function(){
        //タイムラインページを再読み込み
        $("#menu_timeline").data("loaded", false);
        //ボタン表示切り替えとデータベースの更新
		var user=$(this).attr('user');
		if ($(this).text()=="フォロー"){
			$(this).text("　解除　");
			$.post(
				url='https://bookbook-live.appspot.com/follow_man',
				data={'arg':'add','user':user}
				);
		}else if ($(this).text()=="　解除　"){
			$(this).text("フォロー");
			$.post(
				url='https://bookbook-live.appspot.com/follow_man',
				data={'arg':'rem','user':user}
				);
		}
	});
    
    //９．ユーザー名クリックでそのユーザのスケジュールへ
	$("#contents").on('click', '.event_userinfo_name', function(){
		user_name = $(this).find('.event_userinfo_screenname').text().substr(1);
        showPage('user_schedule', user_name);
	});
	$("#contents").on('click', '.participants_name', function(){
		user_name = $(this).find('.participants_screenname').text().substr(1);
        showPage('user_schedule', user_name);
	});
	$("#contents").on('click', '.list_title_name', function(){
		user_name = $(this).find('.list_title_screenname').text().substr(1);
        showPage('user_schedule', user_name);
	});
    
    //１０．メニュー
    //スケジュールページ
    $("#contents").on('click', '#menu_myschedule', function(){
        user_name = $("#menu_myschedule").attr("user");
        loadUserSchedule(user_name);
    });
    //お気に入り
    $("#contents").on('click', '#menu_favorite', function(){
        loadEvent('favorite');
    });

    //フォローリスト
    $("#contents").on('click', '#menu_follow', function(){
        loadEvent('follow');
        $('#plus_btn').hide();
    });
    
    //過去のイベント
    $("#contents").on('click', '#menu_prev_events', function(){
        loadEvent('past');
    });
    
    
    //１１．設定
    //アカウントタイプの変更
    $("#account_type_input").on('click',function(){
        val = $("#account_type_input:checked").val();
        if(val!='1'){val='0'}; //1:運営用 0:一般
        $.post(
            url='https://bookbook-live.appspot.com/api/settings',
            data={
                'arg' : 'account_type',
                'account_type' : val
            }
        );
    });

    //ログアウト
    $("#logout_submit").on('click',function(){
       twitter_logout(); 
    });

    //退会
    $("#withdraw_submit").on('click',function(){
       withdraw(); 
    });
});

//フッタメニューの選択処理
//選択したメニューに色を付ける
function selectFooterMenu(arg){
//    alert("selectFooterMenu:"+arg);
    $("#menu_schedule").css('color','#808080');
    $("#menu_timeline").css('color','#808080');
    $("#menu_ranking").css('color','#808080');
    $("#menu_settings").css('color','#808080');
    if(arg){
        $("#menu_"+arg).css('color','#1e90ff');
    }
}

//Twitterログインの処理
function twitter_connect() {
    var browser = window.open('https://bookbook-live.appspot.com/twitter_aouth', '_blank', 'location=yes');
    browser.addEventListener('loadstop', function(event) {
        if (event.url == 'https://bookbook-live.appspot.com/') {
            $("#login_modal").modal("hide");
            loadEvent('schedule');
            browser.close();
        }
    });
}

//Twitterログアウトの処理
function twitter_logout(){
    var browser = window.open('https://bookbook-live.appspot.com/logout', '_blank', 'location=yes,hidden=yes');
    browser.addEventListener('loadstop', function(event) {
        if (event.url == 'https://bookbook-live.appspot.com/') {
            $("#logout_modal").modal("hide");
            browser.close();
            $("#login_modal").modal("show");
        }
    });
}

//退会処理
function withdraw(){
    
    $("#withdraw_modal").modal("hide");

    $.get(
        'https://bookbook-live.appspot.com/api/get_events',
    	{'arg' : 'withdraw'},
        function(data){
            $("#login_modal").modal("show");
            //表示を空にする
            $("#schedule").html("");
            $("#user_schedule").html("");
            $("#timeline").html("");
            $("#ranking").html("");
            $("#favorite").html("");
            $("#event").html("");
            $("#follow").html("");
            $("#past").html("");
            //読み込みフラグを空にする
            $("#menu_schedule").data("loaded", false);
            $("#menu_timeline").data("loaded", false);
            $("#menu_ranking").data("loaded", false);
        }
    );
}

//ユーザー情報を設定ページに読み込む
function loadSettings(){
    $.getJSON(
        'https://bookbook-live.appspot.com/api/get_user_info',
        function(data){
            //スケジュール
            $("#menu_myschedule").attr("user",data.twitter_screen_name);
            //アカウント種類
            if(data.account_type == '1'){
                $('#account_type_input').prop('checked',true);
            } else {
                $('#account_type_input').prop('checked',false);
            }
        }
    );
}

//イベントの読み込み
function showPage(page, arg){
    console.log('showPage:'+page+','+arg);
    loaded = $("#"+page).data("loaded");
    console.log('showPage:'+page+','+arg+','+loaded);
    if(page=='event'){
        _loadStart()
        .then(_hidePage())
        .then(_loadEvents(page, arg))
        .then(_setEventCss())
        .then(_showPage(page))
        .then(_showFooter(page))
        .then(_loadEnd());
    }else if(loaded || page=='settings'){
        //ページが読み込み済みor設定ページの場合、表示のみ
        _loadStart()
        .then(_hidePage())
        .then(_showPage(page))
        .then(_showFooter(page))
        .then(_loadEnd());
    } else {
        //ページが読み込まれていない場合、読み込んで表示
        $('#loading').show('fast',function(){
            _loadStart()
            .then(_hidePage())
            .then(_loadEvents(page, arg))
            .then(_setEventCss())
            .then(_showPage(page))
            .then(_showFooter(page))
            .then(_loadEnd());
            $("#"+page).data("loaded", true);
        });
    }
}

//スクロールで再/追加読込
function reloadEvents(){
    $(document).on('touchstart', '#contents', function(e){
        touchst = $(document).scrollTop();
    });
    $(document).on('touchend', '#contents', function(e){
        touchen = $(document).scrollTop();
        scrollend = $(document).height()-$(window).height();
        if(currentPage!='settings'){
            if(touchst==0 && touchen==0){
                //ページ上端で引っ張って再読込
                reloadPage(currentPage);
            }else if(touchen==scrollend){
                //ページ下端で引っ張って再読込
                loadNext(currentPage);
            }
        }
    });
}

//ページの再読込み
function reloadPage(page){
    console.log("reloadPage:"+page);
    $('#reload').slideDown('fast' ,function(){
        if(page=='user_schedule'){
            _loadStart()
            .then(_loadEvents('user_schedule', user_schedule_name))
            .then(_setEventCss())
            .then(_loadEnd())
            .then(setTimeout(function(){$('#reload').slideUp('fast')}, 300));
        }else{
            _loadStart()
            .then(_loadEvents(page))
            .then(_setEventCss())
            .then(_loadEnd())
            .then(setTimeout(function(){$('#reload').slideUp('fast')}, 300));
        }
    });
}

// ページの追加読み込み
function loadNext(page, arg){
    cursor=$('#'+page+"_cursor").html();
    console.log('loadNext:'+page+','+cursor);
    if (cursor!=""){
        _loadStart()
        .then(_NextEvents(page, cursor));
    }
}

function _loadStart(){
    return new Promise(function(resolve){
        $('#loading').show();
        resolve();
    });
}
function _hidePage(){
    return new Promise(function(resolve){
        $('#settings').hide();
        $('#schedule').hide();
        $('#user_schedule').hide();
        $('#timeline').hide();
        $('#ranking').hide();
        $('#favorite').hide();
        $('#event').hide();
        $('#follow').hide();
        $('#past').hide();
        $('#navbar_menu').hide();
        $('#navbar_contents').hide();
        $('#plus_btn').hide();
        $(document).scrollTop(0);
        resolve();
    });
}
function _loadEvents(page, arg){
    console.log("_loadEvents:"+page+','+arg);
    return new Promise(function(resolve){
        if(page=='event'){
            $.get(
                'https://bookbook-live.appspot.com/api/get_events',
                {'arg':'event', 'event_id':arg},
                function(data){
                    $('#navbar_contents').html($(data).filter("#list_title").html());
                    $('#event').html($(data).filter("#events").html());
                    //ツイートボタンを有効に
                    twttr.widgets.load();
                }
            );
        }else if(page=='user_schedule'){
            $.get(
                'https://bookbook-live.appspot.com/api/get_events',
                {'arg':'user_schedule', 'user':arg},
                function(data){
                    $('#navbar_contents').html($(data).filter("#list_title").html());
                    $('#user_schedule').html($(data).filter("#events").html());
                	$('#user_schedule_cursor').html($(data).filter("#cursor").html());
                    //ユーザー名を保存（リロード用）
                    user_schedule_name = arg;
                    //ツイートボタンの表示
                    showTweetBtn();
                }
            );
        }else{
            $.get(
                'https://bookbook-live.appspot.com/api/get_events',
            	{'arg':page},
        		function(data){
                    //ビューへ読み込み
                	$('#'+page).html($(data).filter("#events").html());
            		$('#'+page+'_cursor').text($(data).filter("#cursor").html());
                    $("#loading").hide();
                }
        	);
        }
        resolve();
    });
}
function _NextEvents(page, cursor){
    return new Promise(function(resolve){
        if(page=='user_schedule'){
            $.get(
                'https://bookbook-live.appspot.com/api/get_events',
                {'arg':'user_schedule', 'user':user_schedule_name, 'cursor':cursor},
                function(data){
                    eventhtml = $(data).filter("#events").html();
                    $('#navbar_contents').html($(data).filter("#list_title").html());
                    $('#user_schedule').append(eventhtml);
                    $('#user_schedule_cursor').html($(data).filter("#cursor").html());
                }
            );
        }else{
            $.get(
                'https://bookbook-live.appspot.com/api/get_events',
            	{'arg':page, 'cursor':cursor},
        		function(data){
                    eventhtml = $(data).filter("#events").html();
                	$('#'+page).append(eventhtml);
            		$('#'+page+'_cursor').text($(data).filter("#cursor").html());
                }
        	);
        }
        //追加読み込みを非表示に
        if(eventhtml==""){
            $('#'+page+'_cursor').html("");    
            $("#load_next").slideUp("fast");
        }
        resolve();
    });
}
function _setEventCss(){
    return new Promise(function(resolve){
        //追加ボタンのcss処理
        $(".add:contains('-')").css('color', 'gray');
        $(".add:contains('+')").css('color', '#1e90ff');
        //お気に入りボタンのcss処理
        $(".fav:contains('☆')").css('color', 'gray');
        $(".fav:contains('★')").css('color', '#ffc800');
        resolve();
    });   
}
function _showPage(arg){
    console.log('_showPage:'+arg);
    return new Promise(function(resolve){
        if(arg=='schedule'){
            $('#schedule').show();
            $("#logo").html("<b>BookLive</b>");
            $('#navbar_menu').show();
            $('#plus_btn').show();
        }else if(arg=='timeline'){
            $('#timeline').show();
            $("#logo").html("タイムライン");
            $('#navbar_menu').show();
            $('#plus_btn').show();
        }else if(arg='ranking'){
            $('#ranking').show();
            $("#logo").html("ランキング");
            $('#navbar_menu').show();
        }else if(arg='user_schedule'){
            $('#user_schedule').show();
            $('#navbar_contents').show();
        }else if(arg=='favorite'){
            $('#favorite').show();
            $("#logo").html("お気に入り");
            $('#navbar_menu').show();
        }else if(arg=='event'){
            $('#event').show();
            $('#navbar_menu').show();
        }else if(arg=='follow'){
            $('#follow').show();
            $("#logo").html("フォロー");
            $('#navbar_menu').show();
        }else if(arg=='past'){
            $('#past').show();
            $("#logo").html("過去のイベント");
            $('#navbar_menu').show();
        }else if(arg=='settings'){
            $('#settings').show();
            $("#logo").html("設定");
            $('#navbar_menu').show();
        }

        //追加読み込みの表示
        if($("#"+arg+"_cursor").text()==""){
            $('#load_next').hide();
        }else{
            $('#load_next').show();
        }
        
        //現在のページを記憶しておく
        currentPage = arg;
        resolve();
    });
}
function _showFooter(arg){
    return new Promise(function(resolve){
        $("#menu_schedule").css('color','#808080');
        $("#menu_timeline").css('color','#808080');
        $("#menu_ranking").css('color','#808080');
        $("#menu_settings").css('color','#808080');            
        if ($.inArray(arg,['schedule','timeline','ranking','settings'])>=0){
            $("#menu_"+arg).css('color','#1e90ff');
        }
        resolve();
    });
}
function _loadEnd(){
    return new Promise(function(resolve){
       // $('#loading').hide();
        resolve();
    });
}

//ツイートボタンの表示
function showTweetBtn(){
    user_name = $(' #navbar_contents .list_title_screenname').text().substr(1);
    tweet_html ='<div class="schedule_tweet_btn"><a href="https://twitter.com/share" class="twitter-share-button" data-url="https://bookbook-live.appspot.com/user/'+user_name +'" data-text="@'+user_name+' さんのスケジュール">Tweet</a></div>';
    $('#user_schedule').prepend(tweet_html);
    twttr.widgets.load();
    $('.schedule_tweet_btn').css({
                'text-align':'right',
                'margin-top':'10px',
                'border-bottom':'1px solid lightgrey'
    });
}

//セレクトボックスの選択処理
function event_type_select(type){
    if (type=='1'){
		//ライブイベント
		$("#time_input").prop('disabled', false);
		$("#start_time_input").prop('disabled', false);
		$("#time_input").css('text-decoration', 'none');
		$("#start_time_input").css('text-decoration', 'none');

	} else if (type=='2'){
		//ライブイベント（開始時刻のみ）
		$("#time_input").prop('disabled', false);
		$("#start_time_input").prop('disabled', true);
		$("#time_input").css('text-decoration', 'none');
		$("#start_time_input").css('text-decoration', 'line-through');
	} else if (type=='3'){
		//リリース（時刻設定なし）
		$("#time_input").prop('disabled', true);
		$("#start_time_input").prop('disabled', true);
		$("#time_input").css('text-decoration', 'line-through');
		$("#start_time_input").css('text-decoration', 'line-through');

	}
}

