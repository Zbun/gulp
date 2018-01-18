/**
 * 手机端弹窗，只给智选云商用，不通用
 * @author Zhao Liubin
 * @date   2017/12/14
 * @param  {opts}
 * @return {[type]}
 */
var popupMobile = function(opts) {
  var opt = {
    title: opts.title || '',
    content: opts.content || '', //内容
    cancelVal: opts.cancelVal || '', //取消文本
    okVal: opts.okVal || '', //确认文本
    ok: opts.ok || '', //确认回调
    cancel: opts.cancel || '', //取消回调
    mask: !!opts.mask || true, //是否遮罩
    theme: opts.theme || '', //主题：dark、iOS、weixin
    time: opts.time || 0, //自动关闭倒计时
    beforeShow: opts.beforeShow || '', //弹窗前执行事件
    afterShow: opts.afterShow || '',
    closeCallback: opts.closeCallback || '' //关闭后执行
  };

  var _isFunction = (obj) => typeof obj == 'function' ? true : false;
  var title = opt.title,
    content = opt.content,
    ok = opt.ok,
    okVal = opt.okVal || _isFunction(opt.ok) ? opt.okVal ? opt.okVal : '确定' : '',
    mask = opt.mask;
  var time = parseInt(opt.time),
    cancelVal = opt.cancelVal || _isFunction(opt.cancel) ? opt.cancelVal ? opt.cancelVal : '取消' : '',
    cancel = opt.cancel,
    beforeShow = opt.beforeShow,
    afterShow = opt.afterShow,
    closeCallback = opt.closeCallback;

  // if (opt.theme == 'dark') {
  //   mask = false;
  // } else if (/iOS|iPhone|Apple/i.test(opt.theme)) {
  //   //mask = false;
  //   opt.theme = 'iOS';
  // } else {
  //   opt.theme = 'weixin';
  // }

  var div = document.createElement('div'),
    className = 'popup ' + opt.theme;

  if (!mask) {
    className += ' nomask';
  }

  div.className = className;
  var html = '<div class="wrapper">' + (title ? ('<h3 class="title">' + title + '</h3>') : '') + '<a href="javascript:;" class="close">&times;</a>' + (content ? ('<div class="content">' + content + '</div>') : '') + ((okVal || cancelVal) ? ('<div class="btns">' + (cancelVal ? ('<span class="btn-wrapper"><a href="javascript:;" class="cancel btn">' + cancelVal + '</a></span>') : '') + (okVal ? ('<span class="btn-wrapper"><a href="javascript:;" class="btn ok">' + okVal + '</a></span>') : '')) : '') + '</div></div>';
  div.innerHTML += html;

  var _remove = () => {
    div.parentNode.removeChild(div);
  };

  document.body.appendChild(div);
  div.addEventListener('click', function(e) {
    e = e || window.event;
    var cl = e.target.classList;
    if (cl.contains('close') || cl.contains('cancel')) {
      _isFunction(cancel) && cancel();
      _remove();
    } else if (cl.contains('ok')) {
      _isFunction(ok) && ok();
      _remove();
    }
  });

  _isFunction(beforeShow) && beforeShow();
  var _autoClose = () => {
    _remove();
    _isFunction(closeCallback) && closeCallback();
  };

  if (time > 0) {
    setTimeout(_autoClose, time);
  }
  return div;
};

typeof module == 'object' && module.exports ? module.exports = popupMobile : window.popupMobile = popupMobile;