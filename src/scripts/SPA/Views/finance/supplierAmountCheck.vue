<template>
  <div class="main">
    <h2 class="content-title"><span class="action" v-if="isShowReturn">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </span>供应商对账单</h2>
    <div class="content-field">
      <div class="search clearfix mt20">
        <span class="mr5">时间段</span>
        <span class="date-field">
            <input type="text" v-model="dataOut.search.StartDate"  readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'endDate\')}'})">
            <i class="fa fa-calendar icon"></i>
          </span>
        <span> - </span>
        <span class="date-field">
            <input type="text" v-model="dataOut.search.EndDate" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({minDate: '#F{$dp.$D(\'startDate\')}'})">
            <i class="fa fa-calendar icon"></i>
         </span>
        <span class="ml20">
          <span class="mr5">供应商</span>
        <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.SupplierName" @keydown.enter="search_Click()" maxlength="50">
        </span>
        <button class="btn btn-primary ml10" @click="search_Click()">搜索</button>
      </div>
      <table class="table text-center  table-bordered datalist">
        <thead>
          <tr>
            <th rowspan="2" class="td-warning-pure" style="width: 100px;">供应商</th>
            <th rowspan="2" class="td-warning-pure" style="width: 90px;">单据类型</th>
            <th rowspan="2" class="td-warning-pure" style="width: 140px;">单号</th>
            <th rowspan="2" class="td-warning-pure" style="width: 140px;">时间</th>
            <th rowspan="2" class="td-warning-pure">商品名称</th>
            <th rowspan="2" class="td-warning-pure" style="width: 90px;">单价</th>
            <th rowspan="2" class="td-warning-pure" style="width: 80px;">数量</th>
            <th rowspan="2" class="td-warning-pure" style="width: 110px;">本次应付</th>
            <th colspan="3" class="td-warning-pure">本次实付</th>
            <th colspan="3" class="td-warning-pure">期末余额</th>
          </tr>
          <tr>
            <th class="td-warning-pure" style="80px;">
              现金
            </th>
            <th class="td-warning-pure" style="80px;">
              额度
            </th>
            <th class="td-warning-pure" style="80px;">
              返利
            </th>
            <th class="td-warning-pure" style="80px;">
              现金
            </th>
            <th class="td-warning-pure" style="80px;">
              额度
            </th>
            <th class="td-warning-pure" style="80px;">
              返利
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item of dataIn.dataTable">
            <tr>
              <td :rowspan="item.ProDetails.length||1">
                <p>{{item.SupplierName}}</p>
              </td>
              <td :rowspan="item.ProDetails.length||1">
                {{item.BillType|financeBillType}}
              </td>
              <td :rowspan="item.ProDetails.length||1">
                <p class="text-nowrap">
                  {{item.BillCode}}
                </p>
              </td>
              <td :rowspan="item.ProDetails.length||1">
                <p class="text-nowrap"> {{item.DateAdded|datetime}}</p>
              </td>
              <td>
                <p>{{item.ProDetails[0].ProName}}</p>
              </td>
              <td>
                <p class="text-nowrap price-show">{{item.ProDetails[0].ProPrice}}</p>
              </td>
              <td>
                <p class="text-nowrap">{{item.ProDetails[0].ProCount}}</p>
              </td>
              <td :rowspan="item.ProDetails.length||1">
                <p class="text-nowrap">{{item.ShouldPay}}</p>
              </td>
              <td :rowspan="item.ProDetails.length||1" class="bg-currency">
                <p class="text-nowrap">{{item.RealPayCash}}</p>
              </td>
              <td :rowspan="item.ProDetails.length||1" class="bg-currency">
                <p class="text-nowrap">{{item.RealPayCredit}}</p>
              </td>
              <td :rowspan="item.ProDetails.length||1" class="bg-currency">
                <p class="text-nowrap">{{item.RealPayRebate}}</p>
              </td>
              <td :rowspan="item.ProDetails.length||1" class="bg-currency">
                <p class="text-nowrap">{{item.EndingCash}}</p>
              </td>
              <td :rowspan="item.ProDetails.length||1" class="bg-currency">
                <p class="text-nowrap">{{item.EndingCredit}}</p>
              </td>
              <td :rowspan="item.ProDetails.length||1" class="bg-currency">
                <p class="text-nowrap">{{item.EndingRebate}}</p>
              </td>
            </tr>
            <tr v-for="item2 in item.ProDetails.slice(1)">
              <td>
                <p>{{item2.ProName}}</p>
              </td>
              <td>
                <p class="text-nowrap price-show">{{item2.ProPrice}}</p>
              </td>
              <td>
                <p class="text-nowrap">{{item2.ProCount}}</p>
              </td>
            </tr>
          </template>
        </tbody>
        <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
          <tr>
            <td colspan=14>
              <div class="data-empty">
                <i class="icon"></i>
                <p class="font-big text">暂无相关数据</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-center">
        <div class="pageBox"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        isShowOrderDetail: false,
        pageindex: 1,
        curBillOrder: '',
        popupBillOrderDetail: [],
        isShowReturn: false,
        APILIST: {
          LIST: 'Api/Finance/SupplierAccountBalance'
        },
        dataIn: {
          inited: false,
          dataTable: {}
        },
        dataOut: {
          search: {
            StartDate: '',
            EndDate: '',
            SupplierName: ''
          }
        }
      }
    },
    components: {},
    methods: {
      initPageData(pageindex = 1) {
        this.pageindex = pageindex;
        var me = this;
        var para = this.dataOut.search;
        para.PageIndex = pageindex;
        para.PageSize = 15;
        fetchData({
          API: this.APILIST.LIST,
          para,
          callback(data) {
            // console.log(data);
            me.dataIn.inited = true;
            me.dataIn.dataTable = data.Data;
            initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
          }
        })
      },
      search_Click() {
        if (!this.dataOut.search.SupplierName.length) {
          showTips('请输入供应商名称进行搜索', 'error');
          return;
        }
        this.initPageData(1);
      }
    },
    ready() {
      this.dataOut.search.StartDate = zmm_date.getTheDay({
        x: parseInt(window.localStorage.DISSTARTDATE) || -7
      });
      this.dataOut.search.EndDate = zmm_date.getTheDay({
        x: parseInt(window.localStorage.DISENDDATE) || 0
      });
      if (this.$route.params.supplierName != 0) {
        this.isShowReturn = true;
        this.dataOut.search.SupplierName = this.$route.params.supplierName;
        this.initPageData(1);
      }
    }
}
</script>
