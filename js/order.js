$(function(){
    
    init();
    function init(){
        if(!$.isLogin()){
            $.setPageUrl();
            location.href='login.html';

        }else{
            $('body').fadeIn();
            getOrders();
        }
    }
    function getOrders(){
        $.get("my/orders/all", {
          type:1  
        },
        function (result) {
          if(result.meta.status==200){
              if(result.data.length==0){

              }else{
                  var html=template('OrderTemp',{
                      data:result.data
                  });
                  $('.all_order_list').html(html);
              }
          }        
        
        }
        );
    }
    
})