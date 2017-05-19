<template>
  <div class="main">
    <h2 class="content-title">串号发票调整</h2>
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
                <span class="mr5">单号</span>
        <input type="search" class="select-long" placeholder="请输入采购单号" v-model="dataOut.search.PurchasingContractCode" @keydown.enter="initPageData(1)">
        </span>
        <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table text-center table-hover table-odd table-bordered datalist">
        <thead>
          <tr>
            <th>采购单号</th>
            <th>供应商</th>
            <th>时间</th>
            <th>商品</th>
            <th>数量</th>
            <th>采购价/台</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(i,el) of dataIn.dataTable">
            <tr v-for="(j,item) in el.Details" :style="{backgroundColor:i%2==1?'#fdfdfd':'#fff'}">
              <td :rowspan="el.Details.length" v-if="j==0">
                <p class="">{{el.PurchasingContractCode}}</p>
              </td>
              <td :rowspan="el.Details.length" v-if="j==0">{{el.SupplierName}}</td>
              <td :rowspan="el.Details.length" v-if="j==0">
                <p class="text-nowrap">{{el.DateAdded|datetime}}</p>
              </td>
              <td>
                <p class="text-nowrap">
                  {{item.ProName}}
                </p>
              </td>
              <td>
                <p class="text-nowrap">
                  {{item.ProCount}}
                </p>
              </td>
              <td>
                <p class="text-nowrap price-show">{{item.ProPrice|money}}</p>
              </td>
              <td>
                <a href="javascript:;" class="highlight" @click="show_Click(el,item)">调整</a>
              </td>
            </tr>
          </template>
        </tbody>
        <tbody v-if="dataIn.dataTable.length==0">
          <tr>
            <td colspan=8>
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
    <adjust :show.sync="show" :obj="adjustObj"></adjust>
  </div>
</template>
<script>
import adjust from './popup/adjust.vue';
export default {
  data() {
    return {
      show: false,
      adjustObj: {},
      dataIn: {
        dataTable: []
      },
      dataOut: {
        search: {
          StartDate: '',
          EndDate: '',
          PurchasingContractCode: ''
        }
      },
    }
  },
  components: { adjust },
  methods: {
    show_Click(el, item) {
      item.Code = el.Code;
      this.adjustObj = item;
      this.show = true;
    },
    initPageData(pageindex = 1) {
      this.pageindex = pageindex;
      var me = this;
      var para = this.dataOut.search;
      para.PageIndex = pageindex;
      para.PageSize = 15;
      fetchData({
        API: '/Api/Finance/ReceivingReceiptList',
        para,
        callback: (data) => {
          this.dataIn.dataTable = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageindex);
        }
      })
    },

  },
  created() {
    this.dataOut.search.StartDate = zmm_date.getTheDay({
      x: parseInt(window.localStorage.DISSTARTDATE) || -7
    });
    this.dataOut.search.EndDate = zmm_date.getTheDay({
      x: parseInt(window.localStorage.DISENDDATE) || 0
    });
    this.initPageData(1);

  }
}

</script>