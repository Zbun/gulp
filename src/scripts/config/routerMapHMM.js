/**
 * 慧买卖分路由
 */
export default [

  {
    path: '/apply/:step',
    name: 'allpyCheck',
    meta: {
      title: '申请入驻',
    },
    component(resolve) {
      require(['commonVues/elements/applycheck/eApply.vue'], resolve);
    }
  },
  {
    path: '/memberReg/:step',
    name: 'memberReg',
    meta: {
      title: '会员注册',
    },
    component(resolve) {
      require(['commonVues/elements/memberReg/memberReg.vue'], resolve);
    }
  },
  {
    path: '/personReg/:step',
    name: 'personReg',
    meta: {
      title: '个人注册',
    },
    component(resolve) {
      require(['commonVues/elements/personReg/personReg.vue'], resolve);
    }
  },
  {
    path: '/findPwd',
    name: 'findPwd',
    meta: {
      title: '找回密码',
    },
    component(resolve) {
      require(['commonVues/elements/findPwd.vue'], resolve);
    }
  },
  {
    path: '/changePwd',
    name: 'changePwd',
    meta: {
      title: '修改密码',
    },
    component(resolve) {
      require(['commonVues/elements/changePwd.vue'], resolve);
    }
  },
  //商品管理组
  {
    path: '/HMM/goods/publish',
    name: 'HMMgoodsPublish',
    meta: {
      title: '商品发布',
    },
    component(resolve) {
      require(['pages/HMM/goods/publish.vue'], resolve);
    }
  }, {
    path: '/HMM/goods/goodsEdit/:id',
    name: 'HMMgoodsEdit',
    meta: {
      title: '商品编辑',
    },
    component(resolve) {
      require(['pages/HMM/goods/goodsEdit.vue'], resolve);
    }
  }, {
    path: '/HMM/goods/goodsList',
    name: 'HMMgoodsList',
    meta: {
      title: '商品列表',
    },
    component(resolve) {
      require(['pages/HMM/goods/goodsList.vue'], resolve);
    }
  },
  {
    path: '/HMM/goods/giftList',
    name: 'HMMgiftList',
    meta: {
      title: '赠品列表',
    },
    query: {
      categoryId: '', //可能存在分类Id,用作编辑商品时返回保持状态
    },
    component(resolve) {
      require(['pages/HMM/goods/giftManage/giftList.vue'], resolve);
    }
  },
  {
    path: '/HMM/goods/giftCategory',
    name: 'HMMgiftCategory',
    meta: {
      title: '赠品分类管理',
    },
    component(resolve) {
      require(['pages/HMM/goods/giftManage/giftCategory.vue'], resolve);
    }
  },
  {
    path: '/HMM/goods/giftEdit/:categoryId', //分类Id
    name: 'HMMgiftEdit',
    meta: {
      title: '赠品编辑',
    },
    query: {
      pathName: '', //分类路径
      id: '', //商品Id,
    },
    component(resolve) {
      require(['pages/HMM/goods/giftManage/giftEdit.vue'], resolve);
    }
  },

  //交易管理组
  {
    path: '/HMM/deal/orderManage',
    name: 'HMMorderManage',
    meta: {
      title: '订单管理',
    },
    component(resolve) {
      require(['pages/HMM/deal/orderManage.vue'], resolve);
    }
  }, {
    path: '/HMM/deal/orderDetail/:code',
    name: 'HMMorderDetail',
    meta: {
      title: '订单详情',
    },
    component(resolve) {
      require(['pages/HMM/deal/orderDetail.vue'], resolve);
    }
  },
  {
    path: '/HMM/deal/afterSaleOrder',
    name: 'HMMafterSaleOrder',
    meta: {
      title: '售后单管理',
    },
    component(resolve) {
      require(['pages/HMM/deal/afterSaleOrder.vue'], resolve);
    }
  },
  {
    path: '/HMM/deal/afterSaleOrderDetail/:code',
    name: 'HMMafterSaleOrderDetail',
    meta: {
      title: '售后单详情',
    },
    component(resolve) {
      require(['pages/HMM/deal/afterSaleOrderDetail.vue'], resolve);
    }
  },

  {
    path: '/HMM/deal/settlementManage',
    name: 'HMMsettlementManage',
    meta: {
      title: '交易结算管理',
    },
    component(resolve) {
      require(['pages/HMM/deal/settlementManage.vue'], resolve);
    }
  },

  //商铺管理组
  {
    path: '/HMM/shop/category',
    name: 'HMMshopCategory',
    meta: {
      title: '商铺分类',
    },
    component(resolve) {
      require(['pages/HMM/shop/category.vue'], resolve);
    }
  }, {
    path: '/HMM/shop/Decorate',
    name: 'HMMshopDecorate',
    meta: {
      title: '商铺装修',
    },
    component(resolve) {
      require(['pages/HMM/shop/Decorate.vue'], resolve);
    }
  },


  //营销中心组
  {
    path: '/HMM/yingxiao/activityApply',
    name: 'HMMactivityApply',
    meta: {
      title: '活动申报',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/activityApply.vue'], resolve);
    }
  }, {
    path: '/HMM/yingxiao/huishanpi',
    name: 'HMMhuishanpi',
    meta: {
      title: '慧闪购',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/huishanpi.vue'], resolve);
    }
  }, {
    path: '/HMM/yingxiao/huishanpiCheck/:id',
    name: 'HMMhuishanpiCheck',
    meta: {
      title: '慧闪购查看',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/huishanpiCheck.vue'], resolve);
    }
  }, {
    path: '/HMM/yingxiao/yanxuan',
    name: 'HMMyanxuan',
    meta: {
      title: '严选申请',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/yanxuan.vue'], resolve);
    }
  }, {
    path: '/HMM/yingxiao/yanxuanCheck/:id',
    name: 'HMMyanxuanCheck',
    meta: {
      title: '严选查看',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/yanxuanCheck.vue'], resolve);
    }
  },
  {
    path: '/HMM/yingxiao/myactivity',
    name: 'HMMmyactivity',
    query: {
      type: 1, //1：慧闪购，2：严选，3：众筹集采
    },
    meta: {
      title: '我参加的活动',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/myactivity.vue'], resolve);
    }
  }, {
    path: '/HMM/yingxiao/mjlist',
    name: 'HMMmanjianList',
    query: {

    },
    meta: {
      title: '满减列表',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/manjian/manjianList.vue'], resolve);
    }
  }, {
    path: '/HMM/yingxiao/mjadd',
    name: 'HMMmanjianAdd',
    query: {

    },
    meta: {
      title: '满减新增',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/manjian/manjianAdd.vue'], resolve);
    }
  }, {
    path: '/HMM/yingxiao/mjedit',
    name: 'HMMmanjianEdit',
    query: {

    },
    meta: {
      title: '满减编辑',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/manjian/manjianEdit.vue'], resolve);
    }
  }, {
    path: '/HMM/yingxiao/giftActivity',
    name: 'HMMgiftActivity',
    query: {

    },
    meta: {
      title: '赠品活动',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/gift/giftActivity.vue'], resolve);
    }
  }, {
    path: '/HMM/yingxiao/giftActivityEdit',
    name: 'HMMgiftActivityEdit',
    query: {
      id: '', //商品ID
    },
    meta: {
      title: '赠品活动',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/gift/giftActivityEdit.vue'], resolve);
    }
  }, {
    path: '/HMM/yingxiao/taocanActivity',
    name: 'HMMtaocanActivity',
    query: {

    },
    meta: {
      title: '套餐活动',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/taocan/taocanActivity.vue'], resolve);
    }
  }, {
    path: '/HMM/yingxiao/taocanActivityEdit',
    name: 'HMMtaocanActivityEdit',
    query: {
      id: '', //商品ID
    },
    meta: {
      title: '套餐活动',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/taocan/taocanActivityEdit.vue'], resolve);
    }
  },
];