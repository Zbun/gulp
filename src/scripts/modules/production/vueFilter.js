//---------------------------------------------------------------------------------

//格式化浮点数
Vue.filter('floatFormat', function(value) {
  if (!value) {
    return 0;
  }
  return parseFloat(value.toFixed(10));
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
    if (value == undefined) {
      return '';
    }
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
Vue.filter('date', function(value) {
  if (!value) return '';
  var dt = resetTimeStamp(value);
  return dt.year + '-' + dt.month + '-' + dt.day;

});

//  2016-07-07
//  时间过滤器完整： 传入 2016-07-07T10:27:13  过滤成： 2016-07-07 10:27:13
Vue.filter('datetime', function(value) {
  if (!value) return '';
  var dt = resetTimeStamp(value);

  return dt.year + '-' + dt.month + '-' + dt.day + ' ' + dt.hours + ':' + dt.minutes + ':' + dt.seconds;

});

/**
 * 通用过滤图片src，需要服务器返回以,分隔的n张图片字符串
 * @date   2018-04-24
 * @author zhao.liubin@zol.com.cn
 * @param  {<String>}
 * @return {<Object>}
 */
Vue.filter('imagesLink', function(value) {
  if (!value || value.length == 0) {
    return '/dist/images/goodsDefault.jpg';
  } else {
    return value.split(',')[0];
  }
});
Vue.filter('imageLink', function(value) { //防写错，容错
  if (!value || value.length == 0) {
    return '/dist/images/goodsDefault.jpg';
  } else {
    return value.split(',')[0];
  }
});


for (let key in dictionary) { //以词典为模板生成过滤器
  Vue.filter(key, (value) => dictionary[key][value]);
}