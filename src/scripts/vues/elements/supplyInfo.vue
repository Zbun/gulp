<template>
  <div id="apply-box">
    <header id="header">
      <a href="/" class="logo">
        <img src="/dist/images/logo.png" alt="">
      </a>
      <span>入驻商审核进度</span>
      <div class="action">
        <a href="javascript:;" class="item">已有账号,</a>
        <a href="login.html" class="item highlight" style="color:#0170B7">登录</a>
      </div>
    </header>
    <section class="apply-section">
      <!--//<a href="">完善注册信息</a> -->
      <div class="supply-info">
        <img src="/dist/images/regImg.png" alt="">
        <p class="mt10 mb20">注册信息不完善,为了不影响您的使用,请尽快完善注册信息.</p>
        <router-link :to="{path:'apply/2',query:{UserSN:UserSN}}" v-if="ProfileStatus==0&&UserType==2&& EntryType!=3" class="item">完善注册信息</router-link>
        <router-link :to="{path:'apply/3',query:{UserSN:UserSN}}" v-if="ProfileStatus==1&&UserType==2&& EntryType!= 3" class="item">完善注册信息</router-link>
        <router-link :to="{path:'memberReg/2',query:{UserSN:UserSN}}" v-if="ProfileStatus==0&&UserType==3&&EntryType!=3" class="item">完善注册信息</router-link>
        <router-link :to="{path:'memberReg/3',query:{UserSN:UserSN}}" v-if="ProfileStatus==1&&UserType==3&&EntryType!=3" class="item">完善注册信息</router-link>
        <router-link :to="{path:'personReg/2',query:{UserSN:UserSN}}" v-if="ProfileStatus==0&&EntryType==3" class="item">完善注册信息</router-link>
        <router-link :to="{path:'personReg/3',query:{UserSN:UserSN}}" v-if="ProfileStatus==1&&EntryType==3" class="item">完善注册信息</router-link>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      UserSN: "",
      ProfileStatus: "",
      UserType: ""
    };
  },
  components: {},
  methods: {
    getParams() {
      // 取到路由带过来的参数
      this.UserSN = this.$route.query.userSN;
      this.ProfileStatus = this.$route.query.ProfileStatus;
      this.UserType = this.$route.query.UserType;
      this.EntryType = this.$route.query.EntryType;
      if (this.ProfileStatus == 0) {
      } else {
      }
    }
  },
  created() {
    this.getParams();
  }
};
</script>