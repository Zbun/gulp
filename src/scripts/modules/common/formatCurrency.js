/**
 * 千位分隔金币格式
 */

module.exports = function(value) {
  //千位分隔小方法 zhao.liubin@zol.com.cn
  if (!value) {
    if (value == undefined) {
      return '';
    }
    value = 0;
  }
  if (!parseFloat(value)) {
    return value;
  }
  var splitThousand = function(value) {
    if (!value) {
      return 0;
    } else {
      value = (value - 0).toFixed(2);
      let pre = '';
      if (Math.abs(value) < 1000) {
        return value;
      } else if (value < -1000) {
        value = Math.abs(value).toFixed(2);
        pre = '-';
      }
      var n0 = parseInt(value / 1000);
      var n1 = /\d{3}\.\d{2}/.exec(value)[0];
      return pre + (n0 + '').split('').reverse().join('').replace(/(\d{3})(?=\d)/g, '$1,').split('').reverse().join('') + ',' + n1;
    }
  };
  return splitThousand(parseFloat(value).toFixed(2));
};