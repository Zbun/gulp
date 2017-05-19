<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>预览打印模板</h2>
        <div class="body">
          <div class="content" style="max-width:900px">
            <div class="design-box"><img :src="src">
              <div class="design-area design-detail" v-html="htmlTemplate"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    src: '',
    htmlTemplate: '',
  },
  data() {
    return {}
  },
  components: {},
  methods: {
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {}
}
</script>
