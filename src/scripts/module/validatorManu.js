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
  isMoney(arg) {
    return this._check(this._regExp.money)(arg);
  },
  isMoney1(arg) {
    return this._check(this._regExp.money1)(arg);
  },
  isUrl(arg) {
    return this._check(this._regExp.url)(arg);
  },
  isInteger(arg) {
    return this._check(this._regExp.integer)(arg);
  },
  isInteger1(arg) {
    return this._check(this._regExp.integer1)(arg);
  },
  isIllegal(arg) {
    return this._check(this._regExp.illegal)(arg);
  },
  isPercent(el) {
    return this._check(this._regExp.percent)(el);
  }
};
