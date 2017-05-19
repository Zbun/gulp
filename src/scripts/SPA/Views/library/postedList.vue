<template>
  <div class="main">
    <h2 class="content-title">发货</h2>
    <div class="content-field">
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
        <span class="ml10">
        <span class="mr5">物流单号</span>
        <input type="search" class="com-ipt" placeholder="输入单号" v-model="dataOut.search.ExpressNum" @keydown.enter="initPageData(1)" maxlength="50">
        </span>
        <span class="ml10">
        <span class="mr5">物流公司</span>
        <input type="search" class="com-ipt" placeholder="输入物流公司名" v-model="dataOut.search.ExpressName" @keydown.enter="initPageData(1)" maxlength="50">
        </span>
        <span class="ml10">
        <span class="mr5">打印状态</span>
        <select v-model="dataOut.search.IsPrint">
          <option value="">请选择</option>
          <option value="0">未打印</option>
          <option value="1">已打印</option>
        </select>
        </span>
        <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table text-center table-hover table-odd table-bordered datalist chks">
        <thead>
          <tr>
            <th style="width:170px">出库单号</th>
            <th>客户</th>
            <th style="width:170px">物流单号</th>
            <th style="width:150px">物流公司</th>
            <th style="width:170px">发货时间</th>
            <th style="width:170px">发货仓库</th>
            <th style="width:150px">打印状态</th>
            <th style="width:150px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of dataIn.dataTable">
            <td>
              <p class="text-nowrap"><a v-link="{ name: 'libOutOrderCheck', params:{ loocOrder: item.InvoiceCode}}" class="item highlight">{{item.InvoiceCode}}</a></p>
            </td>
            <td>
              {{item.CustomerName}}
            </td>
            <td>
              <p class="text-nowrap">{{item.ExpressNum}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.ExpressName}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.StoreName}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.PrintCount|printStatus}}</p>
            </td>
            <td>
              <div class="action">
                <a href="javascript:;" @click="express_Click(item)" class="item">物流改单</a>
              </div>
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
    </div>
    <popup-express :show.sync="isShowExpress" :code="curCode" :express-list="dataIn.expressList" title="物流改单" @on-submit-click="dispatchExpress()"></popup-express>
  </div>
</template>
<script>
import popupExpress from './../sales/popup/popupExpress.vue';
export default {
  data() {
      return {
        APILIST: {
          LIST: '/API/Invoice/ExpressEdList'
        },
        isShowExpress: false,
        pageindex: 1,
        curCode: '',
        chkCode: [],
        dataIn: {
          inited: false,
          dataTable: {},
          expressList: [],
          arrCustomerList: []
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
            IsPrint: '',
            CustomerId: '',
          }
        }
      }
    },
    components: {
      popupExpress
    },
    computed: {
      //智能感知匹配客户名
      computedFilterCustomerInfo() {
        let me = this;
        let newArea = this.dataIn.arrCustomerList;
        if (validatorManu.isEmpty(this.intelligentMatch.customerName)) {
          return newArea;
        } else {
          return newArea.filter((item) => {
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
      //获取客户列表,，关联智能感知
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
            me.dataIn.arrCustomerList = data.Data;
          }
        })
      },
      //智能感知部分
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
      // 发货弹窗
      express_Click(item) {
        this.curCode = item.InvoiceCode;
        if (!this.dataIn.expressList.length) {
          var me = this;
          fetchData({
            API: '/Api/Misc/CompanyExpressList',
            callback(data) {
              // console.log(data);
              me.dataIn.expressList = data;
              me.isShowExpress = true;
            }
          })
        } else {
          this.isShowExpress = true;
        }
      },
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
