<template>
  <div class="main" id="app">
    <div class="content-field  clearfix addAgent">
      <div class="data-content">
        <div class="clearfix align-btn">
          <span class="crumbs">
            <a href="javascript:;" @click="onCancel_Click()"> 加盟代理</a> > 添加代理
            <input type="file" class="import-img hidden" :accept="uploadAcceptImg">
          </span>
        </div>
        <div class="two-column-view">
          <div class="item">
            <h2 class="title">基本信息</h2>
            <div class="content">
              <div class="set two-line">
                <dl class="item">
                  <dt class="title">
                    所属企业
                  </dt>
                  <dd class="content">
                    <input type="text" placeholder="输入所属企业" data-validate="required" class="com-ipt large" v-model="addItem.CompanyName" >
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    企业品牌
                  </dt>
                  <dd class="content">
                    <input type="text" placeholder="输入企业品牌" data-validate="required" class="com-ipt large" v-model="addItem.CompanyBrand" >
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    主营产品
                  </dt>
                  <dd class="content">
                    <input type="text" placeholder="输入主营产品" data-validate="required" class="com-ipt large" v-model="addItem.CompanyProduct">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    企业法人
                  </dt>
                  <dd class="content">
                    <input type="text" placeholder="输入企业法人" data-validate="required" class="com-ipt large" v-model="addItem.Corporation">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    注册资金
                  </dt>
                  <dd class="content">
                    <input type="text" placeholder="输入注册资金"  class="com-ipt large" v-model="addItem.RegisteredCapital" data-validate="required money">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    成立时间
                  </dt>
                  <dd class="content">
                    <input type="text" class="com-ipt large" placeholder="成立时间" onclick="WdatePicker()" ref="CreateTime" @focus="changeTime()" v-model="addItem.CreateTime">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    联系人
                  </dt>
                  <dd class="content">
                    <input type="text" placeholder="输入联系人" data-validate="required" class="com-ipt large" v-model="addItem.Contacts">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    电子邮箱
                  </dt>
                  <dd class="content">
                    <input type="text" placeholder="输入电子邮箱"  class="com-ipt large" v-model="addItem.Email" data-validate="required email">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    联系电话
                  </dt>
                  <dd class="content">
                    <input type="text" placeholder="输入联系电话"  class="com-ipt large" v-model="addItem.Phone" data-validate="required phone">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    推荐指数
                  </dt>
                  <dd class="content">
                    <input type="text" placeholder="输入推荐指数"  class="com-ipt large" v-model="addItem.RecommendValue" data-validate="required">
                  </dd>
                </dl>
              </div>
              <div class="set">
                <dl class="item">
                  <dt class="title">
                    企业地址
                  </dt>
                  <dd class="content">
                    <area-box :area-codes="addItem.AreaCode1+','+addItem.AreaCode2+','+addItem.AreaCode3+','+addItem.AreaCode4" :area-code.sync="addItem.AreaCode"></area-box>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    详细地址
                  </dt>
                  <dd class="content">
                    <input type="text" placeholder="输入详细地址" data-validate="required" class="com-ipt  xxx-large" v-model="addItem.Address">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">图片</dt>
                  <dd class="content">
                    <div class="upload-box" @click="clickUpload('Logo')" v-if="!addItem.Logo"></div>
                    <ul class="upload-img-list" v-else>
                      <li class="item">
                        <sup class="del" @click="delImage('Logo',index)"></sup>
                        <img :src="addItem.Logo" alt="">
                      </li>
                    </ul>
                    <p class="text-muted">
                      图片宽高为122 X 42像素，仅支持jpg、jpeg、gif、png，文件小于10M。
                    </p>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="item">
            <h2 class="title">招商信息</h2>
            <div class="content">
              <div class="set two-line">
                <dl class="item">
                  <dt class="title">
                    投资金额
                  </dt>
                  <dd class="content">
                    <input type="text" placeholder="输入名称" data-validate="required" class="com-ipt large" v-model="addItem.AmountOfInvestment">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    代理总数
                  </dt>
                  <dd class="content">
                    <input type="text" placeholder="输入名称" data-validate="required" class="com-ipt large" v-model="addItem.AgentNum">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    门店总数
                  </dt>
                  <dd class="content">
                    <input type="text" placeholder="输入名称" data-validate="required" class="com-ipt large" v-model="addItem.StroeNum">
                  </dd>
                </dl>
                
              </div>
              <div class="set">
                <dl class="item">
                  <dt class="title">
                    招商区域
                  </dt>
                  <dd class="content">
                    <a href="javascript:;" @click="addArea()">新增招商区域</a>

                    <div class="content mt10">
                      <span class="tag" v-for="(item,index) in addItem.InvestmentAreaList">
                        {{item.AreaMergerName}}
                        <i class="tag-del" @click="delAttr($event,index)">&times;</i>
                      </span>

                    </div>
                  </dd>

                </dl>
                <dl class="item">
                  <dt class="title">
                    品牌介绍
                  </dt>
                  <dd class="content">
                    <textarea name="" id="" rows="4" v-model="addItem.BrandDesc"></textarea>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    企业介绍
                  </dt>
                  <dd class="content">
                    <textarea name="" id="" rows="4" v-model="addItem.CompanyDesc"></textarea>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    加盟政策条件
                  </dt>
                  <dd class="content">
                    <textarea name="" id="" rows="4" v-model="addItem.PolicyOfJoining"></textarea>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    加盟支持保护
                  </dt>
                  <dd class="content">
                    <textarea name="" id="" rows="4" v-model="addItem.SupportProtection"></textarea>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">荣誉证书</dt>
                  <dd class="content">
                    <div class="upload-box" @click="clickUpload('CertificateOfHonor')"></div>
                    <ul class="upload-img-list">
                      <li class="item" v-for="(item,index) in addItem.CertificateOfHonor">
                        <sup class="del" @click="delImage('CertificateOfHonor',index)"></sup>
                        <img :src="item" alt="">
                      </li>
                    </ul>
                    <p class="text-muted">
                      图片宽高为122 X 42像素，仅支持jpg、jpeg、gif、png，文件小于10M。
                    </p>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">专卖店形象图</dt>
                  <dd class="content">
                    <div class="upload-box" @click="clickUpload('StoreImages')"></div>
                    <ul class="upload-img-list">
                      <li class="item" v-for="(item,index) in addItem.StoreImages">
                        <sup class="del" @click="delImage('StoreImages',index)"></sup>
                        <img :src="item" alt="">
                      </li>
                    </ul>
                    <p class="text-muted">
                      图片宽高为122 X 42像素，仅支持jpg、jpeg、gif、png，文件小于10M。
                    </p>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="item">
            <h2 class="title">发布状态</h2>
            <div class="content">
              <div class="set">
                <dl class="item">
                  <dt class="title">
                    状态
                  </dt>
                  <dd class="content">
                   <div class="inline-radio">
                      <label class="radio"><input type="radio" name="matchStatus" value="2" v-model="addItem.Status">
                        <span class="icon"></span>启用</label>
                      <label class="radio"><input type="radio" name="matchStatus" value="3" v-model="addItem.Status">
                        <span class="icon"></span>禁用</label>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center">
          <div class="btn btn-primary large" @click="saveAgent($event)">保存</div>
          <div class="btn  large"  @click="onCancel_Click()">取消</div>
        </div>
      </div>
    </div>
    <area-show :show.sync="isShowAreaShow" :cur-item="objCurAreaItem" @save="saveArea"></area-show>
  </div>
</template>
<script>
/**
 *
 */
import formDataUpload from "commonScripts/formDataUpload.js";
import areaBox from "vues/components/areaBox.vue";
import areaShow from "vues/popup/carriageTempAddArea.vue";
export default {
  name: "app",
  data() {
    return {
      isShowAreaShow: false,
      objCurAreaItem: {}, //编辑当前区域对象
      uploadAcceptImg: ".jpg,.jpeg,.gif,.png",
      addItem: {
        Logo: "",
        CertificateOfHonor: [],
        StoreImages: [],
        InvestmentAreaList: [],
        AreaCodes: []
      }
    };
  },
  components: {
    formDataUpload,
    areaBox,
    areaShow
  },
  methods: {
    initPageData() {
      let agentId = this.$route.query.id;
      if (agentId) {
        fetchData({
          //获取加盟代理信息
          API: "api/Misc/GetAgentInfo",
          para: {
            Id: agentId
          },
          callback: data => {
            data.CertificateOfHonor = data.CertificateOfHonor.length
              ? data.CertificateOfHonor.split(",")
              : []; //组装图片数据结构
            data.StoreImages = data.StoreImages.length
              ? data.StoreImages.split(",")
              : [];
            this.addItem = data;
            console.log(data);
          }
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
    },
    uploadOk(data) {
      if (this.curImgStr == "Logo") {
        this.addItem[this.curImgStr] = data;
      } else {
        this.addItem[this.curImgStr].push(data);
      }
    },
    delImage(item, index) {
      if (item == "Logo") {
        this.addItem[item] = "";
      } else {
        this.addItem[item].splice(index, 1);
      }
    },
    changeTime() {
      this.addItem.CreateTime = this.$refs.CreateTime.value;
    },
    delAttr(e, index) {
      var bcontent = $(e.target)
        .parent()
        .remove();
      this.addItem.InvestmentAreaList.splice(index, 1);
    },
    onSubmit_Click() {
      if (!zmm_validator(this.$el)) {
        return;
      }
      let para = JSON.parse(JSON.stringify(this.addItem));
      para.UrlType = 4;
      fetchData({
        //获取栏目列表
        API: "api/Misc/ArticleEdit",
        para,
        callback: data => {
          this.$router.push("topList");
        }
      });
    },
    saveAgent() {
      if (!zmm_validator(this.$el)) {
        return;
      }
      this.addItem.AreaCodes = [];
      this.addItem.InvestmentAreaList.map(el => {
        this.addItem.AreaCodes = this.addItem.AreaCodes.concat(el.AreaCode);
      });
      let para = JSON.parse(JSON.stringify(this.addItem));
      para.CertificateOfHonor = para.CertificateOfHonor.join(",");
      para.StoreImages = para.StoreImages.join(",");
      console.log(para);
      fetchData({
        API: "api/Misc/AgentEdit",
        para,
        callback: data => {
              this.$router.push("agentList");
        }
      });
    },
    addArea() {
      this.objCurAreaItem = {};
      this.isShowAreaShow = true;
    },
    saveArea(data) {
      //选择区域回传调用
      this.addItem.AreaCodes = [];
      data.forEach(el => {
        let arrTemp = [];
        el.arrAreaCode.forEach((area, index) => {
          let objT = {};
          objT.AreaCode = area;
          objT.AreaMergerName = el.arrAreaName[index];
          arrTemp.push(objT);
        });
        this.addItem.InvestmentAreaList = this.addItem.InvestmentAreaList.concat(
          arrTemp
        );
      });
      //this.$set(this.addItem, "InvestmentAreaList", mm);
    },
    onCancel_Click() {
      this.$router.push("agentList");
    }
  },
  created() {
    this.initPageData();
    setTimeout(() => {
      this.initImport(); //初始化上传图片
    });
  },
  filters: {
    arrayToStr: function(value) {
      console.log(value);
      //  return value.toString();
    }
  },
  watch: {}
};
</script>