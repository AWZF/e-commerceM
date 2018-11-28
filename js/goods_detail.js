$(function () {
    var GoodsObj;
    init();

    function init() {
        addCar();
        getProDetail();
    }
    // 获取当前id
    // function getUrl(name) {
    //     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    //     var r = window.location.search.substr(1).match(reg);
    //     if (r != null) return decodeURI(r[2]);
    //     return null;
    // }
    // 发送请求获取数据
    function getProDetail() {
        $.ajax({
            type: "get",
            url: "goods/detail",
            data: {
                goods_id: $.getUrl('goods_id')
            },
            dataType: "json",
            success: function (result) {
                if (result.meta.status == 200) {
                    console.log(result);
                    GoodsObj = result.data;
                    var html = template("lbtTemp", GoodsObj);
                    $(".pyg_view").html(html);
                    var gallery = mui('.mui-slider');
                    gallery.slider({
                        interval: 1000
                    });
                }
            }
        });
    }

    function addCar() {
        $('#add_btn').on('tap', function () {
            // var userinfoStr = sessionStorage.getItem("userinfo");
            if (!$.isLogin()) {
                mui.toast("请先登录");
                $.setPageUrl();
                setTimeout(function () {
                    location.href = 'login.html';
                }, 1000);
                return;
            } else {
                var goods_obj = {
                    cat_id: GoodsObj.cat_id,
                    goods_id: GoodsObj.goods_id,
                    goods_name: GoodsObj.goods_name,
                    goods_number: GoodsObj.goods_number,
                    goods_price: GoodsObj.goods_price,
                    goods_small_logo: GoodsObj.goods_small_logo,
                    goods_weight: GoodsObj.goods_weight
                }

                //  文档要求添加字符串
                var goods_objStr = JSON.stringify(goods_obj);
                var token=$.getUserInfo().token;
                $.ajax({
                    type: "post",
                    url: "my/cart/add",
                    data: {
                        info:goods_objStr
                    },
                    dataType: "json",
                    headers:{
                        Authorization:token
                    },
                    success: function (result) {
                        console.log(result);
                        if(result.meta.status==200){
                            mui.confirm("是否跳转到购物车页面？", "温馨提示", ["跳转", "取消"], function (eType) {
                                // console.log(a,b,c,d,e);
                                if (eType.index == 0) {
                                  // console.log("跳转");
                                  location.href = "cart.html";
                                } else if (eType.index == 1) {
                                //    取消
                                  console.log("取消");
                                }
                              });
                        }else{
                            mui.toast(result.meta.msg);
                        }
                    }
                });
            }
        })
    }




})