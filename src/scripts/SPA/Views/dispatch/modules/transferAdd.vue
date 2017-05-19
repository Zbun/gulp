<template>
  <div class="main" v-cloak>
    <h1 class="content-title" v-if="toeCode.length>0">
      <span class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </span> 编辑调拨单
    </h1>
    <div :class="{'content-field':toeCode.length>0}">
      <div class="filter">
        <div class="mt5">
          选择类型：
          <label class="radio">
            <input type="radio" value=0 v-model="editInfo.TransferType"><span class="icon"></span>客户调剂</label>
          <label class="radio">
            <input type="radio" value=1 v-model="editInfo.TransferType"><span class="icon"></span>平台调剂</label>
        </div>
        <div class="set mt5">
          <dl class="item">
            <dt class="title text-left">
              <button class="btn  btn-highlight" @click="selectCustomer_Click()">
                <b>选择客户</b>
              </button>
            </dt>
            <dd class="content pl10">
              <span class="switch-location"><i class="icon"  @click="switchCustomer_Click" title="切换调出调入"></i></span>
              <p>调出方：<span class="currency-box">
                <input type="text" placeholder="调出方" class="ipt-currency com-ipt x-large" readonly v-model="computedOutCustomerName">
                <span class="line"></span>
                </span>
              </p>
              <p class="mt10">
                调入方：<span class="currency-box">
                <input type="text" placeholder="调入方" class="ipt-currency com-ipt x-large" readonly v-model="computedInCustomerName">
                <span class="line"></span>
                </span>
              </p>
            </dd>
          </dl>
        </div>
        <p class="mt5">
          <button class="btn  btn-highlight" @click="selectGoods_Click()">
            <b>选择商品</b>
          </button>
        </p>
        <table class="table table-bordered mt10 text-center">
          <thead>
            <tr>
              <th>商品名称</th>
              <th style="width:130px">数量</th>
              <th style="width:280px">备注</th>
              <th></th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <td><b>合计</b></td>
              <td class="col-statistics"><b>{{goodsAddedCount}}</b></td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="item of editInfo.Details">
              <td>{{item.ProName}}<i class="icon-gift" v-if="item.ProType==0">礼</i></td>
              <td class="col-statistics">
                <input type="number" min=1 placeholder="输入数量" v-model="item.ProCount" class="com-ipt x-small" data-validate="required posInteger popShow" maxlength="9">
              </td>
              <td>
                <input type="text" class="com-ipt large" placeholder="输入备注" v-model="item.Description" maxlength="50">
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
                    摘要&nbsp;
                  </span>
              <span class="content">
                <span class="currency-box">
              <input type="text" placeholder="输入摘要" class="ipt-currency  com-ipt x-large"  v-model="editInfo.Description">
              <span class="line"></span>
              </span>
              </span>
            </td>
          </tr>
        </table>
      </div>
      <div class="audit-flow" v-show="curAuditingSteps.length>0">
        <span class="title">
              审批流程&nbsp;
            </span>
        <span class="content list">
              <span class="item" v-for="item in curAuditingSteps">
                {{item.UserName}}
              </span>
        </span>
      </div>
      <div class="action">
        <div class="divider-dashed"></div>
        <button class="btn btn-default big" @click="save_Click(0)">保存草稿</button>
        <button class="btn btn-primary big" @click="save_Click(1)">
          提交
        </button>
      </div>
    </div>
    <pop-customer :show.sync="isShowCustomer" :customers="arrSelectedCustomer"></pop-customer>
    <goods-list :show.sync="showGoodsList" :goods-added-list.sync="editInfo.Details"></goods-list>
  </div>
</template>
<script>
import {
  nowDate
} from 'modules/common/date.js';
import goodsList from 'vues/goodsList.vue';
import popCustomer from './../popup/popCustomer.vue';
export default {
  data() {
      return {
        isShowCustomer: false,
        showGoodsList: false,
        APIS: {
          INSERT: '/Api/Transfer/CTInsert', //接口地址，默认为添加
          PREVIEW: '/Api/Transfer/CTPreview', //编辑初始化数据
          UPDATE: '/Api/Transfer/CTUpdate'
        },
        api: '',
        arrSelectedCustomer: [],
        dataIn: {
          flowList: [],
          customerList: [],
        },
        toeCode: '', //编辑时，单号
        editInfo: {
          OutCustomerId: '',
          OutCustomerName: '',
          InCustomerId: '',
          InCustomerName: '',
          DateAdded: '',
          Details: [],
          Description: '',
          UserNameAdded: '',
          TransferType: 0
        }
      }
    },
    components: {
      popCustomer,
      goodsList
    },
    computed: {
      goodsAddedCount() {
        var count = 0;
        this.editInfo.Details.forEach(function(item) {
          let c = !validatorManu.isPosInteger(item.ProCount) ? 0 : item.ProCount;
          count += parseInt(c);
        });
        return count;
      },
      //计算当前流程输入
      curAuditingSteps() {
        let curAuditingSteps = [];
        for (let i = 0; i < this.dataIn.flowList.length; i++) {
          if (this.goodsAddedCount < this.dataIn.flowList[i].AmountMin) {
            curAuditingSteps = this.dataIn.flowList[--i].AuditingSteps;
            break;
          } else {
            curAuditingSteps = this.dataIn.flowList[i].AuditingSteps;
          }
        }
        return curAuditingSteps;
      },
      //调出方名字
      computedOutCustomerName() {
        return this.arrSelectedCustomer[0] ? this.arrSelectedCustomer[0].Name : '';
      },
      //调出方ID
      computedOutCustomerId() {
        return this.arrSelectedCustomer[0] ? this.arrSelectedCustomer[0].Id : '';
      },
      //调入方名字
      computedInCustomerName() {
        return this.arrSelectedCustomer[1] ? this.arrSelectedCustomer[1].Name : '';
      },
      //调入方ID
      computedInCustomerId() {
        return this.arrSelectedCustomer[1] ? this.arrSelectedCustomer[1].Id : '';
      },
    },
    methods: {
      initPageData() {
        this.toeCode = this.$route.params.toeCode || '';
        var me = this;
        if (!me.toeCode) {
          me.initData();
        } else {
          fetchData({
            API: this.APIS.PREVIEW,
            para: {
              'code': me.$route.params.toeCode
            },
            callback(data) {
              // console.log(data);
              me.api = me.APIS.UPDATE;
              me.editInfo = data;
              me.arrSelectedCustomer = [];
              let objOut = {};
              objOut.Id = data.OutCustomerId;
              objOut.Name = data.OutCustomerName;
              me.arrSelectedCustomer.push(objOut);
              let objIn = {};
              objIn.Id = data.InCustomerId;
              objIn.Name = data.InCustomerName;
              me.arrSelectedCustomer.push(objIn);
            }
          });
        }
      },
      outStore_Click() {
        this.editInfo.Details = [];
      },
      //初始化清空数据
      initData() {
        let me = this;
        this.api = this.APIS.INSERT;
        me.editInfo.DateAdded = nowDate().ymdhmms;
        me.editInfo.UserNameAdded = localStorage.userName;
        me.editInfo.Details = [];
        me.editInfo.Description = '';
        me.arrSelectedCustomer = [];
      },
      //审核流程列表
      getFlowList() {
        let me = this;
        fetchData({
          API: '/Api/Misc/WorkFlowListByType',
          para: {
            BillType: 61
          },
          callback(data) {
            // console.log(data);
            me.dataIn.flowList = data;
          }
        })
      },
      //选择客户
      selectCustomer_Click() {
        this.isShowCustomer = true;
      },
      //调换调出、调入
      switchCustomer_Click() {
        this.arrSelectedCustomer.reverse();
      },
      //选择商品
      selectGoods_Click() {
        this.showGoodsList = true;
      },
      delGoods_Click(item) {
        this.editInfo.Details.$remove(item);
      },

      save_Click(v) {
        let me = this;
        var para = this.editInfo;
        para.Status = v;
        this.editInfo.OutCustomerId = this.computedOutCustomerId;
        if (!this.editInfo.OutCustomerId) {
          showTips('需要选择调出方客户，请选择', 'error');
          return;
        }
        this.editInfo.InCustomerId = this.computedInCustomerId;
        if (!this.editInfo.InCustomerId) {
          showTips('需要选择调入方客户，请选择', 'error');
          return;
        }

        if (this.editInfo.Details.length == 0) {
          showTips('请先选择商品', 'error');
          return;
        }
        if (!zmm_validator(this.$el)) {
          return;
        }
        para.OutCustomerName = this.computedOutCustomerName;
        para.InCustomerName = this.computedInCustomerName;
        // console.log(para);
        // return;
        fetchData({
          API: this.api,
          para,
          callback(data) {
            if (!/update/i.test(me.api)) {
              me.$dispatch('on-added-ok');
            }
            me.$router.go({
              name: 'transferOrder',
              params: {
                dtoTabindex: 1
              }
            })
          }
        })
      }
    },
    ready() {
      this.getFlowList();
      this.initPageData();
    }
}
</script>
