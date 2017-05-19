/**
 * 手动校验数据的方法集合
 * @author Zhao Liubin
 * @type {Object}
 * 用法简述：validatorManu.isMoney('moneymone'),
 * 有方法：isPhone,isEmail,isEmpty(空）,isInterger（整数）,isPercent(百分数)
 * HTML结构如下所例：
 */
let _regExp = require('./regExp.js');
module.exports = {
  _regExp,
  _check(pattern) {
    return function(arg) {
      return pattern.test(arg);
    };
  },
  isEmpty(el) {
    if (el == void 0) {
      console.warn('传参有误不能为undefined，请检查');
      return true;
    } else {
      return this._check(this._regExp.empty)(el);
    }
  },
  isPhone(arg) {
    return this._check(this._regExp.phone)(arg);
  },
  isEmail(arg) {
    return this._check(this._regExp.email)(arg);
  },
  isMoney(arg) { //正金币
    return this._check(this._regExp.money)(arg);
  },
  isMoney1(arg) { //正负
    return this._check(this._regExp.money1)(arg);
  },
  isUrl(arg) {
    return this._check(this._regExp.url)(arg);
  },
  isInteger(arg) {
    return this._check(this._regExp.integer)(arg);
  },
  isPosInteger(arg) { //正整数
    return this._check(this._regExp.integer)(arg) && arg > 0;
  },
  isNotPositive(arg) { //非负
    return !isNaN(arg) && arg >= 0;
  },
  isNotPositiveInteger(arg) { //非负整数
    return this._check(this._regExp.integer)(arg) && arg >= 0;
  },
  isInteger1(arg) { //是否带正负号整数
    return this._check(this._regExp.integer1)(arg);
  },
  isIllegal(arg) {
    return this._check(this._regExp.illegal)(arg);
  },
  isPercent(arg) {
    return this._check(this._regExp.percent)(arg);
  }
};
