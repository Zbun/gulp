/**
 * 简单倒计时
 * @date   2018-06-26
 * @author zhao.liubin@zol.com.cn
 * @param  {[type]}
 * @param  {[type]}
 * @return {Function}
 */
var fn = function(d, o) {
  var f = {
    box: function() {
      return document.querySelector(o);
    },
    zero: function(n) {
      var n = parseInt(n, 10);
      if (n > 0) {
        if (n <= 9) {
          n = "0" + n;
        }
        return String(n);
      } else {
        return "0";
      }
    },
    dv: function() {
      d = d || Date.UTC(2020, 0, 1); //如果未定义时间，则我们设定倒计时日期是2050年1月1日
      var future = new Date(d) - 0,
        now = new Date() - 0;
      //现在将来秒差值
      var dur = Math.floor((future - now) / 1000),
        pms = {
          sec: "00",
          mini: "00",
          hour: "00",
          day: "0",
          month: "0",
          year: "0"
        };
      if (dur > 0) {
        pms.sec = f.zero(dur % 60);
        pms.mini = Math.floor((dur / 60)) > 0 ? f.zero(Math.floor((dur / 60)) % 60) : "0";
        pms.hour = Math.floor((dur / 3600)) > 0 ? f.zero(Math.floor((dur / 3600)) % 24) : "0";
        pms.day = Math.floor((dur / (3600 * 24))) > 0 ? Math.floor((dur / (3600 * 24))) : "0";
      }
      return pms;
    },
    ui: function() {
      var str = '';
      var strSplit = ': ';
      str += '<span class="item">' + f.dv().day + '</span>' + '天';
      str += '<span class="item">' + f.dv().hour + '</span>' + '小时';
      str += '<span class="item">' + f.dv().mini + '</span>' + '分';
      str += '<span class="item">' + f.dv().sec + '</span>' + '秒';
      return str;
    }
  };
  return f.ui();
};

module.exports = fn;