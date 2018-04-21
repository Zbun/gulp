/**
 * 路由表
 * 请使用配置好的pages目录：pages
 * 路由名区分大小写，请注意
 */

import routerHMM from './routerMapHMM.js';
import routerJDH from './routerMapJDH.js';

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
    path: '/bc/feedback',
    name: 'feedback',
    meta: {
      title: '意见反馈',
    },
    component(resolve) {
      require(['pages/baseConfig/feedback.vue'], resolve);
    }
  },
  {
    path: '/bc/feedbackDispose',
    name: 'feedbackDispose',
    meta: {
      title: '处理意见反馈'
    },
    component(resolve) {
      require(['pages/baseConfig/feedbackDispose.vue'], resolve);
    }
  },  
  {
    path: '/bc/ms',
    name: 'menuSet',
    meta: {
      title: '菜单管理',
    },
    component(resolve) {
      require(['pages/baseConfig/menuSet.vue'], resolve);
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
  //商品部分
  {
    path: '/bc/goods/category',
    name: 'bcGoodsCategory',
    meta: {
      title: '商品品类',
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

  //会员相关
  {
    path: '/bc/user/supplierList',
    name: 'bcSupplierList',
    meta: {
      title: '入库商列表',
    },
    component(resolve) {
      require(['pages/baseConfig/user/supplierList.vue'], resolve);
    }
  },
];

export default [...routerHMM, ...routerJDH, ...routerB];