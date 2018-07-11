<template>
  <div id="apply-box">
    <header id="header">
      <a href="/" class="logo">
        <img src="/dist/images/logo.png" alt="">
        <i style="font-size:18px;">找回密码</i>
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
              <input type="text" class="com-ipt large tel" placeholder="请输入手机号" v-model="Phone" data-validate="required phone" @blur.prevent="usernameIsExits()">
            </div>

            <div>
              <input type="text" class="com-ipt large yzm" placeholder="请输入验证码" v-model="UserYzm" data-validate="required">
              <img :src="yzPic" alt="" @click="gettpCodeImg()" class="tpYzm">
            </div>
            <div class="d-dxyzm">
              <input type="text" class="com-ipt large dxyzm" placeholder="请输入短信验证码" v-model="addItem.SmsCode" data-validate="required">
              <button :disabled="fetchCodeMsg || false" class="getCheckNumber" :class="{unselected: fetchCodeMsg}" @click="getCheckNumber()">{{timerCodeMsg||'获取短信验证码'}}</button>
            </div>
            <div>
              <input type="password" class="com-ipt" placeholder="请输入新密码" v-model="addItem.NewPassword" data-validate="required">
            </div>
            <div>
              <input type="password" class="com-ipt" placeholder="请再次输入新密码" v-model="addItem.confirmPwd" data-validate="required show">
            </div>

            <div class="login-tips text-left" v-show="isError">
              <i class="fa fa-info-circle text-danger"></i>
              <span class="text-danger">{{errorMessage}}</span>
            </div>
            <button class="btn btn-primary block big mt20 btn-submit" type="submit" @click="toSubmit_Data($event)">
              下一步
            </button>
          </form>
        </div>
      </div>
    </section>
    <div class="text-center b-fixed-footer">
      © 2000 - 2018 huimaimai.com 版权所有
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      yzPic: "",
      addItem: {},
      systemType: 1,
      timerCodeMsg: "",
      fetchCodeMsg: ""
    };
  },
  components: {},
  methods: {
    gettpCodeImg() {
      fetchData({
        API: "api/Misc/CreatePicCode",
        hideLoading: true,
        hideOkTips: true,
        para: {},
        callback: data => {
          this.yzPic = window.APISERVER + data.ImgUrl;
          this.identity = data.Identity;
          //this.dataIn.arrDataList.push(data);
        }
      });
    },
    usernameIsExits() {
      fetchData({
        API: "/api/UserAuth/UserNameIsExists",
        hideLoading: true,
        hideOkTips: true,
        para: {
          UserName: this.Phone
        },
        callback: data => {
          if (data == 0) {
            showTips("用户名不存在", "error");
            return;
          }
        }
      });
    },
    getCheckNumber() {
      let $el = $(this.$el);
      let para = {};
      let Phone = this.Phone;
      let userYzm = this.UserYzm;
      para.Phone = Phone;
      para.ImgCode = userYzm;
      para.Identity = this.identity;
      para.SystemType = this.systemType;
      if (!validatorManu.isPhone(Phone)) {
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
    toSubmit_Data() {
      let para = {};
      if (!zmm_validator(this.$el)) {
        return;
      } else if (this.NewPassword != this.confirmPwd) {
        showTips("两次密码不一样,请重新输入", "error");
        return;
      }
      para = this.addItem;
      para.Phone = this.Phone;
      delete para.confirmPwd;
      fetchData({
        API: "api/UserMng/FindPassword",
        para,
        hideOkTips: true,
        callback: data => {
          window.location.href = "login.html#/";
        },
        errorCallback() {}
      });
    }
  },
  created() {
    this.gettpCodeImg();
  },
  watch: {}
};
</script>