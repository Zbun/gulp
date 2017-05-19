<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{type=='insert'?'添加':'修改'}}机构</h2>
        <div class="body" style="min-height:178px;">
          <div class="content" style="width:434px;">
            <h4>{{cname}}</h4>
            <div class="bg-muted p10 pl20 set w6em border-box mt10">
              <dl class="item">
                <dt class="title required-mark">
                  机构名称：
                </dt>
                <dd class="content">
                  <input type="text" placeholder="输入机构名称" v-model="dataIn.objBranch.Name" class="com-ipt large" data-validate="required" maxlength="50" @keyup.enter="onSubmit_Click">
                </dd>
              </dl>
            </div>
            <div class="footer text-center mt14">
              <button class="btn btn-primary" :class="{'btn-disabled':!dataIn.objBranch.Name}" @click="onSubmit_Click">提交</button>
              <button class="btn btn-default" @click="onCancel_Click">关闭</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      twoway: true,
      default: false
    },
    type: {
      type: String,//取值：insert：插入，update：更新
      twoway: true,
      default: 'insert'
    },
    curBranch: Object
  },
  data() {
    return {
      cname: '',
      storeIds: [],
      storeList: [],
      APILIST: {
        INSERT: '/Api/Branch/BranchInsert',
        UPDATE: '/Api/Branch/BranchUpdate'
      },
      dataIn: {
        objBranch: {
          Name: '',
          Id: '',
          BranchLevel: ''
        }
      }
    }
  },
  methods: {
    initData() {
      this.cname = this.curBranch.Name;
      if (this.type == 'update') {
        this.dataIn.objBranch.Name = this.cname;
      } else {
        this.dataIn.objBranch.Name = '';
      }
      this.dataIn.objBranch.Id = this.curBranch.Id;
      this.dataIn.objBranch.BranchLevel = this.curBranch.BranchLevel;
    },
    onSubmit_Click() {
      let me = this;
      let API = '';
      let para = this.dataIn.objBranch;
      if (this.type == 'insert') {
        API = this.APILIST.INSERT;
      } else if (this.type == 'update') {
        API = this.APILIST.UPDATE;
      }
      if (!zmm_validator(this.$el)) {
        return;
      }
      fetchData({
        API,
        para,
        callback() {
          me.show = false;
          me.$dispatch('on-after-submit', me.type);
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    },
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.initData();
      }
    }
  }
}

</script>