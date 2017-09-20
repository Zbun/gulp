//开发环境变量，API、地区
// window.APISERVER = 'http://192.168.1.210:300/'; //本地联调开发环境D
// window.APISERVER = 'http://192.168.1.234:300/'; //本地联调开发环境Y
window.APISERVER = 'http://192.168.1.251:300/'; //开发环境
window.APISERVER2 = 'http://192.168.1.6:666/'; //接口2
window.G_LOGINHREF = '/login.html';
var scriptArea = document.createElement('script');
scriptArea.src = '/dist/scripts/areainfo.min.js';
document.body.appendChild(scriptArea);

//生产环境变量，API、地区
// window.APISERVER = 'http://psiapi2.zmaimai.com/'; //demo生产环境
// document.write('<scr' + 'ipt src="http://ucapi2.zmaimai.com/areainfo.js"></sc' + 'ript>'); //DEMO
// window.G_LOGINHREF = location.protocol + '//' + location.host + '/' + 'login.html';