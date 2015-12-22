
//一些验证方法
;var validator = {
    _reg: {
        empty: /^\s*$/,
        phone: /^1\d{10}$/,
        email: /^[\w.]+@\w+(\.\w+)+$/,
        moneyFormat: /^\d+(\.\d{1,2})?$/,
        integer: /^\d+$/,
        illegal: /[<>]/,
        percent: /^0$|^[1-9]\d?$|^100$/
    },
    _check: function(pattern) {
        return function(arg){
           return pattern.test(arg);
        }
    },
    isEmpty: function(arg) {
        var l=arguments.length;
        for(i=0;i<l;i++){
            if(this._check(this._reg.empty)(arguments[i]))
                return true;
        }
        return false;
    },
    isNotPhone: function(arg) {
        return !this._check(this._reg.phone)(arg);
    },
    isNotEmail: function(arg) {
        return !this._check(this._reg.email)(arg);
    },
    isNotMoneyFormat: function(arg) {
        return !this._check(this._reg.moneyFormat)(arg);
    },
    isNotInteger: function(arg) {
        return !this._check(this._reg.integer)(arg);
    },
    isIllegal: function(arg) {
        return this._check(this._reg.illegal)(arg);
    },
    isNotPercent:function(arg){
        var l=arguments.length;
        for(i=0;i<l;i++){
            if(!this._check(this._reg.percent)(arguments[i]))
                return true;
        }
        return false;
    }
};


//简单弹窗，可改主题有：{theme:'dark'},{thmes:'iOS'}
function popup(opts) {
    var opt = {
        title: '',
        content: '',                //内容
        cancelVal: '',              //取消文本
        okVal: '',                  //确认文本
        callback: '',               //确认回调
        cancelCallback: '',         //取消回调
        mask: true,                 //是否遮罩
        theme: '',                  //主题：dark、iOS
        time: 0,                    //自动关闭倒计时
        beforeShow:'',              //弹窗前执行事件
        afterShow:'',
        closeCallback:''            //关闭后执行
    }
    $.extend(opt, opts);

    var title = opt.title,
        content = opt.content,
        okVal = opt.okVal,
        callback = opt.callback,
        mask = opt.mask;
    var time = parseInt(opt.time),
        cancelVal = opt.cancelVal,
        cancelCallback = opt.cancelCallback,
        beforeShow=opt.beforeShow,
        afterShow=opt.afterShow,
        closeCallback=opt.closeCallback;

    if (opt.theme == 'dark') {
        mask = false;
    } else if (/iOS|iPhone|Apple/i.test(opt.theme)) {
        mask = false;
        opt.theme = 'iOS';
    }

    var div = document.createElement('div'),
        className = 'popup ' + opt.theme.toLowerCase();

    if (!mask) {
        className += ' nomask';
    }

    div.className = className;
    //var $div = $(div);
    var html = '<div class="wrapper">' + (title ? ('<h3 class="title">' + title + '</h3>') : '') + '<a href="javascript:;" class="close"></a>' + (content ? ('<div class="content">' + content + '</div>') : '') + ((okVal || cancelVal) ? ('<div class="btns">' + (cancelVal ? ('<span class="btn-wrapper"><a href="javascript:;" class="cancel btn btn-danger">' + cancelVal + '</a></span>') : '') + (okVal ? ('<span class="btn-wrapper"><a href="javascript:;" class="btn btn-warning ok">' + okVal + '</a></span>') : '')) : '') + '</div></div>';
    div.innerHTML = html;

    function _remove() {
        div.parentNode.removeChild(div);
    }

    // $div.html(html).on('click', '.close,.cancel', function() {
    //     typeof cancelCallback == 'function' && cancelCallback();
    //     $div.remove();
    // }).on('click', '.ok', function() {
    //     typeof callback == 'function' && callback();
    //     $div.remove();
    // })

    function _isFunction(obj){
        return typeof obj=='function'?true:false;
    }

    div.addEventListener('click', function(e) {
        var e = e || window.event,
            cl = e.target.classList;
        if (cl.contains('close') || cl.contains('cancel')) {
            _isFunction(cancelCallback) && cancelCallback();
            _remove();
        } else if (cl.contains('ok')) {
            isFcuntion(callback) && callback();
            _remove();
        }
    })
    document.body.appendChild(div);
    _isFunction(beforeShow) && beforeShow();

    //自动关闭执行事件
    function _autoClose(){
        _remove();
        _isFunction(closeCallback) && closeCallback();
    }

    if (time > 0) {
        setTimeout(_autoClose, time);
    }
}
// popup({
//     content: '呵呵呵 ',
//     okVal: '我是确定',
//     theme: 'ios',
//     cancelVal: '我是取消',
//     callback: function() {
//         popup({
//             content: '很黑',
//             theme: 'dark',
//             okVal: '我弹',
//             callback: function() {
//                 popup({
//                     content: '我是后一次弹了',
//                 })
//             }
//         })
//     }
// })


// popup({
//     okVal: '确定',
//     cancelVal: '取消',
//     callback: function() {
//         alert('haha')
//     },
//     content: '您帮TA用力砍了一刀，砍掉了<span class="text-danger">19.96</span>元，当前价格为<span class="text-danger">1933.44</span>元'
// })

//加载动画
var waiting = {
    _getDiv: function(arg) {
        var w = document.querySelector('.waiting'),
            content = arg || '数据加载中，请稍等';
        if (!w) {
            var div = document.createElement('div');
            div.className = 'waiting';
            w = div;
            document.body.appendChild(w);
        }
        w.innerHTML='<span class=content>' + content + '<span class="elipsis">...</span></span>';
        return w;
    },
    show: function(arg) {
        this._getDiv(arg).style.display = 'block';
    },
    hide: function() {
        this._getDiv().style.display = 'none';
    },
    remove: function() {
        document.body.removeChild(this._getDiv());
    }
};
//HTML5 上传简单实现
;(function($) {
    $.fn.upload = function(opts) {
        var def = {
            url: '',
            type: 'POST',
            dataType: 'JSON',
            callback: function() {}
        };

        var opt = $.extend(true, def, opts);

        this.on('change', function() {
            var file = this.files[0];
            var formData = new FormData();
            formData.append('filename', file);
            $.ajax({
                url: opt.url,
                type: opt.type,
                dataType: opt.dataType,
                data: formData,
                processData: false, //告诉jQuery不要去处理发送的数据
                contentType: false, //告诉jQuery不要支设置Content-Type请求头
                success: opt.callback
            })
            $(this).replaceWith($(this).clone(true));
        })
        return this;
    }
})($);



