$(function () {

    var Global_variable = {
        query: "",
        cid: $.getUrl('cid'),
        pagenum: 1,
        pagesize: 10
    }
    console.log(Global_variable);

    var CountPages = 1;

    function init() {
        TapDetail();
        mui.init({
            pullRefresh: {
                container: ".pyg_view",
                down: {
                    auto: true,
                    //  触发下拉刷新时自动触发
                    callback: function () {
                        console.log(1);


                        // 重置页面 
                        Global_variable.pagenum = 1;
                        getGoodsData(function (goods) {
                            var html = template('goodsTemp', {
                                data: goods
                            })
                            $('.goods_list').html(html);

                            mui('.pyg_view').pullRefresh().endPulldownToRefresh();
                            // 大前提在下拉之后 告诉组件还有数据要加载  这里的重置要放在最后 防止他无法重置!!!!!
                            mui('.pyg_view').pullRefresh().refresh(true);
                        });
                    }

                },
                up: {
                    //  触发上拉刷新时自动触发
                    callback: function () {
                        // console.log('上拉'); 
                        if (Global_variable.pagenum >= CountPages) {
                            console.log('没有数据了');
                            mui('.pyg_view').pullRefresh().endPullupToRefresh(true);
                        } else {
                            Global_variable.pagenum++;
                            getGoodsData(function (goods) {
                                var html = template('goodsTemp', {
                                    data: goods
                                })
                                $('.goods_list').append(html);
                                mui('.pyg_view').pullRefresh().endPullupToRefresh(false);
                            })
                        }

                    }
                }
            }
        });

    }
    init();

    function getGoodsData(callback) {
        // console.log(1);
        $.ajax({
            type: "get",
            url: "goods/search",
            data: Global_variable,
            dataType: "json",
            success: function (result) {
                if (result.meta.status == 200) {
                    console.log(result);
                    CountPages = Math.ceil(result.data.total / Global_variable.pagesize);
                    // console.log(result.data.goods);
                    callback(result.data.goods);
                }
            }
        });
    }

    // 绑定跳转
    
    function TapDetail() {

        $(".goods_list").on("tap","a",function () {
          
          var href=this.href;
          console.log(href);
          location.href=href;
        })
      }

})
