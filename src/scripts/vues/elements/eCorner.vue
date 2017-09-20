<template>
  <div class="corner">
    <ul class="corner-list">
      <li class="gototop cl-item">
        <div class="icon-wrapper">
          <i class="icon icon-totop"></i>
        </div>
        <span class="text">回到顶部</span>
      </li>
      <li class="cl-item" @click="showLog()">
        <div class="icon-wrapper">
          <i class="icon icon-log"></i>
        </div>
        <span class="text">近期更新</span>
      </li>
    </ul>
  </div>
  <update-log :show.sync="isShowLog"></update-log>
</template>
<script>
export default {
  data() {
    return {
      isShowLog: false
    }
  },
  components: {
    updateLog: require('./updateLog.vue')
  },
  methods: {
    showLog() {
      this.isShowLog = true;
    }
  },
  created() {
    if (!(window.localStorage.hideUpdateLog - 0)) {
      this.isShowLog = true;
    }
  }
}
</script>