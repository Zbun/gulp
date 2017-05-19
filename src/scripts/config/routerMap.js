export default function(router) {
  //请使用配置好的views目录：view
  router.map({
    '/': {
      component: function(resolve) {
        require(['views/home.vue'], resolve);
      }
    },
    'home': {
      name: 'home',
      component: function(resolve) {
        require(['views/home.vue'], resolve);
      }
    },
    //[> 404路由 <]
    '*': {
      component: function(resolve) {
        require(['views/default.vue'], resolve);
      }
    }, //[> 404路由 <]
    '404': {
      name: '404',
      component: function(resolve) {
        require(['views/default.vue'], resolve);
      }
    },
    //登录页
    'login': {
      component: function(resolve) {
        require(['views/login.vue'], resolve);
      }
    },

    //采购
    //采购--采购单
    '/p/o/0': {
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
    //e采购--添加编辑采购单
    '/p/oe/:pocode': {
      name: 'purchaseOrderEdit',
      component(resolve) {
        require(['views/purchase/poAdd.vue'], resolve);
      }
    },

    //采购--退货单
    '/p/r/0': {
      name: 'purchaseReturn',
      component(resolve) {
        require(['views/purchase/modules/prlist.vue'], resolve);
      }
    },
    //采购--退货单修改
    '/p/re/:preCode': {
      name: 'purchaseReturnEdit',
      component(resolve) {
        require(['views/purchase/modules/prAdd.vue'], resolve);
      }
    },
    //采购--查看采购退货单
    '/p/rec/:precCode': {
      name: 'purchaseReturnCheck',
      component(resolve) {
        require(['views/purchase/purchaseReturnCheck.vue'], resolve);
      }
    },
    //销售
    //销售--销售单
    '/s/oo/:sotabIndex': {
      name: 'salesOrder',
      component(resolve) {
        require(['views/sales/salesOrder.vue'], resolve);
      }
    },
    //销售--添加编辑销售单
    '/s/oe/:socode': {
      name: 'salesOrderEdit',
      component(resolve) {
        require(['views/sales/modules/salesOrderAdd.vue'], resolve);
      }
    },
    //销售--查看销售单
    '/s/o/:soccode': {
      name: 'salesOrderCheck',
      component(resolve) {
        require(['views/sales/salesOrderCheck.vue'], resolve);
      }
    },

    //销售--出库单
    '/s/loo/:sloTabIndex': {
      name: 'libOutOrder',
      component(resolve) {
        require(['views/sales/libOutOrder.vue'], resolve);
      }
    },
    //销售--出库扫码
    '/s/soss/:soccode': {
      name: 'salesLibOutScanSN',
      component(resolve) {
        require(['views/sales/salesLibOutScanSN.vue'], resolve);
      }
    },
    //销售--查看出库单
    '/s/looc/:loocOrder': {
      name: 'libOutOrderCheck',
      component(resolve) {
        require(['views/sales/libOutOrderCheck.vue'], resolve);
      }
    },
    //销售--销售退货
    '/s/sro/:sroTabIndex': {
      name: 'salesReturnOrder',
      component(resolve) {
        require(['views/sales/modules/salesReturnList.vue'], resolve);
      }
    },
    //销售--销售退货查看
    '/s/sroc/:srocCode': {
      name: 'salesReturnOrderCheck',
      component(resolve) {
        require(['views/sales/salesReturnOrderCheck.vue'], resolve);
      }
    },
    //销售--销售退货编辑
    '/s/sroe/:sroCode': {
      name: 'salesReturnEdit',
      component(resolve) {
        require(['views/sales/modules/salesReturnAdd.vue'], resolve);
      }
    },
    //销售--客户借机
    '/s/cbo/:cboTabIndex': {
      name: 'borrowOrder',
      component(resolve) {
        require(['views/sales/borrowOrder.vue'], resolve);
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
    '/s/srli/:srliTabindex': {
      name: 'salesReturnLibraryIn',
      component(resolve) {
        require(['views/sales/salesReturnLibraryIn.vue'], resolve);
      }
    },
    //销售--销售退货入库单查看
    '/s/srlic/:srocCode': {
      name: 'salesReturnLibraryInCheck',
      component(resolve) {
        require(['views/sales/salesReturnLibraryInCheck.vue'], resolve);
      }
    },

    //仓库
    //仓库--入库单
    '/l/lio/:lioTabIndex': {
      name: 'libraryInOrder',
      component(resolve) {
        require(['views/library/libraryInOrder.vue'], resolve);
      }
    },
    //仓库--采购入库扫码
    '/l/liss/:pocode': {
      name: 'libraryInScanSN',
      component(resolve) {
        require(['views/library/libraryInScanSN.vue'], resolve);
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
    '/l/pro/:proTabIndex': {
      name: 'purchaseReturnOrder',
      component(resolve) {
        require(['views/library/purchaseReturnOrder.vue'], resolve);
      }
    },
    //仓库--查看退货库单
    '/l/proc/:lproCode': {
      name: 'PRLibraryOrderCheck',
      component(resolve) {
        require(['views/library/PRLibraryOrderCheck.vue'], resolve);
      }
    },
    //仓库--采购退货出库扫码
    '/l/pross/:proCode': {
      name: 'purchaseReturnOrderScanSN',
      component(resolve) {
        require(['views/library/purchaseReturnOrderScanSN.vue'], resolve);
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
    '/l/dol/:dolTabIndex': {
      name: 'dispatchOrderList',
      component(resolve) {
        require(['views/library/dispatchOrderList.vue'], resolve);
      }
    },
    //仓库--调拨出库单扫码
    '/l/doout/:doCode': {
      name: 'dispatchOrderLibOut',
      component(resolve) {
        require(['views/library/dispatchOrderLibOut.vue'], resolve);
      }
    },

    //仓库--调拨入库单列表
    '/l/doil/:doliTabIndex': {
      name: 'dispatchOrderInList',
      component(resolve) {
        require(['views/library/dispatchOrderInList.vue'], resolve);
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
        require(['views/dispatch/modules//dispatchList.vue'], resolve);
      }
    },
    //调拨--调拨单查看
    '/d/doc/:doCode': {
      name: 'dispatchOrderCheck',
      component(resolve) {
        require(['views/dispatch/dispatchOrderCheck.vue'], resolve);
      }
    },
    //调拨--调拨单编辑
    '/d/doe/:doCode': {
      name: 'dispatchOrderEdit',
      component(resolve) {
        require(['views/dispatch/modules/dispatchAdd.vue'], resolve);
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
    '/d/to/:dtoTabindex': {
      name: 'transferOrder',
      component(resolve) {
        require(['views/dispatch/transferOrder.vue'], resolve);
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
    //付款管理
    '/f/pm/:fpmTabIndex': {
      name: 'paymentManage',
      component(resolve) {
        require(['views/finance/paymentManage.vue'], resolve);
      }
    },
    //财务--收款管理
    '/f/prm/:prmTabIndex': {
      name: 'proceedsManage',
      component(resolve) {
        require(['views/finance/proceedsManage.vue'], resolve);
      }
    },
    //财务--供应商对账单
    '/f/sac/:supplierName': {
      name: 'supplierAmountCheck',
      component(resolve) {
        require(['views/finance/supplierAmountCheck.vue'], resolve);
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
    //财务--发票管理
    '/f/imng/:imngTabIndex': {
      name: 'invoiceMNG',
      component(resolve) {
        require(['views/finance/invoiceMNG.vue'], resolve);
      }
    },
    //财务--客户管理
    '/f/cmng/:cmngTabIndex': {
      name: 'FcustomerMNG',
      component(resolve) {
        require(['views/finance/customerMNG.vue'], resolve);
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
    //商品
    //商品--品类管理
    '/g/sp': {
      name: 'goodsTypeManage',
      component(resolve) {
        require(['views/goods/goodsTypeManage.vue'], resolve);
      }
    },
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
    '/b/ue': {
      name: 'userEdit',
      component(resolve) {
        require(['views/baseConfig/userAdd.vue'], resolve);
      }
    },
    //基础设置-分仓管理
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
    //基础设置-分仓编辑
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
    '/b/s/:bsTabIndex': {
      name: 'supplierMNG',
      component(resolve) {
        require(['views/baseConfig/supplierMNG.vue'], resolve);
      }
    },
    //基础设置-供应商编辑
    '/b/se/:sid': {
      name: 'supplierEdit',
      component(resolve) {
        require(['views/baseConfig/modules/supplierAdd.vue'], resolve);
      }
    },
    //基础设置-客户管理
    '/b/c/:bcTabIndex': {
      name: 'customerMNG',
      component(resolve) {
        require(['views/baseConfig/customerMNG.vue'], resolve);
      }
    },
    //基础设置-客户编辑
    '/b/ce/:cid': {
      name: 'customerEdit',
      component(resolve) {
        require(['views/baseConfig/modules/customerAdd.vue'], resolve);
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
    },
  });
}
