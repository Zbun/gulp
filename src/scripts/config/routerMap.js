/**
 * 路由表
 * 请使用配置好的pages目录：pages
 * 路由名区分大小写，请注意
 */


let routerB = [
  { //基础配置路由
    path: '/building',
    name: 'building',
    meta: {
      title: '功能建设中',
    },
    component(resolve) {
      require(['@pages/building.vue'], resolve);
    }
  },
  // {
  //   path: '/login',
  //   name: 'login',
  //   meta: {
  //     title: '登录',
  //   },
  //   component(resolve) {
  //     require(['@vues/elements/eLogin.vue'], resolve);
  //   }
  // },

];

export default routerB;