<template>
  <div class="main">
    <h2 class="content-title">付款管理</h2>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span v-for="item of tabArray" class="item" :class="{on:tabIndex==$index}" @click="toggle_Click($index)">{{item}}</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex==0}">
            <wait-for-paying :payed-ok.sync="isPayedOk"></wait-for-paying>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <payed-list :payed-ok="isPayedOk"></payed-list>
          </div>
          <!--           <div class="item" :class="{on:tabIndex==2}">
            <add-payed-order :payed-ok.sync="isPayedOk" :tab-index.sync="tabIndex"></add-payed-order>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import waitForPaying from './modules/waitForPaying.vue';
import payedList from './modules/payedList.vue';
// import addPayedOrder from './modules/addPayedOrder.vue';
export default {
  data() {
      return {
        isPayedOk: false,
        tabIndex: 0,
        tabArray: ['待付款', '已付款']
      }
    },
    components: {
      waitForPaying,
      payedList,
      // addPayedOrder
    },
    methods: {
      toggle_Click(v) {
        this.tabIndex = v;
        this.$router.go({
          name: 'paymentManage',
          params: {
            fpmTabIndex: v
          }
        });
      }
    },
    ready() {
      this.tabIndex = isNaN(this.$route.params.fpmTabIndex) ? 0 : this.$route.params.fpmTabIndex;
    }
}
</script>
