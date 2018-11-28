$(function () {


    // 1.模板引擎的变量引入  注意模板引入一样不能随便加空格
    var baseurl = 'http://api.pyg.ak48.xyz/';

    if (window.template) {
        template.defaults.imports.baseurl = baseurl;
    }

    // 2.公共函数的封装 zepto的拓展 作用域
    $.extend($, {
        // url的id值获取
        getUrl: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        // 手机号码的验证
        checkPhone: function (phone) {
            if (!(/^1[34578]\d{9}$/.test(phone))) {
                return false;
            } else {
                return true;
            }
        },
        // 邮箱的验证
        checkEmail: function (myemail) {
            var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
            if (myReg.test(myemail)) {
                return true;
            } else {
                return false;
            }
        },
        // 存用户信息到本地
        setUserInfo: function (obj) {
            sessionStorage.setItem('userinfo', JSON.stringify(obj));
        },
        // 判断用户是否存在
        isLogin: function () {
            var userinfoStr = sessionStorage.getItem("userinfo");
            if (userinfoStr) {
                return true;
            } else {
                return false;
            }
        },
        // 获取用户信息
        getUserInfo: function () {
            var userinfoStr = sessionStorage.getItem('userinfo');
            return JSON.parse(userinfoStr);
        },
        // 删除用户信息
        // 获取当前页面的路径
        getPageUrl:function(){
            return sessionStorage.getItem('pageurl');
        },
        // 存入当前的页面路径
        setPageUrl:function(){
            return sessionStorage.setItem('pageurl',location.href);
        }
        // 设置分类数据
        // 获取分类数据

    })

    $.ajaxSettings.beforeSend = function (xhr, ajaxObj) {
        ajaxObj.url = baseurl + 'api/public/v1/' + ajaxObj.url;
        if (ajaxObj.url.indexOf('/my/') != -1) {
            xhr.setRequestHeader('Authorization', $.getUserInfo().token);
        }

        $('body').addClass('loadding');
    }

    $.ajaxSettings.complete = function () {
        $('body').removeClass('loadding');
    }

})