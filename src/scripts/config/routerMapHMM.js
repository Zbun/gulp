/**
 * 慧买卖分路由
 */
export default [{
  path: '/HMM/goods/categoryManage',
  name: 'HMMgoodsCategoryManage',
  meta: {
    title: '商品管理',
  },
  component(resolve) {
    require(['pages/HMM/goods/categoryManage.vue'], resolve);
  },
},

//运营中心组
{
  path: '/HMM/oc/ocCategory',
  name: 'HMMocCategory',
  meta: {
    title: '运营分类',
  },
  component(resolve) {
    require(['pages/HMM/operatingCenter/ocCategory/ocCategory.vue'], resolve);
  }
}, {
  path: '/HMM/operatingCenter/topManage/topList',
  name: 'HMMtopManageList',
  meta: {
    title: '头条管理',
  },
  component(resolve) {
    require(['pages/HMM/operatingCenter/topManage/topList.vue'], resolve);
  }
},
{
  path: '/HMM/operatingCenter/topManage/topicList',
  name: 'HMMtopicManageList',
  meta: {
    title: '栏目管理',
  },
  component(resolve) {
    require(['pages/HMM/operatingCenter/topManage/topicList.vue'], resolve);
  }
},
{
  path: '/HMM/operatingCenter/topManage/addTopList',
  name: 'HMMaddTopList',
  meta: {
    title: '新增文章',
  },
  component(resolve) {
    require(['pages/HMM/operatingCenter/topManage/addTopList.vue'], resolve);
  }
},
{
  path: '/HMM/operatingCenter/toBuyManage/toBuyList',
  name: 'HMMtoBuyManageList',
  meta: {
    title: '求购管理',
  },
  component(resolve) {
    require(['pages/HMM/operatingCenter/toBuyManage/toBuyList.vue'], resolve);
  }
},
{
  path: '/HMM/operatingCenter/AgentManage/agentList',
  name: 'HMMagentList',
  meta: {
    title: '加盟代理列表',
  },
  component(resolve) {
    require(['pages/HMM/operatingCenter/AgentManage/agentList.vue'], resolve);
  }
},
{
  path: '/HMM/operatingCenter/AgentManage/addAgent',
  name: 'HMMaddAgent',
  meta: {
    title: '添加加盟代理',
  },
  component(resolve) {
    require(['pages/HMM/operatingCenter/AgentManage/addAgent.vue'], resolve);
  }
},
{
  path: '/HMM/operatingCenter/appdecorate',
  name: 'HMMappdecorate',
  meta: {
    title: 'APP装修管理',
  },
  component(resolve) {
    require(['pages/HMM/operatingCenter/appdecorate/appdecorate.vue'], resolve);
  }
},
{
  path: '/HMM/operatingCenter/sellergoods',
  name: 'HMMsellergoods',
  meta: {
    title: '卖家商品管理',
  },
  component(resolve) {
    require(['pages/HMM/operatingCenter/sellerGoods/sellerGoodsList.vue'], resolve);
  }
},
{
  path: '/HMM/operatingCenter/sellergoodsDetail/:id',
  name: 'HMMsellergoodsDetail',
  meta: {
    title: '卖家商品查看',
  },
  component(resolve) {
    require(['pages/HMM/operatingCenter/sellerGoods/sellerGoodsDetail.vue'], resolve);
  }
},
//营销工具组
{
  path: '/HMM/yingxiao/hspCheckList',
  name: 'HMMhspCheckList',
  meta: {
    title: '慧闪购审核列表',
  },
  component(resolve) {
    require(['pages/HMM/yingxiao/hspCheckList.vue'], resolve);
  }
}, {
  path: '/HMM/yingxiao/hspCheck/:id',
  name: 'HMMhspCheck',
  meta: {
    title: '慧闪购审核',
  },
  component(resolve) {
    require(['pages/HMM/yingxiao/hspCheck.vue'], resolve);
  }
}, {
  path: '/HMM/yingxiao/hspManage',
  name: 'HMMhspManage',
  meta: {
    title: '慧闪购管理',
  },
  component(resolve) {
    require(['pages/HMM/yingxiao/hspManage.vue'], resolve);
  }
}, {
  path: '/HMM/yingxiao/yanCheckList',
  name: 'HMMyanCheckList',
  meta: {
    title: '严选货源审核列表',
  },
  component(resolve) {
    require(['pages/HMM/yingxiao/yanCheckList.vue'], resolve);
  }
}, {
  path: '/HMM/yingxiao/yanCheck/:id',
  name: 'HMMyanCheck',
  meta: {
    title: '严选货源审核',
  },
  component(resolve) {
    require(['pages/HMM/yingxiao/yanCheck.vue'], resolve);
  }
}, {
  path: '/HMM/yingxiao/yanManage',
  name: 'HMMyanManage',
  meta: {
    title: '严选货源管理',
  },
  component(resolve) {
    require(['pages/HMM/yingxiao/yanManage.vue'], resolve);
  }
},

//交易中心组
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
  path: '/HMM/deal/payOfflineAuditList',
  name: 'HMMpayOfflineAuditList',
  meta: {
    title: '线下转账审核列表',
  },
  component(resolve) {
    require(['pages/HMM/deal/payOfflineAuditList.vue'], resolve);
  }
},
{
  path: '/HMM/deal/payOfflineAuditCheck/:id',
  name: 'HMMpayOfflineAuditCheck',
  meta: {
    title: '线下转账审核',
  },
  query: {
    isAudit: '',//1是审核，其他查看
  },
  component(resolve) {
    require(['pages/HMM/deal/payOfflineAuditCheck.vue'], resolve);
  }
},


];