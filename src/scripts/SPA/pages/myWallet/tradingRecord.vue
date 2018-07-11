<template>
  <div class="main" id="myWallet">
    <div class="content-field">

      <div class="search-box clearfix">
        <span class="tab-bar">
          <em class="item" :class="{on:nowIndex==0}" @click="clickTabBar(1,0)">交易记录</em>
          <em class="item" :class="{on:nowIndex==1}" @click="clickTabBar(1,1)">提现记录</em>
          <em class="item" :class="{on:nowIndex==2}" @click="clickTabBar(1,2)">退款记录</em>
        </span>
        <div class="content">
          <!-- <div v-if="nowIndex==0">
            <div class="search-box clearfix mt10">
              <select name="" id="" v-model="IfCreate">
                <option value="1">创建时间</option>
                <option value="0">完成时间</option>
              </select>
              <label class="radio">
                <input type="radio" value="0" v-model="timeQuantum" @click="getTime(0)">
                <span class="icon"></span>今天</label>
              <label class="radio">
                <input type="radio" value="1" v-model="timeQuantum" @click="getTime(30)">
                <span class="icon"></span>一个月</label>
              <label class="radio">
                <input type="radio" value="2" v-model="timeQuantum" @click="getTime(90)">
                <span class="icon"></span>三个月</label>
              <label class="radio">
                <input type="radio" value="3" v-model="timeQuantum" @click="getTime(365)">
                <span class="icon"></span>一年</label>
              <span class="ml10">
                <input type="text" class="com-ipt ml5" placeholder="开始时间" onclick="WdatePicker()" ref="dtStart" @focus="changeTime()" v-model="dataOut.search.dtStart"> -
                <input type="text" class="com-ipt " placeholder="结束时间" onclick="WdatePicker()" ref="dtEnd" @focus="changeTime()" v-model="dataOut.search.dtEnd">
              </span>
              <select name="" id="" class="com-ipt" v-model="dataOut.search.Status">
                <option value="">状态</option>
                <option value="1">待付款</option>
                <option value="2">付款成功</option>
                <option value="3">交易完成</option>
                <option value="4">交易关闭</option>

              </select>
              <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
            </div>
            <table class="table table-bordered datalist table-hover">
              <thead>
                <tr>
                  <th>交易平台</th>
                  <th style="width:180px;">创建时间/完成时间</th>
                  <th style="width:160px;">名称/对方</th>
                  <th style="width:110px;">订单号/支付单号</th>
                  <th style="width:110px;">交易金额</th>
                  <th style="width:100px;">状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in dataIn.arrDataList">
                  <td :title="item.Name">
                    {{item.Name}}
                  </td>
                  <td class="text-nowrap">
                    {{item.Start|datetime}}至{{item.End|datetime}}
                  </td>
                  <td class="text-nowrap">
                    {{item.ARuleDesc}}
                  </td>
                  <td class="text-nowrap">
                    {{item.StatusDesc}}
                  </td>
                  <td class="text-nowrap">
                    {{item.StatusDesc}}
                  </td>
                  <td>
                    <div class="action-field">
                      <router-link class="item" v-if="item.StatusDesc=='未开始'" :to="{name:'HMMmanjianEdit',params:{id:item.Id}}">编辑</router-link>
                      <a href="javascript:;" v-if="item.StatusDesc=='进行中'" class="item" @click="end(item)">结束</a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
              暂无相关数据
            </div>
          </div> -->
          <div v-if="nowIndex==1" class="jyRecord">
            <div class="search-box clearfix mt10">
              <label class="radio">
                <input type="radio" value="0" v-model="timeQuantum" @click="getTime(0)">
                <span class="icon"></span>今天</label>
              <label class="radio">
                <input type="radio" value="1" v-model="timeQuantum" @click="getTime(30)">
                <span class="icon"></span>一个月</label>
              <label class="radio">
                <input type="radio" value="2" v-model="timeQuantum" @click="getTime(90)">
                <span class="icon"></span>三个月</label>
              <label class="radio">
                <input type="radio" value="3" v-model="timeQuantum" @click="getTime(365)">
                <span class="icon"></span>一年</label>
              <span class="ml10">
                <input type="text" class="com-ipt ml5" placeholder="开始时间" onclick="WdatePicker()" ref="dtStart" @focus="changeTime()" v-model="dataOut.search.dtStart"> -
                <input type="text" class="com-ipt " placeholder="结束时间" onclick="WdatePicker()" ref="dtEnd" @focus="changeTime()" v-model="dataOut.search.dtEnd">
              </span>
              <select name="" id="" class="com-ipt" v-model="dataOut.search.Status">
                <option value="">状态</option>
                <option value="0">提现中</option>
                <option value="1">提现成功</option>
                <option value="-1">提现失败</option>
              </select>
              <button class="btn btn-primary btn-search ml5" @click="clickTabBar(1,1)">搜索</button>
            </div>
            <table class="table table-bordered datalist table-hover">
              <thead>
                <tr>
                  <th>创建时间</th>
                  <th>提现金额(元)</th>
                  <th>提现状态</th>
                  <th>收款账户</th>
                  <th>预计到账时间</th>
                  <th>提现流水号</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in txInfo.Items">

                  <td>
                    {{item.DateAdded |datetime}}
                  </td>
                  <td class="text-nowrap">
                    {{item.Money}}

                  </td>
                  <td class="text-nowrap">
                    {{item.StatusDesc}}

                    <span class="tooltips-i tooltips-t" v-show="item.Status==-1">
                      <a href="javascript:;" class="icon icon-tips">!</a>
                      <span class="txt">
                        提现失败了!
                      </span>
                    </span>

                  </td>
                  <td class="text-nowrap">
                    <div>{{item.FullName}}</div>
                    <div>{{item.CardNum}}</div>
                    <div>{{item.BankName1}}</div>

                  </td>
                  <td class="text-nowrap">
                    {{item.WhenGetMoney |datetime}}
                  </td>
                  <td>
                    {{item.Code}}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="pageBox text-right"></div>
            <div class="table-data-empty" v-show="txInfo.length==0">
              暂无相关数据
            </div>
          </div>
          <!-- <div v-if="nowIndex==2">
            <div class="search-box clearfix mt10">
              <select name="" id="" v-model="IfCreate">
                <option value="1">创建时间</option>
                <option value="0">完成时间</option>
              </select>
              <label class="radio">
                <input type="radio" value="0" v-model="timeQuantum" @click="getTime(0)">
                <span class="icon"></span>今天</label>
              <label class="radio">
                <input type="radio" value="1" v-model="timeQuantum" @click="getTime(30)">
                <span class="icon"></span>一个月</label>
              <label class="radio">
                <input type="radio" value="2" v-model="timeQuantum" @click="getTime(90)">
                <span class="icon"></span>三个月</label>
              <label class="radio">
                <input type="radio" value="3" v-model="timeQuantum" @click="getTime(365)">
                <span class="icon"></span>一年</label>
              <span class="ml10">
                <input type="text" class="com-ipt ml5" placeholder="开始时间" onclick="WdatePicker()" ref="dtStart" @focus="changeTime()" v-model="dataOut.search.dtStart"> -
                <input type="text" class="com-ipt " placeholder="结束时间" onclick="WdatePicker()" ref="dtEnd" @focus="changeTime()" v-model="dataOut.search.dtEnd">
              </span>
              <select name="" id="" class="com-ipt" v-model="dataOut.search.Status">
                <option value="">状态</option>
                <option value="1">待付款</option>
                <option value="2">付款成功</option>
                <option value="3">交易完成</option>
                <option value="4">交易关闭</option>

              </select>
              <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
            </div>
            <table class="table table-bordered datalist table-hover">
              <thead>
                <tr>
                  <th>交易平台</th>
                  <th style="width:180px;">创建时间/完成时间</th>
                  <th style="width:160px;">名称/对方</th>
                  <th style="width:110px;">订单号/支付单号</th>
                  <th style="width:110px;">交易金额</th>
                  <th style="width:100px;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in dataIn.arrDataList">
                  <td :title="item.Name">
                    {{item.Name}}
                  </td>
                  <td class="text-nowrap">
                    {{item.Start|datetime}}至{{item.End|datetime}}
                  </td>
                  <td class="text-nowrap">
                    {{item.ARuleDesc}}
                  </td>
                  <td class="text-nowrap">
                    {{item.StatusDesc}}
                  </td>
                  <td class="text-nowrap">
                    {{item.StatusDesc}}
                  </td>
                  <td>
                    <div class="action-field">
                      <router-link class="item" v-if="item.StatusDesc=='未开始'" :to="{name:'HMMmanjianEdit',params:{id:item.Id}}">编辑</router-link>
                      <a href="javascript:;" v-if="item.StatusDesc=='进行中'" class="item" @click="end(item)">结束</a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

          </div> -->
        </div>
      </div>
      <div>

      </div>

    </div>
  </div>
</template>
<script>
let _dataModule = {
  dataIn: {
    inited: false,
    arrDataList: []
  },
  arrChkedId: [],
  pageIndex: 1,
  nowIndex: 0,
  IfCreate: 1,
  timeQuantum: 0,
  dataOut: {
    search: {
      Status: "",
      dtStart: "",
      dtEnd: ""
    }
  },
  editInfo: {
    AccountProfile: {},
    WalletProfile: {}
  },
  txInfo: {}
};
export default {
  data() {
    return _dataModule;
  },
  components: {},
  methods: {
    clickTabBar(pageIndex, index) {
      this.nowIndex = index;
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 10;

      if (index == 1) {
        fetchData({
          API: "api/Supplier/SupplierWalletCashOutHistory",
          para,
          callback: data => {
            this.dataIn.inited = true;
            this.txInfo = data;
            initPage(
              this.$el.querySelector(".jyRecord"),
              data.TotalPages,
              data.TotalRows,
              this.clickTabBar,
              pageIndex
            );
          }
        });
      }
    },
    getTime(item) {
      if (item == 0) {
        this.dataOut.search.dtStart = zmm_date.nowDate().fullTime;
      } else {
        this.dataOut.search.dtStart = zmm_date.getTheDay(-item, "-");
      }
      this.dataOut.search.dtEnd = zmm_date.nowDate().fullTime;
    },
    changeTime() {
      this.dataOut.search.dtStart = this.$refs.dtStart.value;
      this.dataOut.search.dtEnd = this.$refs.dtEnd.value;
    }
  },
  computed: {},
  created() {
    this.clickTabBar(1, 0);
    this.getTime(0);
  }
};
</script>