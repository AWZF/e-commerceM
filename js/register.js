$(function () {
    init();

    function init() {
        Verification();
    }

    function Verification() {
        $('#code_btn').on('tap', function () {

            var phone_txt = $("[name='mobile']").val().trim();
            console.log(phone_txt);
            if (!$.checkPhone(phone_txt)) {
                // 匹配成功如何条件为true
                mui.toast("手机号码不合法");
            } else {
                $.ajax({
                    type: "post",
                    url: "users/get_reg_code",
                    data: {
                        mobile: phone_txt
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.meta.status == 200) {
                            console.log(result);
                            $('#code_btn').attr('disabled', 'disabled');
                            var times = 5;
                            $('#code_btn').text(times + '秒后在获取');
                            var timeId = setInterval(() => {
                                times--;
                                $('#code_btn').text(times + '秒后在获取');
                                if (times == 0) {
                                    clearInterval(timeId);
                                    $("#code_btn").text("获取验证码");
                                    // 移除属性
                                    $("#code_btn").removeAttr("disabled");
                                }
                            }, 1000);
                        } else {
                            // 获取失败
                        }
                    }
                });
            }
        })
    }

    // 验证其他内容
    $('#register_btn').on('tap', function () {
        var phone = $("[name='mobile']").val().trim();
        var code = $("[name='code']").val().trim();
        var email = $("[name='email']").val().trim();
        var pwd = $("[name='pwd']").val().trim();
        var pwd2 = $("[name='pwd2']").val().trim();
        var gender = $("[name='gender']:checked").val();
        if (!$.checkPhone(phone)) {
            mui.toast("手机号码不合法");
            return;
        }
        if (pwd != pwd2) {
            mui.toast("两次输入的密码不一样");
            return;
        }
        if (!$.checkEmail(email)) {
            mui.toast("请输入正确邮箱");
            return;
        }

        if (pwd.length < 6) {
            mui.toast("密码不合法");
            return;
        }
        if (code.length != 4) {
            mui.toast("验证码不合法");
            return;
        }
        var data = {
            mobile: phone,
            code: code,
            email: email,
            pwd: pwd,
            gender: gender
        };
        console.log(data);
        $.ajax({
            type: "post",
            url: "users/reg",
            data: data,
            dataType: "json",
            success: function (result) {
                console.log(result);

                if (result.meta.status == 200) {
                    mui.toast("注册成功");
                    setTimeout(function () {
                        location.href = "login.html";
                    }, 2000);
                } else {
                    mui.toast(result.meta.msg);
                }
            }
        });


    })

})