/**
 * 一些校验数据的方法集合
 * @author Zhao Liubin
 * @type {Object}
 */
module.exports = (function() {
  var regExp = {
    empty: /^\s*$/,
    phone: /^1\d{10}$/,
    email: /^\w+[\w-+.]*@[\w-]+(\.[\w-])+$/,
    moneyFormat: /^\d+(\.\d{1,2})?$/,
    integer: /^\d+$/,
    illegal: /[<>]/,
    percent: /^0$|^[1-9]\d?$|^100$/
  };

  function _check(pattern) {
    return function(arg) {
      return pattern.test(arg);
    }
  };
  return {
    isEmpty(...arg) {
      return arg.some(function(el) {
        return _check(regExp.empty)(el);
      })
    },
    isNotPhone(arg) {
      return !_check(regExp.phone)(arg);
    },
    isNotEmail(arg) {
      return !_check(regExp.email)(arg);
    },
    isNotMoneyFormat(arg) {
      return !_check(regExp.moneyFormat)(arg);
    },
    isNotInteger(arg) {
      return !_check(regExp.integer)(arg);
    },
    isIllegal(arg) {
      return _check(regExp.illegal)(arg);
    },
    isNotPercent(...arg) {
      return !arg.every(function(el) {
        return _check(regExp.percent)(el);
      })
    }
  }
})();
