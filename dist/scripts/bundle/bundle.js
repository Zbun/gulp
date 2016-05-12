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

	// var waiting=require('waiting.js');
	// var $=require('jQuery');
	// waiting.show();

	var dialog = __webpack_require__(1);

	var waiting = __webpack_require__(3);

	// var  validator = require('validator');

	// var popup=require('popupMobile');

	__webpack_require__(5)();

	// import al from 'alert.js';
	// al(3)

	//小标签选择弹窗
	$('[data-dialog-content]').on('click', function () {
	    var $t = $(this),
	        dialog_content = $t.data('dialogContent'),
	        dialog_title = $t.data('dialogTitle');
	    var d = dialog({
	        title: dialog_title,
	        onshow: function onshow() {
	            //分页，后台来时删除库及本段代码
	            $('.user-selected-pagination').twbsPagination({
	                totalPages: 15,
	                visiblePages: 5,
	                prev: '<',
	                next: '>',
	                onPageClick: function onPageClick(event, page) {
	                    $('#page-content').text('Page ' + page);
	                }
	            });
	        },
	        cancel: function cancel() {
	            // alert('h')
	        },
	        cancelDisplay: false
	    });
	    d.content($('.popup-html').find('.' + dialog_content).html()).showModal();
	});

	// popup({
	// 	title:'提示',
	// 	content:'你好啊',
	// 	ok:function(){
	// 		alert('ok')
	// 	}

	// })

	// waiting.show();
	// setTimeout(function(){
	//     waiting.hide();
	// },5000);

	var w2 = waiting.show($('.wrapper'));
	setTimeout(function () {
	    w2.remove();
	}, 6000);

	var showTipsOnTop = __webpack_require__(6);

	showTipsOnTop('操作成功', '.wrapper', 3333);

	var SPIN = __webpack_require__(7);

	var s1 = new SPIN($('.wrapper'));

	setTimeout(function () {
	    s1.stop();
	}, 2000);

	var s2 = new SPIN($('.tab-switcher-horizontal>.title'));

	var showTips = __webpack_require__(9);

	showTips();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/*! artDialog v6.0.5 | https://github.com/aui/artDialog */
	!function () {
	  function a(b) {
	    var d = c[b],
	        e = "exports";return "object" == (typeof d === "undefined" ? "undefined" : _typeof(d)) ? d : (d[e] || (d[e] = {}, d[e] = d.call(d[e], a, d[e], d) || d[e]), d[e]);
	  }function b(a, b) {
	    c[a] = b;
	  }var c = {};b("jquery", function () {
	    return jQuery;
	  }), b("popup", function (a) {
	    function b() {
	      this.destroyed = !1, this.__popup = c("<div />").css({ display: "none", position: "absolute", outline: 0 }).attr("tabindex", "-1").html(this.innerHTML).appendTo("body"), this.__backdrop = this.__mask = c("<div />").css({ opacity: .7, background: "#000" }), this.node = this.__popup[0], this.backdrop = this.__backdrop[0], d++;
	    }var c = a("jquery"),
	        d = 0,
	        e = !("minWidth" in c("html")[0].style),
	        f = !e;return c.extend(b.prototype, { node: null, backdrop: null, fixed: !1, destroyed: !0, open: !1, returnValue: "", autofocus: !0, align: "bottom left", innerHTML: "", className: "ui-popup", show: function show(a) {
	        if (this.destroyed) return this;var d = this.__popup,
	            g = this.__backdrop;if (this.__activeElement = this.__getActive(), this.open = !0, this.follow = a || this.follow, !this.__ready) {
	          if (d.addClass(this.className).attr("role", this.modal ? "alertdialog" : "dialog").css("position", this.fixed ? "fixed" : "absolute"), e || c(window).on("resize", c.proxy(this.reset, this)), this.modal) {
	            var h = { position: "fixed", left: 0, top: 0, width: "100%", height: "100%", overflow: "hidden", userSelect: "none", zIndex: this.zIndex || b.zIndex };d.addClass(this.className + "-modal"), f || c.extend(h, { position: "absolute", width: c(window).width() + "px", height: c(document).height() + "px" }), g.css(h).attr({ tabindex: "0" }).on("focus", c.proxy(this.focus, this)), this.__mask = g.clone(!0).attr("style", "").insertAfter(d), g.addClass(this.className + "-backdrop").insertBefore(d), this.__ready = !0;
	          }d.html() || d.html(this.innerHTML);
	        }return d.addClass(this.className + "-show").show(), g.show(), this.reset().focus(), this.__dispatchEvent("show"), this;
	      }, showModal: function showModal() {
	        return this.modal = !0, this.show.apply(this, arguments);
	      }, close: function close(a) {
	        return !this.destroyed && this.open && (void 0 !== a && (this.returnValue = a), this.__popup.hide().removeClass(this.className + "-show"), this.__backdrop.hide(), this.open = !1, this.blur(), this.__dispatchEvent("close")), this;
	      }, remove: function remove() {
	        if (this.destroyed) return this;this.__dispatchEvent("beforeremove"), b.current === this && (b.current = null), this.__popup.remove(), this.__backdrop.remove(), this.__mask.remove(), e || c(window).off("resize", this.reset), this.__dispatchEvent("remove");for (var a in this) {
	          delete this[a];
	        }return this;
	      }, reset: function reset() {
	        var a = this.follow;return a ? this.__follow(a) : this.__center(), this.__dispatchEvent("reset"), this;
	      }, focus: function focus() {
	        var a = this.node,
	            d = this.__popup,
	            e = b.current,
	            f = this.zIndex = b.zIndex++;if (e && e !== this && e.blur(!1), !c.contains(a, this.__getActive())) {
	          var g = d.find("[autofocus]")[0];!this._autofocus && g ? this._autofocus = !0 : g = a, this.__focus(g);
	        }return d.css("zIndex", f), b.current = this, d.addClass(this.className + "-focus"), this.__dispatchEvent("focus"), this;
	      }, blur: function blur() {
	        var a = this.__activeElement,
	            b = arguments[0];return b !== !1 && this.__focus(a), this._autofocus = !1, this.__popup.removeClass(this.className + "-focus"), this.__dispatchEvent("blur"), this;
	      }, addEventListener: function addEventListener(a, b) {
	        return this.__getEventListener(a).push(b), this;
	      }, removeEventListener: function removeEventListener(a, b) {
	        for (var c = this.__getEventListener(a), d = 0; d < c.length; d++) {
	          b === c[d] && c.splice(d--, 1);
	        }return this;
	      }, __getEventListener: function __getEventListener(a) {
	        var b = this.__listener;return b || (b = this.__listener = {}), b[a] || (b[a] = []), b[a];
	      }, __dispatchEvent: function __dispatchEvent(a) {
	        var b = this.__getEventListener(a);this["on" + a] && this["on" + a]();for (var c = 0; c < b.length; c++) {
	          b[c].call(this);
	        }
	      }, __focus: function __focus(a) {
	        try {
	          this.autofocus && !/^iframe$/i.test(a.nodeName) && a.focus();
	        } catch (b) {}
	      }, __getActive: function __getActive() {
	        try {
	          var a = document.activeElement,
	              b = a.contentDocument,
	              c = b && b.activeElement || a;return c;
	        } catch (d) {}
	      }, __center: function __center() {
	        var a = this.__popup,
	            b = c(window),
	            d = c(document),
	            e = this.fixed,
	            f = e ? 0 : d.scrollLeft(),
	            g = e ? 0 : d.scrollTop(),
	            h = b.width(),
	            i = b.height(),
	            j = a.width(),
	            k = a.height(),
	            l = (h - j) / 2 + f,
	            m = 382 * (i - k) / 1e3 + g,
	            n = a[0].style;n.left = Math.max(parseInt(l), f) + "px", n.top = Math.max(parseInt(m), g) + "px";
	      }, __follow: function __follow(a) {
	        var b = a.parentNode && c(a),
	            d = this.__popup;if (this.__followSkin && d.removeClass(this.__followSkin), b) {
	          var e = b.offset();if (e.left * e.top < 0) return this.__center();
	        }var f = this,
	            g = this.fixed,
	            h = c(window),
	            i = c(document),
	            j = h.width(),
	            k = h.height(),
	            l = i.scrollLeft(),
	            m = i.scrollTop(),
	            n = d.width(),
	            o = d.height(),
	            p = b ? b.outerWidth() : 0,
	            q = b ? b.outerHeight() : 0,
	            r = this.__offset(a),
	            s = r.left,
	            t = r.top,
	            u = g ? s - l : s,
	            v = g ? t - m : t,
	            w = g ? 0 : l,
	            x = g ? 0 : m,
	            y = w + j - n,
	            z = x + k - o,
	            A = {},
	            B = this.align.split(" "),
	            C = this.className + "-",
	            D = { top: "bottom", bottom: "top", left: "right", right: "left" },
	            E = { top: "top", bottom: "top", left: "left", right: "left" },
	            F = [{ top: v - o, bottom: v + q, left: u - n, right: u + p }, { top: v, bottom: v - o + q, left: u, right: u - n + p }],
	            G = { left: u + p / 2 - n / 2, top: v + q / 2 - o / 2 },
	            H = { left: [w, y], top: [x, z] };c.each(B, function (a, b) {
	          F[a][b] > H[E[b]][1] && (b = B[a] = D[b]), F[a][b] < H[E[b]][0] && (B[a] = D[b]);
	        }), B[1] || (E[B[1]] = "left" === E[B[0]] ? "top" : "left", F[1][B[1]] = G[E[B[1]]]), C += B.join("-") + " " + this.className + "-follow", f.__followSkin = C, b && d.addClass(C), A[E[B[0]]] = parseInt(F[0][B[0]]), A[E[B[1]]] = parseInt(F[1][B[1]]), d.css(A);
	      }, __offset: function __offset(a) {
	        var b = a.parentNode,
	            d = b ? c(a).offset() : { left: a.pageX, top: a.pageY };a = b ? a : a.target;var e = a.ownerDocument,
	            f = e.defaultView || e.parentWindow;if (f == window) return d;var g = f.frameElement,
	            h = c(e),
	            i = h.scrollLeft(),
	            j = h.scrollTop(),
	            k = c(g).offset(),
	            l = k.left,
	            m = k.top;return { left: d.left + l - i, top: d.top + m - j };
	      } }), b.zIndex = 1024, b.current = null, b;
	  }), b("dialog-config", { backdropBackground: "#000", backdropOpacity: .7, content: '<span class="ui-dialog-loading">Loading..</span>', title: "", statusbar: "", button: null, ok: null, cancel: null, okValue: "确定", cancelValue: "取消", cancelDisplay: !0, width: "", height: "", padding: "", skin: "", quickClose: !1, cssUri: "../css/ui-dialog.css", innerHTML: '<div i="dialog" class="ui-dialog"><div class="ui-dialog-arrow-a"></div><div class="ui-dialog-arrow-b"></div><table class="ui-dialog-grid"><tr><td i="header" class="ui-dialog-header"><button i="close" class="ui-dialog-close">&#215;</button><div i="title" class="ui-dialog-title"></div></td></tr><tr><td i="body" class="ui-dialog-body"><div i="content" class="ui-dialog-content"></div></td></tr><tr><td i="footer" class="ui-dialog-footer"><div i="statusbar" class="ui-dialog-statusbar"></div><div i="button" class="ui-dialog-button"></div></td></tr></table></div>' }), b("dialog", function (a) {
	    var b = a("jquery"),
	        c = a("popup"),
	        d = a("dialog-config"),
	        e = d.cssUri;if (e) {
	      var f = a[a.toUrl ? "toUrl" : "resolve"];f && (e = f(e), e = '<link rel="stylesheet" href="' + e + '" />', b("base")[0] ? b("base").before(e) : b("head").append(e));
	    }var g = 0,
	        h = new Date() - 0,
	        i = !("minWidth" in b("html")[0].style),
	        j = "createTouch" in document && !("onmousemove" in document) || /(iPhone|iPad|iPod)/i.test(navigator.userAgent),
	        k = !i && !j,
	        l = function l(a, c, d) {
	      var e = a = a || {};("string" == typeof a || 1 === a.nodeType) && (a = { content: a, fixed: !j }), a = b.extend(!0, {}, l.defaults, a), a.original = e;var f = a.id = a.id || h + g,
	          i = l.get(f);return i ? i.focus() : (k || (a.fixed = !1), a.quickClose && (a.modal = !0, a.backdropOpacity = 0), b.isArray(a.button) || (a.button = []), void 0 !== d && (a.cancel = d), a.cancel && a.button.push({ id: "cancel", value: a.cancelValue, callback: a.cancel, display: a.cancelDisplay }), void 0 !== c && (a.ok = c), a.ok && a.button.push({ id: "ok", value: a.okValue, callback: a.ok, autofocus: !0 }), l.list[f] = new l.create(a));
	    },
	        m = function m() {};m.prototype = c.prototype;var n = l.prototype = new m();return l.create = function (a) {
	      var d = this;b.extend(this, new c());var e = (a.original, b(this.node).html(a.innerHTML)),
	          f = b(this.backdrop);return this.options = a, this._popup = e, b.each(a, function (a, b) {
	        "function" == typeof d[a] ? d[a](b) : d[a] = b;
	      }), a.zIndex && (c.zIndex = a.zIndex), e.attr({ "aria-labelledby": this._$("title").attr("id", "title:" + this.id).attr("id"), "aria-describedby": this._$("content").attr("id", "content:" + this.id).attr("id") }), this._$("close").css("display", this.cancel === !1 ? "none" : "").attr("title", '关闭').on("click", function (a) {
	        d._trigger("cancel"), a.preventDefault();
	      }), this._$("dialog").addClass(this.skin), this._$("body").css("padding", this.padding), a.quickClose && f.on("onmousedown" in document ? "mousedown" : "click", function () {
	        return d._trigger("cancel"), !1;
	      }), this.addEventListener("show", function () {
	        f.css({ opacity: 0, background: a.backdropBackground }).animate({ opacity: a.backdropOpacity }, 150);
	      }), this._esc = function (a) {
	        var b = a.target,
	            e = b.nodeName,
	            f = /^input|textarea$/i,
	            g = c.current === d,
	            h = a.keyCode;!g || f.test(e) && "button" !== b.type || 27 === h && d._trigger("cancel");
	      }, b(document).on("keydown", this._esc), this.addEventListener("remove", function () {
	        b(document).off("keydown", this._esc), delete l.list[this.id];
	      }), g++, l.oncreate(this), this;
	    }, l.create.prototype = n, b.extend(n, { content: function content(a) {
	        var c = this._$("content");return "object" == (typeof a === "undefined" ? "undefined" : _typeof(a)) ? (a = b(a), c.empty("").append(a.show()), this.addEventListener("beforeremove", function () {
	          b("body").append(a.hide());
	        })) : c.html(a), this.reset();
	      }, title: function title(a) {
	        return this._$("title").text(a), this._$("header")[a ? "show" : "hide"](), this;
	      }, width: function width(a) {
	        return this._$("content").css("width", a), this.reset();
	      }, height: function height(a) {
	        return this._$("content").css("height", a), this.reset();
	      }, button: function button(a) {
	        a = a || [];var c = this,
	            d = "",
	            e = 0;return this.callbacks = {}, "string" == typeof a ? (d = a, e++) : b.each(a, function (a, f) {
	          var g = f.id = f.id || f.value,
	              h = "";c.callbacks[g] = f.callback, f.display === !1 ? h = ' style="display:none"' : e++, d += '<button type="button" i-id="' + g + '"' + h + (f.disabled ? " disabled" : "") + (f.autofocus ? ' autofocus class="ui-dialog-autofocus"' : "") + ">" + f.value + "</button>", c._$("button").on("click", "[i-id=" + g + "]", function (a) {
	            var d = b(this);d.attr("disabled") || c._trigger(g), a.preventDefault();
	          });
	        }), this._$("button").html(d), this._$("footer")[e ? "show" : "hide"](), this;
	      }, statusbar: function statusbar(a) {
	        return this._$("statusbar").html(a)[a ? "show" : "hide"](), this;
	      }, _$: function _$(a) {
	        return this._popup.find("[i=" + a + "]");
	      }, _trigger: function _trigger(a) {
	        var b = this.callbacks[a];return "function" != typeof b || b.call(this) !== !1 ? this.close().remove() : this;
	      } }), l.oncreate = b.noop, l.getCurrent = function () {
	      return c.current;
	    }, l.get = function (a) {
	      return void 0 === a ? l.list : l.list[a];
	    }, l.list = {}, l.defaults = d, l;
	  }), b("drag", function (a) {
	    var b = a("jquery"),
	        c = b(window),
	        d = b(document),
	        e = "createTouch" in document,
	        f = document.documentElement,
	        g = !("minWidth" in f.style),
	        h = !g && "onlosecapture" in f,
	        i = "setCapture" in f,
	        j = { start: e ? "touchstart" : "mousedown", over: e ? "touchmove" : "mousemove", end: e ? "touchend" : "mouseup" },
	        k = e ? function (a) {
	      return a.touches || (a = a.originalEvent.touches.item(0)), a;
	    } : function (a) {
	      return a;
	    },
	        l = function l() {
	      this.start = b.proxy(this.start, this), this.over = b.proxy(this.over, this), this.end = b.proxy(this.end, this), this.onstart = this.onover = this.onend = b.noop;
	    };return l.types = j, l.prototype = { start: function start(a) {
	        return a = this.startFix(a), d.on(j.over, this.over).on(j.end, this.end), this.onstart(a), !1;
	      }, over: function over(a) {
	        return a = this.overFix(a), this.onover(a), !1;
	      }, end: function end(a) {
	        return a = this.endFix(a), d.off(j.over, this.over).off(j.end, this.end), this.onend(a), !1;
	      }, startFix: function startFix(a) {
	        return a = k(a), this.target = b(a.target), this.selectstart = function () {
	          return !1;
	        }, d.on("selectstart", this.selectstart).on("dblclick", this.end), h ? this.target.on("losecapture", this.end) : c.on("blur", this.end), i && this.target[0].setCapture(), a;
	      }, overFix: function overFix(a) {
	        return a = k(a);
	      }, endFix: function endFix(a) {
	        return a = k(a), d.off("selectstart", this.selectstart).off("dblclick", this.end), h ? this.target.off("losecapture", this.end) : c.off("blur", this.end), i && this.target[0].releaseCapture(), a;
	      } }, l.create = function (a, e) {
	      var f,
	          g,
	          h,
	          i,
	          j = b(a),
	          k = new l(),
	          m = l.types.start,
	          n = function n() {},
	          o = a.className.replace(/^\s|\s.*/g, "") + "-drag-start",
	          p = { onstart: n, onover: n, onend: n, off: function off() {
	          j.off(m, k.start);
	        } };return k.onstart = function (b) {
	        var e = "fixed" === j.css("position"),
	            k = d.scrollLeft(),
	            l = d.scrollTop(),
	            m = j.width(),
	            n = j.height();f = 0, g = 0, h = e ? c.width() - m + f : d.width() - m, i = e ? c.height() - n + g : d.height() - n;var q = j.offset(),
	            r = this.startLeft = e ? q.left - k : q.left,
	            s = this.startTop = e ? q.top - l : q.top;this.clientX = b.clientX, this.clientY = b.clientY, j.addClass(o), p.onstart.call(a, b, r, s);
	      }, k.onover = function (b) {
	        var c = b.clientX - this.clientX + this.startLeft,
	            d = b.clientY - this.clientY + this.startTop,
	            e = j[0].style;c = Math.max(f, Math.min(h, c)), d = Math.max(g, Math.min(i, d)), e.left = c + "px", e.top = d + "px", p.onover.call(a, b, c, d);
	      }, k.onend = function (b) {
	        var c = j.position(),
	            d = c.left,
	            e = c.top;j.removeClass(o), p.onend.call(a, b, d, e);
	      }, k.off = function () {
	        j.off(m, k.start);
	      }, e ? k.start(e) : j.on(m, k.start), p;
	    }, l;
	  }), b("dialog-plus", function (a) {
	    var b = a("jquery"),
	        c = a("dialog"),
	        d = a("drag");return c.oncreate = function (a) {
	      var c,
	          e = a.options,
	          f = e.original,
	          g = e.url,
	          h = e.oniframeload;if (g && (this.padding = e.padding = 0, c = b("<iframe />"), c.attr({ src: g, name: a.id, width: "100%", height: "100%", allowtransparency: "yes", frameborder: "no", scrolling: "no" }).on("load", function () {
	        var b;try {
	          b = c[0].contentWindow.frameElement;
	        } catch (d) {}b && (e.width || a.width(c.contents().width()), e.height || a.height(c.contents().height())), h && h.call(a);
	      }), a.addEventListener("beforeremove", function () {
	        c.attr("src", "about:blank").remove();
	      }, !1), a.content(c[0]), a.iframeNode = c[0]), !(f instanceof Object)) for (var i = function i() {
	        a.close().remove();
	      }, j = 0; j < frames.length; j++) {
	        try {
	          if (f instanceof frames[j].Object) {
	            b(frames[j]).one("unload", i);break;
	          }
	        } catch (k) {}
	      }b(a.node).on(d.types.start, "[i=title]", function (b) {
	        a.follow || (a.focus(), d.create(a.node, b));
	      });
	    }, c.get = function (a) {
	      if (a && a.frameElement) {
	        var b,
	            d = a.frameElement,
	            e = c.list;for (var f in e) {
	          if (b = e[f], b.node.getElementsByTagName("iframe")[0] === d) return b;
	        }
	      } else if (a) return c.list[a];
	    }, c;
	  });"object" == ( false ? "undefined" : _typeof(module)) && module.exports ? module.exports = a("dialog-plus") : window.dialog = a("dialog-plus");
	}();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(getTarget) {'use strict';

	//加载等待提示，pcWaiting.show()、waiting.remove(),电脑端等待，没有提示文字,arg=global：全遮罩

	function Waiting(container) {
	    this.init(container);
	    return this;
	};

	Waiting.prototype.init = function (container) {
	    var container = getTarget(container) || document.body;
	    var box = container.querySelector('.PCwaiting');
	    if (!box) {
	        var div = document.createElement('div');
	        div.className = 'PCwaiting local';
	        box = div;
	        if (!container) {
	            div.style.position = 'fixed';
	        }
	        var style = document.createElement('style');
	        style.innerHTML = ".PCwaiting{position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.5);z-index:8888}.PCwaiting.local{left:50%;top:36%;width:50px;height:48px;margin-left:-25px;border-radius:3px;}.PCwaiting:after {content: ''; position: absolute; top: 50%; left: 50%; width: 3px; height: 3px; margin-top: -2px; margin-left: -2px; text-align: center; -webkit-border-radius: 100%; border-radius: 100%; box-shadow:0 0 3px; -webkit-transition: all, 0.3s, linear; transition: all, 0.3s, linear; -webkit-animation: am-wait 1.2s linear infinite; animation: am-wait 1.2s linear infinite;box-shadow:0 -10px 0 1px #eee, 10px 0px #eee, 0 10px #eee, -10px 0 #eee, -7px -7px 0 0.5px #eee, 7px -7px 0 0.5px #eee, 7px 7px #eee, -7px 7px #eee }@-webkit-keyframes am-wait {100% {-webkit-transform: rotate(1turn);transform: rotate(1turn);}}@keyframes am-wait {100% {-webkit-transform: rotate(1turn);transform: rotate(1turn);}";
	        box.appendChild(style);
	        // container.appendChild(w);
	    }
	    this.waitingContainer = container;
	    this.waitingBox = box;
	};
	Waiting.prototype.show = function () {
	    this.waitingContainer.appendChild(this.waitingBox);
	    return this;
	};
	Waiting.prototype.hide = function () {
	    this.waitingBox.style.display = 'none';
	    return this;
	};
	Waiting.prototype.remove = function () {
	    this.waitingContainer.removeChild(this.waitingBox);
	};

	module.exports = {
	    show: function show(container) {
	        return new Waiting(container).show();
	    },
	    hide: function hide() {
	        return new Waiting().hide();
	    }
	};

	// var obj1= {
	//     _getDiv(target) {
	//         var obj = getTarget(target) || document.body;

	//         var w = obj.querySelector('.PCwaiting');
	//         if (!w) {
	//             var div = document.createElement('div');
	//             div.className = 'PCwaiting local';
	//             w = div;
	//             if (!target) {
	//                 div.style.position = 'fixed';
	//             }
	//             var style = document.createElement('style');
	//             style.innerHTML = ".PCwaiting{position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.5);z-index:8888}.PCwaiting.local{left:50%;top:36%;width:50px;height:48px;margin-left:-25px;border-radius:3px;}.PCwaiting:after {content: ''; position: absolute; top: 50%; left: 50%; width: 3px; height: 3px; margin-top: -2px; margin-left: -2px; text-align: center; -webkit-border-radius: 100%; border-radius: 100%; box-shadow:0 0 3px; -webkit-transition: all, 0.3s, linear; transition: all, 0.3s, linear; -webkit-animation: am-wait 1.2s linear infinite; animation: am-wait 1.2s linear infinite;box-shadow:0 -10px 0 1px #eee, 10px 0px #eee, 0 10px #eee, -10px 0 #eee, -7px -7px 0 0.5px #eee, 7px -7px 0 0.5px #eee, 7px 7px #eee, -7px 7px #eee }@-webkit-keyframes am-wait {100% {-webkit-transform: rotate(1turn);transform: rotate(1turn);}}@keyframes am-wait {100% {-webkit-transform: rotate(1turn);transform: rotate(1turn);}";
	//             w.appendChild(style);
	//             obj.appendChild(w);
	//         }
	//         return w;
	//     },
	//     show(target) {
	//         this._getDiv(target).style.display = 'block';
	//     },
	//     hide(target) {
	//         this._getDiv(target).style.display = 'none';
	//     },
	//     remove(target) {
	//         document.body.removeChild(this._getDiv());
	//     }
	// };
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports) {

	'use strict';

	// var $=require('jquery');

	module.exports = function () {
	    $('.tab-switcher-horizontal').children('.title').children('.item').on('click', function () {
	        var $this = $(this),
	            index = $this.index();
	        $this.addClass('on').siblings('.item').removeClass('on').closest('.tab-switcher-horizontal').children('.content').children('.item').eq(index).addClass('on').siblings('.item').removeClass('on');
	    });
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(getTarget) {'use strict';

	//顶部提示框

	function showTipsOnTop(content, target, time) {
	    var div = document.createElement('div'),
	        tar = '';
	    var cssText = 'position:absolute;left:25%;right:25%;top:0;padding:4px 30px;border:1px solid #ffd0c0;text-align:center;background:#fff6f3;color:#fb6362;line-height:2;z-index:5;';
	    div.innerHTML = content || '小提示';
	    div.classList.add('tips-top');
	    div.style.cssText = cssText;

	    tar = getTarget(target) || document.body;
	    tar.insertBefore(div, tar.firstChild);

	    var t = parseInt(time);
	    if (t) {
	        setTimeout(function () {
	            tar.removeChild(div);
	        }, t);
	    }
	}
	module.exports = showTipsOnTop;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(getTarget) {'use strict';

	var Spinner = __webpack_require__(8);

	var spinOpts = {
	    defaultOpt: {
	        lines: 10 // The number of lines to draw

	        , length: 3 // The length of each line

	        , width: 2 // The line thickness

	        , radius: 3 // The radius of the inner circle

	        , scale: 1 // Scales overall size of the spinner

	        , corners: 1 // Corner roundness (0..1)

	        , color: '#333' // #rgb or #rrggbb or array of colors

	        , opacity: 0.25 // Opacity of the lines

	        , rotate: 0 // The rotation offset

	        , direction: 1 // 1: clockwise, -1: counterclockwise

	        , speed: 1 // Rounds per second

	        , trail: 50 // Afterglow percentage

	        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS

	        , zIndex: 2e9 // The z-index (defaults to 2000000000)

	        , className: 'spinner' // The CSS class to assign to the spinner

	        , top: '50%' // Top position relative to parent

	        , left: '50%' // Left position relative to parent

	        , shadow: false // Whether to render a shadow

	        , hwaccel: false // Whether to use hardware acceleration

	        , position: 'absolute' // Element positioning
	    },
	    _getLoadMore: function _getLoadMore() {},
	    loadMore: function loadMore() {
	        var o = Object.create(this.defaultOpt);
	        o.className = 'spinner-loadmore';
	        return o;
	    }
	};

	function SPIN(target, spinType) {
	    if (typeof Spinner !== 'function') {
	        console.warn('需要引入spin.js哦');
	        return;
	    }
	    this.init(target, spinType);
	}
	SPIN.prototype.init = function (target, spinType) {
	    this.target = getTarget(target);
	    if (!this.target) {
	        return;
	    }
	    this.spinOpt = spinType ? spinOpts[spinType]() : spinOpts.defaultOpt;
	    this.target.classList.add(this.spinOpt.className);
	    this.spinner = new Spinner(this.spinOpt).spin(this.target);
	};
	SPIN.prototype.stop = function () {
	    if (!this.target) {
	        return;
	    }
	    this.target.classList.remove(this.spinOpt.className);
	    this.spinner.stop();
	};

	module.exports = SPIN;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	// http://spin.js.org/#v2.3.2
	!function (a, b) {
	  "object" == ( false ? "undefined" : _typeof(module)) && module.exports ? module.exports = b() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (b), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : a.Spinner = b();
	}(undefined, function () {
	  "use strict";
	  function a(a, b) {
	    var c,
	        d = document.createElement(a || "div");for (c in b) {
	      d[c] = b[c];
	    }return d;
	  }function b(a) {
	    for (var b = 1, c = arguments.length; c > b; b++) {
	      a.appendChild(arguments[b]);
	    }return a;
	  }function c(a, b, c, d) {
	    var e = ["opacity", b, ~ ~(100 * a), c, d].join("-"),
	        f = .01 + c / d * 100,
	        g = Math.max(1 - (1 - a) / b * (100 - f), a),
	        h = j.substring(0, j.indexOf("Animation")).toLowerCase(),
	        i = h && "-" + h + "-" || "";return m[e] || (k.insertRule("@" + i + "keyframes " + e + "{0%{opacity:" + g + "}" + f + "%{opacity:" + a + "}" + (f + .01) + "%{opacity:1}" + (f + b) % 100 + "%{opacity:" + a + "}100%{opacity:" + g + "}}", k.cssRules.length), m[e] = 1), e;
	  }function d(a, b) {
	    var c,
	        d,
	        e = a.style;if (b = b.charAt(0).toUpperCase() + b.slice(1), void 0 !== e[b]) return b;for (d = 0; d < l.length; d++) {
	      if (c = l[d] + b, void 0 !== e[c]) return c;
	    }
	  }function e(a, b) {
	    for (var c in b) {
	      a.style[d(a, c) || c] = b[c];
	    }return a;
	  }function f(a) {
	    for (var b = 1; b < arguments.length; b++) {
	      var c = arguments[b];for (var d in c) {
	        void 0 === a[d] && (a[d] = c[d]);
	      }
	    }return a;
	  }function g(a, b) {
	    return "string" == typeof a ? a : a[b % a.length];
	  }function h(a) {
	    this.opts = f(a || {}, h.defaults, n);
	  }function i() {
	    function c(b, c) {
	      return a("<" + b + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', c);
	    }k.addRule(".spin-vml", "behavior:url(#default#VML)"), h.prototype.lines = function (a, d) {
	      function f() {
	        return e(c("group", { coordsize: k + " " + k, coordorigin: -j + " " + -j }), { width: k, height: k });
	      }function h(a, h, i) {
	        b(m, b(e(f(), { rotation: 360 / d.lines * a + "deg", left: ~ ~h }), b(e(c("roundrect", { arcsize: d.corners }), { width: j, height: d.scale * d.width, left: d.scale * d.radius, top: -d.scale * d.width >> 1, filter: i }), c("fill", { color: g(d.color, a), opacity: d.opacity }), c("stroke", { opacity: 0 }))));
	      }var i,
	          j = d.scale * (d.length + d.width),
	          k = 2 * d.scale * j,
	          l = -(d.width + d.length) * d.scale * 2 + "px",
	          m = e(f(), { position: "absolute", top: l, left: l });if (d.shadow) for (i = 1; i <= d.lines; i++) {
	        h(i, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
	      }for (i = 1; i <= d.lines; i++) {
	        h(i);
	      }return b(a, m);
	    }, h.prototype.opacity = function (a, b, c, d) {
	      var e = a.firstChild;d = d.shadow && d.lines || 0, e && b + d < e.childNodes.length && (e = e.childNodes[b + d], e = e && e.firstChild, e = e && e.firstChild, e && (e.opacity = c));
	    };
	  }var j,
	      k,
	      l = ["webkit", "Moz", "ms", "O"],
	      m = {},
	      n = { lines: 12, length: 7, width: 5, radius: 10, scale: 1, corners: 1, color: "#000", opacity: .25, rotate: 0, direction: 1, speed: 1, trail: 100, fps: 20, zIndex: 2e9, className: "spinner", top: "50%", left: "50%", shadow: !1, hwaccel: !1, position: "absolute" };if (h.defaults = {}, f(h.prototype, { spin: function spin(b) {
	      this.stop();var c = this,
	          d = c.opts,
	          f = c.el = a(null, { className: d.className });if (e(f, { position: d.position, width: 0, zIndex: d.zIndex, left: d.left, top: d.top }), b && b.insertBefore(f, b.firstChild || null), f.setAttribute("role", "progressbar"), c.lines(f, c.opts), !j) {
	        var g,
	            h = 0,
	            i = (d.lines - 1) * (1 - d.direction) / 2,
	            k = d.fps,
	            l = k / d.speed,
	            m = (1 - d.opacity) / (l * d.trail / 100),
	            n = l / d.lines;!function o() {
	          h++;for (var a = 0; a < d.lines; a++) {
	            g = Math.max(1 - (h + (d.lines - a) * n) % l * m, d.opacity), c.opacity(f, a * d.direction + i, g, d);
	          }c.timeout = c.el && setTimeout(o, ~ ~(1e3 / k));
	        }();
	      }return c;
	    }, stop: function stop() {
	      var a = this.el;return a && (clearTimeout(this.timeout), a.parentNode && a.parentNode.removeChild(a), this.el = void 0), this;
	    }, lines: function lines(d, f) {
	      function h(b, c) {
	        return e(a(), { position: "absolute", width: f.scale * (f.length + f.width) + "px", height: f.scale * f.width + "px", background: b, boxShadow: c, transformOrigin: "left", transform: "rotate(" + ~ ~(360 / f.lines * k + f.rotate) + "deg) translate(" + f.scale * f.radius + "px,0)", borderRadius: (f.corners * f.scale * f.width >> 1) + "px" });
	      }for (var i, k = 0, l = (f.lines - 1) * (1 - f.direction) / 2; k < f.lines; k++) {
	        i = e(a(), { position: "absolute", top: 1 + ~(f.scale * f.width / 2) + "px", transform: f.hwaccel ? "translate3d(0,0,0)" : "", opacity: f.opacity, animation: j && c(f.opacity, f.trail, l + k * f.direction, f.lines) + " " + 1 / f.speed + "s linear infinite" }), f.shadow && b(i, e(h("#000", "0 0 4px #000"), { top: "2px" })), b(d, b(i, h(g(f.color, k), "0 0 1px rgba(0,0,0,.1)")));
	      }return d;
	    }, opacity: function opacity(a, b, c) {
	      b < a.childNodes.length && (a.childNodes[b].style.opacity = c);
	    } }), "undefined" != typeof document) {
	    k = function () {
	      var c = a("style", { type: "text/css" });return b(document.getElementsByTagName("head")[0], c), c.sheet || c.styleSheet;
	    }();var o = e(a("group"), { behavior: "url(#default#VML)" });!d(o, "transform") && o.adj ? i() : j = d(o, "animation");
	  }return h;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var typeOf = __webpack_require__(10);

	module.exports = function () {
		var content = arguments.length <= 0 || arguments[0] === undefined ? '操作成功' : arguments[0];
		var state = arguments.length <= 1 || arguments[1] === undefined ? 'ok' : arguments[1];
		var callback = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
		var time = arguments.length <= 3 || arguments[3] === undefined ? 3000 : arguments[3];

		var box = document.createElement('div');
		var styleBox = 'position: fixed;top: 36%;left: 50%;min-width:150px;padding: 1em 2em;border: 1px solid;line-height: 1;text-align: center;color: #1fb5ac;background: #fff;-webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px;z-index: 10;-webkit-transform: translate(-50%,-50%);transform: translate(-50%,-50%);';
		box.style.cssText = styleBox;
		box.classList.add('tips-state');

		var icon = document.createElement('i');
		var styleIcon = 'display: inline-block;width: 28px;margin-top: 4px;margin-bottom: 10px;border: 1px solid;font-size: 24px;line-height: 26px;-webkit-border-radius: 100%;border-radius: 100%;';
		icon.innerHTML = '&#x2713';
		icon.style.cssText = styleIcon;
		if (state === 'false' || state === 'cancel' || state === 'error') {
			box.style.color = '#fb6363';
			icon.innerHTML = '!';
		}
		box.appendChild(icon);
		var contentWrapper = document.createElement('p');
		contentWrapper.innerHTML = content;
		box.appendChild(contentWrapper);

		document.body.appendChild(box);

		var _close = function _close() {
			document.body.removeChild(box);
		};

		setTimeout(function () {
			_close();
			typeOf.isFunction(callback) && callback();
		}, time);
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(getType) {'use strict';

	module.exports = {
		isFunction: function isFunction(obj) {
			return getType(obj) === 'function';
		},
		isString: function isString(obj) {
			return getType(obj) === 'string';
		},
		isArray: function isArray(obj) {
			return Array.isArray ? Array.isArray(obj) : getType(obj) === 'array';
		}
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	/*获取目标类型方法*/

	module.exports = function (target) {
	    try {
	        return Object.prototype.toString.call(target).match(/object\s*(\w*)/)[1].toLowerCase();
	    } catch (e) {
	        console.wran(e);
	    }
	};

/***/ }
/******/ ]);