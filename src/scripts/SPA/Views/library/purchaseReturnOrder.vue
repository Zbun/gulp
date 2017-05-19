<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        {{pageTitle}}
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">待出库</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">已出库</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <waiting-for-out @on-added-ok="addOk" :is-refresh-in.sync="isRefreshIn" :rights-api="computedAPILIST"></waiting-for-out>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <library-is-out :is-refresh-in="isRefreshIn" :rights-api="computedAPILIST"></library-is-out>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import waitingForOut from './modules/prLibWaitingForOut.vue';
import libraryIsOut from './modules/prLibIsOut.vue';
export default {
  data() {
      return {
        isRefreshIn: false,
        pageTitle: '采购退货出库',
        dataIn: {
          datalist: {}
        },
        tabIndex: 0,
        isRefreshList: false
      }
    }, computed: {
      computedAPILIST() {
        let objTemp = _.find(this.$store.state.action, {
          Item: this.pageTitle
        });
        return objTemp ? objTemp.Details : {};
      }
    },
    components: {
      waitingForOut,
      libraryIsOut,
    },
    methods: {
      addOk() {
        this.isRefreshList = true;
        this.tabIndex = 1;
        setTimeout(() => {
          this.isRefreshList = false;
        }, 1000);
      },
      toggle_Click(v) {
        this.tabIndex = v;
        this.$router.go({
          name: 'purchaseReturnOrder',
          params: {
            proTabIndex: v
          }
        });
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.proTabIndex || 0;
    }
}
</script>
