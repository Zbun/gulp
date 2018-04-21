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
  {
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

  //营销中心组
  {
    path: '/HMM/yingxiao/hspCheckList',
    name: 'HMMhspCheckList',
    meta: {
      title: '慧闪批审核列表',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/hspCheckList.vue'], resolve);
    }
  }, {
    path: '/HMM/yingxiao/hspCheck/:id',
    name: 'HMMhspCheck',
    meta: {
      title: '慧闪批审核',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/hspCheck.vue'], resolve);
    }
  }, {
    path: '/HMM/yingxiao/hspManage',
    name: 'HMMhspManage',
    meta: {
      title: '慧闪批管理',
    },
    component(resolve) {
      require(['pages/HMM/yingxiao/hspManage.vue'], resolve);
    }
  },

];