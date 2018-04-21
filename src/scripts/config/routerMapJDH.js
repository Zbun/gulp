/**
 * 家电汇分路由
 */
export default [{
  path: '/JDH/goods/categoryManage',
  name: 'JDHgoodsCategoryManage',
  meta: {
    title: '商品管理',
  },
  component(resolve) {
    require(['pages/JDH/goods/categoryManage.vue'], resolve);
  }
}];