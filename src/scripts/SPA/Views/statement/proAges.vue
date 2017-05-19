<template>
  <div class="main">
    <h2 class="content-title">库龄分析表</h2>
    <div class="content-field search">
      <div class=" clearfix mt10">
        <button class="btn btn-default fr" @click="export_Click()">导出</button>
        <span class="mr5">
  周期
</span>
        <select v-model="dataOut.search.Nodes">
          <option value="">请选择</option>
          <option value="30-60-90">30-60-90（天）</option>
          <option value="7-14-28">7-14-28（天）</option>
          <option value="15-30-45">15-30-45（天）</option>
        </select>
        <!--      <input type="text" placeholder="输入如：0-30-60" v-model="dataOut.search.Nodes" @keydown.enter="initPageData(1)">
   --><span class="mr5 ml20">
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
        <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
      </div>
      <div class="lib-dis-wrapper">
        <table class="table text-center table-hover table-odd table-bordered datalist table-detail">
          <thead>
            <tr>
              <th rowspan="2" style="width:100px;">分类</th>
              <th rowspan="2">商品</th>
              <template v-for="item in computedThead">
                <th colspan="2">
                  {{item.Title}}
                </th>
              </template>
            </tr>
            <tr>
              <template v-for="x in computedThead.length">
                <th style="width:60px">
                  数量
                </th>
                <th style="width:100px">
                  金额
                </th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item of dataIn.dataTable">
              <td>
                <p class="text-nowrap">{{item.CategoryName}}</p>
              </td>
              <td>
                <p :title="item.ProName">{{item.ProName}}</p>
              </td>
              <template v-for="item2 in item.Details">
                <td>
                  <p class="text-nowrap">{{item2.ProCount}}</p>
                </td>
                <td>
                  <p class="text-nowrap price-show">{{item2.ProPrice|money}}</p>
                </td>
              </template>
            </tr>
          </tbody>
          <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
            <tr>
              <td colspan=2>
                <div class="data-empty">
                  <i class="icon"></i>
                  <p class="font-big text">暂无相关数据</p>
                </div>
              </td>
            </tr>
          </tbody>
      </div>
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
          list: 'api/Report/ProAges'
        },
        pageindex: 1,
        curCode: '',
        curStoreId: '',
        dataIn: {
          inited: false,
          stores: [],
          dataTable: [],
          categoryList: [],
          arrBranch: [],
          arrProList: [],
        },
        intelligentMatch: {
          isShow: false,
          isShowPro: false,
          customerName: '',
          proName: ''
        },
        dataOut: {
          search: {
            ProName: '',
            BranchId: '',
            StoreId: '',
            Category: '',
            Nodes: ''
          }
        },
      }
    },
    computed: {
      computedThead() {
        return this.dataIn.dataTable[0] ? this.dataIn.dataTable[0].Details : [];
      },
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
            me.intelligentMatch.isShowPro = false;
            me.dataIn.inited = true;
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
    },
    ready() {
      this.initPageData(1);
      setTimeout(() => {
        this.getStores();
        this.getCategory();
        this.getGoodsList();
      })

    }
}
</script>
