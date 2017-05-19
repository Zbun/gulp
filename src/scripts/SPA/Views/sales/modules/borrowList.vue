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
          <span class="mr5">借机人</span>
      <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.BorrowPerson" maxlength="50" @keydown.enter="initPageData(1)">
      </span>
      <span class="ml20">
          <span class="mr5">单号</span>
      <input type="search" class="com-ipt width" placeholder="输入单号" v-model="dataOut.search.Code" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <table class="table text-center table-hover table-odd table-bordered datalist">
      <thead>
        <tr>
          <th>单号</th>
          <th>借机人</th>
          <th>预计归还时间</th>
          <th>出货机构</th>
          <th>出货仓库</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td class="text-nowrap">
            <a v-link="{ name: 'borrowOrderCheck', params:{ cbocCode: item.Code}}" class="item">{{item.Code}}</a>
          </td>
          <td>
            {{item.BorrowPerson}}
          </td>
          <td>
            <p class="text-nowrap">{{item.MaybeReturnDate|date}}</p>
          </td>
          <td>
            {{item.BranchName}}
          </td>
          <td>
            {{item.StoreName}}
          </td>
          <td>
            <p class="text-nowrap" :class="'order-status-'+item.Status">
              {{item.Status|purchaseOrderStatus}}
            </p>
          </td>
          <td>
            <div class="action">
              <a href="javascript:;" v-if="item.Status==0" @click="submit_Click(item)" class="item">提交</a>
              <a v-if="item.Status==0" v-link="{ name: 'borrowOrderEdit', params:{ cbeCode: item.Code}}" class="item">修改</a>
              <a href="javascript:;" v-if="item.Status==0||item.AuditingStatus==1||(item.AuditingStatus==0&&item.Status==2)" class="item" @click="del_Click(item)">删除</a>
            </div>
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
  </div>
</template>
<script>
export default {
  props: {
    refresh: false
  },
  data() {
    return {
      pageindex: 1,
      APIS: {
        LIST: '/Api/Borrow/List',
        SUBMIT: '/Api/Borrow/Submit',
        DELETE: '/Api/Borrow/Delete',
        FORESHOW: '/Api/Borrow/InfoInsert'
      },
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
      }
    }
  },
  computed: {
    purchaseOrderStatus() {
      return dictionary['purchaseOrderStatus'];
    }
  },
  components: {

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
          // console.table(data.Data);
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
        content: '提示过后该借机单将不能修改，请确认',
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
    getStoreList() {
      let me = this;
      fetchData({
        api: '/Api/User/Store',
        callback(data) {
          // console.log(data);
          me.dataIn.storeList = data;
        }
      })
    },
    //添加礼品弹窗
    AddGift_Click(item) {
      this.curPCode = item.Code;
      this.isShowGiftList = true;
    },
    del_Click(item) {
      let me = this;
      dialog({
        title: '删除借机单',
        content: `确认删除该借机单吗？<br>(<span class="text-warning">${item.Code}</span>)`,
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
