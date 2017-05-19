<template>
  <div class="main">
    <h2 class="content-title">流程审批</h2>
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
        <span class="ml20">
        <span class="mr5">状态</span>
        <select v-model="dataOut.search.Status">
          <option value="">请选择</option>
          <option value="0">未审核</option>
          <option value="1">已审核</option>
        </select>
        </span>
        <span class="ml20">
        <span class="mr5">单据类型</span>
        <select v-model="dataOut.search.FlowType">
          <option value="">请选择</option>
          <option :value="key" v-for="(key,value) in computedFlowType">{{value}}</option>
        </select>
        </span>
        <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table text-center table-hover table-odd table-bordered datalist">
        <thead>
          <tr>
            <th>单据类型</th>
            <th>申请人</th>
            <th>申请时间</th>
            <th>状态</th>
            <th>审批时间</th>
            <th>是否同意</th>
            <th>审核意见</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of dataIn.dataTable">
            <td>
              {{item.FlowType|flowType}}
            </td>
            <td>
              {{item.BillUserNameAdded}}
            </td>
            <td>
              <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
            </td>
            <td>
              {{item.Status==0?"未审核":"已审核"}}
            </td>
            <td>
              <span v-if="item.Status!=0" class="text-nowrap">
                {{item.OpinionDate|datetime}}
              </span>
              <span v-else>/</span>
            </td>
            <td>
              <p v-if="item.Status!=0">
                {{item.OpinionResult|yesOrNo}}
              </p>
              <span v-else>/</span>
            </td>
            <td>
              {{item.OpinionDesc}}
            </td>
            <td>
              <div class="action">
                <a :title="item.FlowType|flowType" v-if="item.FlowType==21" v-link="{ name: 'salesOrderCheck', params:{soccode:item.BillCode}}" class="item">查看单据</a>
                <a :title="item.FlowType|flowType" v-if="item.FlowType==11" v-link="{ name: 'purchaseReturnCheck', params:{precCode:item.BillCode}}" class="item">查看单据</a>
                <a :title="item.FlowType|flowType" v-if="item.FlowType==1" v-link="{ name: 'purchaseOrderCheck', params:{pocode:item.BillCode}}" class="item">查看单据</a>
                <a :title="item.FlowType|flowType" v-if="item.FlowType==31" v-link="{ name: 'salesReturnOrderCheck', params:{srocCode:item.BillCode}}" class="item">查看单据</a>
                <a :title="item.FlowType|flowType" v-if="item.FlowType==41" v-link="{ name: 'dispatchOrderCheck', params:{doCode:item.BillCode}}" class="item">查看单据</a>
                <a :title="item.FlowType|flowType" v-if="item.FlowType==61" v-link="{ name: 'transferOrderCheck', params:{tocCode:item.BillCode}}" class="item">查看单据</a>
                <a :title="item.FlowType|flowType" v-if="item.FlowType==71" v-link="{ name: 'borrowOrderCheck', params:{cbocCode:item.BillCode}}" class="item">查看单据</a>
                <a href="javascript:;" v-if="item.AllowChk==1" @click="audit_Click(item)" class="item">审批</a>
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
    <audit-flow :show.sync="isShowAuditFlow" :cur-item="curItem" @on-after-audit="dispatchAudit"></audit-flow>
  </div>
</template>
<script>
import auditFlow from './popup/popupAuditFlow.vue';
export default {
  data() {
      return {
        isShowAuditFlow: false,
        API: {
          list: '/Api/User/AuditingFlowList'
        },
        pageindex: 1,
        curItem: {},
        dataIn: {
          inited: false,
          dataTable: {}
        },
        dataOut: {
          search: {
            StartDate: '',
            EndDate: '',
            FlowType: '',
            Status: ''
          }
        },
      }
    },
    components: {
      auditFlow
    },
    computed: {
      computedFlowType() {
        return dictionary['flowType'];
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
          API: this.API.list,
          para,
          callback(data) {
            // console.log(data);
            me.dataIn.inited = true;
            me.dataIn.dataTable = data.Data;
            initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
          }
        })
      },
      //审批弹出
      audit_Click(item) {
        this.curItem = item;
        this.isShowAuditFlow = true;
      },
      dispatchAudit() {
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
    }
}
</script>
