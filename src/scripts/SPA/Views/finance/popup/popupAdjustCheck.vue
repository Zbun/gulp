<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>成本调整历史</h2>
        <div class="body">
          <div class="content" style="width:500px">
            <table class="justshow">
              <tbody>
                <tr>
                  <th style="width:72px;">商品名称：</th>
                  <td>{{dataIn.objDataList.ProName}}</td>
                </tr>
                <tr>
                  <th>
                    供应商：
                  </th>
                  <td>{{dataIn.objDataList.SupplierName}}</td>
                </tr>
                <tr>
                  <th>调整数量：</th>
                  <td>
                    <span>{{dataIn.objDataList.ProCount}}</span>
                  </td>
                </tr>
                <tr>
                  <th>调整类型：</th>
                  <td>
                    <span>{{dataIn.objDataList.ChangeType|costChangeType}}</span>
                  </td>
                </tr>
                <tr>
                  <th>调整金额：</th>
                  <td>
                    <span class="text-warning">{{dataIn.objDataList.ProPrice|money}}</span>
                  </td>
                </tr>
                <tr>
                  <th>操作人：</th>
                  <td>
                    <span>{{dataIn.objDataList.UserNameAdded}}</span>
                  </td>
                </tr>
                <tr>
                  <th>调整日期：</th>
                  <td>
                    <span>{{dataIn.objDataList.DateAdded|datetime}}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="footer text-center">
            <button class="btn btn-default" @click="onCancel_Click">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    curCode: '',
    show: {
      twoway: true,
      default: false
    }
  },
  data() {
    return {
      dataIn: {
        objDataList: {}
      }
    }
  },
  components: {},
  methods: {
    initPageData() {
      let me = this;
      fetchData({
        API: 'API/Product/CostChangePreview',
        para: {
          Code: this.curCode
        },
        callback(data) {
          // console.log(data);
          me.dataIn.objDataList = data;
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.initPageData()
      }
    }
  }
}
</script>
