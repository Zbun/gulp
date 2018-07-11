<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="cancelClick">&times;</a>{{isEdit==1?'编辑':'新增'}}分类</h2>
        <div class="body">
          <div class="content" style="width:400px">
            <div class="set">
              <dl class="item">
                <dt class="title">分类路径</dt>
                <dd class="content">
                  全部分类{{curItem.Name?('>'+curItem.Name):''}}
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">
                  分类名称
                </dt>
                <dd class="content">
                  <input type="search" v-model="name" data-validate="required" placeholder="请输入分类名称" @keydown.enter="submitClick" class="com-ipt large" maxlength="20">
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="submitClick">确定</button>
          <button class="btn btn-default" @click="cancelClick">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: { twoway: true, default: false },
    editItem: {},
    curItem: {},
    isEdit: 0 //0为新增，1为编辑
  },
  data() {
    return {
      name: ""
    };
  },
  components: {},
  methods: {
    submitClick() {
      if (!zmm_validator(this.$el)) {
        return;
      }
      let para = {
        Id: 0,
        PId: this.curItem.Id,
        Name: this.name
      };
      if (this.isEdit) {
        para.Id = this.editItem.Id;
      }
      fetchData({
        API: "/api/Activity/GiftCategoryEdit",
        para,
        callback: data => {
          this.$emit("save-ok");
          this.cancelClick();
        }
      });
    },
    cancelClick() {
      this.show = false;
      this.$emit("update:show", false);
    }
  },
  created() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.name = "";
        if (this.isEdit == 1) {
          this.name = this.editItem.Name;
        }
      }
    }
  }
};
</script>