//一些验证方法
;
var validator = {
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
        return function(arg) {
            return pattern.test(arg);
        }
    },
    isEmpty: function(arg) {
        var l = arguments.length;
        for (i = 0; i < l; i++) {
            if (this._check(this._reg.empty)(arguments[i]))
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
    isNotPercent: function(arg) {
        var l = arguments.length;
        for (i = 0; i < l; i++) {
            if (!this._check(this._reg.percent)(arguments[i]))
                return true;
        }
        return false;
    }
};


//简单弹窗，可改主题有：{theme:'dark'},{thmes:'iOS'}
function popup(opts) {
    var opt = {
        title: '',
        content: '', //内容
        cancelVal: '', //取消文本
        okVal: '', //确认文本
        callback: '', //确认回调
        cancelCallback: '', //取消回调
        mask: true, //是否遮罩
        theme: '', //主题：dark、iOS
        time: 0, //自动关闭倒计时
        beforeShow: '', //弹窗前执行事件
        afterShow: '',
        closeCallback: '' //关闭后执行
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
        beforeShow = opt.beforeShow,
        afterShow = opt.afterShow,
        closeCallback = opt.closeCallback;

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

    function _isFunction(obj) {
        return typeof obj == 'function' ? true : false;
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
    function _autoClose() {
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
        w.innerHTML = '<span class=content>' + content + '<span class="elipsis">...</span></span>';
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
;
(function($) {
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

//HTML5 FormData 上传实现
function html5Upload() {
    var arg = arguments[0];
    var obj = arg.obj;
    var url = arg.url || '';
    var callback = arg.callback || '';
    if (obj) {
        obj.addEventListener('change', function() {
            //构造加载进度HTML
            var progressBg = document.createElement('div');
            progressBg.style.cssText = 'position:fixed;left:50%;top:50%;padding:10px 40px 0;border:1px solid #666;box-shadow:inset 0 0 1px #fff;border-radius:4px;text-align:center;color:#fff;background:rgba(0,0,0,.5);z-index;123;transform:translate(-50%,-50%);'
            var progressBarOuter = document.createElement('div');
            progressBarOuter.style.cssText = 'position:relative;height:6px;width:100px;border-radius:6px;border:1px solid #ddd;';
            var progressBarInner = document.createElement('span');
            progressBarInner.style.cssText = 'position:absolute;left:0;top:0;bottom:0;background:#56C7A8;transition:.3s;';
            var progressNum = document.createElement('p');

            //FormData上传
            if (window.FormData) {
                var formData = new FormData();
                formData.append('upload', document.getElementById('upload').files[0]);
                var xhr = new XMLHttpRequest();
                xhr.open('POST', url);
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        progressBg.parentNode.removeChild(progressBg);
                        var data = JSON.parse(xhr.response);
                        callback(data);
                        obj.removeEventListener('change');
                        var newNode = obj.cloneNode(true);
                        newNode.addEventListener('change', html5Upload({
                            obj: newNode,
                            url: url,
                            callback: callback
                        }));
                        obj.parentNode.replaceChild(newNode, obj);
                    } else {
                        console.log('上传失败');
                    }
                };

                //加载进度事件
                xhr.upload.onprogress = function(event) {
                    if (event.lengthComputable) {
                        document.body.appendChild(progressBg);
                        var complete = (event.loaded / event.total * 100 | 0) + '%';
                        progressBarInner.style.width = complete;
                        progressNum.innerHTML = '已完成：' + complete;
                        progressBarOuter.innerHTML = progressBarInner.outerHTML;
                        progressBg.innerHTML = progressBarOuter.outerHTML + progressNum.outerHTML;
                    }
                }
                xhr.send(formData);
            }
        })
    }
}
