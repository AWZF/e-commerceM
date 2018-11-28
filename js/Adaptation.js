(function (doc, win) {
    // html
    var html = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = html.clientWidth;
            if (!clientWidth) return;
            html.style.fontSize = 100 * (clientWidth / 320) + 'px';
            //分辨率以320px为基础的情况下
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
