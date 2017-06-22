var commentnum = data.comment_count,
    commen_text = '',
    commen_id,
    info = data.data,
    skill_time = info.publish_time,
    useragent = navigator.userAgent,
    window_h = $(window).height(),
    window_w = $(window).width(),
    is_favour = '',
    is_collect = '';
data1 = {
    in_comment: '',
    num: commentnum,
    collsrc: '/img/star.png',
    commen_id: 0,
    title: info.title,
    favour_num: info.favour_num,
    favour_img: '/img/favour.png',
    u_headurl: info.publisher_headimgurl,
    name: info.publisher_name,
    introduction: info.publisher_introduction,
    is_follow: '/img/no_follow.png',
    time: getLocalTime(skill_time),
    charge_conent: '',
    free_conent: '',
    disnone: true,
    disnone1: true,
    isvideo: true,
    isvideo1: true,
    list: [],
    page: 1,
    len: 5,
    more: true,
    isfavour: false,
    iscollect: false,
    money: '10',
    is_login: false,
    pro: '此为收费教程，余下内容为收费部分',
    cookie: '',
    cookie1: ''
};
setTimeout(function () {
    $.get('/user/is_login', function (data, err) {
        if (data.out.status) {
            data1.is_login = true;
        }
    });
}, 1000);
var app = new Vue({
    el: '#app',
    data: data1,
    methods: {
        //购买
        pay: function () {
            if (!this.is_login) {
                this.nologin();
                return;
            }
            if (info.check_status != "pass") {
                var data = {
                    type: true
                };
                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                    //判断iPhone|iPad|iPod|iOS
                    window.webkit.messageHandlers.openNoBuy.postMessage(data);
                } else if (/(Android)/i.test(navigator.userAgent)) {
                    //判断Android
                    //alert(navigator.userAgent); 
                    skill.openNoBuy('该技能正在审核中...');
                }
                return;
            }
            var data = {
                id: info.id,
                title_url: info.title_url,
                title: info.title,
                money: info.skill_money,
                type: 'skill'
            };
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                //判断iPhone|iPad|iPod|iOS
                //alert(navigator.userAgent);  
                window.webkit.messageHandlers.openBuy.postMessage(data);
            } else if (/(Android)/i.test(navigator.userAgent)) {
                //判断Android
                //alert(navigator.userAgent); 
                skill.openBuy(info.id, info.title_url, info.title, info.skill_money, info.publish_type);
            }
        },
        //app调用评论
        input: function (id, name, uid) {
            if (!this.is_login) {
                this.nologin();
                return;
            }
            var data = {
                skill_id: info.id
            };
            if (id) {
                data.comment_id = id;
            }
            if (name) {
                data.name = name;
                data.uid = uid;
            } else {
                data.name = "";
                data.uid = "";
            }
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                //判断iPhone|iPad|iPod|iOS
                //alert(navigator.userAgent);  
                window.webkit.messageHandlers.openComment.postMessage(data);
            } else if (/(Android)/i.test(navigator.userAgent)) {
                //判断Android
                //alert(navigator.userAgent); 
                skill.openComment(JSON.stringify(data));
            }
        },
        //分页加载评论
        ajaxlist: function (page) {
            var self = this;
            if (this.more) {
                $.ajax({
                    type: "GET",
                    url: "/skill/comments",
                    data: { page: self.page, len: self.len, id: info.id },
                    dataType: "json",
                    success: function (res) {
                        var data = res;
                        if (data.err == "") {
                            var datalist = data.out.datas;
                            if (datalist.length) {
                                // console.log(datalist.length)
                            }
                            self.page += 1;
                            $.each(datalist, function (index, val) {
                                self.list.push(val);
                            });
                        }
                    }
                });
            }
        },
        //查看视频技能的免费文本
        seevideo: function () {
            $("#app").css("display", "block");
            var self = this;
            self.isvideo = false;
            var if_img = false;
            if (info.text_free) {
                $.each(JSON.parse(info.text_free), function (index, val) {
                    var html = '';
                    if (val.img != "") {
                        if_img = true;
                        html = html + '<p>[图片]</p>';
                    } else if (val.text != "") {
                        if (val.text.length <= 50) {
                            html = html + '<p>' + val.text + '</p>';
                        } else {
                            var text = val.text.substring(0, 50);
                            html = html + '<p>' + val.text + '</p>';
                        }
                    }
                    self.free_conent = self.free_conent + html;
                });
                setTimeout(function () {
                    var free_h = $("#free").height();
                    console.log(free_h);
                    if (free_h > 90) {
                        self.isvideo = true;
                        self.free_conent = self.free_conent + '<span class="opentext" onclick="otxt(true)">展开>></span>';
                    } else {
                        if (if_img) {
                            self.isvideo = true;
                            self.free_conent = self.free_conent + '<span class="opentext" onclick="otxt(true)">展开>></span>';
                        } else {
                            self.opentext();
                        }
                    }
                }, 20);
            } else {
                this.isvideo = false;
            }
        },
        //加载技能免费内容
        onfree: function () {
            $("#app").css("display", "block");
            this.isvideo = false;
            var self = this;
            self.free_conent = '';
            if (info.text_free) {
                $.each(JSON.parse(info.text_free), function (index, val) {
                    var html = '';
                    if (val.img != "") {
                        html = html + '<img class="lazy lazy_img"  data-original="' + val.img + '"   />';
                    } else if (val.text != "") {
                        html = html + '<p>' + val.text + '</p>';
                    };

                    self.free_conent = self.free_conent + html;
                });
                setTimeout(function () {
                    var src = $(".lazy");
                    for (i = 0; i < src.length; i++) {
                        var url = $(src[i]).attr("data-original");
                        $(src[i]).attr("src", url);
                        $(src[i]).removeClass('lazy_img');
                    }
                }, 700);
            }
        },
        //加载技能收费内容
        oncharge: function () {
            this.disnone1 = false;
            var self = this;
            if (info.text_charge) {
                $.each(JSON.parse(info.text_charge), function (index, val) {
                    var html = '';
                    if (val.img != "") {
                        html = html + '<img class="lazy"  data-original="' + val.img + '" />';
                    } else if (val.text != "") {
                        html = html + '<p>' + val.text + '</p>';
                    };
                    self.charge_conent = self.charge_conent + html;
                });
                setTimeout(function () {
                    var src = $(".lazy");
                    for (i = 0; i < src.length; i++) {
                        var url = $(src[i]).attr("data-original");
                        $(src[i]).attr("src", url);
                    }
                }, 500);
            }
        },
        opentext: function () {
            $(".first").removeClass("first");
            $(".free_hide").removeClass("free_hide");
            $(".opentext").remove();

            this.onfree();
            this.isvideo = false;
        },
        //点赞
        praise: function () {
            if (!this.is_login) {
                this.nologin();
                return;
            }
            var self = this;
            if (is_favour != '0') {
                return;
            }
            $.ajax({
                type: "POST",
                url: "/skill/favour",
                data: { id: info.id },
                dataType: "json",
                success: function (res) {
                    var data = res.out;
                    if (data.status == "ok") {
                        is_favour = '1';
                        $(".favour_num").css("color", "#ff5f00");
                        self.favour_img = '/img/favour_old.png';
                        self.favour_num += 1;
                        self.isfavour = true;
                    }
                }
            });
        },
        //收藏
        collect: function () {
            if (!this.is_login) {
                this.nologin();
                return;
            }
            var self = this;
            if (is_collect != '0') {
                $.ajax({
                    type: "POST",
                    url: "/sel/clearco",
                    data: { skill_id: info.id },
                    dataType: "json",
                    success: function (res) {
                        var data = res.out;
                        if (data.status == "ok") {
                            is_collect = '0';
                            self.iscollect = false;
                            self.collsrc = '/img/star.png';
                        }
                    }
                });
            } else {
                $.ajax({
                    type: "POST",
                    url: "/skill/collect",
                    data: { id: info.id },
                    dataType: "json",
                    success: function (res) {
                        var data = res.out;
                        if (data.status == "ok") {
                            is_collect = '1';
                            self.collsrc = '/img/star_1.gif';
                            self.iscollect = true;
                        }
                    }
                });
            }
        },
        openuser: function (i, t) {
            if (t) {
                var id = i;
            } else {
                var id = info.publisher_id;
            }
            var data = {
                id: id
            };
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                //判断iPhone|iPad|iPod|iOS
                //alert(navigator.userAgent);  
                window.webkit.messageHandlers.openUser.postMessage(data);
            } else if (/(Android)/i.test(navigator.userAgent)) {
                //判断Android
                //alert(navigator.userAgent); 
                window.skill.openUser(id);
            }
        },
        //未登录
        nologin: function () {
            var data = {
                type: true
            };
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                //判断iPhone|iPad|iPod|iOS
                //alert(navigator.userAgent);  
                window.webkit.messageHandlers.openLogin.postMessage(data);
            } else if (/(Android)/i.test(navigator.userAgent)) {
                //判断Android
                //alert(navigator.userAgent); 
                window.skill.openLogin(true);
            }
        },
        //关注
        follow: function () {
            if (!this.is_login) {
                this.nologin();
                return;
            }
            if (info.isme) {
                return;
            }
            var self = this;
            var url = "/follower/follow_user";
            var data = {};
            if (this.is_follow == "/img/no_follow.png") {
                data = { ids: [info.publisher_id] };
            } else {
                data = { id: info.publisher_id };
                url = "/follower/del_user";
            }
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "json",
                success: function (res) {
                    var data = res.out;
                    if (data.status == "ok") {
                        if (url == "/follower/follow_user") {
                            if (info.focushme == 1) {
                                self.is_follow = '/img/over_follow.png';
                            } else {
                                self.is_follow = '/img/follow.png';
                            }
                        } else {
                            self.is_follow = '/img/no_follow.png';
                        }
                    }
                }
            });
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            var self = this;
            this.money = "￥" + info.skill_money / 100;
            // document.onkeydown = function (event) {
            //     var e = event || window.event || arguments.callee.caller.arguments[0];
            //     if (event.keyCode == 13) { // 回车键     
            //         self.send();
            //         $('.text').blur();
            //     }
            // };
            $(window).scroll(function () {
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height();
                var windowHeight = $(this).height();
                // console.log(scrollHeight - (scrollTop + windowHeight))
                if (scrollHeight - (scrollTop + windowHeight) <= 20) {
                    self.ajaxlist(self.page);
                }
            }
            //获取评论，点赞，收藏
            );$.ajax({
                type: "GET",
                url: "/skill/extra_info",
                data: { id: info.id },
                dataType: "json",
                success: function (res) {
                    var data = res.out;
                    if (res.err == "") {
                        if (data.comments.length > 0) {
                            $("#no_comment").hide();
                            self.list = data.comments;
                        }
                        if (data.isFavour != '0') {
                            $(".favour_num").css("color", "#ff5f00");
                            self.favour_img = '/img/favour_old.png';
                        }
                        if (data.isCollect != '0') {
                            self.collsrc = '/img/star_1.png';
                        }
                        is_collect = data.isCollect;
                        is_favour = data.isFavour;
                    }
                },
                error: function (err) {}
            });
            //判断关注关系
            $.ajax({
                type: "GET",
                url: "/sel/skillrel",
                data: { id: info.publisher_id },
                dataType: "json",
                success: function (res) {
                    var data = res.out;
                    if (res.err == "") {
                        info.focushme = data.focushme;
                        if (info.isme) {
                            self.is_follow = "/img/follow.png";
                        } else {
                            if (data.focushim == 1) {
                                if (data.focushme == 1) {
                                    self.is_follow = '/img/over_follow.png';
                                } else {
                                    self.is_follow = "/img/follow.png";
                                }
                            }
                        }
                    }
                },
                error: function (err) {}
            });
            if (info.publish_type == 'video') {
                this.seevideo();
                this.pro = '此为收费视频，部分视频为收费内容';
                if (info.buy) {
                    this.disnone = false;
                }
            } else {
                this.onfree();
                this.isvideo1 = false;
            }
            if (info.skill_money == 0) {
                this.disnone = false;
            } else {
                if (info.buy) {
                    this.disnone1 = false;
                } else {
                    this.disnone1 = true;
                }
            }
            if (info.text_charge) {
                this.oncharge();
                this.disnone1 = false;
            }
        });
    }
});

$(document).ready(function () {
    $('a').click(function (event) {
        var url = $(this).attr('href');
        if (url != '#comment') {
            return false;
        }
    });
}
//app评论回调
);function onComment(obj) {
    $("#no_comment").hide();
    app.list.unshift(obj);
    app.num = Number(app.num) + 1;
}
function otxt() {
    app.opentext();
}
function getLocalTime(times) {
    return new Date(parseInt(times) * 1000).Format("yyyy-MM-dd");
}