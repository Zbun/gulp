<template>
  <div style="display:inline-block">
    <span class="select-box" @click="selectOrder()">
          <input type="text" :title="1==isSupplier?editInfo.PurchasingContractCode:editInfo.SalesContractCode" :placeholder="'引用'+pageTitle+'单'" readonly :value="1==isSupplier?editInfo.PurchasingContractCode:editInfo.SalesContractCode">
    <i class="icon" title="点击选择订单编号"></i>
    </span>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{pageTitle}}单</h2>
        <div class="body">
          <div class="content" style="width:1100px">
            <div class="filter">
              <div class="fr">
                <button class="btn ben-default" @click="filterByDay('day')">今日单据</button>
                <button class="btn ben-default" @click="filterByDay('week')">最近一周</button>
                <button class="btn ben-default" @click="filterByDay('all')">全部</button>
              </div>
              <span>时间段
              <span class="date-field ml5">
                <input type="text" v-model="dataOut.search.StartDate"  readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'endDate\')}'})">
                <i class="fa fa-calendar icon"></i>
              </span>
              <span> - </span>
              <span class="date-field">
                <input type="text" v-model="dataOut.search.EndDate" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({minDate: '#F{$dp.$D(\'startDate\')}',maxDate:'%y-%M-%d'})">
                <i class="fa fa-calendar icon"></i>
              </span>
              </span>
              <span class="ml20">单号<input type="text" placeholder="输入单号" class="com-ipt ml5" v-model="dataOut.search.Code" @keydown.enter="initPageData"></span>
              <button class="btn btn-primary ml10" @click="initPageData()">搜索</button>
            </div>
            <div class="ovh-x" :style="{maxHeight:computedListHeight}">
              <table class="table text-center table-hover table-odd table-bordered  datalist">
                <thead>
                  <tr>
                    <th style="width:32px;">
                      <i :class="{'icon-triangle-left':!isItemClick}"></i>
                    </th>
                    <th>{{pageTitle}}订单号</th>
                    <th v-if="isSupplier==1">供应商</th>
                    <th v-else>客户</th>
                    <th>{{computedStrBranch}}货机构</th>
                    <th>{{computedStrBranch}}货仓库</th>
                    <th>经手人</th>
                    <th>结算方式</th>
                    <th>制单人</th>
                    <th>制单时间</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item of dataIn.dataTable" @click="getOrderDetail(item)">
                    <td>
                      <i class="on am-blink" :class="{'icon-triangle-left':item.On}"></i>
                    </td>
                    <td class="text-nowrap" :class="{'text-bold':item.On,'td-danger':item.On}">
                      <i class="fr icon-square-down ml10 mr10" :class="{on:item.On}"></i> {{item.Code}}
                    </td>
                    <td v-if="isSupplier==1" :class="{'text-bold':item.On,'td-danger':item.On}">
                      {{item.SupplierName}}
                    </td>
                    <td v-else :class="{'text-bold':item.On,'td-danger':item.On}">
                      {{item.CustomerName}}
                    </td>
                    <td :class="{'text-bold':item.On,'td-danger':item.On}">
                      {{item.BranchName}}
                    </td>
                    <td :class="{'text-bold':item.On,'td-danger':item.On}">
                      {{item.StoreName}}
                    </td>
                    <td class="text-nowrap" :class="{'text-bold':item.On,'td-danger':item.On}">
                      {{item.HandlerName}}
                    </td>
                    <td class="text-nowrap" :class="{'text-bold':item.On,'td-danger':item.On}">
                      {{item.PayType|payType}}
                    </td>
                    <td :class="{'text-bold':item.On,'td-danger':item.On}">
                      {{item.UserNameAdded}}
                    </td>
                    <td :class="{'text-bold':item.On,'td-danger':item.On}">
                      <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
                    </td>
                    <td :class="{'text-bold':item.On,'td-danger':item.On}">
                      <p class="text-nowrap"> {{item.Status|purchaseOrderStatus}}</p>
                    </td>
                  </tr>
                </tbody>
                <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
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
            </div>
            <div class="bg-muted border-box mt-1 p10 pb20 pl20 pr20 bg-body" v-show="isItemClick">
              <div class="ml10 mb10" style="max-width:80%">
                <div class="clearfix align-btn">
                  <b><span class="font-small">{{pageTitle}}单号：{{objCurItem.Code}}</span></b>
                </div>
                <table class="table bg-white text-center border-box">
                  <thead>
                    <tr style="border-bottom:1px solid #eaeaea;">
                      <td class="bg-muted" style="width:60px">序号</td>
                      <td class="bg-muted" style="width:110px">商品编码</td>
                      <td class="bg-muted">商品名称</td>
                      <td>颜色</td>
                      <td>品牌</td>
                      <td class="bg-muted">计划数</td>
                      <td class="bg-muted">实际数</td>
                      <td class="bg-muted">待执行数</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(index,item) in objCurItem.Details">
                      <td>
                        {{index+1}}
                      </td>
                      <td class="text-nowrap">
                        {{item.ProId}}
                      </td>
                      <td class="text-left">
                        {{item.ProName}}
                      </td>
                      <td class="text-nowrap">
                        {{item.Color}}
                      </td>
                      <td class="text-nowrap">
                        {{item.Brand}}
                      </td>
                      <td class="text-nowrap">
                        {{item.ProCount}}
                      </td>
                      <td class="text-nowrap">
                        {{item.ProCount1}}
                      </td>
                      <td class="text-nowrap">
                        {{item.ProCount-item.ProCount1}}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="text-center">
              <div class="pageBox"></div>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">确认</button>
          <button class="btn btn-default" @click="onCancel_Click(0)">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    editInfo: {
      twoway: true,
      default: Object
    },
    orderIn: {
      twoway: true,
      default: false
    },
    apiList: {}, //列表及预览接口
    pageTitle: '', //标题
    isSupplier: '', //是否是供应商
  },
  data() {
    return {
      show: false,
      isShowScanSn: false,
      pageindex: 1,
      curCode: '',
      curStoreId: '',
      arrChkCode: [],
      isItemClick: false,
      isClicking: false,
      curItem: {},
      objCurItem: {},
      dataIn: {
        inited: false,
        dataTable: {}
      },
      dataOut: {
        search: {
          StartDate: '',
          EndDate: '',
          Code: '',
          SupplierName: '',
          Status: '3,16'
        }
      },
    }
  },
  computed: {
    computedStrBranch() {
      return this.isSupplier == 1 ? '收' : '发';
    },
    computedListHeight() {
      let h = 'auto';
      if (this.isItemClick && this.dataIn.dataTable.length) {
        let wh = window.innerHeight < 680 ? 680 : window.innerHeight;
        h = wh - 420 + 'px';
      }
      return h;
    }
  },
  components: {},
  methods: {
    initPageData(pageindex = 1) {
      this.pageindex = pageindex;
      var me = this;
      var para = this.dataOut.search;
      para.PageIndex = pageindex;
      this.arrChkCode = [];
      para.PageSize = 15;
      fetchData({
        API: this.apiList.LIST,
        para,
        callback(data) {
          me.dataIn.inited = true;
          data.Data.forEach(item => {
            item.On = false;
          })
          me.isItemClick = false;
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
        }
      })
    },

    selectOrder() {
      this.show = true;
    },
    getOrderDetail(item) {
      this.isItemClick = true;
      this.dataIn.dataTable.forEach(item => {
        item.On = false;
      });
      item.On = true;
      if (item.Preview) {
        this.objCurItem = item.Preview;
        this.curItem = item;
        return;
      }
      if (this.isClicking) {
        return false;
      }
      this.isClicking = true;
      fetchData({
        API: this.apiList.PREVIEW,
        para: {
          code: item.Code,
        },
        callback: data => {
          data.Details.forEach(item => {
            item.ProCountCurIn = 0;
            item.ProCountNow = item.ProCount - item.ProCount1;
          })
          item.Preview = data;
          this.objCurItem = item.Preview;
          item.Details = data.Details;
          this.curItem = item;
          this.isClicking = false;
        },
        errorCallback: () => {
          this.isClicking = false;
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    },
    onSubmit_Click() {
      if (!this.curItem.Status) {
        showTips('请先点击选择单据', 'error');
        return;
      }

      let objTemp = Object.assign({}, this.curItem);
      objTemp.Details = objTemp.Details.filter(item => {
        return item.ProCount - item.ProCount1 > 0;
      })
      if (1 == this.isSupplier) {
        objTemp.PurchasingContractCode = objTemp.Code;
      } else {
        objTemp.SalesContractCode = objTemp.Code;
        objTemp.SalesOrderChkUserName = objTemp.ChkUserName;
      }
      objTemp.Status = 1;
      delete objTemp.ChkUserName;
      delete objTemp.ChkDateTime;
      delete objTemp.Code;
      delete objTemp.Preview;
      this.editInfo = objTemp;
      this.show = false;
      this.orderIn = true;
    },
    filterByDay(date) {
      switch (date) {
        case 'day':
          {
            this.dataOut.search.StartDate = zmm_date.getTheDay({
              x: 0
            });
            this.dataOut.search.EndDate = zmm_date.getTheDay({
              x: 0
            });
            break;
          }
        case 'week':
          {
            this.dataOut.search.StartDate = zmm_date.getTheDay({
              x: -7
            });
            this.dataOut.search.EndDate = zmm_date.getTheDay({
              x: 0
            });
            break;
          }
        case 'month':
          {
            this.dataOut.search.StartDate = zmm_date.getTheDay({
              x: -30
            });
            this.dataOut.search.EndDate = zmm_date.getTheDay({
              x: 0
            });
            break;
          }
        case 'all':
          {
            this.dataOut.search.StartDate = '';
            this.dataOut.search.EndDate = '';
            break;
          }
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
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.initPageData();
      }
    }
  }
}
</script>