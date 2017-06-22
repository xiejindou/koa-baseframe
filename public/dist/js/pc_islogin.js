$.get('/user/is_login', function (data, err) {
    if (data.login == false) {
        alert("请先登录");
        window.location.href = "login.html";
    } else {
        $("body").css('display', 'block');
    }
});