<template>
  <div id="apply-box">
    <header id="header">
      <a href="/" class="logo">
        <img src="/dist/images/logo.png" alt="">
        <i style="font-size: 18px;">卖家注册</i>
      </a>
      <div class="action" :class="css.action">
        <a href="javascript:;" class="item">已有账号,</a>
        <a href="login.html" class="item highlight" style="color:#0170B7;padding: 0;padding-right: 14px; border-left: 0;">登录</a>
      </div>
    </header>
    <section class="apply-section">
      <div class="content-field clearfix">
        <div class="pt20" :class="css.hotline">遇到问题?请致电:
          <span :class="css.dc3500">400-1234-1234</span>
        </div>
        <div class="two-column-view">
          <div class="item">
            <div class="clearfix align-btn">
              <span class="crumbs">
                <input type="file" class="import-img hidden" :accept="uploadAcceptImg">
              </span>
            </div>
            <div class="content mt10" style="display:flex;justify-content: center;">
              <div class="set">
                <h5 :class="css.lLinetip" class="mb15">身份认证资料
                  <a href="javascript:;" class="fr highlight">
                    <em>如号码已申请,点此查询进度></em>
                  </a>
                  </span>
                </h5>
                <dl class="item">
                  <dt class="title required-mark">手机号</dt>
                  <dd class="content">
                    <input type="text" class="com-ipt xx-large" placeholder="请输入手机号" data-validate="required phone" v-model="addItem.Phone" />
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">验证码</dt>
                  <dd class="content">
                    <input type="text" class="com-ipt xx-large" placeholder="请输入验证码" v-model="UserYzm" maxlength="20" data-validate="required">
                    <img :src="yzPic" alt="" @click="gettpCodeImg()" class="tpYzm">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">短信验证码</dt>
                  <dd class="content">
                    <input type="text" class="com-ipt xx-large" placeholder="请输入短信验证码" v-model="addItem.SmsCode" data-validate="required">
                    <button :disabled="fetchCodeMsg || false" class="getCheckNumber" :class="{unselected: fetchCodeMsg}" @click="getCheckNumber()">{{timerCodeMsg||'获取短信验证码'}}</button>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">姓名</dt>
                  <dd class="content">
                    <input type="text" class="com-ipt x-large userName" placeholder="请输入联系人姓名" v-model="addItem.Name" data-validate="required">
                    <div class="inline-radio">
                      <label class="radio">
                        <input type="radio" name="sex" value="男" v-model="addItem.Sex" data-validate="required">
                        <span class="icon"></span>先生</label>
                      <label class="radio">
                        <input type="radio" name="sex" value="女" v-model="addItem.Sex" data-validate="required">
                        <span class="icon"></span>女士</label>
                    </div>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">身份证号</dt>
                  <dd class="content">
                    <input type="text" class="com-ipt x-large userName" placeholder="请输入身份证号" v-model="addItem.IDCardNumber" data-validate="required">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">身份证有效期</dt>
                  <dd class="content">
                    <div>
                      <label class="radio">
                        <input type="radio" name="ifIdValidity" id="" value="1" v-model="addItem.IDCardIsPermanentValidity">
                        <span class="icon"></span>是</label>
                      <label class="radio">
                        <input type="radio" name="ifIdValidity" id="" value="0" v-model="addItem.IDCardIsPermanentValidity">
                        <span class="icon"></span>否</label>
                      <p class="mt10" v-show="addItem.IDCardIsPermanentValidity==0">
                        <!-- <input type="text" placeholder="请输入有效时间"> -->
                        <input type="text" placeholder="请输入有效时间" ref="IDCardEndDateTime" onclick="WdatePicker()" @focus="changeIDCardEndDateTime()" v-model="addItem.IDCardEndDateTime">
                      </p>
                    </div>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">身份资质</dt>
                  <dd class="content">
                    <div class="upload-info" :class="addItem.ThreeInOne==1 ?'twoColumn': ''">
                      <div class="fl mr10">
                        <div class="upload-box" @click="clickUpload('IDCardZImage',1)" v-if="!addItem.IDCardZImage"></div>
                        <div class="upload-img-list" v-else>
                          <div class="item">
                            <sup class="del" @click="delPic('IDCardZImage')"></sup>
                            <img :src="addItem.IDCardZImage" alt="">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="upload-info" :class="addItem.ThreeInOne==1 ?'twoColumn': ''">
                      <div>
                        <div class="upload-box" @click="clickUpload('IDCardFImage',1)" v-if="!addItem.IDCardFImage"></div>
                        <div class="upload-img-list" v-else>
                          <div class="item">
                            <sup class="del" @click="delPic('IDCardFImage')"></sup>
                            <img :src="addItem.IDCardFImage" alt="">
                          </div>
                        </div>
                      </div>
                    </div>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">职业</dt>
                  <dd class="content">
                    <select class="ml5 com-ipt x-large" v-model="addItem.Occupation">
                      <option value="公务员">公务员</option>
                      <option value="事业单位员工">事业单位员工</option>
                      <option value="企业高管">企业高管</option>
                      <option value="私营业主">私营业主</option>
                      <option value="金融从业人员">金融从业人员</option>
                      <option value="律师">律师</option>
                      <option value="会计师">会计师</option>
                      <option value="医护人员">医护人员</option>
                    </select>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">地区</dt>
                  <dd class="content">
                    <area-box :area-codes="addItem.AreaCode1+','+addItem.AreaCode2+','+addItem.AreaCode3+','+addItem.AreaCode4" :area-code.sync="addItem.AreaCode" :is-required="1"></area-box>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">详细地址</dt>
                  <dd class="content">
                    <textarea name="" id="" cols="10" rows="3" class="com-ipt x-large" placeholder="请输入详细地址" v-model="addItem.AddressDetails" data-validate="required"></textarea>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">企业类型</dt>
                  <dd class="content">
                    <div>
                      <label class="radio">
                        <input type="radio" name="EnterpriseType" id="" value="1" v-model="addItem.EnterpriseType" data-validate="required">
                        <span class="icon"></span>企业</label>
                      <label class="radio">
                        <input type="radio" name="EnterpriseType" id="" value="2" v-model="addItem.EnterpriseType" data-validate="required">
                        <span class="icon"></span>个体户</label>
                      <label class="radio">
                        <input type="radio" name="EnterpriseType" id="" value="3" v-model="addItem.EnterpriseType" data-validate="required">
                        <span class="icon"></span>个人</label>
                    </div>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">企业名称</dt>
                  <dd class="content">
                    <input type="text" class="com-ipt x-large userName" placeholder="请输入企业名称" v-model="addItem.EnterpriseName" data-validate="required">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">税号</dt>
                  <dd class="content">
                    <input type="text" class="com-ipt x-large userName" placeholder="请输入税号" v-model="addItem.TaxNum" data-validate="required"> </dd>
                </dl>
                <dl class="item">
                  <dt class="title">法人姓名</dt>
                  <dd class="content">
                    <input type="text" class="com-ipt x-large userName" placeholder="请输入法人姓名" v-model="addItem.LegalPerson" data-validate="required">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">营业执照图片</dt>
                  <dd class="content">
                    <div class="upload-info" :class="addItem.ThreeInOne==1 ?'twoColumn': ''">
                      <div>
                        <div class="upload-box" @click="clickUpload('LicenseImage',1)" v-if="!addItem.LicenseImage"></div>
                        <div class="upload-img-list" v-else>
                          <div class="item">
                            <sup class="del" @click="delPic('LicenseImage')"></sup>
                            <img :src="addItem.LicenseImage" alt="">
                          </div>
                        </div>
                      </div>
                    </div>

                  </dd>
                </dl>

                <button class="btn btn-primary big mt20 x-large" type="submit" @click="toSubmit_Data($event)">
                  提交注册
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
import formDataUpload from "commonScripts/formDataUpload.js";
import areaBox from "vues/components/AreaBox.vue";
export default {
  data() {
    return {
      step: 1,
      isShowPop: false,
      yzPic: "",
      ifRead: true,
      identity: "",
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
      addItem: {
        Phone: "18888888000",
        Name: "姓名",
        IDCardNumber: "身份证号",
        Sex: "男",
        Occupation: "公务员",
        IDCardIsPermanentValidity: 1,
        IDCardZImage:
          "http://tstpic.jdhui.com.cn/u/eca53a65fb9649bebf037bb8ef9218fb.jpg",
        IDCardFImage:
          "http://tstpic.jdhui.com.cn/u/eca53a65fb9649bebf037bb8ef9218fb.jpg",
        LicenseImage:
          "http://tstpic.jdhui.com.cn/u/eca53a65fb9649bebf037bb8ef9218fb.jpg",
        AddressDetails: "详细地址",
        EnterpriseName: "名称",
        TaxNum: "税号",
        LegalPerson: "法人姓名",
        EnterpriseType: 1
      },
      curImgStr: ""
    };
  },
  components: { formDataUpload, areaBox },
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
    initImport() {
      //初始化上传图片方法
      let me = this;
      formDataUpload({
        url: window.UPLOADSERVER,
        obj: this.$el.querySelector(".import-img"),
        type: this.uploadAcceptImg,
        size: "10M",
        callback(data) {
          me.uploadOk(data.Data);
        }
      });
    },
    clickUpload(item, type) {
      this.$el.querySelector(".import-img").click();
      this.curImgStr = item;
    },
    uploadOk(data) {
      this.addItem[this.curImgStr] = data;
    },
    delPic(item) {
      this.addItem[item] = "";
    },
    changeIDCardEndDateTime() {
      this.addItem.IDCardEndDateTime = this.$refs.IDCardEndDateTime.value;
    },
    getCheckNumber() {
      let $el = $(this.$el);
      let para = {};
      let userPhone = this.addItem.Phone;
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
      } else if (
        this.addItem.IDCardZImage == "" ||
        this.addItem.IDCardFImage == "" ||
        this.addItem.LicenseImage == ""
      ) {
        showTips("请上传图片");
        return;
      }

      let para = {};
      para = this.addItem;

      fetchData({
        API: "/api/RegMng/RegSupplier",
        para,
        callback: data => {
          this.$router.push({
            path: "applyProgress"
          });
          console.log("ss");
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
    setTimeout(() => {
      this.initImport(); //初始化上传图片
    });
  },
  watch: {}
};
</script>
<style lang="scss" module="css">
.action {
  margin-right: 355px;
  font-size: 16px;
}
.hotline {
  margin-right: 370px;
  text-align: right;
}
.dc3500 {
  color: #dc3500;
}
.lLinetip {
  &:before {
    content: "";
    background: #0071b7;
    border-left: 2px;
    display: inline-block;
    width: 2px;
    height: 15px;
    vertical-align: middle;
    margin-right: 5px;
  }
}
</style>