//开发环境变量，API、地区
window.APISERVER = 'http://192.168.1.23:300/'; //本地联调开发环境
// window.APISERVER = 'http://192.168.1.234:300/'; //本地联调开发环境Y
// window.APISERVER = 'http://192.168.1.251:300/'; //开发环境
window.G_LOGINHREF = location.protocol + '//' + location.host + '/' + 'index.html#!login';
var scriptArea = document.createElement('script');
scriptArea.src = 'http://192.168.1.251:1000/areainfo.js';
document.body.appendChild(scriptArea);

//生产环境变量，API、地区
// window.APISERVER = 'http://psiapi2.zmaimai.com/'; //demo生产环境
// document.write('<scr' + 'ipt src="http://ucapi2.zmaimai.com/areainfo.js"></sc' + 'ript>'); //DEMO
// window.G_LOGINHREF = 'http://demo.zmaimai.com/login.aspx';
