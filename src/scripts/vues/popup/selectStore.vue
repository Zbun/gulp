<template>
  <span class="select-box" @click="selectStore()">
                        <input type="text" :title="editInfo.StoreName" placeholder="选择仓库" readonly v-model="editInfo.StoreName">
                        <i class="icon" title="点击选择仓库"></i>
                      </span>
  <store-list :show.sync="isShowStoreSelect" :store-selected.sync="editInfo"></store-list>
</template>
<script>
import storeList from 'vues/storeList.vue';
export default {
  props: {
    editInfo: {
      twoway: true,
      default: Object
    },
    show: { twoway: true, default: false }
  },
  data() {
    return {
      isShowStoreSelect: false,
    }
  },
  components: {
    storeList
  },
  methods: {
    selectStore() {
      this.isShowStoreSelect = true;
    },
  },
  ready() {}
}
</script>