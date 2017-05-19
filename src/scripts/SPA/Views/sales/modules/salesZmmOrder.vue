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
          <span class="mr5">订单号</span>
      <input type="search" class="com-ipt width" placeholder="输入单号" v-model="dataOut.search.SourceCode" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      <span class="ml20">
          <span class="mr5">状态</span>
      <select v-model="dataOut.search.Status">
        <option value="">请选择</option>
        <option value="0">未调度</option>
        <option value="3">已调度</option>
      </select>
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <div class="clearfix border-box bg-muted p20 mt20">
      <div class="fr">
        <button class="btn btn-warning" :class="{'btn-disabled':arrDetails.length==0}" v-if="rightsApi.Dispatch" @click="refuge_Click()">调度</button>
      </div>
    </div>
    <table class="table text-center table-hover table-odd table-bordered mt-1">
      <thead>
        <tr>
          <th>
            <label class="checkbox">
              <input type="checkbox" :checked="dataIn.dataTable.length>0&&arrDetails.length==dataIn.dataTable.length" @change="all_Change($event)"><span class="icon"></span></label>
          </th>
          <th>订单号</th>
          <th>客户</th>
          <th>同步时间</th>
          <th>制单人</th>
          <th>发票</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            <label class="checkbox">
              <input type="checkbox" :disabled="item.Status!=0" :value="item.SourceCode" v-model="arrDetails"><span class="icon"></span></label>
          </td>
          <td>
            <p class="text-nowrap">{{item.SourceCode}}</p>
          </td>
          <td>
            {{item.CustomerName}}
          </td>
          <td>
            <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
          </td>
          <td>
            {{item.UserNameAdded}}
          </td>
          <td>
            <i class="icon" :class="{'icon-error-circle':item.Receipt==0,'icon-ok-circle':item.Receipt==1}"></i>
          </td>
          <td>
            {{item.Status==0?'未':'已'}}调度
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
    <refuge-zmaster :show.sync="isShowRefugeZmaster" :arr-branch="dataIn.arrBranch" :details="arrDetails" @on-after-submit="dispatchRefuge()" :dispatch-api="rightsApi.Dispatch"></refuge-zmaster>
  </div>
</template>
<script>
import refugeZmaster from './../popup/refugeZmaster.vue';
export default {
  props: {
    loadedFirst: false,
    refresh: false,
    customerList: [],
    rightsApi: {}
  },
  data() {
    return {
      pageindex: 1,
      isShowRefugeZmaster: false,
      curPCode: '',
      ACTION: 2,
      arrDetails: [],
      dataIn: {
        inited: false,
        dataTable: {},
        storeList: [],
        customerList: [],
        arrBranch: []
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
          Status: '0',
          CustomerId: ''
        }
      }
    }
  },
  components: {
    refugeZmaster
  },
  computed: {
    computedFilterCustomerInfo() {
      let me = this;
      if (validatorManu.isEmpty(this.intelligentMatch.customerName)) {
        return this.customerList;
      } else {
        return this.customerList.filter((item) => {
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
      para.PageSize = 50;
      fetchData({
        API: '/Api/SalesContract/SourceOrderList',
        para,
        callback(data) {
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
    // 机构获取
    getBranch() {
      let me = this;
      fetchData({
        API: 'api/USER/STORE',
        para: {
          action: this.ACTION //限制只能销售
        },
        callback(data) {
          me.dataIn.arrBranch = data;
        }
      })
    },
    all_Change(e) {
      if (e.target.checked) {
        let arrTemp = [];
        this.dataIn.dataTable.forEach(item => {
          if (item.Status == 0) {

            arrTemp.push(item.SourceCode);
          }
        });
        this.arrDetails = arrTemp;
      } else {
        this.arrDetails = [];
      }
    },
    refuge_Click() {
      if (!this.arrDetails.length) {
        showTips('请先选择订单', 'error');
        return;
      }
      this.isShowRefugeZmaster = true;
    },
    dispatchRefuge() {
      this.arrDetails = [];
      this.refresh = false;
      setTimeout(() => {
        this.refresh = true;
      }, 5);
    }
  },
  ready() {
    this.dataOut.search.StartDate = zmm_date.getTheDay({
      x: parseInt(window.localStorage.DISSTARTDATE) || -7
    });
    this.dataOut.search.EndDate = zmm_date.getTheDay({
      x: parseInt(window.localStorage.DISENDDATE) || 0
    });
    setTimeout(() => {
      this.getBranch();
    }, 16);
  },
  watch: {
    refresh(newVal) {
      if (newVal) {
        this.initPageData(1);
      }
    },
    loadedFirst(newVal) {
      if (newVal) {
        this.initPageData(1);
      }
    }
  }
}
</script>
