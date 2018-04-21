<template>
  <span class="upload-box" @click="import_Click">
		<input type="file" class="import hidden" accept=".png, .jpg, .jpeg, .gif">
                  <button class="btn">上传</button>
	</span>
</template>
<script>
import formDataUpload from 'commonScripts/formDataUpload.js';
export default {
  data() {
    return {}
  },
  components: {},
  methods: {
    initImport() {
      let me = this;
      formDataUpload({
        url: window.UPLOADSERVER,
        obj: this.$el.querySelector('.import'),
        type: 'jpg,jpeg,gif,png',
        callback(data) {
          me.$emit('upload-ok', data);
        }
      })
    },
    import_Click() {
      this.$el.querySelector('.import').click();
    },
  },
  created() {
    setTimeout(() => {
      this.initImport();
    })
  }
}
</script>