<template>
  <div id="login-box">
    <section class="content">
      <div class="sign-box">
        <span class="sign">企业版</span>
      </div>
      <div class="slogan">
        <img src="/dist/images/logo_login.png" alt="">
        <span class="logo-slogan">
        <img src="/dist/images/logo_slogan.png" alt="">
         </span>
      </div>
      <form class="form-login" onsubmit="return false;">
        <p class="login-tips bg-danger" v-show="isError"><i class="icon icon-minus-circle"></i><span class="text-danger">{{errorMessage}}</span></p>
        <p><i class="icon userName"></i>
          <input type="text" class="com-ipt large userName" @input="ipt_input()" placeholder="请输入用户名" v-model="UserName">
        </p>
        <p><i class="icon password"></i>
          <input type="password" class="com-ipt large password" @input="ipt_input()" placeholder="请输入密码" v-model="UserPwd" @keydown.enter="login_Click()">
        </p>
        <button class="btn btn-primary big mt20 btn-submit" :class="{disabled:!UserName||!UserPwd||isSending}" @click="login_Click()">
          登录
        </button>
      </form>
    </section>
    <section class="footer">
      &copy 2016-2017 <a href="javascript:;" class="highlight">Z管家</a>&nbsp;
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isError: false,
      errorMessage: '',
      ok: false,
      isSending: false
    }
  },
  components: {},
  methods: {
    ipt_input() {
      this.isError = false;
    },
    login_Click() {
      if (!zmm_validator(this.$el)) {
        return;
      }
      let me = this;
      this.isSending = true;
      fetchData({
        API: 'api/User/Login',
        hideTips: true,
        para: {
          UserName: this.UserName,
          UserPwd: this.UserPwd
        },
        handlerMessage(m) {
          me.isError = true;
          me.errorMessage = m || '';
        },
        callback(data) {
          me.ok = true;
          localStorage.token = data;
          // me.$store.state.userName = localStorage.userName = me.UserName;
          me.$store.state.isShowMenu = true;
          window.location = '/index.html';
          // setTimeout(function() {
          //   me.$router.go({
          //     name: 'home'
          //   })
          //   // var rh = localStorage.referrerHash;
          //   // if (rh && rh.length > 0 && rh.indexOf('login') == -1 && rh.indexOf('\/b\/u') == -1) {
          //   //   location.hash = localStorage.referrerHash;
          //   //   var $nav = $('.home-menu').find('.nav');
          //   //   $nav.find('.link').removeClass('on').closest('.item').removeClass('on');
          //   //   $nav.find('a[href="' + rh + '"]').addClass('on').closest('.item').addClass('on');
          //   // } else {

          //   // }
          // }, 500)
        },
        errorCallback() {
          me.isSending = false;
        }
      })
    },
  },
  ready() {}
}
</script>