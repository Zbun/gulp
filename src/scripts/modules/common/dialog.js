/** 
 * javascript comment 
 * @Author: zhao.liubin@zol.com.cn 
 * @Date: 2019-11-23 09:23:51 
 * @Desc: 再造弹出确认框，与Vue pop 保持样式一致 
 */
var dialog = function (opts) {
  var opt = {
    width: '300px',
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
    closeCallback: opts.closeCallback || '' //关闭后执行
  };

  var _isFunction = (obj) => typeof obj == 'function' ? true : false;
  var title = opt.title,
    width = opt.width,
    content = opt.content,
    ok = opt.ok,
    okVal = opt.okVal || (_isFunction(opt.ok) ? opt.okVal ? opt.okVal : '确定' : ''),
    mask = opt.mask;
  var time = parseInt(opt.time),
    cancelVal = opt.cancelVal || (_isFunction(opt.cancel) ? opt.cancelVal ? opt.cancelVal : '取消' : ''),
    cancel = opt.cancel,
    beforeShow = opt.beforeShow,
    closeCallback = opt.closeCallback;

  var div = document.createElement('div'),
    className = 'popup ' + opt.theme;

  if (!mask) {
    className += ' nomask';
  }

  div.className = className;
  var html = `    <div class="content">
    <h2 class="title">
      <a href="javascript:;" class="close" title="关闭">&times;</a>${title}</h2>
    <div class="body">
      <div class="content" style="width:${width};min-width:350px;min-height:80px;">
        ${content}
      </div>
    </div>
    <div class="footer text-center" style="display:${okVal.length || cancelVal.length ? 'hah' : 'none'}">
    <div></div>
    <div class="btns">
    <button class="btn btn-default cancel" style="display:${cancelVal.length ? 'hahaha' : 'none'}"
        >${cancelVal}</button>
      <button class="btn btn-primary ok" style="display:${okVal.length ? 'hahaha' : 'none'}">${okVal}</button>
    </div>
    </div></div>`;
  div.innerHTML += html;

  var _remove = () => {
    div.parentNode.removeChild(div);
  };

  document.body.appendChild(div);
  div.addEventListener('click', function (e) {
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

typeof module == 'object' && module.exports ? module.exports = dialog : window.dialog = dialog;