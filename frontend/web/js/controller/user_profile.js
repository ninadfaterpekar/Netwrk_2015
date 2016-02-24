var User_Profile = {
    data:{},
    params:{
        age: 0,
        work: '',
        about: '',
        zipcode:0,
        lat:'',
        lng:''
    },
    img:{
        image:''
    },
    num_len:true,
    zipcode: true,
    status_change:{
        age:true,
        zipcode: true,
        work: false,
        about:false,
        total:false
    },
    state: 'Indiana',
    profileContainer: $('.profile-container'),
    profileInfo: $('.profile-info'),
    editProfileModal: $('#modal_change_profile_picture'),
    initialize: function(){
        User_Profile.resetProfile();
        User_Profile.getProfileInfo();
        User_Profile.ShowModalProfile();
        User_Profile._eventClickPasswordSetting();
        User_Profile._eventClickSearchSetting();
    },

    resetProfile: function(){
        User_Profile.profileInfo.html('');
    },

    getProfileInfo: function(){
        var self = this,
            profile_data = $('#profile_info');

        Ajax.getUserProfile().then(function(data){
            var json = $.parseJSON(data);
            User_Profile.data = json;

            User_Profile.params.age = json.age;
            User_Profile.params.work = json.work;
            User_Profile.params.about = json.about;
            User_Profile.params.zipcode = json.zip;

            if(User_Profile.data.status == 1){
                User_Profile.getTemplateProfileInfo(User_Profile.profileInfo,profile_data);
                User_Profile.editProfilePicture();
            }
        });
    },

    getTemplateProfileInfo: function(parent,target,callback){
        var template = _.template(target.html());
        var append_html = template({data: User_Profile.data});
        parent.append(append_html);

        if(_.isFunction(callback)){
            callback();
        }
    },

    editProfilePicture: function(){
        var btn = $('.change-profile');
        btn.on('click',function(){
            User_Profile.editProfileModal.modal({
                backdrop: true,
                keyboard: false
            });
            User_Profile.onchangeModalUpload();
        });
    },

    onchangeModalUpload: function(){
        $('.modal-backdrop.in').last().addClass('active');
        User_Profile.onBrowse();
        User_Profile.onCancel();
        User_Profile.onBackdrop();
    },

    onBrowse: function(){
        var btn = User_Profile.editProfileModal.find('.browse');
        btn.unbind();
        btn.on('click',function(e){
            $('.preview_img').find('img').remove();
            $('.preview_img_ie').find('img').remove();
            $('.image-preview').find('p').show();
            $('#input_image')[0].click();

            $('#input_image').unbind();
            $('#input_image').change(function(e) {
                User_Profile.handleFiles(this.files);
            });

        });
    },

    handleFiles: function(files){
        // var target = $('img.preview_image');
        var img = new Image(),
            parent_text = $('.image-preview').find('p'),
            btn_control_save = $('.btn-control-modal').find('.save');

        if(files.length > 0){
            img.src = window.URL.createObjectURL(files[0]);

            img.onload = function() {
                window.URL.revokeObjectURL(this.src);
                User_Profile.onEventSaveImage();
            };

            btn_control_save.removeClass('disable');
            parent_text.hide();

            if (isonIE()){
                $('.preview_img_ie').append(img);

            }else{
                $('.preview_img').addClass('active');
                $('.preview_img').append(img);
            }
            User_Profile.showImageOnIE();
        }
    },

    onEventSaveImage:function(){
        var btn_save = $('.btn-control-modal').find('.save');

        if (!btn_save.hasClass('disable')) {
            btn_save.on('click',function(){
                $('#upload_image').unbind();
                $('#upload_image').on('submit',function( event ) {
                    event.preventDefault();
                    var formData = new FormData(this);

                    Ajax.uploadProfileImage(formData).then(function(data){
                        var json = $.parseJSON(data);
                        User_Profile.img.images = json.data_image;
                        User_Profile.reloadProfilePicture();
                        $('.preview_img').find('img').remove();
                    });

                });
                $('#upload_image').submit();
            });
        };
    },

    reloadProfilePicture: function(){
        User_Profile.editProfileModal.modal('hide');
        $('.img-user').find('img').attr('src',User_Profile.img.images);
    },

    showImageOnIE: function(img){
        var target = $('.preview_img_ie').find('img'),
            w = $('.preview_img_ie').find('img').attr('width'),
            h = $('.preview_img_ie').find('img').attr('height');
    },

    onCancel: function(){
        var btn = $('.btn-control-modal').find('.cancel');
        btn.on('click',function(){
            User_Profile.editProfileModal.modal('hide');
            // $('img.preview_image').attr('src','');
            // $('img.preview_image').hide();
            $('.preview_img').find('img').remove();
            $('.image-preview').find('p').show();
            $('.btn-control-modal').find('.save').addClass('disable');
            $('.preview_img').removeClass('active');
        });
    },

    onBackdrop: function(){
        User_Profile.editProfileModal.on('hidden.bs.modal',function() {
            $('img.preview_image').attr('src','');
            $('img.preview_image').hide();
            $('.image-preview').find('p').show();
            $('.btn-control-modal').find('.save').addClass('disable');
            $('.preview_img').removeClass('active');
        });
    },

    ShowModalProfile: function(){
        var profileModal = $('#modal_profile'),
            self = this;

        profileModal.modal({
            backdrop: true,
            keyboard: false
        });

        Common.CustomScrollBar(profileModal.find('.modal-body'));

        profileModal.on('hidden.bs.modal',function() {
            profileModal.modal('hide');
        });
        $('.modal-backdrop.in').click(function(e) {
            profileModal.modal('hide');
        });
    },

    _eventClickPasswordSetting: function() {
        var target = $('#password_setting'),
            self = this;

        target.unbind();
        target.click(function(){
            if(isMobile){
            } else {
                $('.modal').modal('hide');
                Password_Setting.initialize();
            }
        });
    },

    _eventClickSearchSetting: function() {
        var target = $('#search_setting'),
            self = this;

        target.unbind();
        target.click(function(){
            if(isMobile){
            } else {
                $('.modal').modal('hide');
                Search_Setting.initialize();
            }
        });
    },
};