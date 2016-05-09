/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/htmls/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// var waiting=require('components/waiting.js');

	// waiting.show();
	//
	var waiting = __webpack_require__(1);
	var validator = __webpack_require__(2);
	// var popup=require('components/popupMobile');

	// popup({
	// 	title:'提示',
	// 	content:'你好啊',
	// 	ok:function(){
	// 		alert('ok')
	// 	}

	// })

	// waiting.show();

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	//加载等待提示，pcWaiting.show()、waiting.remove(),电脑端等待，没有提示文字,arg=global：全遮罩
	var PCwaiting = {
	    _getDiv: function _getDiv(arg) {
	        var w = document.querySelector('.PCwaiting');

	        if (!w) {
	            var div = document.createElement('div');
	            div.className = 'PCwaiting ' + (arg == 'global' ? '' : 'local');
	            w = div;
	            var style = document.createElement('style');
	            style.innerHTML = ".PCwaiting{position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.5);z-index:8888}.PCwaiting.local{left:50%;top:36%;width:50px;height:48px;margin-left:-25px;border-radius:3px;}.PCwaiting:after {content: ''; position: absolute; top: 50%; left: 50%; width: 3px; height: 3px; margin-top: -2px; margin-left: -2px; text-align: center; -webkit-border-radius: 100%; border-radius: 100%; box-shadow:0 0 3px; -webkit-transition: all, 0.3s, linear; transition: all, 0.3s, linear; -webkit-animation: am-wait 1.2s linear infinite; animation: am-wait 1.2s linear infinite;box-shadow:0 -10px 0 1px #eee, 10px 0px #eee, 0 10px #eee, -10px 0 #eee, -7px -7px 0 0.5px #eee, 7px -7px 0 0.5px #eee, 7px 7px #eee, -7px 7px #eee }@-webkit-keyframes am-wait {100% {-webkit-transform: rotate(1turn);transform: rotate(1turn);}}@keyframes am-wait {100% {-webkit-transform: rotate(1turn);transform: rotate(1turn);}";
	            w.appendChild(style);
	            document.body.appendChild(w);
	        }
	        return w;
	    },
	    show: function show(arg) {
	        this._getDiv(arg).style.display = 'block';
	    },
	    hide: function hide() {
	        this._getDiv().style.display = 'none';
	    },
	    remove: function remove() {
	        document.body.removeChild(this._getDiv());
	    }
	};

	module.exports = PCwaiting;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

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
	    _check: function _check(pattern) {
	        return function (arg) {
	            return pattern.test(arg);
	        };
	    },
	    isEmpty: function isEmpty(arg) {
	        var l = arguments.length;
	        for (i = 0; i < l; i++) {
	            if (this._check(this._reg.empty)(arguments[i])) return true;
	        }
	        return false;
	    },
	    isNotPhone: function isNotPhone(arg) {
	        return !this._check(this._reg.phone)(arg);
	    },
	    isNotEmail: function isNotEmail(arg) {
	        return !this._check(this._reg.email)(arg);
	    },
	    isNotMoneyFormat: function isNotMoneyFormat(arg) {
	        return !this._check(this._reg.moneyFormat)(arg);
	    },
	    isNotInteger: function isNotInteger(arg) {
	        return !this._check(this._reg.integer)(arg);
	    },
	    isIllegal: function isIllegal(arg) {
	        return this._check(this._reg.illegal)(arg);
	    },
	    isNotPercent: function isNotPercent(arg) {
	        var l = arguments.length;
	        for (i = 0; i < l; i++) {
	            if (!this._check(this._reg.percent)(arguments[i])) return true;
	        }
	        return false;
	    }
	};
	module.exports = validator;

/***/ }
/******/ ]);