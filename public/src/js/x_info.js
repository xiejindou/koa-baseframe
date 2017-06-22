var info = data.data,
    skill_time = info.publish_time,
    useragent = navigator.userAgent,
    window_h = $('window').height(),
    window_w = $('window').width(),
    data = {
        in_comment: '',
        collsrc: '/img/star.png',
        commen_id: 0,
        title: info.title,
        favour_num: info.favour_num,
        favour_img: '/img/favour.png',
        u_headurl: data.publisher_info.headimgurl,
        name: data.publisher_info.name,
        introduction:data.publisher_introduction,
        time: new Date(parseInt(skill_time) * 1000).Format("yyyy-MM-dd"),
        charge_conent: '',
        free_conent: '',
        disnone: false,
        isvideo: true,
        isvideo1: true,
        more: true,
        money: '10',
        pro: '此为收费教程,余下内容为收费部分',
        videohtml: '',
        isact:false
    };
    console.log(info)
var app = new Vue({
    el: '#app',
    data: data,
    methods: {     
        onfree: function () {
            $("#app").css("display", "block");
            if (info.text_free) {       
                this.isvideo = false;
                var html = '';
                $.each(JSON.parse(info.text_free), function (index, val) {
                    if (val.img != "") {
                        html = html + '<img src="' + val.img + '" />'
                    } else if (val.text != "") {
                        html = html + '<p>' + val.text + '</p>'
                    }
                })
                this.free_conent = html;
            }

        },
        oncharge: function () {
            if (info.text_charge) {
                var html = '';
                $.each(JSON.parse(info.text_charge), function (index, val) {
                    if (val.img != "") {
                        html = html + '<img src="' + val.img + '" />'
                    } else if (val.text != "") {
                        html = html + '<p>' + val.text + '</p>'
                    }
                })
                this.charge_conent = html;
            }

        },
        seevideo: function () {
            video();
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            var self = this;
            if (info.publish_type == 'video') {
                this.onfree();
                this.seevideo();
                if (info.text_charge) {
                    this.oncharge();
                    this.disnone = true;
                }
            } else {
                this.onfree();
                this.isvideo1 = false;
                if (info.text_charge) {
                    this.oncharge();
                    this.disnone = true;
                }
            }
            if(info.publish_type == "activity"){
                this.isact = true;
            }
        })
    }
});
var player;
function video() {
    var vid = info.play_id;
    app.videohtml = "<div id='plv_" + vid + "'></div>";
    setTimeout(function () {
        player = polyvObject('#plv_' + vid).videoPlayer({
            'width': $("#app").width(),
            'height': $("#app").width() * 0.6,
            'vid': vid
        });
    }, 300)
}