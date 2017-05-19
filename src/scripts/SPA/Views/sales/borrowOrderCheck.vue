<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div>
        查看借机单
        </h1>
    <div class="content-field invoices">
      <button class="btn btn-default fr" @click="print_Click()">
        打印
      </button>
      <h2 class="header">借机单</h2>
      <p class="invoices-summary">
        <strong class="ml20 text-warning">借机单号：{{dataIn.datalist.Code}}</strong>
      </p>
      <div class="invoices-detail">
        <div>
          <table class="table-intro">
            <tbody>
              <tr>
                <td>
                  <span class="title">
                    借机人：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.BorrowPerson}}
                  </span>
                </td>
                <td>
                  <span class="title">
                    预计归还时间：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.MaybeReturnDate|date}}
                  </span>
                </td>
                <td>
                  <span class="title">
                    借机仓库：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.StoreName}}&nbsp;
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
            <tfoot>
              <tr>
                <td><b>合计</b></td>
                <td><b>{{goodsAddedCount}}</b></td>
                <td></td>
              </tr>
            </tfoot>
            <tbody>
              <tr v-for="item of dataIn.datalist.Details">
                <td>{{item.ProName}}<i class="icon-gift" v-if="item.ProType==0">礼</i></td>
                <td>{{item.ProCount}}</td>
                <td>{{item.Description?item.Description:'暂无'}}</td>
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
                <td>
                  <span class="title">
                    摘要：
                  </span>
                  <span class="content">
                  {{dataIn.datalist.Description?dataIn.datalist.Description:'暂无'}}
                </span>
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
  </div>
</template>
<script>
export default {
  data() {
      return {
        curCode: '',
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
        this.curCode = me.$route.params.cbocCode;
        fetchData({
          API: '/Api/Borrow/Preview',
          para: {
            'code': this.curCode
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
