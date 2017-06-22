var h = $(window).height();
var w = $(window).width();
$("body").height(h);
$("body").width(w);
var num = 0;
//手机验证码登录
var login = new Vue({
	el: "#login",
	data: {
		phone: '',
		code: '',
		isActive: false,
		isActive1: false
	},
	methods: {
		focustel: function () {
			$('#tel').focus();
			// $("#text_tel").text("|");
		},
		incode: function () {
			$("#code").focus();
		},
		clear_code: function () {
			this.code = "";
			num = 0;
			for (i = 1; i <= 6; i++) {
				$("#code" + i).val("");
			}
			this.isActive1 = false;
			$(".close_code").hide();
		},
		clear_tel: function () {
			this.phone = "";
			$("#text_tel").val("");
			this.isActive = false;
			$(".err_tel").hide();
			$(".close_tel").attr("src", "/img/close.png");
		},
		txt_tel: function (t, h) {
			if (h >= 3 && h < 7) {
				var t1 = t.substring(0, 3) + "-";
				if (h == 3) {
					return t1;
				} else {
					t1 = t1 + t.substring(3, h);
					return t1;
				}
			} else if (h >= 7) {
				var t1 = t.substring(0, 3) + "-" + t.substring(3, 7) + "-";
				if (h == 7) {
					return t1;
				} else {
					t1 = t1 + t.substring(7, h);
					return t1;
				}
			}
		},
		send: function () {
			$("#err_code").show();
			$(".code_list").show();
			$(".in_code").show();
			this.get_code();
			var num = 60;
			$(".s_code").html("重新获取(" + num + ")");
			$(".s_code").attr("disabled", "disabled");
			$(".s_code").addClass('code_acitve');
			var time = setInterval(function () {
				if (num == 0) {
					clearInterval(time);
					$(".s_code").attr("disabled", false);
					$(".s_code").removeClass('code_acitve');
					$(".s_code").html("重新获取");
					return;
				}
				num = num - 1;
				$(".s_code").html("重新获取(" + num + ")");
			}, 1000);
		},
		get_code: function () {
			console.log("get_code");
			var myphone = $('#tel').val();
			console.log(myphone);
			$.ajax({
				url: '/login/sendCode',
				type: 'post',
				dataType: 'json',
				data: { tel: myphone },
				success: function (data) {
					console.log(data);
				},
				err: function (error) {
					console.log(error);
				}
			});
		},
		post_code: function (code) {
			var myphone = $('#tel').val();
			var in_code = $('#code').val();
			var self = this;
			$('.s_code').hide();
			$('.loading').show();
			$.ajax({
				url: '/login/verifyCode',
				type: 'post',
				dataType: 'json',
				data: { tel: myphone, code: in_code, type: 0 },
				success: function (data) {
					$('.loading').hide();
					if (data.err == "验证码错误") {
						$('.s_code').show();
						$(".close_code").show();
						self.isActive1 = true;
					}
					if (data.err == "") {
						var url = window.location.href;
						var backurl = "";
						if (url.indexOf("backurl") > 0) {
							backurl = url.split("backurl=")[1];
							window.location.href = url;
						} else {
							$.ajax({
								url: '/login/gourl',
								type: 'post',
								dataType: 'json',
								data: { backurl: backurl },
								success: function (data) {
									window.location.href = data.url;
								},
								err: function (error) {
									console.log(error);
								}
							});
						}
					}
				}
			});
		}
	},
	watch: {
		phone: function (val) {
			var length = val.length;
			$(".close_tel").show();
			var tel = '';
			if (length > 2) {
				tel = this.txt_tel(val, length);
			} else {
				tel = val;
			}
			if (length == 11) {
				//验证手机号
				if (!/^1[34578]\d{9}$/.test(val)) {
					// $("#err_phone").addClass('err_acvtie');
					this.isActive = true;
					$(".err_tel").show();
					$(".close_tel").attr("src", "/img/close_err.png");
				} else {
					$("#tel").blur();
					$('.t_code').hide();
					$(".s_code").show();
					$("#err_code").hide();
				}
			}
			$("#text_tel").val(tel);
		},
		code: function (val) {
			for (i = 1; i <= val.length; i++) {
				$("#code" + i).val(val.substring(i - 1, i));
			};
			num = val.length;
			if (num == 6) {
				$("#code").blur();
				this.post_code();
			}
		}
	}
});
document.onkeydown = function (event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if (e && e.keyCode == 8) {
		// 按删除键
		$("#code" + num).val("");
	}
};