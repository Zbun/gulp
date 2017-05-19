<template>
  <div class="main" v-cloak>
    <div class="content-title">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div>
      查看销售单
    </div>
    <div class="content-field invoices">
      <button class="btn btn-default fr" @click="print_Click()">
        打印
      </button>
      <button class="btn btn-warning fr mr10" v-if="dataIn.datalist.Status==3||dataIn.datalist.Status==16" @click="scanSn_Click()">扫码</button>
      <h2 class="header">销售单</h2>
      <p class="invoices-summary">
        <strong class="ml20 text-warning">销售单号：{{dataIn.datalist.Code}}</strong>
      </p>
      <div class="invoices-detail">
        <div>
          <table class="table-intro">
            <tbody>
              <tr>
                <td>
                  <span class="title">
                    客户：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.CustomerName}}
                  </span>
                </td>
                <td>
                  <span class="title">
                    出库机构：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.BranchName}}
                  </span>
                </td>
                <td>
                  <span class="title">
                    出库分仓：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.StoreName}}
                  </span>
                </td>
                <td>
                  <span class="title">
                    结算方式：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.PayType|payType}}
                  </span>
                </td>
                <td>
                  <span class="title">
                    是否含票：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.Receipt|receipt}}&nbsp;
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="5">
                  <span class="title">
                    收货信息：
                  </span>
                  <span class="content">
                    <span class="font-small">（收货人）</span> {{dataIn.datalist.Contact}}
                  <span class="font-small ml30">（电话）</span> {{dataIn.datalist.Phone}}
                  <span class="font-small ml30">（地址）</span> {{dataIn.datalist.Address}}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-list">
          <table class="table table-bordered  text-center">
            <thead>
              <tr>
                <th>商品编码</th>
                <th>商品名称</th>
                <th>数量</th>
                <th>备注</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td colspan="2" class="text-right"><b>合计：</b></td>
                <td><b>{{goodsAddedCount}}</b></td>
                <td></td>
              </tr>
            </tfoot>
            <tbody>
              <tr v-for="item of dataIn.datalist.Details">
                <td>
                  <p class="text-nowrap">
                    {{item.ProId}}
                  </p>
                </td>
                <td>{{item.ProName}}<i class="icon-gift" v-if="item.ProType==0">礼</i></td>
                <td>{{item.ProCount}}</td>
                <td>{{item.Description?item.Description:'暂无'}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-po-status" :class="'bg-po-status-'+dataIn.datalist.Status">
          <i class="icon"></i>
        </div>
        <div class="made-info">
          <table class="table-intro">
            <tbody>
              <tr>
                <td>
                  <span class="title">
                    &#12288;制单人：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.UserNameAdded}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">制单时间：</span>
                  <span class="content">{{dataIn.datalist.DateAdded|datetime}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="audit-flow" v-if="computedAuditString.length>0">
          <span class="title">
              审批流程：
            </span>
          <span class="content list">
              <span class="item" :class="{on:item.isAudited==true}" v-for="item in dataIn.datalist.AuditingString">
               {{item.UserName}}
              </span>
          </span>
        </div>
        <ul class="audit-list show" v-if="dataIn.datalist.AuditingChked.length>0">
          <li v-for="item in dataIn.datalist.AuditingChked">
            <span class="date">
                  <span class="inner">{{item.OpinionDate|datetime}}
                  </span>
            </span>
            <div class="detail">
              <h4 class="user">审批人：{{item.UserName}}</h4>
              <div class="opinion font-small mt5">
                <div>
                  <span class="status mr20 mr30">是否同意：{{item.OpinionResult|yesOrNo}}</span>
                  <span class="opinion">审批意见：{{item.OpinionDesc}}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <scan-sn :show.sync="isShowScanSn" pop-title="出库串号扫描" :code="curCode" @on-after-submit="dispatchScanSn()" :store-id="dataIn.datalist.StoreId" auto-match="1" :receipt="dataIn.datalist.Receipt" :api-list="scanSNAPIList" is-goback="1"></scan-sn>
  </div>
</template>
<script>
import scanSn from 'vues/scanSN.vue';
export default {
  data() {
      return {
        isShowScanSn: false,
        curCode: '',
        curStoreId: '',
        dataIn: {
          datalist: {}
        },
        scanSNAPIList: {
          ready: '/Api/SO/SOImeiReady',
          submit: '/Api/SO/InvoiceInsert',
          imeiChk: '/Api/Imei/SOChk'
        }
      }
    },
    components: {
      scanSn
    },
    computed: {
      computedAuditString() {
        var arrTemp = [];
        var arrAS = this.dataIn.datalist.AuditingString || [];
        var i = 0;
        if (arrAS && arrAS.length > 0) {
          i = _.findIndex(arrAS, {
            Id: this.dataIn.datalist.CurrentUserId + ''
          });
          for (var j = 0; j <= i; j++) {
            arrAS[j].isAudited = true;
          }
        }
        return arrAS;
      },
      goodsAddedCount() {
        var count = 0;
        this.dataIn.datalist.Details.forEach(function(i) {
          count += parseInt(i.ProCount);
        });
        return count;
      },
    },
    methods: {
      initPageData() {
        var me = this;
        this.curCode = me.$route.params.soccode;
        fetchData({
          API: '/Api/SO/SCPreview',
          para: {
            'code': this.curCode
          },
          callback(data) {
            // console.log(data);
            me.dataIn.datalist = data;
          }
        })
      },
      scanSn_Click(item) {
        // this.curCode = item.Code;
        // this.curStoreId = item.StoreId;
        this.isShowScanSn = true;
      },
      print_Click() {
        let me = this;
        fetchData({
          API: '/api/Misc/BillPrint',
          para: {
            code: this.curCode
          },
          callback(data) {
            try {
              var LODOP = getLodop();
              if (LODOP) {
                LODOP.PRINT_INIT("打印单据");
                LODOP.SET_PRINT_STYLE("FontSize", 14);
                LODOP.SET_PRINT_STYLE("Bold", 1);
                for (let i = 0; i < data.length; i++) {
                  LODOP.NewPage();
                  LODOP.ADD_PRINT_HTM(5, '5%', '90%', '130mm', data[i].PrintContent);
                }
                // LODOP.PREVIEW();
                if (LODOP.CVERSION) {
                  LODOP.On_Return = function(taskID, Value) {
                    if (Value > 0) {
                      fetchData({
                        API: '/API/MISC/PrintCountUpdate',
                        para: {
                          Code: me.curCode
                        },
                        hideTips: true
                      })
                    } else {
                      alert('放弃打印');
                    }
                  };
                  LODOP.PREVIEW();
                } else {
                  if (LODOP.PRINTA()) {
                    alert('直接加入打印队列');
                  } else {
                    alert('直接放弃打印');
                  }
                }
              }
            } catch (e) {
              console.log(e);
            }
          }
        })
      },
    },
    ready() {
      this.initPageData();
    }
}
</script>
