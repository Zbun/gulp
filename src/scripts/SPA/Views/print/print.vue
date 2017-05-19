<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        批量打印
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex==0}">出库单</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">入库单</span>
          <span class="item" @click="toggle_Click(2)" :class="{on:tabIndex==2}">物流单</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex==0}">
            <library-out @on-added-ok="addOk" :refresh.sync="isRefreshAddPage"></library-out>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <library-in @on-added-ok="addOk" :refresh.sync="isRefreshAddPage"></library-in>
          </div>
          <div class="item" :class="{on:tabIndex==2}">
            <p-logistics :refresh="isRefreshList" @on-refresh="refreshAddPage()"></p-logistics>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import libraryIn from './modules/PrintLibraryIn.vue';
import libraryOut from './modules/printLibraryOut.vue';
import pLogistics from './modules/printLogistics.vue';
export default {
  data() {
      return {
        isRefreshAddPage: false,
        dataIn: {
          datalist: {}
        },
        tabIndex: 0,
        isRefreshList: false
      }
    },
    components: {
      libraryIn,
      libraryOut,
      pLogistics
    },
    methods: {
      addOk() {
        this.isRefreshList = true;
        // this.tabIndex = 1;
        setTimeout(() => {
          this.isRefreshList = false;
        }, 1000);
      },
      toggle_Click(v) {
        this.tabIndex = v;
        this.$router.go({
          name: 'batchPrint',
          params: {
            bpIndex: v
          }
        });
      },
      refreshAddPage() {
        // let me=this;
        this.isRefreshAddPage = true;
      }
    },
    ready() {
      // this.tabIndex = 0;
      this.tabIndex = this.$route.params.bpIndex;
    }
}
</script>
