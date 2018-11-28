"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

$(function () {

  var QueryObj = {
    query: $.getUrlValue("query") || "",
    // cid= url上的key “cid” 的值  ？？？
    cid: $.getUrlValue("cid") || "",
    pagenum: 1,
    pagesize: 10
    // 总的页数
  };var TotalPages = 1;

  init();

  function init() {

    mui.init({
      pullRefresh: {
        container: ".pyg_view", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        down: {
          auto: true, //可选,默认false.首次加载自动上拉刷新一次
          //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          callback: function callback() {
            // console.log("组件显示");
            // setTimeout(function () {

            //   // 直接从官网去拷贝的  代码是错的！！
            //   mui('.pyg_view').pullRefresh().endPulldown();

            // }, 3000);

            // 重置索引 
            QueryObj = {
              query: $.getUrlValue("query") || "",
              // cid= url上的key “cid” 的值  ？？？
              cid: $.getUrlValue("cid") || "",
              pagenum: 1,
              pagesize: 10
              // 重置 组件 为了可以重新触发上拉加载下一页的功能 代码放这里没有效果因为人家mui内部的事情 处理好 
              // mui('.pyg_view').pullRefresh().refresh(true);


            };getGoods(function (html) {
              $(".goods_wrap").html(html);
              // 结束下拉刷新
              mui('.pyg_view').pullRefresh().endPulldownToRefresh();
              // 重置 组件 为了可以重新触发上拉加载下一页的功能  此时有效果 
              mui('.pyg_view').pullRefresh().refresh(true);
            });
          }
        },
        up: {
          callback: function callback() {
            // 判断是否还有下一页的数据
            if (QueryObj.pagenum >= TotalPages) {
              // 没有下一页
              console.log("没有下一页");
              // 优化的空间  我不再需要这个组件的功能了 再触发上拉加载 没有效果
              mui('.pyg_view').pullRefresh().endPullupToRefresh(true);
            } else {
              // 还有下一页的数据
              QueryObj.pagenum++;
              getGoods(function (html) {
                // append 结束上拉加载组件
                $(".goods_wrap").append(html);
                // 结束上拉刷新
                mui('.pyg_view').pullRefresh().endPullupToRefresh();
              });
            }
          }
        }
      }
    });

    eventList();
  }

  // 绑定一堆事件
  function eventList() {
    $(".goods_wrap,.search_list,.pyg_footer").on("tap", "a", function () {
      var href = this.href;
      location.href = href;
    });
    // 绑定点击搜索事件
    $(".query_btn").on("tap", function () {
      var query_txt = $(".query_txt").val().trim();
      if (!query_txt) {
        mui.toast("输入非法");
        return;
      }

      location.href = "goods_list.html?query=" + query_txt;
    });

    // 绑定输入事件
    var delay = -1;
    $(".query_txt").on("input", function () {
      var txt = $(this).val().trim();
      clearTimeout(delay);
      if (!txt) {
        return;
      }
      // 存入本地存储
      // 获取旧的
      delay = setTimeout(function () {
        var searchkeys = store.get("searchkey") || [];
        // searchkeys
        var searchSet = new Set([].concat(_toConsumableArray(searchkeys)));
        searchSet.add(txt);
        store.set("searchkey", [].concat(_toConsumableArray(searchSet)));
        $.get("goods/qsearch", {
          query: txt
        }, function (result) {
          // console.log(result);
          if (result.meta.status == 200) {}
          var data = result.data;
          var html = data.map(function (v, i) {
            return "<li ><a href=\"goods_detail.html?goods_id=" + v.goods_id + "\" >" + v.goods_name + "</a></li>";
          });

          $(".search_list").css("height", parseInt($("body").height()) - 45 - 45);
          $(".search_list ul").html(html);
          // 滚动
          new IScroll(".search_list");
        });
      }, 800);
    });

    $('.mui-off-canvas-wrap').on('shown', function (event) {
      console.log("显示");
      // 显示
      var searchkeys = store.get("searchkey") || [];
      if (searchkeys.length != 0) {
        var html = searchkeys.map(function (v, i) {
          return "<li class=\"local_word\"><a href=\"goods_list.html?query=" + v + "\" >" + v + "</a></li>";
        });
        $(".search_list ul").html(html);
      }
    });

    // 点击搜索图标
    $(".fa-search").on("tap", function () {
      mui('.mui-off-canvas-wrap').offCanvas('show');
    });

    // 清空
    $(".clear_key").on("tap", function () {
      store.remove("searchkey");
      $(".search_list ul").html('');
    });
  }

  function getGoods(cb) {
    $.get("goods/search", QueryObj, function (result) {
      // 计算总页数
      TotalPages = Math.ceil(result.data.total / QueryObj.pagesize);
      console.log(TotalPages);

      // console.log(result);
      if (result.meta.status == 200) {
        var html = template("mainTpl", {
          data: result.data.goods
        });

        // 数据渲染成功了 要做什么事
        cb(html);
      }
    });
  }
});