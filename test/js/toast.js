(function (window, document) {
    var i = 1;
    // window.setInterval(function () {
    //     window.sunui.toast('这是一个Toast' + i++, '', ~~(Math.random() * 3000 + 1000));
    // }, 2000);
    // for(var i = 0; i < 10; i++) {
    //     window.sunui.toast('这是一个Toast' + i, '', ~~(Math.random() * 2000 * i + 2000));
    // }
    document.onclick = function () {
        window.sunui.toast('这是一个Toast' + i++);
    }
})(window, document);