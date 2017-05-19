<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
      <div class="action">
        <a href="javascript:history.back();"  class="item">返回</a>
      </div>
        查看入库单
        </h1>
    <div class="content-field invoices">
      <h2 class="header">入库单</h2>
      <p class="invoices-summary">
        <strong class="ml20 text-warning">入库单号：{{dataIn.datalist.Code}}</strong>
      </p>
      <div class="invoices-detail">
        <div>
          <table class="table-intro">
            <tbody>
              <tr>
                <td>
                  <span class="title">
                    收货机构：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.BranchName}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">
                    收货分仓：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.StoreName}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">
                    供应商家：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.SupplierName}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">
                    采购单号：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.PurchasingContractCode}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">
                    经手人：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.HandlerName}}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-list">
          <table class="table table-bordered table-hover  text-center">
            <thead>
              <tr>
                <th>商品编码</th>
                <th>品牌</th>
                <th>商品名称</th>
                <th>标准</th>
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
                <td>{{item.ProName}}</td>
                <td>
                  <p class="text-nowrap">
                    {{item.Standard|SNStandard}}
                  </p>
                </td>
                <td class="text-nowrap"><a href="javascript:;" class="highlight" @click="checkSN_Click(item.ProId,dataIn.datalist.Code)">{{item.ProCount}}</a></td>
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
                    &#12288;库管：
                  </span>
                <span class="content">
                    {{dataIn.datalist.UserNameAdded}}&nbsp;
                  </span>
              </td>
              <td>
                <span class="title">入库日期：</span>
                <span class="content">{{dataIn.datalist.DateAdded|datetime}}</span>
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
        BillCode: '',
        curCode: '',
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
        this.curCode = me.$route.params.lioCode;
        fetchData({
          API: 'api/Receiving/Preview',
          para: {
            'code': this.curCode
          },
          callback(data) {
            // console.log(data);
            data.Details.forEach(function(item) {
              if (data.Status == 6) {
                item.ProCountIn = item.ProCount;
              } else {
                item.ProCountIn = 0;
              }
            })
            me.dataIn.datalist = data;
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
