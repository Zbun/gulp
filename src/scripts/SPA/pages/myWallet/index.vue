<template>
  <div class="main" id="myWallet">
    <div class="content-field">
      <div class="mb15">你好!
        <span class="text-primary ml5 mr5">{{editInfo.AccountProfile.Contact}}</span>({{editInfo.AccountProfile.Phone}})
        <a class="fr highlight" href="#/myWallet/accountInfo">
          <i class="iconfont icon-yonghu mr5"></i>账户资料</a>
      </div>

      <ul class="set walletInfo">
        <li>
          <dl>
            <dt>
              <i class="iconfont icon-qianbao2"></i>
            </dt>
            <dd>
              <span class="text-xxx-large text-bold">{{editInfo.WalletProfile.balance}}</span>元</dd>
            <dd class="text-muted">账户余额</dd>
          </dl>
          <div class="mt20 text-muted">可提现余额:
            <i class="text-xx-large text-default">{{editInfo.WalletProfile.cashout_amt}}</i>元
            <span class="ml10">冻结金额:
              <i class="text-xx-large text-default">{{editInfo.WalletProfile.freeze_balance}}</i>元</span>
            <a href="#/myWallet/withdraw" class="ml30"> 提现</a>
          </div>
        </li>
        <li>
          <div>账户状态:
            <span class="text-primary ml10">{{editInfo.AccountProfile.StatusDesc}}</span>
          </div>
          <div class="mt20 text-light-muted">
            <i class="iconfont icon-shenfenrenzheng "></i>{{editInfo.WalletProfile.stat_userDesc}}
            <span class="ml20 text-light-muted" @click="goBank()" style="cursor:pointer">
              <i class="iconfont icon-yinhangqia"></i>
              我的银行卡
            </span>
          </div>
        </li>
      </ul>

      <div class="search-box clearfix mt15">
        <span class="tab-bar">
          <em class="item" :class="{on:nowIndex==0}" @click="clickTabBar(0)">交易记录</em>
          <em class="item" :class="{on:nowIndex==1}" @click="clickTabBar(1)">提现记录</em>
          <em class="item" :class="{on:nowIndex==2}" @click="clickTabBar(2)">退款记录</em>
        </span>
        <div class="content">
          <div v-if="nowIndex==0">
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
          </div>
          <div v-if="nowIndex==1">
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
                  <td :title="item.Name">
                    {{item.DateAdded |datetime}}
                  </td>
                  <td class="text-nowrap">
                    {{item.Money}}

                  </td>
                  <td class="text-nowrap">
                    {{item.StatusDesc}}

                    <span class="tooltips-i tooltips-t" v-if="item.Status == -1">
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
            <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
              暂无相关数据
            </div>
          </div>
          <div v-if="nowIndex==2">
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

          </div>
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
  dataOut: {
    search: {
      Key: "",
      Status: ""
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
    initPageData(pageIndex) {
      fetchData({
        API: "api/Supplier/SupplierWalletHome",
        callback: data => {
          this.editInfo = data;
        }
      });
    },
    goBank() {
      this.$router.push({
        name: "myBank"
      });
    },
    clickTabBar(index) {
      this.nowIndex = index;
      if (index == 1) {
        fetchData({
          API: "api/Supplier/SupplierWalletCashOutHistory",
          callback: data => {
            this.txInfo = data;
          }
        });
      }
    },
    changeStatus(status) {
      //切换商品类型
      this.dataOut.search.Status = status;
      this.initPageData(1);
    }
  },
  created() {
    this.initPageData(1);
    this.clickTabBar(0);
  }
};
</script>