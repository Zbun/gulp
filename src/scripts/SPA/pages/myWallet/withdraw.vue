<template>
  <div class="main" id="myWallet">
    <section class="text-center fixed-footer">
      <button class="btn btn-primary large" @click="submit($event)">提交</button>
      <a href="javascript:history.go(-1)" class="btn btn-default large">取消</a>
    </section>
    <div class="content-field">
      <h4 class="mt10 mb10">余额提现
      </h4>
      <ul class="walletInfo">
        <li style="border:0;">
          <dl>
            <dt>
              <i class="iconfont icon-qianbao2"></i>
            </dt>
            <dd>
              <span class="text-xxx-large">{{editInfo.WalletProfile.balance}}</span>元</dd>
            <dd>账户余额</dd>
          </dl>
          <div class="mt20">可提现余额:
            <i class="text-xx-large">{{editInfo.WalletProfile.cashout_amt}}</i>元
            <span class="ml10">冻结金额:
              <i class="text-xx-large">{{editInfo.WalletProfile.freeze_balance}}</i>元</span>
          </div>
        </li>

      </ul>
      <div class="set w5em mt30">
        <dl class="item">
          <dt class="title">
            选择银行卡
          </dt>
          <dd class="content">
            <select v-model="addItem.cardNum" class="com-ipt x-large">
              <option value="">请选择</option>
              <option :value="item.CardNum" v-for="item in cardList">
                {{item.BankName}} 尾号 {{item.SecCardNum}}
              </option>
            </select>
            <a href="javascript:;" class="highlight ml10" @click="bindCard()" v-if="cardList.length==0">绑定银行卡</a>
          </dd>
        </dl>
        <dl class="item">
          <dt class="title">
            提现金额
          </dt>
          <dd class="content">
            <input type="text" placeholder="请输入提现金额" class="com-ipt x-large" v-model="addItem.money" data-validate="required money">
          </dd>
        </dl>
        <dl class="item">
          <dt class="title">
            支付密码
          </dt>
          <dd class="content">
            <input type="password" placeholder="请输入支付密码" class="com-ipt x-large" v-model="addItem.pwdPay" data-validate="required posInteger">
          </dd>
        </dl>
        <div class="text-light">
          余额提现说明：<br> 1. 目前余额提现暂支持T+1(次日)到账模式，到账时间以银行的实际到账时间为准；<br> 2. 每个自然月提现次数最多3次，提现的金额不能低于 100元；<br> 3. 如需帮助请致电客服热线：400-1234-1234。<br>
        </div>
      </div>

      <div>

      </div>

    </div>
    <div class="popup" v-if="isShowPop">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>
        </h2>
        <div class="body" style="line-height:130px;">
          <div class="content text-large text-center">
            你还没有绑卡,是否前去绑卡.
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">确定</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let _dataModule = {
  cardList: [],
  isShowPop: false,
  editInfo: {
    WalletProfile: {}
  },
  addItem: {
    cardNum: "",
    clientType: "13"
  }
};
export default {
  data() {
    return _dataModule;
  },
  components: {},
  methods: {
    initPageData() {
      fetchData({
        API: "api/Supplier/SupplierWalletHome",
        callback: data => {
          this.editInfo = data;
        }
      });
    },
    getCardList() {
      fetchData({
        API: "api/Supplier/SupplierWalletPerBindCardList",
        callback: data => {
          this.cardList = data.CardList;
        }
      });
    },
    bindCard() {
      this.isShowPop = true;
    },
    onSubmit_Click() {
      this.$router.push({
        path: "myBank"
      });
    },
    onCancel_Click() {
      this.isShowPop = false;
    },
    submit() {
      let para = this.addItem;

      fetchData({
        API: "api/Supplier/SupplierWalletCashOut",
        para,
        callback: data => {
          this.$router.push({
            path: "index"
          });
        }
      });
    }
  },

  created() {
    this.initPageData();
    this.getCardList();
  }
};
</script>