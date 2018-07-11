<template>
  <div class="main">
    <div class="content-field apply-section safeCenter-content">
      <div class="two-column-view mt20">
        <h3 class="item">
          验证手机
          <i class="mr-title">你验证的手机号:{{initInfo.Phone}}</i>
          <a class="fr l-arrows" :class="{on:yzphone}" href="javascript:;" @click="toggetform('yzphone')">修改</a>
        </h3>
        <form v-if="yzphone" onsubmit="return false;">
          <div class="content">
            <div class="set w7em">
              <dl class="item">
                <dt class="title">支付密码</dt>
                <dd class="content">
                  <div>
                    <input type="password" v-model="yzPhoneInfo.pwdPay" placeholder="请输入支付密码" data-validate="required">
                  </div>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">手机验证码</dt>
                <dd class="content">
                  <div class="d-dxyzm">
                    <input type="text" class="com-ipt large dxyzm" placeholder="请输入旧手机验证码" @blur.prevent="yyllyzm()" v-model="UserOldyzm" data-validate="required">
                    <button :disabled="fetchCodeMsg1 || false" class="getCheckNumber" :class="{unselected: fetchCodeMsg1}" @click="getllyzm()">{{timerCodeMsg1||'获取短信验证码'}}</button>
                  </div>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">新手机号</dt>
                <dd class="content">
                  <div>
                    <input type="text" placeholder="请输入新手机号" v-model="newPhone" data-validate="required">
                  </div>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">图片验证码</dt>
                <dd class="content">
                  <div class="yzm">
                    <input type="text" class="com-ipt x-small" placeholder="请输入图片验证码" v-model="UserDxyzm" data-validate="required" style="width:130px">
                    <img :src="yzPic" alt="" @click="gettpCodeImg()" class="tpYzm">
                  </div>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">手机验证码</dt>
                <dd class="content">
                  <div class="d-dxyzm">
                    <input type="text" class="com-ipt large dxyzm" placeholder="请输入手机验证码" v-model="smsCode" data-validate="required">
                    <button :disabled="fetchCodeMsg || false" class="getCheckNumber" :class="{unselected: fetchCodeMsg}" @click="getCheckNumber()">{{timerCodeMsg||'获取短信验证码'}}</button>
                  </div>
                  <button class="btn btn-primary block" @click="changePhone()"> 修改手机</button>
                </dd>
              </dl>
            </div>
          </div>
        </form>

        <h3 class="item">
          实名认证
          <i class="mr-title">你已实名认证</i>
          <a class="fr l-arrows" href="javascript:;" :class="{on:smrz}" @click="toggetform('smrz')">查看</a>
        </h3>
        <form v-if="smrz" onsubmit="return false;">
          <div class="content">
            <div class="set w7em">
              <dl class="item">
                <dt class="title">真实姓名</dt>
                <dd class="content">
                  <div>
                    {{initInfo.FullName}}
                    <span class="rz-tip ml10">{{initInfo.StatusDesc}}</span>
                  </div>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">身份证号</dt>
                <dd class="content">
                  <div>
                    {{initInfo.IDNum}}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </form>

        <h3 class="item">
          支付密码
          <i class="mr-title">资金变动或账户信息变更时需验证,安全级别更高</i>
          <a class="fr l-arrows ml20" href="javascript:;" :class="{on:xgmm}" @click="toggetform('xgmm')">修改</a>
          <a class="fr l-arrows mr15" href="javascript:;" :class="{on:czmm}" @click="toggetform('czmm',initInfo.EntryType)">重置</a>
        </h3>
        <form v-if="czmm" onsubmit="return false;">
          <div class="content">
            <div class="set w7em">
              <dl class="item" v-if="initInfo.EntryType==3">
                <dt class="title">选择银行卡</dt>
                <dd class="content" style="position:relative">
                  <!-- {{cardList}} -->
                  <select v-model="czmmInfo.card_no" class="com-ipt x-large">
                    <option value="">请选择</option>
                    <option :value="item.CardNum" v-for="item in cardList">
                      {{item.BankName}} 尾号 {{item.SecCardNum}}
                    </option>
                  </select>

                  <a href="#/myWallet/myBank" class="highlight" style="position:absolute;right:-93px;top: 5px;">绑定银行卡</a>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">手机号</dt>
                <dd class="content">
                  <div v-if="initInfo.EntryType==3">
                    <input type="text" v-model="czmmInfo.phone">
                  </div>
                  <div v-else>
                    {{initInfo.Phone}}
                  </div>
                </dd>
              </dl>
              <dl class="item" v-if="initInfo.EntryType==3">
                <dt class="title">姓名</dt>
                <dd class="content">
                  <div>
                    {{initInfo.FullName}}
                  </div>
                </dd>
              </dl>
              <dl class="item" v-if="initInfo.EntryType==3">
                <dt class="title">身份证号码</dt>
                <dd class="content">
                  <div>
                    {{initInfo.IDNum}}
                  </div>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">手机验证码</dt>
                <dd class="content">
                  <div class="d-dxyzm">
                    <input type="text" class="com-ipt large dxyzm" placeholder="请输入短信验证码" @blur.prevent="czqyYZllyzm()" v-model="czqyYzm" data-validate="required">
                    <button :disabled="fetchCodeMsg3 || false" class="getCheckNumber" :class="{unselected: fetchCodeMsg3}" @click="czqyNumber()">{{timerCodeMsg3||'获取短信验证码'}}</button>
                  </div>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">支付密码</dt>
                <dd class="content">
                  <div>
                    <input type="password" placeholder="请输入支付密码" data-validate="required" v-model="czqyPay">
                  </div>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">确认支付密码</dt>
                <dd class="content">
                  <div>
                    <input type="password" placeholder="请确认支付密码" data-validate="required" v-model="confirmczqyPay">
                  </div>
                  <button class="btn btn-primary block" @click="czqyBtn()">确定</button>
                </dd>
              </dl>

            </div>
          </div>
        </form>
        <form v-if="xgmm" class="xgmm" onsubmit="return false;">
          <div class="content">
            <div class="set w7em">
              <dl class="item">
                <dt class="title">原密码</dt>
                <dd class="content">
                  <div>
                    <input type="password" data-validate="required" v-model="changePwd.oldPwdPay">
                  </div>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">新密码</dt>
                <dd class="content">
                  <div class="d-dxyzm">
                    <input type="password" class="com-ipt large dxyzm" v-model="changePwd.newPwdPay" data-validate="required">

                  </div>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">确认密码</dt>
                <dd class="content">
                  <div>
                    <input type="password" data-validate="required" v-model="changePwd.confirmPwdPay">
                  </div>
                  <button class="btn btn-primary block" @click="changePayPwd()"> 确定</button>
                </dd>
              </dl>

            </div>
          </div>
        </form>
        <h3></h3>
      </div>
    </div>
  </div>

  </div>
</template>
<script>
/**
 * 赠品添加、编辑模板
 */

export default {
  components: {},
  data() {
    return {
      yzPic: "",
      yzphone: false,
      smrz: false,
      zfmm: false,
      xgmm: false,
      czmm: false,
      yzPhoneInfo: {},
      clientType: 13,
      czmmInfo: {
        card_no: ""
      },
      fetchCodeMsg: "",
      timerCodeMsg: "",
      fetchCodeMsg1: "",
      timerCodeMsg1: "",
      fetchCodeMsg3: "",
      timerCodeMsg3: "",
      UserOldyzm: "",
      lianToken: "",
      yzlianToken: "",
      czqylianToken: "",
      czqylianToken2: "",
      czqYzm: "",
      changePwd: {},
      initInfo: {},
      czqyYzm: "",
      czqyPay: "",
      newPhone: "",
      UserDxyzm: "",
      cardList: []
    };
  },
  computed: {},
  methods: {
    initPageData() {
      fetchData({
        API: "api/Supplier/SupplierWalletSecCenterIni",
        callback: data => {
          this.initInfo = data;
        }
      });
    },
    getBankList() {
      fetchData({
        API: "api/Supplier/SupplierWalletPerBindCardList",
        callback: data => {
          this.cardList = data.CardList;
        }
      });
    },
    gettpCodeImg() {
      //获取图片验证码
      fetchData({
        API: "api/Misc/CreatePicCode",
        hideOkTips: true,
        hideLoading: true,
        para: {},
        callback: data => {
          this.yzPic = window.APISERVER + data.ImgUrl;
          this.identity = data.Identity;
          //this.dataIn.arrDataList.push(data);
        }
      });
    },
    toggetform(item, entryType) {
      this[item] = !this[item];
      if (item == "xgmm" && this.xgmm == true) {
        this.czmm = false;
      } else if (item == "czmm" && this.czmm == true && entryType != 3) {
        this.xgmm = false;
      } else if (item == "czmm" && this.czmm == true && entryType == 3) {
        this.getBankList();
        this.xgmm = false;
      }
    },
    getllyzm() {
      //获取连连验证码
      let para = {};
      para.pwdPay = this.yzPhoneInfo.pwdPay;
      para.clientType = this.clientType;

      fetchData({
        API: "api/Supplier/SupplierWalletLianlianBindPhoneChange1SmsCodeGet",
        hideLoading: true,
        hideOkTips: true,
        para,
        callback: data => {
          this.lianToken = data.lianToken;
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
    yyllyzm() {
      //验证连连的信息
      let para = {};
      para.lianToken = this.lianToken;
      para.smsCode = this.UserOldyzm;
      if (this.UserOldyzm != "") {
        fetchData({
          API:
            "api/Supplier/SupplierWalletLianlianBindPhoneChange2SmsCodeVerify",
          hideLoading: true,
          hideOkTips: true,
          para,
          callback: data => {
            this.yzlianToken = data.lianToken;
          }
        });
      } else {
        showTips("请输入验证码", "error");
      }
    },
    getCheckNumber() {
      //获取短信验证码
      let para = {};
      para.Phone = this.newPhone;
      para.ImgCode = this.UserDxyzm;
      para.Identity = this.identity;
      para.SystemType = this.systemType;
      if (!validatorManu.isPhone(this.newPhone)) {
        showTips("请填写正确的手机号", "error");
        return;
      } else {
        fetchData({
          API: "api/Misc/CreateSMSCode",
          para,
          hideLoading: true,
          callback: data => {
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
      }
    },
    czqyYZllyzm() {
      if (this.czqyYzm != "") {
        let para = {};
        para.lianToken = this.czqylianToken;
        para.smsCode = this.czqyYzm;
        if (this.initInfo.EntryType === 3) {
          fetchData({
            API:
              "api/Supplier/SupplierWalletLianlianPerPwdPayReset2VerifySmsCode",
            para,
            hideLoading: true,
            callback: data => {
              this.czqylianToken2 = data.lianToken;
            }
          });
        } else {
          fetchData({
            API:
              "api/Supplier/SupplierWalletLianlianEntPwdPayReset2VerifySmsCode",
            para,
            hideLoading: true,
            callback: data => {
              this.czqylianToken2 = data.lianToken;
            }
          });
        }
      } else {
        showTips("请输入验证码", "error");
      }
    },
    czqyNumber() {
      if (this.initInfo.EntryType === 3) {
        let para = this.czmmInfo;
        para.clientType = this.clientType;
        fetchData({
          API: "api/Supplier/SupplierWalletLianlianPerPwdPayReset1GetSmsCode",
          para,
          hideLoading: true,
          hideOkTips: true,
          callback: data => {
            let sec = 60;
            for (let i = 0; i <= 60; i++) {
              window.setTimeout(() => {
                if (sec != 0) {
                  this.timerCodeMsg3 = sec + "秒后重发";
                  this.fetchCodeMsg3 = true;
                  sec--;
                } else {
                  sec = 60; // 如果倒计时结束就让  获取验证码显示出来
                  this.timerCodeMsg3 = "重新发送验证码";
                  this.fetchCodeMsg3 = false;
                }
              }, i * 1000);
            }
            this.czqylianToken = data.lianToken;
          }
        });
      } else {
        fetchData({
          API: "api/Supplier/SupplierWalletLianlianEntPwdPayReset1GetSmsCode",
          hideLoading: true,
          hideOkTips: true,
          callback: data => {
            let sec = 60;
            for (let i = 0; i <= 60; i++) {
              window.setTimeout(() => {
                if (sec != 0) {
                  this.timerCodeMsg3 = sec + "秒后重发";
                  this.fetchCodeMsg3 = true;
                  sec--;
                } else {
                  sec = 60; // 如果倒计时结束就让  获取验证码显示出来
                  this.timerCodeMsg3 = "重新发送验证码";
                  this.fetchCodeMsg3 = false;
                }
              }, i * 1000);
            }
            this.czqylianToken = data.lianToken;
          }
        });
      }
    },
    czqyBtn() {
      if (this.czqyPay != this.confirmczqyPay) {
        showTips("两次密码不一样,请重新输入", "error");
        return;
      }
      if (this.czqyPay != "") {
        let para = {};
        para.lianToken = this.czqylianToken2;
        para.newPwdPay = this.czqyPay;
        if (this.initInfo.EntryType === 3) {
          para.clientType = this.clientType;
          fetchData({
            API: "api/Supplier/SupplierWalletLianlianPerPwdPayReset3SetPwdPay",
            para,
            hideLoading: true,
            callback: data => {
              this.czmm = false;
            }
          });
        } else {
          fetchData({
            API: "api/Supplier/SupplierWalletLianlianEntPwdPayReset3SetPwdPay",
            para,
            hideLoading: true,
            callback: data => {
              this.czmm = false;
            }
          });
        }
      } else {
        showTips("请输入验证码", "error");
      }
    },
    changePhone() {
      let para = {};
      para.phone = this.newPhone;
      para.smsCode = this.smsCode;
      para.lianToken = this.yzlianToken;
      para.clientType = this.clientType;
      fetchData({
        API: "api/Supplier/SupplierWalletLianlianBindPhoneChange3ChangePhone",
        hideLoading: true,
        para,
        callback: data => {
          this.yzphone = false;
          this.initInfo.Phone = data.newPhone;
        }
      });
    },
    changePayPwd() {
      let para = {};
      if (!zmm_validator(this.$el.querySelector(".xgmm"))) {
        return;
      } else if (this.changePwd.newPwdPay != this.changePwd.confirmPwdPay) {
        showTips("两次密码不一样,请重新输入", "error");
        return;
      }
      para = this.changePwd;
      para.clientType = this.clientType;
      delete para.confirmPwdPay;
      fetchData({
        API: "api/Supplier/SupplierWalletPayPwdModify",
        hideLoading: true,
        para,
        callback: data => {
          this.xgmm = false;
        }
      });
    }
  },
  created() {
    this.gettpCodeImg();
    this.initPageData();
  }
};
</script>