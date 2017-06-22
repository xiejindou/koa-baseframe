var h = $(window).height();
$("body").height(h);
var releaseChart,
    payChart,
    commentChart,
    readChart,
    option;
Vue.component('count', {
    template: '#main',
    data: function () {
        return {
            deal_total: 0,
            pic_total: 0,
            video_total: 0,
            skill_total: 0,
            trade: 0,
            button_list: [],
            modal_list: [],
            modal: false,
            isActive: true,
            isActive1: false,
            modifylist: [],
            imgurl: '',
            a_value: '',
            noimg: '/img/noimg.jpg',
            num: 0,
            is_act: false,
            all_url: "/img/all_skill.png",
            video_url: "/img/video_skill.png",
            pic_url: "/img/pic_skill.png",
            all_url1: '',
            video_url1: '',
            pic_url1: '',
            no_url: "/img/no_skill.png",
            is_all: true,
            is_video: false,
            is_pic: false,
            release_type: 0,
            pay_type: 0,
            comment_type: 0,
            read_type: 0,
            daydata: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],
            weekdata: ['星期天','星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            monthdata: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
            timelist: [{ data: '日' }, { data: '周' }, { data: '月' }],
            category_id: 'all',
            seclect_time: '',
            seclect_type: ['all'],
            seclect_day: 'day',
            option: {
                title: {
                    left: 'left',
                    text: '发布数量',
                },
                tooltip: {
                    trigger: 'axis',
                },
                // legend: {
                //     data:['日']
                // },
                xAxis: {
                    boundaryGap: false,
                    data: ["0","1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
                },
                yAxis: {},
                series: []
            },
        }
    },
    methods: {
        categoy_btn(e, i) {
            var list = $(".button_list li");
            list.removeClass('listact');
            if (i == 'all') {
                $(list[0]).addClass('listact');
                this.category_id = 'all';
            } else {
                $(list[i + 1]).addClass('listact');
                this.category_id = this.button_list[i].id;
            }
            this.is_act = true;
            this.getdata();
        },
        skill(i) {
            switch (i) {
                case 1:
                    if (this.is_all) {
                        this.all_url1 = this.no_url;
                        this.is_all = false;
                        this.removeByValue(this.seclect_type, "all");
                    } else {
                        this.all_url1 = this.all_url;
                        this.is_all = true;
                        this.seclect_type.push("all");
                    }; break;
                case 2:
                    if (this.is_video) {
                        this.video_url1 = this.no_url;
                        this.is_video = false;
                        this.removeByValue(this.seclect_type, "video");
                    } else {
                        this.video_url1 = this.video_url;
                        this.is_video = true;
                        this.seclect_type.push("video");
                    }; break;
                case 3:
                    if (this.is_pic) {
                        this.pic_url1 = this.no_url;
                        this.is_pic = false;
                        this.removeByValue(this.seclect_type, "graphic");
                    } else {
                        this.pic_url1 = this.pic_url;
                        this.is_pic = true;
                        this.seclect_type.push("graphic");
                    }; break;
            }
            this.getdata();
        },
        removeByValue(arr, val) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == val) {
                    arr.splice(i, 1);
                    break;
                }
            }
        },
        open() {
            this.modal_list = this.button_list;
            console.log(this.button_list)
            this.modal = true;
            this.displayborder();
        },
        input_click(e, t) {
            this.modifylist.push(this.modal_list[t]);
        },
        keep() {
            var list = this.modifylist;
            this.$http.post("/other/set_categorys", { categorys: list }).then(res => {
                var data = res.body;
                if (data.err == "") {
                    this.$Message.success('保存成功');
                }
            })
        },
        cancel() {
            this.modifylist = [];
        },
        //添加分类
        add() {
            var name = this.a_value;
            this.$http.post("/other/add_category", { name: name }).then(res => {
                var data = res.body;
                if (data.err == "") {
                    this.$Message.success('添加成功');
                    this.this.modal_list.push()
                }
            })
        },
        //删除分类
        del(e, t) {
            var r = confirm("确认要删除吗？");
            if (r != true) {
                return;
            }
            var id = this.modal_list[t].id;
            this.$http.post("/other/del_category", { id: id }).then(res => {
                var data = res.body;
                if (data.err == "") {
                    this.modal_list.splice(t, 1);
                    this.$Message.success('删除成功');
                }
            })
        },
        onnum(e, t) {
            this.num = t;
            this.modifylist.push(this.modal_list[t]);
        },
        onurl(response, file, fileList) {
            if (response.err == "") {
                this.modal_list[this.num].pic = response.out.url;
                this.$Message.success('更换成功');
            }
        },
        addurl(response, file, fileList) {
            if (response.err == "") {
                this.imgurl = response.out.url;
                this.isActive1 = true;
                this.isActive = false;
            }
        },
        //选择时间类型 如日周月
        sectime(i, v) {
            var data = this.chart_xdata(i);
            var list = $(".sectime li");
            list.removeClass('radio_active');
            this.release_type = i;
            $(list[i]).addClass('radio_active');
            this.option.xAxis.data = data;
            releaseChart.setOption(this.option, true);
            payChart.setOption(this.option, true);
            commentChart.setOption(this.option, true);
            readChart.setOption(this.option, true);
            this.getdata();
        },
        //选择准确时间 如2017-01-01
        time: function (val) {
            console.log(val)
            this.seclect_time = val;
            this.getdata();
        },
        chart_xdata(i) {
            switch (i) {
                case 0: this.seclect_day = 'day'; return this.daydata; break;
                case 1: this.seclect_day = 'week'; return this.weekdata; break;
                case 2: this.seclect_day = 'month'; return this.monthdata; break;
            }
        },
        //获取数据
        getdata() {
            var self = this;
            var url = '?types=' + this.seclect_type + '&tmtp=' + this.seclect_day;
            if (this.seclect_time != "") {
                url = url + '&time=' + this.seclect_time;
            }
            if (this.category_id != "all") {
                url = url + '&sid=' + this.category_id;
            }
            this.$http.get('/xadmin/datas' + url).then(res => {
                var data = res.body.out;
                if (res.body.err == "") {
                    $.each(data, function (index, val) {
                        self.handle(val, index);
                    })
                }
            })
        },
        displayborder() {
            setTimeout(function () {
                var length = $(".modal_list li").length;
                for (i = 1; i <= length; i++) {
                    if (i % 5 == 1) {
                        $($(".modal_list li")[i - 1]).css("border-left", "none");
                    }
                }
            }, 200)
        },
        handle(obj, type) {
            if (type == "publish") {
                this.option.title.text = '发布数量';
                this.option.series = this.handle_data(obj);
                releaseChart.setOption(this.option, true);
            } else if (type == "trade") {
                this.option.title.text = '交易量';
                this.option.series = this.handle_data(obj);
                payChart.setOption(this.option, true);
            } else if (type == "comment") {
                this.option.title.text = '留言';
                this.option.series = this.handle_data(obj);
                commentChart.setOption(this.option, true);
            } else {
                this.option.title.text = '浏览量';
                this.option.series = this.handle_data(obj);
                readChart.setOption(this.option, true);
            }
        },
        handle_data: function (data) {
            var list = [];
            if (data.all) {
                var series_data = {
                    name: '全部技能',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            color: '#ff5f00'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(255,95,0)'
                            }, {
                                offset: 1,
                                color: 'rgb(255,255,255)'
                            }])
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: data.all
                }
                list.push(series_data);
            }
            if (data.video) {
                var series_data = {
                    name: '视频技能',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            color: 'rgb(72,144,226)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(72,144,226)'
                            }, {
                                offset: 1,
                                color: 'rgb(255,255,255)'
                            }])
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: data.video
                }
                list.push(series_data);
            }
            if (data.graphic) {
                var series_data = {
                    name: '图文技能',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            color: 'rgb(125,211,32)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(125,211,32)'
                            }, {
                                offset: 1,
                                color: 'rgb(255,255,255)'
                            }])
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: data.graphic
                }
                list.push(series_data);
            }
            return list;
        }
    },
    ready() {
        this.$http.get("/xadmin/statistics").then(res => {
            var data = res.body.out;
            if (res.body.err == "") {
                this.deal_total = data.all_user_count;
                this.pic_total = data.graphic_skill_count;
                this.video_total = data.video_skill_count;
                this.skill_total = data.all_skill_count;
                this.button_list = data.skill_categories;
                this.trade = data.all_trade;
                this.release_data = this.daydata;
                releaseChart = echarts.init(document.getElementById('release_num'));
                payChart = echarts.init(document.getElementById('pay_num'));
                commentChart = echarts.init(document.getElementById('comment_num'));
                readChart = echarts.init(document.getElementById('read_num'));
                this.getdata();
            } else {

            }
        })
        this.all_url1 = this.all_url;
        this.video_url1 = this.no_url;
        this.pic_url1 = this.no_url;
    }
})
var app = new Vue({
    el: '#app',
    methods: {
    }
})