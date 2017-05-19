<template>
  <div>
    <div class="search clearfix mt20">
      <span class="mr5">时间</span>
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
          <span class="mr5">调剂单号</span>
      <input type="search" class="com-ipt width" placeholder="输入单号" v-model="dataOut.search.Code" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      <span class="ml20">
        <span class="mr5">状态</span>
      <select v-model="dataOut.search.Status">
        <option value="">请选择</option>
        <option v-for="(key,value) of purchaseOrderStatus" :value="key">{{value}}</option>
      </select>
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <table class="table text-center table-hover table-odd table-bordered datalist">
      <thead>
        <tr>
          <th>调剂单号</th>
          <th>类型</th>
          <th>调出方</th>
          <th>调入方</th>
          <th>制单人</th>
          <th>制单时间</th>
          <th>状态</th>
          <th>打印状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            <p class="text-nowrap">
              <a v-link="{ name: 'transferOrderCheck', params:{ tocCode: item.Code}}" class="highlight">{{item.Code}}</a></p>
          </td>
          <td>
            <p class="text-nowrap">{{item.TransferType|transferType}}</p>
          </td>
          <td>
            {{item.OutCustomerName}}
          </td>
          <td>
            {{item.InCustomerName}}
          </td>
          <td>
            <p class="text-nowrap">{{item.UserNameAdded}}</p>
          </td>
          <td>
            <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
          </td>
          <td>
            <p class="text-nowrap">
              <span v-if="item.Status!=1">{{item.Status|purchaseOrderStatus}}
            </span>
              <span v-else>
              {{item.AuditingStatus|auditStatus}}
            </span>
            </p>
          </td>
          <td>
            {{item.PrintCount|printStatus}}
          </td>
          <td>
            <div class="action">
              <template v-if="item.Status==0">
                <a href="javascript:;" @click="submit_Click(item)" class="item">提交</a>
                <a v-link="{ name: 'transferOrderEdit', params:{ toeCode: item.Code}}" class="item">修改</a>
                <a href="javascript:;" class="item" @click="del_Click(item)">删除</a>
              </template>
              <a href="javascript:;" v-if="item.Status==3" class="item" @click="scanSn_Click(item)">录入串号</a>
            </div>
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
    <scan-sn :show.sync="isShowScanSn" pop-title="扫号出库" :code="curCode" @on-after-submit="dispatchScanSn()" is-out="1" :store-id="curStoreId" :api-list="scanSNAPIList"></scan-sn>
  </div>
</template>
<script>
import scanSn from './../popup/transferScanSN.vue';
export default {
  props: {
    refresh: false
  },
  data() {
    return {
      APIS: {
        LIST: '/Api/Transfer/CTList',
        DELETE: '/Api/Transfer/CTDelete',
        SUBMIT: '/Api/Transfer/CTSubmit'
      },
      isShowScanSn: false,
      pageindex: 1,
      curCode: '',
      dataIn: {
        inited: false,
        dataTable: {},
        storeList: []
      },
      dataOut: {
        search: {
          StartDate: '',
          EndDate: '',
          Code: '',
          Status: ''
        }
      },
      scanSNAPIList: {
        ready: '/Api/Transfer/CTImeiReady',
        submit: '/Api/Transfer/CTFinish',
      }
    }
  },
  computed: {
    purchaseOrderStatus() {
      return dictionary['purchaseOrderStatus'];
    }
  },
  components: {
    scanSn
    // libraryInForeshow
  },
  methods: {
    initPageData(pageindex = 1) {
      this.pageindex = pageindex;
      var me = this;
      var para = this.dataOut.search;
      para.PageIndex = pageindex;
      para.PageSize = 15;
      fetchData({
        API: this.APIS.LIST,
        para,
        callback(data) {
          // console.log(data);
          me.dataIn.inited = true;
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
        }
      })
    },

    submit_Click(item) {
      let me = this;
      dialog({
        title: '提示',
        content: '提交过后该调剂单将不能修改，请确认',
        ok() {
          fetchData({
            API: me.APIS.SUBMIT,
            para: {
              code: item.Code
            },
            callback(data) {
              // console.log(data);
              me.initPageData(me.pageindex);
            }
          })
        },
        cancel() {}
      }).showModal();
    },
    //扫串号弹出层
    scanSn_Click(item) {
      this.curCode = item.Code;
      this.curStoreId = item.StoreId || '';
      this.isShowScanSn = true;
    },
    libraryOut_Click(item) {
      let me = this;
      dialog({
        title: '出库预告',
        content: '确认生成出库预告单吗？',
        ok() {
          fetchData({
            API: '/Api/Transfer/TROInsert',
            para: {
              TransferContractCode: item.Code
            },
            callback() {
              me.initPageData(me.pageindex);
            }
          })
        },
        cancel() {}
      }).showModal();

    },
    //删除
    del_Click(item) {
      let me = this;
      dialog({
        title: '删除调剂单',
        content: `确认删除该调剂单吗？<br>(<span class="text-warning">${item.Code}</span>)`,
        ok() {
          fetchData({
            API: me.APIS.DELETE,
            para: {
              code: item.Code
            },
            callback(data) {
              // console.log(data);
              me.initPageData(me.pageindex);
            }
          })
        },
        cancel() {}
      }).showModal();
    },
    dispatchScanSn() {
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
