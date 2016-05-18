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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	$('.footer.menu').on('click', '>.item .js-toggle', function () {
	    var $t = $(this);
	    $t.closest('.menu-l1').addClass('on').find('.on').removeClass('on').end().siblings('.item').removeClass('on');
	    $t.addClass('on');
	});

	__webpack_require__(7);

	//前进后退下步，不刷页面
	function showByHash() {
	    var hash = location.hash.split('#')[1];
	    var $currentContent = $('.step').children('[data-step=' + hash + ']');
	    if ($currentContent.length) {
	        $currentContent.addClass('am-ease-show on').siblings('.item').removeClass('on am-ease-show');
	    } else {
	        $('.step').children('.item').first().addClass('am-ease-show on');
	    }
	    var title = $currentContent.data('stepTitle');
	    if (title) {
	        document.title = title;
	    }
	}
	showByHash();
	window.addEventListener('hashchange', showByHash);

	//只拖动，不读数
	var htmlMenuL2 = '<li class="item js-toggle">$text</li>';
	$('.menu-l2').dragsort({
	    itemSelector: 'li:not(.add-wrapper)',
	    dragSelector: 'li',
	    dragBetween: true,
	    placeHolderTemplate: "<li></li>"
	}).find('.add-wrapper').on('click', function () {
	    var $t = $(this);
	    var $parent = $t.closest('.menu-l2');
	    if ($parent.children().length > 5) {
	        $t.hide();
	        return;
	    }
	    $t.closest('.menu-l2').children().first().before(htmlMenuL2);
	});

	//删除菜单
	var slideDel = __webpack_require__(13);
	$('.del-menu').on('click', function () {
	    var $on = $('.footer.menu').find('.on .on');
	    var $prev = $on.prev('.js-toggle'),
	        $next = $on.next('.js-toggle');
	    var $parent = $on.parent();
	    slideDel($on, function () {
	        if ($parent.hasClass('menu-l2')) {
	            if ($prev.length) {
	                $prev.click();
	            } else if ($next.length) {
	                $next.click();
	            }
	            $parent.find('.add-wrapper').show();
	        }
	    });
	});

/***/ },

/***/ 5:
/***/ function(module, exports) {

	'use strict';

	module.exports = function (target) {
	    if (target) {
	        if (typeof target == 'string') {
	            return document.querySelector(target);
	        } else if (target.nodeName) {
	            return target;
	        } else {
	            return target[0];
	        }
	    } else {
	        return '';
	    }
	};

/***/ },

/***/ 7:
/***/ function(module, exports) {

	'use strict';

	// var $=require('jquery');

	module.exports = function ($) {
	    if (!$) {
	        console.warn('需要jQuery赞助哦');
	        return;
	    }

	    $('.js-switcher').children('.title').children('.item').on('click', function () {
	        var $t = $(this),
	            index = $t.closest('.title').children('.item').index(this);
	        $t.addClass('on').siblings('.item').removeClass('on').closest('.js-switcher').children('.content').children('.item').removeClass('on').eq(index).addClass('on');
	    });
	}(jQuery);

/***/ },

/***/ 13:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(getTarget) {'use strict';

	var getTargets = __webpack_require__(5);

	module.exports = function () {
	    var target = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	    var callback = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	    var direction = arguments.length <= 2 || arguments[2] === undefined ? 'left' : arguments[2];
	    var distance = arguments.length <= 3 || arguments[3] === undefined ? 30 : arguments[3];

	    var target = getTarget(target);
	    if (target) {
	        var dir = '';
	        switch (direction) {
	            case 'up':
	                dir = 'translateY(-' + distance + 'px)';
	                break;
	            case 'down':
	                dir = 'translateY(' + distance + 'px)';
	                break;
	            case 'right':
	                dir = 'translateX(' + distance + 'px)';
	                break;
	            default:
	                dir = 'translateX(-' + distance + 'px)';
	                break;
	        }
	        target.style.cssText = 'transition:.3s ease-out;z-index:-1;transform:' + dir + ';opacity:.1';
	        var _remove = function _remove() {
	            target.parentNode.removeChild(target);
	            typeof callback === 'function' && callback.bind(target)();
	        };
	        setTimeout(_remove, 200);
	    }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }

/******/ });