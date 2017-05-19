<template>
  <div class="main">
    <h2 class="content-title">借出归还</h2>
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
          <option value="0">未借出</option>
          <option value="1">已借出</option>
          <option value="2">已归还</option>
        </select>
        </span>
        <span class="ml20">
          <span class="mr5">单号</span>
        <input type="search" class="com-ipt width" placeholder="输入单号" v-model="dataOut.search.BorrowCode" @keydown.enter="initPageData(1)" maxlength="50">
        </span>
        <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table text-center table-hover table-odd table-bordered datalist">
        <thead>
          <tr>
            <th>借出单号</th>
            <th>商品名称</th>
            <th>串号</th>
            <th>借出人</th>
            <th>归还人</th>
            <th>状态</th>
            <th>归还时间</th>
            <th>仓库</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataIn.dataTable">
            <td>
              <p class="text-nowrap">
                <a v-link="{ name: 'borrowOrderCheck', params:{ cbocCode: item.BorrowCode}}" class="highlight">{{item.BorrowCode}}</a>
              </p>
            </td>
            <td>
              {{item.ProName}}
            </td>
            <td>
              <p class="text-nowrap">{{item.Imei?item.Imei:'/'}}</p>
            </td>
            <td>
              <p class="text-nowrap">{{item.BorrowPerson}}</p>
            </td>
            <td>
              <p class="text-nowrap">
                <span v-if="2==item.Status">
                              {{item.ReturnUserName}}
                            </span>
                <span v-else>/</span></p>
            </td>
            <td>
              <p class="text-nowrap">{{item.Status|borrowStatus}}</p>
            </td>
            <td>
              <p class="text-nowrap">
                <span v-if="2==item.Status">
                  {{item.ReturnDate|datetime}}
                </span>
                <span v-else>/</span>
              </p>
            </td>
            <td>
              <p class="text-nowrap">{{item.StoreName}}</p>
            </td>
            <td>
              <div class="action">
                <a v-if="0==item.Status" href="javascript:;" @click="borrow_Click(item)" class="item">借出</a>
                <a v-if="1==item.Status" href="javascript:;" @click="return_Click(item)" class="item">归还</a>
                <span v-if="2==item.Status">/</span>
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
    <scan-sn :show.sync="isShowScanSn" :id="curId" :pro-name="curPro" @on-after-submit="dispatchScanSn()"></scan-sn>
  </div>
</template>
<script>
import scanSn from './popup/borrowscanSN.vue';
export default {
  data() {
      return {
        isShowScanSn: false,
        pageindex: 1,
        curId: '',
        curPro: '',
        dataIn: {
          inited: false,
          dataTable: {}
        },
        dataOut: {
          search: {
            Status: '',
            StartDate: '',
            EndDate: '',
            BorrowCode: '',
          }
        }
      }
    },
    components: {
      scanSn
    },
    methods: {
      initPageData(pageindex = 1) {
        this.pageindex = pageindex;
        var me = this;
        var para = this.dataOut.search;
        para.PageIndex = pageindex;
        para.PageSize = 15;
        fetchData({
          API: '/Api/borrow/infoList',
          para,
          callback(data) {
            // console.log(data);
            me.dataIn.inited = true;
            me.dataIn.dataTable = data.Data;
            initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
          }
        })
      },
      borrow_Click(item) {
        this.curId = item.Id;
        this.curPro = item.ProName;
        this.isShowScanSn = true;
      },
      //归还
      return_Click(item) {
        let me = this;
        dialog({
          width: 250,
          title: '归还商品',
          content: `确认归还串号为：<span class="text-warning">${item.Imei}</span>的${item.ProName}`,
          ok() {
            fetchData({
              API: '/Api/Borrow/In',
              para: {
                id: item.Id,
              },
              callback() {
                me.initPageData(me.pageindex);
              }
            })
          },
          cancel() {

          }
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
    }
}
</script>
