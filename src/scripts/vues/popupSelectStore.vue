<template>
  <span>
<!--  <span>
    &#12288;{{branchTitle||"机构"}}：<input class="ml5" type="text" readonly :value="editInfo.BranchName">
  </span> -->
  <span><span class="mr5" :class="{'required-mark':storeRequired}">{{storeTitle||"仓库"}}</span>
  <span class="select-box" @click="selectStore()">
    <input type="text" :title="editInfo.StoreName" placeholder="选择仓库" readonly v-model="editInfo.StoreName">
    <i class="icon" title="点击选择仓库"></i>
  </span>
  </span>
  <store-list :show.sync="isShowStoreSelect" :store-selected.sync="editInfo"></store-list>
  </span>
</template>
<script>
/**
 * 通用弹窗选择机构、仓库组件
 */
import storeList from 'vues/storeList.vue';
export default {
  props: {
    editInfo: {},
    storeTitle: '仓库',
    branchTitle: '机构',
    storeRequired: ''
  },
  data() {
    return {
      isShowStoreSelect: false,
    }
  },
  components: {
    storeList,
  },
  methods: {
    selectStore() {
      this.isShowStoreSelect = true;
    }
  },
  created() {}
}
</script>