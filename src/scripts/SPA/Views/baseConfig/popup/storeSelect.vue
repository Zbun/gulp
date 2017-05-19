<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>选择仓库</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <p class="bg bg-warning text-center">（未勾选时，默认为选择全部仓库，请知悉）</p>
            <table class="table table-bordered mt10" v-for="item in storeList">
              <thead>
                <tr>
                  <th>
                    <span class="ml10">机构：</span><strong>{{item.Name}}</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span class="ml10" v-for="item2 in item.Store">
                       <label class="checkbox" >
              <input type="checkbox" v-model="storeIds" :value="item2.Id">{{item2.Name}}<span class="icon"></span></label>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
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
    sids: '',
    userId: ''
  },
  data() {
    return {
      storeIds: [],
      storeList: []
    }
  },
  components: {},
  computed: {},
  methods: {
    onSubmit_Click() {
      let me = this;
      fetchData({
        API: '/Api/User/StorePowerSet',
        para: {
          UserId: this.userId,
          StoreIds: this.storeIds,
        },
        callback() {
          me.show = false;
          me.$dispatch('on-save-click');
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    },
    getStoreList() {
      let me = this;
      fetchData({
        api: '/Api/User/Store',
        callback(data) {
          data.forEach(item => {
            item.Store.forEach(item2 => {
              item2.Id = item2.Id + '';
            })
          });
          me.storeList = data;

        }
      })
    },
  },
  ready() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.storeIds = this.sids ? this.sids.split(',') : [];

        this.getStoreList();
      }
    }
  }
}
</script>
