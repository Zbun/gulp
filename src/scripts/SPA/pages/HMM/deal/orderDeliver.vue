<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="cancelClick">&times;</a>发货</h2>
        <div class="body">
          <div class="content" style="width:800px">
            <div class="gray-box">
              <div class="item">
                <div class="title">
                  <p style="float:left;width:50%">
                    <span class="text-muted fl text-right" style="width:6em">发货单号</span><b class="ml20 text-danger">待生成</b>
                  </p>
                  <span class="text-muted mr20">买家账号</span> {{objDataInfo.RetailerUserName}}
                </div>
                <div class="content">
                  <p>
                    <span class="text-muted fl text-right" style="width:6em">订单号</span><span class="ml20">{{objDataInfo.OrderCode}}</span>
                  </p>
                  <p class="mt5">
                    <span class="text-muted fl text-right" style="width:6em">收货人</span><span class="ml20">{{objDataInfo.RetailerName}}</span>
                  </p>
                  <p class="mt5">
                    <span class="text-muted fl text-right" style="width:6em">联系电话</span><span class="ml20">{{objDataInfo.ReceiverPhone}}</span></p>
                  <p class="mt5">
                    <span class="text-muted fl text-right" style="width:6em">收货地址</span><span class="ml20">{{objDataInfo.AddressInfo}}</span></p>
                  <p class="mt5">
                    <span class="text-muted fl text-right" style="width:6em">买家指定物流</span><span class="ml20">{{objDataInfo.RetailerSelectLogistics}}</span></p>
                  <p class="mt5">
                    <span class="text-muted fl text-right" style="width:6em">留言</span><span class="ml20">{{objDataInfo.Message}}</span></p>
                  </p>
                </div>
              </div>
            </div>
            <div class="mt10">
              <div class="fr">发货方式&nbsp;&nbsp;
                <label class="radio">
                  <input type="radio" value="1" v-model="isAllSend"><span class="icon"></span>全部商品发货</label>
                <label class="radio">
                  <input type="radio" value="0" v-model="isAllSend"><span class="icon"></span>部分商品发货</label>
              </div>
              <b>订单商品</b>
            </div>
            <table class="table-bordered-all table small datalist">
              <thead>
                <tr>
                  <th>商品</th>
                  <th>总数</th>
                  <th>已退款数</th>
                  <th>已发货数</th>
                  <th>可发货数量</th>
                  <th style="width:110px;">发货数</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in objDataInfo.Details" :key="item.ProId">
                  <td>
                    {{item.ProName}}
                  </td>
                  <td class="text-nowrap">
                    {{item.ProCount}}
                  </td>
                  <td class="text-nowrap">
                    {{item.ReturnCount}}
                  </td>
                  <td class="text-nowrap">
                    <span>{{item.SendedCount}}</span>
                  </td>
                  <td class="text-nowrap">
                    {{item.CanSendCount}}
                  </td>
                  <td class="text-nowrap">
                    <span v-if="isAllSend==1">
                      {{item.CanSendCount}}
                    </span>
                    <input v-else type="text" class="com-ipt x-small" placeholder="请输入发货数量" data-validate="required notPositive" v-model="item.RealSendCount">
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td colspan="6">
                    <div class="set w6em">
                      <dl class="item">
                        <dt class="title required-mark">
                          物流公司
                        </dt>
                        <dd class="content">
                          <select v-model="objSendInfo.LogisticsId" data-validate="required" data-validate-text="请选择物流公司">
                            <option value="">请选择</option>
                            <option :value="item.Id" v-for="item in dataIn.arrLogisticsList">
                              {{item.Name}}
                            </option>
                            <option value="0">其他</option>
                          </select>
                        </dd>
                      </dl>
                      <dl class="item">
                        <dt class="title required-mark">
                          物流单号
                        </dt>
                        <dd class="content">
                          <input type="search" v-model="objSendInfo.ExpressCode" placeholder="请填写物流单号" data-validate="required" class="com-ipt x-large">
                        </dd>
                      </dl>
                      <dl class="item">
                        <dt class="title">
                          发货人姓名
                        </dt>
                        <dd class="content">
                          <input type="search" v-model="objSendInfo.SendName" placeholder="请填写发货人姓名" data-validate="required" class="com-ipt x-large">
                        </dd>
                      </dl>
                      <dl class="item">
                        <dt class="title">
                          发货人电话
                        </dt>
                        <dd class="content">
                          <input type="search" v-model="objSendInfo.SendPhone" placeholder="请填写发货人电话" data-validate="required phone" class="com-ipt x-large">
                        </dd>
                      </dl>
                      <dl class="item">
                        <dt class="title">
                          发货地区
                        </dt>
                        <dd class="content">
                          <area-box :area-codes="objSendInfo.SendAreaCode1+','+objSendInfo.SendAreaCode2+','+objSendInfo.SendAreaCode3+','+objSendInfo.SendAreaCode4" :area-code.sync="objSendInfo.SendAreaCode4"></area-box>
                        </dd>
                      </dl>
                      <dl class="item">
                        <dt class="title">
                          详细地址
                        </dt>
                        <dd class="content">
                          <input type="search" v-model="objSendInfo.SendDetailsAddress" placeholder="请填写详细地址" data-validate="required" class="com-ipt xxx-large">
                        </dd>
                      </dl>
                      <dl class="item">
                        <dt class="title">
                          备注
                        </dt>
                        <dd class="content">
                          <textarea rows="4" v-model="objSendInfo.Message" placeholder="请填写备注" data-validate="" class="com-ipt xxx-large"></textarea>
                        </dd>
                      </dl>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="submitClick">确定</button>
          <button class="btn btn-default" @click="cancelClick">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 订单发货弹窗
 */
import areaBox from 'vues/components/areaBox.vue';
export default {
  components: {
    areaBox
  },
  props: {
    orderCode: '',
    show: { twoway: true, default: false }
  },
  data() {
    return {
      isAllSend: 1,
      objDataInfo: {},
      dataIn: {
        arrLogisticsList: []
      },
      objSendInfo: {
        "OrderCode": "",
        "ExpressCode": "",
        "SendName": "",
        "SendPhone": "",
        "SendDetailsAddress": "",
        "SendAreaCode1": '',
        "SendAreaCode2": '',
        "SendAreaCode3": '',
        "SendAreaCode4": '',
        "LogisticsId": '',
        "Details": [],
        Message: '',
      },
    }
  },

  methods: {
    initPageData() {
      fetchData({
        API: '/api/OrderCenter/SGetSendGoodsBefore',
        hideLoading: true,
        para: {
          orderCode: this.orderCode,
        },
        callback: data => {
          data.Details.forEach(item => {
            item.RealSendCount = '';
            item.SendedCount = item.SendCount;
          });
          for (let key in data) {
            this.objSendInfo[key] = data[key];
          }
          this.objSendInfo.Message = '';
          this.objDataInfo = data;
        }
      })
    },
    getLogisticsList() {
      fetchData({
        API: '/api/Supplier/GetSupplierLogisticsForSelect',
        hideLoading: true,
        callback: data => {
          this.dataIn.arrLogisticsList = data;
        }
      })
    },
    submitClick() {
      if (!zmm_validator(this.$el)) {
        return;
      }
      let para = JSON.parse(JSON.stringify(this.objSendInfo));
      if (1 == this.isAllSend) { //全部发货
        para.Details.forEach(item => {
          item.SendCount = item.CanSendCount;
        })
      } else {
        for (let i = 0; i < para.Details.length; i++) {
          let curGoods = para.Details[i];
          if (curGoods.RealSendCount - 0 > curGoods.CanSendCount) {
            showTips(`商品“${curGoods.ProName}”发货数不能超过可发数量`, 'warning');
            return;
          }
          curGoods.SendCount = curGoods.RealSendCount;
        }
      }
      if (!para.SendAreaCode4) {
        showTips('请选择发货地区', 'warning');
        return;
      }
      para.SendAreaCode = para.SendAreaCode4;
      fetchData({
        API: '/api/OrderCenter/SSendGoods',
        para,
        callback: data => {
          this.$emit('deliver-ok');
          this.cancelClick();
        }
      })
    },
    cancelClick() {
      this.show = false;
      this.$emit('update:show', false);
    }
  },
  created() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.isAllSend = 1;
        this.objSendInfo.LogisticsId = '';
        this.objSendInfo.ExpressCode = '';
        this.initPageData();
        if (this.dataIn.arrLogisticsList.length == 0) {
          this.getLogisticsList();
        }
      }
    }
  }
}
</script>