<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>你好</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <p>我是内容</p>
            <table class="table table-bordered datalist">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>时间</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">提交</button>
          <button class="btn btn-default" @click="onCancel_Click">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: { type: Boolean, default: false }
  },
  data() {
    return {}
  },
  components: {},
  methods: {
    onSubmit_Click() {},
    onCancel_Click() {
      this.show = false;
      this.$emit('update:show', false);
    }
  },
  created() {}
}
</script>