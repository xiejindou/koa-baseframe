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
        introduction: '',
        money: '',
        end_time: '',
        also_time: '',
        also_people: '',
        limit_people: '',
        sign_list:[],
        isactivity:true,
        timeover:false
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
        },
        pay: function () {

        }
    },
    ready() {
        this.onfree();
        var self = this;
        if (info.skill_money == 0) {
            this.money = "活动免费报名";
        } else {
            this.money = "￥" + (info.skill_money / 100);
        }
        if (info.publisher_introduction) {
            this.introduction = info.publisher_introduction;
        }
        if (info.activity_limit) {
            if (info.activity_limit > 0) {
                this.limit_people = "/" + info.activity_limit;
            }
        }
        var date = String(Date.parse(new Date())).substring(0, 10);
        var r_time = info.activity_tm - date;
        if (r_time > 0) {    
            var day = r_time / 3600 / 24;
            if (day > parseInt(day)) {
                this.also_time = parseInt(day) + 1;
            } else {
                this.also_time = parseInt(day);
            }
        } else {
            this.isactivity = false;
            this.also_time = 0;
            this.timeover = true;
        }
        this.end_time = new Date(parseInt(info.activity_tm) * 1000).Format("yyyy-MM-dd");
        $.ajax({
            type: "GET",
            url: "/skill/activity_users",
            data: { id: info.id, page: 0 },
            dataType: "json",
            success: function (res) {
                var data = res.out;
                if (res.err == "") {
                    if (data.count > 10) {
                        var people_more = "9+";
                        if (data.count > 100) {
                            people_more = '99+';
                        } else if (data.count > 1000) {
                            people_more = '999+';
                        }
                        setTimeout(function () {
                            $(".s_list").append("<li><p>" + people_more + "</p></li>");
                        }, 200);

                    }
                    self.sign_list = data.datas;
                    self.also_people = data.count;
                }
            },
            error: function (err) {
            }
        });
    }
});
function otxt(boolean) {
    app.opentext(boolean);
}