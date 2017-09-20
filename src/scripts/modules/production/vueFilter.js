//---------------------------------------------------------------------------------
//字符串截取
Vue.filter('substr', (v, n = 20) => {
  if (v) {
    if (v.length <= n) {
      return v;
    }
    return v.substr(0, n) + '...';
  }

});
//常用过滤器
//千位分隔小方法 zhao.liubin@zol.com.cn
function splitThousand(num) {
  if (!num) {
    return 0;
  } else {
    num = (num - 0).toFixed(2);
    let pre = '';
    if (Math.abs(num) < 1000) {
      return num;
    } else if (num < -1000) {
      num = Math.abs(num).toFixed(2);
      pre = '-';
    }
    var n0 = parseInt(num / 1000);
    var n1 = /\d{3}\.\d{2}/.exec(num)[0];
    return pre + (n0 + '').split('').reverse().join('').replace(/(\d{3})(?=\d)/g, '$1,').split('').reverse().join('') + ',' + n1;
  }
}
//金额
Vue.filter('money', function(value) {
  if (!value) {
    value = 0;
  }
  return '￥' + parseFloat(value).toFixed(2);
});
//格式化钱不带‘￥’,千位分隔
Vue.filter('currency', function(value) {
  if (!value) {
    value = 0;
  }
  if (!parseFloat(value)) {
    return value;
  }
  return splitThousand(parseFloat(value).toFixed(2));
});
//货币双向过滤必填
Vue.filter('currencyIn', {
  read(value) {
    let number = parseFloat(value);
    return isNaN(number) ? '' : 0 == number ? 0 : number.toFixed(2);
  },
  write(value, oldVal) {
    let number = parseFloat(value);
    return isNaN(number) ? (oldVal || '') : (/\.\d{3,}$/.test(number) ? number.toFixed(2) : number);
  }
});
//非负货币双向过滤必填
Vue.filter('posCurrencyIn', {
  read(value) {
    let number = parseFloat(value);
    return isNaN(number) ? 0 : (/\.\d{3,}$/.test(number) ? number.toFixed(2) : (number <= 0 ? 0.01 : number));
  },
  write(value, oldVal) {
    let number = parseFloat(value);
    return isNaN(number) ? (oldVal || 0) : (/\.\d{3,}$/.test(number) ? number.toFixed(2) : (number <= 0 ? 0.01 : number));
  }
});
//非负货币双向过滤必填2，可以为零零零
Vue.filter('posCurrencyIn2', {
  read(value) {
    return value;
  },
  write(value, oldVal) {
    let number = parseFloat(value);
    return isNaN(number) ? oldVal : (/\.\d{3,}$/.test(number) ? number.toFixed(2) : (number <= 0 ? 0 : number));
  }
});
//货币双向过滤非必填
Vue.filter('currencyInNotRequired', {
  read(value) {
    return value;
  },
  write(value, oldVal) {
    if (/^\s*$/.test(value)) {
      return '';
    }
    let number = parseFloat(value);
    return isNaN(number) ? (oldVal || '') : (/\.\d{3,}$/.test(number) ? number.toFixed(2) : number);
  }
});
//正整数百分比双向过滤
Vue.filter('posPercentIntegerIn', {
  read(value) {
    return value;
  },
  write(value, oldVal) {
    if (/^\s*$/.test(value)) {
      return 0;
    }
    let number = parseInt(value);
    return isNaN(number) ? (oldVal || 0) : (number < 0 ? 0 : number);
  }
});
//整数双向
Vue.filter('numberIn', {
  read(value) {
    return value;
  },
  write(value, oldVal) {
    let number = parseInt(value);
    return isNaN(number) ? (oldVal || 0) : number;
  }
});
//非必填整数双向
Vue.filter('numberInNotRequired', {
  read(value) {
    return value;
  },
  write(value, oldVal) {
    if (/^\s*$/.test(value)) {
      return '';
    }
    let number = parseInt(value);
    return isNaN(number) ? (oldVal || '') : number;
  }
});
//正整数双向包括零
Vue.filter('posNumberInWithZero', {
  read(value) {
    return value;
  },
  write(value, oldVal) {
    let number = parseInt(value);
    return isNaN(number) ? (oldVal || 0) : (number < 0 ? 0 : number);
  }
});
//正整数双向
Vue.filter('posNumberIn', {
  read(value) {
    return value;
  },
  write(value, oldVal) {
    let number = parseInt(value);
    return isNaN(number) ? (oldVal || 1) : (number <= 0 ? 1 : number);
  }
});
//非必填正整数双向
Vue.filter('posNumberInNotRequired', {
  read(value) {
    return value;
  },
  write(value, oldVal) {
    if (/^\s*$/.test(value)) {
      return '';
    }
    let number = parseInt(value);
    return isNaN(number) ? (oldVal || '') : (number <= 0 ? 1 : number);
  }
});
//双向浮点
Vue.filter('floatIn', {
  read(value) {
    return value;
  },
  write(value, oldVal) {
    let number = parseFloat(value);
    return isNaN(number) ? (oldVal || 0.01) : number;
  }
});

//通用处理时间戳
function resetTimeStamp(value) {
  value = value.split('.')[0];
  value = (value + 'Z').replace(/\//g, '-').replace(/[\u4E00-\u9FA5]/g, '').replace(/-(\d+)-(\d+)/, function(all, a, b) {
    /^\d$/.test(a) && (a = '0' + a);
    /^\d$/.test(b) && (b = '0' + b);
    return '-' + a + '-' + b;
  }).replace(/(\d+):(\d+):(\d+)/, function(all, a, b, c) {
    let arrTemp = [];
    /^\d$/.test(a) && (a = '0' + a);
    /^\d$/.test(b) && (b = '0' + b);
    /^\d$/.test(c) && (c = '0' + c);
    arrTemp.push(a, b, c);
    return arrTemp.join(':');
  }).replace(/\d(\s+)\d/, function(all, a) {
    if (/^\s+$/.test(a)) {
      return all.replace(a, 'T');
    }
  }); //强制把时间格式加T
  var dt = new Date(new Date(value).toUTCString().replace('GMT', ''));
  var year = dt.getFullYear();
  var month = parseInt(dt.getMonth()) + 1;
  var day = parseInt(dt.getDate());
  var hours = parseInt(dt.getHours());
  var minutes = parseInt(dt.getMinutes());
  var seconds = parseInt(dt.getSeconds());

  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return {
    year: year,
    month: month,
    day: day,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}
//日期过滤器： 传入 2016-07-07T10:27:13  过滤成： 2016-07-07
Vue.filter('date', {
  //value = value.replace('T', ' ');
  read(value) {
    if (!value) return '';
    var dt = resetTimeStamp(value);
    return dt.year + '-' + dt.month + '-' + dt.day;
  },
  write(value) {
    return value;
  }
});

//  2016-07-07T10:27:13
//  2016-07-07 10:27:13
//  2016-07-07 10:27
//  2016/07/07 10:27:13
//  2016-07-07
//  时间过滤器完整： 传入 2016-07-07T10:27:13  过滤成： 2016-07-07 10:27:13
Vue.filter('datetime', {
  //value = value.replace('T', ' ');
  read(value) {
    if (!value) return '';
    var dt = resetTimeStamp(value);

    return dt.year + '-' + dt.month + '-' + dt.day + ' ' + dt.hours + ':' + dt.minutes + ':' + dt.seconds;
  },
  write(value) {
    return value;
  }
});

//  时间过滤器不带秒钟： 传入 2016-07-07T10:27:13  过滤成： 2016-07-07 10:27
Vue.filter('datetime1', {
  //value = value.replace('T', ' ');
  read(value) {
    if (!value) return '';
    var dt = resetTimeStamp(value);

    return dt.year + '-' + dt.month + '-' + dt.day + ' ' + dt.hours + ':' + dt.minutes;
  },
  write(value) {
    return value;
  }
});

//日期过滤器： 传入 2016-07-07T10:27:13  过滤成： 2016-07-07
Vue.filter('year', {
  //value = value.replace('T', ' ');
  read(value) {
    if (!value) return '';
    var dt = resetTimeStamp(value);
    return dt.year;
  },
  write(value) {
    return value;
  }
});

//日期过滤器： 传入 2016-07-07T10:27:13  过滤成： 2016-07-07
Vue.filter('month', {
  //value = value.replace('T', ' ');
  read(value) {
    if (!value) return '';
    var dt = resetTimeStamp(value);
    return dt.month;
  },
  write(value) {
    return value;
  }
});

//对账大写
var dictCurrencyCN = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '拐', '玖', '拾', '佰', '仟', '万', '亿'];
Vue.filter('currencyCN', function(value) {
  var suffix = '整';
  if (/\./.test(value)) {
    if (value.split('.')[1] - 0 != 0) {
      suffix = '';
      var fractionalPart = value.split('.')[1].split('');
      if (fractionalPart[0] == 0) {
        suffix += '零';
      } else {
        suffix += dictCurrencyCN[fractionalPart[0] - 0] + '角';
      }
      if (fractionalPart[1] == 0) {
        suffix += '';
      } else {
        suffix + dictCurrencyCN[fractionalPart[1] - 0] + '分';
      }
    } else {
      suffix = '整';
    }
  }
  var integerPart = '';
  var yi = (value / 100000000).toFixed();
  if (yi > 0) {
    integerPart += dictCurrencyCN[yi] + '亿';
  } else {}

});

//---------------------------------------------------------------------------------
//字典表过滤器
//审核状态
Vue.filter('auditStatus', (value) => {
  return dictionary['auditStatus'][value];
});
//采购单状态
Vue.filter('purchaseOrderStatus', (value) => {
  return dictionary['purchaseOrderStatus'][value];
});
//调拨单状态特殊处理
Vue.filter('dispatchOrderStatus', (value) => {
  return 5 == value ? '已预告' : value;
});
//付款方式
Vue.filter('payType', (value) => {
  return dictionary['payType'][value];
});
//付款状态
Vue.filter('payedStatus', (value) => {
  return dictionary['payedStatus'][value];
});
//收款状态
Vue.filter('proceedsStatus', (value) => {
  return dictionary['proceedsStatus'][value];
});
//通用财务单据类型
Vue.filter('financeBillType', (value) => {
  return dictionary['financeBillType'][value];
});
//客户单据类型状态
Vue.filter('customerBillType', (value) => {
  return dictionary['customerBillType'][value];
});
//是否含票
Vue.filter('receipt', (value) => {
  return dictionary['receipt'][value];
});
//客户来源
Vue.filter('customerOrigin', (value) => {
  return dictionary['customerOrigin'][value];
});
//审核类型
Vue.filter('flowType', (value) => {
  return dictionary['flowType'][value];
});
//用户状态
Vue.filter('userStatus', (value) => {
  return dictionary['userStatus'][value];
});
//通用是否
Vue.filter('yesOrNo', (value) => {
  return dictionary['isOrNo'][value];
});
//调剂类型
Vue.filter('transferType', (value) => {
  return dictionary['transferType'][value];
});
//借出归还状态
Vue.filter('borrowStatus', (value) => {
  return dictionary['borrowStatus'][value];
});
//串号状态
Vue.filter('SNStatus', (value) => {
  return dictionary['SNStatus'][value];
});
//打印状态
Vue.filter('printStatus', (value) => {
  return value > 0 ? '已打印' : '未打印';
});
//成本调整类型
Vue.filter('costChangeType', (value) => {
  return value > 0 ? '平均下调' : '全部调整';
});
//串号录入标准
Vue.filter('SNStandard', (value) => {
  return dictionary['SNStandard'][value];
});
//仓库属性
Vue.filter('storeType', (value) => {
  return dictionary['storeType'][value];
});
//发票状态
Vue.filter('receiptStatus', (value) => {
  return dictionary['receiptStatus'][value];
});
//余额类型
Vue.filter('cashType', (value) => {
  return value in dictionary['cashType'] ? dictionary['cashType'][value] : '其它';
});
//加权调价类型
Vue.filter('priceAvgType', (value) => {
  return dictionary['priceAvgType'][value];
});
//加权调价类型
Vue.filter('flowStatus', (value) => {
  return dictionary['flowStatus'][value];
});
//是否
Vue.filter('isOrNo', (value) => {
  return dictionary['isOrNo'][value];
});
//采购保价明细状态
Vue.filter('purchaseProtectDetailStatus', (value) => {
  return dictionary['purchaseProtectDetailStatus'][value];
});
//抵扣名细类别
Vue.filter('finacePayKind', (value) => {
  return dictionary['finacePayKind'][value];
});
//财务付款类别
Vue.filter('finacePayType', (value) => {
  return dictionary['finacePayType'][value];
});
//财务收款类别
Vue.filter('finaceProceedsType', (value) => {
  return dictionary['finaceProceedsType'][value];
});
//凭证类别
Vue.filter('VoucherType', (value) => {
  return dictionary['VoucherType'][value];
});
//财务付款方式
Vue.filter('finacePayMethod', (value) => {
  return dictionary['finacePayMethod'][value];
});
//数据对接模块
Vue.filter('dataConnectSourceType', (value) => {
  return dictionary['dataConnectSourceType'][value];
});
Vue.filter('VarType', v => dictionary['VarType'][v]);
Vue.filter('triggerNode', v => dictionary['EmitNode'][v]);
//B2B同步类型
Vue.filter('DIType', (value) => {
  return dictionary['DIType'][value];
});
Vue.filter('disabled', (value) => {
  return dictionary['disabled'][value];
});