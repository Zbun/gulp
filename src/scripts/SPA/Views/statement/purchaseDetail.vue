<template>
  <div class="main">
    <h2 class="content-title">采购明细表</h2>
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
            <input type="text" v-model="dataOut.search.EndDate" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({minDate: '#F{$dp.$D(\'startDate\')}'})">
            <i class="fa fa-calendar icon"></i>
         </span>
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
        <span class="ml20">
          <span class="mr5">供应商</span>
        <input type="search" class="com-ipt" placeholder="输入关键字" v-model="dataOut.search.SupplierName" @keydown.enter="initPageData(1)" maxlength="50">
        </span>
        <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table text-center table-hover table-odd table-bordered datalist">
        <thead>
          <tr>
            <th>类型</th>
            <th style="width:120px;">分类</th>
            <th>商品名称</th>
            <th style="width:100px;">供应商</th>
            <th style="width:140px;">采购日期</th>
            <th style="width:100px;">单价</th>
            <th style="width:100px;">数量</th>
            <th style="width:150px;">小计</th>
          </tr>
        </thead>
        <tfoot v-if="dataIn.inited&&!dataIn.dataTable.length==0">
          <tr>
            <td colspan="6" class="text-right">
              <b>合计：</b>
            </td>
            <td class="text-nowrap">
              {{dataIn.dataTotal.TotalProCount}}
            </td>
            <td class="text-nowrap price-show">
              <b>{{dataIn.dataTotal.TotalSubTotal|money}}</b>
            </td>
          </tr>
        </tfoot>
        <tbody>
          <tr v-for="item of dataIn.dataTable">
            <td class="text-nowrap">
              {{item.BillType|SNStatus}}
            </td>
            <td>
              <p class="text-nowrap" :title="item.CategoryName">{{item.CategoryName}}</p>
            </td>
            <td>
              <p :title="item.ProName">{{item.ProName}}</p>
            </td>
            <td>
              <p class="text-nowrap" :title="item.SupplierName">{{item.SupplierName}}</p>
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
              <p class="text-nowrap">{{item.ProCount}}</p>
            </td>
            <td>
              <p class="text-nowrap price-show">{{item.SubTotal|money}}</p>
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
  </div>
</template>
<script>
export default {
  data() {
      return {
        contentTitle: '',
        API: {
          list: 'api/Report/StoreIn'
        },
        pageindex: 1,
        curCode: '',
        curStoreId: '',
        dataIn: {
          inited: false,
          dataTable: {},
          dataTotal: {},
          arrProList: [],
          supplierList: []
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
            Code: '',
            BillType: '',
            SupplierId: '',
            ProName: '',
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
      },
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
            me.intelligentMatch.isShowPro = false
            me.dataIn.dataTable = data.Data;
            me.dataIn.dataTotal = data.Total;
            initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
          }
        })
      }, //导出
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
            console.log(data);
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
      getSupplierList() {
        let me = this;
        fetchData({
          API: '/Api/Misc/SupplierList',
          para: {
            pageIndex: 1,
            pageSize: 10000,
          },
          callback(data) {
            // console.log(data);
            me.dataIn.supplierList = data.Data;
          }
        })
      }, //商品感知
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
    },
    ready() {
      this.dataOut.search.StartDate = zmm_date.getTheDay({
        x: parseInt(window.localStorage.DISSTARTDATE) || -7
      });
      this.dataOut.search.EndDate = zmm_date.getTheDay({
        x: parseInt(window.localStorage.DISENDDATE) || 0
      });
      this.initPageData(1);
      this.getGoodsList();
    }
}
</script>
