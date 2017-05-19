<template>
  <div class="main">
    <div class="content-title">
      <h4 class="text-primary text-center fr" v-show="ok">登录成功，即将跳转...</h4>登录</div>
    <div class="content-field">
      <form class="text-center content-small" onsubmit="return false;">
        <div class="set dis-inline-block">
          <dl class="item">
            <dt class="title required-mark">
              用户名
            </dt>
            <dd class="content">
              <input data-validate="required down" type="text" class="com-ipt large" placeholder="请输入用户名" v-model="UserName">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title required-mark">
              密码
            </dt>
            <dd class="content">
              <input data-validate="required down" type="password" class="com-ipt large" placeholder="请输入密码" v-model="UserPwd" @keydown.enter="login_Click()">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title">&nbsp;</dt>
            <dd class="content">
              <button class="btn btn-primary big mt20" :class="{disabled:!UserName||!UserPwd||isSending}" @click="login_Click()">
                登录
              </button>
            </dd>
          </dl>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        ok: false,
        isSending: false
      }
    },
    components: {},
    methods: {
      login_Click() {
        if (!zmm_validator(this.$el)) {
          return;
        }
        let me = this;
        this.isSending = true;
        fetchData({
          API: 'api/User/Login',
          para: {
            UserName: this.UserName,
            UserPwd: this.UserPwd
          },
          callback(data) {
            me.ok = true;
            localStorage.token = data;
            // me.$store.state.userName = localStorage.userName = me.UserName;
            me.$store.state.isShowMenu = true;
            me.getMenus();
            setTimeout(function() {
              var rh = localStorage.referrerHash;
              if (rh && rh.length > 0 && rh.indexOf('login') == -1 && rh.indexOf('\/b\/u') == -1) {
                location.hash = localStorage.referrerHash;
                var $nav = $('.home-menu').find('.nav');
                $nav.find('.link').removeClass('on').closest('.item').removeClass('on');
                $nav.find('a[href="' + rh + '"]').addClass('on').closest('.item').addClass('on');
              } else {
                me.$router.go({
                  name: 'home'
                })
              }
            }, 500)
          },
          errorCallback() {
            me.isSending = false;
          }
        })
      },
      getMenus() {
        let me = this;
        fetchData({
          API: '/Api/User/UserIndex',
          callback(data) {
            localStorage.token = data.Token;
            me.$store.state.userName = localStorage.userName = data.Real;
            me.$store.state.companyName = localStorage.companyName = data.CompanyName;
            me.$store.state.isShowMenu = true;
            me.$store.state.isAdmin = !!data.IsAdmin;
            me.$store.state.menu = data.Menus;
            me.$store.state.action = data.Action;
          }
        })
      }
    },
    ready() {}
}
</script>
