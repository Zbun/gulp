<template>
  <div class="main">
    <h2 class="content-title">经营业绩表</h2>
    <div class="content-field">
      <table class="table text-center table-hover table-odd table-bordered datalist">
        <thead>
          <tr>
            <th colspan="4">收入类</th>
            <th colspan="3">支出类</th>
            <th colspan="2">货品报损</th>
            <th rowspan="2">年初余额</th>
            <th colspan="3">发生额</th>
            <th rowspan="2">年末余额</th>
            <th rowspan="2">说明</th>
            <th rowspan="2">经营利润</th>
          </tr>
          <tr>
            <th>
              销售收入
            </th>
            <th>
              盘点盈余收入
            </th>
            <th>其他收入</th>
            <th>汇总</th>
            <th>销售成本</th>
            <th>盘点亏损</th>
            <th>汇总</th>
            <th>会计记账</th>
            <th>费用支出</th>
            <th>一月</th>
            <th>二月</th>
            <th>三月</th>
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
            <td colspan=16>
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
