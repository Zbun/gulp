/**
 * 一些校验数据的方法集合，可根据需要再添加
 * @author Zhao Liubin
 * @type {Object}
 * 用法简述：
 * HTML结构如下所例：
 * <input data-validate="required phone" placeholder='必填电话号码'>
   <input data-validate="email down" placeholder="可选填邮箱">
   其中，required串表明些项必填即非空，down表明提示文字在框下方
   可选的校验格式有：phone,money,email,integer(整数),percent(百分比格式)
   使用方法：
   if(!validator('form')){
      return false;
   }
   其中form 为，需要校验的输入框的外层总盒
  validator 为import 或require 进的方法名
 */
let _regExp = require('./regExp.js');
module.exports = function(el) {
  let _check = (pattern) => {
    return function(arg) {
      return pattern.test(arg);
    };
  };
  let fn = {
    empty(arg) {
      return _check(_regExp.empty)(arg);
    },
    phone(arg) {
      return _check(_regExp.phone)(arg);
    },
    telnum(arg) {
      return _check(_regExp.telnum)(arg);
    },
    email(arg) {
      return _check(_regExp.email)(arg);
    },
    money(arg) {
      return _check(_regExp.money)(arg);
    },
    money1(arg) {
      return _check(_regExp.money1)(arg);
    },
    url(arg) {
      return _check(_regExp.url)(arg);
    },
    integer(arg) {
      return _check(_regExp.integer)(arg);
    },
    integer1(arg) {
      return _check(_regExp.integer1)(arg);
    },
    illegal(arg) {
      return _check(_regExp.illegal)(arg);
    },
    percent(arg) {
      return _check(_regExp.percent)(arg);
    }
  };
  let objMsg = {
    empty: '该数据项为必填项，请填写',
    phone: '手机号码格式为1开头的11位纯数字，请检查',
    telnum: '格式不正确，需要输入手机号或-隔开的座机号',
    email: '邮箱格式不正确，请检查',
    money: '金额格式为最多两位小数，请检查',
    money1: '金额格式为最多两位小数，请检查',
    integer: '需要输入整数，请检查',
    integer1: '需要输入整数，请检查',
    percent: '百分数格式为最多整数，请检查',
    url: '链接格式不正确，请检查'
  };
  // mySelf(arg, regExp) {
  //   return _check(regExp)(arg);
  // }
  var $box = '';
  if (el.nodeName) {
    $box = $(el);
  } else $box = $(el);
  var box = $box[0];
  if (!box.nodeType || box.nodeType != 1) {
    console.warn('节点没找到，请检查参数，传参为字符串或节点');
    return false;
  }
  var msg = '';
  let valid = true;
  var curNode = '';
  var pos = 'r';
  var showtips = -1;
  if (box) {
    let els = $box.find('[data-validate]');
    for (let i = 0; i < els.length; i++) {
      msg = '';
      valid = true;
      let vad = els[i].getAttribute('data-validate');
      // let keys = Object.keys(vs);
      let val = els[i].value;
      showtips = vad.indexOf('show');
      if (vad.indexOf('down') > -1) {
        pos = 'd';
      } else {
        pos = 'r';
      }
      if (vad.indexOf('required') > -1) {
        if (fn.empty(val)) {
          msg = objMsg.empty;
          valid = false;
          curNode = els[i];
          break;
        }
      }
      if (vad.indexOf('email') > -1) {
        if (!fn.empty(val) && !fn.email(val)) {
          msg = objMsg.email;
        }
      } else if (vad.indexOf('phone') > -1) {
        if (!fn.empty(val) && !fn.phone(val)) {
          msg = objMsg.phone;
        }
      } else if (vad.indexOf('integer1') > -1) {
        if (!fn.empty(val) && !fn.integer1(val)) {
          msg = objMsg.integer1;
        }
      } else if (vad.indexOf('integer') > -1) {
        if (!fn.empty(val) && !fn.integer(val)) {
          msg = objMsg.integer;
          if (val > 65535) {
            msg = '最大整数不能超过65535，请重新填写';
          }
        }
      } else if (vad.indexOf('money1') > -1) {
        if (!fn.empty(val) && !fn.money1(val)) {
          msg = objMsg.money1;
        }
      } else if (vad.indexOf('money') > -1) {
        if (!fn.empty(val) && !fn.money(val)) {
          msg = objMsg.money;
          if (('' + val).length > 16) {
            msg = '输入金额不合法，请重新填写';
          }
        }
      } else if (vad.indexOf('percent') > -1) {
        if (!fn.empty(val) && !fn.percent(val)) {
          msg = objMsg.percent;
        }
      } else if (vad.indexOf('telnum') > -1) {
        if (!fn.empty(val) && !fn.telnum(val)) {
          msg = objMsg.telnum;
        }
      } else if (vad.indexOf('url') > -1) {
        if (!fn.empty(val) && !fn.url(val)) {
          msg = objMsg.url;
        }
      }

      if (msg) {
        valid = false;
        curNode = els[i];
        break;
      }
    }
  }

  if (curNode) {
    let parent = curNode.parentNode;
    let next = '';
    let nodeTips = '';
    if (showtips == -1) {
      // next = getNextNode(curNode);
      var $next = $(curNode).next();
      next = $next[0];
      nodeTips = document.createElement('span');
      if (pos == 'd') {
        nodeTips = document.createElement('p');
      }
      nodeTips.className = 'tips error';
      nodeTips.innerHTML = msg;
      if (next) {
        if ($next.hasClass('error')) {
          next.innerHTML = msg;
        } else {
          parent.insertBefore(nodeTips, next);
        }
      } else {
        parent.appendChild(nodeTips);
      }
    } else {
      showTips(msg, 'error', function() {
        curNode.focus();
      }, 1000);
    }
    $(curNode).addClass('error').focus().on('keyup', function() {
      var $t = $(this);
      $t.removeClass('error');
      var $next = $t.next();
      if ($next[0] && $next.hasClass('error')) {
        $next.remove();
      }
    });
  }
  return valid;
};
