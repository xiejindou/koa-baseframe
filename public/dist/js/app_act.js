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
    free_conent: '',
    disnone: true,
    disnone1: true,
    list: [],
    page: 1,
    join_page: 0,
    len: 5,
    more: true,
    isfavour: false,
    iscollect: false,
    money: '10',
    is_login: false,
    isactivity: true,
    end_time: '1123',
    also_time: '20',
    also_people: '123',
    limit_people: '/200',
    timeover: false,
    pro: '此为收费教程，余下内容为收费部分',
    uid: '123',
    sign_list: [],
    isbuy: false,
    isme: false,
    see_all: true,
    see_all1: false,
    see_list: false,
    join_num: '',
    all_list: [],
    s_time: '',
    cookie: '',
    cookie1: ''
};
// function if_login(t) {
//     if (t == "yes") {
//         sessionStorage.setItem('islogin',true);
//     }
//     var get = sessionStorage.getItem('islogin');
//     if (get) {
//         data1.is_login = true;
//     } else {
//         $.get('/user/is_login', function (data, err) {
//             if (data.out.status) {
//                 data1.is_login = true;
//             }
//         })
//     }
// }
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
            this.scroll();
            if (!this.is_login) {
                this.nologin();
                return;
            }
            if (this.timeover) {
                return;
            }
            if (info.isme) {
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
                    skill.openNoBuy('该活动正在审核中...');
                }
                return;
            }
            var data = {
                id: info.id,
                title_url: info.title_url,
                title: info.title,
                money: info.skill_money,
                type: 'activity'
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
                            if (datalist.length == 0) {
                                self.more = false;
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
        onfree: function () {
            $("#app").css("display", "block");
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
                        var top = sessionStorage.getItem('top');
                        $(window).scrollTop(top);
                    }
                }, 700);
            }
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
        see: function () {
            // window.location.href = "/activity/activity_all.html?id=" + info.id;
            this.ajax_join(30);
            this.see_list = true;
            var self = this;
            $('body').addClass('scroll');
            this.s_time = setInterval(function () {
                var scrollTop = $("#see_list").scrollTop();
                var windowHeight = $(window).height();
                var scrollHeight = $(".isme_list1").height();
                // console.log(scrollHeight - (scrollTop + windowHeight))
                if (scrollHeight - (scrollTop + windowHeight) <= 20) {
                    self.ajax_join(30);
                }
            }, 1000);
        },
        close_list: function () {
            this.see_list = false;
            $('body').removeClass('scroll');
        },
        list_color: function () {
            var l = $(".isme_list").children();
            for (var i = 0; i <= l.length; i++) {
                if (i % 2 == 0) {
                    $(l[i]).css("background", "#fff");
                } else {
                    $(l[i]).css("background", "#fff9f6");
                }
            }
            var l1 = $(".isme_list1").children();
            for (var i = 0; i <= l1.length; i++) {
                if (i % 2 == 0) {
                    $(l1[i]).css("background", "#fff");
                } else {
                    $(l1[i]).css("background", "#fff9f6");
                }
            }
        },
        ajax_join: function (len) {
            var self = this;
            $.ajax({
                type: "GET",
                url: "/skill/activity_users",
                data: { id: info.id, page: self.join_page, len: len },
                dataType: "json",
                success: function (res) {
                    var data = res.out;
                    if (len != 10) {
                        self.join_page += 1;
                    }
                    if (res.err == "") {
                        if (len == 10) {
                            self.also_people = data.count;
                            if (data.count > 10) {
                                data.datas.splice(0, 1);
                                self.see_all1 = true;
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
                            if (data.datas.length == 0) {
                                self.see_all = false;
                            }
                        } else {
                            if (data.datas.length == 0) {
                                clearInterval(self.s_time);
                            }
                        }
                        if (info.isme) {
                            for (var i = 0; i < data.datas.length; i++) {
                                // self.all_list.push(data.datas[i]);
                                var html = "<li><p class='list_num'>" + (i + 1) + "</p>";
                                html += "<p class='list_id'>" + data.datas[i].user_name + "</p>";
                                html += "<p class='list_name'>" + data.datas[i].activity_user_name + "</p>";
                                html += "<p class='list_tel'>" + data.datas[i].activity_user_phone + "</p></li>";
                                if (len == 10) {
                                    $(".isme_list").append(html);
                                } else {
                                    $(".isme_list1").append(html);
                                    $('.see_list').height(window_h);
                                }
                            }
                            self.list_color();
                            // self.all_list = data.datas;
                        }
                    }
                },
                error: function (err) {}
            });
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
        },
        scroll: function () {
            var top = $(window).scrollTop();
            sessionStorage.setItem("top", top);
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            var self = this;
            if (info.skill_money == "0") {
                this.money = '活动免费报名';
            } else {
                this.money = "￥" + info.skill_money / 100;
            }
            if (info.activity_limit) {
                if (info.activity_limit > 0) {
                    this.limit_people = "/" + info.activity_limit;
                } else {
                    this.limit_people = "";
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
                this.also_time = 0;
                this.timeover = true;
                this.isactivity = false;
            }
            this.end_time = new Date(parseInt(info.activity_tm) * 1000).Format("yyyy-MM-dd");
            self.ajax_join(10);
            $(window).scroll(function () {
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height();
                var windowHeight = $(this).height();
                // console.log(scrollHeight - (scrollTop + windowHeight))
                if (scrollHeight - (scrollTop + windowHeight) <= 20) {
                    self.ajaxlist(self.page);
                }
            });
            $.ajax({
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
            if (info.isme) {
                this.isme = true;
            } else {
                if (info.buy) {
                    this.isbuy = true;
                    this.disnone = false;
                    $.ajax({
                        type: "GET",
                        url: "/skill/activity_buy_num",
                        data: { id: info.id },
                        dataType: "json",
                        success: function (res) {
                            var data = res.out;
                            if (res.err == "") {
                                if (data.num < 10) {
                                    self.join_num = "0" + data.num;
                                } else {
                                    self.join_num = data.num;
                                }
                            }
                        },
                        error: function (err) {}
                    });
                }
            }
            this.onfree();
        });
    }
});
//购买回调
function onPayBack(img, num) {}
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
function getLocalTime(times) {
    return new Date(parseInt(times) * 1000).Format("yyyy-MM-dd");
}