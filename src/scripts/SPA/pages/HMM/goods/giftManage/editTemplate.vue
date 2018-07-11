<template>
  <div class="main">
    <section class="text-center fixed-footer">
      <button class="btn btn-primary large" @click="submit($event)">提交</button>
      <a href="javascript:;" class="btn large" @click="goBack">取消</a>
    </section>
    <div class="content-field">
      <p>
        <router-link :to="{name:'HMMgiftList'}">赠品管理</router-link> >
        <span class="text-muted">{{curId?'编辑':'新增'}}赠品</span>
      </p>
      <div class="two-column-view mt20">
        <div class="item">
          <h3 class="title">
            赠品信息
          </h3>
          <div class="content">
            <div class="set w4em">
              <dl class="item">
                <dt class="title">分类</dt>
                <dd class="content">
                  {{pathName}}
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">名称</dt>
                <dd class="content">
                  <input type="search" placeholder="请输入名称" class="com-ipt xx-large" v-model="objEditInfo.Name" data-validate="required">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">图片</dt>
                <dd class="content">
                  <upload-file @upload-ok="uploadOk" v-if="!objEditInfo.Image"></upload-file>
                  <ul class="upload-img-list" v-else>
                    <li class="item">
                      <sup class="del" @click="delImage"></sup>
                      <img :src="objEditInfo.Image" alt="">
                    </li>
                  </ul>
                  <p class="text-muted">
                    图片宽高为122 X 42像素，仅支持jpg、jpeg、gif、png，文件小于10M。
                  </p>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">价格</dt>
                <dd class="content">
                  <input type="search" v-model="objEditInfo.Price" placeholder="请输入价格" data-validate="required money" class="com-ipt"> 元
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">库存</dt>
                <dd class="content">
                  <input type="search" placeholder="请输入库存" data-validate="required integer" v-model="objEditInfo.Amount" class="com-ipt"> 台
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">描述</dt>
                <dd class="content">
                  <textarea rows="5" class="block" v-model="objEditInfo.GiftDetails"></textarea>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 赠品添加、编辑模板
 */

import uploadFile from 'vues/components/uploadFile.vue';
export default {
  components: {
    uploadFile,
  },
  data() {
    return {
      objMetaInfo: {},
      curId: '',
      objEditInfo: {
        Id: 0,
        CategoryId: '',
        Name: '', //名称
        Image: '',
        Price: '',
        Amount: '', //库存
        GiftDetails: '', //描述
      }
    }
  },
  computed: {

  },
  methods: {
    initPageData() {
      fetchData({
        API: '/api/Activity/GetGiftInfo',
        para: { Id: this.curId },
        callback: data => {
          this.objEditInfo = data;
        }
      })
    },
    uploadOk(data) {
      this.objEditInfo.Image = data.Data;
    },
    delImage() {
      this.objEditInfo.Image = '';
    },
    goBack() {
      this.$router.push({
        name: 'HMMgiftList',
        query: {
          categoryId: this.objEditInfo.CategoryId
        }
      });
    },
    submit(e) {
      if (!zmm_validator(this.$el)) {
        return;
      }

      let para = JSON.parse(JSON.stringify(this.objEditInfo));

      fetchData({
        target: e.target,
        API: '/api/Activity/GiftEdit',
        para,
        callback: data => {
          this.goBack();
        }
      })
    }
  },
  created() {
    this.curId = this.$route.query.id || '';
    this.pathName = decodeURI(this.$route.query.pathName || '');
    this.objEditInfo.CategoryId = this.$route.params.categoryId || '';
    if (this.curId) {
      this.initPageData();
    }
  }
}
</script>