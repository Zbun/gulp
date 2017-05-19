<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        客户借机
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">添加借机单</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">借机单列表</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <borrow-add @on-added-ok="addOk"></borrow-add>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <borrow-list :refresh="isRefreshList"></borrow-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import borrowList from './modules/borrowList.vue';
import borrowAdd from './modules/borrowAdd.vue';
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
      borrowList,
      borrowAdd
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
          name: 'borrowOrder',
          params: {
            cboTabIndex: v
          }
        });
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.cboTabIndex;
    }
}
</script>
