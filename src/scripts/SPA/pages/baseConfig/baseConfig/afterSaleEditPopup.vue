<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{isEdit==1?'编辑':'新增'}}售后服务模板</h2>
        <div class="body">
          <div class="content set" style="width:800px">
            <dl class="item">
              <dt class="title required-mark">服务标题</dt>
              <dd class="content">
                <div class="">
                  <input type="text" placeholder="输入名称" data-validate="required" class="com-ipt " v-model="editItem.Name">
                </div>
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">
                状态
              </dt>
              <dd class="content">
                <label class="radio">
                  <input type="radio" value="1" v-model="editItem.Status">
                  <span class="icon"></span>启用</label>
                <label class="radio">
                  <input type="radio" value="0" v-model="editItem.Status">
                  <span class="icon"></span>禁用</label>
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">
                服务内容
              </dt>
              <dd class="content">
                <u-editor :content.sync="editItem.Content"></u-editor>
              </dd>
            </dl>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">确定</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 售后服务模板添加
 */
import uEditor from 'vues/components/uEditor.vue';
export default {
  props: {
    show: { twoway: true, default: false },
    curItem: {}
  },
  data() {
    return {
      isEdit: 0,
      editItem: {},
    }
  },
  components: {
    uEditor,
  },
  methods: {
    initPageData() {
      let para = {};
      para.Id = this.curItem.Id;
      fetchData({
        api: '/api/Supplier/GetAfterSalesTemplateInfo',
        para,
        callback: (data) => {
          this.editItem = data;
        }
      })
    },

    onSubmit_Click() {
      if (!zmm_validator(this.$el)) {
        return;
      }
      let para = this.editItem;
      if (!para.Id) {
        para.Id = 0;
      }
      fetchData({
        api: '/api/Supplier/AfterSalesTemplateEdit',
        para,
        callback: (data) => {
          this.$emit('save-ok');
          this.onCancel_Click();
        }
      })
    },
    onCancel_Click() {
      this.show = false;
      this.$emit('update:show', false);
    }
  },
  created() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.editItem = this.curItem;
        this.isEdit = 0;
        if (this.curItem && this.curItem.Id != 0) {
          this.isEdit = 1;
          this.initPageData();
        }
      }
    }
  }
}
</script>