<?php
	use yii\helpers\Url;
	use yii\web\Cookie;
	$cookies = Yii::$app->request->cookies;
?>
<div id='netwrkNews' class='netwrk-news left-slider'>
	<div class="header-wrapper text-center"></div>
	<div class="tab-wrapper">
		<!--<ul class="nav nav-tabs" role="tablist">
			<li role="presentation" class="col-xs-4 active"><a href="#yourNetwrk" aria-controls="yourNetwrk" role="tab" data-toggle="tab"><span>Your Netwrk</span></a></li>
			<li role="presentation" class="col-xs-4"><a href="#mostActive" aria-controls="mostActive" role="tab" data-toggle="tab"><span>Most Active</span></a></li>
			<li role="presentation" class="col-xs-4"><a href="#publicCenters" aria-controls="publicCenters" role="tab" data-toggle="tab"><span>Public Centers</span></a></li>
		</ul>-->
		<div class="tab-content content-wrapper">

		</div>
	</div>
</div>
<script id="netwrk_news" type="text/x-underscore-template">

	<% if(!_.isEmpty(landing.feeds)) {%>
		<% _.each(landing.feeds, function(city_feed, key){ %>
			<% _.each(city_feed, function(e, key){ %>
				<% if ((e.is_post == 1)){ %>
					<div class="feed-row feed-post" data-user="<%= e.user_id %>" data-value="<%= e.id %>" data-city="<%= e.city_id %>" data-topic='<%= e.topic_id %>'>
						<div class="avatar-poster"><div class="image"><img src="<%= e.photo %>"></div></div>
						<div class="feed-content">
							<div class='post'>
								<div class='post-title'><%= e.title %></div>
								<div class='post-content'><%= e.content %></div>
								<span class='post-create-by'>Posted by: <%= e.posted_by %></span>
								<span class='appear-day'>
									<% if ((e.appear_day == 'Now')){ %>
									  Just Now
									<% }else{ %>
									  <%= e.appear_day %> ago
									<% } %>
								</span>
							</div>
						</div>
					</div>
				<% }else{ %>
					<div class="feed-row feed-topic fav-community-topic" data-value="<%= e.id %>" data-city="<%= e.city_id %>" data-city-name='<%= e.city_name %>'>
						<div class="feed-content">
							<span class='topic-title'><%= e.title %></span>
							<span class='topic-create-by'>Channel created by: <%= e.created_by %></span>
							<span class='appear-day'>
								<% if ((e.appear_day == 'Now')){ %>
									Just Now
								<% }else{ %>
									<%= e.appear_day %> ago
								<% } %>
							</span>
						</div>
					</div>
				<% } %>
			<% }); %>
		<% }); %>
	<% } %>
	<% if(!_.isEmpty(landing.twitterFeeds)) {%>
		<% if(!_.isEmpty(landing.twitterFeeds.statuses)) {%>
			<div class="twitter-section"> Tweets near you </div>
		<% } %>
		<% _.each(landing.twitterFeeds.statuses, function(tweet, key){ %>
		<div class="tweet-feed-row  tweet-feed-post">
			<div class="avatar-poster"><div class="image"><img src="<%= tweet.user.profile_image_url_https %>"></div></div>
			<div class="feed-content">
				<div class='post'>
					<div class="user-info">
						<span class='post-create-by'><%= tweet.user.name %></span>
						<span class="user-mention">@<%= tweet.user.screen_name %></span>
					</div>
					<div class='post-title'><%= tweet.text %></div>
					<div class="api-logo">
						<i class="fa fa-twitter"></i>
					</div>
				</div>
			</div>
		</div>
		<% }); %>
	<% } %>

	<% if(!_.isEmpty(landing.jobFeeds)) {%>
		<div class="jobs-section"> Jobs near you </div>
			<% if(!_.isEmpty(landing.jobFeeds.results)) {%>
				<% _.each(landing.jobFeeds.results, function(item, key){ %>
					<div class="job-feed-row  job-feed-post">
						<!--<div class="avatar-poster"><div class="image"><img src=""></div></div>-->
						<div class="feed-content">
							<div class='post'>
								<div class='post-title'>
									<span class="job-title"><%= item.jobtitle %></span>

								</div>
								<div class="company-info"><span class="company"><%= item.company %></span> - <span class="location"><%= item.formattedLocation %></span></div>
								<div><span class="snippet post-content"><%= item.snippet %></span><span><a class="job-url view-more" href="<%= item.url %>" target="_blank"> View more</a></span></div>
							</div>
						</div>
					</div>
				<% }); %>
			<% } %>
	<% } %>
</script>
<script id="netwrk_header" type="text/x-underscore-template">
	<div class="btn-area-talk" data-topic="<%= landing.topic_id %>" data-city="<%= landing.city_id %>"
		 data-value="<%= landing.post_id %>" data-user="<%= landing.user_id %>"
		 data-title="<%= landing.title %>" data-content="<%= landing.post_content %>">
		<img src="<?= Url::to('@web/img/icon/netwrk-text.png'); ?>" alt="Netwrk"/> <span>news</span>
	</div>
</script>

