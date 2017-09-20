require('commonScripts/tabswitcher.js');
// import Vue from 'vue';
import VueRouter from 'vue-router';
import routerMap from 'config/routerMap.js';
var Vuex = require('vuex');
//通用全选功能
import 'commonScripts/checkAll.js';
require('modules/production/fixContentTitle.js')();

//Vue 过滤器合集
import 'modules/production/vueFilter.js';

//右上顶通，菜单，页尾
import eHeader from 'vues/elements/eHeader.vue';
import tabBar from 'vues/elements/tabBar.vue'; //选项卡条
import eMenu from 'vues/elements/eMenu.vue';
import eFooter from 'vues/elements/eFooter.vue';
import eCorner from 'vues/elements/eCorner.vue'; //右下角标
import eLogin from 'vues/elements/eLogin.vue'; //登录
import eHome from 'vues/elements/eHome.vue'; //登录

const store = new Vuex.Store({
  state: {
    count: 0,
    userName: localStorage.userName || '',
    companyName: localStorage.companyName || '',
    isShowMenu: false,
    menu: [],
    isAdmin: false,
    action: [],
    currentSubject: {}, //用户点选的当前会计科目
    spreadSubjectIds: [], //记录已经展开的会计科目节点
    currentCategory: {}, //商品类别管理 当前类别
    spreadCategoryIds: [], //商品类别管理 已展开节点
    cuCategory: {}, //商品列表 当前类别
    arrTabBar: [{
      Id: 'home',
      Name: '首页',
      On: 1
    }],
    spreadGoodsListIds: [], //商品列表 已展开的节点
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
  hashbang: false,
  history: false,
  saveScrollPosition: true,
  transitionOnLoad: true
});

let App = Vue.extend({
  components: {
    eMenu,
    eHeader,
    tabBar,
    eFooter,
    eCorner,
    eLogin,
    eHome,
  },
  store
});

routerMap(router);
router.start(App, 'body');