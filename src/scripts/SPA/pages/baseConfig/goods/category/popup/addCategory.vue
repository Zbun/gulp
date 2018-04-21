<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{isEdit==1?'编辑':'新增'}}</h2>
        <div class="body">
          <div class="content" style="width:400px">
            <div class="set">
              <dl class="item" v-show="curItem.PathName">
                <dt class="title text-muted">所属品类</dt>
                <dd class="content">
                  {{curItem.PathName?curItem.PathName:''}}</dd>
              </dl>
              <dl class="item">
                <dt class="title text-muted required-mark">
                  品类名称
                </dt>
                <dd class="content">
                  <input type="text" v-model="name" data-validate="required" placeholder="输入品类" class="ml5 com-ipt large" autofocus @keydown.enter="onSubmit_Click">
                </dd>
              </dl>
            </div>
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
export default {
  props: {
    show: { type: Boolean, default: false },
    curItem: {},
    isEdit: 0, //0添加、1编辑
    editItem: {}
  },
  data() {
    return {
      name: ''
    }
  },
  components: {

  },
  methods: {
    onSubmit_Click() {
      if (!zmm_validator(this.$el)) {
        return;
      }
      if (this.isEdit == 1) { //编辑
        fetchData({
          api: 'api/Goods/CategoryModify',
          para: {
            Id: this.editItem.Id,
            Item: this.name,
          },
          callback: () => {
            this.onCancel_Click();
            this.editItem.Item = this.name;
            this.$emit('update:editItem', this.editItem);
          }
        })
      } else {
        fetchData({
          API: '/api/Goods/CategoryAdd',
          para: {
            PCode: this.curItem.Code,
            Item: this.name
          },
          callback: data => {
            this.onCancel_Click();
            this.$emit('update:curItem.Child', this.curItem.Child.push(data));
          }
        })
      }

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
        this.name = '';
        setTimeout(() => {
          this.$el.querySelector('.com-ipt').focus();
        })
        if (this.isEdit == 1) {
          this.name = this.editItem.Item;
        }
      }
    }
  }
}
</script>