$(function(){
    
    init();
    function init(){
        if(!$.isLogin()){
            $.setPageUrl();
            location.href='login.html'
        }else{
            $('body').fadeIn();
            getUserinfo();
            eventList();
        }
    }

    function getUserinfo(){
        $.get("my/users/userinfo", 
            function (result) {
                console.log(result);
                if(result.meta.status==200){
                    $('.username').text(result.data.user_tel);
                    $(".user_email").text(result.data.user_email)
                }else{
                    console.log('GG');
                }
            }
        );
        // var getUser= $.getUserInfo();
        // console.log(getUser);

    }

    function eventList(){
        $('#btn_login_out').on('tap',function(){
            console.log(1);
            mui.confirm('您确定要退出吗','提示',['退出','取消'],function(e){
                if(e.index==0){
                    $.removeUserInfo();
                    $.setPageUrl();
                    location.href="login.html";
                }else{

                }
            })
        })
    }
})