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
        <span class="mr5">状态</span>
      <select v-model="dataOut.search.Status">
        <option value="">请选择</option>
        <option :value="key" v-for="(key,value) in computedReceiptStatus">
          {{value}}
        </option>
      </select>
      </span>
      <span class="ml20">
          <span class="mr5">客户</span>
      <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.CustomerName" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <table class="table text-center table-bordered datalist">
      <thead>
        <tr>
          <th class="td-warning-pure" rowspan="2">销售单号</th>
          <th class="td-warning-pure" rowspan="2">销售金额（元）</th>
          <th class="td-warning-pure" rowspan="2">客户</th>
          <th class="td-warning-pure" rowspan="2">单据时间</th>
          <th class="td-warning-pure" colspan="5">发票项</th>
          <th class="td-warning-pure" rowspan="2" style="width:100px;">状态</th>
          <th class="td-warning-pure" rowspan="2" style="width:100px;">管理</th>
        </tr>
        <tr>
          <th class="td-warning-pure" style="width:150px;">票号</th>
          <th class="td-warning-pure" style="width:150px;">金额（元）</th>
          <th class="td-warning-pure" style="width:150px;">日期</th>
          <th class="td-warning-pure" style="width:150px;">备注</th>
          <th class="td-warning-pure" style="width:50px;">操作</th>
        </tr>
      </thead>
      <tfoot v-show="dataIn.inited&&dataIn.dataTable.length>0">
        <tr class="table-bg-default">
          <td colspan="4" class="text-right ">
            <b>
              当前页发票金额合计：
            </b>
          </td>
          <td colspan="7" class="text-left">
            <p class="p5">
              <b class="ml30">
                    应开：{{dataIn.objTotal.Total}}
                  </b>
              <b class="ml30">
                    已开：{{dataIn.objTotal.TotalPaid}}
                  </b>
              <b class="ml30">
                    未开：{{dataIn.objTotal.TotalNoPaid}}
                  </b>
            </p>
          </td>
        </tr>
      </tfoot>
      <tbody>
        <template v-for="item of dataIn.dataTable">
          <tr>
            <td :rowspan="item.Receipts.length+1">
              <p class="text-nowrap">{{item.BillCode}}</p>
            </td>
            <td :rowspan="item.Receipts.length+1">
              <p class="text-nowrap">{{item.TotalPrice|currency}}</p>
            </td>
            <td :rowspan="item.Receipts.length+1">
              {{item.CustomerName}}
            </td>
            <td :rowspan="item.Receipts.length+1">
              {{item.BillDate|datetime}}
            </td>
            <template v-if="item.Receipts.length>0">
              <td class="text-nowrap" v-if="item.Receipts.length">
                {{item.Receipts[0].ReceiptNum}}
              </td>
              <td class="text-nowrap" v-if="item.Receipts.length">
                {{item.Receipts[0].Amount}}
              </td>
              <td class="text-nowrap" v-if="item.Receipts.length">
                {{item.Receipts[0].DateAdded|datetime}}
              </td>
              <td>
                {{item.Receipts[0].Description}}
              </td>
              <td>
                <a href="javascript:;" @click="delReceipt(item.Receipts[0])">
                  <i class="icon icon-del" title="删除"></i>
                </a>
              </td>
            </template>
            <td colspan="5" style="padding:5px;" v-if="item.Receipts.length==0">
              <p class="text-left col-statistics p5 text-nowrap">
                <b class="ml30">
                    应开：{{item.TotalPrice}}
                  </b>
                <b class="ml30">
                    已开：{{item.PaidAmount}}
                  </b>
                <b class="ml30">
                    未开：<span class="text-warning">{{item.NoPaidAmount}}</span>
                  </b>
              </p>
            </td>
            <td :rowspan="item.Receipts.length+1">
              <span v-if="1==item.Status">
              {{item.Status|receiptStatus}}
              </span>
              <span v-else>
                <i class="icon icon-ok-circle" title="已开票" v-if="2==item.Status"></i>
                <i class="icon icon-error-circle" title="未开票"  v-else></i>
              </span>
            </td>
            <td :rowspan="item.Receipts.length+1">
              <span v-if="item.Status==2">/</span>
              <div class="action" v-else>
                <a href="javascript:;" class="item" @click="operateInvoice(item)">开票</a>
              </div>
            </td>
          </tr>
          <template v-if="item.Receipts.length>0">
            <tr v-for="item2 in item.Receipts.slice(1)">
              <td class="text-nowrap" v-if="item.Receipts.length">
                {{item2.ReceiptNum}}
              </td>
              <td class="text-nowrap" v-if="item.Receipts.length">
                {{item2.Amount}}
              </td>
              <td class="text-nowrap" v-if="item.Receipts.length">
                {{item2.DateAdded|datetime}}
              </td>
              <td>
                {{item2.Description}}
              </td>
              <td>
                <a href="javascript:;" @click="delReceipt(item2)">
                  <i class="icon icon-del" title="删除"></i>
                </a>
              </td>
            </tr>
            <tr>
              <td colspan="5" style="padding:5px;">
                <p class="text-left col-statistics p5 text-nowrap">
                  <b class="ml30">
                    应开：{{item.TotalPrice}}
                  </b>
                  <b class="ml30">
                    已开：{{item.PaidAmount}}
                  </b>
                  <b class="ml30">
                    未开：<span class="text-warning">{{item.NoPaidAmount}}</span>
                  </b>
                </p>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
      <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
        <tr>
          <td colspan=11>
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
    <operate-invoice :show.sync="isShowOperateInvoice" :obj-cur-order="objCurOrder" @on-after-submit="dispatchSubmit()"></operate-invoice>
  </div>
</template>
<script>
import operateInvoice from './../popup/operateInvoice.vue';
export default {
  props: {
    refresh: false
  },
  data() {
    return {
      pageindex: 1,
      isShowOperateInvoice: false,
      objCurOrder: {},
      APILIST: {
        LIST: '/Api/Finance/CustomerReceiptList',
      },
      dataIn: {
        inited: false,
        dataTable: [],
        objTotal: ''
      },
      dataOut: {
        search: {
          StartDate: '',
          EndDate: '',
          CustomerName: '',
          Status: ''
        }
      }
    }
  },
  components: {
    operateInvoice
  },
  computed: {
    computedReceiptStatus() {
      return dictionary['receiptStatus'];
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
          me.dataIn.inited = true;
          me.dataIn.dataTable = data.Data;
          me.dataIn.objTotal = data.Total;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
        }
      })
    },
    delReceipt(rp) {
      let me = this;
      dialog({
        title: '删除票据',
        width: 200,
        content: `删除票据：<span class="text-warning">${rp.ReceiptNum}</span>，请确认`,
        ok() {
          fetchData({
            API: '/Api/Finance/CustomerReceiptHistoryDelete',
            para: {
              Id: rp.Id
            },
            callback() {
              me.initPageData(me.pageindex);
            }
          })
        },
        cancel() {}
      }).showModal();
    },
    operateInvoice(item) {
      this.isShowOperateInvoice = true;
      this.objCurOrder = item;
    },
    dispatchSubmit() {
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
