<?php use yii\helpers\Url; ?>

<div id="show-meetting">
    <div class="header">
        <div class="back_page">
        <!-- <i class="fa fa-arrow-left"></i> -->
            <img src="<?= Url::to('@web/img/icon/back_btn_hdpi.png'); ?>">
        </div>
        <div class="name">
            <img src="<?= Url::to('@web/img/icon/netwrk_icon_small_hdpi.png'); ?>">
            <span>DUY QUAN</span>
        </div>
    </div>
    <div class="sidebar">
       <table class="filter_sidebar">
            <tr>
                <td class="meet">Meeting</td>
                <td class="setting">Setting</td>
                <td class="profile active">Profile</td>
            </tr>
       </table> 
    </div>
    <div class="container_meet_setting">
        <div id="meet_page"></div>
        <div id="meet_setting"></div>
        <div id="user_setting"></div>
    </div>
</div>

<div class="modal" id='modal_change_avatar'>
   <div class="modal-dialog">
       <div class="modal-content">
           <div class="modal-body container_chagne_avatar">
               <div class="image-preview">
                   <p>IMAGE PREVIEW</p>
                   <img class="preview_image" src="" />
               </div>
               <div class="btn-control-modal">
                    <div class="cancel">
                        <p>Cancel</p>
                    </div>
                    <div class="save disable">
                        <i class="fa fa-check"></i>
                        <span>Save</span>
                    </div>
                    <div class="browse">
                        <?php 
                            $form = \yii\widgets\ActiveForm::begin([
                                'action' => Url::to(['/netwrk/setting/upload-image']),
                                'options' => [
                                    'id' => 'upload_image',
                                    'enctype' => 'multipart/form-data',
                                ]
                            ]);
                        ?>
                        <!-- <form id="upload_image" method="post" action="<?= Url::to(['/netwrk/setting/upload-image']) ?>" enctype="multipart/form-data"> -->
                            <input type="file" class="input_image" name='image' accept="image/jpg,image/png,image/jpeg,image/gif">
                        <!-- </form> -->
                        <?php \yii\widgets\ActiveForm::end(); ?>
                        <p>Browse</p>
                    </div>
                    
               </div>
           </div>
       </div>
   </div> 
</div>

<script id="user_info" type="text/x-underscore-template">
    <div class="user_avatar">
        <img src="<%= data.image %>">
        <div class="change_avatar">
            <i class="fa fa-cog"></i>
        </div>
    </div>
    <div class="user_information">
        <div class="field_info">
            <p> Birthday: </p>
            <input type="text" name='birthday' class="age" value="<%= data.age %>" />
        </div>
        <div class="field_info">
            <p> Zip Home: </p>
            <input type="text" class="zip_code" maxlength="10" value="<%= data.zip %>" />
        </div>
        <div class="field_info">
            <p> Work: </p>
            <input type="text" class="work" maxlength="100" value="<%= data.work %>"/>
        </div>
        <div class="field_info">
            <p> About: </p>
            <textarea class="about" maxlength="2000"><%= data.about %></textarea>
        </div>
    </div>
    <div class="btn-control">
        <div class="cancel">
            <p>Reset</p>
        </div>
        <div class="save">
            <i class="fa fa-check"></i>
            <span>Save</span>
        </div>
    </div>
</script>