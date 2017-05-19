<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div>
      <span v-if="curCode.length>0">编辑</span><span v-else>添加</span>采购退货单
    </h1>
    <div class="content-field">
      <div class="filter order-add">
        <p class="mt10">
          <strong class="text-warning" v-if="curCode.length>0">单号：{{curCode}}</strong></p>
        <table>
          <tbody>
            <tr>
              <td>
                <span class="mr5 required-mark">供应商家 </span>
                <span class="select-box" @click="selectSupplier()">
                  <input type="text" :title="editInfo.SupplierName" placeholder="选择供应商" readonly v-model="editInfo.SupplierName">
                  <i class="icon" title="点击选择供应商"></i>
                </span>
              </td>
              <td>
                <span class="ml20">
                <label class="checkbox">
                  <input type="checkbox" :value="1" v-model="curReceipt"><span class="text">发票</span><span class="icon"></span>
                </label>
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="mr5 required-mark">结算方式</span>
                <select v-model="editInfo.PayType" class=" com-ipt">
                  <option v-for="item of computedPayType" :value="item.key">{{item.value}}</option>
                </select>
              </td>
              <td>
                <span class="mr5 ml20" v-show="editInfo.BranchName">
                  机构：{{editInfo.BranchName}}
                </span>
                <span class="ml20"><span class="mr5 required-mark">分仓</span>
                <span class="select-box" @click="selectStore()">
                  <input type="text" :title="editInfo.StoreName" placeholder="选择分仓" readonly v-model="editInfo.StoreName">
                  <i class="icon" title="点击选择分仓"></i>
                </span>
                </span>
                <span class="ml20">
                  经手人
                  <select class="com-ipt ml5" v-model="editInfo.HandlerId">
                    <option :value="item.Id" v-for="item in dataIn.arrUserList">{{item.UserName}}</option>
                  </select>
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
              <th style="width:130px">品牌</th>
              <th>商品名称</th>
              <th style="width:150px;">单价（元）</th>
              <th style="width:100px">数量</th>
              <!--               <th style="width:90px;">税率</th>
            <th style="width:100px;">单件税额</th>
            <th style="width:120px;">总税额</th> -->
              <th style="width:200px;">小计（元）</th>
              <th style="width:160px;">备注</th>
              <th style="width:44px;"></th>
            </tr>
          </thead>
          <tfoot>
            <tr class="table-v-top">
              <td colspan="4" class="text-right"><b>合计：</b></td>
              <td><b>{{goodsAddedCount}}</b></td>
              <td>
                <p class="price-show text-right"><b>{{goodsAddedAmount|currency}}</b></p>
              </td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="item of editInfo.Details">
              <td>
                <p class="text-nowrap">
                  {{item.ProId}}
                </p>
              </td>
              <td>
                {{item.CategoryName}}
              </td>
              <td>{{item.ProName}}<i class="icon-gift" v-if="item.ProType==0">礼</i>
              </td>
              <td v-if="item.ProType==1">
                <input type="text" placeholder="输入价格" v-model="item.ProPrice|currencyIn" data-validate="required money popShow" class="com-ipt small text-right" maxlength="9">
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
              <td v-else>/</td>
              <td>
                <input type="number" min=1 placeholder="输入数量" v-model="item.ProCount" class="com-ipt x-small pro-count" data-validate="required posInteger popShow" maxlength="9">
              </td>
              <td v-if="item.ProType==1">
                <p class="text-nowrap text-right">
                  {{getProAmount(item)|currency}}
                </p>
              </td>
              <td v-else>/</td>
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
    <goods-list :show.sync="showGoodsList" :goods-added-list.sync="editInfo.Details" @on-add-after="goodsAdded()" :action="action" :store-id="editInfo.StoreId"></goods-list>
    <supplier-list :show.sync="isShowSupplierSelect" :supplier-selected.sync="editInfo" :chk-paytype.sync="arrChkPayTypeUsed"></supplier-list>
    <store-list :show.sync="isShowStoreSelect" :store-selected.sync="editInfo"></store-list>
  </div>
</template>
<script>
/**
 * 采购退货
 * zhao.liubin@zol.com.cn
 * 2016-12-10
 */
import goodsList from 'vues/goodsList.vue';
import supplierList from 'vues/supplierList.vue';
import storeList from 'vues/storeList.vue';
export default {
  data() {
      return {
        showGoodsList: false,
        isShowSupplierSelect: false,
        isShowStoreSelect: false,
        APILIST: {
          INSERT: '/API/RPurchasingContract/Insert', //添加
          UPDATE: '/API/RPurchasingContract/Update', //添加
          PREVIEW: '/API/RPurchasingContract/Preview', //预览
        },
        action: dictionary.storageAttr.forPurchase, //获取仓库类型
        dataIn: {
          flowList: [],
          storeList: [],
          datalist: {},
          arrSupplierInfo: [],
          arrBranch: [],
          arrUserList: [],
        },
        isUpdating: false,
        curCode: '', //编辑时，单号
        curBranch: '',
        arrCurStore: [],
        curReceipt: '', //发票
        editInfo: {
          Code: '',
          SupplierId: '',
          SupplierName: '',
          BranchId: '',
          BranchName: '',
          StoreId: '',
          StoreName: '',
          PayType: '',
          DateAdded: '',
          Details: [],
          UserNameAdded: '',
          Receipt: 0,
          HandlerId: '',
        },
      }
    },
    components: {
      goodsList,
      supplierList,
      storeList,
    },
    computed: {
      //本地存取结算方式
      computedPayType() {
        let arrPt = (localStorage.Config_AccountingType + '').split(',');
        let arrTemp = [];
        for (let i = 0; i < arrPt.length; i++) {
          let objTemp = {};
          objTemp.key = arrPt[i];
          objTemp.value = dictionary.payType[arrPt[i]];
          arrTemp.push(objTemp);
        }
        return arrTemp;
      },
      //串号标准
      SNStandard() {
        return dictionary.SNStandard;
      },
      //商品总数
      goodsAddedCount() {
        var count = 0;
        this.editInfo.Details.forEach(function(item) {
          let c = !validatorManu.isPosInteger(item.ProCount) ? 0 : item.ProCount;
          count += parseInt(c);
        });
        return count;
      },
      //单据总金额
      goodsAddedAmount() {
        var amount = 0;
        this.editInfo.Details.forEach(function(item) {
          let c = !validatorManu.isPosInteger(item.ProCount) ? 0 : item.ProCount;
          amount += c * item.ProPrice;
        });
        return amount.toFixed(2);
      },
      //计算当前所选机构分仓
      computedStoresOfBranch() {
        let arrTemp = [];
        if (this.editInfo.BranchId > 0) {
          arrTemp = _.find(this.dataIn.arrBranch, {
            Id: this.editInfo.BranchId
          }).Store;
        }
        return arrTemp;
      },
      //根据总额显示审核步骤
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
        this.curCode = this.$route.params.preCode || '';
        this.curCode = this.curCode == 0 ? '' : this.curCode;
        var me = this;
        this.getUserList();
        if (!me.curCode) {
          me.initData();
        } else {
          fetchData({
            API: this.APILIST.PREVIEW,
            para: {
              'code': me.curCode,
              isEdit: 1 //1为编辑，0是预览
            },
            callback(data) {
              me.isUpdating = true;
              me.editInfo = data;
              me.curReceipt = data.Receipt;
              me.editInfo.Code = me.curCode;
            }
          });
        }
      },
      //添加成功后，清空初始化数据
      initData() {
        let me = this;
        if (me.dataIn.arrSupplierInfo.length) {
          me.editInfo.SupplierId = me.dataIn.arrSupplierInfo[0].Id;
        }
        this.computedPayType.length > 0 && (this.editInfo.PayType = this.computedPayType[0].key);
        me.editInfo.Details = [];
        me.editInfo.Receipt = 0;
        me.editInfo.DateAdded = zmm_date.nowDate().ymdhmms;
        me.editInfo.UserNameAdded = localStorage.userName;
      },

      //选择商品
      selectedGoods_Click() {
        if (!this.editInfo.StoreId) {
          showTips('请先选择分仓', 'error');
          return;
        }
        this.showGoodsList = true;
      },
      //选择历史价格
      selectHistoryPrice(item, price, e) {
        item.ProPrice = price;
        $(e.target).closest('.history-price').hide();
      },
      //选择供应商弹窗
      selectSupplier() {
        this.isShowSupplierSelect = true;
      }, //选择分仓弹窗
      selectStore() {
        this.isShowStoreSelect = true;
      },
      //经手人列表
      getUserList() {
        let me = this;
        fetchData({
          API: 'api/User/UserList',
          para: {
            addMySelf: 1
          },
          callback(data) {
            me.dataIn.arrUserList = data;
            me.editInfo.HandlerId = data[0].Id;
          }
        })
      },
      //计算单个商品总价
      getProAmount(item) {
        return item.ProCount * item.ProPrice || 0;
      },
      delGoods_Click(item) {
        this.editInfo.Details.$remove(item);
      },
      save_Click(v, e) {
        let me = this;
        var para = this.editInfo;
        para.Status = v;
        para.Receipt = this.curReceipt ? 1 : 0;
        if (this.editInfo.Details.length == 0) {
          showTips('请先选择商品', 'error');
          return;
        }
        if (!zmm_validator(this.$el)) {
          return;
        }
        para.HandlerName = _.find(this.dataIn.arrUserList, {
          Id: para.HandlerId
        }).UserName;
        para.AuditingString = [];
        let API = this.isUpdating ? this.APILIST.UPDATE : this.APILIST.INSERT;
        fetchData({
          API,
          target: e.target,
          para,
          callback(data) {
            me.$router.go({
              name: 'purchaseReturn',
            })
          }
        })
      }
    },
    created() {
      this.initPageData();
    }
}
</script>
