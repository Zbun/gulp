<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
      <span class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </span><span v-if="curCode.length>0">编辑</span><span v-else>添加</span>调拨单
    </h1>
    <div class="content-field">
      <div class="filter">
        <p class="mt10">
          <strong class="text-warning" v-if="curCode.length>0">单号：{{curCode}}</strong></p>
        <table>
          <tbody>
            <tr>
              <td>
                <span class="mr5 required-mark">调拨类型</span>
                <select v-model="editInfo.BillType">
                  <option value="0">同价调拨</option>
                  <option value="1">异价调拨</option>
                </select>
                <span class="ml20 required-mark">
                  经手人
                  <select class="com-ipt ml5" v-model="editInfo.HandlerId">
                    <option :value="item.Id" v-for="item in dataIn.arrUserList">{{item.UserName}}</option>
                  </select>
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="mr5 mr20" v-show="editInfo.OutBranchName">
                  调出机构：{{editInfo.OutBranchName}}
                </span>
                <span><span class="mr5 required-mark">调出分仓</span>
                <span class="select-box" @click="selectStoreOut()">
                  <input type="text" :title="editInfo.OutStoreName" placeholder="选择分仓" readonly v-model="editInfo.OutStoreName">
                  <i class="icon" title="点击选择分仓"></i>
                </span>
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="mr5 mr20" v-show="editInfo.InBranchName">
                  调入机构：{{editInfo.InBranchName}}
                </span>
                <span><span class="mr5 required-mark">调入分仓</span>
                <span class="select-box" @click="selectStoreIn()">
                  <input type="text" :title="editInfo.InStoreName" placeholder="选择分仓" readonly v-model="editInfo.InStoreName">
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
              <th style="width:130px;">可用/库存</th>
              <th style="width:120px;">单价（元）</th>
              <th style="width:120px;">数量</th>
              <th style="width:120px;">小计（元）</th>
              <th style="width:160px;">备注</th>
              <th style="width:60px;"></th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <td class="text-right" colspan="5"><b>合计：</b></td>
              <td><b class="text-warning">{{computedGoodsAddedCount.Amount}}</b></td>
              <td class="text-right"><b class="text-warning ">
                <span  v-if="computedBillTypeIsSync">
                  {{computedGoodsAddedCount.ProCostPrice|currency}}
                </span>
                <span v-else>{{computedGoodsAddedCount.ProPrice|currency}}</span></b></td>
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
              <td>{{item.ProName}}<i class="icon-gift" v-if="item.ProType==0">礼</i></td>
              <td>
                {{item.AmountCanUsed}}/{{item.Amount}}
              </td>
              <td>
                <span v-if="!computedBillTypeIsSync">
                                  <input :disabled="item.AmountCanUsed<=0" type="text" min=1 placeholder="原价:{{item.ProCostPrice}}" v-model="item.ProPrice" class="com-ipt small text-right" data-validate="required money popShow" maxlength="9">
                </span><span v-else>{{item.ProCostPrice}}</span>
              </td>
              <td>
                <input :disabled="item.AmountCanUsed<=0" :max="item.AmountCanUsed" type="number" min=1 placeholder="输入数量" v-model="item.ProCount" class="com-ipt small" data-validate="required posInteger popShow" maxlength="9">
              </td>
              <td class="text-right">
                <span v-if="computedBillTypeIsSync">
                  {{item.ProCostPrice*item.ProCount|currency}}
                </span>
                <span v-else>{{item.ProPrice*item.ProCount|currency}}</span>
              </td>
              <td>
                <input type="text" :disabled="item.AmountCanUsed<=0" class="com-ipt large" placeholder="输入备注" v-model="item.Description" maxlength="50">
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
        <button class="btn btn-primary big" @click="save_Click()">
          提交
        </button>
      </div>
    </div>
    <goods-list :show.sync="showGoodsList" :store-id="editInfo.OutStore" :goods-added-list.sync="editInfo.Details"></goods-list>
    <store-list :show.sync="isShowStoreSelect" :is-out="isOut" :action="action" :store-selected.sync="editInfo"></store-list>
  </div>
</template>
<script>
import storeList from 'vues/storeList.vue';
import goodsList from 'vues/goodsList.vue';
export default {
  data() {
      return {
        showGoodsList: false,
        isShowStoreSelect: false,
        APILIST: {
          INSERT: '/Api/TransferContract/Insert',
          UPDATE: '/Api/TransferContract/UPDATE',
          PREVIEW: '/Api/TransferContract/Preview',
        },
        curAPI: '',
        isUpdate: false,
        isOut: 1,
        action: 3,
        dataIn: {
          flowList: [],
          Stores: [],
          arrOutBranch: [],
          arrInBranch: [],
          arrUserList: []
        },
        curCode: '', //编辑时，单号
        editInfo: {
          BillType: 0,
          OutBranchId: '',
          OutBranchName: '',
          OutStore: '',
          OutStoreName: '',
          InBranchId: '',
          InBranchName: '',
          InStore: '',
          InStoreName: '',
          HandlerId: '',
          HandlerName: '',
          DateAdded: '',
          Details: [],
          UserNameAdded: '',
        }
      }
    },
    components: {
      goodsList,
      storeList
    },
    computed: {
      computedGoodsAddedCount() {
        var objTemp = {};
        objTemp.Amount = 0;
        objTemp.ProCostPrice = 0;
        objTemp.ProPrice = 0;
        this.editInfo.Details.forEach(function(item) {
          let c = !validatorManu.isPosInteger(item.ProCount) ? 0 : item.ProCount;
          objTemp.Amount += parseInt(c);
          objTemp.ProCostPrice += item.ProCostPrice * c;
          objTemp.ProPrice += item.ProPrice * c;
        });
        return objTemp;
      },
      //计算当前调拨类型
      computedBillTypeIsSync() {
        return this.editInfo.BillType == 0;
      },
      //计算当前所选机构分仓
      computedOutStoreOfBranch() {
        let arrTemp = [];
        if (this.editInfo.OutBranchId > 0) {
          arrTemp = _.find(this.dataIn.arrOutBranch, {
            Id: this.editInfo.OutBranchId
          }).Store;
        }
        return arrTemp;
      },
      computedInStoreOfBranch() {
        let arrTemp = [];
        if (this.editInfo.InBranchId > 0) {
          arrTemp = _.find(this.dataIn.arrInBranch, {
            Id: this.editInfo.InBranchId
          }).Store;
        }
        return arrTemp;
      },
    },
    methods: {
      initPageData() {
        this.curCode = this.$route.params.doCode || '';
        this.curCode = this.curCode == 0 ? '' : this.curCode;
        this.getUserList();
        var me = this;
        if (!me.curCode) {
          me.initData();
        } else {
          fetchData({
            API: this.APILIST.PREVIEW,
            para: {
              isEdit: 1,
              'code': me.curCode
            },
            callback(data) {
              // console.log(data);
              me.isUpdate = true;
              let arrPros = [];
              data.Details.forEach(item => {
                if (data.BillType == 0) {
                  item.ProPrice = '';
                }
                let objTemp = {};
                objTemp.ProId = item.ProId;
                arrPros.push(objTemp);
              });
              fetchData({
                API: '/API/Product/Inventory', //取商品库存
                para: {
                  StoreId: data.OutStore,
                  Pros: arrPros
                },
                callback(data2) {
                  for (let i = 0; i < data2.length; i++) {
                    data.Details[i].Amount = data2[i].Amount;
                  }
                  me.editInfo = data;
                }
              })
            }
          });
        }
      },
      //初始化清空数据
      initData() {
        this.editInfo.DateAdded = zmm_date.nowDate().ymdhmms;
        this.editInfo.UserNameAdded = localStorage.userName;
      },
      //选择商品
      selectedGoods_Click() {
        if (!this.editInfo.OutStore) {
          showTips('请先选择分仓', 'error');
          return;
        }
        this.showGoodsList = true;
      },
      delGoods_Click(item) {
        this.editInfo.Details.$remove(item);
      },
      selectStoreOut() {
        this.action = 3; //调出
        this.isOut = 1;
        this.isShowStoreSelect = true;
      },
      selectStoreIn() {
        this.action = 11;
        this.isOut = 0;
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
            if (!me.curCode) {

              me.editInfo.HandlerId = data[0].Id;
            }
          }
        })
      },
      save_Click() {
        let me = this;
        if (this.editInfo.Details.length == 0) {
          showTips('请先选择商品', 'error');
          return;
        }
        if (this.editInfo.OutStore == this.editInfo.InStore) {
          showTips('同仓不需要调拨，请重新选择', 'error');
          return;
        }

        for (let i = 0; i < this.editInfo.Details.length; i++) {
          if (this.editInfo.Details[i].AmountCanUsed == 0 || this.editInfo.Details[i].ProCount > this.editInfo.Details[i].AmountCanUsed) {
            showTips('所选商品数量不能为零也不能大于可用库存，请检查', 'error');
            return;
          }
        }
        if (!zmm_validator(this.$el)) {
          return;
        }
        if (this.computedBillTypeIsSync) {
          this.editInfo.Details.forEach(item => {
            item.ProPrice = item.ProCostPrice;
          })
        }
        var para = this.editInfo;
        para.HandlerName = _.find(this.dataIn.arrUserList, {
          Id: this.editInfo.HandlerId
        }).UserName;
        // console.log(para)
        let API = this.isUpdate ? this.APILIST.UPDATE : this.APILIST.INSERT;
        fetchData({
          API,
          para,
          callback(data) {
            me.$router.go({
              name: 'dispatchOrder',
              params: {
                doTabIndex: 0
              }
            })
          }
        })
      }
    },
    ready() {
      this.initPageData();

    }
}
</script>
