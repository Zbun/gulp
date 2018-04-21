<template>
  <div id="login-box" v-show="isJudged">
    <section class="content">
      <div class="slogan">
        <img src="/dist/images/logo.png" alt="logo">
      </div>
      <form class="form-login" onsubmit="return false;">
        <p>
          <input type="search" class="com-ipt large userName" @input="ipt_input()" placeholder="请输入用户名" v-model="userName">
        </p>
        <p>
          <input type="password" class="com-ipt large password" @input="ipt_input()" placeholder="请输入密码" v-model="password">
        </p>
        <p class="item captcha" v-if="showCaptcha">
          <b class="com-ipt-tips">验证码</b>
          <input class="com-ipt" v-model="picCode" data-validate="required popshow" type="text" placeholder="请输入验证码">
          <img :src="imgCaptcha" class="imgCaptcha" alt="验证码" @click="refreshCaptcha($event)">
        </p>
        <p class="login-tips text-left" v-show="isError"><i class="fa fa-info-circle text-danger"></i><span class="text-danger">{{errorMessage}}</span></p>
        <button class="btn btn-primary big mt20 btn-submit" type="submit" :class="{disabled:!userName||!password||isSending}" @click="login_Click(0,$event)">
          登 录
        </button>
      </form>
    </section>
    <!--     <section class="footer">
      Copyright &copy 2017{{new Date().getFullYear()>2017?'-'+new Date().getFullYear():''}} 智选云商 豫ICP备17047128号
    </section> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      isError: false,
      errorMessage: '',
      ok: false,
      isSending: false,
      isJudged: false,
      userName: 'admin',
      password: '111111',
      imgCaptcha: false,
      showCaptcha: false,
      picCode: '',
      identity: '',
    }
  },
  components: {},
  methods: {
    ipt_input() {
      this.isError = false;
    },
    judgeIsLogin() {
      fetchData({
        API: '/api/UserAuth/IsLogin',
        callback: data => {
          if (data == 1) {
            window.location = '/index.html';
          } else {
            this.isJudged = true;

          }
        }
      })
    },
    login_Click(refresh, e) {
      if (!refresh) {
        if (!zmm_validator(this.$el)) {
          return;
        }
      }
      let $el = $(this.$el);
      let para = {};
      para.userName = this.userName;
      para.password = this.password;
      para.picCode = this.picCode;
      para.identity = this.identity;
      let me = this;
      this.isSending = true;
      fetchData({
        API: 'api/UserAuth/Login',
        target: e.target,
        hideTips: true,
        hideLoading: !!refresh,
        para,
        handlerMessage(m) {
          me.isError = true;
          me.errorMessage = m || '';
        },
        callback(data) {
          me.ok = true;
          localStorage.token = data.token;
          localStorage._LOGIN_USERINFO = JSON.stringify(data);
          location = '/';
        },
        errorCallback(d) {
          me.isSending = false;
          if (d.Data && d.Data.Identity) {
            me.showCaptcha = true;
            me.imgCaptcha = d.Data.ImgBase64;
            me.identity = d.Data.Identity;
          }
        }
      })
    },
    refreshCaptcha(e) {
      this.login_Click(1, e);
    }
  },
  mounted() {
    this.judgeIsLogin();
  }
}
</script>