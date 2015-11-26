<?php use yii\helpers\Url; ?>
<div id="post_chat" data-topic="<?= $post->topic->id ?>" data-post="<?= $post->id?>">
    <div class="header">
        <div class="back_page">
            <span><i class="fa fa-arrow-circle-left"></i> Back </span>
        </div>
        <div class="title_page">
            <span class="title">
                <span><a href="<?= Url::base(true); ?>"><img src="<?= Url::to('@web/img/icon/netwrk-logo.png'); ?>"></a></span>
                <span><i class="fa fa-angle-right"></i><?= $post->topic->title ?></span>
                <span><i class="fa fa-angle-right"></i><?= $post->title ?></span>
            </span>
        </div>
    </div>

    <div class="container_post_chat"></div>
    <div class="nav_input_message">
        <form id='msgForm' class="send_message input-group">
            <textarea type="text" class="form-control" placeholder="Type message here..." maxlength="1024"></textarea>
            <div id='file_btn' class="input-group-addon paper"><i class="fa fa-paperclip"></i></div>
            <input type='file' id='file_upload' name='file_upload' style="display:none" />
            <div class="input-group-addon emoji"><i class="fa fa-smile-o"></i></div>
            <div class="input-group-addon send" id="sizing-addon2">Send</div>
        </form>
    </div>
</div>
<script id="message_chat" type="text/x-underscore-template">
    <% if (msg.user_current){ %>
        <div class="message_send message" data-img="<?= Url::to('@web/img/icon/timehdpi.png'); ?>">
   <% }else{ %>
        <div class="message_receiver message" data-img="<?#= Url::to('@web/img/icon/timehdpi.png'); ?>">
    <% } %>
        <div class="user_thumbnail">
            <div class="avatar">
                <img src="<%= baseurl %><%=  msg.avatar %>">
            </div>
        </div>
        <div class="content_message">
            <% if(msg.msg_type == 1) { %>
                <p class="content"><%= msg.msg %></p>
            <% }else if(msg.msg_type == 2) { %>
                <img src='<?= Url::to("@web/img/uploads/") ?><%= msg.msg %>' class='img_chat_style'/>
            <% } else { %>
                <a href='<?= Url::to("@web/files/uploads/") ?><%= msg.msg %>' target='_blank'><%= msg.msg %></a>
            <% } %>
                <p class="time"><%= msg.created_at %></p>
            </div>
        </div>
    </div>
</script>
