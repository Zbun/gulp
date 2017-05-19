<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>预{{computedTitle}}明细</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <table class="table text-center table-bordered">
              <thead>
                <tr>
                  <th>
                    金额
                  </th>
                  <th v-if="isPay==1">供应商</th>
                  <th v-else>客户</th>
                  <th>
                    时间
                  </th>
                  <th>
                    备注
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in dataIn.dataTable">
                  <td>
                    <p class="text-nowrap">{{item.Amount|money}}</p>
                  </td>
                  <td v-if="isPay==1">{{item.SupplierName}}</td>
                  <td v-else>{{item.CustomerName}}</td>
                  <td>
                    <p class="text-nowrap">
                      {{item.DateAdded|datetime}}
                    </p>
                  </td>
                  <td>
                    {{item.Description}}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="text-center">
              <div class="pageBox"></div>
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
      twoway: true,
      default: false
    },
    isPay: '',
    id: ''
  },
  data() {
    return {
      dataIn: {
        dataTable: []
      }
    }
  },
  computed: {
    computedTitle() {
      return this.isPay == 1 ? '付' : '收';
    },
    computedAPI() {
      return this.isPay == 1 ? 'API/Finance/SupplierPrepaymentHistory' : 'API/Finance/CustPrepaymentHistory';
    },
    computedPara() {
      return this.isPay == 1 ? {
        SupplierId: this.id
      } : {
        CustomerId: this.id
      };
    }
  },
  components: {},
  methods: {
    initPageData(pageindex) {
      let me = this;
      let para = this.computedPara;
      para.pageSize = 10;
      fetchData({
        api: this.computedAPI,
        para,
        callback(data) {
          // console.log(data);
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
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
        this.initPageData(1);
      }
    }
  }
}
</script>
