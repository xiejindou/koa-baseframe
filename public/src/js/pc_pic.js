var w = $(window).width();
var h = $(window).height();
$("#menu").height(h);
$("#menu").width(w * 0.1666);
$(".nav").width(w * 0.8333);
$(".nav").css("left", w * 0.1666);
var editor = new wangEditor('free');
editor.config.uploadImgUrl = '/other/upload_img1';
editor.create();

var editor1;
var options = {
    thumbBox: '.thumbBox',
    spinner: '.spinner'
}
var app = new Vue({
    el: "#app",
    data: {
        phone: '',
        code: '',
        isActive: false,
        isActive1: true,
        inphone: '',
        switch: true,
        switch1: true,
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
        sildval: 0,
        upv: '上传视频',
        percent: 0,
        vid: '',
        duration: '',
        money: 0,
        act_money: '',
        people: '',
        endtime: '',
        isvideo: false, //区分技能类型
        isactiviy: false,  //区分活动
    },
    methods: {
        out: function () {
            var logout = confirm("确定退出？");
            if (logout) {
                this.$http.post("/user/logout").then(res => {
                    var data = res.body;
                    if (data.err == "") {
                        this.$Message.error('已退出登录');
                        setTimeout(function () {
                            window.location.href = "login.html";
                        }, 1000);
                    } else {
                        this.$Message.error(data.error);
                    }
                });
            }
        },
        onswitch: function (t) {
            if (t) {
                if (this.switch1) {
                    this.switch1 = false;
                } else {
                    this.switch1 = true;
                }
            } else {
                if (this.switch) {
                    this.switch = false;
                    $($(".wangEditor-container")[1]).hide();
                } else {
                    this.switch = true;
                    $($(".wangEditor-container")[1]).show();
                }
            }

        },
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
        free_f:function(){
            $("#free").prev().show();
            $("#charge").prev().hide();
            var t = editor.$txt.text();
            if(t == "技能免费内容" || t == "活动内容"){
                $("#free").children('p').html("<br/>");
            }
        },
        change_f:function(){
            $("#free").prev().hide();
            $("#charge").prev().show();
            var t = editor1.$txt.text();
            if(t == "技能收费内容"){
                $("#charge").children('p').html("<br/>");
            }
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
        format(val) {
            return val + '%';
        },
        onsild: function (val) {
            this.sildval = val;
        },
        onfile: function () {
            $("#file").trigger("click");
        },
        upvideo: function () {
            $(".videofile").trigger("click");
        },
        //当前修改图片的成功回调
        suc(response, file, fileList) {
            if (response.err == "") {
                this.isActive1 = false;
                this.isActive = true;
                this.imgurl = response.out.url;

            }
        },
        //预览
        preview: function () {
            if (this.catgoyid == '' || this.imgurl == '' || this.skill_title == '') {
                this.$Message.error('请完善技能的基本信息');
                return;
            }
            if (this.isvideo) {
                if (this.percent == 0) {
                    this.$Message.error('请上传视频');
                    return;
                }
            }
            if (this.isactivity) {
                if (this.money <= 0) {
                    this.money1 = '活动免费报名';
                } else {
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
                var date = String(Date.parse(new Date())).substring(0, 10);
                var r_time = Date.parse(this.endtime) / 1000 - date;
                this.end_time = new Date(parseInt(Date.parse(this.endtime) / 1000) * 1000).Format("yyyy-MM-dd");
                if (r_time > 0) {
                    var day = r_time / 3600 / 24;
                    if (day > parseInt(day)) {
                        this.also_time = parseInt(day) + 1;
                    } else {
                        this.also_time = parseInt(day);
                    }
                } else {
                    this.also_time = 0;
                }
                if (!this.endtime) {
                    this.$Message.error('请选择报名结束时间');
                    return;
                }
            }
            $('body').addClass('scroll');
            this.onpreview = true;
            var freehtml = editor.$txt.html();
            this.seefree = freehtml;
            if (this.switch) {
                if (!this.isvideo && !this.isactivity) {
                    var chargehtml = editor1.$txt.html();
                    this.seecharge = chargehtml;
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
                title: this.skill_title,
                title_url: this.imgurl,
                categoryId: this.catgoyid,
                content0: JSON.stringify(freelist),
                is_free: 'yes'
            };
            if (this.switch) {
                if (!this.isvideo && !this.isactivity) {
                    var chargehtml = editor1.$txt.html();
                    var chargelist = this.listpush($("#charge").children());
                    data.content1 = JSON.stringify(chargelist);
                }
                price = this.money;
                data.is_free = 'no';
            }
            if (this.endtime) {
                data.act_end_tm = Date.parse(this.endtime) / 1000;
                if (!this.people || this.people != 0) {
                    data.act_limit = Number(this.people);
                }
            }
            if (this.isvideo) {
                data.video_id = this.vid;
                data.duration = alltime;
                data.free_rate = this.sildval;
                url = "/publish/pre/video";
            }
            data.price = price * 100;
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "json",
                success: function (res) {
                    var data = res.out;
                    if (res.err == "") {
                        self.onpreview = false;
                        $('body').removeClass('scroll');
                        self.$Message.success('发布成功');
                        setTimeout(function () {
                            window.location.reload();
                        }, 500);
                    }
                },
                error: function (err) {
                    console.log(JSON.stringify(err, null, 4));
                }
            });

        },
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
        }
    },
    ready: function () {
        var self = this;
        $($(".wangEditor-container")[0]).show();
        var location = window.location.href;
        if (location.indexOf("video") > 0) {
            this.isvideo = true;
            editor.$txt.html('<p>技能免费内容</p>');
        }
        if (location.indexOf("activity") > 0) {
            this.isactivity = true;
            editor.$txt.html('<p>活动内容</p>');
        }
        this.$Message.config({
            top: 310,
            duration: 3
        });
        $(".wangEditor-container:first").css("z-index","97");
        this.$http.get("/user/get").then(res => {
            var data = res.body.out;
            self.u_headurl = data.headimgurl;
            self.name = data.name;
        })
        $('#file').on('change', function () {
            var reader = new FileReader();
            reader.onload = function (e) {
                options.imgSrc = e.target.result;
                cropper = $('.imageBox').cropbox(options);
            }
            reader.readAsDataURL(this.files[0]);
        })
        if (location.indexOf("pic") > 0) {
            editor1 = new wangEditor('charge');
            editor1.config.uploadImgUrl = '/other/upload_img1';
            editor1.create();
            editor1.$txt.html('<p>技能收费内容</p>');
            editor.$txt.html('<p>技能免费内容</p>');
        }
        if (location.indexOf("activity") > 0) {
            editor.$txt.html('<p>活动内容</p>');
        }
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
                            url: "https://v.polyv.net/uc/services/rest?method=uploadfile",
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
                            xhr: function () {        //在jquery函数中直接使用ajax的XMLHttpRequest对象
                                var xhr = new XMLHttpRequest();
                                xhr.upload.addEventListener("progress", function (evt) {
                                    if (evt.lengthComputable) {
                                        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                                        self.percent = percentComplete;
                                    }
                                }, false);
                                return xhr;
                            },
                            error: function (err) {
                                console.log(err)
                            }
                        });
                    }
                }
            })
        }

        this.$http.get("/other/get_categorylist").then(res => {
            var data = res.body.out;
            if (res.body.err == "") {
                self.catgoylist = data.datas;
            }
        })
    }
})