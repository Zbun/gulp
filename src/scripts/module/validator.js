/**
 * 一些校验数据的方法集合
 * @author Zhao Liubin
 * @type {Object}
 */
module.exports={
    _reg: {
        empty: /^\s*$/,
        phone: /^1\d{10}$/,
        email: /^\w+[\w-+.]*@[\w-]+(\.[\w-])+$/,
        moneyFormat: /^\d+(\.\d{1,2})?$/,
        integer: /^\d+$/,
        illegal: /[<>]/,
        percent: /^0$|^[1-9]\d?$|^100$/
    },
    _check(pattern) {
        return function(arg) {
            return pattern.test(arg);
        }
    },
    isEmpty(...arg) {
        var _t=this;
        return arg.some(function(el){
           return _t._check(_t._reg.empty)(el);
        })
    },
    isNotPhone(arg) {
        return !this._check(this._reg.phone)(arg);
    },
    isNotEmail(arg) {
        return !this._check(this._reg.email)(arg);
    },
    isNotMoneyFormat(arg) {
        return !this._check(this._reg.moneyFormat)(arg);
    },
    isNotInteger(arg) {
        return !this._check(this._reg.integer)(arg);
    },
    isIllegal(arg) {
        return this._check(this._reg.illegal)(arg);
    },
    isNotPercent(...arg) {
        var _t=this;
        return !arg.every(function(el){
            return _t._check(_t._reg.percent)(el);
        })
    }
};