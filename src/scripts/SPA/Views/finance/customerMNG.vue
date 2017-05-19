<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        客户管理
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">客户</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">供应商</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <cm-customer></cm-customer>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <cm-supplier></cm-supplier>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import cmCustomer from './modules/cmCustomer.vue';
import cmSupplier from './modules/cmSupplier.vue';
export default {
  data() {
      return {
        dataIn: {
          datalist: {}
        },
        tabIndex: 1,
        isRefreshList: false
      }
    },
    components: {
      cmCustomer,
      cmSupplier
    },
    methods: {
      toggle_Click(v) {
        this.tabIndex = v;
        this.$router.go({
          name: 'FcustomerMNG',
          params: {
            cmngTabIndex: v
          }
        });
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.cmngTabIndex;
    }
}
</script>
