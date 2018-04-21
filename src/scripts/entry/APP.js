// import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from 'config/routerMap.js';
var Vuex = require('vuex');

//Vue 过滤器合集
require('modules/production/vueFilter.js');
require('modules/production/fixContentTitle.js')();

//右上顶通，菜单，页尾
import eHome from 'vues/elements/eHome.vue'; //首页
import eHeader from 'vues/elements/eHeader.vue'; //页头、包含了菜单
import eLogin from 'vues/elements/eLogin.vue'; //


import datePicker from 'vues/components/datePicker.vue'; //时间选择
Vue.component('datePicker', datePicker);

const store = new Vuex.Store({
  state: {
    arrAddedGoods: [],
    currentRoute: {}
  },
  mutations: {}
});

let router = new VueRouter({
  routes,
  // hashbang: false,
  // history: false,
  // saveScrollPosition: true,
  // transitionOnLoad: true
});

//更新 页面 title方法
var PAGETITLESUFFIX = '-慧聪云商';
if (!document.title) {
  document.title = '慧聪云商';
}
router.afterEach((
  to,
  from
) => {
  store.state.currentRoute = router.currentRoute;
  // if (to.meta && to.meta.title) {
  //   document.title = to.meta.title + PAGETITLESUFFIX;
  // } else {
  //   document.title += PAGETITLESUFFIX;
  // }
});

//ok
const APP = new Vue({
  router,
  store,
  el: '#app',
  components: {
    eHome,
    eHeader,
    eLogin,
  }
});