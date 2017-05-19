<template>
  <div>
    <div class="search clearfix mt20">
      <button class="btn-default btn fr" @click="sendMessage()">批量短信</button>
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
          <span class="mr5">业务员</span>
      <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.RealName" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      <span class="ml20">
          <span class="mr5">所属机构</span>
      <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.BranchName" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <table class="table text-center table-bordered datalist">
      <thead>
        <tr>
          <th>
            <label class="checkbox">
              <input type="checkbox" :checked="dataIn.dataTable.length>0&&arrSelectedId.length==dataIn.dataTable.length" @change="all_Change($event)"><span class="icon"></span></label>
          </th>
          <th>业务员</th>
          <th>电话</th>
          <th>推荐码</th>
          <th>添加时间</th>
          <th>所属机构</th>
          <th>关联客户</th>
          <th>平台管理</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="item of dataIn.dataTable">
          <tr :class="{'bg-muted':item.isOdd}">
            <td :rowspan="item.Details.length||1">
              <label class="checkbox">
                <input type="checkbox" :value="item.Id" v-model="arrSelectedId"><span class="icon"></span></label>
            </td>
            <td :rowspan="item.Details.length||1">
              <p class="text-nowrap">{{item.RealName}}</p>
            </td>
            <td :rowspan="item.Details.length||1">
              {{item.Phone}}
            </td>
            <td :rowspan="item.Details.length||1">
              {{item.RecommendCode}}
            </td>
            <td :rowspan="item.Details.length||1">
              <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
            </td>
            <td>
              {{item.Details[0].BranchName}}
            </td>
            <td>
              <a href="javascript:;" @click="checkCustomers(item)" class="highlight">{{item.Details[0].Customers.length}}</a>
            </td>
            </p>
            <td :rowspan="item.Details.length||1">
              <div class="action">
                <a href="javascript:;" class="item" @click="sendMessage(0,item.Id)">发短信</a>
                <a v-link="{ name: 'businessmanEdit', params:{ bmId: item.Id}}" class="item">修改</a>
                <a href="javascript:;" class="item" @click="del_Click(item)">删除</a>
              </div>
            </td>
          </tr>
          <tr v-for="item2 in item.Details.slice(1)" :class="{'bg-muted':item.isOdd}">
            <td>
              {{item2.BranchName}}
            </td>
            <td>
              <a href="javascript:;" @click="checkCustomers(item)" class="highlight">{{item2.Customers.length}}</a>
            </td>
          </tr>
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
    <customer-list :show.sync="isShowCustomerList" :obj-data="objCurBusinessman"></customer-list>
    <send-message :show.sync="isShowSendMessage" :arr-customer="computedArrSelectedCustomer" @send-ok="dispatchSendOk()"></send-message>
  </div>
</template>
<script>
import customerList from './../popup/businessmanCustomers.vue';
import sendMessage from './../popup/sendMessage.vue';
export default {
  props: {
    refresh: false
  },
  data() {
    return {
      pageindex: 1,
      isShowCustomerList: false,
      isShowSendMessage: false,
      arrSelectedId: [],
      objCurBusinessman: {},
      APILIST: {
        LIST: '/Api/Branch/SalesmanList',
        DELETE: '/Api/Branch/SalesmanDelete'
      },
      dataIn: {
        inited: false,
        dataTable: {},
      },
      dataOut: {
        search: {
          StartDate: '',
          EndDate: '',
          BranchName: '',
          RealName: ''
        }
      }
    }
  },
  components: {
    customerList,
    sendMessage
  },
  computed: {
    computedArrSelectedCustomer() {
      let arrTemp = [];
      let me = this;
      this.arrSelectedId.forEach(item => {
        arrTemp.push(_.find(me.dataIn.dataTable, {
          Id: item
        }))

      });
      return arrTemp;
    }
  },
  methods: {
    initPageData(pageindex = 1) {
      this.pageIndex = pageindex;
      var me = this;
      var para = this.dataOut.search;
      para.PageIndex = pageindex;
      para.PageSize = 15;
      fetchData({
        API: this.APILIST.LIST,
        para,
        callback(data) {
          // console.log(data);
          if (pageindex > 1 && data.Data.length == 0) {
            me.initPageData(--me.pageIndex);
          }
          me.dataIn.inited = true;
          data.Data.forEach((item, i) => {
            item.isOdd = i % 2 == 1;
          });
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
        }
      })
    },
    all_Change(e) {

      if (e.target.checked) {
        let arrTemp = [];
        this.dataIn.dataTable.forEach(item => {
          arrTemp.push(item.Id);
        });
        this.arrSelectedId = arrTemp;
      } else {
        this.arrSelectedId = [];
      }
    },
    sendMessage(isBatch, id) {
      if (isBatch == 0) {
        this.arrSelectedId = [id];
      }
      if (0 == this.arrSelectedId.length) {
        showTips('请先选择业务员', 'error');
        return;
      } else {
        this.isShowSendMessage = true;
      }
    },
    dispatchSendOk() {
      this.arrSelectedId = [];
    },
    //弹窗查看客户
    checkCustomers(item) {
      this.isShowCustomerList = true;
      this.objCurBusinessman = item;
    },
    //删除客户
    del_Click(item) {
      let me = this;
      dialog({
        title: '删除业务员',
        width: 200,
        content: `确认删除业务员：<span class="text-warning">${item.RealName}</span> 吗？`,
        ok() {
          fetchData({
            API: me.APILIST.DELETE,
            para: {
              id: item.Id
            },
            callback() {
              me.initPageData(me.pageIndex);
              // me.dataIn.dataTable.$remove(item);
              // me.initPageData(me.pageindex);
            }
          })
        },
        cancel() {}
      }).showModal();
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
  },
  watch: {
    refresh(newVal) {
      if (newVal) {
        this.initPageData(1);
      }
    }
  }
}
</script>
