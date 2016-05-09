//一些验证方法
;
var validator = {
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
    isEmpty(arg) {
        var l = arguments.length;
        for (i = 0; i < l; i++) {
            if (this._check(this._reg.empty)(arguments[i]))
                return true;
        }
        return false;
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
    isNotPercent(arg) {
        var l = arguments.length;
        for (i = 0; i < l; i++) {
            if (!this._check(this._reg.percent)(arguments[i]))
                return true;
        }
        return false;
    }
};
module.exports=validator;