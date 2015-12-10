<?php use yii\helpers\Url; ?>
<div id='chat_inbox' class='chat-inbox' >
	<!-- Nav tabs -->
	<ul class="nav nav-tabs chat-inbox-tab" role="tablist">
		<li role="presentation" class=" col-xs-6 chat-private-btn"><a href="#chat_private" aria-controls="chat_private" role="tab" data-toggle="tab"><span>Chats</span></a></li>
		<li role="presentation" class="active col-xs-6 chat-dicussions-btn"><a href="#chat_dicussion" aria-controls="chat_dicussion" role="tab" data-toggle="tab"><span>Discussions</span></a></li>
	</ul>

	<!-- Tab panes -->
	<div class="tab-content chat-inbox-content">
		<div role="tabpanel" class="tab-pane " id="chat_private">
			<ul>
				<li>
					<div class='chat-post-id'>
						<span class='avatar-user'>
							<img class='img_avatar' src='<?= Url::to('@web/img/icon/no_avatar.jpg'); ?>' />
						</span>
						<div class='title-description-user'>
							<div class='title-chat-inbox'>General Dogs</div>
							<div class='description-chat-inbox'>Lorem ipsum dolor sit amet, consectet Lorem ipsum dolor sit amet, consectet Lorem ipsum dolor sit amet, consectet</div>
						</div>
						<span class='time-chat-inbox'><i class='fa fa-clock-o'></i> 1 hr</span>
						<i class='fa fa fa-chevron-right'></i>
					</div>
				</li>
			</ul>
		</div>
		<div role="tabpanel" class="tab-pane active" id="chat_dicussion">
			<ul>
			</ul>
		</div>
	</div>
</div>


<script id="chat_inbox_list" type="text/x-underscore-template" >
	<% _.each(chat_inbox_list,function(chat_inbox){ %>
		<li>
			<div class='chat-post-id' data-post='<%= chat_inbox.id %>'>
				<span class='avatar-user'>
					<img class='img_avatar' src='<?= Url::to("@web/") ?><%= chat_inbox.avatar %>' />
				</span>
				<div class='title-description-user'>
					<div class='title-chat-inbox'><%= chat_inbox.title %></div>
					<div class='description-chat-inbox'><%= chat_inbox.content %></div>
				</div>
				<span class='time-chat-inbox'><i class='fa fa-clock-o'></i> <%= chat_inbox.update_at %></span>
				<i class='fa fa-2x fa-angle-right'></i>
			</div>
			<input type='hidden' value='<%= chat_inbox.topic_id %>' name='topic_id' />
			<input type='hidden' value='<%= chat_inbox.topic_name %>' name='topic_name'/>
			<input type='hidden' value='<%= chat_inbox.city_id %>' name='city_id' />
			<input type='hidden' value='<%= chat_inbox.city_name %>' name='city_name'/>
		</li>

		<% }); %>
	</script>
