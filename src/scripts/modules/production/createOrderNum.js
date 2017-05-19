/**
 * 生成单号通用方法
 * @date   2017-03-30
 * @author zhao.liubin@zol.com.cn
 * @return {[type]}
 */

let formatNum = function(n) {
  return n < 10 ? '0' + n : n + '';
};
let objPrefix = {
  unique() {
    let d = new Date();
    return d.getFullYear() + formatNum(d.getMonth() + 1) + formatNum(d.getDate()) + d.getTime();
  }, //带年月唯一编码
  purchase: 'PC', //采购单,
  storageIn: 'PR', //入库单
  purchaseReturn: 'CC', //采购退货单
  purchaseReturnStore: 'CR', //采购退货单
  sale: 'SC', //销售单
  storageOut: 'SI', //出库单
  dispatch: 'TC', //调拨单
  transfer: 'CT', //调剂单
  branchCode: 'org', //机构编码
};
let fnRuleSuffix = function() {
  return new Date().getTime();
};

let objReturn = {};
for (let key in objPrefix) {
  if (typeof objPrefix[key] == 'function') {
    objReturn[key] = objPrefix[key];
  } else {
    objReturn[key] = function() {
      return objPrefix[key] + fnRuleSuffix();
    };
  }

}
module.exports = objReturn;
