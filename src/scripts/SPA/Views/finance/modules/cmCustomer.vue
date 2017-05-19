<template>
  <div>
    <div class="search clearfix mt20">
      <span>
          <span class="mr5">客户</span>
      <div class="intelligent-match">
        <span class="">
                <input type="search" class="select-long" placeholder="输入关键字，点击选择" v-model="intelligentMatch.Name" @focus="IMIptFocus()" @input="IMIptInput()" maxlength="100">
              </span>
        <ul class="list" v-show="intelligentMatch.isShow&&computedFilterCustomerInfo.length>0">
          <li class="item" v-for="item in computedFilterCustomerInfo" @click="selectedThisCustomerId(item)">{{item.Name}}</li>
        </ul>
      </div>
      </span>
      <span class="ml20">
          <span class="mr5">机构</span>
      <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.BranchName" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <table class="table text-center table-hover table-odd table-bordered datalist">
      <thead>
        <tr>
          <th>客户</th>
          <th style="width:15%">机构</th>
          <th style="width:10%;">余额（元）</th>
          <th style="width:10%;">返利（元）</th>
          <th style="width:10%;">额度（元）</th>
          <th style="width:25%">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.arrDataTable">
          <td>
            {{item.Name}}
          </td>
          <td>
            {{item.BranchName}}
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
              <!--               <a href="javascript:;" class="item" @click="addCash_Click(item,0)">充值</a> -->
              <a href="javascript:;" class="item" @click="checkCash_Click(item,0)">收款</a>
              <a v-link="{name:'customerAmountCheck',params:{customerId:item.Id}}" class="item">对账</a>
              <a href="javascript:;" class="item">账户明细</a>
              <a href="javascript:;" class="item" @click="th_Click(item)">交易历史</a>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-if="dataIn.inited&&!dataIn.arrDataTable.length>0">
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
    <!--     <add-cash :show.sync="isShowAddCash" :obj-cur-item="objCurItem" :is-supplier="isSupplier" @on-add-ok="dispatchAddOk()"></add-cash> -->
    <check-cash :show.sync="isShowCheckCash" :obj-cur-item="objCurItem" :is-supplier="isSupplier" @on-Check-ok="dispatchCheckOk()"></check-cash>
    <trade-history :show.sync="isShowTradeHistory" type="customer" :obj="objCurItem"></trade-history>
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
          LIST: '/Api/Finance/CustomerListAccount',
        },
        dataIn: {
          inited: false,
          arrDataTable: [],
          customerList: [],
        },
        intelligentMatch: {
          isShow: false,
          isShowPro: false,
          customerName: '',
          proName: ''
        },
        dataOut: {
          search: {
            Name: '',
            CustomerId: '',
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
    computed: {
      computedFilterCustomerInfo() {
        let me = this;
        let newArea = [];
        if (!this.dataOut.search.Area) {
          newArea = this.dataIn.customerList;
        } else {
          newArea = this.dataIn.customerList.filter(function(item) {
            return (item.Area + '').substring(0, 4) == (me.dataOut.search.Area + '').substring(0, 4);
          });
        }
        if (validatorManu.isEmpty(this.intelligentMatch.customerName)) {
          return newArea;
        } else {
          return newArea.filter((item) => {
            return item.Name.indexOf(me.intelligentMatch.customerName.trim()) > -1;
          })
        }
      },
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
            // console.log(data);
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
      // addCash_Click(item, isSupplier) {
      //   this.objCurItem = item;
      //   this.isSupplier = isSupplier || 0;
      //   this.isShowAddCash = true;
      // },
      dispatchAddOk() {
        this.initPageData(this.pageIndex);
      }, //核算，付款
      checkCash_Click(item, isSupplier) {
        this.objCurItem = item;
        this.isSupplier = isSupplier || 0;
        this.isShowCheckCash = true;
      },
      //核完操作
      dispatchCheckOk() {
        this.initPageData(this.pageIndex);
      },
      //智能感知匹配区
      IMIptFocus() {
        this.intelligentMatch.isShow = true;
      },
      IMIptInput() {
        this.dataOut.search.CustomerId = '';
      },
      selectedThisCustomerId(item) {
        this.intelligentMatch.Name = item.Name;
        this.dataOut.search.CustomerId = item.Id;
        this.intelligentMatch.isShow = false;
      },
      getCustomerList() {
        let me = this;
        fetchData({
          API: '/Api/Misc/CustList',
          para: {
            pageIndex: 1,
            pageSize: 10000,
          },
          callback(data) {
            me.dataIn.customerList = data.Data;
          }
        })
      }
    },
    ready() {
      this.initPageData(1);
      this.getCustomerList();
    }
}
</script>
