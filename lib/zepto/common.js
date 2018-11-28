var heima = {
    tap:function(dom,callback){
        var startX,startY
        // 手指开始触摸的时间--ms
        var st
        dom.addEventListener('touchstart',function(event){
            if(event.targetTouches.length > 1){
                return
            }
            st = Date.now()
            startX = event.targetTouches[0].clientX
            startY = event.targetTouches[0].clientY
        })
        dom.addEventListener('touchend',function(event){
            // console.log(Date.now() - st)
            if(Date.now() - st > 200){
                return
            }
            var endX = event.changedTouches[0].clientX
            var endY = event.changedTouches[0].clientY
            if(Math.abs(endX - startX) > 6 || Math.abs(endY - startY) > 6){
                return
            }
            callback && callback(event)
        })
    }
}