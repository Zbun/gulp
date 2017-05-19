<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        用户管理
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">添加用户</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">用户列表</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <user-add @on-added-ok="addOk"></user-add>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <user-list :refresh="isRefreshList"></user-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import userList from './modules/userList.vue';
import userAdd from './modules/userAdd.vue';
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
      userList,
      userAdd
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
          name: 'userMNG',
          params: {
            buTabIndex: v
          }
        });
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.buTabIndex;
    }
}
</script>
