<template>
  <div class="main">
    <h2 class="content-title">库存盘点</h2>
    <div class="content-field">
      <div class="search clearfix mt20">
        <span class="mr5">机构</span>
        <select class="com-ipt" @change="branch_Change()" v-model="dataOut.search.BranchId">
          <option v-for="item of dataIn.arrBranch" :value="item.Id">
            {{item.Name}}
          </option>
        </select>
        <span class="ml20 mr5">仓库</span>
        <select class="com-ipt" v-model="dataOut.search.StoreId">
          <option value="">请选择</option>
          <option :value="item.Id" v-for="item in computedStoresOfBranch">
            {{item.Name}}
          </option>
        </select>
        <span class="ml20">类型</span>
        <select v-model="dataOut.search.ProType">
          <option value="">请选择</option>
          <option value="0">礼品</option>
          <option value="1">商品</option>
        </select>
        <span class="ml20">
          <span class="mr5">分类</span>
        <select v-model="dataOut.search.Category">
          <option value="">请选择</option>
          <option v-for="item in dataIn.arrCategoryList" :value="item.Category">{{item.CategoryName}}</option>
        </select>
        </span>
        <span class="ml20">
          <span class="mr5">商品名称</span>
        <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.ProName" @keydown.enter="initPageData()" maxlength="50">
        </span>
        <button class="btn btn-primary ml10" @click="initPageData()">搜索</button>
      </div>
      <table class="table text-center table-hover table-odd table-bordered datalist">
        <thead>
          <tr>
            <th style="width:80px;">商品编号</th>
            <th style="width:130px;">分类</th>
            <th>商品</th>
            <th style="width:80px;">分仓</th>
            <th style="width:100px;">借机</th>
            <th style="width:100px;">在途</th>
            <th style="width:100px;">系统库存</th>
            <th style="width:110px;">实盘库存</th>
            <th style="width:110px;">损溢</th>
            <th style="width:115px;">损溢金额</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of dataIn.arrDataTable">
            <td>
              <p class="text-nowrap">{{item.ProId}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.CategoryName}}</p>
            </td>
            <td>
              <p :title="item.ProName">{{item.ProName}}
                <i v-if="0==item.ProType" class="icon-gift">礼</i></p>
            </td>
            <td>
              <p class="text-nowrap">{{item.StoreName}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.ProCount_OnBorrow}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.ProCount_OnTransfer}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.ProCount}}</p>
            </td>
            <td class="col-statistics">
              <input type="number" min=0 v-model="item.ProCount1|posNumberInWithZero" class="com-ipt x-small text-center ">
            </td>
            <td>
              <p class="text-nowrap"><span v-show="item.ProCount1-item.ProCount<0">-</span>
                <span v-show="item.ProCount1-item.ProCount>0">+</span>
                <span v-show="item.ProCount1-item.ProCount==0">&nbsp;&nbsp;</span>{{Math.abs(item.ProCount1-item.ProCount)}}</p>
            </td>
            <td>
              <span v-show="item.ProCount1-item.ProCount<0">-</span>
              <span v-show="item.ProCount1-item.ProCount>0">+</span>
              <span v-show="item.ProCount1-item.ProCount==0">&nbsp;&nbsp;</span>
              <input type="text" v-model="item.DiffMoney|currencyIn" class="com-ipt x-small text-center">
            </td>
          </tr>
        </tbody>
        <tbody v-if="dataIn.inited&&0==dataIn.arrDataTable.length">
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
      <div class="text-center" v-show="dataIn.arrDataTable.length>0">
        <button class="btn-primary btn big mt20" @click="query_Click()">盘库确认</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        pageindex: 1,
        dataIn: {
          inited: false,
          arrStores: [],
          arrDataTable: [],
          arrCategoryList: [],
          arrBranch: [],
        },
        dataOut: {
          search: {
            ProType: '',
            BranchId: '',
            StoreId: '',
            ProName: '',
            Category: '',
          }
        }
      }
    },
    computed: {
      //计算当前所选机构分仓
      computedStoresOfBranch() {
        let arrTemp = [];
        if (this.dataOut.search.BranchId > 0) {
          arrTemp = _.find(this.dataIn.arrBranch, {
            Id: this.dataOut.search.BranchId
          }).Store;
        }
        return arrTemp;
      }
    },
    methods: {
      initPageData() {
        if (!this.dataOut.search.StoreId) {
          showTips('请先选择分仓', 'error');
          return;
        }
        var me = this;
        var para = this.dataOut.search;
        fetchData({
          API: '/Api/Report/Inventory',
          para,
          callback(data) {
            // console.log(data);
            me.dataIn.inited = true;
            data.forEach(item => {
              item.ProCount1 = item.ProCount;
              item.DiffMoney = 0;
            });
            me.dataIn.arrDataTable = data;
          }
        })
      },
      getStores() {
        let me = this;
        fetchData({
          API: '/Api/User/Store',
          para: {},
          callback(data) {
            me.dataIn.arrBranch = data;
            if (data.length) {
              me.dataOut.search.BranchId = data[0].Id;
            }
          }
        })
      },
      branch_Change() {
        this.dataOut.search.StoreId = '';
      },
      getCategory() {
        let me = this;
        fetchData({
          API: 'api/Product/Category',
          callback(data) {
            me.dataIn.arrCategoryList = data;

          }
        })
      },
      query_Click() {
        let me = this;
        dialog({
          title: '盘库确认',
          content: '请确认本次盘库数据，确认后将更新库存',
          ok() {
            fetchData({
              API: '/Api/Product/Stocktake',
              para: {
                StoreId: me.dataOut.search.StoreId,
                Details: me.dataIn.arrDataTable
              },
              callback(data) {
                // console.log(data);
                me.initPageData();
              }
            })
          },
          cancel() {

          }
        }).showModal();
      },
    },
    ready() {
      // this.initPageData(1);
      this.getStores();
      this.getCategory();
    }
}
</script>
