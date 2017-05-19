<template>
  <div class="content-large w90p">
    <div class="invoices mt20">
      <h2 class="header">收款单</h2>
      <div class="invoices-detail mt20 set w6em" style="padding:40px 60px;margin:20px 50px;">
        <dl class="item">
          <dt class="title required-mark">
            客户名&#12288;
          </dt>
          <dd class="content area-box">
            <div class="intelligent-match">
              <span class="">
                <input type="search" class="select-long" placeholder="输入关键字，在列表中选择" v-model="intelligentMatch.customerName" @focus="IMIptFocus()" @input="IMIptInput()">
              </span>
              <ul class="list" v-show="intelligentMatch.isShow&&computedFilterCustomerInfo.length>0">
                <li class="item" v-for="item in computedFilterCustomerInfo" @click="selectedThisCustomerId(item)">{{item.Name}}</li>
              </ul>
            </div>
          </dd>
        </dl>
        <dl class="item">
          <dt class="title">付款方式&#12288;</dt>
          <dd class="content">
            <select v-model="editInfo.CustomerPayType">
              <option v-for="(key,value) in payType" :value="key">{{value}}</option>
            </select>
          </dd>
        </dl>
        <dl class="item">
          <dt class="title required-mark">
            收款金额：
          </dt>
          <dd class="content">
            <div class="currency-box">
              <i class="icon">￥</i>
              <input type="text" placeholder="" id="" class="ipt-currency block" v-model="editInfo.RealPayAmount|currencyInNotRequired">
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
          <dt class="title">收款人：</dt>
          <dd class="content">
            <span class="fr">
              收款日期：
              <span class="currency-box text-light-muted">
              <input class="ipt-currency com-ipt width" readonly :value="editInfo.DateAdded">
              <span class="line"></span>
            </span>
            </span>
            <span class="currency-box text-light-muted">
              <input type="text" placeholder="" v-model="editInfo.UserNameAdded" readonly  class="ipt-currency">
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
export default {
  props: {
    payedOk: {
      twoway: true,
      default: false
    },
    tabIndex: '',
    arrCustomerList: []
  },
  data() {
    return {
      dataIn: {
        datalist: {}
      },
      intelligentMatch: {
        isShow: false,
        customerName: ''
      },
      editInfo: {
        CustomerId: '',
        CustomerPayType: 1,
        PayType: '',
        DateAdded: zmm_date.nowDate().ymdhmms,
        Description: '',
        UserNameAdded: '',
      },
    }
  },
  computed: {
    payType() {
      return dictionary.payType;
    },
    computedFilterCustomerInfo() {
      let me = this;
      if (validatorManu.isEmpty(this.intelligentMatch.customerName)) {
        return this.arrCustomerList;
      } else {
        return this.arrCustomerList.filter((item) => {
          return item.Name.indexOf(me.intelligentMatch.customerName.trim()) > -1;
        })
      }
    }
  },
  methods: {
    initPageData() {
      this.initData();
    },
    initData() {
      let me = this;
      me.editInfo.UserNameAdded = localStorage.userName;
    },
    IMIptFocus() {
      this.intelligentMatch.isShow = true;
    },
    IMIptInput() {
      this.editInfo.CustomerId = '';
    },
    selectedThisCustomerId(item) {
      this.editInfo.CustomerId = item.Id;
      this.intelligentMatch.customerName = item.Name;
      this.intelligentMatch.isShow = false;
    },
    submit_Click() {
      let me = this;
      var para = this.editInfo;
      var objDl = this.dataIn.datalist;
      if (!this.editInfo.CustomerId) {
        showTips('请先选择客户', 'error');
        return;
      }
      para.CustomerName = _.find(objDl.CustomerInfo, {
        Id: para.CustomerId
      }).Name;

      if ((para.ReceiveBankId + '').length == 0) {
        showTips('收款账号需要选择，请选择', 'error');
        return;
      }
      if (!this.editInfo.RealPayAmount) {
        showTips('收款金额需要填写，请填写', 'error');
        return;
      }
      para.ReceiveBank = _.find(objDl.CompanyBankInfo, {
        Id: para.ReceiveBankId
      }).Bank;

      fetchData({
        api: '/Api/Finance/ARPayInsertByHand',
        para,
        callback(data) {
          me.payedOk = true;
          me.tabIndex = 1;
          me.initData();
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
