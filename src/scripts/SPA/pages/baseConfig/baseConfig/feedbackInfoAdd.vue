<template>
  <div class="main" id="app">
    <section class="text-center fixed-footer">
      <button class="btn btn-primary large" @click="onSubmit_Click()" :class="{disabled:isAdd}">保存</button>
      <a href="javascript:history.go(-1)" class="btn btn-default large">取消</a>
    </section>
    <div class="content-field  clearfix">
      <div class="two-column-view">
        <div class="item">
          <div class="clearfix align-btn">
            <span class="crumbs">
              意见反馈 <input type="file" class="import-img hidden" :accept="uploadAcceptImg">
            </span>
          </div>
          <div class="content mt10">
            <div class="set">
              <dl class="item">
                <dt class="title">反馈类型</dt>
                <dd class="content">
                  <select v-model="addItem.SuggestType" class="com-ipt x-large" data-validate="required">
                    <option value="">意见类型 </option>
                    <option value="1">功能异常 </option>
                    <option value="2">平台投诉 </option>
                    <option value="3">体验建议 </option>
                    <option value="4">其他 </option>
                    <option value="5">帐号注册/登录/密码/验证相关</option>
                    <option value="6">交易/支付功能相关</option>
                    <option value="7">APP相关（卡顿/白屏/闪退)</option>
                  </select>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">联系人</dt>
                <dd class="content">
                  <input type="text" class="com-ipt x-large" placeholder="请输入联系人姓名" v-model="addItem.Contacts" maxlength="20" data-validate="required">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">联系电话</dt>
                <dd class="content">
                  <input type="text" class="com-ipt x-large" placeholder="填写电话联系方式" v-model="addItem.Phone" data-validate="required phone">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">意见描述</dt>
                <dd class="content">
                  <textarea name="" id="" cols="100" rows="10" class="com-ipt x-large" placeholder="请描述您的问题(建议您上传截图),并提供您的意见" v-model="addItem.Message" data-validate="required"></textarea>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">图片</dt>
                <dd class="content">
                  <div class="upload-box" @click="clickUpload()" v-show="addItem.Images&&addItem.Images.length<4"></div>
                  <ul class="upload-img-list" style="vertical-align: top">
                    <li class="item" v-for="(item,index) in addItem.Images">
                      <sup class="del" @click="delImage(images,index)"></sup>
                      <a href="javascript:;" @click="imgProp(item)"><img :src="item" alt=""></a>
                    </li>
                  </ul>
                  <p class="text-muted">
                    图片最多上传4张，仅支持jpg、jpeg、gif、png，文件小于10M。
                  </p>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
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
/**
 * 售后服务模板添加
 */
import formDataUpload from "commonScripts/formDataUpload.js";
export default {
  name: "app",
  data() {
    return {
      isAdd: false,
      SectionList: [],
      isShowImgPop: false,
      addItem: {
        SuggestType: "",
        Images: []
      }
    };
  },
  components: {
    formDataUpload
  },
  methods: {
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
    clickUpload() {
      this.$el.querySelector(".import-img").click();
    },
    uploadOk(data) {
      this.addItem.Images.push(data);
    },
    delImage(item, index) {
      this.addItem.Images.splice(index, 1);
    },
    imgProp(item) {
      this.AptitudePic = item;
      this.isShowImgPop = true;
    },
    onCancel_Click() {
      this.isShowImgPop = false;
    },
    onSubmit_Click() {
      if (!zmm_validator(this.$el)) {
        return;
      }
      let para = JSON.parse(JSON.stringify(this.addItem));
      para.Images = para.Images.join(",");
      para.UrlType = 4;
      fetchData({
        //获取栏目列表
        API: "api/Misc/SuggestAdd",
        para,
        callback: data => {
          showTips("您已成功添加反馈信息");
          this.isAdd = true;
        }
      });
    }
  },
  created() {
    setTimeout(() => {
      this.initImport(); //初始化上传图片
    });
  },
  watch: {}
};
</script>