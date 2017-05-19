<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
      <div class="action">
        <a href="javascript:history.back();"  class="item">返回</a>
      </div>
        查看调剂单
        </h1>
    <div class="content-field invoices">
      <button class="btn btn-default fr" @click="print_Click()">
        打印
      </button>
      <h2 class="header">调剂单</h2>
      <p class="invoices-summary">
        <strong class="ml20 text-warning">单号：{{dataIn.datalist.Code}}</strong>
      </p>
      <div class="invoices-detail">
        <div>
          <table class="table-intro">
            <tbody>
              <tr>
                <td>
                  <span class="title">
                    调剂类型：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.TransferType|transferType}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">
                    调出方：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.OutCustomerName}}
                  </span>
                </td>
                <td>
                  <span class="title">
                    调入方：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.InCustomerName}}
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
                <th>商品名称</th>
                <th>数量</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item of dataIn.datalist.Details">
                <td>{{item.ProName}}</td>
                <td>
                  <p class="text-nowrap">
                    <a href="javascript:;" class="highlight text-nowrap" @click="checkSN_Click(item.ProId,dataIn.datalist.Code)">{{item.ProCount}}</a></p>
                </td>
                <td>{{item.Description}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="dataIn.datalist.Status==1" class="bg-po-status" :class="'bg-po-audit-status-'+dataIn.datalist.AuditingStatus">
          <i class="icon"></i>
        </div>
        <div v-else class="bg-po-status" :class="'bg-po-status-'+dataIn.datalist.Status">
          <i class="icon"></i>
        </div>
        <div class="made-info">
          <table class="table-intro">
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
                <span class="title">预告日期：</span>
                <span class="content">{{dataIn.datalist.DateAdded|datetime}}</span>
              </td>
              <td>
                <span class="title">
                    摘要：
                  </span>
                <span class="content">
                  {{dataIn.datalist.Description?dataIn.datalist.Description:'暂无'}}
                </span>
              </td>
            </tr>
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
      <check-sn :show.sync="isShowCheckSn" :Pro-Id="ProId" :Bill-Code="BillCode"></check-sn>
    </div>
  </div>
</template>
<script>
import checkSn from 'vues/checkSN.vue';
export default {
  data() {
      return {
        isShowCheckSn: false,
        ProId: '',
        BillCode: '',
        curCode: '',
        API: {
          preview: '/Api/Transfer/CTPreview'
        },
        dataIn: {
          datalist: {}
        }
      }
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
      }
    },
    components: {
      checkSn,
    },
    methods: {
      initPageData() {
        var me = this;
        this.curCode = me.$route.params.tocCode;
        fetchData({
          API: this.API.preview,
          para: {
            code: this.curCode
          },
          callback(data) {
            // console.log(data);
            me.dataIn.datalist = data;
          }
        })
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
                LODOP.PRINT_INIT("打印调剂单");
                LODOP.SET_PRINT_STYLE("FontSize", 14);
                LODOP.SET_PRINT_STYLE("Bold", 1);
                // LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', true); //开启打印机状态捕获
                for (let i = 0; i < data.length; i++) {
                  LODOP.NewPage();
                  LODOP.ADD_PRINT_HTM(5, '5%', '90%', '130mm', data[i].PrintContent);
                }
                // LODOP.PREVIEW();
                if (LODOP.CVERSION) {
                  LODOP.On_Return = function(taskID, Value) {
                    // P_ID = Value;
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
                    // console.log(getStatusValue('PRINT_STATUS_OK', Value))
                  };
                  LODOP.PREVIEW();
                } else {
                  // P_ID = me.LODOP.PRINTA();
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
      checkSN_Click(ProId, BillCode) {
        this.ProId = ProId;
        this.BillCode = BillCode;
        this.isShowCheckSn = true;
      }
    },
    ready() {
      this.initPageData();
    }
}
</script>
