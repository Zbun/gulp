<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
      <div class="action">
        <a href="javascript:history.back();"  class="item">返回</a>
      </div>
        查看{{billType}}库单
        </h1>
    <div class="content-field invoices">
      <button class="btn btn-default fr" @click="print_Click()">
        打印
      </button>
      <h2 class="header">{{billType}}库单</h2>
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
                    {{billType}}货仓库：
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
          <table class="table table-bordered text-center">
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
                <td>{{item.ProCount}}</td>
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
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        API: {
          preview: '/Api/Transfer/TRPreview'
        },
        curCode: '',
        dataIn: {
          datalist: {}
        }
      }
    },
    computed: {

      billType() {
        return this.dataIn.datalist.BillType == 0 ? '出' : '入';
      }
    },
    methods: {
      initPageData() {
        var me = this;
        this.curCode = me.$route.params.dolcCode;
        fetchData({
          API: this.API.preview,
          para: {
            code: this.curCode
          },
          callback(data) {
            console.log(data);
            data.Details.forEach(function(item) {
              if (data.Status == 6) {
                item.ProCountOut = item.ProCount;
              } else {
                item.ProCountOut = 0;
              }
            })
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
                LODOP.PRINT_INIT("打印调拨单");
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
    },
    ready() {
      this.initPageData();
    }
}
</script>
