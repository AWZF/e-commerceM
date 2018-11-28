$(function () {
    init();

    function init() {
        getSwiperdata();
        getCatitems();
        getGoodslist();
    }

    function getSwiperdata() {
        $.get("home/swiperdata",
            function (result) {
                console.log(result);
                if (result.meta.status == 200) {
                    var html = template('lbtTemp', {
                        data: result.data
                    });
                    $('.pyg_slides').html(html);
                    var gallery = mui('.mui-slider');
                    gallery.slider({
                        interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
                    });
                } else {
                    console.log('失败');
                }
            },
        );
    }

    function getCatitems() {
        $.get("home/catitems",
            function (result) {
                if (result.meta.status == 200) {
                    console.log(result);
                    var html = template('catesTemp', {
                        data: result.data
                    });
                    $('.pyg_cates').html(html);
                }
            }
        );
    }

    function getGoodslist() {
        $.get("home/goodslist",
            function (result) {
                if (result.meta.status == 200) {
                    console.log(result);
                    var html = template('listTemp', {
                        data: result.data
                    })
                    console.log(html);
                    $('.pyg_list').html(html);
                } else {

                }
            }
        );
    }
})