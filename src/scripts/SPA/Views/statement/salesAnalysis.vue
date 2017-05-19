<template>
  <div class="main">
    <h2 class="content-title">出货汇总</h2>
    <div class="content-field">
      <div class="search clearfix mt20">
        <span class="radio-switcher">
          <label class="radio" :class="{on:dataOut.search.GroupBy==0}">
          <input type="radio" name="type" value=0 v-model="dataOut.search.GroupBy"><span class="icon"></span>按商品
        </label>
        <label class="radio" :class="{on:dataOut.search.GroupBy==1}">
          <input type="radio" name="type" value=1 v-model="dataOut.search.GroupBy"><span class="icon"></span>按客户</label>
        </span>
        <button class="btn btn-default fr" @click="export_Click()">导出</button>
        <span class="mr5 ml10">时间段</span>
        <span class="date-field">
            <input type="text" v-model="dataOut.search.StartDate"  readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'endDate\')}'})">
            <i class="fa fa-calendar icon"></i>
          </span>
        <span> - </span>
        <span class="date-field">
            <input type="text" v-model="dataOut.search.EndDate" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({minDate: '#F{$dp.$D(\'startDate\')}'})">
            <i class="fa fa-calendar icon"></i>
         </span>
        <span class="ml10">
          <span class="mr5">区域</span>
        <select v-model="dataOut.search.Area" @change="area_Change()">
          <option value="">请选择</option>
          <option :value="item.Code" v-for="item in dataIn.areaList">{{item.Name}}</option>
        </select>
        </span>
        <span class="ml10">
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
      <div class="datalist">
        <div class="datalist1" v-if="0==dataOut.search.GroupBy">
          <table class="table text-center table-bordered">
            <thead>
              <tr>
                <th>商品名称</th>
                <th style="width:150px;">分类</th>
                <th style="width:110px;">小计价格</th>
                <th style="width:100px;">小计数量</th>
                <th style="width:150px;">客户</th>
                <th style="width:100px;">区域</th>
                <th style="width:100px;">价格</th>
                <th style="width:100px;">数量</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item of dataIn.dataTable">
                <tr>
                  <td :rowspan="item.Details.length||1">
                    <p :title="item.ProName">{{item.ProName}}</p>
                  </td>
                  <td :rowspan="item.Details.length||1">
                    <p class="text-nowrap" :title="item.CategoryName">{{item.CategoryName}}</p>
                  </td>
                  <td :rowspan="item.Details.length||1">
                    <p class="text-nowrap price-show">
                      {{item.ProPrice|money}}
                    </p>
                  </td>
                  <td :rowspan="item.Details.length||1">
                    <p class="text-nowrap">{{item.ProCount}}</p>
                  </td>
                  <td>
                    <p class="text-nowrap" :title="item.Details[0].CustomerName">{{item.Details[0].CustomerName}}</p>
                  </td>
                  <td>
                    <p class="text-nowrap" :title="item.Details[0].AreaName">{{item.Details[0].AreaName}}</p>
                  </td>
                  <td>
                    <p class="text-nowrap price-show">
                      {{item.Details[0].ProPrice|money}}
                    </p>
                  </td>
                  <td>
                    <p class="text-nowrap">{{item.Details[0].ProCount}}</p>
                  </td>
                </tr>
                <template v-for="(index2,item2) of item.Details">
                  <tr v-if="index2>0">
                    <td>
                      <p class="text-nowrap" :title="item2.CustomerName">{{item2.CustomerName}}</p>
                    </td>
                    <td>
                      <p class="text-nowrap" :title="item2.AreaName">{{item2.AreaName}}</p>
                    </td>
                    <td>
                      <p class="text-nowrap price-show">
                        {{item2.ProPrice|money}}
                      </p>
                    </td>
                    <td>
                      <p class="text-nowrap">{{item2.ProCount}}</p>
                    </td>
                  </tr>
                </template>
              </template>
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
        <div class="datalist2" v-else>
          <table class="table text-center  table-bordered">
            <thead>
              <tr>
                <th style="width:110px;">区域</th>
                <th style="width:130px;">客户</th>
                <th style="width:110px;">小计价格</th>
                <th style="width:100px;">小计数量</th>
                <th>商品名称</th>
                <th style="width:100px;">分类</th>
                <th style="width:100px;">价格</th>
                <th style="width:100px;">数量</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item of dataIn.dataTable2">
                <tr>
                  <td :rowspan="item.Details.length||1">
                    <p class="text-nowrap" :title="item.Details[0].AreaName">{{item.AreaName}}</p>
                  </td>
                  <td :rowspan="item.Details.length||1">
                    <p class="text-nowrap" :title="item.CustomerName">{{item.CustomerName}}</p>
                  </td>
                  <td :rowspan="item.Details.length||1">
                    <p class="text-nowrap price-show">
                      {{item.ProPrice|money}}
                    </p>
                  </td>
                  <td :rowspan="item.Details.length||1">
                    <p class="text-nowrap">{{item.ProCount}}</p>
                  </td>
                  <td>
                    <p :title="item.Details[0].ProName">{{item.Details[0].ProName}}</p>
                  </td>
                  <td>
                    <p class="text-nowrap" :title="item.Details[0].CategoryName">{{item.Details[0].CategoryName}}</p>
                  </td>
                  <td>
                    <p class="text-nowrap price-show">
                      {{item.Details[0].ProPrice|money}}
                    </p>
                  </td>
                  <td>
                    <p class="text-nowrap">{{item.Details[0].ProCount}}</p>
                  </td>
                </tr>
                <template v-for="(index2,item2) of item.Details">
                  <tr v-if="index2>0">
                    <td>
                      <p :title="item2.ProName">{{item2.ProName}}</p>
                    </td>
                    <td>
                      <p class="text-nowrap" :title="item2.CategoryName">
                        {{item2.CategoryName}}
                      </p>
                    </td>
                    <td>
                      <p class="text-nowrap price-show">
                        {{item2.ProPrice|money}}
                      </p>
                    </td>
                    <td>
                      <p class="text-nowrap">{{item2.ProCount}}</p>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
            <tbody v-if="dataIn.inited2&&!dataIn.dataTable2.length>0">
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
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        contentTitle: '',
        API: {
          list: '/Api/Report/StoreOutSum'
        },
        pageindex: 1,
        curCode: '',
        curStoreId: '',
        dataIn: {
          inited: false,
          inited2: false,
          dataTable: [],
          dataTable2: [],
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
        intelligentMatch: {
          isShow: false,
          customerName: ''
        },
        dataOut: {
          search: {
            GroupBy: 0,
            StartDate: '',
            EndDate: '',
            Code: '',
            BillType: '',
            CustomerId: '',
            ProName: '',
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
            me.intelligentMatch.isShowPro = false;
            if (me.dataOut.search.GroupBy == 0) {
              me.dataIn.inited = true;
              me.dataIn.dataTable = data.Data;
              initPage(me.$el.querySelector('.datalist1'), data.TotalPages, data.TotalRows, me.initPageData, pageindex);
            } else {
              me.dataIn.inited2 = true;
              me.dataIn.dataTable2 = data.Data;
              initPage(me.$el.querySelector('.datalist2'), data.TotalPages, data.TotalRows, me.initPageData, pageindex);
            }
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
        this.dataOut.search.CustomerId = '';
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
