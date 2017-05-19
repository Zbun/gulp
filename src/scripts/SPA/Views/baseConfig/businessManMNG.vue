<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        业务员管理
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">添加业务员</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">业务员列表</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <businessman-add @on-added-ok="addOk"></businessman-add>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <businessman-list :refresh="isRefreshList"></businessman-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import businessmanList from './modules/businessmanList.vue';
import businessmanAdd from './modules/businessmanAdd.vue';
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
      businessmanList,
      businessmanAdd
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
          name: 'businessmanMNG',
          params: {
            bmmTabIndex: v
          }
        });
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.bmmTabIndex;
    }
}
</script>
