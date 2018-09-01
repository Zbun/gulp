/**
 * 路由表
 * 请使用配置好的pages目录：pages
 * 路由名区分大小写，请注意
 */

import routerHMM from './routerMapHMM.js'; //慧买卖分路由，
import routerJDH from './routerMapJDH.js'; //家电汇分路由

let routerB = [{ //基础配置路由
    path: '/',
    name: 'default',
    meta: {
      title: '首页',
    },
    component(resolve) {
      require(['commonVues/elements/eHome.vue'], resolve);
    }
  },
  { //基础配置路由
    path: '/building',
    name: 'building',
    meta: {
      title: '功能建设中',
    },
    component(resolve) {
      require(['pages/building.vue'], resolve);
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
  //服务中心组
  {
    path: '/bc/feedback',
    name: 'feedback',
    meta: {
      title: '意见反馈',
    },
    component(resolve) {
      require(['pages/baseConfig/serviceCenter/feedback.vue'], resolve);
    }
  },
  {
    path: '/bc/feedbackDispose',
    name: 'feedbackDispose',
    meta: {
      title: '处理意见反馈'
    },
    component(resolve) {
      require(['pages/baseConfig/serviceCenter/feedbackDispose.vue'], resolve);
    }
  }, {
    path: '/bc/expressManage',
    name: 'expressManage',
    meta: {
      title: '物流管理'
    },
    component(resolve) {
      require(['pages/baseConfig/serviceCenter/expressManage.vue'], resolve);
    }
  },
  {
    path: '/bc/accountBind',
    name: 'accountBind',
    meta: {
      title: '账号绑定管理'
    },
    component(resolve) {
      require(['pages/baseConfig/serviceCenter/accountBind.vue'], resolve);
    }
  },
  //系统配置组
  {
    path: '/bc/ms',
    name: 'menuSet',
    meta: {
      title: '菜单管理',
    },
    component(resolve) {
      require(['pages/baseConfig/system/menuSet.vue'], resolve);
    }
  },
  {
    path: '/bc/departmentList',
    name: 'departmentList',
    meta: {
      title: '部门列表',
    },
    component(resolve) {
      require(['pages/baseConfig/system/departmentList.vue'], resolve);
    }
  },
  {
    path: '/bc/roleList',
    name: 'roleList',
    meta: {
      title: '角色列表',
    },
    component(resolve) {
      require(['pages/baseConfig/system/roleList.vue'], resolve);
    }
  },
  {
    path: '/bc/userList',
    name: 'userList',
    meta: {
      title: '用户列表',
    },
    component(resolve) {
      require(['pages/baseConfig/system/userList.vue'], resolve);
    }
  },
  {
    path: '/bc/msConfig',
    name: '系统配置',
    meta: {
      title: '配置信息',
    },
    component(resolve) {
      require(['pages/baseConfig/system/msConfig.vue'], resolve);
    }
  },
  {
    path: '/bc/payConfig',
    name: '支付配置',
    meta: {
      title: '配置信息',
    },
    component(resolve) {
      require(['pages/baseConfig/system/payConfig.vue'], resolve);
    }
  }, {
    path: '/bc/sensitiveWordList',
    name: '敏感词汇',
    meta: {
      title: '敏感词汇',
    },
    component(resolve) {
      require(['pages/baseConfig/system/sensitiveWordList.vue'], resolve);
    }
  },

  //商品部分
  {
    path: '/bc/goods/category',
    name: 'bcGoodsCategory',
    meta: {
      title: '商品分类',
    },
    component(resolve) {
      require(['pages/baseConfig/goods/category/category.vue'], resolve);
    }
  },
  {
    path: '/bc/goods/brandManage',
    name: 'bcGoodsBrandManage',
    meta: {
      title: '商品品牌',
    },
    component(resolve) {
      require(['pages/baseConfig/goods/brandManage.vue'], resolve);
    }
  }, {
    path: '/bc/goods/labelManage',
    name: 'bcGoodslabelManage',
    meta: {
      title: '商品标签',
    },
    component(resolve) {
      require(['pages/baseConfig/goods/labelManage.vue'], resolve);
    }
  },
  {
    path: '/bc/goods/categoryAttr',
    name: 'bcGoodscategoryAttr',
    meta: {
      title: '分类属性设置',
    },
    component(resolve) {
      require(['pages/baseConfig/goods/categoryAttr.vue'], resolve);
    }
  }, {
    path: '/bc/goods/goodsSKU',
    name: 'bcGoodsSKU',
    meta: {
      title: '商品SKU添加',
    },
    component(resolve) {
      require(['pages/baseConfig/goods/goodsSKUAdd.vue'], resolve);
    }
  }, {
    path: '/bc/goods/goodsSKU/:SpuId',
    name: 'bcGoodsSKUEdit',
    meta: {
      title: '商品SKU编辑',
    },
    component(resolve) {
      require(['pages/baseConfig/goods/goodsSKUEdit.vue'], resolve);
    }
  }, {
    path: '/bc/goods/goodsList',
    name: 'bcGoodsList',
    meta: {
      title: '商品库',
    },
    component(resolve) {
      require(['pages/baseConfig/goods/goodsList.vue'], resolve);
    }
  },

  //用户管理组
  {
    path: '/bc/user/supplierList',
    name: 'bcSupplierList',
    meta: {
      title: '入驻商列表',
    },
    component(resolve) {
      require(['pages/baseConfig/user/supplierList.vue'], resolve);
    }
  },
  {
    path: '/bc/user/supplierInfo/:UserSN',
    name: 'bcSupplierInfo',
    meta: {
      title: '入驻商审核',
    },
    component(resolve) {
      require(['pages/baseConfig/user/supplierInfo.vue'], resolve);
    }
  }, {
    path: '/bc/user/memberList',
    name: 'memberList',
    meta: {
      title: '会员审核',
    },
    component(resolve) {
      require(['pages/baseConfig/user/memberList.vue'], resolve);
    }
  }, {
    path: '/bc/user/memberInfo/:userSn',
    name: 'memberInfo',
    meta: {
      title: '会员审核信息',
    },
    query: {

    },
    component(resolve) {
      require(['pages/baseConfig/user/memberInfo.vue'], resolve);
    }
  },
  {
    path: '/bc/user/hmmSupplierList',
    name: 'hmmSupplierList',
    meta: {
      title: '慧买卖入驻商列表',
    },
    component(resolve) {
      require(['pages/baseConfig/user/hmmSupplierList.vue'], resolve);
    }
  },
  {
    path: '/bc/user/hmmSupplierInfo/:hmmRzsId',
    name: 'hmmSupplierInfo',
    meta: {
      title: '慧买卖入驻商基本资料',
    },
    component(resolve) {
      require(['pages/baseConfig/user/hmmSupplierInfo.vue'], resolve);
    }
  },
  {
    path: '/bc/user/hmmOrderList',
    name: 'hmmOrderList',
    meta: {
      title: '慧买卖入驻商订单列表',
    },
    component(resolve) {
      require(['pages/baseConfig/user/hmmOrderList.vue'], resolve);
    }
  },
  {
    path: '/bc/user/hmmMemberList',
    name: 'hmmMemberList',
    meta: {
      title: '慧买卖会员列表',
    },
    component(resolve) {
      require(['pages/baseConfig/user/hmmMemberList.vue'], resolve);
    }
  },
  {
    path: '/bc/user/hmmMemberInfo/:hmmHyId',
    name: 'hmmMemberInfo',
    meta: {
      title: '慧买卖会员信息',
    },
    component(resolve) {
      require(['pages/baseConfig/user/hmmMemberInfo.vue'], resolve);
    }
  },
  {
    path: '/bc/user/accreditList',
    name: 'accreditList',
    meta: {
      title: '个人授权码',
    },
    component(resolve) {
      require(['pages/baseConfig/user/accreditList.vue'], resolve);
    }
  },
  {
    path: '/bc/user/paymentList',
    name: 'paymentList',
    meta: {
      title: '线下缴费列表',
    },
    component(resolve) {
      require(['pages/baseConfig/user/paymentList.vue'], resolve);
    }
  },
  //平台2.0
  {
    path: '/bc/user/sellerManage',
    name: 'bcSellerManage',
    meta: {
      title: '卖家管理列表',
    },
    component(resolve) {
      require(['pages/baseConfig/user/sellerManage.vue'], resolve);
    }
  },
  {
    path: '/bc/user/sellerManageDetail/:SellerSN/:os',
    name: 'bcSellerManageDetail',
    meta: {
      title: '卖家管理详情',
    },
    component(resolve) {
      require(['pages/baseConfig/user/sellerManageDetail.vue'], resolve);
    }
  },
  {
    path: '/bc/user/memberShopManage',
    name: 'bcmemberShopManage',
    meta: {
      title: '会员店管理列表',
    },
    component(resolve) {
      require(['pages/baseConfig/user/memberShopManage.vue'], resolve);
    }
  },
  {
    path: '/bc/user/memberShopManageDetail/:memberShopSN/:os',
    name: 'bcmemberShopManageDetail',
    meta: {
      title: '会员店管理详情',
    },
    component(resolve) {
      require(['pages/baseConfig/user/memberShopManageDetail.vue'], resolve);
    }
  },
];

export default [...routerHMM, ...routerJDH, ...routerB];