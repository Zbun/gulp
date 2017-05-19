<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        采购
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">添加采购单</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">采购单列表</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <po-add @on-added-ok="addOk" :refresh.sync="isRefreshAddPage"></po-add>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <po-list :refresh="isRefreshList" @on-refresh="refreshAddPage()" :refresh-foreshow.sync="isRefreshForeshow"></po-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import poList from './poList.vue';
import poAdd from './poAdd.vue';
export default {
  data() {
      return {
        isRefreshAddPage: false,
        isRefreshForeshow: false,
        dataIn: {
          datalist: {}
        },
        tabIndex: 0,
        isRefreshList: false
      }
    },
    components: {
      poList,
      poAdd,
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
          name: 'purchaseOrder',
          params: {
            potabIndex: v
          }
        });
      },
      refreshAddPage() {
        // let me=this;
        this.isRefreshAddPage = true; //用作刷新预付余额相关
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.potabIndex;
    }
}
</script>
