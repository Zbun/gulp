/**
 * 简单钟表
 * zhao.liubin@zol.com
 * 2017.11.8
 */

module.exports = function(dom) {
  if (!dom) { //作用DOM节点
    console.warn('节点传入不正确，无法应用，请检查');
    return;
  }
  let fnFormatTime = function(dom) {
    var dt = new Date();
    var year = dt.getFullYear();
    var month = parseInt(dt.getMonth()) + 1;
    var day = parseInt(dt.getDate());
    var hours = parseInt(dt.getHours());
    var minutes = parseInt(dt.getMinutes());
    var seconds = parseInt(dt.getSeconds());

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var strTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    dom.innerText = strTime;
  };
  fnFormatTime(dom);
  setInterval(function() {
    fnFormatTime(dom);
  }, 1000);
}