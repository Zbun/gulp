<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div>
        <span class="tab-bar">
          <em class="item" :class="{on:dataOut.search.ReturnType==0}" @click="changeReturnType(0)">全部</em>
          <em class="item" :class="{on:dataOut.search.ReturnType==1}" @click="changeReturnType(1)">仅退款</em>
          <em class="item" :class="{on:dataOut.search.ReturnType==2}" @click="changeReturnType(2)">退货退款</em>
          <em class="item" :class="{on:dataOut.search.ReturnType==3}" @click="changeReturnType(3)">换货</em>
        </span>
      </div>
      <div class="search-box clearfix mt10">
        <span class="fr">
          <button class="btn ml5" onclick="alert('稍候实现')">导出</button>
        </span>
        <input type="search" placeholder="售后单号/订单编号" class="com-ipt ipt-search " v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <span class="date-field ml5">
          申请时间
          <input type="text" class="com-ipt ml5" placeholder="开始时间" id="start" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'end\')}'})"
            ref="timeStart" @focus="changeTime()" v-model="dataOut.search.ApplyStart">
        </span> -
        <span class="date-field">
          <input type="text" class="com-ipt " placeholder="结束时间" id="end" onclick="WdatePicker({minDate: '#F{$dp.$D(\'start\')}'})"
            ref="timeEnd" @focus="changeTime()" v-model="dataOut.search.ApplyEnd">
        </span>
        <select v-model="dataOut.search.CSStatus" class="ml5">
          <option value="0">售后状态</option>
          <option :value="key" v-for="(value,key) in computedStatus">
            {{value}}
          </option>
        </select>
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <div class="table-list mt10">
        <table class="table table-fixed small">
          <colgroup>
            <col>
            <col style="width:110px;">
            <col style="width:108px;">
            <col style="width:100px;">
            <col style="width:120px;">
            <col style="width:138px;">
            <col style="width:132px;">
          </colgroup>
          <thead>
            <tr>
              <th>
                商品
              </th>
              <th>退款/换货数量</th>
              <th>退款金额</th>
              <th>售后类型</th>
              <th>原因</th>
              <th>售后状态</th>
              <th>操作</th>
            </tr>
          </thead>
        </table>
        <table class="table table-bordered-all mt10 table-fixed small" v-for="item in dataIn.arrDataList">
          <colgroup>
            <col>
            <col style="width:110px;">
            <col style="width:108px;">
            <col style="width:100px;">
            <col style="width:120px;">
            <col style="width:138px;">
            <col style="width:132px;">
          </colgroup>
          <thead>
            <tr>
              <td colspan="7">
                售后单号：
                <router-link class="highlight" :to="{name:'HMMafterSaleOrderDetail',params:{code:item.ReturnCode}}">{{item.ReturnCode}}</router-link>
                <span class="ml20">订单号：<router-link class="highlight" :to="{name:'HMMorderDetail',params:{code:item.OrderCode}}">{{item.OrderCode}}</router-link></span>
                <span class="ml20">
                  申请时间：{{item.ApplyTime|datetime}}
                </span>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <div class="img-thumb-box">
                          <img :src="item.ProImage" alt="商品图片" class="mr5 goods-img-thumb" :title="item.ProName">
                        </div>
                      </td>
                      <td>{{item.ProName}}
                        <p class="text-light ">
                          规格：{{item.SpecStr}}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td class="text-nowrap">
                {{item.ReturnCount}}
              </td>
              <td class="text-nowrap">
                {{item.ReturnMoney|currency}}
              </td>
              <td class="text-nowrap">
                {{item.ReturnTypeDesc}}
              </td>
              <td>
                {{item.ReturnReason}}
              </td>
              <td>
                {{item.ReturnStausDesc}}
              </td>
              <td>
                <div class="action-field">
                  <router-link class="item" :to="{name:'HMMafterSaleOrderDetail',params:{code:item.ReturnCode}}">处理</router-link>
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
 * 交易管理-售后单管理
 */

let _dataModule = {
  dataIn: {
    inited: false,
    arrDataList: []
  },

  pageIndex: 1,

  dataOut: {
    search: {
      "Key": "",
      ReturnType: 0,
      CSStatus: 0,
      "ApplyStart": "",
      "ApplyEnd": "",
    }
  },
  editInfo: {}
};
export default {
  components: {},
  data() {
    return _dataModule
  },
  computed: {
    computedStatus() {
      return dictionary['afterSaleOrderStatus'];
    }
  },
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 8;
      fetchData({
        API: '/api/OrderCenter/SGetAfterSaleList',
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    changeTime() {
      this.dataOut.search.ApplyStart = this.$refs.timeStart.value;
      this.dataOut.search.ApplyEnd = this.$refs.timeEnd.value;
    },
    changeReturnType(ReturnType) {
      this.dataOut.search.ReturnType = ReturnType;
      this.initPageData(1);
    }
  },
  created() {
    this.initPageData(this.pageIndex);
  },
  watch: {}
}
</script>