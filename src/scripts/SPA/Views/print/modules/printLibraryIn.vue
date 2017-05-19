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
          <span class="mr5">入库单号</span>
      <input type="search" class="com-ipt width" placeholder="输入单号" v-model="dataOut.search.Code" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      <span class="ml20">
          <span class="mr5">供应商</span>
      <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.SupplierName" @keydown.enter="initPageData(1)" maxlength="50">
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
          <th>入库单号</th>
          <th>供应商</th>
          <th>入库机构</th>
          <th>入库仓库</th>
          <th>入库时间</th>
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
            <a v-link="{ name: 'libraryInOrderCheck', params:{ lioCode: item.Code}}" class="highlight">{{item.Code}}</a>
          </td>
          <td>
            {{item.SupplierName}}
          </td>
          <td>
            {{item.BranchName}}
          </td>
          <td>
            {{item.StoreName}}
          </td>
          <td class="text-nowrap">
            {{item.DateAdded|datetime}}
          </td>
          <td>
            {{item.Status|purchaseOrderStatus}}
          </td>
          <td>
            {{item.PrintCount|printStatus}}
          </td>
          <td>
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
    <div class="text-center">
      <div class="pageBox"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        isShowScanSn: false,
        pageindex: 1,
        curCode: '',
        chkCode: [],
        dataIn: {
          inited: false,
          dataTable: {}
        },
        dataOut: {
          search: {
            StartDate: '',
            EndDate: '',
            Code: '',
          }
        }
      }
    },
    methods: {
      initPageData(pageindex = 1, initChks = false) {
        this.pageindex = pageindex;
        var me = this;
        var para = this.dataOut.search;
        para.PageIndex = pageindex;
        para.PageSize = 15;
        this.chkCode = [];
        fetchData({
          API: '/Api/Receiving/List',
          para,
          callback(data) {
            // console.log(data);
            me.dataIn.inited = true;
            me.dataIn.dataTable = data.Data;
            initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
          }
        })
      }, //打印
      print_Click() {
        let me = this;
        if (this.chkCode.length == 0) {
          showTips('请先勾选需要打印的订单', 'error');
          return;
        }
        fetchData({
          API: '/api/Receiving/Print',
          para: {
            codes: this.chkCode
          },
          callback(data) {
            try {
              var LODOP = getLodop();
              if (LODOP) {
                LODOP.PRINT_INIT("打印入库单");
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
              }
            } catch (e) {
              console.log(e);
            }
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
