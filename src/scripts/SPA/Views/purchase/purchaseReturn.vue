<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        采购退货
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">添加采购退货单</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">采购退货单列表</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <pr-add @on-added-ok="addOk"></pr-add>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <pr-list :refresh="isRefreshList"></pr-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import prList from './modules/prList.vue';
import prAdd from './modules/prAdd.vue';
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
      prList,
      prAdd
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
          name: 'purchaseReturn',
          params: {
            prtabIndex: v
          }
        });
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.prtabIndex;
    }
}
</script>
