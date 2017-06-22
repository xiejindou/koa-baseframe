var app = new Vue({
    el: '#app',
    methods: {
        out: function () {
            var logout = confirm("确定退出？");
            if (logout) {
                this.$http.post("/xadmin/logout").then(res => {
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
    }
})