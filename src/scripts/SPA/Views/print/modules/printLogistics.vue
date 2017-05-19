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
      <input type="search" class="com-ipt" placeholder="输入单号" v-model="dataOut.search.Code" @keydown.enter="initPageData(1)" maxlength="50">
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
      </select>
      </span>
      <!-- <input type="search" class="com-ipt" placeholder="输入客户名称" v-model="dataOut.search.CustomerName" @keydown.enter="initPageData(1)" maxlength="50"> -->
      </span>
      <span class="ml20 mr5">仓库</span>
      <select v-model="dataOut.search.StoreId">
        <option value=0>请选择</option>
        <option v-for="item of dataIn.arrStores" :value="item.Id">{{item.Name}}</option>
      </select>
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
          <th>发货机构</th>
          <th>发货仓库</th>
          <th>出库时间</th>
          <th>操作人</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            <label class="checkbox">
              <input type="checkbox" class="chk" :value="item.Code" v-model="arrChkCode">
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
            <p class="text-nowrap">{{item.UserNameAdded}}</p>
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
    <express-templates :arr-Chk-Code="arrChkCode" :show.sync="isShowExpressTemplates" :arr-express-templates="dataIn.arrExpressTemplates" @on-print-click="dispatchExpress()"></express-templates>
  </div>
</template>
<script>
import expressTemplates from './../popup/popupPrintLogistics.vue';
export default {
  data() {
      return {
        APItableList: '/Api/Invoice/ExpressList',
        isShowExpressTemplates: false,
        pageindex: 1,
        curCode: '',
        arrChkCode: [],
        dataIn: {
          inited: false,
          dataTable: {},
          arrExpressTemplates: [],
          arrStores: [],
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
            ExpressStatus: 0,
            StoreId: 0,
            CustomerId: ''
          }
        }
      }
    },
    components: {
      expressTemplates
    }, computed: {
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
        var para = this.dataOut.search;
        para.PageIndex = pageindex;
        para.PageSize = 15;
        this.arrChkCode = [];
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
      getStores() {
        let me = this;
        fetchData({
          API: '/Api/User/Store',
          para: {},
          callback(data) {
            // console.log(data);
            me.dataIn.arrStores = data;
          }
        });
      },
      //获取物流模板列表，打印前请求
      getExpressTempates() {
        let me = this;
        fetchData({
          API: '/Api/Misc/CompanyExpressTemplate',
          callback(data) {
            // console.log(data);
            me.dataIn.arrExpressTemplates = data;
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
        if (this.arrChkCode.length == 0) {
          showTips('请先勾选需要打印的订单', 'error');
          return;
        }
        if (0 == this.dataIn.arrExpressTemplates.length) {
          this.getExpressTempates();
        }
        this.isShowExpressTemplates = true;
      },
      //全选按钮
      chkAll_Change(e) {
        let t = e.target;
        if (t.checked) {
          let arrTemp = [];
          this.dataIn.dataTable.forEach(item => {
            arrTemp.push(item.Code);
          });
          this.arrChkCode = arrTemp;
        } else {
          this.arrChkCode = [];
        }
      },
      //
      dispatchExpress() {
        this.initPageData(this.pageindex);
        this.arrChkCode = [];
      }
    },
    ready() {
      this.dataOut.search.StartDate = zmm_date.getTheDay({
        x: parseInt(window.localStorage.DISSTARTDATE) || -7
      });
      this.dataOut.search.EndDate = zmm_date.getTheDay({
        x: parseInt(window.localStorage.DISENDDATE) || 0
      });
      this.getStores();
      this.initPageData(1);
      this.getCustomerList();
    }
}
</script>
