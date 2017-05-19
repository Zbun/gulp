<template>
  <div class="main">
    <h2 class="content-title">库存成本调整</h2>
    <div class="content-field">
      <div class="search clearfix mt20">
        <button class="btn btn-default fr" @click="export_Click()">导出</button>
        <span class="mr5">
          供应商
        </span>
        <input type="text" placeholder="输入关键字" v-model="dataOut.search.SupplierName" @keydown.enter="initPageData(1)">
        <span class="ml20 mr5">
          分类</span>
        <select v-model="dataOut.search.Category">
          <option value="">请选择</option>
          <option v-for="item in dataIn.categoryList" :value="item.Category">{{item.CategoryName}}</option>
        </select>
        <span class="ml20 mr5">仓库</span>
        <select v-model="dataOut.search.StoreId">
          <option value="">请选择</option>
          <option v-for="item of dataIn.stores" :value="item.Id">{{item.Name}}</option>
        </select>
        <span class="ml20 mr5">
          <span class="mr5">商品</span>
        <input type="search" class="com-ipt" placeholder="输入关键字" v-model="dataOut.search.ProName" @keydown.enter="initPageData(1)" maxlength="50">
        </span>
        <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table text-center table-hover table-odd table-bordered datalist">
        <thead>
          <tr>
            <tr>
              <th style="width:150px;">供应商</th>
              <th style="width:130px;">分类</th>
              <th>商品名称</th>
              <th style="width:100px;">库存</th>
              <th style="width:130px;">总成本</th>
              <th style="width:120px;">平均成本</th>
              <th style="width:100px;">成本占比</th>
              <th style="width:100px;">调整成本</th>
            </tr>
          </tr>
        </thead>
        <tfoot v-show="dataIn.inited&&dataIn.dataTable.length>0">
          <td colspan="3" class="text-right">
            <b>合计：</b>
          </td>
          <td><b>
            {{dataIn.arrDataTotal.ProCount}}
          </b></td>
          <td><b>
            {{dataIn.arrDataTotal.ProCost|money}}
          </b></td>
          <td colspan="3">&nbsp;</td>
        </tfoot>
        <tbody>
          <tr v-for="item of dataIn.dataTable">
            <td>
              <p class="text-nowrap" :title="item.SupplierName">{{item.SupplierName}}</p>
            </td>
            <td>
              <p class="text-nowrap" :title="item.CategoryName">
                {{item.CategoryName}}
              </p>
            </td>
            <td>
              <p :title="item.ProName">{{item.ProName}}</p>
            </td>
            <td>
              <a class="text-nowrap highlight" href="javascript:;" @click="checkSN_Click(item.Details,item.ProName)">{{item.ProCount}}</a>
            </td>
            <td>
              <p class="text-nowrap price-show">{{item.ProCost|money}}</p>
            </td>
            <td>
              <p class="text-nowrap price-show">{{item.AgvCost|money}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.CostRate}}</p>
            </td>
            <td>
              <p class="action">
                <a href="javascript:;" class="item" @click="adjust_Click(item)">调整</a>
              </p>
            </td>
          </tr>
        </tbody>
        <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
          <tr>
            <td colspan=8>
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
    <check-sn :show.sync="isShowCheckSn" :pro-name="curProName" :arr-detail="curArrDetail"></check-sn>
    <adjust-cost :show.sync="isShowAdjustCost" :from-parent-detail="objToAdjustCost" @on-after-adjust="dispatchedAfterAdjust()"></adjust-cost>
  </div>
</template>
<script>
import checkSn from './popup/checkSN.vue';
import adjustCost from './popup/popupAdjustCost.vue';
export default {
  data() {
      return {
        contentTitle: '',
        isShowCheckSn: false,
        isShowAdjustCost: false,
        curProName: '',
        curArrDetail: [],
        objToAdjustCost: {},
        API: {
          list: 'api/Report/ProCost'
        },
        pageindex: 1,
        curCode: '',
        curStoreId: '',
        dataIn: {
          inited: false,
          stores: [],
          arrDataTotal: [],
          dataTable: [],
          categoryList: []
        },
        dataOut: {
          search: {
            StartDate: '',
            EndDate: '',
            ProName: '',
            StoreId: '',
            Category: ''
          }
        },
      }
    },
    components: {
      checkSn,
      adjustCost
    },
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
            me.dataIn.dataTable = data.Data;
            me.dataIn.arrDataTotal = data.Total;
            initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
          }
        })
      },
      checkSN_Click(arrDetail, proName) {
        this.curArrDetail = arrDetail;
        this.curProName = proName;
        this.isShowCheckSn = true;
      },
      adjust_Click(item) {
        this.isShowAdjustCost = true;
        this.objToAdjustCost = item;
      },
      dispatchedAfterAdjust() {
        this.initPageData(this.pageindex);
      },
      getStores() {
        let me = this;
        fetchData({
          API: '/Api/User/Store',
          para: {},
          callback(data) {
            // console.log(data);
            me.dataIn.stores = data;
          }
        });
      },
      getCategory() {
        let me = this;
        fetchData({
          API: 'api/Product/Category',
          callback(data) {
            me.dataIn.categoryList = data;
          }
        })
      },
      //导出
      export_Click() {
        var me = this;
        var para = this.dataOut.search;
        para.RptType = 1;
        para.PageIndex = this.pageindex;
        para.PageSize = 15;
        // para.billtype = this.billtype;
        fetchData({
          API: this.API.list + '_Excel',
          para,
          callback(data) {
            // console.log(data);
            var server = window.APISERVER;
            dialog({
              title: '导出',
              content: `<a class="highlight" href="${server}${data}">导出Excel表格</a>`,
              cancelValue: '关闭',
              cancel() {

              }
            }).showModal();
          }
        })
      },
    },
    ready() {
      this.dataOut.search.StartDate = zmm_date.getTheDay({
        x: parseInt(window.localStorage.DISSTARTDATE) || -7
      });
      this.dataOut.search.EndDate = zmm_date.getTheDay({
        x: parseInt(window.localStorage.DISENDDATE) || 0
      });
      this.initPageData(1);
      this.getStores();
      this.getCategory();
    }
}
</script>
