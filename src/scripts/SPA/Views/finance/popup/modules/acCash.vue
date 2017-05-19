<template>
  <div>
    <div class="invoices-detail">
      <table class="table-intro block">
        <tbody>
          <tr>
            <td>
              <span class="title ml20">
                  <span v-if="isSupplier">供应商：</span>
              <span v-else>客户：</span>
              </span>
              <span class="content">
                  {{objCurItem.Name}}
                </span>
            </td>
            <td v-if="!isSupplier">
              <span class="title">
                  机构：
                </span>
              <span class="content">
                  {{objCurItem.BranchName}}&nbsp;
                </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="table-list">
        <table class="table table-bordered text-center">
          <tbody>
            <tr>
              <td rowspan="2"><b>账户余额</b></td>
              <td>
                <b>余额</b>
              </td>
              <td>
                <b>返利</b>
              </td>
              <td>
                <b>额度</b>
              </td>
            </tr>
            <tr>
              <td>{{objCurItem.CashAmount}}</td>
              <td>{{objCurItem.RebateAmount}}</td>
              <td>{{objCurItem.CreditAmount}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="set w7em pr30">
        <dl class="item">
          <dt class="title">
            流水号：
          </dt>
          <dd class="content text-light-muted">{{dataOut.Code}}</dd>
        </dl>
        <dl class="item">
          <dt class="title required-mark">
            <b>充值金额</b>
          </dt>
          <dd class="content">
            <div class="currency-box">
              <i class="icon">￥</i>
              <input type="text" v-model="dataOut.Amount" data-validate="required money show" placeholder="金额" class="ipt-currency block">
              <span class="line"></span>
            </div>
            <p class="bg-muted p5 mt5" v-show="objCurItem.CreditDebt>0">
              <label class="checkbox">
                <input type="checkbox" v-model="dataOut.ReturnCredit">冲抵额度<span class="icon"></span></label>
              <span class="font-small text-light-muted">
                  	（应还额度：{{objCurItem.CreditDebt}} 元）
                  </span>
            </p>
          </dd>
        </dl>
        <dl class="item">
          <dt class="title">
            备注
          </dt>
          <dd class="content">
            <div class="currency-box" style="width:100%">
              <input type="text" placeholder="输入备注" v-model="dataOut.Description" class="ipt-currency block" style="width:100%"><span class="line"></span>
            </div>
          </dd>
        </dl>
      </div>
      <div class="mt20">
        <hr class="divider-dashed thin">
        <p class="clearfix text-muted">
          <span class="fr mr30">
     		时间：{{dataAddedInfo.time}}
     	</span>
          <span class="ml30">
     		充值人：{{dataAddedInfo.name}}
     	</span>
        </p>
      </div>
    </div>
    <div class="footer text-center mt20">
      <button class="btn btn-primary" @click="onSubmit_Click">提交</button>
      <button class="btn btn-default" @click="onCancel_Click">关闭</button>
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
    dataAddedInfo: {},
    isSupplier: 0,
    objCurItem: {},
  },
  data() {
    return {
      dataOut: {
        Code: '',
        Amount: '',
        AccountType: 12,
        ReturnCredit: 0,
      }
    }
  },
  components: {},
  computed: {},
  methods: {
    onSubmit_Click() {
      let me = this;
      if (!zmm_validator(this.$el)) {
        return;
      }
      let para = this.dataOut;
      para.ReturnCredit = para.ReturnCredit & 1;
      para.Name = this.objCurItem.Name;
      para.Id = this.objCurItem.Id;
      fetchData({
        API: this.dataAddedInfo.chargeAPI,
        para,
        callback(data) {
          me.show = false;
          me.$dispatch('on-add-ok');
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {
    this.dataOut.Code = createOrderNum.unique();
  }
}
</script>
