<template>
  <div>
    <div class="search clearfix mt20">
      <span>
              <span class="mr5">供应商</span>
      <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.SupplierName" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <table class="table text-center table-hover table-odd table-bordered datalist">
      <thead>
        <tr>
          <th>供应商</th>
          <th style="width:15%;">余额（元）</th>
          <th style="width:15%;">返利（元）</th>
          <th style="width:15%;">额度（元）</th>
          <th style="width:25%">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.arrDataTable">
          <td>
            {{item.Name}}
          </td>
          <td>
            <p class="text-nowrap">{{item.CashAmount}}</p>
          </td>
          <td>
            <p class="text-nowrap">{{item.RebateAmount}}</p>
          </td>
          <td>
            <p class="text-nowrap">{{item.CreditAmount}}</p>
          </td>
          <td>
            <div class="action">
              <!--               <a href="javascript:;" class="item" @click="addCash_Click(item,1)">充值</a> -->
              <a href="javascript:;" class="item" @click="checkCash_Click(item,1)">付款</a>
              <a v-link="{name:'supplierAmountCheck',params:{supplierName:item.Name}}" class="item">对账</a>
              <a href="javascript:;" class="item">账户明细</a>
              <a href="javascript:;" class="item" @click="th_Click(item)">交易历史</a>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-if="dataIn.inited&&!dataIn.arrDataTable.length>0">
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
    <!--     <add-cash :show.sync="isShowAddCash" :obj-cur-item="objCurItem" :is-supplier="isSupplier" @on-add-ok="dispatchAddOk()"></add-cash> -->
    <check-cash :show.sync="isShowCheckCash" :obj-cur-item="objCurItem" :is-supplier="isSupplier" @on-Check-ok="dispatchCheckOk()"></check-cash>
    <trade-history :show.sync="isShowTradeHistory" type="supplier" :obj="objCurItem"></trade-history>
  </div>
</template>
<script>
// import addCash from './../popup/addCash.vue';
import checkCash from './../popup/checkCash.vue';
import tradeHistory from './../popup/tradeHistory.vue';
export default {
  data() {
      return {
        // isShowAddCash: false,
        isShowCheckCash: false,
        isShowTradeHistory: false,
        isSupplier: 0,
        objCurItem: {},
        APILIST: {
          LIST: '/Api/Finance/SupplierListAccount',
        },
        dataIn: {
          inited: false,
          arrDataTable: []
        },
        dataOut: {
          search: {
            SupplierName: '',
            BranchName: '',
          }
        }
      }
    },
    components: {
      // addCash,
      checkCash,
      tradeHistory
    },
    methods: {
      initPageData(pageIndex = 1) {
        this.pageIndex = pageIndex;
        var me = this;
        var para = this.dataOut.search;
        para.PageIndex = pageIndex;
        para.PageSize = 15;
        fetchData({
          API: this.APILIST.LIST,
          para,
          callback(data) {
            me.dataIn.inited = true;
            me.dataIn.arrDataTable = data.Data;
            initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageIndex);
          }
        })
      },
      th_Click(item) {
        this.objCurItem = item;
        this.isShowTradeHistory = true;
      },
      //充值
      // addCash_Click(item, isSupplier) {
      //   this.objCurItem = item;
      //   this.isSupplier = isSupplier || 0;
      //   this.isShowAddCash = true;
      // },
      //充完操作
      dispatchAddOk() {
        this.initPageData(this.pageIndex);
      },
      //核算，收款
      checkCash_Click(item, isSupplier) {
        this.objCurItem = item;
        this.isSupplier = isSupplier || 0;
        this.isShowCheckCash = true;

      },
      //核完操作
      dispatchCheckOk() {
        this.initPageData(this.pageIndex);
      },
    },
    ready() {
      this.initPageData(1);
    }
}
</script>
