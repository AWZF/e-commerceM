$(function () {
    init();

    function init() {
        Login();
    }

    function Login() {
        $('#login_btn').on('tap', function () {
            // 获取数据
            var username = $("[name='username']").val().trim();
            var password = $("[name='password']").val().trim();
            //验证数据
            if(!$.checkPhone(username)){
               mui.toast('手机号码不正确');
               return;
            }
            if(password.length<6){
                mui.toast('密码不合法');
                return;
            }    
            $.ajax({
                type: "post",
                url: "login",
                data: {
                    username:username,
                    password:password
                },
                dataType: "json",
                success: function (result) {
                    console.log(result);
                    if(result.meta.status == 200){

                        mui.toast('登陆成功');
                        // 字符串  用户本地存储归用户 商品的信息归商品
                        // sessionStorage.setItem('userinfo',JSON.stringify(result.data));
                        $.setUserInfo(result.data);
                        var pageurl=$.getPageUrl();
                        if(!pageurl){
                            pageurl='../index.html';
                        }
                        setTimeout(function(){
                            location.href=pageurl;
                        },1000);
                    }else{
                        mui.toast(result.meta.msg);
                    }
                }
            });



        })
    }

})