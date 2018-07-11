<template>
  <div id="login-box" v-show="true">
    <section class="s-upload">
      <form class="uploadData" onsubmit="return false;">
        <div>营业执照是否三证合一
          <label class="radio">
            <input type="radio" name="ifszhy" id="" value="1" v-model="editInfo.ThreeInOne">
            <span class="icon"></span>是</label>
          <label class="radio">
            <input type="radio" name="ifszhy" value="0" v-model="editInfo.ThreeInOne" id="">
            <span class="icon"></span>否</label>
        </div>
        <div class="uploadfile-div">
          <p>上传文件
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
                    <sup class="del" @click="delPic(0,'LicenseImage')"></sup>
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
                  <p class="mt10" v-show="editInfo.lientPermanValidity==0">
                    <!-- <input type="text" placeholder="请输入有效时间" v-model="editInfo.LicenseStartDateTime"> -->
                    <input type="text" placeholder="到期时间" name="LicenseEndDateTime" ref="LicenseEndDateTime" id="LicenseEndDateTime" onclick="WdatePicker()" @focus="changeLicenseEndDateTime()" v-model="editInfo.LicenseEndDateTime">
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
                    <sup class="del" @click="delPic(0,'AccountOpeningPermitImage')"></sup>
                    <img :src="editInfo.AccountOpeningPermitImage" alt="">
                  </div>
                </div>
                <p>
                  <input type="text" placeholder="请输入开户许可证核准号" v-model="editInfo.AccountOpeningPermitNum" data-validate="required">
                </p>
              </div>
            </div>
            <div class="upload-info" v-show="editInfo.ThreeInOne==0">
              <p>组织机构代码证</p>
              <div>
                <div class="upload-box" @click="clickUpload('OrganizationImage',1)" v-if="!editInfo.OrganizationImage"></div>
                <div class="upload-img-list" v-else>
                  <div class="item">
                    <sup class="del" @click="delPic(0,'OrganizationImage')"></sup>
                    <img :src="editInfo.OrganizationImage" alt="">
                  </div>
                </div>
                <p>
                  <input type="text" placeholder="请输入组织机构代码" v-model="editInfo.OrganizationNum">
                </p>
                <p class="mt10">
                  <!-- <input type="text" placeholder="请输入有效时间" v-model="editInfo.OrganizationEndDateTime"> -->
                  <input type="text" placeholder="请输入有效时间" ref="OrganizationEndDateTime" onclick="WdatePicker()" @focus="changeOrganizationEndDateTime()" v-model="editInfo.OrganizationEndDateTime">
                </p>
              </div>
            </div>
            <div class="upload-info" v-show="editInfo.ThreeInOne==0">
              <p>税务登记证</p>
              <div>
                <div class="upload-box" @click="clickUpload('TaxImage',1)" v-if="!editInfo.TaxImage"></div>
                <div class="upload-img-list" v-else>
                  <div class="item">
                    <sup class="del" @click="delPic(0,'TaxImage')"></sup>
                    <img :src="editInfo.TaxImage" alt="">
                  </div>
                </div>
                <p>
                  <input type="text" placeholder="请输入税务登记证号" v-model="editInfo.TaxNum">
                </p>
              </div>
            </div>
            <div class="upload-info" :class="editInfo.ThreeInOne==1 ?'twoColumn': ''">
              <p>身份证正面</p>
              <div>
                <div class="upload-box" @click="clickUpload('FarenZImage',1)" v-if="!editInfo.FarenZImage"></div>
                <div class="upload-img-list" v-else>
                  <div class="item">
                    <sup class="del" @click="delPic(0,'FarenZImage')"></sup>
                    <img :src="editInfo.FarenZImage" alt="">
                  </div>
                </div>
                <div>是否永久有效
                  <label class="radio">
                    <input type="radio" name="ifdj" id="" value="1" v-model="editInfo.LegalPersonIsPermanentValidity">
                    <span class="icon"></span>是</label>
                  <label class="radio">
                    <input type="radio" name="ifdj" id="" value="0" v-model="editInfo.LegalPersonIsPermanentValidity">
                    <span class="icon"></span>否</label>
                  <p class="mt10" v-show="editInfo.LegalPersonIsPermanentValidity==0">
                    <!-- <input type="text" placeholder="请输入有效时间"> -->
                    <input type="text" placeholder="请输入有效时间" ref="LegalPersonEndDateTime" onclick="WdatePicker()" @focus="changeLegalPersonEndDateTime()" v-model="editInfo.LegalPersonEndDateTime">
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
                    <sup class="del" @click="delPic(0,'FarenFImage')"></sup>
                    <img :src="editInfo.FarenFImage" alt="">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="jyScope-div">
          <p>经营范围</p>
          <textarea name="" id="" cols="30" rows="3" placeholder="请输入经营范围" v-model="editInfo.ScopeOfOperation" data-validate="required"></textarea>
        </div>
        <div class="bCatagray-div">
          <p>品牌分类
            <button @click="add(CategoryBrandArray)">新增分类</button>
            <input type="file" class="import-img hidden" :accept="uploadAcceptImg">
          </p>
          <table class="table table-bordered-all datalist">
            <thead>
              <tr>
                <!-- <th >序号</th> -->
                <th style="width:160px;">分类</th>
                <th style="width:260px;">品牌</th>
                <th>是否有授权资质</th>
                <th style="width:180px;">到期时间</th>
                <th style="width:180px;">授权区域</th>
                <th style="width:80px;">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(itemlist,itemIndex) in CategoryBrandArray">
                <tr v-for="(brandlist,brandIndex) in itemlist.BrandList">
                  <td class="text-nowrap" :rowspan="itemlist.BrandList.length" v-if="brandIndex===0">
                    <select v-model="itemlist.CategoryId">
                      <option value="" selected>选择分类</option>
                      <option :value="item.Code" v-for="item in arrcatagary">
                        {{item.Name}}
                      </option>
                    </select>
                  </td>
                  <td>
                    <select v-model="brandlist.BrandId">
                      <option value="" selected>选择品牌</option>
                      <option :value="item.Id" v-for="item in arrBrand">
                        {{item.BrandName}}
                      </option>
                    </select>
                    <span @click="add(itemlist)">
                      <i class="iconfont icon-tianjia"></i>
                    </span>
                    <span @click="del(itemlist,brandIndex)">
                      <i class="iconfont icon-shanchu"></i>
                    </span>
                  </td>
                  <td class="text-nowrap">
                    <select v-model="brandlist.IsAuth" class="com-ipt x-small">
                      <option value="1">是</option>
                      <option value="0">否</option>
                    </select>
                    <div style="display:inline-block" v-show="brandlist.IsAuth==1">
                      <div class="upload-box" @click="clickUpload(brandlist,0)" v-if="!brandlist.AptitudePic"></div>
                      <div class="upload-img-list" v-else>
                        <div class="item">
                          <sup class="del" @click="delPic(1,brandlist)"></sup>
                          <img :src="brandlist.AptitudePic" alt="" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="text-nowrap">
                    <span class="date-field ml5">
                      <input type="text" placeholder="到期时间" onclick="WdatePicker()" ref="ExpiryTime" @focus="changeExpiryTime($event,brandlist)" v-model="brandlist.ExpiryTime">
                      <i class="fa fa-calendar icon"></i>
                    </span>
                  </td>
                  <td class="text-nowrap area">
                    <div style="margin-right: 10px;" class="areaDiv" v-for="(arealist,areaIndex) in brandlist.AreaList">
                      <select style="flex:1" class="mr10" v-model="arealist.AreaCode1" @change="getAreaList(1,arealist)">
                        <option value="">省</option>
                        <option :value="item.AreaCode" v-for="item in objAreas.arrList1">{{item.AreaName}}</option>
                      </select>
                      <select style="flex:1" class="mr10" v-model="arealist.AreaCode2" @change="getAreaList(2,arealist)">
                        <option value="">市</option>
                        <option :value="item.AreaCode" v-for="item in arealist.arrList2">{{item.AreaName}}</option>
                      </select>
                      <span @click="add(brandlist)">
                        <i class="iconfont icon-tianjia"></i>
                      </span>
                      <span @click="del(brandlist,areaIndex)">
                        <i class="iconfont icon-shanchu"></i>
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="action-field">
                      <a href="javascript:;" class="item" @click="del(itemlist,itemIndex)">删除</a>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <button class="btn btn-primary  mt20 x-large" type="submit" @click="uploadData_Click($event)">
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
import areaBox from "vues/components/areaBox.vue";
export default {
  data() {
    return {
      arrcatagary: [],
      arrBrand: [],
      arrArea: [],
      proileStatus: "3",
      CategoryBrandArray: [{
        CategoryId: "",
        BrandList: [{
          BrandId: "",
          IsAuth: "1",
          AptitudePic: "",
          ExpiryTime: "",
          AreaList: [{
            AreaCode0: 0,
            AreaCode1: "",
            AreaCode2: "",
            arrList1: [],
            arrList2: []
          }]
        }]
      }],
      uploadAcceptImg: ".jpg,.jpeg,.gif,.png",
      step: null,
      routerParams: "",
      editInfo: {
        UserSN: "",
        LicenseImage: "",
        AccountOpeningPermitImage: "",
        OrganizationImage: "",
        FarenZImage: "",
        FarenFImage: "",
        TaxImage: "",
        ThreeInOne: "0",
        LicenseNum: "",
        lientPermanValidity: "1",
        LicenseEndDateTime: "",
        LegalPersonIsPermanentValidity: "1",
        LegalPersonEndDateTime: "",
        AccountOpeningPermitNum: "",
        TaxNum: "",
        OrganizationNum: "",
        OrganizationEndDateTime: "",
        ScopeOfOperation: ""
      },
      curImgStr: "",
      curItem: [{
        AreaCode0: 0
      }],
      objAreas: {
        code0: 0,
        code1: "",
        code2: "",
        arrList1: [],
        arrList2: []
      }
    };
  },
  components: { formDataUpload, areaBox },
  methods: {
    getParams() {
      // 取到路由带过来的参数
      this.editInfo.UserSN = this.$route.query.UserSN;
      this.UserType = this.$route.query.UserType;
      //  if(this.editInfo.UserSN) {
      // } else {
      //   this.$router.push({
      //     path: "1"
      //   });
      // }
    },
    initPage() {
      if (this.UserType) {
        fetchData({
          API: "api/UserMng/JoinByEnterpriseViewAuthStatus",
          hideOkTips: true,
          para: {
            userSn: this.editInfo.UserSN,
            userType: this.UserType
          },
          callback: data => {
            data.CategoryBrandArray.forEach(el => {
              el.CategoryId = el.Code;
              el.BrandList.forEach(brand => {
                brand.AreaList.forEach(e => {
                  e.arrList2 = [];
                  this.getAreaList(1, e);
                });
              });
            });
            this.CategoryBrandArray = data.CategoryBrandArray;
            this.editInfo = data;
            this.editInfo.FarenZImage = data.IdCard1;
            this.editInfo.FarenFImage = data.IdCard2;
            //  this.addItem.CompanyShopAddressIsSame = data.IsSameAddress;
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
    add(index) {
      //1分类 2品牌
      var objTemp = {
        CategoryId: "",
        BrandList: [{
          BrandId: "",
          IsAuth: "1",
          AptitudePic: "",
          ExpiryTime: "",
          AreaList: [{
            AreaCode0: 0,
            AreaCode1: "",
            AreaCode1: "",
            arrList1: [],
            arrList2: []
          }]
        }]
      };
      if (index && index.CategoryId) {
        objTemp.catagaryId = index.catagaryId;
        index.BrandList = index.BrandList.concat(objTemp.BrandList);
      } else if (index && index.BrandId) {
        objTemp.BrandList.BrandId = index.BrandId;
        index.AreaList = index.AreaList.concat(objTemp.BrandList[0].AreaList);
      } else {
        this.CategoryBrandArray.push(objTemp);
      }
    },
    del(item, index) {
      //  console.log(e.target.parent)
      if (item && item.CategoryId) {
        item.BrandList.splice(index, 1);
      } else if (item && item.BrandId) {
        item.AreaList.splice(index, 1);
      } else {
        this.CategoryBrandArray.splice(index, 1);
      }
    },
    changeExpiryTime(e, item) {
      item.ExpiryTime = e.target.value;
    },
    changeLicenseEndDateTime() {
      this.editInfo.LicenseEndDateTime = this.$refs.LicenseEndDateTime.value;
    },
    changeOrganizationEndDateTime() {
      this.editInfo.OrganizationEndDateTime = this.$refs.OrganizationEndDateTime.value;
    },
    changeLegalPersonEndDateTime() {
      this.editInfo.LegalPersonEndDateTime = this.$refs.LegalPersonEndDateTime.value;
    },
    getAreaList(order, curItem) {
      let pCode = "";
      if (curItem) {
        pCode = curItem["AreaCode" + order];
      } else {
        pCode = 0;
      }

      fetchData({
        API: "/api/Misc/GetAreaInfo",
        para: {
          pCode
        },
        callback: data => {
          if (order == 0) {
            this.objAreas["arrList" + (order + 1)] = data;
          } else {
            curItem["arrList" + (order + 1)] = data;
          }
        }
      });
    },
    clickUpload(item, type) {
      this.$el.querySelector(".import-img").click();
      this.curImgStr = item;
    },
    uploadOk(data) {
      if (this.curImgStr.AptitudePic || this.curImgStr.AptitudePic == "") {
        this.curImgStr.AptitudePic = data;
      } else {
        this.editInfo[this.curImgStr] = data;
      }
    },
    delPic(index, item) {
      if (index == 1) {
        item.AptitudePic = "";
      } else {
        this.editInfo[item] = "";
      }
    },
    uploadData_Click() {
      if (!zmm_validator(this.$el)) {
        return;
      }
      let para = JSON.parse(JSON.stringify(this.editInfo));
      para.LicenseIsPermanentValidity = this.editInfo.lientPermanValidity;
      para.CategoryBrandArray = this.CategoryBrandArray;
      para.CategoryBrandArray.forEach(el => {
        el.BrandList.forEach(e => {
          e.AreaList.forEach(area => {
            this.$delete(area, "arrList1");
            this.$delete(area, "arrList2");
            this.$delete(area, "arrList3");
          });
        });
      });
      para.ProileStatus = this.proileStatus;
      fetchData({
        API: "api/UserMng/SupplierQualificationsUpdate",
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
    },
    getcatagaryList() {
      //获取分类列表
      fetchData({
        API: "api/Goods/GetCategoryByPCodeNoLogin",
        callback: data => {
          this.arrcatagary = data;
        }
      });
    },
    getBrandList() {
      //获取品牌列表
      fetchData({
        API: "api/Goods/GetBrandListBySelectControl ",
        callback: data => {
          this.arrBrand = data;
        }
      });
    },
    onCancel_Click() {}
  },

  created() {
    this.getParams();
    this.getAreaList(0);
    this.initPage();
    this.getBrandList();
    this.getcatagaryList();
    setTimeout(() => {
      this.initImport(); //初始化上传图片
    });
  }
};
</script>