<template>
  <div class="main" v-cloak>
    <h2 class="content-title" v-if="editCode.length>0">
      <span class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </span>
      编辑借机单
    </h2>
    <div :class="{'content-field':editCode.length>0}">
      <div class="filter">
        <table class="mt10">
          <tbody>
            <tr>
              <td><span class="mr5">借机人：</span>
                <span class="currency-box">
                <input type="text" placeholder="" class="ipt-currency" data-validate="required show" v-model="editInfo.BorrowPerson">
                <span class="line"></span>
                </span>
              </td>
              <td>
                <span class="mr5 ml20">出货机构</span>
                <select class=" com-ipt" v-model="editInfo.BranchId" @change="branch_Change();">
                  <option v-for="item of dataIn.arrBranch" :value="item.Id">
                    {{item.Name}}
                  </option>
                </select>
              </td>
              <td>
                <span class="mr5 ml20">出货分仓</span>
                <select class=" com-ipt" v-model="editInfo.StoreId">
                  <option :value="item.Id" v-for="item in computedStoresOfBranch">
                    {{item.Name}}
                  </option>
                </select>
              </td>
              <td>
                <span class="ml20">
                  <span class="mr5">预计归还时间</span>
                <span class="date-field">
            <input type="text" v-model="editInfo.MaybeReturnDate|date"  readonly="" placeholder="选择时间"  onclick="WdatePicker({minDate: '%y-%M-%d %H'})">
            <i class="fa fa-calendar icon"></i>
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
              <th>商品编码</th>
              <th>商品名称</th>
              <th style="width:110px">数量</th>
              <th style="width:160px;">备注</th>
              <th style="width:44px;"></th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <td colspan="2" class="text-right"><b>合计：</b></td>
              <td><b>{{goodsAddedCount}}</b></td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="item of editInfo.Details">
              <td>
                {{item.ProId}}
              </td>
              <td>{{item.ProName}}</td>
              <td>
                <input type="number" min=1 placeholder="输入数量" v-model="item.ProCount" class="com-ipt x-small" data-validate="required posInteger popShow" maxlength="9">
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
        <button class="btn btn-default big" @click="save_Click(0,$event)">保存草稿</button>
        <button class="btn btn-primary big" @click="save_Click(1,$event)">
          提交
        </button>
      </div>
    </div>
    <goods-list :show.sync="showGoodsList" :goods-added-list.sync="editInfo.Details" @on-add-after="goodsAdded()" only-pro=1></goods-list>
  </div>
</template>
<script>
/**
 * 借机单添加编辑页面
 * 2017-01-12
 * zhao.liubin@zol.com.cn
 */
import goodsList from 'vues/goodsList.vue';
export default {
  data() {
      return {
        showGoodsList: false,
        APIS: {
          // READY: 'Api/SO/SCInsertReady', //准备数据
          INSERT: '/Api/Borrow/Insert', //默认添加新数据
          PREVIEW: '/Api/Borrow/Preview', //编辑时读取数据
        },
        curAPI: '',
        isUpdate: false,
        dataIn: {
          flowList: [],
          stores: [],
          datalist: {},
          arrBranch: []
        },
        editCode: '', //编辑时，单号
        editInfo: {
          DateAdded: '',
          Details: [],
          BranchId: '',
          StoreId: '',
          UserNameAdded: '',
          BorrowPerson: '',
          MaybeReturnDate: ''
        },
      }
    },
    components: {
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
    },
    methods: {
      initPageData() {
        this.editCode = this.$route.params.cbeCode || '';
        var me = this;
        this.curAPI = this.APIS.INSERT;
        this.getBranch();
        if (!me.editCode) {
          me.initData();
        } else {
          fetchData({
            API: me.APIS.PREVIEW,
            para: {
              'code': me.editCode
            },
            callback(data) {
              me.isUpdate = true;
              me.editInfo = data;
            }
          });
        }
      },
      //添加完成初始化并清空已填数据
      initData() {
        let me = this;
        me.editInfo.Details = [];
        me.editInfo.BorrowPerson = '';
        me.editInfo.UserNameAdded = localStorage.userName;
        me.editInfo.DateAdded = zmm_date.nowDate().ymdhmms;
      },
      //审核流程列表
      getFlowList() {
        let me = this;
        fetchData({
          API: '/Api/Misc/WorkFlowListByType',
          para: {
            BillType: 71
          },
          callback(data) {
            me.dataIn.flowList = data;
          }
        })
      },
      //选择商品
      selectedGoods_Click() {
        this.showGoodsList = true;
      },
      delGoods_Click(item) {
        this.editInfo.Details.$remove(item);
      },
      // 机构获取
      getBranch() {
        let me = this;
        fetchData({
          API: 'api/USER/STORE',
          para: {
            action: this.action //限制只能采购
          },
          callback(data) {
            me.dataIn.arrBranch = data;
            if (!me.curCode) {
              if (data.length) {
                me.editInfo.BranchId = data[0].Id;
                me.editInfo.StoreId = data[0].Store[0] ? data[0].Store[0].Id : '';
              }
            }
          }
        })
      },
      //仓随构变
      branch_Change() {
        this.editInfo.StoreId = this.computedStoresOfBranch[0] ? this.computedStoresOfBranch[0].Id : '';
      },
      save_Click(v, e) {
        let me = this;
        var para = this.editInfo;
        para.Status = v;
        var objDl = this.dataIn.datalist;
        if (!zmm_validator(me.$el)) {
          return;
        }
        if (!this.editInfo.MaybeReturnDate) {
          showTips('请填写归还时间', 'error');
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
        fetchData({
          API: this.curAPI,
          target: e.target,
          para,
          callback(data) {
            if (!me.isUpdate) {
              me.$dispatch('on-added-ok');
              me.initData();
            }
            me.$router.go({
              name: 'borrowOrder',
              params: {
                cboTabIndex: 1
              }
            })
          }
        })
      }
    },
    ready() {
      this.initPageData();
      this.getFlowList();
    }
}
</script>
