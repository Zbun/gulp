<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        初始化
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">本仓初始化</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">渠道初始化</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <init-data-self></init-data-self>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <init-data-terminal></init-data-terminal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import initDataSelf from './modules/initDataSelf.vue';
import initDataTerminal from './modules/initDataTerminal.vue';
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
      initDataSelf,
      initDataTerminal
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
          name: 'initData',
          params: {
            indTabIndex: v
          }
        });
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.indTabIndex;
    }
}
</script>
