<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>高级价格</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <b>{{objEditInfo.ProName}}</b>
            <hr class="dashed">
            <table class="table justshow thin" v-for="item in objEditInfo.MatrixPrice">
              <tbody>
                <tr>
                  <th style="width:4em">
                    阶梯定价
                  </th>
                  <td>
                    {{item.PriceType==1?'一':item.PriceType==2?'二':'三'}}级价格
                  </td>
                </tr>
                <tr>
                  <th>
                    一级价格
                  </th>
                  <td>
                    1~{{item.ProCount1}}台， {{item.ProPrice1|currency}}元
                  </td>
                </tr>
              </tbody>
            </table>
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