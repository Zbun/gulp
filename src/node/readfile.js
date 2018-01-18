var menu = [{
    name: "设置",
    icon: 'icon-set.png',
    children: [{
      name: "机构设置",
      url: "bbm"
    }, {
      name: "用户管理",
      url: "bu"
    }, {
      name: "仓库设置",
      url: "bsm"
    }, {
      name: "业务员管理",
      url: "bbmm"
    }, {
      name: "银行账户设置",
      url: "bb"
    }, {
      name: "客户管理",
      url: "bcustomer"
    }, {
      name: "物流信息设置",
      url: "blo"
    }, {
      name: "供应商管理",
      url: "bs"
    }, {
      name: "角色设置",
      url: "brolelist"
    }, {
      name: "商品管理",
      url: "gsp"
    }]
  }, {
    name: "采购",
    icon: 'icon-purchase.png',
    children: [{
      name: "采购",
      url: "po"
    }, {
      name: "采购返利",
      url: "pcf"
    }, {
      name: "采购退货",
      url: "pr"
    }, {
      name: "采购入库发票",
      url: "prl"
    }, {
      name: "采购保价",
      url: "pcb"
    }, {
      name: "采购退货发票",
      url: "prrl"
    }]
  },
  {
    name: "销售",
    icon: 'icon-sale.png',
    children: [{
        name: "销售",
        url: "soo"
      },
      {
        name: "销售出库发票",
        url: "srsl"
      }, {
        name: "销售退货",
        url: "ssro"
      },
      {
        name: "销售退货发票",
        url: "sral"
      }, {
        name: "销售返利",
        url: "psf"
      }
    ]
  },
  {
    name: "仓库",
    icon: 'icon-store.png',
    children: [{
      name: "转仓",
      url: "dts"
    }, {
      name: "售后",
      url: "asasr"
    }, {
      name: "调拨",
      url: "ddo"
    }, {
      name: "发货",
      url: "lpl"
    }, {
      name: "盘点",
      url: "lic"
    }, {
      name: "换机",
      url: "csrnl"
    }, {
      name: "借机",
      url: "lbcl"
    }, ]
  }, {
    name: "零售",
    icon: 'icon-retail.png',
    children: [{
      name: "收款配置",
      url: "rtps"
    }, {
      name: "日结",
      url: "rtco"
    }, {
      name: "零售开单",
      url: "rtoi"
    }, {
      name: "店员奖励",
      url: "rtre"
    }, {
      name: "门店要货",
      url: "rtafg"
    }, {
      name: "零售退货",
      url: "rtrt"
    }]
  },
  {
    name: "财务",
    icon: 'icon-finace.png',
    children: [{
        name: "财务单据",
        url: "fsmng"
      }, {
        name: "凭证审核",
        url: "blchk"
      }, {
        name: "收款",
        url: "fprm"
      }, {
        name: "科目明细账",
        url: "bas"
      },
      {
        name: "付款",
        url: "fpm"
      }, {
        name: "账目",
        url: "fbfc"
      }, {
        name: "手工凭证",
        url: "fil"
      }, {
        name: "结转",
        url: "fcf"
      }
    ]
  },
  {
    name: "报表",
    icon: 'icon-chart.png',
    children: [{
        name: "库存类",
        url: "stld"
      },
      {
        name: "经营类",
        url: "stlerp"
      },
      {
        name: "业务类",
        url: "stpage"
      },
      {
        name: "电商类",
        url: "ststoid"
      }
    ]
  },
  {
    name: "订货平台",
    icon: 'icon-es.png',
    children: [{
      name: "基础设置",
      url: "B2bsettingbasic"
    }, {
      name: "买家注册审核",
      url: "B2bcustomercustExamine"
    }, {
      name: "登录页设置",
      url: "B2bsettinghome"
    }, {
      name: "订单流程",
      url: "B2borderorderlist"
    }, {
      name: "广告",
      url: "B2badadManage"
    }, {
      name: "线下付款审核",
      url: "B2borderorderSummary"
    }, {
      name: "商品发布",
      url: "B2borderpromanage"
    }, {
      name: "退货审核",
      url: "B2borderreturnGoods"
    }, {
      name: "客户开通",
      url: "B2bcustomercustManage"
    }, {
      name: "促销活动",
      url: "B2bactivityactList"
    }, {
      name: "短信",
      url: "B2bmessagesetMsg"
    }, {
      name: "资金账户",
      url: "B2bcapitalcapitalAccount"
    }, {
      name: "支付配置",
      url: "B2bsettingpaySet"
    }, {
      name: "报表统计",
      url: "B2borderoutRecord"
    }]
  }
]

var arrTemp = menu.map(function(item) {
  var a1 = [];
  item.children.forEach(function(item) {
    a1.push(item.url);
  })
  return a1;
});
var arrVue = [];
arrTemp.forEach(function(item) {
  item.forEach(function(item) {
    arrVue.push(item);
  })
});
console.log(arrVue);

var fs = require('fs');

// fs.open('3.vue', 'w', 0644, function(e, fd) {
//   if (e) throw e;
// })

// var fnImport = function(src, filesrc) {

//     fs.readdir(filesrc, function(err, files) {
//         files.forEach(function(filename) {
//             fs.readFile(`${filesrc}${filename}`, {
//                 encoding: 'utf8'
//               }, function(err, data) {
//                 console.log(filename + 'OK');
//                 if (filename = 'eCorner.vue') {
//                   var dataReplace = data.replace(.*gi, '');
//                   fs.writeFile(filename, dataReplace, {
//                     encoding: 'utf8'
//                   }, function(err) {
//                     if (err) throw err;
//                     console.log(filename + 'OK');
//                   })
//                 }


//                 dataReplace = dataReplace.replace("\.\.\g, '"
//                   ');



//                 })
//             })


//         });
//     }

//     fnImport(src, filesrc);