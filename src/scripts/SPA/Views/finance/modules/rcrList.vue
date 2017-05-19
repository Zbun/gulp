<template>
  <div>
    <div class="search clearfix mt20">
      <span>
        <span class="mr5 required-mark">类型</span>
      <select v-model="dataOut.search.CustomerType">
        <option value="">请选择</option>
        <option value="0">供应商</option>
        <option value="1">客户</option>
      </select>
      </span>
      <span class="mr5 ml20">时间段</span>
      <span class="date-field">
            <input type="text" v-model="dataOut.search.StartDate"  readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'endDate\')}'})">
            <i class="fa fa-calendar icon"></i>
          </span>
      <span> - </span>
      <span class="date-field">
            <input type="text" v-model="dataOut.search.EndDate" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({minDate: '#F{$dp.$D(\'startDate\')}'})">
            <i class="fa fa-calendar icon"></i>
         </span>
      <span class="ml20">名称</span>
      <input type="text" placeholder="输入关键字" v-model="dataOut.search.CustomerName">
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <table class="table text-center table-hover table-odd table-bordered datalist">
      <thead>
        <tr>
          <th>收款单号</th>
          <th>类型</th>
          <th>客户</th>
          <th>本次收款</th>
          <th>收款人</th>
          <th>时间</th>
          <th>备注</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td class="text-nowrap">
            {{item.Code}}
          </td>
          <td>
            {{item.CustomerType==0?'供应商':'客户'}}
          </td>
          <td>
            {{item.CustomerName}}
          </td>
          <td>
            {{item.ChargeAmount}}
          </td>
          <td>
            {{item.UserNameAdded}}
          </td>
          <td>
            <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
          </td>
          <td>
            {{item.Description?item.Description:'/'}}
          </td>
          <td>
            <p class="text-nowrap" :class="'order-status-'+item.Status">{{item.Status|purchaseOrderStatus}}
            </p>
          </td>
          <td>
            <div class="action">
              <a v-link="{ name: 'receiveCashCheck', params:{ receCode: item.Code}}" class="item">查看</a>
              <a v-if="item.Status<=1" v-link="{ name: 'receiveCashEdit', params:{ receCode: item.Code}}" class="item">编辑</a>
              <a href="javascript:;" v-if="item.Status<=1" class="item" @click="del_Click(item)">删除</a>
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
  </div>
</template>
<script>
export default {
  props: {
    loadedFirst: false,
    refresh: false,
  },
  data() {
    return {
      pageindex: 1,
      dataIn: {
        inited: false,
        dataTable: {},
      },
      APILIST: {
        LIST: 'Api/Finance/ChargeApplyList',
        DELETE: 'Api/Finance/ChargeApplyDelete',
      },
      dataOut: {
        search: {
          CustomerType: '',
          CustomerName: '',
          StartDate: '',
          EndDate: '',
          AccountType: 13,
        }
      }
    }
  },
  computed: {},
  components: {},
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
          me.dataIn.inited = true;
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
        }
      })
    },
    del_Click(item) {
      let me = this;
      dialog({
        title: '删除付款单',
        content: `确认删除该付款单吗？<br>(<span class="text-warning">${item.Code}</span>)`,
        ok() {
          fetchData({
            API: me.APILIST.DELETE,
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
  },
  ready() {
    this.initPageData(1);
    this.dataOut.search.StartDate = zmm_date.getTheDay({
      x: parseInt(window.localStorage.DISSTARTDATE) || -7
    });
    this.dataOut.search.EndDate = zmm_date.getTheDay({
      x: parseInt(window.localStorage.DISENDDATE) || 0
    });
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
