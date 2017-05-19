<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>开票</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <table class="table-intro pl20">
              <tbody>
                <tr>
                  <td>
                    <span class="title">
										采购单号：
									</span>
                    <span class="content">
										{{objCurOrder.BillCode}}
									</span>
                  </td>
                </tr>
                <tr>
                  <td v-if="isSupplier">
                    <span class="title">
										&#12288;供应商：
									</span>
                    <span class="content">
										{{objCurOrder.SupplierName}}
									</span>
                  </td>
                  <td v-else>
                    <span class="title">&#12288;&#12288;客户：
                    </span>
                    <span class="content">
                  		{{objCurOrder.CustomerName}}
                  	</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="title">
										采购金额：
									</span>
                    <span class="content">
										{{objCurOrder.TotalPrice}} 元
									</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="bg-muted-light border-box pl20 pr20 mt10">
              <h4 class="mt10 mb10">未开发票金额：<span class="text-warning">
							{{objCurOrder.NoPaidAmount}}
						</span> 元</h4>
              <hr class="divider-dashed thin">
              <div class="set">
                <dl class="item">
                  <dt class="title required-mark">
                    票号：
                  </dt>
                  <dd class="content">
                    <input type="text" placeholder="请输入发票编号" v-model="dataOut.ReceiptNum" maxlength="50" data-validate="required ">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title required-mark">
                    金额：
                  </dt>
                  <dd class="content">
                    <input type="text" class="com-ipt small" placeholder="请输入金额" v-model="dataOut.Amount" maxlength="10" data-validate="required money"> 元
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title required-mark">
                    日期：
                  </dt>
                  <dd class="content">
                    <input type="text" class="ipt-date readonly-normal" v-model="dataOut.ReceiptDate" readonly="" placeholder="选择日期" onclick="WdatePicker()">
                  </dd>
                </dl>
                <dl class="item mb10">
                  <dt class="title">
                    备注：
                  </dt>
                  <dd class="content">
                    <input type="text" class="com-ipt x-large" placeholder="请输入备注" maxlength="200" v-model="dataOut.Description">
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">提交</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
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
    isSupplier: 0,
    objCurOrder: {}
  },
  data() {
    return {
      APILIST: {
        SUPPLIER: '/Api/Finance/SupplierReceiptInsert',
        CUSTOMER: '/Api/Finance/CustomerReceiptInsert'
      },
      dataOut: {
        ReceiptNum: '',
        ReceiptDate: '',
        Amount: '',
        Description: '',
      }
    }
  },
  components: {},
  computed: {
    computedAPIInsert() {
      return this.isSupplier ? this.APILIST.SUPPLIER : this.APILIST.CUSTOMER;
    }
  },
  methods: {
    onSubmit_Click() {
      let me = this;
      if (!zmm_validator(this.$el)) {
        return;
      }
      if (this.dataOut.Amount > this.objCurOrder.NoPaidAmount) {
        showTips('发票金额超过剩余金额，请检查', 'error');
        return;
      }
      let para = this.dataOut;
      para.BillCode = this.objCurOrder.BillCode;
      fetchData({
        API: this.computedAPIInsert,
        para,
        callback() {
          me.show = false;
          me.$dispatch('on-after-submit');
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.dataOut.ReceiptNum = '';
        this.dataOut.ReceiptDate = '';
        this.dataOut.Amount = this.objCurOrder.NoPaidAmount;
        this.dataOut.Description = '';
      }
    }
  }
}
</script>
