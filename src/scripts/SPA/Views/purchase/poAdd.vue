<template>
  <div class="main" v-cloak>
    <div class="content-title">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div><span v-if="curCode.length>0">编辑</span><span v-else>添加</span>采购单
    </div>
    <div class="content-field">
      <div class="filter order-add">
        <p class="mt10">
          <strong class="text-warning" v-if="curCode.length>0">采购单号：{{editInfo.Code}}</strong>
        </p>
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
                <input type="hidden" :value="computedIsRebateCanBeUsed" placeholder="">
                <span v-for="item in computedSupplierPayType" class="ml20">
                <label class="checkbox" :class="{disabled:goodsAddedAmount<=0||item.Amount==0||(item.PayType==11&&computedIsRebateCanBeUsed==false)}">
                  <input type="checkbox" :value="item.PayType"  v-model="arrChkPayTypeUsed"><span class="text">{{item.PayTitle}}：{{item.Amount|currency}}</span><span class="icon"></span>
                </label>
                <span class="ml10" v-if="item.PayType==11" :class="{disabled:goodsAddedAmount<=0||item.Amount==0||(item.PayType==11&&computedIsRebateCanBeUsed==false)}">
                  <span v-show="computedIsShowUseRebate">使用
                <span class="currency-box ml5">
                <input type="text" placeholder="返利金额" class="com-ipt x-small  ipt-currency block col-statistics" v-model="realpayRebate|currencyInNotRequired"  @blur="realpayRebate_Blur(item.Amount)"><span class="line">
                    </span>
                </span>
                </span>
                </span>
                </span>
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
                <span class="ml20"><span class="mr5 required-mark">收货分仓</span>
                <span class="select-box" @click="selectStore()">
                  <input type="text" :title="editInfo.StoreName" placeholder="选择分仓" readonly v-model="editInfo.StoreName">
                  <i class="icon" title="点击选择分仓"></i>
                </span>
                </span>
                <span class="ml20 required-mark">
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
              <th style="width:100px">标准</th>
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
              <td colspan="5" class="text-right"><b>合计：</b></td>
              <td><b>{{goodsAddedCount}}</b></td>
              <td class="text-right">
                <p class="price-show"><b>{{goodsAddedAmount|currency}}</b></p>
                <p v-for="item in computedArrPrePayUsed" class="font-small">
                  <i class="icon icon-minus"></i> {{item.PayTitle}}：{{item.PayAmount|currency}}
                </p>
              </td>
              <td colspan="2"></td>
            </tr>
            <tr class="noborder-lr">
              <td colspan="6"></td>
              <td style="padding:5px 0;" class="text-right">
                <p class="bg-currency text-nowrap p10">
                  应付金额：<em class="font-bigger text-bold text-warning">{{goodsAddedAmountShouldPay|currency}}</em>
                </p>
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
              <td class="text-nowrap">
                {{item.CategoryName}}
              </td>
              <td>{{item.ProName}}<i class="icon-gift" v-if="item.ProType==0">礼</i>
              </td>
              <td>
                <select v-model="item.Standard" style="min-width:0;">
                  <option v-for="(key,value) of SNStandard" :value="key">{{value}}</option>
                </select>
              </td>
              <td v-if="item.ProType==1" class="text-nowrap">
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
        <!--         <button class="btn btn-default big" @click="save_Click(0,$event)">保存草稿</button> -->
        <button class="btn btn-primary big" @click="save_Click(1,$event)">
          提交
        </button>
      </div>
    </div>
    <goods-list :show.sync="showGoodsList" :goods-added-list.sync="editInfo.Details" @on-add-after="goodsAdded()" :store-id="editInfo.StoreId" :action="action"></goods-list>
    <supplier-list :show.sync="isShowSupplierSelect" :supplier-selected.sync="editInfo" :chk-paytype.sync="arrChkPayTypeUsed"></supplier-list>
    <store-list :show.sync="isShowStoreSelect" :store-selected.sync="editInfo"></store-list>
  </div>
</template>
<script>
import goodsList from 'vues/goodsList.vue';
import supplierList from 'vues/supplierList.vue';
import storeList from 'vues/storeList.vue';
export default {
  props: {
    refresh: false
  },
  data() {
    return {
      showGoodsList: false,
      isShowSupplierSelect: false,
      isShowStoreSelect: false,
      APILIST: {
        INSERT: '/API/PurchasingContract/Insert', //添加
        UPDATE: '/API/PurchasingContract/Update', //添加
        PREVIEW: '/API/PurchasingContract/Preview', //预览
      },
      realpayRebate: '',
      action: dictionary.storageAttr.forPurchase, //获取仓库类型
      dataIn: {
        datalist: {},
        arrSupplierInfo: [],
        arrBranch: [],
        arrUserList: [],
      },
      isUpdating: false, //是更新
      curCode: '', //编辑时，单号
      curBranch: '',
      arrCurStore: [],
      arrChkPayTypeUsed: [], //选中支付类型
      payDetails: [], //支付类型详情
      curReceipt: '',
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
        Account: []
      },
      sepcialBankInfo: {}
    }
  },
  components: {
    goodsList,
    supplierList,
    storeList,
  },
  computed: {
    //计算当前可用的预支付方式
    computedSupplierPayType() {
      let arrTemp = [];
      return this.editInfo.Account || [];
    },
    //计算预支付方式中是否有返利
    computedIsWithRebate() {
      let is = false;
      let arrChks = this.computedSupplierPayType;
      for (let i = 0; i < arrChks.length; i++) {
        let item = arrChks[i];
        for (let key in item) {
          if (item.CanUsedProId != undefined || item.CanUsedCategory != undefined) {
            is = true;
            break;
          }
        }
        if (is == true) break;
      }
      return is;
    },
    //计算是否勾选返利
    computedIsShowUseRebate() {
      if (this.computedIsWithRebate) {
        if (_.indexOf(this.arrChkPayTypeUsed, 11) > -1) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    //计算返利按钮是否可用
    computedIsRebateCanBeUsed() {
      if (!this.computedIsWithRebate) {
        return false;
      }
      let me = this;
      let goodsList = this.editInfo.Details;
      let isTempResult = false;
      for (let i = 0; i < goodsList.length; i++) {
        if (this.isRebated(goodsList[i])) {
          isTempResult = true;
          break;
        }
      }
      if (!isTempResult) {
        for (let i = 0; i < this.arrChkPayTypeUsed.length; i++) {
          if (this.arrChkPayTypeUsed[i] == 11) {
            this.arrChkPayTypeUsed.splice(i, 1);
            break;
          }
        }
      }
      return isTempResult;
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
    //计算商品总数
    goodsAddedCount() {
      var count = 0;
      this.editInfo.Details.forEach(function(item) {
        let c = !validatorManu.isPosInteger(item.ProCount) ? 0 : item.ProCount;
        count += parseInt(c);
      });
      return count;
    },
    //计算总价
    goodsAddedAmount() {
      var amount = 0;
      let me = this;
      this.editInfo.Details.forEach(function(item) {
        let c = !validatorManu.isPosInteger(item.ProCount) ? 0 : item.ProCount;
        amount += me.getProAmount(item);
      });
      return amount.toFixed(2);
    },
    //计算应付
    goodsAddedAmountShouldPay() {
      let goodsAmount = this.goodsAddedAmount;
      this.computedArrPrePayUsed.forEach(item => {
        goodsAmount -= item.PayAmount;
      });
      return (goodsAmount - 0).toFixed(2);
    },
    //计算预先使用支付类型金额
    computedArrPrePayUsed() {
      let arrTemp = [];
      let me = this;
      let goodsAmount = this.goodsAddedAmount;
      //计算返利可用值
      let rebateAmount = 0;
      if (this.computedIsWithRebate) {
        this.editInfo.Details.forEach(item => {
          if (item.isRebated) {
            rebateAmount += me.getProAmount(item);
          }
        });
      }
      let rebateUsed = 0;
      this.computedSupplierPayType.forEach(item => {
        if (_.indexOf(me.arrChkPayTypeUsed, item.PayType) > -1) {
          let curPay = item;
          let objTemp = {};
          objTemp.PayTitle = curPay.PayTitle;
          objTemp.PayType = curPay.PayType;
          if (me.computedIsWithRebate && ((item.CanUsedProId && item.CanUsedProId.length) || (item.CanUsedCategory && item.CanUsedCategory.length))) {
            objTemp.PayAmount = rebateAmount > curPay.Amount ? curPay.Amount : rebateAmount;
          } else {
            if (item.PayType == 11) {
              objTemp.PayAmount = goodsAmount > me.realpayRebate ? me.realpayRebate : goodsAmount;
            } else {
              objTemp.PayAmount = goodsAmount > curPay.Amount ? curPay.Amount : goodsAmount;
            }
          }
          goodsAmount = (goodsAmount - objTemp.PayAmount).toFixed(2);
          arrTemp.push(objTemp);
        }
      });
      return arrTemp;
    },
  },
  methods: {
    initPageData() {
      this.curCode = this.$route.params.pocode || '';
      this.curCode = this.curCode == 0 ? '' : this.curCode;
      var me = this;
      this.getUserList();
      if (!this.curCode) {
        this.initData();
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
            me.editInfo.Code = me.curCode;
            me.curReceipt = data.Receipt;
            me.payDetails = data.PayDetails;
          }
        });
      }
    },
    initData() {
      let me = this;
      this.computedPayType.length > 0 && (this.editInfo.PayType = this.computedPayType[0].key);
      me.arrChkPayTypeUsed = [];
      me.editInfo.Details = [];
      me.editInfo.Receipt = 0;
      me.editInfo.DateAdded = zmm_date.nowDate().ymdhmms;
      me.editInfo.UserNameAdded = localStorage.userName;
    },
    //选择供应商弹窗
    selectSupplier() {
      this.isShowSupplierSelect = true;
    },

    //计算单个商品总价
    getProAmount(item) {
      return (item.ProCount * item.ProPrice * (100 + item.TaxRate) / 100) || 0;
    },
    //显示返利小标记
    isRebated(item) {
      let arrPayTypes = this.computedSupplierPayType;
      let arrProId = [];
      let arrCategory = [];
      let isWithRebate = false;
      let isCanBreak = false;
      for (let i = 0; i < arrPayTypes.length; i++) {
        let objCurType = arrPayTypes[i];
        if (objCurType.PayType == 11) {
          isWithRebate = true;
        }
        for (let key in objCurType) {
          if (key.indexOf('CanUsedProId') > -1) {
            if (objCurType[key].length) {
              arrProId = objCurType[key].split(',');
            } else if (objCurType['CanUsedCategory'].length) {
              arrCategory = objCurType['CanUsedCategory'].split(',')
            }
            isCanBreak = true;
            break;
          }
        }
        if (isCanBreak) break;
      }
      let isRebated = false;
      if (arrCategory.length) {
        if (_.indexOf(arrCategory, itemCategory + '') > -1) {
          isRebated = true;
        }
      } else if (arrProId.length) {
        if (_.indexOf(arrProId, item.ProId + '') > -1) {
          isRebated = true;;
        }
      } else if (isWithRebate) {
        isRebated = true;
      }
      return item.isRebated = isRebated;
    },
    //选择商品
    selectedGoods_Click() {
      if (!this.editInfo.StoreId) {
        showTips('请先选择分仓', 'error');
        return;
      }
      this.showGoodsList = true;
    }, //选择分仓弹窗
    selectStore() {
      this.isShowStoreSelect = true;
    },
    delGoods_Click(item) {
      this.editInfo.Details.$remove(item);
    },
    selectHistoryPrice(item, price, e) {
      item.ProPrice = price;
      $(e.target).closest('.history-price').hide();
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
          if (!me.curCode) {

            me.editInfo.HandlerId = data[0].Id;
          }
        }
      })
    },
    realpayRebate_Blur(v) {
      if (!validatorManu.isEmpty(this.realpayRebate) && !validatorManu.isMoney(this.realpayRebate)) {
        showTips('请输入合法金额数值', 'error');
        this.realpayRebate = '';
      }
      if (this.realpayRebate > v) {
        showTips('不能大于可用返利，请检查', 'error');
        this.realpayRebate = v;
      }
    },
    save_Click(v, e) {
      let me = this;
      var para = this.editInfo;
      para.Status = v;
      para.Receipt = this.curReceipt ? 1 : 0;
      if (!para.SupplierId) {
        showTips('请先选择供应商家', 'error');
        return;
      }
      if (!para.StoreId) {
        showTips('请先选择分仓', 'error');
        return;
      }
      if (!this.editInfo.PayType) {
        showTips('请先配置结算方式', 'error');
        return;
      }
      para.HandlerName = _.find(this.dataIn.arrUserList, {
        Id: para.HandlerId
      }).UserName;

      if (this.editInfo.Details.length == 0) {
        showTips('请先选择商品', 'error');
        return;
      }
      if (!zmm_validator(this.$el)) {
        return;
      }
      para.AuditingString = [];
      para.PayDetails = this.computedArrPrePayUsed;
      let API = this.isUpdating ? this.APILIST.UPDATE : this.APILIST.INSERT;
      fetchData({
        API,
        target: e.target,
        para,
        callback(data) {
          // me.curCode = '';
          me.$router.go({
            name: 'purchaseOrder',
          });
        }
      })
    }
  },
  created() {
    this.initPageData();

  },
  watch: {
    payDetails(newVal) {
      let arrTemp = [];
      for (let i = 0; i < newVal.length; i++) {
        arrTemp.push(newVal[i].PayType - 0);
        if (newVal[i].PayType == 11) {
          this.realpayRebate = newVal[i].PayAmount;
        }
      }
      this.arrChkPayTypeUsed = [];
      this.arrChkPayTypeUsed = arrTemp;
    }
  }
}
</script>
