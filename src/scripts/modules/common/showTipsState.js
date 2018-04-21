/**
 * 操作提示，需要进一步封装为成功或失败方法，模块化
 * 使用方法：require或Webpack，单独使用时：showTips('操作成功',function(){}),showTipsState('操作失败','error',function(){})
 * @author  Zhao Liubin
 * @type {[type]}
 */

var showTips = function(content, state, callback, time) {
  content = content || '操作成功';
  var realTime = parseInt(time) || 1000;
  var box = document.createElement('div');
  box.className = 'popup-tips';

  var htmlIcon = '<i class="icon  iconfont icon-tishichenggong1"></i>';
  if (/cancel|error/i.test(state)) { //错误提示参数:'error'||'cancel'
    htmlIcon = '<i class="icon p-error iconfont  icon-tishicuowu1"></i>';
    realTime = parseInt(time) || 2500;
  } else if (/warning/i.test(state)) {
    htmlIcon = '<i class="icon p-warning  iconfont icon-tishi"></i>';
    realTime = parseInt(time) || 2500;
  }
  box.innerHTML = htmlIcon + '<div class="content">' + content + '</div>';
  document.body.appendChild(box);

  // var opDef=0,deg=95;
  // var rotateShow=function(){
  //     opDef+=0.05,deg-=5;
  //     box.style.transform='translate(-50%,-50%) rotateX('+deg+'deg)';
  //     box.style.opacity=opDef;
  //     if(opDef<0.95){
  //         requestAnimationFrame(rotateShow);
  //     }
  // }
  // requestAnimationFrame(rotateShow);

  var _close = function() {
    document.body.removeChild(box);
  };

  setTimeout(function() {
    _close();
    typeof state === 'function' ? state() : typeof callback === 'function' && callback();
  }, parseInt(realTime));
};

// var exportObj = showTips;
// typeof module === 'object' && module.exports ? module.exports = exportObj : typeof define === 'function' && define.amd ? define(function() {
//   return exportObj;
// }) : window.showTipsState = exportObj;
module.exports = showTips;