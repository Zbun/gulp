<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
      <div class="action">
        <a href="javascript:history.back();"  class="item">返回</a>
      </div>
        查看出库单
        </h1>
    <div class="content-field invoices">
      <!--       <button class="btn btn-default ml10 fr" v-if="dataIn.datalist.ExpressStatus!=0" @click="print_Click()">打印</button> -->
      <h2 class="header">出库单</h2>
      <p class="invoices-summary">
        <strong class="ml20 text-warning">出库单号：{{dataIn.datalist.Code}}</strong>
      </p>
      <div class="invoices-detail">
        <div>
          <table class="table-intro">
            <tbody>
              <tr>
                <td>
                  <span class="title">
                    销售单号：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.SalesContractCode}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">
                    客户：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.CustomerName}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">
                    发货机构：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.BranchName}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">
                    发货分仓：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.StoreName}}&nbsp;
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="3">
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
          <table class="table table-bordered text-center">
            <thead>
              <tr>
                <th>商品编码</th>
                <th>品牌</th>
                <th>商品名称</th>
                <th>数量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item of dataIn.datalist.Details">
                <td class="text-nowrap">
                  {{item.ProId}}
                </td>
                <td>
                  {{item.CategoryName}}
                </td>
                <td>{{item.ProName}}<i class="icon-gift" v-if="item.ProType==0">礼</i></td>
                <td>
                  <p class="text-nowrap">
                    <a href="javascript:;" class="highlight text-nowrap" @click="checkSN_Click(item.ProId,dataIn.datalist.Code)">{{item.ProCount}}</a></p>
                </td>
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
                <span class="title">制单时间：</span>
                <span class="content">{{dataIn.datalist.DateAdded|datetime}}</span>
              </td>
              <td>
                <span class="title">备注：</span>
                <span class="content">{{dataIn.datalist.Description}}</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <check-sn :show.sync="isShowCheckSn" :Pro-Id="ProId" :Bill-Code="BillCode"></check-sn>
  </div>
</template>
<script>
import checkSn from './popup/checkSN.vue';
export default {
  data() {
      return {
        isShowCheckSn: false,
        ProId: '',
        curCode: '',
        BillCode: '',
        dataIn: {
          datalist: {}
        }
      }
    },
    components: {
      checkSn
    },
    methods: {
      initPageData() {
        var me = this;
        this.curCode = me.$route.params.loocOrder;
        fetchData({
          API: '/Api/Invoice/Preview',
          para: {
            'code': this.curCode
          },
          callback(data) {
            // console.log(data);
            me.dataIn.datalist = data;
          }
        })
      },
      checkSN_Click(ProId, BillCode) {
        this.ProId = ProId;
        this.BillCode = BillCode;
        this.isShowCheckSn = true;
      },
      //打印
      print_Click() {
        let me = this;
        fetchData({
          API: '/api/Misc/BillPrint',
          para: {
            code: this.curCode
          },
          callback(data) {
            var LODOP = getLodop();
            LODOP.PRINT_INIT("打印出库单");
            LODOP.SET_PRINT_STYLE("FontSize", 14);
            LODOP.SET_PRINT_STYLE("Bold", 1);
            // console.log(data);
            for (let i = 0; i < data.length; i++) {
              LODOP.NewPage();
              LODOP.ADD_PRINT_HTM(5, '5%', '90%', '130mm', data[i].PrintContent);
            }
            LODOP.PREVIEW();
            me.initPageData(me.pageindex);
          }
        })

      },
    },
    ready() {
      this.initPageData();
    }
}
</script>
