<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        发票管理
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">进项</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">销项</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <invoice-in></invoice-in>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <invoice-out></invoice-out>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import invoiceIn from './modules/invoiceIn.vue';
import invoiceOut from './modules/invoiceOut.vue';
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
      invoiceIn,
      invoiceOut
    },
    methods: {
      toggle_Click(v) {
        this.tabIndex = v;
        this.$router.go({
          name: 'invoiceMNG',
          params: {
            imngTabIndex: v
          }
        });
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.imngTabIndex;
    }
}
</script>
