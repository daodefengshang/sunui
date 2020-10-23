(function (window, document) {
    sunui.confirm({
        title: '签退<span style="color: #0060D0">33</span>了',
        msg: '退下吧',
        handler: function (r) {

        },
        level: 'info',
        yes: '遵命！',
        no: '不&emsp;要'
    });
    sunui.alert({
        title: '再见',
        msg: '退下吧<span style="color: #F00000">退下吧</span>',
        handler: function (r) {

        },
        level: 'warn',
        yes: null
    });
    sunui.alert('提示','退下吧<span style="color: #F00000">退下吧</span>', 'error', function (r) {

    });
    sunui.confirm('提示','是不是该<span style="color: #F09000">退下</span>了？', function (r) {
        if (r) {
            sunui.confirm({
                title: '签<span style="color: #0060D0">33</span>退2',
                msg: '退下吧',
                handler: function (r) {

                },
                level: 'warning',
                yes: '遵命！',
                no: '不&emsp;要'
            });
        } else {
            sunui.alert({
                title: '再见4455',
                msg: '退下吧<span style="color: #F00000">退下吧</span>'
            });
        }
    });
    sunui.alert('提示11111','退下吧<span style="color: #F09000">退下吧</span>', function (r) {

    });
})(window, document);
