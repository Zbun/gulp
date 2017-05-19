<template>
  <tpl>
    <h2 class="content-title" slot="title">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回列表</a>
      </div>
      修改客户</h2>
  </tpl>
</template>
<script>
export default {
  components: {
    tpl:require('./modules/customerTpl.vue')
  }
}
</script>

