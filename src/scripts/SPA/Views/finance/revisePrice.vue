<template>
  <div class="main" v-cloak>
    <h1 class="content-title">成本调价</h1>
    <div class="content-field">
      <div class="search clearfix mt20">
        <span><span class="mr5 required-mark">机构</span>
        <select style="min-width:135px;" v-model="dataOut.search.BranchId">
          <option v-for="item in dataIn.arrBranch" :value="item.Id">{{item.Name}}</option>
        </select>
        </span>
        <span class="ml20"><span class="mr5 required-mark">分仓</span>
        <select style="min-width:135px;" v-model="dataOut.search.StoreId">
          <option v-for="(index,item) in storesOfBranch" :value="item.Id">{{item.Name}}</option>
        </select>
        </span>
        <span class="ml20"><span class="mr5 required-mark">商品</span>
        <span class="intelligent-match"><span class=""><input type="search" class="select-long" placeholder="输入关键字" @keydown.enter="initPageData(1)" v-model="searchText" @focus="showList=true" ></span>
        <ul class="list" v-show="showList && dataIn.arrProList.length>0">
          <li class="item" v-for="item in dataIn.arrProList | filterBy searchText in 'Name'" @click="selectGood_Click(item)">{{item.Name}}</li>
        </ul>
        </span>
        </span>
        <span class="ml20"><span class="mr5">单号</span>
        <input type="search" class="select-long" placeholder="请输入单号" v-model="dataOut.search.Imei" @keydown.enter="initPageData(1)">
        </span>
        <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
      </div>
      <div class="mt20 rp-title" style="padding:15px;border:1px solid #eaeaea;background-color:#fdfdfd;">
        已选商品的
        <select v-model="dataOut.adjust.ChangeType">
          <option v-for="(k,v) in changeType" :value="k">{{v}}</option>
        </select>
        <select class="ml5" v-model="curHow">
          <option v-for="item in how" :value="item.type">{{item.name}}</option>
        </select>
        <input type="text" class="ml5" placeholder="填写数值" v-model="dataOut.num | posCurrencyIn2">
        <button v-if="dataOut.num!=0 && hasSelect" class="btn btn-warning ml5" @click="adjust_Click">调价</button>
        <button v-else class="btn btn-warning ml5 btn-disabled">调价</button>
        <div class="fr mt5" v-if="dataIn.dataTable.Details.length">
          <b>汇总信息：</b>
          <span>商品数量</span><b class="ml10 text-warning">{{dataIn.dataTable.ProCount}}</b>
          <span class="ml20">库存总成本</span><b class="text-warning ml10">{{dataIn.dataTable.SubTotal==''?'/':'￥'+dataIn.dataTable.SubTotal}}</b>
          <span class="ml20">平均成本</span><b class="text-warning ml10">{{'￥'+dataIn.dataTable.ProPrice}}</b>
        </div>
      </div>
      <table class="table text-center table-hover table-odd table-bordered" style="margin-top:-1px;">
        <thead>
          <tr>
            <th class="text-right" style="width:45px;">
              <label class="checkbox" v-if="dataIn.dataTable.Details.length">
                <input type="checkbox" v-model="checkAll" @change="checkAll_Change"><span class="icon"></span></label>
            </th>
            <th>供应商</th>
            <th>机构</th>
            <th>分仓</th>
            <th>商品名称</th>
            <th>串号</th>
            <th>采购价</th>
            <th>入库时间</th>
            <th>平均成本</th>
          </tr>
        </thead>
        <tbody v-if="dataIn.dataTable.Details.length">
          <tr v-for="item in dataIn.dataTable.Details">
            <td class="text-right" style="background-color:#fdfdfd;">
              <label class="checkbox">
                <input type="checkbox" v-model="item.isChecked" @change="checkOne_Change"><span class="icon"></span></label>
            </td>
            <td>{{item.Supplier}}</td>
            <td>{{item.BranchName}}</td>
            <td>{{item.StoreName}}</td>
            <td>{{item.ProName}}</td>
            <td>{{item.Imei}}</td>
            <td>{{item.ReceivingPrice}}
              <div class="trend show-history">
                <span class="action-show" title="历史价格"><i class="icon icon-trend" @click="getPriceHistory(item)"></i></span>
                <div class="history-price p10" style="display: none;">
                  <div class="border-box">
                    <table class="table text-center">
                      <thead>
                        <tr>
                          <th style="width:45%">价格（元）</th>
                          <th style="border-left:0">时间</th>
                        </tr>
                      </thead>
                      <tbody v-if="dataIn.arrHistory.length!=0">
                        <tr v-for="item in dataIn.arrHistory">
                          <td class="text-nowrap">
                            <span class="str-price">{{item.PriceAfter}}</span>
                          </td>
                          <td class="text-nowrap">
                            {{item.DateAdded | datetime}}
                          </td>
                        </tr>
                      </tbody>
                      <tbody v-else>
                        <tr>
                          <td colspan=2>
                            <div class="data-empty">
                              <i class="icon"></i>
                              <p class="text">暂无相关数据</p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </td>
            <td>{{item.ReceivingDate | datetime}}</td>
            <td>{{item.ProPrice}}</td>
          </tr>
        </tbody>
        <tbody v-else>
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
    </div>
  </div>
</template>
<script>
const how = [{
  type: 'ChangeTo',
  name: '调整到'
}, {
  type: 'ChangeAdd',
  name: '批量增加'
}, {
  type: 'ChangeReduce',
  name: '批量减少'
}];
export default {
  data() {
    return {
      searchText: '',
      showList: false,
      checkAll: true,
      changeType: {
        1: "采购价",
        2: "总成本"
      },
      how: how,
      curHow: how[0].type,
      dataIn: {
        dataTable: {},
        arrBranch: [],
        arrProList: [],
        arrHistory: []
      },
      dataOut: {
        num: '',
        search: {
          BranchId: '', //机构id
          StoreId: '', //分仓id
          ProId: '', //商品id
          Imei: '' //单号
        },
        adjust: {
          StoreId: '', //分仓id
          ProId: '', //商品id
          ChangeType: 1,
          // ChangeTo: '',
          // ChangeAdd: '',
          Details: [
            // {
            //   "Imei": "13000000000001"
            // }
          ]
        }
      }
    }
  },
  watch: {
    searchText(newValue) {
      let id = '',
        list = this.dataIn.arrProList,
        i = 0,
        len = list.length;
      for (; i < len; i++) {
        if (list[i].Name === newValue) {
          id = list[i].Id;
          break;
        }
      }
      this.dataOut.search.ProId = id;
    }
  },
  computed: {
    storesOfBranch() {
      let store = this.dataIn.arrBranch.filter(item => {
        return item.Id === this.dataOut.search.BranchId
      })[0]['Store'] || [];
      if (store.length) {
        this.dataOut.search.StoreId = store[0].Id
      }
      return store;
    },
    hasSelect() {
      let arr = [];
      this.dataIn.dataTable.Details.forEach(item => {
        if (item.isChecked) {
          arr.push({
            Imei: item.Imei
          })
        }
      });
      return !!arr.length
    }
  },
  methods: {
    adjust_Click() {
      let arr = [];
      this.dataIn.dataTable.Details.forEach(item => {
        if (item.isChecked) {
          arr.push({
            Imei: item.Imei
          })
        }
      });
      if (arr.length === 0) {
        showTips('请至少选择一条信息！', 'error');
        return;
      }
      if (!this.dataOut.num) {
        showTips('数值无效，请重新填写！', 'error');
        return;
      }
      this.dataOut.adjust.Details = arr;
      this.dataOut.adjust.StoreId = this.dataOut.search.StoreId;
      this.dataOut.adjust.ProId = this.dataOut.search.ProId;
      if (this.dataOut.adjust.ChangeTo) delete this.dataOut.adjust.ChangeTo;
      if (this.dataOut.adjust.ChangeAdd) delete this.dataOut.adjust.ChangeAdd;
      if (this.curHow === 'ChangeReduce') {
        this.dataOut.adjust['ChangeAdd'] = this.dataOut.num * -1;
      } else {
        this.dataOut.adjust[this.curHow] = this.dataOut.num;
      }
      fetchData({
        api: '/Api/Finance/InventoryCostChange',
        para: this.dataOut.adjust,
        callback: data => {
          this.initPageData();
        }
      })
    },
    checkAll_Change() {
      this.dataIn.dataTable.Details.forEach(item => {
        item.isChecked = this.checkAll
      })
    },
    checkOne_Change() {
      this.checkAll = this.dataIn.dataTable.Details.every(item => {
        return item.isChecked === true
      })
    },
    selectGood_Click(item) {
      this.searchText = item.Name;
      setTimeout(() => {
        this.showList = false;
      }, 300);
    },
    //调价历史
    getPriceHistory(item) {
      fetchData({
        api: '/Api/Finance/InventoryCostHistory',
        para: {
          Imei: item.Imei
        },
        callback: data => {
          this.dataIn.arrHistory = data.Details;
        }
      })
    },
    //商品感知,1是商品，0是礼品
    getGoodsList(proType = 1) {
      fetchData({
        API: '/api/Product/List',
        para: {
          pageIndex: 1,
          pageSize: 100000,
          ProType: proType
        },
        callback: (data) => {
          this.dataIn.arrProList = data.Data;
          this.checkAll = true;
        }
      });
    },
    // 机构获取
    getBranch() {
      fetchData({
        API: 'api/USER/STORE',
        para: {},
        callback: (data) => {
          this.dataIn.arrBranch = data;
          if (data.length) {
            this.dataOut.search.BranchId = data[0].Id
          }
        }
      })
    },
    initPageData(pageindex = 1) {
      this.pageindex = pageindex;
      let para = this.dataOut.search;
      if (para.ProId === '') {
        showTips('请先选择商品', 'error');
        return false;
      }
      para.PageIndex = pageindex;
      para.PageSize = 15;
      fetchData({
        API: '/Api/Finance/InventoryProList',
        para,
        callback: (data) => {
          data.Details && data.Details.forEach(item => {
            item.isChecked = true;
          });
          this.checkAll = true;
          this.dataOut.num = '';
          this.dataIn.dataTable = data;
        }
      })
    },
  },
  created() {
    this.getBranch();
    this.getGoodsList();
  }

}
</script>
