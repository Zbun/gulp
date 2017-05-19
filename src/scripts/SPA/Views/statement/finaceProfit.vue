<template>
  <div class="main">
    <h2 class="content-title">财务利润表</h2>
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
          <span class="mr5">区域</span>
        <select v-model="dataOut.search.Area" @change="area_Change()">
          <option value="">请选择</option>
          <option :value="item.Code" v-for="item in dataIn.areaList">{{item.Name}}</option>
        </select>
        </span>
        <span class="ml20">
          <span class="mr5">客户</span>
        <span class="intelligent-match">
          <span class="">
                <input type="search" class="select-long" placeholder="输入关键字，点击选择" v-model="intelligentMatch.customerName" @focus="IMIptFocus()" @input="IMIptInput()">
              </span>
        <ul class="list" v-show="intelligentMatch.isShow&&computedFilterCustomerInfo.length>0">
          <li class="item" v-for="item in computedFilterCustomerInfo" @click="selectedThisCustomerId(item)">{{item.Name}}</li>
        </ul>
        </span>
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
        <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table text-center table-hover table-odd table-bordered datalist">
        <thead>
          <tr>
            <th>商品名称</th>
            <th>分类</th>
            <th>客户</th>
            <th>业务</th>
            <th>区域</th>
            <th>时间</th>
            <th style="width:100px;">数量</th>
            <th style="width:130px;">销售额</th>
            <th style="width:130px;">采购成本</th>
            <th style="width:130px;">毛利</th>
            <th>毛利率</th>
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
              <b>{{dataIn.dataTotal.TotalOutPrice|money}}</b>
            </td>
            <td class="text-nowrap price-show">
              <b>{{dataIn.dataTotal.TotalInPrice|money}}
                          </td></b>
              <td class="text-nowrap price-show">
                <b>{{dataIn.dataTotal.TotalProfit|money}}</b>
              </td>
              <td></td>
          </tr>
        </tfoot>
        <tbody>
          <tr v-for="item of dataIn.dataTable">
            <td>
              <p :title="item.ProName">{{item.ProName}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.CategoryName}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.CustomerName}}</p>
            </td>
            <td>
              /
            </td>
            <td>
              <p class="text-nowrap">
                {{item.AreaName}}
              </p>
            </td>
            <td>
              <p class="text-nowrap">
                {{item.DateAdded|datetime}}
              </p>
            </td>
            <td>
              <p class="text-nowrap">{{item.ProCount}}</p>
            </td>
            <td>
              <p class="text-nowrap price-show">
                {{item.OutPrice|money}}
              </p>
            </td>
            <td>
              <p class="text-nowrap price-show">
                {{item.InPrice|money}}
              </p>
            </td>
            <td>
              <p class="text-nowrap price-show">
                {{item.Profit|money}}
              </p>
            </td>
            <td>
              <p class="text-nowrap" v-if="0==item.OutPrice">/</p>
              <p class="text-nowrap" v-else>{{item.ProfitRate}}%</p>
            </td>
          </tr>
        </tbody>
        <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
          <tr>
            <td colspan=11>
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
          list: 'api/Report/StoreOutProfit'
        },
        pageindex: 1,
        curCode: '',
        curStoreId: '',
        dataIn: {
          inited: false,
          dataTable: {},
          dataTotal: {},
          customerList: [],
          areaList: [],
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
            StartDate: '',
            EndDate: '',
            ProName: '',
            CustomerName: '',
            CustomerId: '',
            Area: ''
          }
        },
      }
    },
    components: {},
    computed: {
      computedFilterCustomerInfo() {
        let me = this;
        let newArea = [];
        if (!this.dataOut.search.Area) {
          newArea = this.dataIn.customerList;
        } else {
          newArea = this.dataIn.customerList.filter(function(item) {
            return (item.Area + '').substring(0, 4) == (me.dataOut.search.Area + '').substring(0, 4);
          });
        }
        if (validatorManu.isEmpty(this.intelligentMatch.customerName)) {
          return newArea;
        } else {
          return newArea.filter((item) => {
            return item.Name.indexOf(me.intelligentMatch.customerName.trim()) > -1;
          })
        }
      }, //智能感知匹配商品名
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
            me.intelligentMatch.isShowPro = false;
            me.dataIn.dataTotal = data.Total;
            initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
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
      getArea() {
        let me = this;
        fetchData({
          API: '/Api/Misc/MyArea',
          callback(data) {
            me.dataIn.areaList = data;
          }
        })
      },
      IMIptFocus() {
        this.intelligentMatch.isShow = true;
      },
      IMIptInput() {
        this.dataOut.search.CustomerId = '';
      },
      selectedThisCustomerId(item) {
        this.dataOut.search.CustomerId = item.Id;
        this.intelligentMatch.customerName = item.Name;
        this.intelligentMatch.isShow = false;
      },
      //根据区域切换客户
      area_Change() {
        let me = this;
        me.intelligentMatch.isShow = false;
        me.intelligentMatch.customerName = '';
        me.dataOut.search.CustomerId = '';
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
      setTimeout(() => {
        this.getArea();
        this.getCustomerList();
        this.getGoodsList();
      })
    }
}
</script>
