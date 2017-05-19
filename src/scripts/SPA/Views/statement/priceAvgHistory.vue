<template>
  <div class="main">
    <h2 class="content-title">成本明细</h2>
    <div class="content-field">
      <div class="search clearfix mt20">
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
        <!--         <span class="ml20 mr5">
          分类</span>
        <select v-model="dataOut.search.Category">
          <option value="">请选择</option>
          <option v-for="item in dataIn.categoryList" :value="item.Category">{{item.CategoryName}}</option>
        </select> -->
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
            <th rowspan="2">类型</th>
            <th rowspan="2">分类</th>
            <th rowspan="2">商品名称</th>
            <th rowspan="2">日期</th>
            <th colspan="3">采购</th>
            <th colspan="3">销售</th>
            <th colspan="3">结存</th>
          </tr>
          <tr>
            <th>
              数量
            </th>
            <th>
              单价
            </th>
            <th>
              小计
            </th>
            <th>
              数量
            </th>
            <th>
              单价
            </th>
            <th>
              小计
            </th>
            <th>
              数量
            </th>
            <th>
              平均成本
            </th>
            <th>
              库存成本
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of dataIn.dataTable">
            <td class="text-nowrap">
              {{item.BillType|priceAvgType}}
            </td>
            <td>
              <p class="text-nowrap">
                {{item.CategoryName}}
              </p>
            </td>
            <td>
              {{item.ProName}}
            </td>
            <td class="text-nowrap">
              {{item.DateAdded}}
            </td>
            <td>
              <p class="text-nowrap">{{item.InProCount}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.InProPrice}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.InSubTotal}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.OutProCount}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.OutProPrice}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.OutSubTotal}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.EndingProCount}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.EndingProPrice}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.EndingSubTotal}}</p>
            </td>
          </tr>
        </tbody>
        <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
          <tr>
            <td colspan=13>
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
          list: '/api/Report/ProCostHistory'
        },
        pageindex: 1,
        curCode: '',
        curStoreId: '',
        dataIn: {
          inited: false,
          stores: [],
          dataTable: [],
          arrProList: [],
          arrBranch: [],
          categoryList: []
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
            return item.Name.indexOf(me.dataOut.search.ProName.trim()) > -1;
          })
        }
      },
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
      // getCategory() {
      //   let me = this;
      //   fetchData({
      //     API: 'api/Product/Category',
      //     callback(data) {
      //       me.dataIn.categoryList = data;
      //     }
      //   })
      // },
      search() {
        if (!this.dataOut.search.StartDate || !this.dataOut.search.EndDate) {
          showTips('请先选择时间段日期', 'error');
          return;
        }
        if (!this.dataOut.search.StoreId) {
          showTips('请先选择仓库', 'error');
          return;
        }
        if (!this.dataOut.search.ProName) {
          showTips('请先填写商品称', 'error');
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
      // this.initPageData(1);
      setTimeout(() => {
        this.getStores();
        // this.getCategory();
        this.getGoodsList();
      })
    }
}
</script>
