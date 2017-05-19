<template>
  <div class="main" v-cloak>
    <h2 class="content-title">
       <span class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </span>
      <span v-if="curCode.length>0">编辑</span><span v-else>添加</span>销售退货单
    </h2>
    <div class="content-field">
      <div class="filter">
        <p class="mt10">
          <strong class="text-warning" v-if="curCode.length>0">单号：{{curCode}}</strong></p>
        <table>
          <tbody>
            <tr>
              <td>
                <span class="mr5 required-mark">客户</span>
                <div class="intelligent-match">
                  <span class="select-box">
                <input type="search" class="select-long com-ipt" placeholder="关键字" v-model="intelligentMatch.customerName" @focus="IMIptFocus()" @input="IMIptInput()">
                <i class="icon" title="点击选择客户" @click="selectCustomer()"></i>
              </span>
                  <ul class="list" v-show="intelligentMatch.isShow&&computedFilterCustomerInfo.length>0">
                    <li class="item" v-for="item in computedFilterCustomerInfo" @click="selectedThisCustomerId(item)">{{item.Name}}</li>
                  </ul>
                </div>
                <span class="mr5 ml20" v-show="editInfo.BranchName">
                  机构：{{editInfo.BranchName}}
                </span>
                <span class="ml20"><span class="mr5 required-mark">分仓</span>
                <span class="select-box" @click="selectStore()">
                  <input type="text" :title="editInfo.StoreName" placeholder="选择分仓" readonly v-model="editInfo.StoreName">
                  <i class="icon" title="点击选择分仓"></i>
                </span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="mt5">
          <button class="btn  btn-highlight" @click="selectedGoods_Click()">
            <b>选择商品</b>
          </button>
        </p>
        <table class="table table-bordered mt10 text-center">
          <thead>
            <tr>
              <th style="width:100px">商品编码</th>
              <th style="width:100px">品牌</th>
              <th>商品名称</th>
              <th style="width:150px;">单价（元）</th>
              <th style="width:110px">数量</th>
              <th style="width:130px;">小计（元）</th>
              <th style="width:160px;">备注</th>
              <th style="width:44px;"></th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <td class="text-right" colspan="4"><b>合计：</b></td>
              <td><b>{{goodsAddedCount}}</b></td>
              <td class="text-right">
                <p class="price-show"><b>{{goodsAddedAmount|currency}}</b></p>
              </td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="item of editInfo.Details">
              <td class="text-nowrap">
                {{item.ProId}}
              </td>
              <td>
                {{item.CategoryName}}
              </td>
              <td>{{item.ProName}}</td>
              <td>
                <input type="text" placeholder="输入金额" v-model="item.ProPrice|currencyIn" class="com-ipt small text-right" data-validate="required money popShow" maxlength="9">
                <div class="trend show-history">
                  <span class="action-show" title="历史价格">
                  <i class="icon icon-trend"></i>
                  </span>
                  <div class="history-price p10">
                    <div class="border-box">
                      <table class="table text-center">
                        <thead>
                          <tr>
                            <th style="width:45%">价格（元）</th>
                            <th style="border-left:0">时间</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="history in item.PriceHistory">
                            <td class="text-nowrap">
                              <span class="str-price" @click="selectHistoryPrice(item,history.ProPrice,$event)">{{history.ProPrice}}</span>
                            </td>
                            <td class="text-nowrap">
                              {{history.DateAdded|datetime}}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <input type="number" min=1 placeholder="输入数量" v-model="item.ProCount" class="com-ipt x-small" data-validate="required posInteger popShow" maxlength="9">
              </td>
              <td>
                <p class="price-show text-right">
                  {{item.ProCount*item.ProPrice|currency}}
                </p>
              </td>
              <td>
                <input type="text" placeholder="输入备注" v-model="item.Description" maxlength="50">
              </td>
              <td>
                <a href="javascript:;" @click="delGoods_Click(item)"><i class="icon icon-del" title="删除"></i></a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="made-info mt20">
        <table class="table-intro">
          <tr>
            <td>
              <span class="title">
                    &#12288;制单人&nbsp;
                  </span>
              <span class="content">
                <span class="currency-box">
              <input type="text" placeholder="" class="ipt-currency disabled" readonly v-model="editInfo.UserNameAdded">
              <span class="line"></span>
            </td>
            <td>
              <span class="title">制单时间 </span>
              <span class="content">
                <span class="currency-box">
              <input type="text" placeholder="" class="ipt-currency disabled com-ipt large" readonly v-model="editInfo.DateAdded|datetime">
              <span class="line"></span>
            </td>
            <td>
              <span class="title">
                    备注&nbsp;
                  </span>
              <span class="content">
                <span class="currency-box">
              <input type="text" placeholder="" class="ipt-currency  com-ipt x-large"  v-model="editInfo.Description">
              <span class="line"></span>
              </span>
              </span>
            </td>
          </tr>
        </table>
      </div>
      <div class="action">
        <div class="divider-dashed"></div>
        <button class="btn btn-primary big" @click="save_Click(1,$event)">
          提交
        </button>
      </div>
    </div>
    <goods-list :show.sync="showGoodsList" :goods-added-list.sync="editInfo.Details" @on-add-after="goodsAdded()" :store-id="editInfo.StoreId" :action="ACTION"></goods-list>
    <store-list :show.sync="isShowStoreSelect" :store-selected.sync="editInfo"></store-list>
    <customer-list :show.sync="isShowCustomerSelect" @on-add-after="selectedThisCustomerId"></customer-list>
  </div>
</template>
<script>
/**
 * 销售退货单添加模块
 * zhao.liubin@zol.com.cn
 * 2017-04-25
 */

import goodsList from 'vues/goodsList.vue';
import customerList from 'vues/customerList.vue';
import storeList from 'vues/storeList.vue';

export default {
  data() {
      return {
        showGoodsList: false,
        isShowCustomerSelect: false,
        isShowStoreSelect: false,
        ACTION: 2,
        isUpdate: false,
        APILIST: {
          // READY: '/Api/RSalesContract/CustomerWithAccount',
          INSERT: '/Api/RSalesContract/Insert', //添加编辑新数据
          UPDATE: '/Api/RSalesContract/UPDATE', //添加编辑新数据
          PREVIEW: '/Api/RSalesContract/Preview', //编辑时读取数据
          CUSTOMER: '/Api/Customer/AccountList', //客户列表
        },
        curAPI: '',
        dataIn: {
          flowList: [],
          stores: [],
          datalist: {},
          arrBranch: [],
          arrCustomer: []
        },
        intelligentMatch: {
          isShow: false,
          customerName: ''
        },
        curCode: '', //编辑时，单号
        editInfo: {
          CustomerId: '',
          CustomerName: '',
          DateAdded: '',
          Details: [],
          BranchId: '',
          BranchName: '',
          StoreId: '',
          StoreName: '',
          UserNameAdded: ''
        },
      }
    },
    components: {
      goodsList,
      storeList,
      customerList
    },
    computed: {
      PayType() {
        return dictionary.payType;
      },
      //智能匹配客户
      computedFilterCustomerInfo() {
        let me = this;
        if (validatorManu.isEmpty(this.intelligentMatch.customerName)) {
          return this.dataIn.arrCustomer;
        } else {
          return this.dataIn.arrCustomer.filter((item) => {
            return item.Name.toLowerCase().indexOf(me.intelligentMatch.customerName.toLowerCase().trim()) > -1;
          })
        }
      },
      goodsAddedCount() {
        var count = 0;
        this.editInfo.Details.forEach(function(item) {
          let c = !validatorManu.isPosInteger(item.ProCount) ? 0 : item.ProCount;
          count += parseInt(c);
        });
        return count;
      },
      goodsAddedAmount() {
        var amount = 0;
        this.editInfo.Details.forEach(function(item) {
          let c = !validatorManu.isPosInteger(item.ProCount) ? 0 : item.ProCount;
          amount += c * item.ProPrice;
        });
        return amount.toFixed(2);
      }, //计算当前所选机构分仓
      computedStoresOfBranch() {
        let arrTemp = [];
        if (this.editInfo.BranchId > 0) {
          arrTemp = _.find(this.dataIn.arrBranch, {
            Id: this.editInfo.BranchId
          }).Store;
        }
        return arrTemp;
      },
      //计算当前流程输入
      curAuditingSteps() {
        let curAuditingSteps = [];
        for (let i = 0; i < this.dataIn.flowList.length; i++) {
          if (this.goodsAddedAmount < this.dataIn.flowList[i].AmountMin) {
            curAuditingSteps = this.dataIn.flowList[--i].AuditingSteps;
            break;
          } else {
            curAuditingSteps = this.dataIn.flowList[i].AuditingSteps;
          }
        }
        return curAuditingSteps;
      }
    },
    methods: {
      initPageData() {
        this.curCode = this.$route.params.sroCode || '';
        this.curCode = this.curCode == 0 ? '' : this.curCode;
        var me = this;
        if (!me.curCode) {
          me.initData();
        } else {
          fetchData({
            API: me.APILIST.PREVIEW,
            para: {
              Code: me.curCode
            },
            callback(data) {
              me.isUpdate = true;
              me.editInfo = data;
              me.intelligentMatch.customerName = data.CustomerName;
              me.editInfo.Code = me.curCode;
            }
          });
        }

      },
      //添加完成初始化并清空已填数据
      initData() {
        let me = this;
        me.editInfo.Details = [];
        me.editInfo.UserNameAdded = localStorage.userName;
        me.editInfo.DateAdded = zmm_date.nowDate().ymdhmms;
      },
      //客户信息
      getCustomerList() {
        fetchData({
          API: this.APILIST.CUSTOMER,
          para: {
            pagesize: 10000,
          },
          callback: data => {
            this.dataIn.arrCustomer = data.Data;
          }
        })
      },
      //客户智能感知下拉
      IMIptFocus() {
        this.intelligentMatch.isShow = true;
      },
      IMIptInput() {
        this.editInfo.CustomerId = '';
      },
      selectedThisCustomerId(item) {
        this.editInfo.CustomerId = item.Id;
        this.editInfo.CustomerName = item.Name;
        this.intelligentMatch.customerName = item.Name;
        this.intelligentMatch.isShow = false;
      },
      //选择客户弹窗
      selectCustomer() {
        this.isShowCustomerSelect = true;
      }, //选择分仓弹窗
      selectStore() {
        this.isShowStoreSelect = true;
      },

      //选择商品
      selectedGoods_Click() {
        if (!this.editInfo.StoreId) {
          showTips('请先选择分仓', 'error');
          return;
        }
        this.showGoodsList = true;
      },
      delGoods_Click(item) {
        this.editInfo.Details.$remove(item);
      },
      selectHistoryPrice(item, price, e) {
        item.ProPrice = price;
        $(e.target).closest('.history-price').hide();
      },
      save_Click(v, e) {
        let me = this;
        var para = this.editInfo;
        para.Status = v;
        if (!this.editInfo.CustomerId) {
          showTips('请先选择客户', 'error');
          return;
        }
        if (this.editInfo.Details.length == 0) {
          showTips('请先选择商品', 'error');
          return;
        }
        if (!zmm_validator(this.$el)) {
          return;
        }

        para.AuditingString = [];
        let API = this.isUpdate ? this.APILIST.UPDATE : this.APILIST.INSERT;
        fetchData({
          API,
          target: e.target,
          para,
          callback(data) {
            me.$router.go({
              name: 'salesReturnOrder',
              params: {
                sroTabIndex: 0
              }
            })
          }
        })
      }
    },
    ready() {
      this.initPageData();
      this.getCustomerList();
    }
}
</script>
