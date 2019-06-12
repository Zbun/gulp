/**
 * 半成品处理拆分时间戳年月日时分秒
 */

function resetTimeStamp(value) {
  value = value.split('.')[0];
  value = (value + 'Z').replace(/\//g, '-').replace(/[\u4E00-\u9FA5]/g, '').replace(/-(\d+)-(\d+)/, function(all, a, b) {
    /^\d$/.test(a) && (a = '0' + a);
    /^\d$/.test(b) && (b = '0' + b);
    return '-' + a + '-' + b;
  }).replace(/(\d+):(\d+):(\d+)/, function(all, a, b, c) {
    let arrTemp = [];
    /^\d$/.test(a) && (a = '0' + a);
    /^\d$/.test(b) && (b = '0' + b);
    /^\d$/.test(c) && (c = '0' + c);
    arrTemp.push(a, b, c);
    return arrTemp.join(':');
  }).replace(/\d(\s+)\d/, function(all, a) {
    if (/^\s+$/.test(a)) {
      return all.replace(a, 'T');
    }
  }); //强制把时间格式加T
  var dt = new Date(new Date(value).toUTCString().replace('GMT', ''));
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
  return {
    year: year,
    month: month,
    day: day,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}
module.exports = resetTimeStamp;