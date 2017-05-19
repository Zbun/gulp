<template>
  <div class="main">
    <h2 class="content-title">库存汇总</h2>
    <div class="content-field">
      <div class="search clearfix mt20">
        <span class="ml20">
          <span class="mr5">商品名称</span>
        <input type="search" class="com-ipt" placeholder="输入关键字" v-model="dataOut.search.ProName" @keydown.enter="initPageData(1)" maxlength="50">
        </span>
        <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table text-center table-hover table-odd table-bordered datalist">
        <thead>
          <tr>
            <th>商品名称</th>
            <th>仓库</th>
            <th>数量</th>
            <th>在途</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of dataIn.dataTable">
            <td>
              {{item.ProName}}
            </td>
            <td>
              {{item.StoreName}}
            </td>
            <td>
              {{item.ProCount}}
            </td>
            <td>
              {{item.ProCount_OnTransfer}}
            </td>
          </tr>
        </tbody>
        <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
          <tr>
            <td colspan=4>
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
          list: '/Api/Report/Inventory'
        },
        pageindex: 1,
        curCode: '',
        curStoreId: '',
        dataIn: {
          inited: false,
          dataTable: {}
        },
        dataOut: {
          search: {
            StartDate: '',
            EndDate: '',
            Code: '',
            BillType: '',
            ProName: '',
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
            me.dataIn.dataTable = data;
            // initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
          }
        })
      },
    },
    ready() {
      this.initPageData(1);
    }
}
</script>
