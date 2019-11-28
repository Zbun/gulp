/**
 * 正则合集
 * @author  zhao.liubin@zol.com.cn
 * @type {Object}
 */
module.exports = {
  empty: /^\s*$/,
  phone: /^1\d{10}$/,
  telnum: /^1\d{10}$|^(\d{3,4}-?)?\d{7,8}$/,
  email: /^\w+[\w-+.]*@[\w-]+(\.[\w-]+)+$/,
  money1: /^(-?|\+?)\d+(\.\d{1,2})?$/,
  money: /^\d+(\.\d{1,2})?$/,
  integer: /^-?([1-9]\d*|0)$/,
  integer1: /^(-?|\+?)([1-9]\d*|0)$/,
  illegal: /[<>]/,
  percent: /^0$|^[1-9]\d?$|^100$/,
  url: /^((https?|ftp):\/\/)?[\w-]+\.[\w-]+(\.[\w-]+)*/
};
