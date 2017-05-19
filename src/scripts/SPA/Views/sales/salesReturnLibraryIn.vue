<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        {{pageTitle}}
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex==0}">待入库</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">已入库</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex==0}">
            <sales-return-lib-in-excepted :is-refresh-in.sync="isRefreshIn" :rights-api="computedAPILIST" :customer-List="dataIn.customerList"></sales-return-lib-in-excepted>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <sales-return-lib-in-over :is-refresh-in="isRefreshIn" :rights-api="computedAPILIST" :customer-List="dataIn.customerList"></sales-return-lib-in-over>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import salesReturnLibInExcepted from './modules/salesReturnLibInExcepted.vue';
import salesReturnLibInOver from './modules/salesReturnLibInOver.vue';
export default {
  data() {
      return {
        pageTitle: '销售退货入库',
        dataIn: {
          datalist: {},
          customerList: []
        },
        tabIndex: 0,
        isRefreshList: false
      }
    },
    components: {
      salesReturnLibInExcepted,
      salesReturnLibInOver
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
          name: 'salesReturnLibraryIn',
          params: {
            srliTabindex: v
          }
        });
      },
      refreshAddPage() {
        this.isRefreshAddPage = true;
      },
      //公共获取客户列表
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
      },
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.srliTabindex;
      this.getCustomerList();
    }
}
</script>
