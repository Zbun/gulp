<template>
  <div>
    <input type="file" class="import-img hidden" :accept="uploadAcceptImg">
    <script ref="ueditor" type="text/plain" id="myEditor" style="height:150px;width:680px;">
    </script>
  </div>
</template>
<script>
/**
 * uEditor上传组件
 */
import formDataUpload from 'commonScripts/formDataUpload.js';
export default {
  props: {
    config: {},
    content: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'content',
    event: 'contentChange'
  },
  data() {
    return {
      uploadAcceptImg: '.jpg,.jpeg,.gif,.png',
      editor: null,
      img: '',
      isEditing: false,
    }
  },
  methods: {
    init() {
      this.attachBtnToEditor();
      this.editor = UE.getEditor('myEditor');
      this.initImport();
      this.editor.addListener('ready', () => {
        this.editor.setContent(this.content);
        this.editor.addListener('contentChange', () => {
          this.isEditing = true;
          this.$emit('update:content', this.editor.getContent());
        })
      })
    },
    //给富文本框添加一个按钮
    attachBtnToEditor() {
      let that = this;
      UE.registerUI('上传图片', function(editor, uiName) {
        //注册按钮执行时的command命令，使用命令默认就会带有回退操作
        editor.registerCommand(uiName, {
          execCommand: function() {
            that.clickUpload()
          }
        });

        //创建一个button
        var btn = new UE.ui.Button({
          //按钮的名字
          name: uiName,
          //提示
          title: uiName,
          editorId: 'myEditor',
          //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
          cssRules: 'background-position: -380px 0;',
          //点击时执行的命令
          onclick: function() {
            //这里可以不用执行命令,做你自己的操作也可
            editor.execCommand(uiName);
          }
        });

        //当点到编辑内容上时，按钮要做的状态反射
        editor.addListener('selectionchange', function() {
          var state = editor.queryCommandState(uiName);
          if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
          } else {
            btn.setDisabled(false);
            btn.setChecked(state);
          }
        });
        //因为你是添加button,所以需要返回这个button
        return btn;
      });
    },
    uploadOk(data) { //上传成功，处理数据
      this.isEditing = true;
      this.editor.setContent(`<img src="${data}" />`, true);
    },
    initImport() { //初始化上传图片方法
      let me = this;
      formDataUpload({
        url: window.UPLOADSERVER,
        obj: this.$el.querySelector('.import-img'),
        type: this.uploadAcceptImg,
        size: '10M',
        callback(data) {
          me.uploadOk(data.Data);
        }
      })
    },
    clickUpload() {
      this.$el.querySelector('.import-img').click();
    },
  },
  watch: {
    'content' (v) {
      // this.$emit('contentChange', v)
      if (!this.isEditing) {}
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    });
  },
  mounted() {},
  // deactivated() {
  //   this.editor.reset()
  // },
  // activated() {
  //   this.init()
  // },
  destroyed() {
    this.editor.destroy();
  }
}
</script>