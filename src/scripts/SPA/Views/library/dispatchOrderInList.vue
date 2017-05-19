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
            <dispatch-order-in-excepted :is-refresh-in.sync="isRefreshIn" :rights-api="computedAPILIST"></dispatch-order-in-excepted>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <dispatch-order-in-over :is-refresh-in="isRefreshIn" :rights-api="computedAPILIST"></dispatch-order-in-over>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dispatchOrderInExcepted from './modules/dispatchOrderInExcepted.vue';
import dispatchOrderInOver from './modules/dispatchOrderInOver.vue';
export default {
  data() {
      return {
        isRefreshIn: false,
        pageTitle: '调拨入库',
        dataIn: {
          datalist: {}
        },
        tabIndex: 0,
        isRefreshList: false
      }
    },
    components: {
      dispatchOrderInExcepted,
      dispatchOrderInOver,
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
          name: 'dispatchOrderInList',
          params: {
            doliTabIndex: v
          }
        });
      },
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.doliTabIndex;
    }
}
</script>
