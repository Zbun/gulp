/**
 * 路由表
 * 请使用配置好的views目录：view
 * 路由名区分大小写，请注意
 */

export default [{
    path: '/',
    name: 'default',
    meta: {
      title: '首页',
    },
    component(resolve) {
      require(['commonVues/elements/eHome.vue'], resolve);
    }
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
    },
    component(resolve) {
      require(['commonVues/elements/eLogin.vue'], resolve);
    }
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页',
    },
    component(resolve) {
      require(['commonVues/elements/eHome.vue'], resolve);
    }
  },
  {
    path: '/orderIn',
    name: 'orderIn',
    meta: {
      title: '开单',
    },
    query: {
      categoryId: '', //分类
      name: '', //商品名
    },
    component(resolve) {
      require(['views/orderIn.vue'], resolve);
    }
  }, {
    path: '/orderList',
    name: 'orderList',
    meta: {
      title: '开单记录',
    },
    component(resolve) {
      require(['views/orderList.vue'], resolve);
    }
  }, {
    path: '/orderDetail/:code',
    name: 'orderDetail',
    meta: {
      title: '订单详情',
    },
    component(resolve) {
      require(['views/orderDetail.vue'], resolve);
    }
  },
  {
    path: '/addGoods',
    name: 'addGoods',
    meta: {
      title: '选择商品',
    },
    component(resolve) {
      require(['views/addGoods.vue'], resolve);
    }
  }, {
    path: '/searchGoods',
    name: 'searchGoods',
    query: {
      to: '', //确定后转向页面路由key
    },
    meta: {
      title: '搜索',
    },
    component(resolve) {
      require(['views/searchGoods.vue'], resolve);
    }
  }, {
    path: '/userInfo',
    name: 'userInfo',
    meta: {
      title: '店员',
    },
    component(resolve) {
      require(['views/userInfo.vue'], resolve);
    }
  }, {
    path: '/rewardRecord',
    name: 'rewardRecord',
    meta: {
      title: '奖励',
    },
    component(resolve) {
      require(['views/rewardRecord.vue'], resolve);
    }
  }, {
    path: '/stock',
    name: 'stock',
    meta: {
      title: '库存',
    },
    component(resolve) {
      require(['views/stock.vue'], resolve);
    }
  },
  {
    path: '/qrCode/:code',
    name: 'qrCode',
    meta: {
      title: '向商家付款',
    },
    component(resolve) {
      require(['views/qrCode.vue'], resolve);
    }
  },
];