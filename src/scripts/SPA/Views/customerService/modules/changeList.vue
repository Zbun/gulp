<template>
  <div>
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
          <span class="mr5">商品名称</span>
      <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.ProName" maxlength="50" @keydown.enter="initPageData(1)">
      </span>
      <span class="ml20">
          <span class="mr5">串号</span>
      <input type="search" class="com-ipt width" placeholder="输入串号" v-model="dataOut.search.Imei" maxlength="50" @keydown.enter="initPageData(1)">
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <table class="table text-center table-hover table-odd table-bordered datalist">
      <thead>
        <tr>
          <th>商品名称</th>
          <th style="width:180px;">故障机串号</th>
          <th style="width:180px;">新机串号</th>
          <th style="width:180px;">操作人</th>
          <th style="width:180px;">换机时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            {{item.ProName}}
          </td>
          <td>
            <p class="text-nowrap">{{item.OldImei}}</p>
          </td>
          <td>
            <p class="text-nowrap">{{item.NewImei}}</p>
          </td>
          <td>
            <p class="text-nowrap">{{item.UserNameAdded}}</p>
          </td>
          <td>
            <p class="text-nowrap">
              {{item.DateAdded|datetime}}
            </p>
          </td>
        </tr>
      </tbody>
      <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
        <tr>
          <td colspan=5>
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
    refresh: false
  },
  data() {
    return {
      pageindex: 1,
      APIS: {
        LIST: '/Api/imei/changeHistory',
        SUBMIT: '/Api/Borrow/Submit',
        DELETE: '/Api/Borrow/Delete',
        FORESHOW: '/Api/Borrow/InfoInsert'
      },
      dataIn: {
        inited: false,
        dataTable: {},
        storeList: []
      },
      dataOut: {
        search: {
          StartDate: '',
          EndDate: '',
          Code: '',
          Status: '',
          Imei: ''
        }
      }
    }
  },
  computed: {},
  components: {

  },
  methods: {
    initPageData(pageindex = 1) {
      this.pageindex = pageindex;
      var me = this;
      var para = this.dataOut.search;
      para.PageIndex = pageindex;
      para.PageSize = 15;
      fetchData({
        API: this.APIS.LIST,
        para,
        callback(data) {
          // console.table(data.Data);
          me.dataIn.inited = true;
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
        }
      })
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
