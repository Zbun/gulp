<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div>
        查看销售退货单
        </h1>
    <div class="content-field invoices">
      <!--       <button class="btn btn-warning fr" v-if="dataIn.datalist.Status==3||dataIn.datalist.Status==16" @click="scanSn_Click()">扫码</button> -->
      <h2 class="header">销售退货单</h2>
      <p class="invoices-summary">
        <strong class="ml20 text-warning">退货单号：{{dataIn.datalist.Code}}</strong>
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
                    退款金额：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.TotalPrice|currency}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">
                    入库机构：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.BranchName}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">
                    入库分仓：
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
          <table class="table table-bordered table-hover  text-center">
            <thead>
              <tr>
                <th>商品编码</th>
                <th>品牌</th>
                <th>商品名称</th>
                <th>数量</th>
                <th>备注</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td colspan="3" class="text-right"><b>合计：</b></td>
                <td><b>{{goodsAddedCount}}</b></td>
                <td></td>
              </tr>
            </tfoot>
            <tbody>
              <tr v-for="item of dataIn.datalist.Details">
                <td class="text-nowrap">
                  {{item.ProId}}
                </td>
                <td>
                  {{item.CategoryName}}
                </td>
                <td>{{item.ProName}}<i class="icon-gift" v-if="item.ProType==0">礼</i></td>
                <td class="text-nowrap">{{item.ProCount}}</td>
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
      </div>
    </div>
    <!--     <scan-sn :show.sync="isShowScanSn" pop-title="入库串号扫描" :code="curCode" @on-after-submit="dispatchScanSn()" auto-match="1" :store-id="dataIn.datalist.StoreId" :api-list="scanSNAPIList" is-goback="1"></scan-sn> -->
  </div>
</template>
<script>
// import scanSn from 'vues/scanSN.vue';
export default {
  data() {
      return {
        dataIn: {
          datalist: {}
        },
        isShowScanSn: false,
        curCode: '',
      }
    },
    components: {
      // scanSn
    },
    computed: {
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
        this.curCode = me.$route.params.srocCode;
        fetchData({
          API: '/Api/RInvoice/Preview',
          para: {
            'code': me.curCode
          },
          callback(data) {
            // console.log(data);
            me.dataIn.datalist = data;
          }
        })
      },
      scanSn_Click(item) {
        this.isShowScanSn = true;
      },
      dispatchScanSn() {
        this.initPageData(this.pageindex);
      }
    },
    ready() {
      this.initPageData();
    }
}
</script>
