<template>
  <div class="main home">
    <div class="content-title">
      我是首页
    </div>
    <div class="content-field">
      <router-link class="item" :to="{name:'default'}">首页</router-link>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      curItem: {},
      support: {},
      dataIn: {
      },
    }
  },
  components: {},
  computed: {},
  methods: {
    initPageData() {
      let me = this;

    },

  },
  mounted() {
    this.initPageData();
  }
}
</script>