/**
 * 家电汇分路由
 */
export default [{
    path: '/JDH/goodsOperation/SaleActivity',
    name: 'JDHSaleActivity',
    meta: {
      title: '分销活动管理',
    },
    component(resolve) {
      require(['pages/JDH/goodsOperation/SaleActivity.vue'], resolve);
    }
  },
  {
    path: '/JDH/goodsOperation/SaleActivityEdit',
    name: 'JDHSaleActivityEdit',
    meta: {
      title: '分销活动管理编辑',
    },
    component(resolve) {
      require(['pages/JDH/goodsOperation/SaleActivityEdit.vue'], resolve);
    }
  },
  {
    path: '/JDH/goodsOperation/SaleActivityGoodsManage',
    name: 'JDHSaleActivityGoodsManage',
    meta: {
      title: '分销活动商品管理',
    },
    component(resolve) {
      require(['pages/JDH/goodsOperation/SaleActivityGoodsManage.vue'], resolve);
    }
  },
  {
    path: '/JDH/shopOperation/shopBeautify',
    name: 'JDHshopBeautify',
    meta: {
      title: '店铺装修',
    },
    component(resolve) {
      require(['pages/JDH/shopOperation/shopBeautify.vue'], resolve);
    }
  },
  {
    path: '/JDH/shopOperation/shopTopList',
    name: 'JDHshopTopList',
    meta: {
      title: '店铺头条列表',
    },
    component(resolve) {
      require(['pages/JDH/shopOperation/shopTopList.vue'], resolve);
    }
  },
  {
    path: '/JDH/shopOperation/shopTopEdit',
    name: 'JDHshopTopEdit',
    meta: {
      title: '店铺头条编辑',
    },
    component(resolve) {
      require(['pages/JDH/shopOperation/shopTopEdit.vue'], resolve);
    }
  },
  {
    path: '/JDH/shopOperation/shopProgramaList',
    name: 'JDHshopProgramaList',
    meta: {
      title: '店铺头条栏目管理',
    },
    component(resolve) {
      require(['pages/JDH/shopOperation/shopProgramaList.vue'], resolve);
    }
  },
  //家电汇-营销活动
  {
    path: '/JDH/yxActivity/shopPoster',
    name: 'shopPoster',
    meta: {
      title: '店铺海报',
    },
    component(resolve) {
      require(['pages/JDH/yxActivity/shopPoster.vue'], resolve);
    }
  },
  {
    path: '/JDH/yxActivity/shopPosterEdit',
    name: 'shopPosterEdit',
    meta: {
      title: '店铺海报编辑',
    },
    component(resolve) {
      require(['pages/JDH/yxActivity/shopPosterEdit.vue'], resolve);
    }
  },
  {
    path: '/JDH/yxActivity/itemPoster',
    name: 'itemPoster',
    meta: {
      title: '单品海报',
    },
    component(resolve) {
      require(['pages/JDH/yxActivity/itemPoster.vue'], resolve);
    }
  },
  {
    path: '/JDH/yxActivity/itemPosterEdit',
    name: 'itemPosterEdit',
    meta: {
      title: '单品海报编辑',
    },
    component(resolve) {
      require(['pages/JDH/yxActivity/itemPosterEdit.vue'], resolve);
    }
  },
  {
    path: '/JDH/yxActivity/topicTemplete',
    name: 'topicTemplete',
    meta: {
      title: '专题页模板',
    },
    component(resolve) {
      require(['pages/JDH/yxActivity/topicTemplete.vue'], resolve);
    }
  },
  {
    path: '/JDH/yxActivity/topicTempleteEdit',
    name: 'topicTempleteEdit',
    meta: {
      title: '专题页模板编辑',
    },
    component(resolve) {
      require(['pages/JDH/yxActivity/topicTempleteEdit.vue'], resolve);
    }
  },
];