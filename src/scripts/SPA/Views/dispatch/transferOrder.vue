<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        调剂单
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">添加调剂单</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">调剂单列表</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <transfer-add @on-added-ok="addOk"></transfer-add>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <transfer-list :refresh="isRefreshList"></transfer-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import transferAdd from './modules/transferAdd.vue';
import transferList from './modules/transferList.vue';
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
      transferAdd,
      transferList
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
          name: 'transferOrder',
          params: {
            dtoTabindex: v
          }
        });
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.dtoTabindex;
    }
}
</script>
