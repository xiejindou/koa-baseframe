var info = data.data,
    hotskill = data.hot_skills,
    skill_time = info.publish_time,
    window_h = $(window).height(),
    window_w = $(window).width(),
    c_data = {
        skillData: hotskill,
        page: 1,
        len: 10,
        more: true
    },
    app_data = {
        videohtml: '',
        in_comment: '',
        collsrc: '/img/star.png',
        commen_id: 0,
        title: info.title,
        favour_num: info.favour_num,
        favour_img: '/img/favour.png',
        u_headurl: info.publisher_headimgurl,
        name: info.publisher_name,
        time: new Date(parseInt(skill_time) * 1000).Format("yyyy-MM-dd"),
        charge_conent: '',
        free_conent: '',
        disnone: true,
        novideo: false,
        isvideo: true,
        istext: false,
        introduction:'这人很懒,什么都没写'
    };
var sharedata;
Vue.component('skill_list', {
    template: '#skill_list',
    data: function () {
        return c_data
    },
    methods: {
        hot: function (id) {
            window.location.href = "/skill/info?id=" + id + "&type=wechat";
        }
    },
    ready() {
        var self = this;
    }
});

var app = new Vue({
    el: '#app',
    data: app_data,
    methods: {
        gouser() {
            window.location.href = '/follower/user_info_wx?id=' + info.publisher_id;
        },
        seevideo() {
            var html = '';
            var self = this;
            this.novideo = true;
            this.isvideo = false;
            var if_img = false;
            if (info.play_id) {
                this.videohtml = "<div id='plv_" + info.play_id + "'></div>";
                setTimeout(function () {
                    var player = polyvObject('#plv_' + info.play_id).videoPlayer({
                        'width': window_w,
                        'height': window_h * 0.3625,
                        'vid': info.play_id
                    });
                }, 200);
            } else {
                this.videohtml = "<img src='/img/novideo.png' style='width:100%;' />"
            }

            $.each(JSON.parse(info.text_free), function (index, val) {
                if (val.img != "") {
                    if_img = true;
                    html = html + '<p>[图片]</p>'
                } else if (val.text != "") {
                    if (val.text.length <= 50) {
                        html = html + '<p>' + val.text + '</p>'
                    } else {
                        var text = val.text.substring(0, 50);
                        html = html + '<p>' + val.text + '</p>'
                    }
                }
            })
            this.free_conent = html;
            setTimeout(function () {
                var free_h = $("#free").height();
                if (free_h > 90) {
                    self.isvideo = true;
                    self.free_conent = html + '<span class="opentext" onclick="otxt(true)">展开>></span>';
                } else {
                    if (if_img) {
                        self.isvideo = true;
                        self.free_conent = self.free_conent + '<span class="opentext" onclick="otxt(true)">展开>></span>';
                    } else {
                        self.opentext(true);
                    }
                }
            }, 100);
        },
        onfree() {
            var html = '';
            var self = this;
            if (info.publish_type != 'video') {
                self.isvideo = false;
            }
            $.each(JSON.parse(info.text_free), function (index, val) {
                if (val.img != "") {
                    html = html + '<img src="' + val.img + '" />'
                } else if (val.text != "") {
                    html = html + '<p>' + val.text + '</p>'
                }
            })
            self.free_conent = html;
            setTimeout(function () {
                var free_h = $("#free").height();
                if (info.publish_type != 'video' && free_h > window_h) {
                    self.istext = true;
                    self.disnone = false;
                    self.free_conent = html + '<div class="pop" onclick="otxt(false)"></div><span class="opent" onclick="otxt(false)">点击展开查看更多</span>';
                }
            }, 150);
        },
        oncharge() {
            if (chargelist != "") {
                var html = '';
                this.disnone = false;
                $.each(JSON.parse(info.text_charge), function (index, val) {
                    if (val.img != "") {
                        html = html + '<img src="' + val.img + '" />'
                    } else if (val.text != "") {
                        html = html + '<p>' + val.text + '</p>'
                    }
                })
                this.charge_conent = html;
            } else {
                this.disnone = true;
            }
        },
        opentext(boolean) {
            if (boolean) {
                $(".first").removeClass("first");
                this.isvideo = false;
                this.istext = false;
                $(".opentext").remove();
                this.onfree();
            } else {
                this.disnone = true;
                this.isvideo = false;
                this.istext = false;
                $(".opent").remove();
                $(".pop").remove();
            }
        }
    },
    ready() {
        if (info.publish_type == 'video') {
            this.seevideo();
        } else {
            this.onfree();
        }
        if (info.text_charge) {
            this.oncharge();
        }

        if (info.publisher_introduction) {
            this.introduction = info.publisher_introduction;
        }
        if (info.skill_money == 0) {
            this.disnone = false;
        }
    }
});
function otxt(boolean) {
    app.opentext(boolean);
}