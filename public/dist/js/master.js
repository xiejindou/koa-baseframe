var sharedata = {};
var w_url = window.location.href;
var app = new Vue({
    el: '#app',
    data: {
        name: '觅技达人',
        introduction: '',
        headerurl: '/img/logo.png',
        skillData: [],
        page: 0,
        len: 5
    },
    methods: {
        ajaxlist(page, len) {
            var self = this;
            if (self.more) {
                $.ajax({
                    type: "GET",
                    url: "/follower/user_info",
                    data: { page: this.page, len: this.len, id: id },
                    dataType: "json",
                    success: function (res) {
                        self.page += 1;
                        var data = res.body;
                        if (data.err == "") {
                            var datalist = data.out;
                            self.skillData = datalist.skills;
                        }
                        if (data.out.length == 0) {
                            self.more = false;
                        }
                    }
                });
            }
        },
        hot: function (id) {
            window.location.href = "/skill/info?id=" + id + "&type=wechat";
        }
    },
    ready() {
        var self = this;

        $.ajax({
            type: "GET",
            url: "/follower/user_info",
            data: { page: this.page, len: this.len, id: id },
            dataType: "json",
            async: false,
            success: function (res) {
                self.page += 1;
                var data = res;
                if (data.err == "") {
                    var datalist = data.out;
                    var user = datalist.user;
                    self.name = user.name;
                    self.introduction = user.introduction;
                    self.headerurl = user.headimgurl;
                    self.skillData = datalist.skills;
                    sharedata.title = "<觅技>" + user.name + "的个人主页";
                    sharedata.desc = user.introduction;
                    sharedata.imgUrl = user.headimgurl;
                    sharedata.link = window.location.href;
                }
            }
        });
        $(window).scroll(function () {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if (scrollHeight - (scrollTop + windowHeight) <= 20) {
                self.ajaxlist(this.page, this.len);
            }
        });
    }
});

function getLocalTime(times) {
    return new Date(parseInt(times) * 1000).toLocaleString().substr(0, 10).replace("/", "-").replace("/", "-");
}
if (w_url.indexOf("auth") > 0) {
    $(".footer_img").hide();
} else {
    var wxshare = new wxshare(sharedata);
    wxshare.share();
}