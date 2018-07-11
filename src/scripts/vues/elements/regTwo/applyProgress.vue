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
      <div id="login-box" class="pt20 pb30">

        资料认证审核中，预计1-3个工作日，请耐心等待！

      </div>

    </section>
    <div class="text-center b-fixed-footer">
      © 2016 - 2017 家电汇 版权所有
    </div>
    <div class="popup" v-show="isShowImgPop">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>查看</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <img :src="AptitudePic" alt="" width="100%" height="100%" style="padding: 10px;">
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      step: 2,
      isError: false,
      errorMessage: "",
      isShowImgPop: false,
      ok: false,
      UserSN: "",
      userType: "",
      items: [
        { select: "提交申请" },
        { select: "认证审核" },
        { select: "完成" }
      ],
      editItem: {}
    };
  },
  components: {},
  methods: {
    getParams() {
      this.UserSN = this.$route.query.userSN;
      this.userType = this.$route.query.userType;
    },
    initPage() {}
  },
  created() {
    this.getParams();
  }
};
</script>