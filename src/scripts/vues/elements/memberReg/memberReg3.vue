<template>
  <div id="login-box" v-show="true">
    <section class="s-upload member-reg">
      <form class="uploadData" onsubmit="return false;">
        <div class="set w10em">
          <dl class="item">
            <dt class="title">营业执照是否三证合一</dt>
            <dd class="content">
              <label class="radio">
                {{editInfo.ThreeInOne}}
                <input type="radio" name="ifszhy" id="" value="1" v-model="editInfo.ThreeInOne">
                <span class="icon"></span>是</label>
              <label class="radio">
                <input type="radio" name="ifszhy" value="0" v-model="editInfo.ThreeInOne" id="">
                <span class="icon"></span>否</label>
            </dd>
          </dl>
          <dl class="item">
            <dt class="title">是否交过定金</dt>
            <dd class="content">
              <label class="radio">
                <input type="radio" name="IsPayDeposit" id="" value="1" v-model="editInfo.IsPayDeposit">
                <span class="icon"></span>是</label>
              <label class="radio">
                <input type="radio" name="IsPayDeposit" value="0" id="" v-model="editInfo.IsPayDeposit">
                <span class="icon"></span>否</label>
            </dd>
          </dl>
        </div>
        <div class="uploadfile-div">
          <p>上传文件
            <input type="file" class="import-img hidden" :accept="uploadAcceptImg">
            <span class="tooltips-i tooltips-tr">
              <a class="icon icon-tips" href="javascript:;">!</a>
              <span class="txt" style="width:500px;">
                注意：<br/> 1、填写的公司信息与上传的公司证件信息必须一致（例如：公司名称、地址、法人姓名、法人身份证等）。

                <br/> 2、上传的证件有效期不能少于3个月。

                <br/> 3、上传的证件必须要是彩色扫描件或照片，不能是复印件，不能有遮挡，文字内容必须清晰可见，在适当放大后仍能清晰辨识。

                <br/> 4、身份证正反面的朝向为横向（营业执照／3证合一为竖项），图像端正，不歪斜，不竖立。

                <br/> 5、底色为白色，能清晰辨识证件边界。有效区域在整个图片中占比要合适，不允许出现无效部分占比过大的情况，图片大小要小于1M，jpg格式。

                <br/> 6、企业法人\个体户经营者,身份证只能使用大陆身份证，不能使用港澳台身份证。

                <br/>
              </span>
            </span>
          </p>
          <div class="upload-content">
            <div class="upload-info" :class="editInfo.ThreeInOne==1 ?'twoColumn': ''">
              <p>营业执照</p>
              <div>
                <div class="upload-box" @click="clickUpload('LicenseImage',1)" v-if="!editInfo.LicenseImage"></div>
                <div class="upload-img-list" v-else>
                  <div class="item">
                    <sup class="del" @click="delPic('LicenseImage')"></sup>
                    <img :src="editInfo.LicenseImage" alt="">
                  </div>
                </div>
                <p>
                  <input type="text" placeholder="请输入营业执照号" v-model="editInfo.LicenseNum" data-validate="required">
                </p>
                <div>是否永久有效
                  <label class="radio">
                    <input type="radio" name="ifzzyjyx" id="" value="1" v-model="editInfo.lientPermanValidity">
                    <span class="icon"></span>是</label>
                  <label class="radio">
                    <input type="radio" name="ifzzyjyx" id="" value="0" v-model="editInfo.lientPermanValidity">
                    <span class="icon"></span>否</label>
                  <p class="mt15" v-if="editInfo.lientPermanValidity!=1">
                    <!-- <input type="text" placeholder="请输入有效时间" v-model="editInfo.LicenseStartDateTime"> -->
                    <input type="text" placeholder="到期时间" name="LicenseEndDateTime" id="LicenseEndDateTime" onclick="WdatePicker()" ref="LicenseEndDateTime" @focus="LicenseEndDateTime()" v-model="editInfo.LicenseEndDateTime">
                  </p>
                </div>
              </div>
            </div>
            <div class="upload-info" :class="editInfo.ThreeInOne==1 ?'twoColumn': ''">
              <p>开户许可证</p>
              <div>
                <div class="upload-box" @click="clickUpload('AccountOpeningPermitImage',1)" v-if="!editInfo.AccountOpeningPermitImage"></div>
                <div class="upload-img-list" v-else>
                  <div class="item">
                    <sup class="del" @click="delPic('AccountOpeningPermitImage')"></sup>
                    <img :src="editInfo.AccountOpeningPermitImage" alt="">
                  </div>
                </div>
                <p>
                  <input type="text" placeholder="请输入开户许可证核准号" v-model="editInfo.AccountOpeningPermitNum" data-validate="required">
                </p>
              </div>
            </div>
            <div class="upload-info" :class="editInfo.ThreeInOne==1 ?'twoColumn': ''">
              <p>身份证正面</p>
              <div>
                <div class="upload-box" @click="clickUpload('FarenZImage',1)" v-if="!editInfo.FarenZImage"></div>
                <div class="upload-img-list" v-else>
                  <div class="item">
                    <sup class="del" @click="delPic('FarenZImage')"></sup>
                    <img :src="editInfo.FarenZImage" alt="">
                  </div>
                </div>
                <div>是否永久有效
                  <label class="radio">
                    <input type="radio" name="ifdj" id="" value="0" v-model="editInfo.LegalPersonIsPermanentValidity">
                    <span class="icon"></span>否</label>
                  <label class="radio">
                    <input type="radio" name="ifdj" id="" value="1" v-model="editInfo.LegalPersonIsPermanentValidity">
                    <span class="icon"></span>是</label>
                  <p class="mt10" v-if="editInfo.LegalPersonIsPermanentValidity==0">
                    <input type="text" placeholder="请输入有效时间" name="LegalPersonEndDateTime" id="LegalPersonEndDateTime" onclick="WdatePicker()" ref="LegalPersonEndDateTime" @focus="LegalPersonEndDateTime()" v-model="editInfo.LegalPersonEndDateTime">
                  </p>
                </div>
              </div>
            </div>
            <div class="upload-info" :class="editInfo.ThreeInOne==1 ?'twoColumn': ''">
              <p>身份证背面</p>
              <div>
                <div class="upload-box" @click="clickUpload('FarenFImage',1)" v-if="!editInfo.FarenFImage"></div>
                <div class="upload-img-list" v-else>
                  <div class="item">
                    <sup class="del" @click="delPic('FarenFImage')"></sup>
                    <img :src="editInfo.FarenFImage" alt="">
                  </div>
                </div>
              </div>
            </div>
            <div class="upload-info" v-show="editInfo.ThreeInOne==0">
              <p>组织机构代码证</p>
              <div>
                <div class="upload-box" @click="clickUpload('OrganizationImage',1)" v-if="!editInfo.OrganizationImage"></div>
                <div class="upload-img-list" v-else>
                  <div class="item">
                    <sup class="del" @click="delPic('OrganizationImage')"></sup>
                    <img :src="editInfo.OrganizationImage" alt="">
                  </div>
                </div>
                <p>
                  <input type="text" placeholder="请输入组织机构代码" v-model="editInfo.OrganizationNum">
                </p>
                <p class="mt15">
                  <input type="text" placeholder="请输入有效时间" name="OrganizationEndDateTime" id="OrganizationEndDateTime" onclick="WdatePicker()" ref="OrganizationEndDateTime" @focus="OrganizationEndDateTime()" v-model="editInfo.OrganizationEndDateTime">
                </p>
              </div>
            </div>
            <div class="upload-info" v-show="editInfo.ThreeInOne==0">
              <p>税务登记证</p>
              <div>
                <div class="upload-box" @click="clickUpload('TaxImage',1)" v-if="!editInfo.TaxImage"></div>
                <div class="upload-img-list" v-else>
                  <div class="item">
                    <sup class="del" @click="delPic('TaxImage')"></sup>
                    <img :src="editInfo.TaxImage" alt="">
                  </div>
                </div>
                <p>
                  <input type="text" placeholder="请输入税务登记证号" v-model="editInfo.TaxNum">
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="jyScope-div">
          <p class="mb10">经营范围</p>
          <textarea name="" id="" cols="30" rows="3" placeholder="请输入经营范围" v-model="editInfo.ScopeOfOperation" data-validate="required"></textarea>
        </div>
        <button class="btn btn-primary big mt20 x-large" type="submit" @click="uploadData_Click($event)">
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
      arrcatagary: [],
      arrBrand: [],
      UserSN: "",
      uploadAcceptImg: ".jpg,.jpeg,.gif,.png",
      step: null,
      routerParams: "",
      editInfo: {
        ThreeInOne: "0",
        IsPayDeposit: "0",
        LicenseImage: "",
        AccountOpeningPermitImage: "",
        FarenZImage: "",
        FarenFImage: "",
        OrganizationImage: "",
        TaxImage: "",
        LegalPersonIsPermanentValidity: "1",
        lientPermanValidity: "1"
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
      if (this.UserSN) {
      } else {
        this.$router.push({
          path: "1"
        });
      }
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
            this.editInfo.FarenZImage = data.IdCard1;
            this.editInfo.FarenFImage = data.IdCard2;
            //this.addItem.CompanyShopAddressIsSame=data.IsSameAddress;
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
    LicenseEndDateTime() {
      this.editInfo.LicenseEndDateTime = this.$refs.LicenseEndDateTime.value;
    },
    LegalPersonEndDateTime() {
      this.editInfo.LegalPersonEndDateTime = this.$refs.LegalPersonEndDateTime.value;
    },
    OrganizationEndDateTime() {
      this.editInfo.OrganizationEndDateTime = this.$refs.OrganizationEndDateTime.value;
    },
    delPic(item) {
      this.editInfo[item] = "";
    },
    uploadData_Click(e) {
      if (!zmm_validator(this.$el)) {
        return;
      }
      let para = JSON.parse(JSON.stringify(this.editInfo));
      para.LicenseIsPermanentValidity = this.editInfo.lientPermanValidity;
      para.UserSN = this.UserSN;
      fetchData({
        API: "api/UserMng/RetailerQualificationsUpdate",
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