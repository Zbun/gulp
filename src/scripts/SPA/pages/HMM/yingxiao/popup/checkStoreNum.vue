<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>查看库存</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <b>总库存 <em class="text-danger">{{objEditInfo.AmountSum}} </em></b><span class="text-muted">（共{{objEditInfo.AmountDetails.length}}个库存）</span>
            <hr>
            <ul class="clearfix" style="line-height:2;">
              <li class="item fl" style="width:30%;" v-for="item in objEditInfo.AmountDetails">
                <span class="text-gray mr10">
            				{{item.StoreName}}
            			</span>{{item.Amount}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: { twoway: true, default: false },
    objEditInfo: {}
  },
  data() {
    return {}
  },
  components: {},
  methods: {
    onSubmit_Click() { this.onCancel_Click() },
    onCancel_Click() {
      this.show = false;
      this.$emit('update:show', false);
    }
  },
  created() {}
}
</script>