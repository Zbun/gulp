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
          <span class="mr5">调拨单号</span>
      <input type="search" class="com-ipt width" placeholder="输入单号" v-model="dataOut.search.Code" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <div class="clearfix border-box bg-muted p20 mt20">
      <div class="fr">
        <button class="btn btn-warning" v-if="rightsApi.Out" :class="{'btn-disabled':arrChkCode.length!=1}" @click="scanSn_Click()">出库</button>
        <button class="btn btn-default" :class="{'btn-disabled':arrChkCode.length==0}" @click="action_print()" v-if="rightsApi.Print">打印</button>
      </div>
    </div>
    <table class="table text-center table-hover table-odd table-bordered mt-1">
      <thead>
        <tr>
          <th>
            <label class="checkbox">
              <input type="checkbox" @change="all_Change($event)" :checked="dataIn.dataTable.length&&dataIn.dataTable.length==arrChkCode.length"><span class="icon"></span></label>
          </th>
          <th>调拨单号</th>
          <th>调出机构</th>
          <th>调出仓</th>
          <th>调入机构</th>
          <th>调入仓</th>
          <th>制单人</th>
          <th>制单时间</th>
          <th>状态</th>
          <th>打印状态</th>
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
              <a v-link="{ name: 'dispatchOrderCheck', params:{ doCode: item.Code}}" class="highlight">{{item.Code}}</a></p>
          </td>
          <td>
            {{item.OutBranchName}}
          </td>
          <td>
            {{item.OutStoreName}}
          </td>
          <td>
            {{item.InBranchName}}
          </td>
          <td>
            {{item.InStoreName}}
          </td>
          <td>
            {{item.UserNameAdded}}
          </td>
          <td>
            <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
          </td>
          <td>
            <p class="text-nowrap">
              <span :class="'order-status-'+item.Status">{{item.Status|purchaseOrderStatus}}
            </span>
            </p>
          </td>
          <td>
            {{item.PrintCount|printStatus}}
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
    <div class="text-center">
      <div class="pageBox"></div>
    </div>
    <scan-sn :show.sync="isShowScanSn" pop-title="出库串号扫描" :code="curCode" @on-after-submit="dispatchScanSn()" :store-id="curStoreId" :api-list="computedScanSNAPILIST" auto-match="1"></scan-sn>
  </div>
</template>
<script>
import scanSn from 'vues/scanSN.vue';
export default {
  props: {
    isRefreshIn: false,
    rightsApi: {}
  },
  data() {
    return {
      isShowScanSn: false,
      APILIST: {
        LIST: '/Api/TransferContract/List'
      },
      pageindex: 1,
      curCode: '',
      curStoreId: '',
      arrChkCode: [],
      dataIn: {
        inited: false,
        dataTable: []
      },
      dataOut: {
        search: {
          StartDate: '',
          EndDate: '',
          Code: '',
          BillType: 0, //调拨出
          Status: 3, //未完成
        }
      },
    }
  },
  components: {
    scanSn,
  },
  computed: {
    computedScanSNAPILIST() {
      let obj = {};
      obj.Insert = this.rightsApi ? this.rightsApi.Out : '';
      return obj;
    }
  },

  methods: {
    initPageData(pageindex = 1) {
      this.pageindex = pageindex;
      var me = this;
      var para = this.dataOut.search;
      para.PageIndex = pageindex;
      this.arrChkCode = [];
      para.PageSize = 15;
      fetchData({
        API: this.APILIST.LIST,
        para,
        callback(data) {
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
    action_print() {
      let me = this;
      fetchData({
        API: this.rightsApi.Print,
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
    scanSn_Click(item) {
      this.curCode = this.arrChkCode[0];
      this.curStoreId = _.find(this.dataIn.dataTable, {
        Code: this.curCode
      }).OutStore;
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
