<template>
  <div id="apply-box">
    <header id="header">
      <a href="/" class="logo">
        <img src="/dist/images/logo.png" alt="">
        <i style="font-size:18px;">修改密码</i>
      </a>
      <div class="action">
        <a href="javascript:;" class="item">已有账号,</a>
        <a href="login.html" class="item highlight" style="color:#0170B7">登录</a>
      </div>
    </header>
    <section class="apply-section find-pwd">
      <div id="login-box">
        <div class="content">
          <form class="form-login" onsubmit="return false;">
            <div>
              用户名: {{computedUserInfo.RealName}}
            </div>
            <div>
              <input type="text" class="com-ipt large tel" placeholder="请输入原密码" v-model="OldPassword" data-validate="required">
            </div>
            <div>
              <input type="password" class="com-ipt" placeholder="请输入密码" v-model="NewPassword" data-validate="required">
            </div>
            <div>
              <input type="password" class="com-ipt" placeholder="请再次输入密码" v-model="confirmPwd" data-validate="required show">
            </div>

            <div class="login-tips text-left" v-show="isError">
              <i class="fa fa-info-circle text-danger"></i>
              <span class="text-danger">{{errorMessage}}</span>
            </div>
            <button class="btn btn-primary block mt20 btn-submit" type="submit" @click="toSubmit_Data($event)">
              下一步
            </button>
          </form>
        </div>
      </div>
    </section>
    <div class="text-center b-fixed-footer">
      © 2016 - 2017 家电汇 版权所有
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      yzPic: "",
      systemType: 1,
      timerCodeMsg: "",
      fetchCodeMsg: "",
    };
  },
  components: {},
  methods: {
    toSubmit_Data() {
      let para={};
      if (!zmm_validator(this.$el)) {
        return;
      } else if (this.NewPassword != this.confirmPwd) {
        showTips("两次密码不一样,请重新输入", "error");
        return;
      }
          para.OldPassword=this.OldPassword;
       para.NewPassword=this.NewPassword;
      fetchData({
        API: "api/UserMng/ModifyPassword",
        hideLoading: true,
        hideOkTips:false,
        para,
        callback: data => {
            window.location.href="login.html#/";
        },
        errorCallback() {}
      });
    }
  },
  created() {
  },
  computed: {
    computedUserInfo() {
      return localStorage._LOGIN_USERINFO ? JSON.parse(localStorage._LOGIN_USERINFO) : {};
    }
  },
  watch: {}
};
</script>