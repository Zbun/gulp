<template>
  <div class="main">
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
            <sales-lib-excepted-out @on-added-ok="addOk" :refresh.sync="isRefreshIn" :customer-List="dataIn.customerList" :rights-api="computedAPILIST"></sales-lib-excepted-out>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <sales-lib-is-out :refresh="isRefreshIn" :customer-List="dataIn.customerList" :rights-api="computedAPILIST"></sales-lib-is-out>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import salesLibIsOut from './modules/salesLibIsOut.vue';
import salesLibExceptedOut from './modules/salesLibExceptedOut.vue';
export default {
  data() {
      return {
        isRefreshIn: false,
        pageTitle: '出库',
        dataIn: {
          datalist: {},
          customerList: []
        },
        tabIndex: 0,
        isRefreshList: false
      }
    },
    components: {
      salesLibIsOut,
      salesLibExceptedOut,
    },
    computed: {
      computedAPILIST() {
        let objTemp = _.find(this.$store.state.action, {
          Item: this.pageTitle
        });
        return objTemp ? objTemp.Details : {};
      }
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
          name: 'libOutOrder',
          params: {
            sloTabIndex: v
          }
        });
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
      refreshAddPage() {
        // let me=this;
        this.isRefreshIn = true; //出库成功刷新出库单列表页面
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.sloTabIndex || 0;
      this.getCustomerList();
    }
}
</script>
