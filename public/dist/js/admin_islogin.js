$.get('/other/admin/is_login', function (data, err) {
    if (!data.out.status) {
        alert("请先登录");
        window.location.href = "login.html";
    } else {
        $("body").css('display', 'block');
    }
});