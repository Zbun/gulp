<template>
  <div class="main" id="app">
    <div class="content-field  clearfix topAddList">
      <div class="clearfix align-btn">
        <span class="crumbs">
          <a href="javascript:;" @click=""> 慧头条</a> > 栏目管理
        </span>
      </div>
      <div class="addInput">
        <dl class="item">
          <dt>标题</dt>
          <dd><input type="text" class="l-input" v-model="addItem.Title" data-validate="required"></dd>
        </dl>
        <dl class="item">
          <dt>栏目</dt>
          <dd>
            <select v-model="addItem.SectionId" data-validate="required">
              <option value="" disabled selected>选择栏目</option>
              <option :value="item.Id" v-for="item in SectionList">
                {{item.SectionTitle}}
              </option>
            </select>
          </dd>
        </dl>
        <dl class="item">
          <dt>作者</dt>
          <dd><input type="text" class="s-input" v-model="addItem.Author" data-validate="required"></dd>
        </dl>
        <dl class="item">
          <dt>发布时间</dt>
          <dd>
            <!-- <input type="text" class="s-input" v-model="addItem.DateAdded"> -->
            <input type="text"  class="s-input" ref="input1"  onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" @focus="changeTime()" placeholder="" v-model="addItem.DateAdded" />
          </dd>
        </dl>
        <dl class="item">
          <dt>编辑</dt>
          <dd><input type="text" class="s-input" v-model="addItem.Editer"></dd>
        </dl>
        <dl class="item">
          <dt>图片</dt>
          <dd>
            <upload-file @upload-ok="uploadOk" v-if="!addItem.Image"></upload-file>
            <ul class="upload-img-list" v-else>
              <li class="item">
                <sup class="del" @click="delImage"></sup>
                <img :src="addItem.Image" alt="">
              </li>
            </ul>
            <p class="text-muted">
              图片宽高为122 X 42像素，仅支持jpg、jpeg、gif、png，文件小于10M。
            </p>
          </dd>
        </dl>
        <dl class="item">
          <dt>关键字</dt>
          <dd><input type="text" class="l-input" placeholder="多个标签之间用‘，’分隔，最多不超过10个" v-model="addItem.KeyWord"></dd>
        </dl>
        <dl class="item">
          <dt>链接内容</dt>
          <dd><input type="text" class="l-input" placeholder="" v-model="addItem.UrlContent"></dd>
        </dl>
        <dl class="item">
          <dt>内容</dt>
          <dd>
            <u-editor :content.sync="addItem.Content"></u-editor>
          </dd>
        </dl>
        <div class="btnSubmit">
          <div class="btn btn-primary large" @click="onSubmit_Click()">保存</div>
          <div class="btn btn-primary large" @click="onCancel_Click()">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 售后服务模板添加
 */
import uploadFile from "vues/components/uploadFile.vue";
import uEditor from "vues/components/uEditor.vue";
export default {
  name: 'app',
  data() {
    return {
      SectionList: [],
      addItem: {
        SectionId: "",
        Title: "",
        Author: "",
        Editer: "",
        Content: "",
        KeyWord: "",
        UrlContent: "",
        DateAdded: "",
        Image: ""
      }
    };
  },
  components: {
    uEditor,
    uploadFile
  },
  methods: {
    initPageData() {
      let articleId = this.$route.query.id;
      console.log(articleId);
      if (articleId) {
        fetchData({
          //获取文章信息
          API: "api/Misc/GetArticleInfo",
           para: {
              Id: articleId
            },
          callback: data => {
            console.log(data);
            this.addItem = data;
          }
        });
      }
      fetchData({
        //获取栏目列表
        API: "api/Misc/GetArticleSectionList",
        callback: data => {
          this.SectionList = data;
        }
      });
    },
    uploadOk(data) {
      this.addItem.Image = data.Data;
    },
    delImage() {
      this.addItem.Image = "";
    },
   changeTime(){
     this.addItem.DateAdded=this.$refs.input1.value;
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
    onCancel_Click() {
      this.$router.push("topList");
    }
  },
  created() {
    this.initPageData();
  },
  watch: {}
};
</script>