<template>
  <div class="main">
    <h2 class="content-title">盘点记录</h2>
    <div class="content-field">
      <div class="search clearfix mt20">
        <span class="mr5">时间段</span>
        <span class="date-field">
            <input type="text" v-model="dataOut.search.StartDate"  readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'endDate\')}'})">
            <i class="fa fa-calendar icon"></i>
          </span>
        <span> - </span>
        <span class="date-field">
            <input type="text" v-model="dataOut.search.EndDate" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({minDate: '#F{$dp.$D(\'startDate\')}',maxDate:'%y-%M-%d'})">
            <i class="fa fa-calendar icon"></i>
         </span>
        <span class="ml20 mr5">机构</span>
        <select class="com-ipt" @change="branch_Change()" v-model="dataOut.search.BranchId">
          <option v-for="item of dataIn.arrBranch" :value="item.Id">
            {{item.Name}}
          </option>
        </select>
        <span class="ml20 mr5">仓库</span>
        <select class="com-ipt" v-model="dataOut.search.StoreId">
          <option value="">请选择</option>
          <option :value="item.Id" v-for="item in computedStoresOfBranch">
            {{item.Name}}
          </option>
        </select>
        <button class="btn btn-primary ml10" @click="initPageData()">搜索</button>
      </div>
      <table class="table text-center table-hover table-odd table-bordered datalist">
        <thead>
          <tr>
            <th>盘点时间</th>
            <th>盘点人</th>
            <th>分仓</th>
            <th>报损数量</th>
            <th>报损金额</th>
            <th>报溢数量</th>
            <th>报溢金额</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of dataIn.arrDataTable">
            <td>
              {{item.DateAdded|datetime}}
            </td>
            <td>
              {{item.UserNameAdded}}
            </td>
            <td>
              {{item.StoreName}}
            </td>
            <td>
              {{item.LossCount}}
            </td>
            <td>
              {{item.LossMoney}}
            </td>
            <td>
              {{item.OverCount}}
            </td>
            <td>
              {{item.OverMoney}}
            </td>
            <td>
              <div class="action">
                <a href="javascript:;" class="item" @click="detail_Click(item.Code)">详情</a>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-if="dataIn.inited&&0==dataIn.arrDataTable.length">
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
    <lp-history :show.sync="isShowHistory" :cur-code="curCode"></lp-history>
  </div>
</template>
<script>
import lpHistory from './popup/popupLpHistory.vue';
export default {
  data() {
      return {
        isShowHistory: false,
        curCode: '',
        pageindex: 1,
        dataIn: {
          inited: false,
          arrStores: [],
          arrDataTable: [],
          arrCategoryList: [],
          arrBranch: []
        },
        dataOut: {
          search: {
            StartDate: '',
            EndDate: '',
            BranchId: '',
            StoreId: '',
            ProName: '',
            Category: '',
          }
        }
      }
    },
    components: {
      lpHistory
    }, computed: {
      //计算当前所选机构分仓
      computedStoresOfBranch() {
        let arrTemp = [];
        if (this.dataOut.search.BranchId > 0) {
          arrTemp = _.find(this.dataIn.arrBranch, {
            Id: this.dataOut.search.BranchId
          }).Store;
        }
        return arrTemp;
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
          API: '/Api/ Product/StocktakeList',
          para,
          callback(data) {
            // console.log(data);
            me.dataIn.inited = true;
            me.dataIn.arrDataTable = data.Data;
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
            me.dataIn.arrBranch = data;
            if (data.length) {
              me.dataOut.search.BranchId = data[0].Id;
            }
          }
        })
      },
      branch_Change() {
        this.dataOut.search.StoreId = '';
      },
      detail_Click(code) {
        this.curCode = code;
        this.isShowHistory = true;
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
      this.getStores();
    }
}
</script>
