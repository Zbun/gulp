<template>
  <div class="main">
    <div class="content-field  clearfix">
      <h3 class="mt10 mb10">我的银行卡
        <span>已添加{{bankCardList.CardList.length}} 张储蓄卡
        </span>
      </h3>
      <div class="flex-content">
        <div v-for="item in bankCardList.CardList">
          <h3 class="pl10 pr10">{{item.BankName}}
            <label class="fr">尾号:{{item.SecCardNum}} {{item.CardType}}</label>
          </h3>
          <div class="set  pl20 pr20">
            <dl class="item ">
              <dt class="title">
                持卡人姓名:
              </dt>
              <dd class="content">
                {{item.FullName}}
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">
                认证状态:
              </dt>
              <dd class="content">
                {{item.AuthStatusDesc}}
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">
                手机号:
              </dt>
              <dd class="content">
                {{item.Phone}}
                <a href="javascript:;" v-if="bankCardList.EntryType!=3" @click="ShowAddBankinfo(item)" class="fr highlight">更新绑定</a>
                <a href="javascript:;" v-else @click="showUnBind(item)" class="fr highlight">解除绑定</a>
              </dd>
            </dl>
          </div>
        </div>
        <div v-if="bankCardList.EntryType==3 || bankCardList.CardList.length==0">
          <div class="bankUpload">
            <a href="javascript:;" class="highlight" @click="ShowAddBankinfo()">
              <i class="bankIcon">
              </i>
              <div class="mt10">绑定银行卡</div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="popup" v-if="isShowAddinfo">
      <div class="content apply-section safeCenter-content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>绑定银行卡</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <form style="margin-left:20px" onsubmit="return false;">
              <div class="content">

                <div class="set w7em">
                  <dl class="item" v-if="bankCardList.EntryType!=3">
                    <dt class="title">支付密码</dt>
                    <dd class="content">
                      <div>
                        <input type="password" v-model="addItem.pwdPay" placeholder="请输入支付密码" data-validate="required">
                      </div>
                    </dd>
                  </dl>
                  <dl class="item" v-if="bankCardList.EntryType!=3">
                    <dt class="title">验证码</dt>
                    <dd class="content">
                      <div class="d-dxyzm">
                        <input type="text" class="com-ipt large dxyzm" placeholder="请输入验证码" v-model="addItem.smsCode" data-validate="required" @blur.prevent="yyQyyzm()">
                        <button :disabled="fetchCodeMsg1 || false" class="getCheckNumber" :class="{unselected: fetchCodeMsg1}" @click="getQYCheckNumber()">{{timerCodeMsg1||'获取短信验证码'}}</button>
                      </div>
                    </dd>
                  </dl>
                  <dl class="item">
                    <dt class="title">{{bankCardList.EntryType==3?"姓名":"开户名称"}}</dt>
                    <dd class="content">
                      <div>
                        <input type="text" v-model="addItem.fullName" placeholder="请输入开户名" data-validate="required">
                      </div>
                    </dd>
                  </dl>
                  <dl class="item">
                    <dt class="title">银行卡号</dt>
                    <dd class="content">
                      <div>
                        <input type="text" v-model="addItem.card_no" placeholder="请输入银行卡号" data-validate="required" @blur="ifCreditCard">
                      </div>
                    </dd>
                  </dl>

                  <dl class="item">
                    <dt class="title">开户银行</dt>
                    <dd class="content">
                      <bank-list :bank-name.sync="addItem.bankName" :bank-code.sync="addItem.bankCode" :arr-bank-list.sync="this.arrBankList"></bank-list>
                    </dd>
                  </dl>
                  <dl class="item">
                    <dt class="title">开户行所在地</dt>
                    <dd class="content">
                      <div>
                        <select id="areaCode1" style="flex:1" class="mr10" v-model="addItem.areaCode1" @change="getAreaList($event,1)">
                          <option value="">省</option>
                          <option :value="item.AreaCode" v-for="item in arrList1">{{item.AreaName}}</option>
                        </select>
                        <select id="areaCode2" style="flex:1" class="mr10" v-model="addItem.areaCode2" @change="getAreaList($event,2)">
                          <option value="">市</option>
                          <option :value="item.AreaCode" v-for="item in arrList2">{{item.AreaName}}</option>
                        </select>

                      </div>
                    </dd>
                  </dl>
                  <dl class="item">
                    <dt class="title">开户支行</dt>
                    <dd class="content">
                      <div>
                        <!-- <bank-list :bank-name.sync="addItem.bankName1"  :bank-code.sync="addItem.prcptcd" :arr-bank-list.sync="this.branchBanklist"></bank-list>  -->
                        <span class="intelligent-match" style="position:static;">
                          <div style="position:relative;padding: 2px 0;">
                            <span class="">
                              <input type="search" class="select-long" placeholder="输入关键字" v-model="addItem.bankName1" @focus="IMIInput()" @input="IMIInput()" style="width:100%">
                            </span>
                            <ul class="list-match" v-show="isShowBranchBank&&computedFilterProInfo.length>0" style="z-index:3;width:100%">
                              <li class="item" v-for="item in computedFilterProInfo" :title="item.brabank_name" @click="selectedThisProId(item)">{{item.brabank_name}}</li>
                            </ul>
                          </div>
                        </span>

                      </div>
                      <button @click="selectBranchBank">查询支行</button>
                    </dd>
                  </dl>
                  <dl class="item" v-if="CardType==3">
                    <dt class="title">信用卡后三位</dt>
                    <dd class="content">
                      <div>
                        <input type="text" v-model="addItem.cvv2" placeholder="请输入信用卡后三位数字" data-validate="required">
                      </div>
                    </dd>
                  </dl>
                  <dl class="item" v-if="CardType==3">
                    <dt class="title">信用卡有效期</dt>
                    <dd class="content">
                      <div>
                        <input type="text" v-model="addItem.vali_date" placeholder="请输入信用卡有效期,格式为YYMM" data-validate="required">
                      </div>
                    </dd>
                  </dl>
                  <dl class="item" v-if="bankCardList.EntryType==3">
                    <dt class="title">银行预留手机号</dt>
                    <dd class="content">
                      <div>
                        <input type="text" placeholder="请输入新手机号" v-model="addItem.bind_mob" data-validate="required">
                      </div>
                    </dd>
                  </dl>
                  <dl class="item" v-if="bankCardList.EntryType==3">
                    <dt class="title">验证码</dt>
                    <dd class="content">
                      <div class="d-dxyzm">
                        <input type="text" class="com-ipt large dxyzm" placeholder="请输入手机验证码" v-model="smsCode" data-validate="required">
                        <button :disabled="fetchCodeMsg || false" class="getCheckNumber" :class="{unselected: fetchCodeMsg}" @click="getCheckNumber()">{{timerCodeMsg||'获取短信验证码'}}</button>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">确定</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
        </div>
      </div>
    </div>
    <div class="popup" v-if="isShowUnbind">
      <div class="content apply-section safeCenter-content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>解除绑定</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <p class="mt20 mb20">确定解除尾号{{unBindInfo.SecCardNum}}银行卡的绑定吗?</p>
            <p class="mt20 mb20"><input type="password" placeholder="请输入支付密码" v-model="unBindInfo.pwdPay"></p>
            <div>
              保留捆绑银行卡您会获得:
              <p class="mt10">账户安全等级提高,修改支付密码、手机认证时有效保护账户安全</p>
              <p class="mt10">购买理财、商城消费时无需再繁琐添加卡信息,直接选择该卡验证消息即可</p>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onUnbind_Click">确定</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import bankList from "vues/components/dropdownBank.vue";
export default {
  data() {
    return {
      isShowAddinfo: false,
      isShowUnbind: false,
      isShowBranchBank: false,
      CardType: "",
      timerCodeMsg: "",
      fetchCodeMsg: "",
      timerCodeMsg1: "",
      fetchCodeMsg1: "",
      clientType: "13",
      addItem: {
        areaCode1: "",
        areaCode2: "",
        bankName1: ""
      },
      bankCardList: {
        CardList: []
      },
      arrList1: [],
      arrList2: [],
      branchBanklist: [],
      lianToken: "",
      qylianToken: "",
      smsCode: "",
      token2: "", //验证完校验码返回的token
      unBindInfo: {}
    };
  },
  components: { bankList },
  methods: {
    initPageData() {
      fetchData({
        API: "api/Supplier/SupplierWalletPerBindCardList",
        callback: data => {
          this.bankCardList = data;
        }
      });
    },
    getBankList() {
      fetchData({
        API: "api/Misc/GetLianLianBandList",
        callback: data => {
          this.arrBankList = data;
        }
      });
    },
    ifCreditCard() {
      var pattern = /^([1-9]{1})(\d{14}|\d{15}|\d{18})$/;
      if (pattern.test(this.addItem.card_no) === false) {
        showTips("请输入正确的银行卡号", "error");
        return;
      } else {
        fetchData({
          API: "api/Misc/WalletQueryBankCardType",
          para: { card_no: this.addItem.card_no },
          callback: data => {
            // this.arrBankList = data;
            this.CardType = data.CardType;
          }
        });
      }
    },
    ShowAddBankinfo() {
      this.isShowAddinfo = true;
    },
    getAreaList(e, order) {
      let pCode = this.addItem["areaCode" + order] || 0;
      for (let i = order; i < 2; i++) {
        //清楚后续下拉
        this.addItem["areaCode" + (i + 1)] = "";
        this["arrList" + (i + 1)] = [];
      }
      if (pCode === "") {
        return;
      }

      fetchData({
        API: "api/Misc/GetLianLianAreaByPCode",
        para: {
          pCode
        },
        callback: data => {
          this["arrList" + (order + 1)] = data;
        }
      });
    },
    selectBranchBank() {
      let para = {};
      para.card_no = this.addItem.card_no;
      para.bankCode = this.addItem.bankCode;
      para.city_code = this.addItem.areaCode2;
      para.bankName1 = this.addItem.bankName1;
      fetchData({
        API: "api/Supplier/SupplierWalletEntBindCard0GetBranchBank",
        para,
        callback: data => {
          this.branchBanklist = data.infos;
        }
      });
    },
    showUnBind(item) {
      this.unBindInfo = item;
      this.isShowUnbind = true;
    },
    getQYCheckNumber() {
      let para = {};
      para.clientType = this.clientType;
      para.pwdPay = this.addItem.pwdPay;
      fetchData({
        API: "api/Supplier/SupplierWalletEntBindCard1GetSmsCode",
        para,
        hideLoading: true,
        callback: data => {
          this.qylianToken = data.lianToken;
          let sec = 60;
          for (let i = 0; i <= 60; i++) {
            window.setTimeout(() => {
              if (sec != 0) {
                this.timerCodeMsg1 = sec + "秒后重发";
                this.fetchCodeMsg1 = true;
                sec--;
              } else {
                sec = 60; // 如果倒计时结束就让  获取验证码显示出来
                this.timerCodeMsg1 = "重新发送验证码";
                this.fetchCodeMsg1 = false;
              }
            }, i * 1000);
          }
        }
      });
    },
    yyQyyzm() {
      let para = {};
      para.lianToken = this.qylianToken;
      para.smsCode = this.addItem.smsCode;
      if (this.addItem.smsCode != "" && this.addItem.smsCode) {
        fetchData({
          API: "api/Supplier/SupplierWalletEntBindCard2SmsCodeVerify",
          para,
          callback: data => {
            this.token2 = data.lianToken;
            //  this.addItem=data;
          }
        });
      } else {
        return;
      }
    },
    getCheckNumber() {
      let para = {};
      this.addItem.AreaName1 = $("#areaCode1 option:selected").text();
      this.addItem.AreaName2 = $("#areaCode2 option:selected").text();
      para = this.addItem;
      fetchData({
        API: "api/Supplier/SupplierWalletPerBindCard1GetSmsCode",
        para,
        hideLoading: true,
        callback: data => {
          this.lianToken = data.lianToken;
          let sec = 60;
          for (let i = 0; i <= 60; i++) {
            window.setTimeout(() => {
              if (sec != 0) {
                this.timerCodeMsg = sec + "秒后重发";
                this.fetchCodeMsg = true;
                sec--;
              } else {
                sec = 60; // 如果倒计时结束就让  获取验证码显示出来
                this.timerCodeMsg = "重新发送验证码";
                this.fetchCodeMsg = false;
              }
            }, i * 1000);
          }
        }
      });
    },
    IMIInput() {
      this.isShowBranchBank = true;
    },
    selectedThisProId(item) {
      this.addItem.BankCode1 = item.prcptcd;
      this.isShowBranchBank = false;
      this.addItem.bankName1 = item.brabank_name;

      // this.addItem.isShowBranchBank = false;
    },
    onSubmit_Click() {
      let para = {};

      if (this.bankCardList.EntryType === 3) {
        para.lianToken = this.lianToken;
        para.smsCode = this.smsCode;

        fetchData({
          API: "api/Supplier/SupplierWalletPerBindCard2VerifySmsCode",
          para,
          hideLoading: true,
          callback: data => {
            this.initPageData();
            this.onCancel_Click();
          }
        });
      } else {
        this.addItem.AreaName1 = $("#areaCode1 option:selected").text();
        this.addItem.AreaName2 = $("#areaCode2 option:selected").text();
        para = this.addItem;
        para.lianToken = this.token2;
        fetchData({
          API: "api/Supplier/SupplierWalletEntBindCard4CardChange",
          para,
          hideLoading: true,
          callback: data => {
            this.initPageData();
            this.onCancel_Click();
          }
        });
      }
    },
    onUnbind_Click() {
      let para = {};
      para.card_no = this.unBindInfo.CardNum;
      para.pwdPay = this.unBindInfo.pwdPay;
      para.clientType = this.clientType;

      fetchData({
        API: "api/Supplier/SupplierWalletPerBindCardUnbind",
        para,
        hideLoading: true,
        callback: data => {
          this.initPageData();
          this.onCancel_Click();
        }
      });
    },
    onCancel_Click() {
      this.isShowAddinfo = false;
      this.isShowUnbind = false;
    }
  },
  watch: {},
  computed: {
    computedFilterProInfo() {
      let newPros = this.branchBanklist;
      if (validatorManu.isEmpty(this.addItem.bankName1 || "")) {
        return newPros;
      } else {
        return newPros.filter(item => {
          return (
            item.brabank_name
              .toLowerCase()
              .indexOf(this.addItem.bankName1.trim().toLowerCase()) > -1
          );
        });
      }
    }
  },
  created() {
    this.initPageData();
    this.getAreaList("", 0);
    this.getBankList();
  }
};
</script>