<template>
  <div style="display:inline-block">
    <span class="select-box" @click="selectOrder()">
      <input type="text" :title="editInfo.ReceivingCode" placeholder="选择入库单" readonly v-model="editInfo.ReceivingCode">
      <i class="icon" title="点击选择入库单编号"></i>
    </span>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>选择入库单</h2>
        <div class="body">
          <div class="content" style="width:1000px">
            <div class="filter">
              <span>时间段
                <span class="date-field ml5">
                  <input type="text" v-model="dataOut.search.StartDate" readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'endDate\')}'})">
                  <i class="fa fa-calendar icon"></i>
                </span>
              <span> - </span>
              <span class="date-field">
                  <input type="text" v-model="dataOut.search.EndDate" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({minDate: '#F{$dp.$D(\'startDate\')}',maxDate:'%y-%M-%d'})">
                  <i class="fa fa-calendar icon"></i>
                </span>
              </span>
              <span class="ml20">单号
                <input type="text" placeholder="输入单号" class="com-ipt ml5" v-model="dataOut.search.Code">
              </span>
              <button class="btn btn-primary ml10" @click="initPageData()">搜索</button>
            </div>
            <div class="ovh-x" :style="{maxHeight:computedListHeight}">
              <table class="table text-center table-hover table-odd table-bordered  datalist">
                <thead>
                  <tr>
                    <th style="width:32px;">
                      <i :class="{'icon-triangle-left':!isItemClick}"></i>
                    </th>
                    <th>入库单号</th>
                    <th>单据日期</th>
                    <th>供应商</th>
                    <th>经手人</th>
                    <th>收货仓库</th>
                    <th>金额</th>
                    <th>已开金额</th>
                    <th>制单人</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item of dataIn.dataTable" @click="getOrderDetail(item)">
                    <td>
                      <i class="on am-blink" :class="{'icon-triangle-left':item.On}"></i>
                    </td>
                    <td :class="{'text-bold':item.On,'td-danger':item.On}">
                      <i class="fr icon-square-down ml10 mr10" :class="{on:item.On}"></i> {{item.Code}}
                    </td>
                    <td :class="{'text-bold':item.On,'td-danger':item.On}">
                      {{item.DateAdded}}
                    </td>
                    <td :class="{'text-bold':item.On,'td-danger':item.On}">
                      {{item.SupplierName}}
                    </td>
                    <td class="text-nowrap" :class="{'text-bold':item.On,'td-danger':item.On}">
                      {{item.HandlerName}}
                    </td>
                    <td :class="{'text-bold':item.On,'td-danger':item.On}">
                      {{item.StoreName}}
                    </td>
                    <td class="text-nowrap text-right" :class="{'text-bold':item.On,'td-danger':item.On}">
                      {{item.TotalPrice|currency}}
                    </td>
                    <td class="text-nowrap text-right" :class="{'text-bold':item.On,'td-danger':item.On}">
                      {{item.ReceiptAmount|currency}}
                    </td>
                    <td :class="{'text-bold':item.On,'td-danger':item.On}">
                      {{item.UserNameAdded}}
                    </td>
                  </tr>
                </tbody>
                <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
                  <tr>
                    <td colspan=9>
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
                  <b>
                    <span class="font-small">入库单号：{{objCurItem.Code}}</span>
                  </b>
                </div>
                <table class="table bg-white text-center border-box">
                  <thead>
                    <tr style="border-bottom:1px solid #eaeaea;">
                      <td class="bg-muted" style="width:60px">序号</td>
                      <td class="bg-muted" style="width:110px">商品编码</td>
                      <td class="bg-muted">商品名称</td>
                      <td class="bg-muted" style="width:100px;">颜色</td>
                      <td class="bg-muted" style="width:110px;">入库数量</td>
                      <td class="bg-muted" style="width:160px">品牌</td>
                      <td class="bg-muted" style="width:110px;">已开票金额</td>
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
                      <td class="text-nowrap text-left">
                        {{item.ProName}}
                      </td>
                      <td class="text-nowrap">
                        {{item.Color}}
                      </td>
                      <td class="text-nowrap">
                        {{item.ProCount}}
                      </td>
                      <td class="text-nowrap">
                        {{item.Brand}}
                      </td>
                      <td class="text-nowrap text-right">
                        {{item.ReceiptMoney|currency}}
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
    }
  },
  data() {
    return {
      show: false,
      pageindex: 1,
      curCode: '',
      curStoreId: '',
      arrChkCode: [],
      isItemClick: false,
      isClicking: false,
      curItem: {},
      objCurItem: {},
      APILIST: {
        LIST: 'api/Receiving/List',
        PREVIEW: '/API/Receiving/Preview', //预览
      },
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
      para.Status = '3';
      para.ReceiptStatus = '0,1';
      fetchData({
        API: this.APILIST.LIST,
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
        return;
      }
      if (this.isClicking) {
        return false;
      }
      this.isClicking = true;
      fetchData({
        API: this.APILIST.PREVIEW,
        para: {
          code: item.Code,
        },
        callback: data => {
          data.Details = data.Details.filter(item => {
            return item.ProPrice * 100 * item.ProCount != item.ReceiptMoney * 100;
          })
          item.Preview = data;
          this.objCurItem = item.Preview;
          item.Details = data.Details;
          for (var i = 0; i < data.Details.length; i++) {
            for (var j = 0; j < item.Details.length; j++) {
              if (data.Details[i].ProId == item.Details[j].ProId) {
                var mon = data.Details[i].ReceiptMoney;
                item.Details[j].ReceiptedMoney = mon;
              }
            }
          }
          item.Status = 1;
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
      delete this.curItem.ChkUserName;
      delete this.curItem.ChkDateTime;
      let objTemp = Object.assign({}, this.curItem);
      objTemp.ReceivingCode = objTemp.Code;
      delete objTemp.Code;
      delete objTemp.Preview;
      this.editInfo = objTemp;
      this.show = false;
    },
  },
  ready() {
    this.dataOut.search.StartDate = zmm_date.getTheDay({
      x: parseInt(window.localStorage.DISSTARTDATE) || -7
    });
    this.dataOut.search.EndDate = zmm_date.getTheDay({
      x: parseInt(window.localStorage.DISENDDATE) || 0
    });
    // this.initPageData(1);
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