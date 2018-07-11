<template>
  <div id="login-box" v-show="isJudged">
    <div class="login-header">
      <div class="container">
        <img src="/dist/images/logo.png" alt="logo">
        <img src="/dist/images/slogin.png" alt="">
      </div>
    </div>
    <section class="content" :style="{backgroundColor: bgColor}">
      <div class="container" :style="{backgroundImage: 'url(' + bgImage + ')'}">
        <form class="form-login" onsubmit="return false;">
          <p class="titForm">
            会员账户登录
            <a href="/apply.html?/#/memberReg/1">立即注册</a>
          </p>
          <p>
            <input type="search" class="com-ipt large userName" @input="ipt_input()" placeholder="请输入手机号" v-model="userName">
          </p>
          <p>
            <input type="password" class="com-ipt large password" @input="ipt_input()" placeholder="登录密码" v-model="password">
          </p>
          <p class="item captcha" v-if="showCaptcha">
            <input class="com-ipt tp-yzm" v-model="picCode" data-validate="required popshow" type="text" placeholder="请输入验证码">
            <img :src="imgCaptcha" class="imgCaptcha" alt="验证码" @click="refreshCaptcha($event)">
          </p>
          <p class="login-tips text-left" v-show="isError">
            <i class="fa fa-info-circle text-danger"></i>
            <span class="text-danger">{{errorMessage}}</span>
          </p>
          <button class="btn btn-primary big mt20 btn-submit" type="submit" :class="{disabled:!userName||!password||isSending}" @click="login_Click(0,$event)">
            登 录
          </button>
        </form>
      </div>
    </section>

  </div>
</template>
<script>
export default {
  data() {
    return {
      isError: false,
      errorMessage: "",
      ok: false,
      isSending: false,
      isJudged: false,
      userName: "s",
      password: "111111",
      imgCaptcha: true,
      showCaptcha: false,
      picCode: "",
      identity: "",
      bgImage: "",
      bgColor: ""
    };
  },
  components: {},
  methods: {
    ipt_input() {
      this.isError = false;
    },
    initPage() {
      let bgImage = "";
      let bgColor = "";
      this.bgImage = bgImage;
      this.bgColor = bgColor;
    },
    judgeIsLogin() {
      fetchData({
        API: "/api/UserAuth/IsLogin",
        callback: data => {
          if (data == 1) {
            window.location = "/index.html";
          } else {
            this.isJudged = true;
          }
        }
      });
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
      para.DeviceCode = "asdasd";
      para.Version = "IOS-1.0.0";
      let me = this;
      this.isSending = true;
      fetchData({
        API: "api/UserAuth/LoginRetailer",
        target: e.target,
        hideTips: true,
        hideLoading: !!refresh,
        para,
        handlerMessage(m) {
          me.isError = true;
          me.errorMessage = m || "";
        },
        callback(data) {
          me.ok = true;
          localStorage.token = data.token;
          localStorage._LOGIN_USERINFO = JSON.stringify(data);
          var status = data.Status;
          if (status == 1) {
            //正常,直接进入后台
            location = "/";
          } else if (status == 3) {
            //禁用,弹框提示用户被平台禁用,联系管理员
          } else if (status == 10 || status == 15) {
            //10开户驳回,15平台驳回,到审核进度界面
            if (data.EntryType == 3) {
              //跳转到个人审核进度界面
              location =
                "apply.html?/#/auditProgress?userType=" +
                data.UserType +
                "&userSN=" +
                data.UserSN +
                "&EntryType=" +
                data.EntryType;
            } else {
              //跳转到企业审核进度界面
              location =
                "apply.html?/#/cAuditProgress?userType=" +
                data.UserType +
                "&userSN=" +
                data.UserSN +
                "&EntryType=" +
                data.EntryType;
            }
          } else if (data.ProfileStatus == 1) {
            //跳转到补充资料界面
            location =
              "apply.html?/#/supplyInfo?userSN=" +
              data.UserSN +
              "&ProfileStatus=" +
              data.ProfileStatus +
              "&UserType=" +
              data.UserType +
              "&EntryType=" +
              data.EntryType;
          } else {
            if (data.EntryType == 3) {
              //跳转到个人审核进度界面
              location =
                "apply.html?/#/auditProgress?userType=" +
                data.UserType +
                "&userSN=" +
                data.UserSN +
                "&EntryType=" +
                data.EntryType;
            } else {
              //跳转到企业审核进度界面
              location =
                "apply.html?/#/cAuditProgress?userType=" +
                data.UserType +
                "&userSN=" +
                data.UserSN +
                "&EntryType=" +
                data.EntryType;
            }
          }
          // if (data.Status != 2 || data.Status != 3) {
          //   if (data.ProfileStatus == 2 && data.EntryType == 3) {
          //     location = "apply.html?/#/auditProgress?userType="+data.UserType+"&userSN="+data.UserSN+"&EntryType="+data.EntryType;
          //     }else if(data.ProfileStatus == 2 && (data.EntryType == 2 ||  data.EntryType == 1)){
          //     location = "apply.html?/#/cAuditProgress?userType="+data.UserType+"&userSN="+data.UserSN+"&EntryType="+data.EntryType;
          //   }
          //    else if (data.ProfileStatus == 3) {
          //     location = "/";
          //   } else {
          //     location =
          //       "apply.html?/#/supplyInfo?userSN=" +
          //       data.UserSN +
          //       "&ProfileStatus=" +
          //       data.ProfileStatus +
          //       "&UserType=" +
          //       data.UserType+"&EntryType="+data.EntryType
          //   }
          // }
        },
        errorCallback(d) {
          me.isSending = false;
          if (d.Data && d.Data.Identity) {
            me.showCaptcha = true;
            me.imgCaptcha = d.Data.ImgBase64;
            me.identity = d.Data.Identity;
          }
        }
      });
    },
    refreshCaptcha(e) {
      this.login_Click(1, e);
    }
  },
  mounted() {
    this.judgeIsLogin();
  },
  created() {
    this.initPage();
  }
};
</script>
<style lang="SASS" scoped>
#login-box {
  margin: 0;
  .login-header {
    height: 80px;
    line-height: 80px;
    span {
      font-size: 16px;
      color: #666;
    }
  }
  .container {
    width: 1200px;
    margin: 0 auto;
    text-align: left;
    height: 100%;
  }
  .content {
    display: block;
    height: 600px;
  }
  form {
    width: 360px;
    height: 320px;
    background: #fff;
    border-radius: 6px;
    border: 1px solid #ccc;
    margin-right: 100px;
    float: right;
    margin-top: 140px;
    padding: 30px;
    img.imgCaptcha {
      width: 100px;
      height: 34px;
    }
    p {
      margin-bottom: 12px;
      &.for_pwd {
        margin-bottom: 0;
        text-align: right;
      }
      &.login-tips {
        margin-bottom: 0;
        background: #ffe6e2;
        border-radius: 4px;
        border: 1px solid #fcd3cd;
        height: 30px;
        line-height: 28px;
        padding-left: 10px;
      }
      &.titForm {
        font-size: 18px;
        font-weight: bolder;
        a {
          float: right;
          color: #e46900;
          font-weight: normal;
          font-size: 12px;
          line-height: 26px;
        }
      }
    }
    input {
      width: 100%;
      border-radius: 4px;
      border: 1px solid #d9dce0;
      height: 34px;
      &.tp-yzm {
        width: 190px;
      }
    }
    .btn-primary {
      color: #fff;
      background: #e46900;
      border-color: #f38000;
      width: 100%;
      font-size: 18px;
      height: 44px;
      margin-top: 10px;
    }
  }
  .login-footer {
    .container {
      margin-top: 80px;
      ul {
        border-top: 1px solid #e6e9ee;
        border-bottom: 1px solid #e6e9ee;
        display: flex;
        padding: 20px 33px;
        justify-content: space-between;

        &.ysFooter li {
          font-size: 16px;
          font-weight: 650;
        }
        &.linkFooter li {
          p {
            margin-bottom: 10px;
            color: #666;
            a {
              color: #666;
            }
          }
          .kefu {
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 5px;
            display: inline-block;
            margin-top: 10px;
          }
          p:first-child {
            font-size: 14px;
            font-weight: bolder;
          }
        }
      }
      .wzsm {
        text-align: center;
        margin: 24px 0;
        color: #999;
      }
      .webIink {
        display: flex;
        justify-content: center;
        margin-top: 18px;
        div {
          display: flex;
          width: 102px;
          height: 34px;
          background: #eee;
          padding: 2px;
          margin-right: 10px;
          line-height: 15px;
          color: #666;
          a {
            text-align: left;
          }
          a:hover {
            color: #666;
            text-decoration: none;
          }
          span {
            width: 50px;
            height: 28px;
            background-position: -2px 0;
            margin-right: 0px;
          }
        }
      }
      p {
        margin-top: 10px;
      }
    }
    .bg-icon {
      background: url(/dist/images/bg_group.png);
      background-position: -110px -5px;
      width: 50px;
      height: 46px;
      display: inline-block;
      background-size: 308px 142px;
      vertical-align: middle;
      margin-right: 10px;
    }
    .bg-icon1 {
      background-position: -160px -5px;
    }
    .bg-icon2 {
      background-position: -210px -5px;
    }
    .bg-icon3 {
      background-position: -258px -5px;
    }
    .sjrz-icon {
      background-position: -110px -60px;
      width: 32px;
      height: 32px;
    }
    .jyaq-icon {
      background-position: -146px -60px;
      width: 32px;
      height: 32px;
    }
    .fonter-icon2 {
      background-position: -2px -36px !important;
    }
    .fonter-icon3 {
      background-position: -2px -72px !important;
    }
    .fonter-icon4 {
      background-position: -2px -110px !important;
    }
  }
}
</style>