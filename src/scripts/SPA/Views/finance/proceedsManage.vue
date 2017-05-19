<template>
  <div class="main">
    <h2 class="content-title">收款管理</h2>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span v-for="item of tabArray" class="item" :class="{on:tabIndex==$index}" @click="toggle_Click($index)">{{item}}</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex==0}">
            <proceeds-expected :payed-ok.sync="isPayedOk" :arr-customer-list="dataIn.customerList"></proceeds-expected>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <proceeds-got :payed-ok="isPayedOk" :arr-customer-list="dataIn.customerList"></proceeds-got>
          </div>
          <!--           <div class="item" :class="{on:tabIndex==2}">
            <add-payed-order :payed-ok.sync="isPayedOk" :tab-index.sync="tabIndex" :arr-customer-list="dataIn.customerList"></add-payed-order>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import proceedsExpected from './modules/proceedsExpected.vue';
import proceedsGot from './modules/proceedsGot.vue';
// import addPayedOrder from './modules/proceedsAdd.vue';
export default {
  data() {
      return {
        isPayedOk: false,
        tabIndex: 0,
        tabArray: ['待收款', '已收款'],
        dataIn: {
          customerList: []
        }
      }
    },
    components: {
      proceedsExpected,
      proceedsGot,
      // addPayedOrder
    },
    methods: {
      toggle_Click(v) {
        this.tabIndex = v;
        this.$router.go({
          name: 'proceedsManage',
          params: {
            prmTabIndex: v
          }
        });
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
            // console.log(data);
            me.dataIn.customerList = data.Data;
          }
        })
      },
    },
    ready() {
      this.tabIndex = isNaN(this.$route.params.prmTabIndex) ? 0 : this.$route.params.prmTabIndex;
      this.getCustomerList();
    }
}
</script>
