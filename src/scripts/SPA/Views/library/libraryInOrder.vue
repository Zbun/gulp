<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        {{pageTitle}}
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">待入库</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">已入库</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <waiting-for-in :is-refresh-in.sync="isRefreshIn" :rights-api="computedAPILIST"></waiting-for-in>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <library-is-in :is-refresh-in="isRefreshIn" :rights-api="computedAPILIST"></library-is-in>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import waitingForIn from './modules/waitingForIn.vue';
import libraryIsIn from './modules/libraryIsIn.vue';
export default {
  data() {
      return {
        isRefreshIn: false,
        pageTitle: '入库',
        dataIn: {
          datalist: {}
        },
        tabIndex: 0,
        isRefreshList: false
      }
    },
    computed: {
      computedAPILIST() {
        let objTemp = _.find(this.$store.state.action, {
          Item: this.pageTitle
        });
        return objTemp ? objTemp.Details : {};
      }
    },
    components: {
      waitingForIn,
      libraryIsIn,
    },
    methods: {
      toggle_Click(v) {
        this.tabIndex = v;
        this.$router.go({
          name: 'libraryInOrder',
          params: {
            lioTabIndex: v
          }
        });
      },
      refreshAddPage() {
        // let me=this;
        this.isRefreshIn = true; //入库成功刷新入库单列表页面
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.lioTabIndex || 0;
    }
}
</script>
