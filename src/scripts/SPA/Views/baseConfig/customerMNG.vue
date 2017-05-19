<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        客户
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">添加客户</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">客户列表</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <customer-add @on-added-ok="addOk"></customer-add>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <customer-list :refresh="isRefreshList"></customer-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import customerList from './modules/customerList.vue';
import customerAdd from './modules/customerAdd.vue';
export default {
  data() {
      return {
        dataIn: {
          datalist: {}
        },
        tabIndex: 0,
        isRefreshList: false
      }
    },
    components: {
      customerList,
      customerAdd
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
          name: 'customerMNG',
          params: {
            bcTabIndex: v
          }
        });
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.bcTabIndex;
    }
}
</script>
