export default function(router) {
  //请使用配置好的views目录：view
  //路由名区分大小写，请注意
  router.map({
    // '/': {
    //   component: function(resolve) {
    //     require(['views/home.vue'], resolve);
    //   }
    // },
    // 'home': {
    //   name: 'home',
    //   component: function(resolve) {
    //     require(['views/home.vue'], resolve);
    //   }
    // },
    // 'login': {
    //   name: 'login',
    //   component: function (resolve) {
    //     require(['views/login.vue'], resolve);
    //   }
    // },

    //采购
    //采购--采购单
    '/p/o': {
      name: 'purchaseOrder',
      component(resolve) {
        require(['views/purchase/poList.vue'], resolve);
      }
    },
    //e采购--查看采购单
    '/p/oc/:pocode': {
      name: 'purchaseOrderCheck',
      component(resolve) {
        require(['views/purchase/purchaseOrderCheck.vue'], resolve);
      }
    },
    //e采购--添加采购单
    '/p/oa': {
      name: 'purchaseOrderAdd',
      component(resolve) {
        require(['views/purchase/poEdit.vue'], resolve);
      }
    },
    //采购--添加采购单
    '/p/oe/:pocode': {
      name: 'purchaseOrderEdit',
      component(resolve) {
        require(['views/purchase/poAdd.vue'], resolve);
      }
    },

    //采购--采购退货申请单
    '/p/r': {
      name: 'purchaseReturn',
      component(resolve) {
        require(['views/purchase/modules/prlist.vue'], resolve);
      }
    },
    //采购--采购退货申请单添加
    '/p/pra': {
      name: 'purchaseReturnAdd',
      component(resolve) {
        require(['views/purchase/modules/prAdd.vue'], resolve);
      }
    },
    //采购--采购退货申请单修改
    '/p/pre/:preCode': {
      name: 'purchaseReturnEdit',
      component(resolve) {
        require(['views/purchase/modules/prEdit.vue'], resolve);
      }
    },
    //采购--查看采购退货申请单
    '/p/prc/:preCode': {
      name: 'purchaseReturnCheck',
      component(resolve) {
        require(['views/purchase/purchaseReturnCheck.vue'], resolve);
      }
    },

    //-----------Begin---------------add by YN 2017-05-25  采购返利---------
    //采购返利
    //采购返利单
    '/p/cf/0': {
      name: 'cfList',
      component(resolve) {
        require(['views/purchase/cfList.vue'], resolve);
      }
    },
    //采购返利单修改
    '/p/cfe/:pcfcode': {
      name: 'cfEdit',
      component(resolve) {
        require(['views/purchase/cfEdit.vue'], resolve);
      }
    },
    //采购返利单添加
    '/p/cfa': {
      name: 'cfAdd',
      component(resolve) {
        require(['views/purchase/cfAdd.vue'], resolve);
      }
    },
    //查看采购返利单
    '/p/cfc/:pcfcode': {
      name: 'cfCheck',
      component(resolve) {
        require(['views/purchase/cfCheck.vue'], resolve);
      }
    },
    //------------End-----------------------------------------------------

    //-----------Begin---------------add by YN 2017-05-25  采购保价---------
    //采购保价
    //采购保价单
    '/p/cb/0': {
      name: 'purchaseProtect',
      component(resolve) {
        require(['views/purchase/cbList.vue'], resolve);
      }
    },
    //采购保价单新增
    '/p/cba/': {
      name: 'cbAdd',
      component(resolve) {
        require(['views/purchase/cbAdd.vue'], resolve);
      }
    },
    //采购保价单修改
    '/p/cbe/:cbcode': {
      name: 'cbEdit',
      component(resolve) {
        require(['views/purchase/cbEdit.vue'], resolve);
      }
    },
    //查看采购保价单
    '/p/cbc/:cbcode': {
      name: 'cbCheck',
      component(resolve) {
        require(['views/purchase/cbCheck.vue'], resolve);
      }
    },
    //------------End-----------------------------------------------------



    //采购--采购入库发票管理
    '/p/rl/': {
      name: 'receiptMNG',
      component(resolve) {
        require(['views/purchase/reList.vue'], resolve);
      }
    },
    //采购--采购入库发票编辑
    '/p/ra/': {
      name: 'receiptAdd',
      component(resolve) {
        require(['views/purchase/reAdd.vue'], resolve);
      }
    },
    //采购--采购入库发票编辑
    '/p/re/:code': {
      name: 'receiptEdit',
      component(resolve) {
        require(['views/purchase/reEdit.vue'], resolve);
      }
    },
    //采购--采购入库发票查看
    '/p/rc/:code': {
      name: 'receiptCheck',
      component(resolve) {
        require(['views/purchase/reCheck.vue'], resolve);
      }
    },
    //------------------
    //采购--采购退货发票管理
    '/p/rrl/': {
      name: 'rrList',
      component(resolve) {
        require(['views/purchase/rrList.vue'], resolve);
      }
    },
    //采购--采购退货发票编辑
    '/p/rra/': {
      name: 'rrAdd',
      component(resolve) {
        require(['views/purchase/rrAdd.vue'], resolve);
      }
    },
    //采购--采购退货发票编辑
    '/p/rre/:code': {
      name: 'rrEdit',
      component(resolve) {
        require(['views/purchase/rrEdit.vue'], resolve);
      }
    },
    //采购--采购退货发票查看
    '/p/rrc/:code': {
      name: 'rrCheck',
      component(resolve) {
        require(['views/purchase/rrCheck.vue'], resolve);
      }
    },
    //----------------------------
    //销售
    //销售--销售单
    '/s/oo/:sotabIndex': {
      name: 'salesOrder',
      component(resolve) {
        require(['views/sales/salesOrder.vue'], resolve);
      }
    },
    //销售--添加销售单
    '/s/oa': {
      name: 'salesOrderAdd',
      component(resolve) {
        require(['views/sales/soAdd.vue'], resolve);
      }
    },
    //销售--编辑销售单
    '/s/oe/:socode': {
      name: 'salesOrderEdit',
      component(resolve) {
        require(['views/sales/soEdit.vue'], resolve);
      }
    },
    //销售--查看销售单
    '/s/o/:socode': {
      name: 'salesOrderCheck',
      component(resolve) {
        require(['views/sales/salesOrderCheck.vue'], resolve);
      }
    },

    //销售--出库单
    '/s/loo': {
      name: 'libOutOrder',
      component(resolve) {
        require(['views/sales/libOutOrder.vue'], resolve);
      }
    },
    //销售--出库单
    '/s/loo/:sloTabIndex': {
      name: 'libOutOrder',
      component(resolve) {
        require(['views/sales/libOutOrder.vue'], resolve);
      }
    },
    //销售--出库添加
    '/s/loa': {
      name: 'libOutOrderAdd',
      component(resolve) {
        require(['views/sales/loAdd.vue'], resolve);
      }
    },
    //销售--出库编辑
    '/s/loe/:loCode': {
      name: 'libOutOrderEdit',
      component(resolve) {
        require(['views/sales/loEdit.vue'], resolve);
      }
    },
    //销售--查看出库单
    '/s/looc/:loCode': {
      name: 'libOutOrderCheck',
      component(resolve) {
        require(['views/sales/libOutOrderCheck.vue'], resolve);
      }
    },
    //销售--销售退货申请申请
    '/s/sro': {
      name: 'salesReturnOrder',
      component(resolve) {
        require(['views/sales/salesReturnOrder.vue'], resolve);
      }
    },
    //销售--销售退货申请单添加
    '/s/sroa': {
      name: 'salesReturnAdd',
      component(resolve) {
        require(['views/sales/salesReturnAdd.vue'], resolve);
      }
    },
    //销售--销售退货申请单编辑
    '/s/sroe/:sroCode': {
      name: 'salesReturnEdit',
      component(resolve) {
        require(['views/sales/salesReturnEdit.vue'], resolve);
      }
    },
    //销售--销售退货申请查看
    '/s/sroc/:sroCode': {
      name: 'salesReturnOrderCheck',
      component(resolve) {
        require(['views/sales/salesReturnCheck.vue'], resolve);
      }
    },

    //销售--客户借机
    '/s/cbo/0': {
      name: 'borrowOrder',
      component(resolve) {
        require(['views/sales/modules/borrowList.vue'], resolve);
      }
    },
    //销售--客户借机查看
    '/s/cboc/:cbocCode': {
      name: 'borrowOrderCheck',
      component(resolve) {
        require(['views/sales/borrowOrderCheck.vue'], resolve);
      }
    },
    //销售--客户借机编辑
    '/s/cbe/:cbeCode': {
      name: 'borrowOrderEdit',
      component(resolve) {
        require(['views/sales/modules/borrowAdd.vue'], resolve);
      }
    },
    //销售--销售退货入库单
    '/s/srli': {
      name: 'salesReturnLibraryIn',
      component(resolve) {
        require(['views/sales/salesReturnLibraryIn.vue'], resolve);
      }
    },
    //销售--销售退货入库单添加
    '/s/srlia': {
      name: 'salesReturnLibraryInAdd',
      component(resolve) {
        require(['views/sales/salesReturnLibraryInAdd.vue'], resolve);
      }
    },
    //销售--销售退货入库单编辑
    '/s/srlie/:srocCode': {
      name: 'salesReturnLibraryInEdit',
      component(resolve) {
        require(['views/sales/salesReturnLibraryInEdit.vue'], resolve);
      }
    },
    //销售--销售退货入库单查看
    '/s/srlic/:srocCode': {
      name: 'salesReturnLibraryInCheck',
      component(resolve) {
        require(['views/sales/salesReturnLibraryInCheck.vue'], resolve);
      }
    },

    //销售返利
    //销售返利单
    '/p/sf/0': {
      name: 'sfList',
      component(resolve) {
        require(['views/sales/sfList.vue'], resolve);
      }
    },
    //销售返利单修改
    '/p/sfe/:sfcode': {
      name: 'sfEdit',
      component(resolve) {
        require(['views/sales/sfEdit.vue'], resolve);
      }
    },
    //销售返利单添加
    '/p/sfa': {
      name: 'sfAdd',
      component(resolve) {
        require(['views/sales/sfAdd.vue'], resolve);
      }
    },
    //销售采购返利单
    '/p/sfc/:sfcode': {
      name: 'sfCheck',
      component(resolve) {
        require(['views/sales/sfCheck.vue'], resolve);
      }
    },

    //------------------
    //销售--销售出库发票管理
    '/s/rsl/': {
      name: 'rsList',
      component(resolve) {
        require(['views/sales/rsList.vue'], resolve);
      }
    },
    //销售--销售出库发票添加
    '/s/rsa/': {
      name: 'rsAdd',
      component(resolve) {
        require(['views/sales/rsAdd.vue'], resolve);
      }
    },
    //销售--销售出库发票编辑
    '/s/rse/:code': {
      name: 'rsEdit',
      component(resolve) {
        require(['views/sales/rsEdit.vue'], resolve);
      }
    },
    //销售--销售出库发票查看
    '/s/rsc/:code': {
      name: 'rsCheck',
      component(resolve) {
        require(['views/sales/rsCheck.vue'], resolve);
      }
    },

    //销售--销售退货入库库发票管理
    '/s/ral/': {
      name: 'raList',
      component(resolve) {
        require(['views/sales/raList.vue'], resolve);
      }
    },
    //销售--销售退货入库发票添加
    '/s/raa/': {
      name: 'raAdd',
      component(resolve) {
        require(['views/sales/raAdd.vue'], resolve);
      }
    },
    //销售--销售退货入库发票编辑
    '/s/rae/:code': {
      name: 'raEdit',
      component(resolve) {
        require(['views/sales/raEdit.vue'], resolve);
      }
    },
    //销售--销售退货入库发票查看
    '/s/rac/:code': {
      name: 'raCheck',
      component(resolve) {
        require(['views/sales/raCheck.vue'], resolve);
      }
    },

    //仓库
    //仓库--入库单
    '/l/lio': {
      name: 'libraryInOrder',
      component(resolve) {
        require(['views/library/libraryInOrder.vue'], resolve);
      }
    },
    //仓库--采购入库添加
    '/l/plia': {
      name: 'pLibraryInAdd',
      component(resolve) {
        require(['views/library/pLibraryInAdd.vue'], resolve);
      }
    },
    //仓库--采购入库编辑
    '/l/plie/:code': {
      name: 'pLibraryInEdit',
      component(resolve) {
        require(['views/library/pLibraryInEdit.vue'], resolve);
      }
    },

    //仓库--采购入库单查看
    '/l/lioc/:lioCode': {
      name: 'libraryInOrderCheck',
      component(resolve) {
        require(['views/library/libraryInOrderCheck.vue'], resolve);
      }
    },
    //仓库--采购退货出库单
    '/l/pro': {
      name: 'purchaseReturnOrder',
      component(resolve) {
        require(['views/library/purchaseReturnOrder.vue'], resolve);
      }
    },
    //仓库--采购退货出库单添加
    '/l/proa': {
      name: 'purchaseReturnOrderAdd',
      component(resolve) {
        require(['views/library/purchaseReturnAdd.vue'], resolve);
      }
    },
    //仓库--采购退货出库单编辑
    '/l/proe/:lproCode': {
      name: 'purchaseReturnOrderEdit',
      component(resolve) {
        require(['views/library/purchaseReturnEdit.vue'], resolve);
      }
    },
    //仓库--查看采购退货库单
    '/l/proc/:lproCode': {
      name: 'PRLibraryOrderCheck',
      component(resolve) {
        require(['views/library/PRLibraryOrderCheck.vue'], resolve);
      }
    },

    //仓库--借出归还
    '/l/bar': {
      name: 'borrowAndReturn',
      component(resolve) {
        require(['views/library/borrowAndReturn.vue'], resolve);
      }
    },
    //仓库--库存盘点
    '/l/lp': {
      name: 'libraryProofread',
      component(resolve) {
        require(['views/library/libraryProofread.vue'], resolve);
      }
    },
    //仓库--盘点记录
    '/l/lph': {
      name: 'libraryProofreadHistory',
      component(resolve) {
        require(['views/library/libraryProofreadHistory.vue'], resolve);
      }
    },
    //仓库--发货单
    '/l/pl': {
      name: 'postedList',
      component(resolve) {
        require(['views/library/postedList.vue'], resolve);
      }
    },
    //仓库--调拨出库单列表
    '/l/dol': {
      name: 'dispatchOutList',
      component(resolve) {
        require(['views/library/dispatchOutList.vue'], resolve);
      }
    }, //仓库--调拨出库单添加
    '/l/doa': {
      name: 'dispatchOutAdd',
      component(resolve) {
        require(['views/library/dispatchOutAdd.vue'], resolve);
      }
    }, //仓库--调拨出库单编辑
    '/l/doe/:doCode': {
      name: 'dispatchOutEdit',
      component(resolve) {
        require(['views/library/dispatchOutEdit.vue'], resolve);
      }
    }, //仓库--调拨出库单查看
    '/l/doc/:doCode': {
      name: 'dispatchOutCheck',
      component(resolve) {
        require(['views/library/dispatchOutCheck.vue'], resolve);
      }
    },

    //仓库--调拨入库单列表
    '/l/doil/:doliTabIndex': {
      name: 'dispatchInList',
      component(resolve) {
        require(['views/library/dispatchInList.vue'], resolve);
      }
    },
    //仓库--调拨入库单添加
    '/l/dia/:doCode': {
      name: 'dispatchInAdd',
      component(resolve) {
        require(['views/library/dispatchInAdd.vue'], resolve);
      }
    }, //仓库--调拨入库单编辑
    '/l/die/:doCode': {
      name: 'dispatchInEdit',
      component(resolve) {
        require(['views/library/dispatchInEdit.vue'], resolve);
      }
    }, //仓库--调拨入库单查看
    '/l/dic/:doCode': {
      name: 'dispatchInCheck',
      component(resolve) {
        require(['views/library/dispatchInCheck.vue'], resolve);
      }
    },

    //p审批
    //审批--流程审核列表
    '/f/fal': {
      name: 'flowAuditList',
      component(resolve) {
        require(['views/library/flowAuditList.vue'], resolve);
      }
    },

    //调拨
    //调拨--调拨单
    '/d/do/:doTabIndex': {
      name: 'dispatchOrder',
      component(resolve) {
        require(['views/dispatch/dispatchOrder.vue'], resolve);
      }
    },
    //调拨--调拨单查看
    '/d/doc/:doCode': {
      name: 'dispatchOrderCheck',
      component(resolve) {
        require(['views/dispatch/dispatchOrderCheck.vue'], resolve);
      }
    },
    //调拨--调拨单添加
    '/d/doa': {
      name: 'dispatchOrderAdd',
      component(resolve) {
        require(['views/dispatch/dispatchOrderAdd.vue'], resolve);
      }
    },
    //调拨--调拨单编辑
    '/d/doe/:doCode': {
      name: 'dispatchOrderEdit',
      component(resolve) {
        require(['views/dispatch/dispatchOrderEdit.vue'], resolve);
      }
    },

    //调拨
    //转仓单列表
    '/d/ts/0': {
      name: 'transStoreList',
      component(resolve) {
        require(['views/dispatch/tsList.vue'], resolve);
      }
    },
    //转仓查看
    '/d/tsc/:tsCode': {
      name: 'transStoreCheck',
      component(resolve) {
        require(['views/dispatch/tsCheck.vue'], resolve);
      }
    },
    //转仓编辑
    '/d/tse/:tsCode': {
      name: 'transStoreEdit',
      component(resolve) {
        require(['views/dispatch/tsEdit.vue'], resolve);
      }
    },
    //转仓添加
    '/d/tsa': {
      name: 'transStoreAdd',
      component(resolve) {
        require(['views/dispatch/tsAdd.vue'], resolve);
      }
    },


    // //调拨--调拨预告单
    // '/d/dfo': {
    //   name: 'dispatchForeshowOrder',
    //   component(resolve) {
    //     require(['views/dispatch/dispatchForeshowOrder.vue'], resolve);
    //   }
    // },
    // //调拨--调拨预告单查看
    // '/d/dfo/:dfocCode': {
    //   name: 'dispatchForeshowOrderCheck',
    //   component(resolve) {
    //     require(['views/dispatch/dispatchForeshowOrderCheck.vue'], resolve);
    //   }
    // },
    //调拨--调拨出入库单查看
    '/d/dolc/:dolcCode': {
      name: 'dispatchOrderListCheck',
      component(resolve) {
        require(['views/dispatch/dispatchOrderListCheck.vue'], resolve);
      }
    },

    //调拨--调剂单
    '/d/to/0': {
      name: 'transferOrder',
      component(resolve) {
        require(['views/dispatch/modules/transferList.vue'], resolve);
      }
    }, //调拨--调剂单查看
    '/d/toc/:tocCode': {
      name: 'transferOrderCheck',
      component(resolve) {
        require(['views/dispatch/transferOrderCheck.vue'], resolve);
      }
    }, //调拨--编辑调剂单
    '/d/toe/:toeCode': {
      name: 'transferOrderEdit',
      component(resolve) {
        require(['views/dispatch/modules/transferAdd.vue'], resolve);
      }
    },

    //财务
    //付款单
    '/f/pm': {
      name: 'paymentManage',
      component(resolve) {
        require(['views/finance/paymentManage.vue'], resolve);
      }
    },
    //添加付款单
    '/f/pma': {
      name: 'paymentAdd',
      component(resolve) {
        require(['views/finance/paymentAdd.vue'], resolve);
      }
    },
    //编辑付款单
    '/f/pme/:fpCode': {
      name: 'paymentEdit',
      component(resolve) {
        require(['views/finance/paymentEdit.vue'], resolve);
      }
    },
    //付款单查看
    '/f/pmc/:fpCode': {
      name: 'paymentCheck',
      component(resolve) {
        require(['views/finance/paymentCheck.vue'], resolve);
      }
    },
    //财务--收款管理
    '/f/prm': {
      name: 'proceedsManage',
      component(resolve) {
        require(['views/finance/proceedsManage.vue'], resolve);
      }
    }, //财务--收款添加
    '/f/pra': {
      name: 'proceedsAdd',
      component(resolve) {
        require(['views/finance/proceedsAdd.vue'], resolve);
      }
    },
    //财务--收款修改
    '/f/pra/:fpCode': {
      name: 'proceedsEdit',
      component(resolve) {
        require(['views/finance/proceedsEdit.vue'], resolve);
      }
    },
    //财务--收款单查看
    '/f/prc/:fpCode': {
      name: 'proceedsCheck',
      component(resolve) {
        require(['views/finance/proceedsCheck.vue'], resolve);
      }
    },
    //财务--供应商对账单
    '/f/sac/:supplierName': {
      name: 'supplierAmountCheck',
      component(resolve) {
        require(['views/finance/subjectDetail.vue'], resolve);
      }
    },
    //财务--供应商查看凭证
    '/f/pjv/:code/:cid': {
      name: 'pjView',
      component(resolve) {
        require(['views/finance/pjView.vue'], resolve);
      }
    },
    //财务--客户对账单
    '/f/cac/:customerId': {
      name: 'customerAmountCheck',
      component(resolve) {
        require(['views/finance/customerAmountCheck.vue'], resolve);
      }
    },
    //财务--库存成本调整
    '/f/apc': {
      name: 'adjustProCost',
      component(resolve) {
        require(['views/finance/adjustProCost.vue'], resolve);
      }
    },
    //财务--采购入库发票管理
    '/f/imng/:imngTabIndex': {
      name: 'invoiceMNG',
      component(resolve) {
        require(['views/finance/invoiceMNG.vue'], resolve);
      }
    },
    //财务--成本调价
    '/f/rp': {
      name: 'revisePrice',
      component(resolve) {
        require(['views/finance/revisePrice.vue'], resolve);
      }
    },
    //财务--现金收款
    '/f/rec/:recTabIndex': {
      name: 'receiveCash',
      component(resolve) {
        require(['views/finance/receiveCash.vue'], resolve);
      }
    },
    //财务--现金收款编辑
    '/f/rece/:receCode': {
      name: 'receiveCashEdit',
      component(resolve) {
        require(['views/finance/modules/rcAdd.vue'], resolve);
      }
    },
    //财务--收款查看
    '/f/recc/:receCode': {
      name: 'receiveCashCheck',
      component(resolve) {
        require(['views/finance/receiveCashCheck.vue'], resolve);
      }
    },
    //财务--额度收款
    '/f/recr/:recrTabIndex': {
      name: 'receiveCredit',
      component(resolve) {
        require(['views/finance/receiveCredit.vue'], resolve);
      }
    }, //财务--额度收款编辑
    '/f/recre/:receCode': {
      name: 'receiveCreditEdit',
      component(resolve) {
        require(['views/finance/modules/rcrAdd.vue'], resolve);
      }
    },
    //财务--返利收款
    '/f/rer/:rerTabIndex': {
      name: 'receiveRebate',
      component(resolve) {
        require(['views/finance/receiveRebate.vue'], resolve);
      }
    },
    //财务--返利收款编辑
    '/f/rere/:receCode': {
      name: 'receiveRebateEdit',
      component(resolve) {
        require(['views/finance/modules/rrAdd.vue'], resolve);
      }
    },
    //财务--机构余额
    '/f/bfb': {
      name: 'balanceForBranch',
      component(resolve) {
        require(['views/finance/balanceForBranch.vue'], resolve);
      }
    },
    //财务--客户余额
    '/f/bfc': {
      name: 'balanceForCustomer',
      component(resolve) {
        require(['views/finance/balanceForCustomer.vue'], resolve);
      }
    },
    //财务--供应商余额
    '/f/bfs': {
      name: 'balanceForSupplier',
      component(resolve) {
        require(['views/finance/balanceForSupplier.vue'], resolve);
      }
    },
    //商品
    //商品--商品管理
    '/g/sp': {
      name: 'goodsTypeManage',
      component(resolve) {
        require(['views/goods/goodsTypeManage.vue'], resolve);
      }
    },
    //商品
    //商品--商品类别管理
    '/g/ca': {
      name: 'categoryManage',
      component(resolve) {
        require(['views/goods/categoryManage.vue'], resolve);
      }
    },
    //商品
    //商品--商品属性管理
    '/g/gpm': {
      name: 'goodsPropManage',
      component(resolve) {
        require(['views/goods/goodsPropManage.vue'], resolve);
      }
    },
    //商品
    //商品--新增商品
    // '/g/add': {
    //   name: 'goodsAdd',
    //   component(resolve) {
    //     require(['views/goods/categoryManage.vue'], resolve);
    //   }
    // },
    //报表
    //报表--仓库进销存
    '/st/lerp': {
      name: 'libraryERP',
      component(resolve) {
        require(['views/statement/libraryERP.vue'], resolve);
      }
    }, //报表--产品进销存
    '/st/perp': {
      name: 'proERP',
      component(resolve) {
        require(['views/statement/proERP.vue'], resolve);
      }
    }, //报表--库存分布
    '/st/ld': {
      name: 'libraryDistribution',
      component(resolve) {
        require(['views/statement/libraryDistribution.vue'], resolve);
      }
    },
    //报表--借机报表
    '/st/bd': {
      name: 'borrowDetail',
      component(resolve) {
        require(['views/statement/borrowDetail.vue'], resolve);
      }
    }, //报表--出货明细
    '/st/sod': {
      name: 'storeOutDetail',
      component(resolve) {
        require(['views/statement/storeOutDetail.vue'], resolve);
      }
    }, //报表--采购明细表
    '/st/pd': {
      name: 'purchaseDetail',
      component(resolve) {
        require(['views/statement/purchaseDetail.vue'], resolve);
      }
    },
    //报表--终端进销存
    '/st/terp': {
      name: 'terminalERP',
      component(resolve) {
        require(['views/statement/terminalERP.vue'], resolve);
      }
    },
    //报表--出货分析
    '/st/soa': {
      name: 'storeOutAnalysis',
      component(resolve) {
        require(['views/statement/storeOutAnalysis.vue'], resolve);
      }
    },
    //报表--出货汇总
    '/st/sa': {
      name: 'salesAnalysis',
      component(resolve) {
        require(['views/statement/salesAnalysis.vue'], resolve);
      }
    },
    //报表--采购汇总
    '/st/pa': {
      name: 'purchaseAnalysis',
      component(resolve) {
        require(['views/statement/purchaseAnalysis.vue'], resolve);
      }
    },
    //报表--零售分析
    '/st/ra': {
      name: 'retailAnalysis',
      component(resolve) {
        require(['views/statement/retailAnalysis.vue'], resolve);
      }
    },
    //报表--财务利润表
    '/st/fp': {
      name: 'finaceProfit',
      component(resolve) {
        require(['views/statement/finaceProfit.vue'], resolve);
      }
    },
    //报表--经营业绩表
    '/st/mp': {
      name: 'managePerformance',
      component(resolve) {
        require(['views/statement/managePerformance.vue'], resolve);
      }
    },
    //报表--资产负债表
    '/st/al': {
      name: 'assetLiabilities',
      component(resolve) {
        require(['views/statement/assetLiabilities.vue'], resolve);
      }
    },
    //报表--库龄分析表
    '/st/page': {
      name: 'proAges',
      component(resolve) {
        require(['views/statement/proAges.vue'], resolve);
      }
    },
    //报表--库存周转
    '/st/pt': {
      name: 'proTran',
      component(resolve) {
        require(['views/statement/proTran.vue'], resolve);
      }
    },
    //报表--出库串号明细
    '/st/losd': {
      name: 'libOutSNDetail',
      component(resolve) {
        require(['views/statement/libOutSNDetail.vue'], resolve);
      }
    },
    //报表--成本加权调整历史
    '/st/pah': {
      name: 'priceAvgHistory',
      component(resolve) {
        require(['views/statement/priceAvgHistory.vue'], resolve);
      }
    },

    //售后
    //售后-换机管理
    '/cs/cm/:cscmTabIndex': {
      name: 'changeManage',
      component(resolve) {
        require(['views/customerService/changeManage.vue'], resolve);
      }
    },
    //售后-串号查询
    '/cs/snm': {
      name: 'snMission',
      component(resolve) {
        require(['views/customerService/snMission.vue'], resolve);
      }
    },
    //售后-串号对比
    '/cs/snc': {
      name: 'sncomparison',
      component(resolve) {
        require(['views/customerService/sncomparison.vue'], resolve);
      }
    },
    //售后-串号导出
    '/cs/sne': {
      name: 'snexport',
      component(resolve) {
        require(['views/customerService/snexport.vue'], resolve);
      }
    },
    //基础设置
    //基础设置-用户管理
    '/b/u': {
      name: 'userList',
      component(resolve) {
        require(['views/baseConfig/userList.vue'], resolve);
      }
    },
    //基础设置-用户编辑
    '/b/ue/': {
      name: 'userEdit',
      component(resolve) {
        require(['views/baseConfig/userEdit.vue'], resolve);
      }
    },
    //基础设置-新增用户
    '/b/ua/': {
      name: 'userAdd',
      component(resolve) {
        require(['views/baseConfig/userAdd.vue'], resolve);
      }
    },
    //基础设置-角色
    //角色列表
    '/b/rolelist/': {
      name: 'rolelist',
      component(resolve) {
        require(['views/baseConfig/rolelist.vue'], resolve);
      }
    },
    //基础设置-角色
    //角色列表
    '/b/roleadd/': {
      name: 'roleadd',
      component(resolve) {
        require(['views/baseConfig/roleAdd.vue'], resolve);
      }
    },
    //基础设置-角色
    //角色列表
    '/b/roleedit/': {
      name: 'roleedit',
      component(resolve) {
        require(['views/baseConfig/roleEdit.vue'], resolve);
      }
    },
    //基础设置-仓库管理
    '/b/l/:blTabIndex': {
      name: 'libraryMNG',
      component(resolve) {
        require(['views/baseConfig/libraryMNG.vue'], resolve);
      }
    },
    //基础设置-机构设置
    '/b/bm': {
      name: 'branchMNG',
      component(resolve) {
        require(['views/baseConfig/branchMNG.vue'], resolve);
      }
    },
    //基础设置-仓库编辑
    '/b/le/:lId': {
      name: 'libraryEdit',
      component(resolve) {
        require(['views/baseConfig/modules/libraryAdd.vue'], resolve);
      }
    },
    //基础设置-流程配置列表
    '/b/f': {
      name: 'flowMNG',
      component(resolve) {
        require(['views/baseConfig/flowMNG.vue'], resolve);
      }
    },
    //基础设置-流程设置
    '/b/f/:flowType': {
      name: 'flowSet',
      component(resolve) {
        require(['views/baseConfig/flowSet.vue'], resolve);
      }
    },
    //基础设置-供应商管理
    '/b/s/0': {
      name: 'supplierMNG',
      component(resolve) {
        require(['views/baseConfig/modules/supplierList.vue'], resolve);
      }
    },
    //基础设置-供应商编辑
    '/b/se/:sid': {
      name: 'supplierEdit',
      component(resolve) {
        require(['views/baseConfig/modules/supplierAdd.vue'], resolve);
      }
    },
    //基础设置-银行信息
    '/b/b': {
      name: 'bankMNG',
      component(resolve) {
        require(['views/baseConfig/bankMNG.vue'], resolve);
      }
    },
    //基础设置-公司信息
    '/b/cic': {
      name: 'companyInfoCheck',
      component(resolve) {
        require(['views/baseConfig/companyInfoCheck.vue'], resolve);
      }
    },
    //基础设置-物流管理
    '/b/lo': {
      name: 'logisticsMNG',
      component(resolve) {
        require(['views/baseConfig/logisticsMNG.vue'], resolve);
      }
    },
    //基础设置-业务数据初始化
    '/b/ind/:indTabIndex': {
      name: 'initData',
      component(resolve) {
        require(['views/baseConfig/initData.vue'], resolve);
      }
    },
    //基础设置-业务员管理
    '/b/bmm/:bmmTabIndex': {
      name: 'businessmanMNG',
      component(resolve) {
        require(['views/baseConfig/businessmanMNG.vue'], resolve);
      }
    },
    //基础设置-业务员编辑
    '/b/bme/:bmId': {
      name: 'businessmanEdit',
      component(resolve) {
        require(['views/baseConfig/modules/businessmanAdd.vue'], resolve);
      }
    },
    //基础设置-基础配置
    '/b/bc': {
      name: 'basicconfig',
      component(resolve) {
        require(['views/baseConfig/basicConfig.vue'], resolve);
      }
    },
    //基础设置-串号带票调整
    '/b/ia': {
      name: 'invoiceAdjust',
      component(resolve) {
        require(['views/baseConfig/invoiceAdjust.vue'], resolve);
      }
    },
    //基础设置-新增客户
    '/b/addcustomer': {
      name: 'addcustomer',
      component(resolve) {
        require(['views/baseConfig/addcustomer.vue'], resolve);
      }
    },
    //基础设置-修改客户
    '/b/updatecustomer': {
      name: 'updatecustomer',
      component(resolve) {
        require(['views/baseConfig/updatecustomer.vue'], resolve);
      }
    },
    //基础设置-客户
    '/b/customer': {
      name: 'customerList',
      component(resolve) {
        require(['views/baseConfig/customerList.vue'], resolve);
      }
    },
    //基础设置-会计科目
    '/b/as': {
      name: 'subjectMNG',
      component(resolve) {
        require(['views/baseConfig/subjectMNG.vue'], resolve);
      }
    },
    //基础设置-数据对接
    '/b/dc': {
      name: 'dataConnect',
      component(resolve) {
        require(['views/baseConfig/dataConnect.vue'], resolve);
      }
    },
    //基础设置-新增接口
    '/b/addapi': {
      name: 'addapi',
      component(resolve) {
        require(['views/baseConfig/addapi.vue'], resolve);
      }
    },
    //基础设置-接口配置
    '/b/apiconfig': {
      name: 'apiconfig',
      component(resolve) {
        require(['views/baseConfig/apiconfig.vue'], resolve);
      }
    },
    //基础设置-接口推送
    '/b/apipush': {
      name: 'apipush',
      component(resolve) {
        require(['views/baseConfig/apipush.vue'], resolve);
      }
    },
    //基础设置-同步日志
    '/b/synchistory': {
      name: 'synchistory',
      component(resolve) {
        require(['views/baseConfig/syncHistory.vue'], resolve);
      }
    },
    //基础设置-菜单管理
    '/b/mmg': {
      name: 'menusManage',
      component(resolve) {
        require(['views/baseConfig/menusManage.vue'], resolve);
      }
    },

    //打印设置--无菜单，黑路由
    '/pp/ps': {
      name: 'printSet',
      component(resolve) {
        require(['views/print/printSet.vue'], resolve);
      }
    },
    //批量打印-目前菜单放入仓库菜单
    '/pp/bp/:bpIndex': {
      name: 'batchPrint',
      component(resolve) {
        require(['views/print/print.vue'], resolve);
      }
    }, //[> 404路由 <]
    // '*': {
    //   component: function(resolve) {
    //     require(['views/404/default.vue'], resolve);
    //   }
    // }, //[> 404路由 <]
    '404': {
      name: '404',
      component: function(resolve) {
        require(['views/404/default.vue'], resolve);
      }
    },

    //以下为2b方面路由，命名中需要以B2b开头，请知悉
    '/B2b/order/addpro': {
      name: 'b2bAddpro',
      component: function(resolve) {
        require(['B2b/order/addPro.vue'], resolve);

      }
    },

  });
}