require('commonScripts/tabswitcher.js');
// import Vue from 'vue';
import VueRouter from 'vue-router';
import routerMap from 'config/routerMap.js';
import Vuex from 'vuex';
//通用全选功能
import 'commonScripts/checkAll.js';
require('modules/production/fixContentTitle.js')();

//Vue 过滤器合集
import 'modules/production/vueFilter.js';

//右上顶通，菜单，页尾
import eHeader from 'vues/eHeader.vue';
import eMenu from 'vues/eMenu.vue';
import eFooter from 'vues/eFooter.vue';

const store = new Vuex.Store({
  state: {
    count: 0,
    userName: localStorage.userName || '',
    companyName: localStorage.companyName || '',
    isShowMenu: false,
    menu: [],
    isAdmin: false,
    action: []
  },
  mutations: {
    // increment(state) {
    //   state.count++;
    // }
  }
});


//路由开始
Vue.use(VueRouter);
//Vue.use(VueResource);

let router = new VueRouter({
  hashbang: true,
  history: false,
  saveScrollPosition: true,
  transitionOnLoad: true
});

let App = Vue.extend({
  components: {
    eMenu,
    eHeader,
    eFooter
  },
  store
});

routerMap(router);
router.start(App, 'body');

// router.beforeEach(({
//   to,
//   next
// }) => {
//   // console.log(to)
//   window.localStorage.hashFrom=to.name;
//   if (0 == window.performance.navigation.type) {
//     console.log(to);
//     return;
//   } else {
//     router.go({
//       name: to.name
//     });

//   }
//   next();
// });
