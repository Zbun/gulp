// import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from 'config/routerMap.js';
var Vuex = require('vuex');

//Vue 过滤器合集
require('modules/production/vueFilter.js');
const store = new Vuex.Store({
  state: {
    // arrAddedGoods: [],
    // currentRoute: {},
  },
  mutations: {}
});

let router = new VueRouter({
  routes,

});

//更新 页面 title方法
var PAGETITLESUFFIX = '-';
if (!document.title) {
  document.title = '';
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
  components: {}
});