<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        换机管理
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">添加换机</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">换机列表</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <change-add @on-added-ok="addOk"></change-add>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <change-list :refresh="isRefreshList"></change-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import changeList from './modules/changeList.vue';
import changeAdd from './modules/changeAdd.vue';
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
      changeList,
      changeAdd
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
          name: 'changeManage',
          params: {
            cscmTabIndex: v
          }
        });
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.cscmTabIndex;
    }
}
</script>
