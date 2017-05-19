<template>
  <div class="main">
    <h2 class="content-title">出库串号明细</h2>
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
                   <span class="mr5">
          分类</span>
        <select v-model="dataOut.search.Category">
          <option value="">请选择</option>
          <option v-for="item in dataIn.categoryList" :value="item.Category">{{item.CategoryName}}</option>
        </select>
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
          <span class="mr5">客户</span>
        <input type="search" class="com-ipt" placeholder="输入关键字" v-model="dataOut.search.CustomerName" @keydown.enter="initPageData(1)" maxlength="50">
        <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table text-center table-hover table-odd table-bordered datalist">
        <thead>
          <tr>
            <th style="width:150px;">串号</th>
            <th style="width:150px;">分类</th>
            <th>商品名称</th>
            <th style="width:150px;">客户</th>
            <th style="width:150px;">出库单号</th>
            <th style="width:120px;">出库价格</th>
            <th style="width:150px;">出库时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of dataIn.dataTable">
            <td>
              <p class="text-nowrap">{{item.Imei}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.CategoryName}}</p>
            </td>
            <td>
              <p>{{item.ProName}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.CustomerName}}</p>
            </td>
            <td>
              <p class="text-nowrap">
                <a v-if="item.CustomerId>0" v-link="{ name: 'libOutOrderCheck', params:{ loocOrder: item.StoreOutCode}}" class="item highlight">{{item.StoreOutCode}}</a>
                <span v-else>
                  {{item.StoreOutCode}}
                </span>
              </p>
              <td>
                <p class="text-nowrap price-show">
                  {{item.StoreOutPrice|money}}
                </p>
              </td>
              <td>
                <p class="text-nowrap">{{item.StoreOutDate|datetime}}</p>
              </td>
          </tr>
        </tbody>
        <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
          <tr>
            <td colspan=7>
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
          list: 'api/Report/ImeiStoreOut'
        },
        pageindex: 1,
        curCode: '',
        curStoreId: '',
        dataIn: {
          inited: false,
          dataTable: {},
          dataTotal: {},
          categoryList: [],
          arrProList: [],
          areaList: []
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
            Category: '',
            CustomerName: '',
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
            me.dataIn.dataTable = data.Data;
            me.dataIn.dataTotal = data.Total;
            initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
          }
        })
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
    },
    ready() {
      this.dataOut.search.StartDate = zmm_date.getTheDay({
        x: parseInt(window.localStorage.DISSTARTDATE) || -7
      });
      this.dataOut.search.EndDate = zmm_date.getTheDay({
        x: parseInt(window.localStorage.DISENDDATE) || 0
      });
      this.initPageData(1);
      this.getCategory();
      this.getGoodsList();
    }
}
</script>
