<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>出库预告</h2>
        <div class="body">
          <div class="content" style="width:800px">
            <div class="content-field invoices">
              <h2 class="header">出库预告</h2>
              <p class="invoices-summary">
                <strong class="ml20 text-warning">销售单号：{{dataIn.datalist.Code}}</strong>
              </p>
              <div class="invoices-detail">
                <div>
                  <table class="table-intro table">
                    <thead>
                      <tr>
                        <td style="width:50%">
                          <span class="title">
                          &#12288;客户：
                        </span>
                          <span class="content">
                          {{dataIn.datalist.CustomerName}}
                        </span>
                        </td>
                        <td>
                          预告方式：
                          <label class="radio">
                            <input type="radio" v-model="foreshowType" value="0"><span class="icon"></span>全部预告</label>
                          <label class="radio">
                            <input type="radio" v-model="foreshowType" value=1><span class="icon"></span>部分预告</label>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="title">
                            出库分仓：
                          </span>
                          <select v-model="StoreId" @change="getProRemainByStore()">
                            <option v-for="item in storeList" :value="item.Id">{{item.Name}}</option>
                          </select>
                        </td>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div class="table-list">
                  <table class="table table-bordered  text-center">
                    <thead>
                      <tr>
                        <th>商品名称</th>
                        <th>仓库存量</th>
                        <th>数量</th>
                        <th>已预告</th>
                        <th>本次预告</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item of dataIn.datalist.Details">
                        <td>{{item.ProName}}<i class="icon-gift" v-if="item.ProType==0">礼</i></td>
                        <td>{{item.Remain}}</td>
                        <td>{{item.ProCount}}</td>
                        <td>{{item.ProCount1}}</td>
                        <td>
                          <input v-if="foreshowType==0" type="text" placeholder="" :value="item.ProCount-item.ProCount1" class="com-ipt readonly-like-text small text-center" readonly>
                          <input v-else type="number" :placeholder="'最大：'+(item.ProCount-item.ProCount1)" class="com-ipt small text-center" :value=1 v-model="item.proCountManu|numberIn" @blur="proCount_Blur(item,$event)" min=0 :max="item.ProCount-item.ProCount1">
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="made-info">
                  <table class="table-intro table">
                    <thead>
                      <tr>
                        <td style="width:50%">
                          <span class="title">
                              &#12288;预告人：
                            </span>
                          <span class="content">
                              {{dataIn.foreshowUser}}&nbsp;
                            </span>
                        </td>
                        <td>
                          <span class="title">预告日期：</span>
                          <span class="content">{{dataIn.dateNow}}</span>
                        </td>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">提交</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  nowDate
} from 'modules/common/date.js';
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    pCode: '',
    storeList: []
  },
  data() {
    return {
      isOk: true,
      foreshowType: 0,

      dataIn: {
        datalist: {},
        dateNow: nowDate().ymdhmms,
        foreshowUser: '',
      },
      Pros: [],
      StoreId: 0
    }
  },
  computed: {

  },
  components: {},
  methods: {
    initPageData() {
      var me = this;
      this.foreshowType = 0;
      this.dataIn.foreshowUser = localStorage.userName || '';
      fetchData({
        API: 'api/sO/sCPreview',
        para: {
          'code': me.pCode
        },
        callback(data) {
          // console.log(data);
          me.dataIn.datalist = data;
          me.StoreId = me.storeList[0] ? me.storeList[0].Id : 0;
          me.Pros = [];
          me.dataIn.datalist.Details.forEach(item => {
            item.Remain = 0;
            me.Pros.push(item.ProId);
          });
          me.getProRemainByStore();
        }
      })
    },
    //根据仓库ID响应商品数量
    getProRemainByStore() {
      let me = this;
      //
      fetchData({
        API: 'API/Product/Inventory',
        para: {
          StoreId: this.StoreId,
          Pros: this.Pros
        },
        callback(data) {
          // console.log(data);
          var arrDetailsTemp = me.dataIn.datalist.Details;
          me.dataIn.datalist.Details = [];
          // arrDetailsTemp.forEach(item => {
          //   item.Remain = 0;
          //   var curPro = _.find(data, {
          //     ProId: item.ProId
          //   });
          //   //
          //   if (curPro) {
          //     item.Remain = curPro.Amount;
          //   }
          // });
          for (let i = 0; i < data.length; i++) {
            arrDetailsTemp[i].Remain = data[i].Amount;
          }
          //
          // console.log(arrDetailsTemp);
          setTimeout(function() {
            me.dataIn.datalist.Details = arrDetailsTemp;
          }, 0);

        }
      })
    },
    proCount_Blur(item, e) {
      var t = e.target;
      if (t.value > (item.ProCount - item.ProCount1)) {
        showTips('本次预告数量不能大于可预告数量，请检查', 'error');
        t.focus();
        this.isOk = false;
      } else {
        this.isOk = true;
      }
    },
    onSubmit_Click() {
      let me = this;
      var para = {};
      para.SalesContractCode = this.pCode;
      para.StoreId = this.StoreId;
      para.Details = [];
      if (this.foreshowType == 0) {
        para.Details = this.dataIn.datalist.Details;
        para.Details.forEach(item => {
          item.ProCount = item.ProCount - item.ProCount1;
        })
      } else {
        this.dataIn.datalist.Details.forEach((item, i) => {
          let objTemp = {};
          objTemp.ProId = item.ProId;
          objTemp.ProCount = item.proCountManu;
          para.Details[i] = objTemp;
        })
      }
      if (!this.isOk) {
        showTips('本次预告数量不能大于可预告数量，请检查', 'error');
        return;
      }
      // console.log(para);
      fetchData({
        api: '/Api/SO/SOInsert',
        para,
        callback(data) {
          // console.log(data);
          me.show = false;
          me.$dispatch('on-after-submit');
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.initPageData();
      }
    }
  }
}
</script>
