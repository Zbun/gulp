<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>转单至Z管家</h2>
        <div class="body">
          <div class="content set" style="width:500px">
            <h4>已选订单：<b class="text-warning">{{details.length}}</b></h4>
            <dl class="item">
              <dt class="title">
                机构
              </dt>
              <dd class="content">
                <select v-model="BranchId" @change="branch_Change();">
                  <option v-for="item of arrBranch" :value="item.Id">
                    {{item.Name}}
                  </option>
                </select>
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">
                分仓
              </dt>
              <dd class="content">
                <select class="com-ipt" v-model="StoreId">
                  <option :value="item.Id" v-for="item in computedStoresOfBranch">
                    {{item.Name}}
                  </option>
                </select>
              </dd>
            </dl>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">提交</button>
          <button class="btn btn-default" @click="onCancel_Click">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    arrBranch: [],
    details: [],
    dispatchApi: ''
  },
  data() {
    return {
      BranchId: '',
      StoreId: ''
    }
  },
  components: {},
  computed: {
    //计算当前所选机构分仓
    computedStoresOfBranch() {
      let arrTemp = [];
      if (this.BranchId > 0) {
        arrTemp = _.find(this.arrBranch, {
          Id: this.BranchId
        }).Store;
      }
      return arrTemp;
    },
  },
  methods: {
    onSubmit_Click() {
      let me = this;
      fetchData({
        api: this.dispatchApi,
        para: {
          BranchId: this.BranchId,
          StoreId: this.StoreId,
          Details: this.details,
        },
        callback(data) {
          me.show = false;
          me.$dispatch('on-after-submit');
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    },
    //仓随构变
    branch_Change() {
      this.StoreId = this.computedStoresOfBranch[0] ? this.computedStoresOfBranch[0].Id : '';
    },
  },
  ready() {},
  watch: {
    show(newVal) {
      if (newVal) {
        let data = this.arrBranch;
        this.BranchId = data[0] ? data[0].Id : '';
        this.StoreId = data[0].Store[0] ? data[0].Store[0].Id : '';
      }
    }
  }
}
</script>
