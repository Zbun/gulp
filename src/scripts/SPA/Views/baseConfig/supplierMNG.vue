<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
      供应商
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">添加供应商</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">供应商列表</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <supplier-add @on-added-ok="addOk"></supplier-add>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <supplier-list :refresh="isRefreshList"></supplier-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import supplierList from './modules/supplierList.vue';
import supplierAdd from './modules/supplierAdd.vue';
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
      supplierList,
      supplierAdd
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
          name: 'supplierMNG',
          params: {
            bsTabIndex: v
          }
        });
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.bsTabIndex;
    }
}
</script>
