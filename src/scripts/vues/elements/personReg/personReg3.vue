<template>
  <div id="login-box" v-show="true">
    <section class="s-upload member-reg">
      <form class="uploadData" onsubmit="return false;">
        <div class="set w10em">
          <dl class="item">
            <dt class="title">是否交过定金</dt>
            <dd class="content">
              <label class="radio">
                <input type="radio" name="EarnestMoneyPaid" id="" value="1" v-model="editInfo.EarnestMoneyPaid" data-validate="required">
                <span class="icon"></span>是</label>
              <label class="radio">
                <input type="radio" name="EarnestMoneyPaid" value="0" id="" v-model="editInfo.EarnestMoneyPaid" data-validate="required">
                <span class="icon"></span>否</label>
            </dd>
          </dl>
        </div>
        <div class="uploadfile-div">
          <p>上传文件
            <input type="file" class="import-img hidden" :accept="uploadAcceptImg">
          </p>
          <div class="upload-content">
            <div class="upload-info">
              <p>身份证正面</p>
              <div>
                <div class="upload-box" @click="clickUpload('IdCard1',1)" v-if="!editInfo.IdCard1"></div>
                <div class="upload-img-list" v-else>
                  <div class="item">
                    <sup class="del" @click="delPic('IdCard1')"></sup>
                    <img :src="editInfo.IdCard1" alt="">
                  </div>
                </div>
                <div>是否永久有效
                  <label class="radio ml10">
                    <input type="radio" name="ifdj" id="" value="0" v-model="editInfo.LegalPersonIsPermanentValidity" data-validate="required">
                    <span class="icon"></span>否</label>
                  <label class="radio">
                    <input type="radio" name="ifdj" id="" value="1" v-model="editInfo.LegalPersonIsPermanentValidity" data-validate="required">
                    <span class="icon"></span>是</label>
                  <p class="mt10" v-if="editInfo.LegalPersonIsPermanentValidity==0">
                    <input type="text" placeholder="请输入有效时间" name="IdCardValidityPeriod" id="IdCardValidityPeriod" onclick="WdatePicker()" ref="IdCardValidityPeriod" @focus="IdCardValidityPeriod()" v-model="editInfo.IdCardValidityPeriod" data-validate="required">
                  </p>
                </div>
              </div>
            </div>
            <div class="upload-info">
              <p>身份证背面</p>
              <div>
                <div class="upload-box" @click="clickUpload('IdCard2',1)" v-if="!editInfo.IdCard2"></div>
                <div class="upload-img-list" v-else>
                  <div class="item">
                    <sup class="del" @click="delPic('IdCard2')"></sup>
                    <img :src="editInfo.IdCard2" alt="">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-primary x-large mt20" type="submit" @click="uploadData_Click($event)">
          下一步
        </button>
      </form>
    </section>
  </div>
</template>
<script>
/**
 * 基础设置-分类管理
 */
import formDataUpload from "commonScripts/formDataUpload.js";
export default {
  data() {
    return {
      UserSN: "",
      AuthCode: "",
      uploadAcceptImg: ".jpg,.jpeg,.gif,.png",
      step: null,
      routerParams: "",
      editInfo: {
        EarnestMoneyPaid: "0",
        LegalPersonIsPermanentValidity: "1",
        IdCard1: "",
        IdCard2: ""
      },
      curImgStr: ""
    };
  },
  components: { formDataUpload },
  methods: {
    getParams() {
      // 取到路由带过来的参数
      this.UserSN = this.$route.query.UserSN;
      this.UserType = this.$route.query.UserType;
    },
    initPage() {
      if (this.UserType) {
        fetchData({
          API: "api/UserMng/JoinByEnterpriseViewAuthStatus",
          hideOkTips: true,
          para: {
            userSn: this.UserSN,
            userType: this.UserType
          },
          callback: data => {
            this.editInfo = data;
            this.editInfo.EarnestMoneyPaid = data.IsPrePaid;
          },
          errorCallback() {}
        });
      }
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
      if (type == 1) {
        this.curImgStr = item;
      } else {
        this.curImgStr = item;
      }
    },
    uploadOk(data) {
      if (this.curImgStr == "") {
        this.curImgStr = data;
      } else {
        this.editInfo[this.curImgStr] = data;
      }
    },
    IdCardValidityPeriod() {
      this.editInfo.IdCardValidityPeriod = this.$refs.IdCardValidityPeriod.value;
    },
    delPic(item) {
      this.editInfo[item] = "";
    },
    uploadData_Click() {
      if (!zmm_validator(this.$el)) {
        return;
      }
      let para = JSON.parse(JSON.stringify(this.editInfo));
      para.UserSN = this.UserSN;
      para.AuthCode = this.AuthCode;
      fetchData({
        API: "api/UserMng/JoinByPersonal_Step3",
        para,
        callback: data => {
          this.$router.push({
            path: "4",
            params: {
              name: "name",
              dataObj: "测试"
            }
          });
        }
      });
    }
  },
  created() {
    this.getParams();
    this.initPage();
    setTimeout(() => {
      this.initImport(); //初始化上传图片
    });
  }
};
</script>