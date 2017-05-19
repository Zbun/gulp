/**
 * 与日期有关的一些方法
 * @author wenston
 * @date   2016-09-14
 * @param  {[type]}
 * @return {[type]}
 */


let months = [-1, 31, isLeapYear(nowDate().y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYear(y) {
  if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
    return true
  }
  return false
}

function normalizeNumber(n) {
  return Number(n) < 10 ? ('0' + n) : n
}

function nowDate() {
  var time = new Date();
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  return {
    fullTime: y + '-' + normalizeNumber(m) + '-' + normalizeNumber(d),
    ymd: y + '-' + normalizeNumber(m) + '-' + normalizeNumber(d),
    y: y,
    m: m,
    d: d
  }

}

function lastX({ x = 7, splitSign = '-' }) { //获取过去x天的日期----年月日 如2016-09-14。默认7天，分隔符是-
  console.warn('不建议使用lastX方法了，请使用getTheDay(x,分隔符):', getTheDay);
  let y = -1 * x;
  return getTheDay({ x: y });
}

function getTheDay({ x = -7, splitSign = '-' }) { //获取过去x天，或者未来x天的年月日，默认获取过去第7天。默认分隔符是-
  let now = new Date();
  let theDay = now.getTime() + x * 24 * 60 * 60 * 1000;
  theDay = new Date(now.setTime(theDay));
  let y = theDay.getFullYear();
  let m = theDay.getMonth() + 1;
  let d = theDay.getDate();
  return y + splitSign + normalizeNumber(m) + splitSign + normalizeNumber(d);
}

//获取本周第一天、最后一天日期。星期一是第一天
function week() {
  let day = new Date().getDay();
  return {
    MonDate: getTheDay({ x: -(day - 1) }),
    SunDate: getTheDay({ x: 7 - day })
  }
}
//获取本月第一天，最后一天的日期
function month() {
  let dat = nowDate();
  return {
    firstDate: dat.y + '-' + normalizeNumber(dat.m) + '-' + '01',
    lastDate: dat.y + '-' + normalizeNumber(dat.m) + '-' + months[dat.m]
  }
}
export {
  isLeapYear,
  nowDate,
  lastX, //废弃
  getTheDay,
  month,
  week
}
