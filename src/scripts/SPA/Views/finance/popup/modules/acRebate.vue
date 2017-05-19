<template>
  <div>
    <div class="invoices-detail">
      <div class="set w7em pr30">
        <dl class="item">
          <dt class="title">
            <span v-if="isSupplier">供应商：</span>
            <span v-else>客户：</span>
          </dt>
          <dd class="content">
            {{objCurItem.Name}}
          </dd>
        </dl>
        <dl class="item" v-if="!isSupplier">
          <dt class="title">
            机构：
          </dt>
          <dd class="content">
            {{objCurItem.BranchName}}&nbsp;
          </dd>
        </dl>
        <dl class="item">
          <dt class="title">
            流水号：
          </dt>
          <dd class="content text-light-muted">{{dataOut.Code}}</dd>
        </dl>
        <dl class="item">
          <dt class="title required-mark">
            <b>返利金额</b>
          </dt>
          <dd class="content">
            <div class="currency-box">
              <i class="icon">￥</i>
              <input type="text" v-model="dataOut.Amount" data-validate="required money show" placeholder="金额" class="ipt-currency block">
              <span class="line"></span>
            </div>
            <p>
              <label class="checkbox">
                <input type="checkbox" v-model="usedLimit">使用限制<span class="icon"></span></label>
            </p>
          </dd>
        </dl>
        <dl class="item" v-show="usedLimit">
          <dt class="title">
            使用比例
          </dt>
          <dd class="content">
            <input type="text" class="com-ipt small" placeholder="输入比例" v-model="dataOut.CanUsedRate"> %
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
      usedLimit: 0,
      dataOut: {
        Code: '',
        Amount: '',
        AccountType: 11,
      }
    }
  },
  computed: {

  },
  components: {},
  methods: {
    onSubmit_Click() {
      let me = this;
      if (!zmm_validator(this.$el)) {
        return;
      }
      let para = this.dataOut;
      if (!this.usedLimit) {
        delete para.CanUsedRate;
      }
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
    setTimeout(() => {
      this.dataOut.Code = createOrderNum.unique();
    }, 4);
  }
}
</script>
