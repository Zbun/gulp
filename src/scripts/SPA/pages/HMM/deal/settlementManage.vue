<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <span class="fr">
          <button class="btn ml5" onclick="alert('稍候实现')">导出</button>
        </span> 单据号:
        <input type="search" placeholder="请输入订单号/支付编号" class="com-ipt ipt-search " v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <select v-model="dataOut.search.TimeType" class="ml5">
          <option value="1">下单时间</option>
          <option value="2">付款时间</option>
          <option value="3">完成时间</option>
        </select>
        <span class="date-field ml5">
          <input type="text" class="com-ipt " placeholder="开始时间" id="start" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'end\')}'})" ref="Start" @focus="changeTime()" v-model="dataOut.search.Start">
        </span> -
        <span class="date-field">
          <input type="text" class="com-ipt " placeholder="结束时间" id="end" onclick="WdatePicker({minDate: '#F{$dp.$D(\'start\')}'})" ref="End" @focus="changeTime()" v-model="dataOut.search.End">
        </span>
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <div class="ovh-y">
        <table class="table table-bordered datalist table-hover">
          <thead>
            <tr>
              <th style="width:60px;">
                <label class="checkbox">
                  <input type="checkbox" :checked="arrChkedId.length>0&&arrChkedId.length==dataIn.arrDataList.length" @change="chooseAll($event)">
                  <span class="icon"></span>
                </label>
              </th>
              <th style="width:200px">订单号/支付单号</th>
              <th style="width:160px">下单/付款/结算时间</th>
              <th style="width:160px;">订单总金额</th>
              <th style="width:160px;">优惠金额</th>
              <th style="width:160px;">立减金额</th>
              <th style="width:160px;">实付金额</th>
              <th style="width:160px;">退款金额</th>
              <th style="width:160px;">平台服务费</th>
              <th>实收金额</th>
              <th style="width:260px;">支付方式</th>
              <th style="width:160px;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in dataIn.arrDataList">
              <td class="text-nowrap">
                <label class="checkbox">
                  <input type="checkbox" :value="item.OrderCode" v-model="arrChkedId">
                  <span class="icon"></span>
                </label>
              </td>
              <td>
                <div>订单号: {{item.OrderCode}}</div>
                <div>支付单号: {{item.SettlementTradeCode}}</div>
              </td>
              <td class="text-nowrap">
                <div>下单:{{item.DateAdded |datetime}}</div>
                <div>付款:{{item.PayTime |datetime}}</div>
                <div>结算:{{item.CompleteTime |datetime}}</div>
              </td>
              <td class="text-nowrap">
                {{item.TotalMoney|currency}}
              </td>
              <td>
                {{item.DiscountCoupon|currency}}
              </td>
              <td>
                {{item.DiscountManjian|currency}}
              </td>
              <td class="text-nowrap">
                {{item.FinalTotalMoney|currency}}
              </td>
              <td>
                {{item.ReturnSuccessMoney |currency }}
              </td>
              <td>
                {{item.PlatformServiceCharge |currency}}
              </td>
              <td class="text-nowrap">
                {{item.LastMoney |currency}}
              </td>
              <td>
                {{item.PayTypeDesc}}
              </td>
              <td>
                <div class="action-field">
                  <router-link class="highlight" :to="{name:'HMMorderDetail',params:{code:item.OrderCode}}">订单详情</router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
        暂无相关数据
      </div>
      <div class="pageBox text-right"></div>
    </div>
  </div>
</template>
<script>
/**
 * 交易管理--订单结算列表
 */
let _dataModule = {
  pageIndex: 1,
  arrChkedId: [],
  dataIn: {
    inited: false,
    arrDataList: []
  },
  dataOut: {
    search: {
      Key: "",
      TimeType: 1,
      Start: "",
      End: ""
    }
  }
};
export default {
  data() {
    return _dataModule;
  },
  components: {},
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 10;
      this.arrChkedId = [];
      fetchData({
        API: "/api/OrderCenter/SGetOrderSettlementList",
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data.Data;
          initPage(
            this.$el,
            data.TotalPages,
            data.TotalRows,
            this.initPageData,
            pageIndex
          );
        }
      });
    },
    chooseAll(e) {
      let isChked = e.target.checked;
      if (isChked) {
        this.arrChkedId = this.dataIn.arrDataList.map(el => el.OrderCode);
      } else {
        this.arrChkedId = [];
      }
    },
    changeTime() {
      this.dataOut.search.Start = this.$refs.Start.value;
      this.dataOut.search.End = this.$refs.End.value;
    }
  },
  created() {
    this.initPageData(1);
  }
};
</script>