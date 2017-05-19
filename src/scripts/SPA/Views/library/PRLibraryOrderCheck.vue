<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div>
        采购退货出库单
        </h1>
    <div class="content-field invoices">
      <h2 class="header">采购退货出库单</h2>
      <p class="invoices-summary">
        <strong class="ml20 text-warning">库单号：{{dataIn.datalist.Code}}</strong>
      </p>
      <div class="invoices-detail">
        <div>
          <table class="table-intro">
            <tbody>
              <tr>
                <td>
                  <span class="title">
                    退货单号：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.RPurchasingContractCode}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">
                    供应商家：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.SupplierName}}
                  </span>
                </td>
                <td>
                  <span class="title">
                    是否发票：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.Receipt==1?'是':'否'}}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="title">
                    退货机构：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.BranchName}}
                  </span>
                </td>
                <td>
                  <span class="title">
                    退货分仓：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.StoreName}}&nbsp;
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
          <table class="table table-bordered  text-center">
            <thead>
              <tr>
                <th>
                  商品编码
                </th>
                <th>
                  品牌
                </th>
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
                <td>
                  <span class="title">备注：</span>
                  <span class="content">{{dataIn.datalist.Description}}</span>
                </td>
              </tr>
            </tbody>
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
        curCode: '',
        dataIn: {
          datalist: {}
        }
      }
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
        this.curCode = me.$route.params.lproCode;
        fetchData({
          API: '/Api/RReceiving/Preview',
          para: {
            'code': this.curCode
          },
          callback(data) {
            // console.log(data);
            me.dataIn.datalist = data;
          }
        })
      },
    },
    ready() {
      this.initPageData();
    }
}
</script>
