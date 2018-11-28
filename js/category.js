$(function () {
    // 声明相关的全局变量
    var myScroll;
    var Bdata;
    var obj;
    // 1.发送请求 get 本地存储 动态渲染
    function getCategoryDate() {
        $.ajax({
            type: "get",
            url: "categories",
            dataType: "json",
            success: function (result) {

                if (result.meta.status == 200) {
                    Bdata = result.data;
                    obj = {
                        data: Bdata,
                        time: Date.now()
                    }
                    console.log(obj);
                    localStorage.setItem('cates', JSON.stringify(obj));
                    getCategoryFirst();
                    getCategorySecond(0);
                }
            }
        });
    }
    // 2.动态渲染左侧
    function getCategoryFirst() {
        // console.log(obj.data);
        $('.left>ul').html(template('leftTemp', {
            data: obj.data
        }));
    }
    // 3.动态渲染右侧
    function getCategorySecond(Id) {

        var data = obj.data[Id].children;
        data = {
            data: data
        }
        console.log(data);
        var html = template('rightTemp', data);
        console.log(html);
        $('.right .ulbox').html(html);
        // 最后一张初始化 节省资源 减轻服务器压力
        var times = $('.right img').length;
        // console.log(times);
        $('.right img').on('load', function () {
            times--;
            // console.log(times);
            if (times == 0) {
                var right = document.querySelector('.right');
                var myScroll2 = new IScroll(right, {
                    scrollX: false,
                    scrollY: true,
                })
            }

        })
    };
    // 4.本地存储的渲染判断 
    //          (1.没有本地存储重新请求 2.有本地存储 
    //          a.未过期则动态渲染 左右两侧 初始id为0 b.过期则重新调用请求函数)
    function renderCategoryFirst() {
        if (localStorage.getItem('cates')) {
            obj = JSON.parse(localStorage.getItem('cates'));
            if (Date.now() - obj.time > 3600 * 1000) {
                getCategoryDate();
            } else {
                getCategoryFirst();
                getCategorySecond(0);
            }
        } else {
            getCategoryDate();
        }
    }
    renderCategoryFirst();
    // 5.快速点击事件的引入
    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function () {
            // document.body:说明document.body中所有元素都会使用fastclick来实现单击事件的触发
            FastClick.attach(document.body);
        }, false);
    }
    // 6.事件委托 根据id调用对应数据 渲染右侧
    $('.left').on('click', 'a', function () {
        if ($(this).parent().hasClass('now')) {
            return false;
        }
        $('.left li').removeClass('now');
        $(this).parent().addClass('now');
        var id2 = $(this).parent().index();
        getCategorySecond(id2);
        var left = document.querySelector('.left');
        myScroll = new IScroll(left, {
            scrollX: false,
            scrollY: true
        })
        myScroll.scrollToElement(this);

    });

    // 7.页面变化 设置对应的HTML页面字体大小  要计算的fontsize的大小=  基础值 *  要适配的屏幕的宽度/   设计稿的宽度 （640）
    //     设计稿的宽度 （320） / 基础值  =   要适配的屏幕的宽度 /要计算的fontsize的大小   
    setFont();
    function setFont() {
        var baseVal = 100;
        var pageWidth = 320;
        var screenWidth = document.querySelector('html').offsetWidth;
        var fz = baseVal * screenWidth / pageWidth;
        document.querySelector('html').style.fontSize = fz + 'px';
    }
    window.onresize = function () {
        console.log('变化');
        setFont();
    }
});