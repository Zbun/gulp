<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>调整成本</h2>
        <div class="body">
          <div class="content" style="width:500px">
            <strong>当前商品信息：</strong>
            <table class="justshow">
              <tbody>
                <tr>
                  <th style="width:72px;">商品名称：</th>
                  <td>{{fromParentDetail.ProName}}</td>
                </tr>
                <tr>
                  <th>分类：</th>
                  <td>{{fromParentDetail.CategoryName}}</td>
                </tr>
                <tr>
                  <th>
                    供应商：
                  </th>
                  <td>{{fromParentDetail.SupplierName}}</td>
                </tr>
                <tr>
                  <th>
                    库存：
                  </th>
                  <td>{{fromParentDetail.ProCount}}</td>
                </tr>
                <tr>
                  <th>平均成本：</th>
                  <td>
                    <span class="text-warning">{{fromParentDetail.AgvCost|money}}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="mt10">
              <div class="divider-dashed"></div>
              <span>
          <label class="radio" :class="{on:dataOut.ChangeType==0}">
          <input type="radio" name="type" value=0 v-model="dataOut.ChangeType"><span class="icon"></span>全部调整为
              </label>
              <label class="radio" :class="{on:dataOut.ChangeType==1}">
                <input type="radio" name="type" value=1 v-model="dataOut.ChangeType"><span class="icon"></span>平均下调</label>
              </span>
              <span>
              <input type="text" class="ml5" placeholder="输入金额" v-model="dataOut.ChangePrice|currencyIn" data-validate="required show"> 元
            </span>
            </div>
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
    fromParentDetail: {},
    show: {
      twoway: true,
      default: false
    }
  },
  data() {
    return {
      dataIn: {

      },
      dataOut: {
        ChangeType: 0,
        ChangePrice: ''
      }
    }
  },
  components: {},
  methods: {
    onSubmit_Click() {
      let me = this;
      if (!zmm_validator(this.$el)) {
        return;
      }

      if (this.fromParentDetail.AgvCost < this.dataOut.ChangePrice || this.dataOut.ChangePrice < 0) {
        showTips('此时最终价格超过当平均成本或为负，请检查', 'error');
        return;
      }

      let para = Object.assign(this.dataOut, this.fromParentDetail);
      fetchData({
        API: 'api/Product/CostChange',
        para,
        callback(data) {
          me.$dispatch('on-after-adjust');
          me.show = false;
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {},
  watch: {
    show(val) {
      if (val) {
        this.dataOut.ChangeType = 0;
        this.dataOut.ChangePrice = '';
      }
    }
  }
}
</script>
