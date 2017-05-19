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
         </span>
      <span class="ml20">
          <span class="mr5">供应商</span>
      <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.SupplierName" maxlength="50">
      </span>
      <span class="ml20">
          <span class="mr5">单号</span>
      <input type="search" class="com-ipt width" placeholder="输入单号" v-model="dataOut.search.BillCode" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      <span class="ml20">
          <span class="mr5">状态</span>
      <select v-model="dataOut.search.Status">
        <option value="">请选择</option>
        <option value="0">待收款</option>
        <option value="1">部分收款</option>
      </select>
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <table class="table text-center table-hover table-odd table-bordered datalist">
      <thead>
        <tr>
          <th>供应商</th>
          <th>来源单号</th>
          <th>日期</th>
          <th>应付金额（元）</th>
          <th>已付金额（元）</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            {{item.SupplierName}}
          </td>
          <td>
            <p class="text-nowrap">
              <!--               <a v-if="1==item.BillType" v-link="{name:'transferOrderCheck',params:{tocCode:item.BillCode}}" class="highlight">{{item.BillCode}}</a> -->
              <a v-if="1==item.BillType" v-link="{name:'purchaseOrderCheck',params:{pocode:item.BillCode}}" class="highlight">{{item.BillCode}}</a>
              <a v-if="2==item.BillType" v-link="{name:'purchaseReturnCheck',params:{precCode:item.BillCode}}" class="highlight">{{item.BillCode}}</a>
              <!--               <a v-if="2==item.BillType" href="javascript:;" class="highlight" @click="checkAdjust_Click(item.BillCode)">{{item.BillCode}}</a> -->
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
            <p class="text-nowrap"> {{item.Status|payedStatus}}</p>
          </td>
          <td>
            <div class="action">
              <a href="javascript:;" v-if="item.Status!=2" @click="pay_Click(item.BillCode)" class="item">付款</a>
              <a href="javascript:;" class="item" v-if="item.Status!=0" @click="detail_Click(item.BillCode)">明细</a>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
        <tr>
          <td colspan=7>
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
    <popup-pay-order :show.sync="isShowPayOrder" @on-after-submit="payAfter" :bill-code="curBillCode"></popup-pay-order>
    <popup-adjust-check :show.sync="isShowAdjustCheck" :cur-code="curBillCode"></popup-adjust-check>
  </div>
</template>
<script>
import popupPayOrder from './../popup/popupPayOrder.vue';
import popupOrderDetail from './../popup/popupOrderDetail.vue';
import popupAdjustCheck from './../popup/popupAdjustCheck.vue';
export default {
  props: {
    payedOk: {
      twoway: true,
      default: false
    }
  },
  data() {
    return {
      isShowOrderDetail: false,
      isShowPayOrder: false,
      isShowAdjustCheck: false,
      pageindex: 1,
      curBillCode: '',
      popupBillOrderDetail: [],
      dataIn: {
        inited: false,
        dataTable: {}
      },
      dataOut: {
        search: {
          StartDate: '',
          EndDate: '',
          BillCode: '',
          Status: '',
        }
      }

    }
  },
  components: {
    popupOrderDetail,
    popupPayOrder,
    popupAdjustCheck
  },
  methods: {
    initPageData(pageindex = 1) {
      this.pageindex = pageindex;
      var me = this;
      var para = this.dataOut.search;
      para.PageIndex = pageindex;
      para.PageSize = 15;
      fetchData({
        API: '/api/Finance/APList',
        para,
        callback(data) {
          // console.log(data);
          me.dataIn.inited = true;
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
        }
      })
    },
    //支付成功回调
    payAfter() {
      this.isShowPayOrder = false;
      this.initPageData(this.pageindex);
      this.payedOk = true;
      setTimeout(() => {
        this.payedOk = false;
      }, 1000)
    },
    //付款点击
    pay_Click(billcode) {
      this.isShowPayOrder = true;
      this.curBillCode = billcode;
    },
    //调整历史查看弹窗
    checkAdjust_Click(billcode) {
      this.isShowAdjustCheck = true;
      this.curBillCode = billcode;
    },
    //明细点击
    detail_Click(billcode, cid) {

      this.curBillCode = billcode;
      let me = this;
      fetchData({
        api: '/api/Finance/APHistory',
        para: {
          billcode: billcode,
        },
        callback(data) {
          me.popupBillOrderDetail = data;
          me.isShowOrderDetail = true;
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
  }
}
</script>
