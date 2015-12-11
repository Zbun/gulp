(function(){
	$=function(ele,context){

		var curNode=context||window.document,eleList=[];
		var sPrivate='zlb HELLO';
		eleList.push(curNode.querySelector(ele));
		return eleList

	}
	$.fn=$.prototype={
	addClass:function(cn){alert(this);
		eL=this[0];
		alert(el);
		
		this.classList.add(cn);
		return this.extend;
	}

}
})()


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
        content: '',
        cancelVal: '',
        okVal: '',
        callback: '',
        mask: true,
        theme: '',
        time: 0,
        cancelCallback: ''
    }
    $.extend(opt, opts);

    var title = opt.title,
        content = opt.content,
        okVal = opt.okVal,
        callback = opt.callback,
        mask = opt.mask;
    var time = opt.time,
        cancelVal = opt.cancelVal,
        cancelCallback = opt.cancelCallback;

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
    div.innerHTML=html;

    function _remove(){
        div.parentNode.removeChild(div);
    }

    // $div.html(html).on('click', '.close,.cancel', function() {
    //     typeof cancelCallback == 'function' && cancelCallback();
    //     $div.remove();
    // }).on('click', '.ok', function() {
    //     typeof callback == 'function' && callback();
    //     $div.remove();
    // })

    div.addEventListener('click', function(e){
        var e=e||window.event,cl=e.target.classList;
        if(cl.contains('close')||cl.contains('cancel')){
            typeof cancelCallback == 'function' && cancelCallback();
            _remove();
        }
        else if(cl.contains('ok')){
            typeof callback == 'function' && callback();
            _remove();
        }
    })

   // $div.appendTo('body');
    document.body.appendChild(div);

    if (time > 0) {
        setTimeout(_remove, time);
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
        var w = document.querySelector('.waiting'),content=arg||'';
        if (!w) {
            var div = document.createElement('div');
            div.innerHTML='<span class=content>'+content+'</span>'
            div.className = 'waiting';
            w = div;
            //$div.appendTo('body');
            document.body.appendChild(w);
        }
        return w;
    },
    show: function(arg) {
        this._getDiv(arg).style.display='block';
    },
    hide: function() {
        this._getDiv().style.display='none';
    },
    remove: function() {
        document.body.removeChild(this._getDiv());
    }
};



