/*微信分享类，依赖jquery*/

function wxshare(shareconf) {

    this.jsapi_config = {}; //签名等配置信息
    this.debug = false; //是否开启调试模式
    //
    this.title = shareconf.title || ""; //分享标题
    this.desc = shareconf.desc || ""; //分享内容
    this.link = shareconf.link || ""; //分享链接
    this.imgUrl = shareconf.imgUrl || ""; //分享图标

    //分享逻辑
    this.share = function () {
        if (!this.link) {
            throw new Error("分享链接不能为空");
        }
        if (!this.imgUrl) {
            throw new Error("分享图标不能为空");
        }
        var self = this;
        $.ajax({
            type: "GET",
            url: "https://skill.szshanlian.com/wxshare/",
            async: false,
            data: {
                url: encodeURIComponent(window.location.href)
            },
            dataType: "json",
            success: function (res) {
                //console.log(res);
                self.jsapi_config = res;
            }
        });
        //alert("当前地址是这个："+window.location.href);
        //alert(JSON.stringify(this.jsapi_config,null,4));

        wx.config({
            debug: this.debug,
            appId: this.jsapi_config.appId,
            timestamp: this.jsapi_config.timestamp,
            nonceStr: this.jsapi_config.nonceStr,
            signature: this.jsapi_config.signature,
            jsApiList: [
            // 所有要调用的 API 都要加到这个列表中
            'checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo']
        });
        /*window.shareData = {
            "imgUrl": "http://hd.yunya.me/yaguan1110/images/share.jpg",
            "tLink": "http://hd.yunya.me/yaguan1110/index.php",
            "tTitle": "【助威恒大】点亮冠军杯，200万斤大米免费送！",
            "tContent": "200万斤大米等你拿，参与即可领，每人最多可免费领6袋"
        };*/
        wx.ready(function () {
            // 在这里调用 API
            wx.checkJsApi({
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
            });
            wx.onMenuShareAppMessage({
                title: self.title,
                desc: self.desc,
                link: self.link,
                imgUrl: self.imgUrl,
                success: function (res) {
                    //alert('已分享');
                    this.appMess_success();
                },
                cancel: function (res) {
                    //alert('已取消');
                    this.appMess_cancle();
                }
            });

            wx.onMenuShareTimeline({
                title: self.title,
                link: self.link,
                imgUrl: self.imgUrl,
                success: function (res) {
                    //alert('已分享');
                    this.timeline_success();
                },
                cancel: function (res) {
                    //alert('已取消');
                    this.timeline_cancle();
                }
            });
        });
    };

    //用户确认分享到朋友圈后执行的回调函数
    this.timeline_success = function () {};

    //用户取消分享到朋友圈后执行的回调函数
    this.timeline_cancle = function () {};

    //用户确认分享给朋友后执行的回调函数
    this.appMess_success = function () {};

    //用户取消分享给朋友后执行的回调函数
    this.appMess_cancle = function () {};
}