<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>设计模板</h2>
        <div class="body">
          <div class="content" style="min-width:950px">
            模板名称：
            <input type="text" v-model="filter.Name" placeholder="填写模板名称">
            <span class="ml20">
              基于物流公司：
            <select v-model="filter.ExpressId">
              <option value="">请选择</option>
              <option v-for="item of expressList" :value="item.Id">{{item.Name}}</option>
            </select>
            <button class="btn btn-default ml20" @click="upload_Click()">
              上传物流背景图
            </button>
            <input type="file" class="import-sn hidden">
            </span>
            <div class="mt10">
              单据内容标签：
              <label class="radio-plus dragged-tag" @click="tag_add_Click(v)" v-for="v of tagList">
                <span class="text">
                {{v}}
                </span>
              </label>
            </div>
            <section class="design-box">
              <img :src="computedImgSrc" alt="" class="design-bg">
              <div class="design-area design-detail" v-html="filter.Template">
                <div class="template-box" style="position:relative"></div>
              </div>
            </section>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onOk_Click()">保存</button>
          <button class="btn btn-default" @click="onCancel_Click">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 弹窗-设计物流模板页面
 * zhao.liubin@zol.com.cn 2017-02-09
 */
import formDataUpload from 'commonScripts/formDataUpload.js';
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    curId: '',
    expressList: []
  },
  data() {
    return {
      dataIn: {
        server: localStorage.APIServer || window.APISERVER,
        imgPath: '',
        imgSrc: '',
      },
      designDetail: '',
      $designDetail: '',
      APIS: {
        insert: '/Api/Misc/ExpTempInsert',
        update: '/Api/Misc/ExpTempUpdate',
      },
      API: '',
      tagList: ['发货人', '发货人地址', '发货人电话', '收货人', '收货人地址', '收货人电话', '备注'],
      filter: {
        Name: '',
        ExpressId: '',
        Image: '',
        Template: ''
      }
    }
  },
  computed: {
    computedImgSrc() {
      let img = '';
      if (this.filter.Image != '') {
        img = this.dataIn.server + this.filter.Image;
      } else {
        img = '';
      }
      return img;
    }
  },
  components: {},
  methods: {
    upload_Click() {
      this.$el.querySelector('.import-sn').click();
    },
    //点击标签添加
    tag_add_Click(v, e) {
      if (!this.filter.Image) {
        showTips('请先上传物流单据模板图片', 'error');
        return;
      }
      // var $t = $(e.target);
      let $newTag = $('<div/>');
      $newTag.addClass('ui-widget-content ui-draggable ui-draggable-handle');
      $newTag.text('{' + v + '}');
      let $templateBox = $(this.$el).find('.template-box');
      let $parentBox = $(this.$el).find('.design-detail');
      if (0 == $templateBox.length) {
        $templateBox = $('<div/>');
        $templateBox.addClass('template-box');
        $templateBox.css('position', 'relative');
        $newTag = $templateBox.append($newTag);

      } else {
        $parentBox = $templateBox;
      }
      $parentBox.append($newTag).find('.ui-draggable-handle').last().draggable({
        cursor: 'move',
        opacity: 0.75,
        containment: 'parent',
      }).resizable().css('position', 'absolute').on('dblclick', function() {
        $(this).remove();
      });

    },
    //保存
    onOk_Click() {
      let me = this;
      if (!this.filter.Name) {
        showTips('请先填写模板名称', 'error');
        return;
      }
      if (!this.filter.ExpressId) {
        showTips('请先选择物流公司', 'error');
        return;
      }
      if (!this.filter.Image) {
        showTips('请先上传物流单据模板图片', 'error');
        return;
      }
      let para = this.filter;
      let $designDetail = $(this.$el).find('.design-detail')
      $designDetail.find('.ui-resizable-handle').remove();
      para.Template = $designDetail.html();
      if (this.curId != '') {
        para.Id = this.curId;
        this.API = this.APIS.update;
      } else {
        delete para['Id'];
        this.API = this.APIS.insert;
      }
      fetchData({
        API: this.API,
        para,
        callback(data) {
          me.show = false;
          me.$dispatch('on-after-save');
        }
      })
      this.$dispatch('on-after-save');
    },
    onCancel_Click() {
      this.show = false;

    }
  },
  ready() {
    // this.designDetail = this.$el.querySelector('.design-detail');
    // this.$designDetail = $(this.designDetail);
  },
  watch: {
    show(newVal) {
      let me = this;
      if (newVal) {
        this.filter.Name = '';
        this.filter.ExpressId = '';
        formDataUpload({
          url: this.dataIn.server + 'Api/Misc/UploadImg',
          obj: this.$el.querySelector('.import-sn'),
          type: 'png,jpg,jpeg',
          callback(data) {
            // console.log(data);
            let img = new Image();
            img.src = me.dataIn.server + data.Message;
            img.onload = function() {
              let nw = img.width;
              let nh = img.height;
              me.filter.Image = data.Message;
              // me.dataIn.imgSrc = me.dataIn.server + data.Message;
              // me.$el.querySelector('.design-detail').style.width = nw+'px';
              // me.$el.querySelector('.design-detail').style.height = nh+'px';
              let $templateBox = $(me.$el).find('.template-box');
              let $parentBox = $(me.$el).find('.design-detail');
              if (0 == $templateBox.length) {
                $templateBox = $('<div/>');
                $templateBox.addClass('template-box');
                $templateBox.css({
                  position: 'relative',
                  width: nw,
                  height: nh
                })
                $parentBox.append($templateBox);
              } else {
                $templateBox.css({
                  width: nw,
                  height: nh
                })
              }
            }
          }
        });

        if (this.curId != '') {
          fetchData({
            API: '/Api/Misc/ ExpTempPreview',
            para: {
              id: this.curId
            },
            callback(data) {
              // console.log(data);
              me.filter = data;
              // if (data.Image) {
              //   me.dataIn.imgSrc = me.dataIn.server + data.Image;
              // } else {
              //   me.dataIn.imgSrc = '';
              // }
              setTimeout(function() {
                $(me.$el).find('.design-detail').find('.ui-draggable').draggable({
                  cursor: 'move',
                  opacity: 0.75,
                  containment: 'parent',
                }).resizable().on('dblclick', function() {
                  $(this).remove();
                })
              }, 100);
            }
          })
        } else {
          me.filter.Name = '';
          me.filter.Template = '';
          me.filter.ExpressId = '';
          me.filter.Image = '';
        }
      }
    }
  }
}
</script>
