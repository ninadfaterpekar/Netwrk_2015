<div class="modal" id='modal_topic'>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
          <div class="name_modal"><span> Topics</span></div>
             <div class="filter_option">
                 <table class="filter_sidebar">
                      <tr>
                          <td class="active post">Most posts</td>
                          <td class="view">Most viewed</td>
                          <td class="topic">My Topics</td>
                      </tr>
                  </table> 
             </div>
             <div class="create_topic">
                 <span>Create a topic +</span>
             </div>
      </div>
      <div class="modal-body containt">
           <div id="item_list_post">
             <p class="no-data">There is no data available yet</p>
           </div>
           <div id="item_list_view">
             <p class="no-data">There is no data available yet</p>
           </div>
           <div id="item_list_topic">
             <p class="no-data">There is no data available yet</p>
           </div>
      </div>
    </div>
  </div>
   
   
  <script id="city_name" type="text/x-underscore-template">
    <span><%= city %></span>
  </script>
  <script id="topic_list" type="text/x-underscore-template" >
      <% _.each(topices,function(topic){ %>
          <div class="item" data-item="<%= topic.id %>">
            <div class="topic_post">
                <div class="name_topic">
                    <p><%= topic.title %></p>
                </div>
                <div class="name_post">
                  <% _.each(topic.post.data_post,function(post){ %>
                    <span><%= post %></span>
                  <% }); %>

                  <% 
                    var more_topice = topic.post_count -3
                    if ( more_topice > 0){ 
                  %>
                    <span class='more'> + <%= topic.post_count_format %> more posts</span>
                  <% } %>

                </div> 
            </div>
            <div class="time_ago">
              <% if (topic.created_at == 'Just now') {%>
                  <span><%= topic.created_at%></span>
              <%}else{ %> 
                  <img src="<%= topic.img%>"/>
                  <span><%= topic.created_at%></span>
              <% } %>    
            </div>
            <div class="num_count">
                <div class="most_post">
                  <p><%= topic.view_count %></p>
                </div>
                <% if (topic.view_count == 1) {%>
                    <p>View</p>
                <%}else{ %> 
                    <p>Views</p>
                <% } %> 
            </div>
        </div>
    <% }); %>  
    </script>
</div>
