<template>
  <div>
    <div class="search clearfix mt20">
      <span class="mr5">时间段</span>
      <span class="date-field">
            <input type="text" v-model="dataOut.search.StartDate" readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'endDate\')}'})">
            <i class="fa fa-calendar icon"></i>
          </span>
      <span> - </span>
      <span class="date-field">
            <input type="text" v-model="dataOut.search.EndDate" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({minDate: '#F{$dp.$D(\'startDate\')}'})">
            <i class="fa fa-calendar icon"></i>
         </span> <span class="ml20">
        <span class="mr5">客户</span>
      <span class="intelligent-match">
        <span class="">
                <input type="search" class="select-long" placeholder="输入关键字，点击选择" v-model="intelligentMatch.customerName" @focus="IMIptFocus()" @input="IMIptInput()">
              </span>
      <ul class="list" v-show="intelligentMatch.isShow&&computedFilterCustomerInfo.length>0">
        <li class="item" v-for="item in computedFilterCustomerInfo" @click="selectedThisCustomerId(item)">{{item.Name}}</li>
      </ul>
      </span>
      </span>
      <span class="ml20">
          <span class="mr5">单号</span>
      <input type="search" class="com-ipt width" placeholder="输入单号" v-model="dataOut.search.BillCode" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <table class="table text-center table-hover table-odd table-bordered datalist">
      <thead>
        <tr>
          <th>客户</th>
          <th>来源单号</th>
          <th>日期</th>
          <th>应收金额（元）</th>
          <th>已收金额（元）</th>
          <th>
            操作
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            {{item.CustomerName}}
          </td>
          <td>
            <p class="text-nowrap">
              <a v-if="3==item.BillType" v-link="{name:'salesOrderCheck',params:{soccode:item.BillCode}}" class="highlight">{{item.BillCode}}</a>
              <a v-if="4==item.BillType" v-link="{name:'salesReturnOrderCheck',params:{srocCode:item.BillCode}}" class="highlight">{{item.BillCode}}</a>
            </p>
          </td>
          <td>
            <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
          </td>
          <td>
            <p class="text-nowrap price-show">{{item.Amount}}</p>
          </td>
          <td>
            <p class="text-nowrap price-show">{{item.AmountPayed}}</p>
          </td>
          <td>
            <div class="action">
              <a href="javascript:;" class="item" v-if="item.Status>0" @click="detail_Click(item.BillCode)">明细</a>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
        <tr>
          <td colspan=6>
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
    <popup-order-detail :show.sync="isShowOrderDetail" :bill-code="curBillCode" :datalist="popupBillOrderDetail"></popup-order-detail>
  </div>
</template>
<script>
import popupOrderDetail from './../popup/popupProceedsDetail.vue';
export default {
  props: {
    payedOk: {
      twoway: true,
      default: false
    },
    arrCustomerList: []
  },
  data() {
    return {
      pageindex: 1,
      isShowOrderDetail: false,
      curBillCode: '',
      popupBillOrderDetail: [],
      APILIST: {
        LIST: '/Api/Finance/ARList'
      },
      intelligentMatch: {
        isShow: false,
        customerName: ''
      },
      dataIn: {
        inited: false,
        dataTable: [],
        customerList: []
      },
      dataOut: {
        search: {
          StartDate: '',
          EndDate: '',
          BillCode: '',
          Status: 2,
          CustomerId: ''
        }
      }
    }
  },
  components: {
    popupOrderDetail
  },
  computed: {
    computedFilterCustomerInfo() {
      let me = this;
      if (validatorManu.isEmpty(this.intelligentMatch.customerName)) {
        return this.arrCustomerList;
      } else {
        return this.arrCustomerList.filter((item) => {
          return item.Name.indexOf(me.intelligentMatch.customerName.trim()) > -1;
        })
      }
    }
  },
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
    //明细点击
    detail_Click(billcode) {

      this.curBillCode = billcode;
      let me = this;
      fetchData({
        api: '/Api/Finance/ARHistory',
        para: {
          billcode: billcode
        },
        callback(data) {
          // console.table(data);
          me.popupBillOrderDetail = data;
          me.isShowOrderDetail = true;
        }
      })
    },
    //支收成功回调
    payAfter() {
      this.isShowPayOrder = false;
      this.initPageData(this.pageindex);
      this.payedOk = true;
      setTimeout(() => {
        this.payedOk = false;
      }, 1000)
    },
    IMIptFocus() {
      this.intelligentMatch.isShow = true;
    },
    IMIptInput() {
      this.dataOut.search.CustomerId = '';
    },
    selectedThisCustomerId(item) {
      this.dataOut.search.CustomerId = item.Id;
      this.intelligentMatch.customerName = item.Name;
      this.intelligentMatch.isShow = false;
    },
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
    payedOk(nV) {
      if (nV) {
        this.initPageData(1);
      }
    }
  }
}
</script>
