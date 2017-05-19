<template>
  <div class="main" v-cloak>
    <div class="content-title">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div><span v-if="curCode.length>0">编辑</span><span v-else>添加</span>收款单
    </div>
    <div class="content-field">
      <div class="content-large w70p">
        <b class="text-warning pl20" v-if="curCode.length>0">收款单号：{{curCode}}</b>
        <div class="invoices-detail  set w6em" style="padding:30px 60px;margin:10px 0;">
          <h2 class="super-big-title"><span class="text">现 金</span></h2>
          <dl class="item">
            <dt class="title">类型<span v-if="curCode.length>0">：</span></dt>
            <dd class="content" v-if="curCode.length>0">
              {{editInfo.CustomerType==0?'供应商':'客户'}}
            </dd>
            <dd class="content" v-else>
              <label class="radio">
                <input type="radio" name="customerType" v-model="editInfo.CustomerType" value=0><span class="icon"></span>供应商</label>
              <label class="radio ml20">
                <input type="radio" name="customerType" v-model="editInfo.CustomerType" value=1><span class="icon"></span>客户</label>
            </dd>
          </dl>
          <dl class="item">
            <dt class="title">名称<span v-if="curCode.length>0">：</span></dt>
            <dd class="content" v-if="curCode.length>0">
              {{editInfo.CustomerName}}
            </dd>
            <dd class="content area-box" v-else>
              <div class="intelligent-match" v-show="editInfo.CustomerType==1">
                <span class="select-box">
                <input type="search" class="com-ipt" placeholder="关键字" v-model="intelligentMatch.customerName" :title="intelligentMatch.customerName" @focus="IMIptFocus()" @input="IMIptInput()">
                <i class="icon" title="点击选择客户" @click="selectCustomer()"></i>
              </span>
                <ul class="list" v-show="intelligentMatch.isShow&&computedFilterCustomerInfo.length>0">
                  <li class="item" v-for="item in computedFilterCustomerInfo" @click="selectedThisCustomerId(item)">{{item.Name}}</li>
                </ul>
              </div>
              <div v-else>
                <span class="select-box" @click="selectSupplier()">
                  <input type="text" :title="editInfo.SupplierName" placeholder="选择供应商" readonly v-model="editInfo.SupplierName">
                  <i class="icon" title="点击选择供应商"></i>
                </span>
              </div>
            </dd>
          </dl>
          <dl class=" set item">
            <dt class="title">
              <dd class="content set p20 border-box pl30" style="margin-left:3.8em">
                <dl class="item">
                  <dt class="title">
                    <b>账户余额：</b><span v-if="curCode.length>0"> {{editInfo.CashAmount}} </span><span v-else> {{computedRemain}} </span>元
                  </dt>
                </dl>
                <dl class="item">
                  <dt class="title">
                    <b>本次收款：</b>
                  </dt>
                  <dd class="content">
                    <div class="currency-box">
                      <input type="text" v-model="editInfo.ChargeAmount|currencyInNotRequired" data-validate="required money show" placeholder="金额" class="ipt-currency block col-statistics"><span class="line">
                      </span>
                    </div> 元
                    <p class="bg-muted p5 mt5" v-show="creditDebt>0">
                      <label class="checkbox">
                        <input type="checkbox" v-model="editInfo.ReturnMyCredit">冲抵额度<span class="icon"></span></label>
                      <span class="font-small text-light-muted">
                    （应还额度：{{creditDebt}} 元）
                  </span>
                    </p>
                  </dd>
                </dl>
              </dd>
            </dt>
          </dl>
          <dl class="item">
            <dt class="title">备 注</dt>
            <dd class="content">
              <div class="currency-box" style="display:block">
                <input type="text" placeholder="输入备注" class="ipt-currency block" style="width:100%" maxlength="50" v-model="editInfo.Description"><span class="line"></span> </div>
            </dd>
          </dl>
          <dl class="item">
            <dt class="title">
              收款人
            </dt>
            <dd class="content">
              <span class="currency-box">
                <input type="text" placeholder="" class="ipt-currency disabled" readonly v-model="editInfo.UserNameAdded">
                <span class="line"></span>
              </span>
              <span class="ml30">
                  时间<span class="currency-box ml5">
                    <input type="text" placeholder="" class="ipt-currency disabled com-ipt large" readonly v-model="editInfo.DateAdded|datetime">
                    <span class="line"></span>
              </span>
            </dd>
          </dl>
        </div>
        <div class="action text-center">
          <div class="divider-dashed"></div>
          <button class="btn btn-primary big" @click="save_Click(1,$event)">
            提交
          </button>
        </div>
      </div>
    </div>
    <customer-list :show.sync="isShowCustomerSelect" @on-add-after="selectedThisCustomerId"></customer-list>
    <supplier-list :show.sync="isShowSupplierSelect" :supplier-selected.sync="editInfo"></supplier-list>
  </div>
</template>
<script>
import supplierList from 'vues/supplierList.vue';
import customerList from 'vues/customerList.vue';
export default {
  data() {
      return {
        showGoodsList: false,
        isShowSupplierSelect: false,
        isShowCustomerSelect: false,
        APILIST: {
          INSERT: '/Api/Charge/Insert',
          UPDATE: '/Api/Charge/UPDATE',
          PREVIEW: '/Api/Charge/PREVIEW',
          CUSTOMER: '/Api/Customer/AccountList', //客户列表
        },
        dataIn: {
          flowList: [],
          arrSupplier: [],
          arrCustomer: [],
          arrBranch: [],
        },
        intelligentMatch: {
          isShow: false,
          customerName: ''
        },
        isUpdating: false, //是更新
        curCode: '', //编辑时，单号
        creditDebt: 0,
        editInfo: {
          CustomerType: '0',
          Code: '',
          SupplierId: '',
          SupplierName: '',
          TempSupplierAccount: [],
          CustomerId: '',
          CustomerName: '',
          TempCustomerAccount: [],
          TempCustomerId: '',
          DateAdded: '',
          ChargeAmount: '',
          AccountType: 12,
          UserNameAdded: '',
          ReturnMyCredit: 0,
          Description: '',
        },
      }
    },
    components: {
      supplierList,
      customerList,
    },
    computed: {
      //计算当前流程输入
      curAuditingSteps() {
        let curAuditingSteps = [];
        for (let i = 0; i < this.dataIn.flowList.length; i++) {
          if (this.editInfo.ChargeAmount < this.dataIn.flowList[i].AmountMin) {
            curAuditingSteps = this.dataIn.flowList[--i].AuditingSteps;
            break;
          } else {
            curAuditingSteps = this.dataIn.flowList[i].AuditingSteps;
          }
        }
        return curAuditingSteps;
      },
      //智能匹配客户
      computedFilterCustomerInfo() {
        let me = this;
        if (validatorManu.isEmpty(this.intelligentMatch.customerName)) {
          return this.dataIn.arrCustomer;
        } else {
          return this.dataIn.arrCustomer.filter((item) => {
            return item.Name.indexOf(me.intelligentMatch.customerName.trim()) > -1;
          })
        }
      },
      //账户余额
      computedRemain() {
        let strTemp = 0;
        let account = [];
        if (this.editInfo.CustomerType == 0) {
          account = this.editInfo.TempSupplierAccount;
        } else {
          account = this.editInfo.TempCustomerAccount;
        }
        let objTemp = _.find(account, {
          PayType: this.editInfo.AccountType
        });
        this.creditDebt = objTemp ? objTemp.CreditDebt : 0;
        strTemp = objTemp ? objTemp.Amount : 0;
        return strTemp;
      },
    },
    methods: {
      initPageData() {
        var me = this;
        this.curCode = this.$route.params.receCode || '';
        this.curCode = this.curCode == 0 ? '' : this.curCode;
        if (!this.curCode) {
          this.getCustomer();
          this.initData();
        } else {
          fetchData({
            API: this.APILIST.PREVIEW,
            para: {
              'code': this.curCode,
              isEdit: 1 //1为编辑，0是预览
            },
            callback(data) {
              me.isUpdating = true;
              me.editInfo = data;
              me.editInfo.Code = me.curCode;
            }
          });
        }
      },
      initData() {
        this.editInfo.DateAdded = zmm_date.nowDate().ymdhmms;
        this.editInfo.UserNameAdded = localStorage.userName;
      },

      //客户信息
      getCustomer() {
        fetchData({
          API: this.APILIST.CUSTOMER,
          para: {
            pagesize: 10000,
          },
          callback: data => {
            this.dataIn.arrCustomer = data.Data;
            if (!this.curCode) {
              if (data.Data[0]) {
                this.intelligentMatch.customerName = data.Data[0].Name;
                this.editInfo.TempCustomerId = data.Data[0].Id;
                this.editInfo.TempCustomerAccount = data.Data[0].Account;
              }
            }
          }
        })
      },
      //选择供应商弹窗
      selectSupplier() {
        this.isShowSupplierSelect = true;
      }, //选择客户弹窗
      selectCustomer() {
        this.isShowCustomerSelect = true;
      },
      //客户智能感知下拉
      IMIptFocus() {
        this.intelligentMatch.isShow = true;
      },
      IMIptInput() {
        this.editInfo.TempCustomerId = '';
      },
      selectedThisCustomerId(item) {
        this.editInfo.TempCustomerId = item.Id;
        this.intelligentMatch.customerName = item.Name;
        this.editInfo.TempCustomerAccount = item.Account;
        this.intelligentMatch.isShow = false;
      },
      save_Click(v, e) {
        let me = this;
        if (this.editInfo.CustomerType == 0) {
          if (!this.editInfo.SupplierId) {
            showTips('请先选择供应商', 'error');
            return;
          }
          this.editInfo.CustomerId = this.editInfo.SupplierId;
          this.editInfo.CustomerName = this.editInfo.SupplierName;
        } else {
          if (!this.editInfo.TempCustomerId) {
            showTips('请先选择客户', 'error');
            return;
          }
          this.editInfo.CustomerId = this.editInfo.TempCustomerId;
          this.editInfo.CustomerName = this.intelligentMatch.customerName;
        }
        var para = this.editInfo;
        if (!zmm_validator(this.$el)) {
          return;
        }
        para.ReturnMyCredit = para.ReturnMyCredit & 1;
        let API = this.isUpdating ? this.APILIST.UPDATE : this.APILIST.INSERT;
        fetchData({
          API,
          target: e.target,
          para,
          callback(data) {
            if (!me.isUpdating) {
              me.$dispatch('on-added-ok');
              me.initPageData();
            }
            me.$router.go({
              name: 'receiveCash',
              params: {
                recTabIndex: 0
              }
            });
          }
        })
      }
    },
    ready() {
      this.initPageData();
    },
}
</script>
