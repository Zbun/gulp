<template>
  <div id="apply-box">
    <header id="header">
      <a href="/" class="logo">
        <img src="/dist/images/logo.png" alt="">
      </a>
      <div class="action">
        <a href="javascript:;" class="item">已有账号,</a>
        <a href="login.html" class="item highlight" style="color:#0170B7">登录</a>
      </div>
    </header>
    <section class="apply-section">
      <div class="h-navbar">
        <section class="progress col4">
          <dl v-for="(item,$index) in items" :class="{'now': $index+1 == step,item}">
            <dt class="bar">
            </dt>
            <dd class="tips">
              {{item.select}}
            </dd>
          </dl>
        </section>
      </div>
      <div v-if="step == 1" id="login-box">
        <section class="content">
          <form class="form-login" onsubmit="return false;">
            <div class="inp-radio">
              <input type="text" class="com-ipt large userName" placeholder="请输入联系人姓名" v-model="UserName" data-validate="required">
              <div class="inline-radio">
                <label class="radio">
                  <input type="radio" name="sex" value="1" v-model="sex">
                  <span class="icon"></span>先生</label>
                <label class="radio">
                  <input type="radio" name="sex" value="0" v-model="sex">
                  <span class="icon"></span>女士</label>
              </div>
            </div>
            <div>
              <input type="text" class="com-ipt large tel" placeholder="请输入手机号" v-model="UserPhone" data-validate="required phone">
            </div>
            <div>
              <input type="text" class="com-ipt large" placeholder="请输入个人授权码" v-model="AuthCode" data-validate="required">
            </div>
            <div>
              <input type="password" class="com-ipt" placeholder="请输入密码" v-model="Password" data-validate="required">
            </div>
            <div>
              <input type="password" class="com-ipt" placeholder="请输入确认密码" v-model="confirmPwd" data-validate="required show">
            </div>
            <div class="ydsm"><input type="checkbox" v-model="ifRead">我已阅读并同意
              <a href="javascript:;" @click="agreement()">慧聪云商慧买卖会员协议，连连支付开户协议</a>
            </div>
            <div class="login-tips text-left" v-show="isError">
              <i class="fa fa-info-circle text-danger"></i>
              <span class="text-danger">{{errorMessage}}</span>
            </div>
            <button class="btn btn-nextstep big mt20 btn-submit" :class="{disabled:!ifRead}" type="submit" @click="toSubmit_Data($event)">
              下一步
            </button>
          </form>
        </section>
      </div>
      <submit-data v-else-if="step == 2"></submit-data>
      <upload-data v-else-if="step == 3"></upload-data>
      <com-applition v-else="step == 4"></com-applition>
    </section>
    <div class="popup" v-if="isShowPop">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>
        </h2>
        <div class="body">
          <div class="content">
            <div class="set">
              <agree-ment :content.sync="Content"></agree-ment>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary block" @click="onCancel_Click">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import submitData from "./personReg2.vue";
import uploadData from "./personReg3.vue";
import comApplition from "./personReg4.vue";
import agreeMent from "pages/agreement.vue";
export default {
  data() {
    return {
      step: 1,
      sex: "1",
      AuthCode: "",
      ifRead: true,
      isShowPop: false,
      systemType: 1,
      RegisterSource: 1,
      UserSite: 2,
      UserType: 1,
      Password: "",
      isError: false,
      ifRead: true,
      errorMessage: "",
      ok: false,
      phoneObj: "",
      timerCodeMsg: "",
      fetchCodeMsg: "",
      items: [
        { select: "资料验证" },
        { select: "资料提交" },
        { select: "资质上传" },
        { select: "完成" }
      ]
    };
  },
  components: { submitData, uploadData, comApplition, agreeMent },
  methods: {
    ipt_input() {
      this.isError = false;
    },
    agreement() {
      this.isShowPop = true;
    },
    toSubmit_Data(e) {
      var yzRealName = /^[\u4e00-\u9fa5]{2,4}$/;
      if (!zmm_validator(this.$el)) {
        return;
      } else if (this.Password != this.confirmPwd) {
        showTips("两次密码不一样,请重新输入", "error");
        return;
      } else if (yzRealName.test(this.UserName) === false) {
        showTips("请输入真实姓名", "error");
        return;
      }

      let para = {};
      para.Phone = this.UserPhone;
      para.Contact = this.UserName;
      para.Gender = this.sex;
      para.Pwd = this.Password;
      para.AuthCode = this.AuthCode;
      // para.UserSite = this.UserSite;
      // para.UserType = this.UserType;
      fetchData({
        API: "api/UserMng/JoinByPersonal_Step1",
        para,
        callback: data => {
          this.$router.push({
            path: "2",
            query: {
              UserSN: data.UserSn,
              AuthCode: data.AuthCode
            }
          });
        },
        errorCallback() {}
      });
    },
    onCancel_Click() {
      this.isShowPop = false;
    }
  },
  created() {
    this.step = this.$route.params.step;
  },
  watch: {
    $route(to, from) {
      this.step = this.$route.params.step;
    }
  }
};
</script>