
/**react部分配置，实现热替换 */
import { hot } from 'react-hot-loader/root';
const App = () => <div>Hello World!</div>;
export default hot(App);
import '@scripts/SPA/myComponent.js';
/**react配置结束  */

/**vue配置 */
// import VueRouter from 'vue-router';
// import routes from 'config/routerMap.js';
// var Vuex = require('vuex');

// //Vue 过滤器合集
// require('modules/production/vueFilter.js');
// const store = new Vuex.Store({
//   state: {
//     // arrAddedGoods: [],
//     // currentRoute: {},
//   },
//   mutations: {}
// });

// let router = new VueRouter({
//   routes,
// });

// //更新 页面 title方法
// var PAGETITLESUFFIX = '-';
// if (!document.title) {
//   document.title = '';
// }
// router.afterEach((
//   to,
//   from
// ) => {
//   if (to.meta && to.meta.title) {
//     document.title = to.meta.title + PAGETITLESUFFIX;
//   } else {
//     document.title += PAGETITLESUFFIX;
//   }
// });

// //ok

// const APP = new Vue({
//   router,
//   store,
//   el: '#app',
//   components: {}
// });