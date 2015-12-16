var ChatInbox = {
	parent: '',
	modal:'#chat_inbox',
	initialize: function(){
		if(isMobile){
		} else {
			ChatInbox.OnClickChatInbox();
			ChatInbox.OnClickHideCloseChatInboxBtn();
		}
	},

	CustomScrollBar: function(){
		var parent = $(ChatInbox.modal).find('#chat_dicussion #container_ul_chat_list');
		if ($(parent).find("div[id^='mSCB']").length == 0) {
			$(parent).mCustomScrollbar({
				theme:"dark",
			});
		};
	},

	getTemplateChatInbox: function(parent,data){
		var list_template = _.template($("#chat_inbox_list" ).html());
		var append_html = list_template({chat_inbox_list: data});
		// if ($(parent).find("div[id^='mSCB']").length == 1) {
		// 	parent.find("div[id^='mSCB']").html("");
		// 	parent.find("div[id^='mSCB']").append(append_html);
		// } else {
			parent.find('li').remove();
			parent.append(append_html);
		// }
		ChatInbox.CustomScrollBar();
		ChatInbox.OnClickChatPostDetail();
	},

	OnClickChatInbox: function() {
		var chat_inbox = $("#chat_inbox");
		var parent = $(chat_inbox).find('#chat_dicussion ul');
		$("#chat_inbox_btn").on("click", function() {
            if(isGuest){
                Login.initialize();
                return false;
            }
			if (chat_inbox.css('right') == '-400px') {
				$.ajax({
					url: baseUrl + "/netwrk/post/get-chat-inbox",
					type: 'POST',
					data: null,
					processData: false,
					contentType: false,
					success: function(result) {
						result = $.parseJSON(result);
						ChatInbox.getTemplateChatInbox(parent,result);
					}
				});
				chat_inbox.animate({
					"right": "0"
				}, 500);
				ChatInbox.ActiveReponsiveChatInbox();
			} else {
				chat_inbox.animate({
					"right": "-400px"
				}, 500);
				ChatInbox.DeactiveReponsiveChatInbox();
			}

		});

	},

	OnClickChatPostDetail: function() {
		var btn = $(ChatInbox.modal).find('#chat_dicussion li');
		btn.unbind();
		btn.on('click',function(e){
			var btn = $(this);
			Post.params.topic = btn.find("input[name='topic_id']").val();
			Post.params.topic_name = btn.find("input[name='topic_name']").val();
			Post.params.city = btn.find("input[name='city_id']").val();
			Post.params.city_name = btn.find("input[name='city_name']").val();
			Topic.data.city = btn.find("input[name='city_id']").val();
			Topic.data.city_name = btn.find("input[name='city_name']").val();
			Topic.params.city = btn.find("input[name='city_id']").val();
			var item_post = $(e.currentTarget).find('.chat-post-id').attr('data-post');
			if(isMobile){
				ChatPost.RedirectChatPostPage(item_post);
			}else{
				ChatPost.params.post = item_post;
				if(ChatPost.temp_post != ChatPost.params.post){
					// $(Topic.modal).modal('hide');
					// $(ChatPost.modal).modal('hide');
					// $(Post.modal).modal('hide');
					// $(Topic.modal_create).modal('hide');
					// $(Post.modal_create).modal('hide');
					// $(Meet.modal).modal('hide');
					$('.modal').modal('hide');

					ChatPost.initialize();

					ChatPost.temp_post = ChatPost.params.post;
				}

			}
		});
	},

	ActiveReponsiveChatInbox: function() {
		var width = $( window ).width();
		if (width <= 1366) {
			$(".modal").addClass("responsive-chat-inbox");
		}

		//set zoom for re-init
		Map.zoom = Map.map.getZoom();
		Map.center = Map.map.getCenter();
		var width_map = width -320;
		$('.map_content').animate({
					'width':width_map+'px',
					'left': 0, 'margin': 0
				}, 500, 'swing', function(){ Map.initialize(); });
		$('#btn_meet').css({'left': '', 'right' : '15px'});
	},

	DeactiveReponsiveChatInbox: function() {
		var width = $( window ).width();
		if (width <= 1366) {
			$(".modal").removeClass("responsive-chat-inbox");
		}

		//set zoom for re-init
		Map.zoom = Map.map.getZoom();
		Map.center = Map.map.getCenter();

		$('.map_content').animate({
					'width':'100%',
					'left': '', 'margin': 'auto'
				}, 500, 'swing', function(){ Map.initialize(); });

		$('#btn_meet').css({'left': '', 'right' : '15px'});
	},

	OnClickHideCloseChatInboxBtn: function() {
		var chat_inbox = $("#chat_inbox");
		var parent = $(chat_inbox).find('#chat_dicussion ul');
		$("#hide_chat_inbox_btn").on("click", function() {
			chat_inbox.animate({
				"right": "-400px"
			}, 500);
			ChatInbox.DeactiveReponsiveChatInbox();
		});
	}
}