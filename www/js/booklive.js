
$(function(){

    var current_scrollY;
    
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
                loadEvent('schedule');
                showPage('schedule');
                loadSettings();
            }
        }
    );

    //２．フッタメニューを選択してページの切り替え
    $("#menu_schedule").on("click", function(){
        showPage('schedule');
        selectFooterMenu('schedule');
    });
    $("#menu_timeline").on("click", function(){
        loaded = $("#menu_timeline").data("loaded");
        if (loaded){
            showPage('timeline');
        }else{
            loadEvent('timeline');
            $("#menu_timeline").data("loaded", true);
        }
        selectFooterMenu('timeline');
    });
    $("#menu_ranking").on("click", function(){
        loaded = $("#menu_ranking").data("loaded");
        if (loaded){
            showPage('ranking');
        }else{
            loadEvent('ranking');
            $("#menu_ranking").data("loaded", true);
        }
        selectFooterMenu('ranking');
    });
    $("#menu_settings").on("click", function(){
        selectFooterMenu('settings');
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
        $.get(
            'https://bookbook-live.appspot.com/api/get_events',
            {'arg':'event', 'event_id':event_id},
            function(data){
                //イベントを表示
                $('#event').html($(data).filter("#events").html());
                setEventCss();
                showPage("event");
                
                //ナビゲーションバーにユーザを表示
                $('#navbar_menu').hide();
                $('#navbar_contents').html($(data).filter("#list_title").html());
                $('#navbar_contents').show();
                
                //ツイートボタンを有効に
                twttr.widgets.load();
                
                selectFooterMenu(false);
            }
        );
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
		loadUserSchedule(user_name);
	});
	$("#contents").on('click', '.participants_name', function(){
		user_name = $(this).find('.participants_screenname').text().substr(1);
		loadUserSchedule(user_name);
	});
	$("#contents").on('click', '.list_title_name', function(){
		user_name = $(this).find('.list_title_screenname').text().substr(1);
		loadUserSchedule(user_name);
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
        selectFooterMenu(false);
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
    
});

//フッタメニューの選択処理
//選択したメニューに色を付ける
function selectFooterMenu(arg){
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

//イベントリストを読み込む
function loadEvent(arg){
    $('#loading').show();
    $.get(
        'https://bookbook-live.appspot.com/api/get_events',
		{'arg' : arg},
		function(data){
            //ビューへ読み込み
			$('#'+arg).html($(data).filter("#events").html());
			$('#'+arg+'_cursor').html($(data).filter("#cursor").html());
            setEventCss();
            showPage(arg);
		}
	);
};

//イベントページの表示
function showPage(arg){
    //非同期で処理
    $.when(
        $('#loading').show(),
        $("#logo").html("<b>BookLive</b>"),
        $('#settings').hide(),
        $('#schedule').hide(),
        $('#user_schedule').hide(),
        $('#timeline').hide(),
        $('#ranking').hide(),
        $('#favorite').hide(),
        $('#event').hide(),
        $('#follow').hide(),
        $('#past').hide(),
        $('#navbar_contents').hide(),
        $(document).scrollTop(0),
        $('#navbar_menu').show(),
        $('#plus_btn').show()
    ).done(
        setTitle(arg),
        $("#"+arg).show(0,function(){
            $('#loading').hide();
        })
    );
}
function setTitle(arg){
    if(arg=="favorite"){
        $("#logo").html("お気に入り");
    } else if(arg=="follow"){
        $("#logo").html("フォロー");
    } else if(arg=="past"){
        $("#logo").html("過去のイベント");
    }
    $('#plus_btn').hide();
    selectFooterMenu(false);
}
//イベントhtmlへのcss設定
function setEventCss(){
    //追加ボタンのcss処理
    $(".add:contains('-')").css('color', 'gray');
    $(".add:contains('+')").css('color', '#1e90ff');
    //お気に入りボタンのcss処理
    $(".fav:contains('☆')").css('color', 'gray');
    $(".fav:contains('★')").css('color', '#ffc800');
}

//ユーザーのイベントリストを読み込む
function loadUserSchedule(user){
    $("user_schedule").hide();
                
    $.get(
        'https://bookbook-live.appspot.com/api/get_events',
        {'arg':'user','user':user},
        function(data){
            //ビューへ読み込み
            $('#navbar_contents').html($(data).filter("#list_title").html());
    		$('#user_schedule').html($(data).filter("#events").html());
			$('#user_schedule_cursor').html($(data).filter("#cursor").html());
            
            //ツイートボタンの表示
            showTweetBtn();
            
            //表示を切り替え
            showPage('user_schedule');
            $('#plus_btn').hide();
            $('#navbar_menu').hide();
            $('#navbar_contents').show();
            selectFooterMenu(false);

        }
    );
    $("user_schedule").show();

}

//ツイートボタンの表示
function showTweetBtn(){
    user_name = $('.list_title_screenname').text().substr(1);
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
