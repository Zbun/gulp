<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
      {{pageTitle}}
    </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">未完成</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">已完成</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <dispatch-order-excepted :is-refresh-in.sync="isRefreshIn" :rights-api="computedAPILIST"></dispatch-order-excepted>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <dispatch-order-over :is-refresh-in="isRefreshIn" :rights-api="computedAPILIST"></dispatch-order-over>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dispatchOrderExcepted from './modules/dispatchOrderExcepted.vue';
import dispatchOrderOver from './modules/dispatchOrderOver.vue';
export default {
  data() {
      return {
        isRefreshIn: false,
        pageTitle: '调拨出库',
        dataIn: {
          datalist: {}
        },
        tabIndex: 0,
        isRefreshList: false
      }
    },
    components: {
      dispatchOrderExcepted,
      dispatchOrderOver,
    }, computed: {
      computedAPILIST() {
        let objTemp = _.find(this.$store.state.action, {
          Item: this.pageTitle
        });
        return objTemp ? objTemp.Details : {};
      }
    },
    methods: {
      toggle_Click(v) {
        this.tabIndex = v;
        this.$router.go({
          name: 'dispatchOrderList',
          params: {
            dolTabIndex: v
          }
        });
      },
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.dolTabIndex;
    }
}
</script>
