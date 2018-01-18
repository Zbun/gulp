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
* modified 2017.12.25 添加一个输入框内显示提示文字的字符串:mobile，此时提示文字大输入框内位置，会自动消失
 */
// let _regExp = require('./regExp.js');
let fn = require('./validatorManu.js');
module.exports = function(el) {

  let objMsg = {
    empty: '请填写此项',
    phone: '手机号码格式有误，请检查',
    telnum: '格式有误，请检查',
    email: '邮箱格式有误，请检查',
    money: '金额格式为正数且最多两位小数，请检查',
    money1: '金额格式为最多两位小数，请检查', //允许负值
    integer: '需要输入整数，请检查',
    posInteger: '需要输入正整数，请检查',
    notPositive: '需要输入非负数，请检查',
    notPositiveInteger: '需要输入非负整数，请检查',
    integer1: '需要输入整数，请检查',
    percent: '百分数格式为整数，请检查',
    url: '链接格式有误，请检查'
  };
  // mySelf(arg, regExp) {
  //   return _check(regExp)(arg);
  // }
  var box = '';
  if (el.nodeName) {
    box = el;
  } else box = document.querySelector(el);
  if (!box.nodeType || box.nodeType != 1) {
    console.warn('节点没找到，请检查参数，传参为字符串或节点');
    return false;
  }
  var msg = '';
  let valid = true;
  var curNode = '';
  var pos = 'r';
  var indexStrShowtips = -1;
  var isMobile = false;
  if (box) {
    let els = box.querySelectorAll('[data-validate]');
    for (let i = 0; i < els.length; i++) {
      msg = '';
      valid = true;
      //获取需要验证的元素，即含有data-validate属性的元素
      let vad = els[i].getAttribute('data-validate').toLowerCase();
      // let keys = Object.keys(vs);
      isMobile = vad.indexOf('mobile') > -1;
      let val = els[i].value;
      indexStrShowtips = vad.indexOf('show'); //是否弹出窗口提示
      if (vad.indexOf('down') > -1) { //提示文字是否在下一行
        pos = 'd';
      } else {
        pos = 'r';
      }
      if (vad.indexOf('required') > -1) {
        if (fn.isEmpty(val)) {
          msg = objMsg.empty;
          valid = false;
          curNode = els[i];
          break;
        }
      }
      if (vad.indexOf('email') > -1) {
        if (!fn.isEmpty(val) && !fn.isEmail(val)) {
          msg = objMsg.email;
        }
      } else if (vad.indexOf('phone') > -1) {
        if (!fn.isEmpty(val) && !fn.isPhone(val)) {
          msg = objMsg.phone;
        }
      } else if (vad.indexOf('posinteger') > -1) {
        if (!fn.isEmpty(val) && !fn.isPosInteger(val)) {
          msg = objMsg.posInteger;
        }
      } else if (vad.indexOf('notpositiveinteger') > -1) {
        if (!fn.isEmpty(val) && !fn.isNotPositiveInteger(val)) {
          msg = objMsg.notPositiveInteger;
        }
      } else if (vad.indexOf('notpositive') > -1) {
        if (!fn.isEmpty(val) && !fn.isNotPositive(val)) {
          msg = objMsg.notPositive;
        }
      } else if (vad.indexOf('integer1') > -1) {
        if (!fn.isEmpty(val) && !fn.isInteger1(val)) {
          msg = objMsg.integer1;
        }
      } else if (vad.indexOf('integer') > -1) {
        if (!fn.isEmpty(val) && !fn.isInteger(val)) {
          msg = objMsg.integer;
          if (val > 65535) {
            msg = '最大整数不能超过65535，请重新填写';
          }
        }
      } else if (vad.indexOf('money1') > -1) {
        if (!fn.isEmpty(val) && !fn.isMoney1(val)) {
          msg = objMsg.money1;
        }
      } else if (vad.indexOf('money') > -1) {
        if (!fn.isEmpty(val) && !fn.isMoney(val)) {
          msg = objMsg.money;
          if (('' + val).length > 16) {
            msg = '输入金额不合法，请重新填写';
          }
        }
      } else if (vad.indexOf('percent') > -1) {
        if (!fn.isEmpty(val) && !fn.isPercent(val)) {
          msg = objMsg.percent;
        }
      } else if (vad.indexOf('telnum') > -1) {
        if (!fn.isEmpty(val) && !fn.isTelnum(val)) {
          msg = objMsg.telnum;
        }
      } else if (vad.indexOf('url') > -1) {
        if (!fn.isEmpty(val) && !fn.isUrl(val)) {
          msg = objMsg.url;
        }
      }

      //验证可能存在的最小长度
      if (!msg) {
        var lengthRequired = els[i].getAttribute('data-validate-length');
        if (lengthRequired) {
          if (val.length < lengthRequired) {
            msg = '该项要求最小长度为：' + lengthRequired + '，请检查';
          }
        }
      }
      //验证自定义规则data-validate-rules="[{rule:/\d/,msg:'请填写中文'}]"
      // if (!msg) {
      //   let arrRules = els[i].getAttribute('data-validate-rules');
      //   if (arrRules && arrRules.length) {
      //     var JSONRules = '';
      //     try {
      //       JSONRules = JSON.parse(els[i].getAttribute('data-validate-rules'));
      //     } catch (err) {}
      //     if (JSONRules) {
      //       for (let k = 0; k < JSONRules.length; k++) {
      //         var rule = JSONRules[k].rule;
      //         if (rule.test(val)) {
      //           msg = rule.msg;
      //           break;
      //         }
      //       }
      //     }

      //   }
      // }
      if (msg) {
        valid = false;
        curNode = els[i];
        break;
      }
    }
  }

  var getNextNode = function(node) {
    var next = node.nextSibling;
    while (next && next.nodeType != 1) {
      next = next.nextSibling;
    }
    if (next && next.nodeType != 1) {
      next = '';
    }
    return next;
  };

  if (curNode) {
    let parent = curNode.parentNode;
    let next = '';
    let nodeTips = '';
    if (indexStrShowtips == -1) {
      next = getNextNode(curNode);
      nodeTips = document.createElement('span');
      if (pos == 'd') {
        nodeTips = document.createElement('p');
      }

      nodeTips.className = 'tips error';
      nodeTips.innerHTML = msg;
      if (isMobile) { //判断是是否，显示错误在输入框内
        if (window.getComputedStyle(parent, null).getPropertyValue('position') == 'static') {
          parent.style.position = 'relative';
        }
        nodeTips.style.cssText = 'position:absolute;top:50%;right:0;max-width:100%;white-space:nowrap;transform:translate(0,-50%);';
        setTimeout(function() {
          parent.removeChild(nodeTips);
        }, 1000);
      }
      if (next) {
        if (next.classList.contains('error')) {
          next.innerHTML = msg;
        } else {
          if (next.classList.contains('area')) {
            showTips('请选择区域', 'error');
          } else {
            parent.insertBefore(nodeTips, next);
          }
        }
      } else {

        parent.appendChild(nodeTips);
      }
    } else {
      showTips(msg, 'error', function() {
        curNode.focus();
      }, 1000);
    }
    curNode.classList.add('error');
    curNode.focus();
    curNode.addEventListener('input', function() {
      this.classList.remove('error');
      let next = getNextNode(this);
      if (next) {
        if (next.classList.contains('error')) {
          this.parentNode.removeChild(next);
        }
      }
    });
  }
  return valid;
};