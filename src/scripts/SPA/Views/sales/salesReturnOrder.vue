<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        销售退货
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">添加销售退货单</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">销售退货单列表</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <sales-return-add @on-added-ok="addOk" :customer-List="dataIn.customerList" :rights-api="computedAPILIST"></sales-return-add>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <sales-return-list :refresh="isRefreshList" :customer-List="dataIn.customerList" :rights-api="computedAPILIST"></sales-return-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import salesReturnList from './modules/salesReturnList.vue';
import salesReturnAdd from './modules/salesReturnAdd.vue';
export default {
  data() {
      return {
        pageTitle: '销售退货',
        dataIn: {
          datalist: {}
        },
        tabIndex: 0,
        isRefreshList: false
      }
    },
    computed: {
      computedAPILIST() {
        let objTemp = _.find(this.$store.state.action, {
          Item: this.pageTitle
        });
        return objTemp ? objTemp.Details : {};
      }
    },
    components: {
      salesReturnList,
      salesReturnAdd
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
          name: 'salesReturnOrder',
          params: {
            sroTabIndex: v
          }
        });
      },
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.sroTabIndex;
    }
}
</script>
