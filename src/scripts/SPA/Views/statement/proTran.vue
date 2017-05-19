<template>
  <div class="main">
    <h2 class="content-title">库存周转</h2>
    <div class="content-field">
      <div class="search clearfix mt20">
        <button class="btn btn-default fr" @click="export_Click()">导出</button>
        <span class="mr5">时间段</span>
        <span class="date-field">
            <input type="text" v-model="dataOut.search.StartDate"  readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'endDate\')}'})">
            <i class="fa fa-calendar icon"></i>
          </span>
        <span> - </span>
        <span class="date-field">
            <input type="text" v-model="dataOut.search.EndDate" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({minDate: '#F{$dp.$D(\'startDate\')}',maxDate:'%y-%M-%d'})">
            <i class="fa fa-calendar icon"></i>
         </span>
        <span class="ml20 mr5">
          分类</span>
        <select v-model="dataOut.search.Category">
          <option value="">请选择</option>
          <option v-for="item in dataIn.categoryList" :value="item.Category">{{item.CategoryName}}</option>
        </select>
        <span class="mr5 ml20">机构</span>
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
        <span class="ml20">
          <span class="mr5">商品名称</span>
        <span class="intelligent-match">
          <span class="">
                <input type="search" class="select-long" placeholder="输入关键字" @keydown.enter="initPageData(1)" v-model="dataOut.search.ProName" @focus="IMIptProFocus()" @input="IMIptProInput()">
              </span>
        <ul class="list" v-show="intelligentMatch.isShowPro&&computedFilterProInfo.length>0">
          <li class="item" v-for="item in computedFilterProInfo" @click="selectedThisProId(item)">{{item.Name}}</li>
        </ul>
        </span>
        </span>
        <button class="btn btn-primary ml10" @click="search()">搜索</button>
      </div>
      <table class="table text-center table-hover table-odd table-bordered datalist">
        <thead>
          <tr>
            <th style="width:150px;">分类</th>
            <th>商品名称</th>
            <th style="width:120px">销售</th>
            <th style="width:120px">平均库存</th>
            <th style="width:120px">周转率</th>
            <th style="width:120px">周转天数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of dataIn.dataTable">
            <td>
              <p class="text-nowrap">
                {{item.CategoryName}}
              </p>
            </td>
            <td>
              <p>{{item.ProName}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.StoreOutProCount}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.InventoryAverage}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.TranRate}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.TranDays}}</p>
            </td>
          </tr>
        </tbody>
        <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
          <tr>
            <td colspan=6>
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
          list: 'api/Report/ProTran'
        },
        pageindex: 1,
        curCode: '',
        curStoreId: '',
        dataIn: {
          inited: false,
          stores: [],
          dataTable: [],
          categoryList: [],
          arrProList: [],
          arrBranch: [],
        },
        intelligentMatch: {
          isShow: false,
          isShowPro: false,
          customerName: '',
          proName: ''
        },
        dataOut: {
          search: {
            StartDate: '',
            EndDate: '',
            ProName: '',
            BranchId: '',
            StoreId: '',
            Category: ''
          }
        },
      }
    },
    components: {},
    computed: {
      //智能感知匹配商品名
      computedFilterProInfo() {
        let me = this;
        let newPros = this.dataIn.arrProList;
        if (validatorManu.isEmpty(this.dataOut.search.ProName)) {
          return newPros;
        } else {
          return newPros.filter((item) => {
            return new RegExp(me.dataOut.search.ProName.trim(), 'i').test(item.Name);
          })
        }
      }, //计算当前所选机构分仓
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
            me.intelligentMatch.isShowPro = false;
            me.dataIn.dataTable = data.Data;
            initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
          }
        })
      },
      //商品感知
      getGoodsList(proType = 1) {
        var me = this;
        fetchData({
          API: '/api/Product/List',
          para: {
            pageIndex: 1,
            pageSize: 100000,
            ProType: proType
          },
          callback(data) {
            me.dataIn.arrProList = data.Data;
          }
        });
      },
      IMIptProFocus() {
        this.intelligentMatch.isShowPro = true;
      },
      IMIptProInput() {
        this.intelligentMatch.isShowPro = true;
      },
      selectedThisProId(item) {
        this.dataOut.search.ProName = item.Name;
        this.intelligentMatch.isShowPro = false;
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
            me.dataIn.categoryList = data;
          }
        })
      },
      //导出
      export_Click() {
        var me = this;
        var para = this.dataOut.search;
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
      search() {
        if (!this.dataOut.search.StartDate || !this.dataOut.search.EndDate) {
          showTips('请先选择时间段日期', 'error');
          return;
        }
        this.initPageData(1);
      }
    },
    ready() {
      this.dataOut.search.StartDate = zmm_date.getTheDay({
        x: parseInt(window.localStorage.DISSTARTDATE) || -7
      });
      this.dataOut.search.EndDate = zmm_date.getTheDay({
        x: parseInt(window.localStorage.DISENDDATE) || 0
      });
      this.initPageData(1);
      setTimeout(() => {

        this.getStores();
        this.getCategory();
        this.getGoodsList();
      })
    }
}
</script>
