<template>
  <div class="main">
    <h2 class="content-title">资产负债表</h2>
    <div class="content-field">
      <table class="table text-center table-hover table-odd table-bordered datalist">
        <thead>
          <tr>
            <th colspan="4">资产类</th>
            <th>负债类</th>
            <th rowspan="2">净资产</th>
            <th rowspan="2">期初余额</th>
            <th rowspan="2">本期发生</th>
            <th rowspan="2">期末余额</th>
            <th rowspan="2">说明</th>
          </tr>
          <tr>
            <th>
              仓库
            </th>
            <th>
              货币资金
            </th>
            <th>应收账款</th>
            <th>借出款项</th>
            <th>应付账款</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of dataIn.dataTable">
            <td>
              {{item.ProName}}
            </td>
            <td>
              <p class="text-nowrap"> {{item.CategoryName}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.CustomerName}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.AreaName}}</p>
            </td>
            <td>
              <p class="text-nowrap">
                {{item.DateAdded|datetime}}
              </p>
            </td>
            <td>
              <p class="text-nowrap price-show">
                {{item.ProPrice|money}}
              </p>
            </td>
            <td>
              {{item.ProCount}}
            </td>
            <td>
              <p class="text-nowrap price-show">{{(item.ProPrice*item.ProCount)|money}}</p>
            </td>
          </tr>
        </tbody>
        <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
          <tr>
            <td colspan=10>
              <div class="data-empty">
                <i class="icon"></i>
                <p class="font-big text">暂无相关数据</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-center">
        <div class="pageBox"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        contentTitle: '',
        API: {
          list: 'api/Report/StoreOut'
        },
        pageindex: 1,
        curCode: '',
        curStoreId: '',
        dataIn: {
          inited: false,
          dataTable: {},
          customerList: [],
          areaList: []
        },
        dataOut: {
          search: {
            StartDate: '',
            EndDate: '',
            Code: '',
            BillType: '',
            CustomerId: '',
            Area: ''
          }
        },
      }
    },
    components: {},
    methods: {
      initPageData(pageindex = 1) {
        this.pageindex = pageindex;
        var me = this;
        var para = this.dataOut.search;
        para.PageIndex = pageindex;
        para.PageSize = 15;
        // para.billtype = this.billtype;
        fetchData({
          API: this.API.list,
          para,
          callback(data) {
            // console.log(data);
            me.dataIn.inited = true;
            // me.dataIn.dataTable = data.Data;
            me.dataIn.dataTable = [];
            // initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
          }
        })
      },
      getArea() {
        let me = this;
        fetchData({
          API: '/Api/Misc/MyArea',
          callback(data) {
            me.dataIn.areaList = data;
          }
        })
      },
      getCustomerList() {
        let me = this;
        fetchData({
          API: '/Api/Misc/CustList',
          para: {
            pageIndex: 1,
            pageSize: 10000,
          },
          callback(data) {
            // console.log(data);
            // me.dataIn.inited = true;
            me.dataIn.customerList = data.Data;
          }
        })
      }
    },
    ready() {
      this.initPageData(1);
      // this.getCustomerList();
      // this.getArea();
    }
}
</script>
