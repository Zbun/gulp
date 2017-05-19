<template>
  <div>
    <div class="search clearfix mt20">
      <button class="btn btn-default ml10 fr" @click="print_Click()">批量打印</button>
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
    <table class="table text-center table-hover table-odd table-bordered datalist chks">
      <thead>
        <tr>
          <th style="width:60px;">
            <label class="checkbox">
              <input type="checkbox" class="chk-all" @change="chkAll_Change($event)">
              <i class="icon"></i>
            </label>
          </th>
          <th>出库单号</th>
          <th>客户</th>
          <th>出库机构</th>
          <th>出库仓库</th>
          <th>出库时间</th>
          <th>状态</th>
          <th>打印状态</th>
          <th>操作人</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            <label class="checkbox">
              <input type="checkbox" class="chk" :value="item.Code" v-model="chkCode">
              <i class="icon"></i>
            </label>
          </td>
          <td>
            <p class="text-nowrap"><a v-link="{ name: 'libOutOrderCheck', params:{ loocOrder: item.Code}}" class="highlight">{{item.Code}}</a></p>
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
            <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
          </td>
          <td>
            <p class="text-nowrap"> {{item.Status|purchaseOrderStatus}}</p>
          </td>
          <td>
            <p class="text-nowrap">
              {{item.PrintCount|printStatus}}
            </p>
          </td>
          <td>
            <p class="text-nowrap">{{item.UserNameAdded}}</p>
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
    <div class="text-center">
      <div class="pageBox"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        APItableList: '/Api/Invoice/List',
        isShowExpress: false,
        P_ID: '',
        LODOP: '',
        pageindex: 1,
        curCode: '',
        chkCode: [],
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
    components: {},
    computed: {
      computedFilterCustomerInfo() {
        let me = this;
        if (validatorManu.isEmpty(this.intelligentMatch.customerName)) {
          return this.dataIn.customerList;
        } else {
          return this.dataIn.customerList.filter((item) => {
            return item.Name.indexOf(me.intelligentMatch.customerName.trim()) > -1;
          })
        }
      }
    },
    methods: {
      initPageData(pageindex = 1) {
        this.pageindex = pageindex;
        var me = this;
        this.chkCode = [];
        var para = this.dataOut.search;
        para.PageIndex = pageindex;
        para.PageSize = 15;
        fetchData({
          API: this.APItableList,
          para,
          callback(data) {
            // console.log(data);
            me.dataIn.inited = true;
            me.dataIn.dataTable = data.Data;
            initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
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
      },
      //打印
      print_Click() {
        let me = this;
        if (this.chkCode.length == 0) {
          showTips('请先勾选需要打印的订单', 'error');
          return;
        }
        fetchData({
          API: '/api/Invoice/Print',
          para: {
            codes: this.chkCode
          },
          callback(data) {
            try {
              var LODOP = getLodop();
              LODOP.PRINT_INIT("打印出库单");
              LODOP.SET_PRINT_STYLE("FontSize", 14);
              LODOP.SET_PRINT_STYLE("Bold", 1);
              // LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', true); //开启打印机状态捕获
              for (let i = 0; i < data.length; i++) {
                LODOP.NewPage();
                LODOP.ADD_PRINT_HTM(5, '5%', '90%', '130mm', data[i].PrintContent);
              }
              // LODOP.PREVIEW();
              if (LODOP.CVERSION) {
                LODOP.On_Return = function(taskID, Value) {
                  // P_ID = Value;
                  if (Value > 0) {
                    fetchData({
                      API: '/API/MISC/PrintCountUpdate',
                      para: {
                        Codes: me.chkCode
                      },
                      callback() {

                        me.initPageData(me.pageindex);
                      },
                      hideTips: true
                    })
                  } else {
                    alert('放弃打印');
                  }
                  // console.log(getStatusValue('PRINT_STATUS_OK', Value))
                };
                LODOP.PREVIEW();
              } else {
                // P_ID = me.LODOP.PRINTA();
                if (LODOP.PRINTA()) {
                  alert('直接加入打印队列');
                } else {
                  alert('直接放弃打印');
                }
              }
            } catch (e) {
              console.log(e);
            }

            // me.LODOP.PRINTA();
          }
        })
      },
      //全选按钮
      chkAll_Change(e) {
        let t = e.target;
        if (t.checked) {
          let arrTemp = [];
          this.dataIn.dataTable.forEach(item => {
            arrTemp.push(item.Code);
          });
          this.chkCode = arrTemp;
        } else {
          this.chkCode = [];
        }
      },
      //
      dispatchExpress() {
        this.initPageData(this.pageindex);
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
      this.getCustomerList();
    }
}
</script>
