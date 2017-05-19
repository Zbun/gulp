<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
      调拨单
    </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">添加调拨单</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">调拨单列表</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <dispatch-add @on-added-ok="addOk"></dispatch-add>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <dispatch-list :refresh="isRefreshList"></dispatch-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import dispatchAdd from './modules/dispatchAdd.vue';
  import dispatchList from './modules/dispatchList.vue';
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
      dispatchAdd,
      dispatchList
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
          name: 'dispatchOrder',
          params: {
            doTabIndex: v
          }
        });
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.doTabIndex;
    }
  }

</script>