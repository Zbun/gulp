<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        分仓管理
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">添加分仓</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">分仓列表</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex!=1}">
            <library-add @on-added-ok="addOk"></library-add>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <library-list :refresh="isRefreshList"></library-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import libraryList from './modules/libraryList.vue';
import libraryAdd from './modules/libraryAdd.vue';
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
      libraryList,
      libraryAdd
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
          name: 'libraryMNG',
          params: {
            blTabIndex: v
          }
        });
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.blTabIndex;
    }
}
</script>
