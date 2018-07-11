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
    path: '/auditProgress',
    name: 'auditProgress',
    meta: {
      title: '个人审核进度',
    },
    component(resolve) {
      require(['commonVues/elements/auditProgress.vue'], resolve);
    }
  },

  {
    path: '/cAuditProgress',
    name: 'cAuditProgress',
    meta: {
      title: '企业审核进度',
    },
    component(resolve) {
      require(['commonVues/elements/cAuditProgress.vue'], resolve);
    }
  },
  {
    path: '/supplyInfo',
    name: 'supplyInfo',
    meta: {
      title: '补充资料',
    },
    component(resolve) {
      require(['commonVues/elements/supplyInfo.vue'], resolve);
    }
  },

  //基础管理组
  {
    path: '/bc/baseConfig/regInfo',
    name: 'BCregInfo',
    meta: {
      title: '注册信息',
    },
    component(resolve) {
      require(['pages/baseConfig/baseConfig/regInfo.vue'], resolve);
    }
  },
  {
    path: '/bc/baseConfig/shopInfo',
    name: 'BCshopInfo',
    meta: {
      title: '商铺信息',
    },
    component(resolve) {
      require(['pages/baseConfig/baseConfig/shopInfo.vue'], resolve);
    }
  },
  {
    path: '/bc/baseConfig/afterSale',
    name: 'BCafterSale',
    meta: {
      title: '售后服务模板',
    },
    component(resolve) {
      require(['pages/baseConfig/baseConfig/afterSale.vue'], resolve);
    }
  },
  {
    path: '/bc/baseConfig/carriageTemp',
    name: 'BCcarriageTemp',
    meta: {
      title: '运费模板列表',
    },
    component(resolve) {
      require(['pages/baseConfig/baseConfig/carriageTemp.vue'], resolve);
    }
  }, {
    path: '/bc/baseConfig/carriageTempAdd',
    name: 'BCcarriageTempAdd',
    meta: {
      title: '运费模板添加',
    },
    component(resolve) {
      require(['pages/baseConfig/baseConfig/carriageTempAdd.vue'], resolve);
    }
  },
  {
    path: '/bc/baseConfig/carriageTempEdit/:id',
    name: 'BCcarriageTempEdit',
    meta: {
      title: '运费模板编辑',
    },
    component(resolve) {
      require(['pages/baseConfig/baseConfig/carriageTempEdit.vue'], resolve);
    }
  },
  {
    path: '/bc/baseConfig/feedbackInfoAdd',
    name: 'feedbackInfoAdd',
    meta: {
      title: '添加反馈信息',
    },
    component(resolve) {
      require(['pages/baseConfig/baseConfig/feedbackInfoAdd.vue'], resolve);
    }
  }, {
    path: '/bc/bc/lt',
    name: 'logisticsTool',
    meta: {
      title: '物流工具',
    },
    component(resolve) {
      require(['pages/baseConfig/baseConfig/logisticsTool.vue'], resolve);
    }
  },
  //供应管理组
  {
    path: '/bc/supply/supplierList',
    name: 'BCsupplierList',
    meta: {
      title: '供应商管理',
    },
    component(resolve) {
      require(['pages/baseConfig/supplyManage/supplierList.vue'], resolve);
    }
  }, {
    path: '/bc/supply/storeList',
    name: 'BCstoreList',
    meta: {
      title: '仓库管理',
    },
    component(resolve) {
      require(['pages/baseConfig/supplyManage/storeList.vue'], resolve);
    }
  },
  /**部门、用户、角色 */
  {
    path: '/bc/departmentList',
    name: 'departmentList',
    meta: {
      title: '部门列表',
    },
    component(resolve) {
      require(['pages/baseConfig/userManage/departmentList.vue'], resolve);
    }
  },
  {
    path: '/bc/roleList',
    name: 'roleList',
    meta: {
      title: '角色列表',
    },
    component(resolve) {
      require(['pages/baseConfig/userManage/roleList.vue'], resolve);
    }
  },
  {
    path: '/bc/userList',
    name: 'userList',
    meta: {
      title: '用户列表',
    },
    component(resolve) {
      require(['pages/baseConfig/userManage/userList.vue'], resolve);
    }
  },

  //客户服务组
  {
    path: '/bc/cs/supplierService',
    name: 'supplierService',
    meta: {
      title: '在线客服-入驻商（QQ）',
    },
    component(resolve) {
      require(['pages/baseConfig/customerService/supplierService.vue'], resolve);
    }
  },
  {
    path: '/bc/cs/qqServiceHelp',
    name: 'qqServiceHelp',
    meta: {
      title: '客服使用说明',
    },
    component(resolve) {
      require(['pages/baseConfig/customerService/qqServiceHelp.vue'], resolve);
    }
  },
  {
    path: '/bc/cs/selfService',
    name: 'selfService',
    meta: {
      title: '在线客服-自营（小能客服）',
    },
    component(resolve) {
      require(['pages/baseConfig/customerService/selfService.vue'], resolve);
    }
  },
  {
    path: '/bc/cs/phoneService',
    name: 'phoneService',
    meta: {
      title: '电话',
    },
    component(resolve) {
      require(['pages/baseConfig/customerService/phoneService.vue'], resolve);
    }
  },
];
let routerM = [{ //我的钱包路由
    path: '/myWallet/index',
    name: 'walletIndex',
    meta: {
      title: '我的钱包首页',
    },
    component(resolve) {
      require(['pages/myWallet/index.vue'], resolve);
    }
  },
  { //我的钱包路由
    path: '/myWallet/accountInfo',
    name: 'accountInfo',
    meta: {
      title: '账户资料',
    },
    component(resolve) {
      require(['pages/myWallet/accountInfo.vue'], resolve);
    }
  },
  { //我的钱包安全中心
    path: '/myWallet/safeCenter',
    name: 'safeCenter',
    meta: {
      title: '安全中心',
    },
    component(resolve) {
      require(['pages/myWallet/safeCenter.vue'], resolve);
    }
  },
  { //我的银行卡
    path: '/myWallet/myBank',
    name: 'myBank',
    meta: {
      title: '我的銀行卡',
    },
    component(resolve) {
      require(['pages/myWallet/myBank.vue'], resolve);
    }
  },
  { //我的余额
    path: '/myWallet/withdraw',
    name: 'withdraw',
    meta: {
      title: '余额提现',
    },
    component(resolve) {
      require(['pages/myWallet/withdraw.vue'], resolve);
    }
  },
  { //我的交易记录
    path: '/myWallet/tradingRecord',
    name: 'tradingRecord',
    meta: {
      title: '交易记录',
    },
    component(resolve) {
      require(['pages/myWallet/tradingRecord.vue'], resolve);
    }
  },
  //2.0注冊
  {
    path: '/reg',
    name: 'reg',
    meta: {
      title: '注冊',
    },
    component(resolve) {
      require(['commonVues/elements/regTwo/eReg.vue'], resolve);
    }
  },
  {
    path: '/applyProgress',
    name: 'applyProgress',
    meta: {
      title: '申请进度查询',
    },
    component(resolve) {
      require(['commonVues/elements/regTwo/applyProgress.vue'], resolve);
    }
  },
]
export default [...routerHMM, ...routerJDH, ...routerB, ...routerM];