<template>
  <div>
    <div class="search clearfix mt20">
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
        <span class="mr5">出库单号</span>
      <input type="search" class="com-ipt width" placeholder="输入单号" v-model="dataOut.search.Code" @keydown.enter="initPageData(1)" maxlength="50">
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
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <div class="clearfix border-box bg-muted p20 mt20">
      <div class="fr">
        <button class="btn btn-warning" v-if="rightsApi.Insert" :class="{'btn-disabled':arrChkCode.length!=1}" @click="scanSn_Click()">出库</button>
        <button class="btn btn-default" :class="{'btn-disabled':arrChkCode.length==0}" @click="action_print()" v-if="rightsApi.Print">打印</button>
      </div>
    </div>
    <table class="table text-center table-hover table-odd table-bordered mt-1 chks">
      <thead>
        <tr>
          <th>
            <label class="checkbox">
              <input type="checkbox" @change="all_Change($event)" :checked="dataIn.dataTable.length&&dataIn.dataTable.length==arrChkCode.length"><span class="icon"></span></label>
          </th>
          <th>销售单号</th>
          <th>客户</th>
          <th>出库机构</th>
          <th>出库仓库</th>
          <th>操作人</th>
          <th>操作时间</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            <label class="checkbox">
              <input type="checkbox" :value="item.Code" v-model="arrChkCode"><span class="icon"></span></label>
          </td>
          <td>
            <p class="text-nowrap">
              <a v-link="{ name: 'salesOrderCheck', params:{ soccode: item.Code}}" class="highlight">{{item.Code}}</a></p>
          </td>
          <td>
            {{item.CustomerName}}
          </td>
          <td>
            {{item.BranchName}}
          </td>
          <td>
            {{item.StoreName}}
          </td>
          <td>
            <p class="text-nowrap">{{item.UserNameAdded}}</p>
          </td>
          <td>
            <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
          </td>
          <td>
            <p class="text-nowrap"> {{item.Status|purchaseOrderStatus}}</p>
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
    <scan-sn :show.sync="isShowScanSn" pop-title="出库串号扫描" :code="curCode" @on-after-submit="dispatchScanSn()" auto-match="1" :receipt="objCurItem.Receipt" :store-id="objCurItem.StoreId" is-by-standard="1" :api-list="rightsApi"></scan-sn>
  </div>
</template>
<script>
import scanSn from 'vues/scanSN.vue';
export default {
  props: {
    customerList: [],
    isRefreshIn: false,
    rightsApi: {}
  },
  data() {
    return {
      isShowExpress: false,
      isShowScanSn: false,
      APILIST: {
        LIST: 'api/SalesContract/List'
      },
      pageindex: 1,
      curCode: '',
      objCurItem: {},
      arrChkCode: [],
      dataIn: {
        inited: false,
        dataTable: {},
        expressList: [],
        customerList: []
      },
      intelligentMatch: {
        isShow: false,
        customerName: ''
      },
      dataOut: {
        search: {
          StartDate: '',
          EndDate: '',
          Code: '',
          CustomerId: ''
        }
      }
    }
  },
  components: {
    scanSn
  },
  computed: {
    computedFilterCustomerInfo() {
      let me = this;
      if (validatorManu.isEmpty(this.intelligentMatch.customerName)) {
        return this.customerList;
      } else {
        return this.customerList.filter((item) => {
          return item.Name.toLowerCase().indexOf(me.intelligentMatch.customerName.toLowerCase().trim()) > -1;
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
      this.arrChkCode = [];
      para.Status = '3,16';
      fetchData({
        API: this.APILIST.LIST,
        para,
        callback(data) {
          // console.log(data);
          me.dataIn.inited = true;
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
        }
      })
    },
    all_Change(e) {
      let isChked = e.target.checked;
      if (isChked) {
        let arrTemp = [];
        this.dataIn.dataTable.forEach(item => {
          arrTemp.push(item.Code);
        });
        this.arrChkCode = arrTemp;
      } else {
        this.arrChkCode = [];
      }
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
    action_print() {
      let me = this;
      fetchData({
        API: 'API/PurchasingContract/Print',
        para: {
          codes: this.arrChkCode
        },
        callback(data) {
          try {
            var LODOP = getLodop();
            if (LODOP) {
              LODOP.PRINT_INIT("打印单据");
              LODOP.SET_PRINT_STYLE("FontSize", 14);
              LODOP.SET_PRINT_STYLE("Bold", 1);
              for (let i = 0; i < data.length; i++) {
                LODOP.NewPage();
                LODOP.ADD_PRINT_HTM(5, '5%', '90%', '130mm', data[i].PrintContent);
              }
              // LODOP.PREVIEW();
              if (LODOP.CVERSION) {
                LODOP.On_Return = function(taskID, Value) {
                  if (Value > 0) {
                    fetchData({
                      API: '/API/MISC/PrintCountUpdate',
                      para: {
                        Codes: me.arrChkCode
                      },
                      hideTips: true
                    })
                  } else {
                    alert('放弃打印');
                  }
                };
                LODOP.PREVIEW();
              } else {
                if (LODOP.PRINTA()) {
                  alert('直接加入打印队列');
                } else {
                  alert('直接放弃打印');
                }
              }
            }
          } catch (e) {
            console.log(e);
          }
        }
      })
    },
    scanSn_Click() {
      this.curCode = this.arrChkCode[0];
      this.objCurItem = _.find(this.dataIn.dataTable, {
        Code: this.curCode
      });
      this.isShowScanSn = true;
    },
    dispatchScanSn() {
      this.initPageData(this.pageindex);
      this.isRefreshIn = true;
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
  }
}
</script>
