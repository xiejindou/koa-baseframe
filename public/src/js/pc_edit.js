var editor = new wangEditor('free');
editor.config.uploadImgUrl = '/other/upload_img1';
editor.create();
var options = {
    thumbBox: '.thumbBox',
    spinner: '.spinner'
}
var editor1;
var app = new Vue({
    el: "#app",
    data: {
        phone: '',
        code: '',
        isActive: false,
        isActive1: true,
        inphone: '',
        switch: false,
        switch1:false,
        people:'',
        showcatgoy: false,
        catgoyname: '选择分类', //分类名字
        catgoylist: [],
        modal: false,
        imgurl: '',
        catgoyid: '', //分类ID
        ok_catgoy: false,
        onpreview: false,
        frameurl: '',
        name: '大师',
        time: '2017-01-01',
        u_headurl: '',   ///img/timg.jpg
        seefree: '', //预览免费部分
        seecharge: '',//预览收费部分
        skill_title: '',
        isdashed: false,
        sildval: 20,
        upv: '重新上传',
        percent: 0,
        vid: '',
        duration: '',
        money:0,
        money_type: '此为免费技能',
        isvideo: false,  //区分技能类型
        skill_id: '',
        endtime:''
    },
    methods: {
        onswitch: function () {
            if (this.switch) {
                this.switch = false;
                $($(".wangEditor-container")[1]).hide();
            } else {
                this.switch = true;
                $($(".wangEditor-container")[1]).show();
            }
        },
        //显示分类
        show: function () {
            if (this.showcatgoy) {
                this.showcatgoy = false;
            } else {
                this.showcatgoy = true;
            }
        },
        catlist: function (name, id, index) {
            this.catgoyname = name;
            this.catgoyid = id;
            $(".catgoylist").removeClass('act');
            $($(".catgoylist")[index]).addClass('act');
        },
        catgoy_in: function () {
            this.showcatgoy = false;
            this.ok_catgoy = true;
        },
        keep: function () {
            if (this.filename == null) {
                return;
            }
            var img = cropper.getDataURL();
            this.$http.post("/other/upload_base64", { str: img }).then(res => {
                var data = res.body;
                if (data.err == "") {
                    this.imgurl = data.out.url;
                    this.isActive = true;
                    this.isActive1 = false;
                    this.isdashed = true;
                } else {
                    this.$Message.error(data.error);
                }
            })
        },
        format: function (val) {
            return val + '%';
        },
        onsild: function (val) {
            this.sildval = val;
        },
        upvideo: function () {
            $(".videofile").trigger("click");
        },
        onfile: function () {
            $("#file").trigger("click");
        },
        //当前修改图片的成功回调
        suc(response, file, fileList) {
            if (response.err == "") {
                this.isActive1 = false;
                this.isActive = true;
                this.imgurl = response.out.url;

            }
        },
        give: function () {
            parent.close();
        },
        //预览
        preview: function () {
            // $('body').addClass('scroll');
            this.onpreview = true;
            var freehtml = editor.$txt.html();
            this.seefree = freehtml;
            if(this.type == "activity"){
                if(this.money <= 0){
                    this.money1 = '活动免费报名';
                }else{
                    this.money1 = '￥' + this.money;
                }
                if (this.switch1) {
                    if (this.people) {
                        if(this.people != 0){
                            this.limit_people = '/' + this.people;
                        }else{
                            this.limit_people = "";
                        }                   
                    }else{
                        this.limit_people = "";
                    }
                }else{
                    this.limit_people = "";
                }
                var date = String(Date.parse(new Date())).substring(0,10);
                var r_time = Date.parse(this.endtime) / 1000 - date;
                this.end_time = new Date(parseInt(Date.parse(this.endtime) / 1000) * 1000).Format("yyyy-MM-dd");
                if(r_time > 0){
                    var day = r_time/3600/24;
                    if(day > parseInt(day)){
                        this.also_time  = parseInt(day) + 1;
                    }else{
                        this.also_time = parseInt(day);
                    }                 
                }else{
                    this.also_time = 0;
                }
                if (!this.endtime) {
                    this.$Message.error('请选择报名结束时间');
                    return;
                }
            }else{
                if (this.switch) {
                    if (!this.isvideo) {
                        var chargehtml = editor1.$txt.html();
                        this.seecharge = chargehtml;
                    }
                }
            }
            
        },
        look: function () {
            this.onpreview = false;
            $('body').removeClass('scroll');
        },
        //发布
        release: function () {
            var self = this,
                url = "/publish/pre/info",
                freehtml = editor.$txt.html(),
                h = $("#free").children()
                freelist = this.listpush(h),
                price = 0,
                alltimelist = this.duration.split(":"),
                alltime = Number(alltimelist[0]) * 3600 + Number(alltimelist[1]) * 60 + Number(alltimelist[2]);
            var data = {
                id: this.skill_id,
                title: this.skill_title,
                title_url: this.imgurl,
                categoryId: this.catgoyid,
                content0: JSON.stringify(freelist),
                is_free: 'yes'
            };
            if(this.type == "activity"){
                data.act_end_tm = Date.parse(this.endtime) / 1000;
                if (!this.people || this.people != 0) {
                    data.act_limit = Number(this.people);
                }
                if (this.switch) {
                    price = this.money;
                }
            }else{
                if (this.switch) {
                    if (!this.isvideo) {
                        var chargehtml = editor1.$txt.html();
                        var chargelist = this.listpush($("#charge").children());
                        data.content1 = JSON.stringify(chargelist);
                    }
                    price = this.money;
                    data.is_free = 'no';
                }
            }
            if (this.isvideo) {
                data.video_id = this.vid;
                data.duration = alltime;
                data.free_rate = this.sildval;
                url = "/publish/pre/video";
            }
            data.price = price*100;
            this.$http.post(url, data).then(res => {
                var data = res.body.out;
                if (res.body.err == "") {
                    self.onpreview = false;
                    $('body').removeClass('scroll');
                    self.$Message.success('修改成功');

                    setTimeout(function () {
                        parent.close();
                        parent.window.location.reload();
                    }, 500);
                }
            })
        },
        //整理技能内容数据给后台
        listpush(html) {
            var list = [];
            $.each(html, function (index, val) {
                var img = $(val).attr("src");
                var content;
                if (img) {
                    content = {
                        text: '',
                        img: img
                    }
                    list.push(content);
                } else {
                    var text = $(val).html();
                    if (text.indexOf("src") > 0) {
                        for (i = 0; i < $(val).find('img').length; i++) {
                            var src = $($(val).find('img')[i]).attr("src");
                            if (src) {
                                content = {
                                    text: '',
                                    img: src
                                }
                            }
                            list.push(content);
                        }

                    } else {
                        content = {
                            text: text,
                            img: ''
                        }
                        list.push(content);
                    }
                }  
            })
            return list;

        },
        //整理技能内容数据给页面
        text(obj) {
            this.isvideo = false;
            var html = '';
            $.each(obj, function (index, val) {

                if (val.img != "") {
                    html = html + '<img src="' + val.img + '" />'
                } else if (val.text != "") {

                    val.text.replace('&amp;', '&');
                    if (val.text == "&lt;br&gt;") {
                        html = html + '<br/>';
                    } else if (val.text == "&amp;nbsp;") {
                        html = html + '&nbsp';
                    } else {
                        html = html + '<p>' + val.text + '</p>'
                    }

                }
            })
            return html;
        },
        free_f:function(){
            $("#free").prev().show();
            $("#charge").prev().hide();
        },
        change_f:function(){
            $("#free").prev().hide();
            $("#charge").prev().show();
        }
    },
    ready: function () {
        var self = this;
        var location = window.location.href;
        this.skill_id = location.split("id=")[1];
        if (location.indexOf("video") > 0) {
            this.isvideo = true;
        }
        this.$Message.config({
            top: 310,
            duration: 3
        });
        this.$http.get("/user/get").then(res => {
            var data = res.body.out;
            this.u_headurl = data.headimgurl;
            this.name = data.name;
        })
        $('#file').on('change', function () {
            var reader = new FileReader();
            reader.onload = function (e) {
                options.imgSrc = e.target.result;
                cropper = $('.imageBox').cropbox(options);
            }
            reader.readAsDataURL(this.files[0]);
        })
        $($(".wangEditor-container")[1]).hide();
        $(".wangEditor-container:first").css("z-index","99");
        this.$http.get("/other/get_categorylist").then(res => {
            var data = res.body.out;
            if (res.body.err == "") {
                this.catgoylist = data.datas;
            }
        })
        if (this.isvideo) {
            $('.videofile').on('change', function () {
                var path = $(this).val(),
                    extStart = path.lastIndexOf('.'),
                    ext = path.substring(extStart, path.length).toLocaleLowerCase();
                //判断视频格式
                if (ext !== '.mp4' && ext !== '.flv' && ext !== '.avi' && ext !== '.mpg' && ext !== '.wmv' && ext !== '.mov' && ext !== '.3gp' && ext !== '.asf') {
                    self.$Message.error('请上传视频');
                    return false;
                } else {
                    var size = this.files[0].size / 1024;
                    var a = this.files[0];
                    if (size > 1024 * 1024 * 1024) {
                        self.$Message.error('请上传小于1G的视频');
                        return false;
                    } else {
                        $("#uploadForm").ajaxSubmit({
                            url: "http://v.polyv.net/uc/services/rest?method=uploadfile",
                            type: "post",
                            dataType: "json", //返回类型
                            success: function (data) {
                                if (data.error == "0") {
                                    self.$Message.success('上传成功');
                                    self.upv = "重新上传";
                                    var list = data.data[0];
                                    self.vid = list.vid;
                                    self.duration = list.duration;
                                } else {
                                    self.$Message.error('上传失败');
                                }
                            },
                            //监听视频上传进度
                            xhr: function () {        //在jquery函数中直接使用ajax的XMLHttpRequest对象
                                var xhr = new XMLHttpRequest();
                                xhr.upload.addEventListener("progress", function (evt) {
                                    if (evt.lengthComputable) {
                                        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                                        self.percent = percentComplete;
                                    }
                                }, false);
                                return xhr;
                            }
                        });
                    }
                }
            })
        }
        //获取技能数据
        this.$http.get("/skill/detail2?id=" + this.skill_id).then(res => {
            var data = res.body;
            if (data.err == "") {
                var obj = data.out.data;
                self.skill_title = obj.title;
                self.imgurl = obj.title_url;
                self.isActive1 = false;
                self.isActive = true;
                self.isdashed = true;
                self.catgoyname = obj.category_name;
                self.catgoyid = obj.category;
                self.ok_catgoy = true;
                self.type = obj.publish_type;
                var freehtml = JSON.parse(obj.text_free);
                editor.$txt.html(self.text(freehtml));
                if (self.isvideo) {
                    self.vid = obj.video_id;
                }
                if (obj.price != 0) {
                    self.money = obj.price/100;
                    if(obj.publish_type == "activity"){
                        self.money_type = "此为收费活动";
                    }else{
                        self.money_type = "此为收费技能";
                    }                  
                    this.switch = true;       
                }else{
                    if(obj.publish_type == "activity"){
                        self.money_type = "此为免费活动";
                    }else{
                        self.money_type = "此为免费技能";
                    }     
                }
                if(obj.publish_type == "activity"){
                    this.endtime = new Date(parseInt(obj.activity_tm) * 1000).Format("yyyy-MM-dd");
                    if(obj.activity_limit > 0){
                        this.switch1 = true;
                        this.people = obj.activity_limit;
                    }else{
                        
                    }
                }else{
                    if (obj.text_charge) {
                        this.switch = true;
                        editor1 = new wangEditor('charge');
                        editor1.config.uploadImgUrl = '/other/upload_img1';
                        editor1.create();
                        var chargehtml = JSON.parse(obj.text_charge);
                        editor1.$txt.html(self.text(chargehtml));
                    }else{
                        $("#charge").remove();
                    }
                }               
            } else {
                self.$Message.error(data.error);
            }
        })
    }
})