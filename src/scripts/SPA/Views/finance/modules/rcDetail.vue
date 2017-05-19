<template>
  <div>
    <div class="search clearfix mt20">
      <span>
        <span class="mr5 required-mark">类型</span>
      <select v-model="dataOut.search.CustomerType">
        <option value="0">供应商</option>
        <option value="1">客户</option>
      </select>
      </span>
      <span class="mr5 ml20">时间段</span>
      <span class="date-field">
            <input type="text" v-model="dataOut.search.StartDate"  readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'endDate\')}'})">
            <i class="fa fa-calendar icon"></i>
          </span>
      <span> - </span>
      <span class="date-field">
            <input type="text" v-model="dataOut.search.EndDate" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({minDate: '#F{$dp.$D(\'startDate\')}'})">
            <i class="fa fa-calendar icon"></i>
         </span>
      <span class="ml20">名称</span>
      <input type="text" placeholder="输入关键字" v-model="dataOut.search.CustomerName" @keydown.enter="initPageData(1)">
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <table class="table text-center table-hover table-odd table-bordered datalist">
      <thead>
        <tr>
          <th><span v-if="isShowSupplierColumn">供应商</span><span v-else>客户</span></th>
          <th style="width:220px">单号</th>
          <th style="width:200px">金额</th>
          <th v-if="accountType==11">使用比例</th>
          <th style="width:200px">操作人</th>
          <th style="width:200px">时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td class="text-nowrap">
            <p v-if="isShowSupplierColumn">{{item.SupplierName}}</p>
            <p v-else>{{item.CustomerName}}</p>
          </td>
          <td>
            {{item.BillCode}}
          </td>
          <td class="text-nowrap text-right" :class="{'bg-currency':item.Amount>0}">
            {{item.Amount|currency}}
          </td>
          <td v-if="11==accountType" class="text-nowrap">
            {{item.CanUsedRate}}%
          </td>
          <td>
            {{item.UserNameAdded}}
          </td>
          <td>
            <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
          </td>
        </tr>
      </tbody>
      <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
        <tr>
          <td :colspan="accountType==11?6:5">
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
</template>
<script>
export default {
  props: {
    loadedFirst: false,
    refresh: false,
    accountType: ''
  },
  data() {
    return {
      pageindex: 1,
      dataIn: {
        inited: false,
        dataTable: {},
      },
      APILIST: {
        LIST: ['API/Finance/SupplierAccountHistory', 'API/Finance/CustomerAccountHistory']
      },
      isShowSupplierColumn: true,
      dataOut: {
        search: {
          CustomerType: 0,
          CustomerName: '',
          StartDate: '',
          EndDate: '',
        }
      }
    }
  },
  computed: {},
  components: {},
  methods: {
    initPageData(pageindex = 1) {
      this.pageindex = pageindex;
      this.refresh = false;
      var me = this;
      var para = this.dataOut.search;
      para.accountType = this.accountType;
      para.PageIndex = pageindex;
      para.PageSize = 15;
      fetchData({
        API: this.APILIST.LIST[this.dataOut.search.CustomerType],
        para,
        callback(data) {
          me.getIsShowSupplierColumn();
          me.dataIn.inited = true;
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
        }
      })
    },
    getIsShowSupplierColumn() {
      this.isShowSupplierColumn = !+this.dataOut.search.CustomerType;
    }
  },
  ready() {
    this.dataOut.search.StartDate = zmm_date.getTheDay({
      x: parseInt(window.localStorage.DISSTARTDATE) || -7
    });
    this.dataOut.search.EndDate = zmm_date.getTheDay({
      x: parseInt(window.localStorage.DISENDDATE) || 0
    });
    this.initPageData(1);
  },
  watch: {
    refresh(newVal) {
      if (newVal) {
        this.initPageData(1);
      }
    }
  }
}
</script>
