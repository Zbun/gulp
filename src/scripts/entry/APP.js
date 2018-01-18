// import Vue from 'vue';
import VueRouter from 'vue-router';
// import routes from 'config/routerMap.js';
var Vuex = require('vuex');
// var FastClick = require('fastclick');
// FastClick.attach(document.body);


//Vue 过滤器合集
require('modules/production/vueFilter.js');

//右上顶通，菜单，页尾
// import eLogin from 'vues/elements/eLogin.vue'; //登录
// import eHome from 'vues/elements/eHome.vue'; //首页

const store = new Vuex.Store({
  state: {
    arrAddedGoods: [],
  },
  mutations: {}
});


let router = new VueRouter({
  routes,
  hashbang: false,
  history: false,
  saveScrollPosition: true,
  transitionOnLoad: true
});

//更新 页面 title方法
var PAGETITLESUFFIX = '-智选云商';
router.afterEach((
  to,
  from
) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title + PAGETITLESUFFIX;
  } else {
    document.title += PAGETITLESUFFIX;
  }
});

//ok
const APP = new Vue({
  // router,
  store,
  components: {
    eLogin,

  }
}).$mount('#content-box');