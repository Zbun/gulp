// import 'commonLib/jquery.twbsPagination.js';

// import showTips from 'commonScripts/showTipsState.js';
import URI from 'commonScripts/uri.js';
/**
 * 获取数据通用方法
 * @date   2016-11-28
 * @author zhao.liubin@zol.com.cn
 * @param  {[Object]} 传入{target:'需要禁用当前点击按钮时传入当前按钮对象',cmd:'URL',para:{},callback:function(){}}
 * @return {[type]}
 */
// var server = apiServer();
var server = window.APISERVER || localStorage.APIServer; //临时调试接口地址，本地存储，随时修改
var server2B = window.APISERVER2 || localStorage.APIServer2; //2B调试接口地址，本地存储，随时修改
localStorage.APIServer = /\/$/.test(server) ? server : server + '/';
localStorage.APIServer2 = /\/$/.test(server2B) ? server2B : server2B + '/';
var token = URI.query.get('token') || localStorage.token;
localStorage.token = token || '';
history.replaceState({}, '');

function fetchData(arg) {
  // var api = arg.api;
  var tokenReal = localStorage.token || '';
  var api = (arg.API2 || arg.api2 || arg.API2B || arg.api2b || arg.API || arg.api || '').replace(/\s*/g, '');
  var hideLoading = arg.hideLoading; //隐藏加载动画
  var hideTips = arg.hideTips; //隐藏操作成功的提示
  api = /^\//.test(api) ? api.substr(1) : api; //过滤以'/开头的API'
  if (!api) {
    console.warn('需要传入API地址，如：API:"/p/list/"');
    return;
  }
  var finalServer = (arg.API2 || arg.api2 || arg.API2B || arg.api2b) ? (localStorage.APIServer2 || server2B) : (localStorage.APIServer || server); //最终请求服务器，有API时请求管家，有api2时请求
  var finalUrl = ''; //最终接口地址
  if (arg.url) {
    finalUrl = arg.url;
  } else {
    finalUrl = finalServer + api;
  }
  var argPara = arg.para || {};
  var para = $.extend({ token: tokenReal }, argPara);
  var dataList = [];
  var target = arg.target || ''; //防止多次点击时，传当前点击按钮节点
  var async = true;
  if (typeof(arg.async) != void 0) {
    async = arg.async;
  }

  if (target.nodeType) {
    if (target.nodeType == 1) {
      target.classList.add('disabled');
    } else {
      console.warn('需要传入一个节点，检查下哦');
    }
  }
  var l1 = '';
  if (!hideLoading) {
    l1 = loading.show();
  }
  var fnFinish = function() {
    if (!hideLoading) {
      l1.hide();
    }
    (target.nodeType && target.nodeType == 1) && target.classList.remove('disabled');
  };
  var callback = function(data) {
    fnFinish();
    var d = data;
    if (d) {
      switch (parseInt(d.ResponseID)) {
        case 0:
          {
            if (!hideTips && d.Message) {
              showTips(d.Message);
            }
            //处理服务器返回消息，一般用于登录页面
            if (d.Message && typeof arg.handlerMessage == 'function') {
              arg.handlerMessage(d.Message);
            }
            dataList = d.Data;
            //请求成功执行回执操作callback
            if (typeof arg.callback == 'function') {
              if (dataList == undefined) {
                dataList = '';
              }
              arg.callback(dataList);
            } else {
              console.warn('callback 需要方法类型，请检查');
            }
            break;
          }
        case 1:
          {
            //登录状态失效跳转至登录页
            showTips(d.Message, 'error');
            localStorage.token = '';
            localStorage.userName = '';
            localStorage.referrerHash = location.hash;
            setTimeout(function() {
              top.window.location = window.G_LOGINHREF;
            }, 200);
            break;
          }
        default:
          {
            if (!hideTips && d.Message) {
              showTips(d.Message, 'error');
            }
            //处理服务器返回消息，一般用于登录页面
            if (d.Message && typeof arg.handlerMessage == 'function') {
              arg.handlerMessage(d.Message);
            }
            //请求成功，但可能需要处理错误时回调方法 errorCallbak
            if (typeof arg.errorCallback == 'function') {
              arg.errorCallback();
            }
          }
      }
    }
  };
  $.ajax({
    url: finalUrl,
    type: 'POST',
    // beforeSend: function(request) {
    //   request.setRequestHeader("Authority", 'authorizationToken');
    // },
    headers: {},
    data: para,
    dataType: 'JSON',
    success: callback,
    complete() {
      // fnFinish();
    },
    error(xhr) {
      fnFinish();
      !hideTips && showTips('请求出错咯，状态码：' + xhr.status + '<p>若持续出现此情况，请及时联系我们，谢谢。</p>', 'error', '', 3800);
    },
    async: async
  });

  return dataList;
}
module.exports = fetchData;