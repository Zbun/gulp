<template>
  <div id="apply-box">
    <header id="header">
      <a href="/" class="logo">
        <img src="/dist/images/logo.png" alt="">
        <i style="font-size: 18px;">入驻商申请</i>
      </a>
      <div class="action">
        <a href="javascript:;" class="item">已有账号,</a>
        <a href="login.html" class="item highlight" style="color:#0170B7;padding: 0;padding-right: 14px; border-left: 0;">登录</a>
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
                  <input type="radio" name="sex" value="2" v-model="sex">
                  <span class="icon"></span>女士</label>
              </div>
            </div>
            <div>
              <input type="text" class="com-ipt large tel" placeholder="请输入手机号" v-model="UserPhone" data-validate="required phone">
            </div>
            <div>
              <input type="password" class="com-ipt" placeholder="请输入密码" v-model="Password" data-validate="required">
            </div>
            <div>
              <input type="password" class="com-ipt" placeholder="请输入确认密码" v-model="confirmPwd" data-validate="required show">
            </div>
            <div>
              <input type="text" class="com-ipt large email" placeholder="请输入电子邮箱" v-model="UserEmail" data-validate="required email">
            </div>
            <div>
              <input type="text" class="com-ipt large yzm" placeholder="请输入验证码" v-model="UserYzm" data-validate="required">
              <img :src="yzPic" alt="" @click="gettpCodeImg()" class="tpYzm">
            </div>
            <div class="d-dxyzm">
              <input type="text" class="com-ipt large dxyzm" placeholder="请输入短信验证码" v-model="UserDxyzm" data-validate="required">
              <button :disabled="fetchCodeMsg || false" class="getCheckNumber" :class="{unselected: fetchCodeMsg}" @click="getCheckNumber()">{{timerCodeMsg||'获取短信验证码'}}</button>
            </div>
            <div class="ydsm"><input type="checkbox" v-model="ifRead">我已阅读并同意
              <a href="javascript:;" @click="agreement()">慧聪云商慧买卖会员协议，连连支付开户协议</a>
            </div>
            <div class="login-tips text-left" v-show="isError">
              <i class="fa fa-info-circle text-danger"></i>
              <span class="text-danger">{{errorMessage}}</span>
            </div>
            <button class="btn btn-primary block mt20" :class="{disabled:!ifRead}" type="submit" @click="toSubmit_Data($event)">
              下一步
            </button>
          </form>
        </section>
      </div>
      <submit-data v-else-if="step == 2" :cur-item.sync="curItem" :edit-item.sync="editItem" :is-edit="isEdit"></submit-data>
      <upload-data v-else-if="step == 3" :cur-item.sync="curItem" :edit-item.sync="editItem" :is-edit="isEdit"></upload-data>
      <com-applition v-else="step == 4" :cur-item.sync="curItem" :edit-item.sync="editItem" :is-edit="isEdit"></com-applition>
    </section>
    <div class="text-center b-fixed-footer">
      © 2000 - 2018 huimaimai.com 版权所有
    </div>
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
          <button class="btn btn-primary" @click="onCancel_Click">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import submitData from "./eApply2.vue";
import uploadData from "./eApply3.vue";
import comApplition from "./eApply4.vue";
import agreeMent from "pages/agreement.vue";
export default {
  data() {
    return {
      step: 1,
      isShowPop: false,
      yzPic: "",
      ifRead: true,
      identity: "",
      sex: "1",
      systemType: 1,
      RegisterSource: 1,
      UserSite: 4,
      UserType: 2,
      isError: false,
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
    gettpCodeImg() {
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
    getCheckNumber() {
      let $el = $(this.$el);
      let para = {};
      let userPhone = this.UserPhone;
      let userYzm = this.UserYzm;
      para.Phone = userPhone;
      para.ImgCode = userYzm;
      para.Identity = this.identity;
      para.SystemType = this.systemType;

      if (!validatorManu.isPhone(userPhone)) {
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
      para.RealName = this.UserName;
      para.sex = this.sex;
      para.Email = this.UserEmail;
      para.SmsCode = this.UserDxyzm;
      para.RegisterSource = this.RegisterSource;
      para.UserSite = this.UserSite;
      para.UserType = this.UserType;
      para.Password = this.Password;
      fetchData({
        API: "api/UserAuth/RegUser",
        para,
        callback: data => {
          this.$router.push({
            path: "2",
            query: {
              UserSN: data
            }
          });
        },
        errorCallback() {
          this.gettpCodeImg();
        }
      });
    },
    onSubmit_Click() {},
    onCancel_Click() {
      this.isShowPop = false;
    }
  },
  created() {
    this.gettpCodeImg();
    this.step = this.$route.params.step;
  },
  watch: {
    $route(to, from) {
      this.step = this.$route.params.step;
    }
  }
};
</script>