<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        {{pageTitle}}
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <!--           <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex==0}">添加销售单</span> -->
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex==0}">销售单列表</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">ZMM订单</span>
        </div>
        <div class="content">
          <!--           <div class="item" :class="{on:tabIndex==0}">
            <order-add @on-added-ok="addOk" :refresh.sync="isRefreshAddPage"></order-add>
          </div> -->
          <div class="item" :class="{on:tabIndex==0}">
            <order-list :refresh="isRefreshList" :loaded-First="loadedAsync['0']" @on-refresh="refreshAddPage()" :rights-api="computedAPILIST" :customer-List="dataIn.customerList"></order-list>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <order-zmm :refresh.sync="isRefreshList" :loaded-First="loadedAsync['1']" @on-refresh="refreshAddPage()" :rights-api="computedAPILIST" :customer-List="dataIn.customerList"></order-zmm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import orderList from './modules/salesOrderList.vue';
// import orderAdd from './modules/salesOrderAdd.vue';
import orderZmm from './modules/salesZmmOrder.vue';
export default {
  data() {
      return {
        isRefreshAddPage: false,
        isRefreshForeshow: false,
        loadedAsync: {
          '0': false,
          '1': false,
          '2': false,
        },
        pageTitle: '销售',
        dataIn: {
          datalist: {},
          customerList: []
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
      orderList,
      // orderAdd,
      orderZmm
    },
    methods: {
      addOk() {
        this.isRefreshList = true;
        this.tabIndex = 1;
        setTimeout(() => {
          this.isRefreshList = false;
        }, 1000);
      },
      toggle_Click(v, isAlwaysReload) {
        this.tabIndex = v;
        if (isAlwaysReload) {
          this.loadedAsync[v] = false;
          setTimeout(() => {
            this.loadedAsync[v] = true;
          }, 5)
        } else {
          this.loadedAsync[v] = true;
        }
        this.$router.go({
          name: 'salesOrder',
          params: {
            sotabIndex: v
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
      this.tabIndex = this.$route.params.sotabIndex;
      this.loadedAsync[this.tabIndex] = true;
      this.getCustomerList();
    }
}
</script>
