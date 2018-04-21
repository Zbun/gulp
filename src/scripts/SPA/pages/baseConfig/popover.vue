<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title">{{tit}}<a href="javascript:;" class="close" title="关闭" @click="close">&times;</a></h2>
        <div class="body">
          <slot></slot>
        </div>
        <div class="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    tit: {
      type: [String, Number]
    },

  },
  data() {
    return {}
  },
  components: {},
  methods: {
    onSubmit_Click() {},
    close() {
      this.$emit('close');
    }
  },
  created() {
    // console.log(this.tit);
  }
}
</script>