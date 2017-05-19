<template>
  <div class="content-large w80p">
    <div class="invoices mt20">
      <h2 class="header">付款单</h2>
      <div class="invoices-detail mt20 set w6em" style="padding:40px 60px;margin:20px 50px;">
        <dl class="item">
          <dt class="title required-mark">
            供应商&#12288;
          </dt>
          <dd class="content">
            <select name="" id="" class="supplier-info select-long" v-model="editInfo.SupplierId" @change="SupplierId_Change()">
              <option v-for="item of dataIn.datalist.SupplierInfo" :value="item.Id">{{item.Name}}</option>
            </select>
          </dd>
        </dl>
        <dl class="item">
          <dt class="title required-mark">收款账号&#12288;</dt>
          <dd class="content">
            <select name="" id="" class="select-long" v-model="editInfo.SupplierBankId">
              <option v-for="item of computedBankInfo" :value="item.Id">{{item.Bank}}</option>
            </select>
          </dd>
        </dl>
        <dl class="item">
          <dt class="title required-mark">
            付款金额：
          </dt>
          <dd class="content">
            <div class="currency-box">
              <i class="icon">￥</i>
              <input type="text" placeholder="付款金额" class="ipt-currency block" v-model="editInfo.RealPayAmount|posCurrencyIn2">
              <span class="line"></span>
            </div>
          </dd>
        </dl>
        <dl class="item">
          <dt class="title">
            备注：
          </dt>
          <dd class="content">
            <div class="currency-box" style="display:block">
              <input type="text" placeholder="输入备注" class="ipt-currency block" v-model="editInfo.Description" style="width:100%"><span class="line"></span>
            </div>
          </dd>
        </dl>
        <dl class="item">
          <dt class="title">付款人：</dt>
          <dd class="content">
            <span class="fr">
              付款日期：
              <span class="currency-box text-light-muted">
              <input class="ipt-currency com-ipt width" readonly :value="editInfo.DateAdded">
              <span class="line"></span>
            </span>
            </span>
            <span class="currency-box text-light-muted">
              <input type="text" placeholder="" readonly v-model="editInfo.UserNameAdded" class="ipt-currency">
              <span class="line" ></span>
            </span>
          </dd>
        </dl>
      </div>
      <div class="mt20 text-center">
        <button class="btn big btn-primary" @click="submit_Click()">提交</button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  nowDate
} from 'modules/common/date.js';
export default {
  props: {
    payedOk: {
      twoway: true,
      default: false
    },
    tabIndex: {
      twoway: true,
      default: ''
    }
  },
  data() {
    return {
      dataIn: {
        datalist: {}
      },
      editInfo: {
        SupplierId: '',
        SupplierBankId: '',
        PayBankId: '',
        PayType: '',
        DateAdded: nowDate().ymdhmms,
        Details: [],
        Description: '',
        UserNameAdded: '',
        RealPayAmount: '',
      },
      sepcialBankInfo: {}
    }
  },
  computed: {
    computedBankInfo() {
      return this.sepcialBankInfo[this.editInfo.SupplierId];
    }
  },
  components: {},
  methods: {
    initPageData() {
      let me = this;
      fetchData({
        API: 'api/PO/PCInsertReady',
        para: {},
        callback(data) {
          // console.log(data);
          me.dataIn.datalist = data;
          var sepcialBankInfo = {};
          for (let i = 0; i < data.SupplierInfo.length; i++) {
            sepcialBankInfo[data.SupplierInfo[i].Id] = data.SupplierInfo[i].BankInfo;
          }
          me.sepcialBankInfo = sepcialBankInfo;
          me.initData();
        }
      })
    },
    //添加成功后初始化清空数据
    initData() {
      let me = this;
      me.editInfo.RealPayAmount = '';
      me.editInfo.UserNameAdded = localStorage.userName;
      if (me.dataIn.datalist.SupplierInfo.length) {
        me.editInfo.SupplierId = me.dataIn.datalist.SupplierInfo[0].Id;
        me.editInfo.SupplierBankId = me.dataIn.datalist.SupplierInfo[0].BankInfo.length > 0 ? me.dataIn.datalist.SupplierInfo[0].BankInfo[0].Id : '';
      }

      me.dataIn.datalist.CompanyBankInfo.length > 0 && (me.editInfo.PayBankId = me.dataIn.datalist.CompanyBankInfo[0].Id);
      me.editInfo.PayType = 1;
    },
    //供应商及收款账号联动
    SupplierId_Change() {
      this.editInfo.SupplierBankId = this.computedBankInfo[0] ? this.computedBankInfo[0].Id : '';
    },
    submit_Click() {
      let me = this;
      var para = this.editInfo;
      var objDl = this.dataIn.datalist;

      para.SupplierName = _.find(objDl.SupplierInfo, {
        Id: para.SupplierId
      }).Name
      if ((para.SupplierBankId + '').length == 0) {
        showTips('收款账号需要选择，请选择', 'error');
        return;
      }
      if (/^\s*$/.test(this.editInfo.RealPayAmount)) {
        showTips('付款金额需要填写，请填写', 'error');
        return;
      }
      // console.log(this.editInfo);
      fetchData({
        api: '/api/Finance/APPayInsertByHand',
        para,
        callback(data) {
          me.payedOk = true;
          me.initData();
          me.tabIndex = 1;
          setTimeout(() => {
            me.payedOk = false;
          }, 1000)
        }
      })
    }
  },

  ready() {
    this.initPageData();
  }
}
</script>
