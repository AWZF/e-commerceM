$(function () {

    init();

    function init() {
        if (!$.isLogin()) {
            $.setPageUrl();
            location.href = 'login.html';
        } else {
            $('body').fadeIn();
            CarDate();
            buttonEvent();
        }

    }
    // 各种按钮的绑定 
    function buttonEvent() {
        // 数量的增加减少 事件委托
        $('.cart_list').on('tap', '.mui-numbox .mui-btn', function () {
            Count_Money();
        })
        // 编辑按钮的切换事件
        $('#edit_btn').on('tap', function () {
            $('body').toggleClass('Classedit');
            if ($('body').hasClass('Classedit')) {
                $('#edit_btn').text('完成');
            } else {
                $('#edit_btn').text('编辑');
                editCart();
            }
        })
        $('#delete_btn').on('tap', function () {
            var DeletePro = $('.cart_list .goods_chk:checked').parents('li');
            console.log(DeletePro);
            if (DeletePro.length == 0) {
                mui.toast('你还没有选中要删除的商品');
                return;
            } else {
                mui.confirm('您确定删除吗？', '警告', ['确定', '取消'], function (eType) {
                    if (eType.index == 0) {
                        var Not_selectedlis = $('.cart_list .goods_chk').not(":checked").parents("li");

                        // 同步数据
                        synchroData(Not_selectedlis);
                    } else {
                        console.log('取消');
                    }

                })
            }
        })

    }

    // 生成购物车列表
    function CarDate() {
        $.get("my/cart/all",
            function (result) {
                console.log(result);
                if (result.meta.status == 200) {
                    var cart_infoStr = result.data.cart_info;
                    // 对购物车是否有东西进行判断
                    if (cart_infoStr) {
                        //   有数据进行渲染
                        //    转数组
                        var cart_info = JSON.parse(cart_infoStr);
                        console.log(cart_info);
                        var html = template("CarTemp", {
                            data: cart_info
                        });
                        $('.cart_list').html(html);
                        mui('.mui-numbox').numbox();
                        //  计算价格

                        Count_Money();
                    } else {
                        console.log('没有数据');
                    }
                }
            }
        );
    }


    // 计算商品的总价格 总价=单价*数量 
    function Count_Money() {
        var Nlis = $('.cart_list li');
        
        var Total_Money = 0;
        for (var i = 0; i < Nlis.length; i++) {
            var li = Nlis[i];
            var goods_obj2 = $(li).data('obj');
            // 单价
            var unit_price = goods_obj2.goods_price;
            var amount = $(li).find('.mui-numbox-input').val();
            Total_Money += unit_price * amount;
            console.log(Total_Money);
           
        }
        $('.totol_price').text(Total_Money);
    }

    // 编辑购物车
    function editCart() {
        var Nlis = $('.cart_list li');
        if (Nlis.length == 0) {
            mui.toast("你的购物车空空如也，一点都不像你！");
            return;
        }
        // 同步购物车的目的是为了让数据的数据的时间 参数保持一致 方便生成订单 以及后续的操作
        synchroData(Nlis);
    }
    //同步购物车
    function synchroData(lis) {
        var infos = {};
        for (var i = 0; i < lis.length; i++) {
            var li = lis[i];
            var goods_obj = $(li).data('obj');
            goods_obj.amount = $(li).find('.mui-numbox-input').val();
            // 创建参数
            infos[goods_obj.goods_id] = goods_obj;
        }
        $.post("my/cart/sync", {
            infos:JSON.stringify(infos)
        },
            function (result) {
                console.log(result);
                if(result.meta.status==200){
                    mui.toast(result.meta.msg);
                    CarDate();
                }
            }
        );

    }
    
    // 生成订单
    $('.cp_order_btn').on('tap',function(){
        var Nlis=$('.cart_list li');
        if(Nlis.length==0){
            mui.toast('你没选购任何商品，提交什么订单！！');
            return;
        }
        // 构建请求参数
        var order_obj={
             'order_price':$('.totol_price').text(),
             'consignee_addr':'吉山村小巷子',
             'goods':[]
        };
        
        for (var i = 0; i < Nlis.length; i++){
            var li=Nlis[i];
            var goods_obj=$(li).data('obj');
            var tmp_obj={
                goods_id:goods_obj.goods_id,
                goods_number:$(li).find('.mui-numbox-input').val(),
                goods_price:goods_obj.goods_price
            }
            order_obj.goods.push(tmp_obj);
        };
        console.log(order_obj);

        $.post("my/orders/create", order_obj,
            function (result) {
                console.log(result);
                if(result.meta.status==200){
                    mui.toast(result.meta.msg);
                    setTimeout(function(){
                        location.href='order.html';
                    },1000);
                }else{
                    mui.toast(result.meta.msg);
                }
            }
        );

    })
})
