<template>
  <div class="main">
    <div class="content-field">
      <p class="clearfix">
        <!-- <a href="javascript:history.back();" class=" fr">返回</a> -->
        <router-link :to="{name:'HMMorderManage'}">订单列表</router-link> > 订单详情
      </p>
    </div>
    <article class="order-info">
      <section class="title">
        <div class="sub-title">
          <span class="text-danger">
          {{objDataInfo.OrderStatusDesc}}
          </span>
        </div>
        <div class="sub-content">
          <span class="fr">
            <button class="btn btn-primary" @click="showDeliver" v-if="objDataInfo.IsShowSendGoods==1">发货</button>
            <button class="btn" v-if="objDataInfo.IsShowChangePrice==1" @click="showChangePrice">修改价格</button>
            <button class="btn" @click="showCloseOrder" v-if="objDataInfo.IsShowCancelBtn==1">关闭订单</button>
          </span> <span class="orderStatus" v-html="orderStatusDetail"></span>
        </div>
      </section>
      <section class="content">
        <div class="item">
          <div class="sub-title">订单信息</div>
          <div class="sub-content">
            <span class="item with-width">
              订单号：{{curOrderCode}}
            </span>
            <span class=" item ">物流公司：{{objDataInfo.LogisticsName}}</span>
          </div>
        </div>
        <div class="item">
          <div class="sub-title">买家信息</div>
          <div class="sub-content">
            <span class="item with-width">
              店铺名称：{{objDataInfo.RetailerName}}
            </span>
            <span class=" item with-width">买家：{{objDataInfo.RetailerUserName}}</span>
            <span class=" item ">联系方式：{{objDataInfo.ReceiverPhone}}</span>
          </div>
        </div>
        <div class="item">
          <div class="sub-title">收货信息</div>
          <div class="sub-content">
            <span class="item with-width">
              收货人：{{objDataInfo.ReceiverName}}
            </span>
            <span class=" item with-width">联系方式：{{objDataInfo.ReceiverPhone}}</span>
            <span class=" item ">收货地址：{{objDataInfo.AddressInfo}}</span>
          </div>
        </div>
        <div class="item">
          <div class="sub-title">
            支付信息
          </div>
          <div class="sub-content">
            <div class="item">
              <span v-if="objDataInfo.PayDetails.length==0">暂无支付信息</span>
              <p v-for="item in objDataInfo.PayDetails">
                <span class="item with-width">
              支付时间：{{item.DateAdded|datetime}}
            </span>
                <span class=" item with-width">支付金额：{{item.AmountFinal}}</span>
                <span class=" item ">支付方式：{{item.DisplayName}}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="sub-title">
            物流信息
          </div>
          <div class="sub-content">
            <div class="item">
              <span v-if="objDataInfo.GoodsSendList.length==0">暂无物流信息</span>
              <p v-for="item in objDataInfo.GoodsSendList">
                <span class="item with-width">
                  发货单号：<a href="javascript:;" class="highlight" @click="showDeliverDetail(item.SendCode)">{{item.SendCode}}</a>
                  </span>
                <span class=" item with-width">物流公司：{{item.LogisticsName}}</span>
                <span class=" item ">物流单号：{{item.ExpressCode}}</span>
                <a href="javascript:;" class="item highlight" @click="showPostDetail(item)"><span class="ml20"><i class="icon iconfont icon-genzong"></i> &nbsp;物流跟踪</span>
                 </a>
              </p>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="sub-title">
            备注信息
          </div>
          <div class="sub-content">
            <span class=" item ">{{objDataInfo.Message||'暂无备注信息'}}</span>
          </div>
        </div>
      </section>
    </article>
    <table class="table table-bordered-all small">
      <thead>
        <tr>
          <th>
            商品
          </th>
          <th style="width:130px;">
            单价
          </th>
          <th style="width:130px;">
            数量
          </th>
          <th style="width:130px;">
            已发数量
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="item in objDataInfo.GoodsDetails">
          <template v-if="item.IsTaocan==1">
            <tr v-for="item in item.TaocanList">
              <td>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <div class="img-thumb-box">
                          <img :src="item.ProImage" alt="商品图片" class="mr5 goods-img-thumb" :title="item.ProName">
                        </div>
                      </td>
                      <td>
                        {{item.ProName}}
                        <p class="text-light ">
                          规格：{{item.SpecStr}}
                        </p>
                        <p> <span class="tag-mini mr10">
                            优惠套餐
                            </span>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td class="text-nowrap">
                {{item.ProPrice|currency}}
              </td>
              <td class="text-nowrap">
                {{item.ProCount}}
              </td>
              <td class="text-nowrap">
                {{item.SendCount}}
              </td>
            </tr>
          </template>
          <tr v-else>
            <td>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <div class="img-thumb-box">
                        <img :src="item.ProImage" alt="商品图片" class="mr5 goods-img-thumb" :title="item.ProName">
                      </div>
                    </td>
                    <td>
                      {{item.ProName}}
                      <p class="text-light ">
                        规格：{{item.SpecStr}}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td class="text-nowrap">
              {{item.ProPrice|currency}}
            </td>
            <td class="text-nowrap">
              {{item.ProCount}}
            </td>
            <td class="text-nowrap">
              {{item.SendCount}}
            </td>
          </tr>
        </template>
        <tr>
          <td colspan="4" class="text-right">
            <table class="fr mr10">
              <tbody>
                <tr>
                  <td class="pr15">订单金额</td>
                  <td>￥{{objDataInfo.OrderTotalMoney|currency}}</td>
                </tr>
                <tr>
                  <td class="pr15">
                    优惠总额
                  </td>
                  <td>￥{{objDataInfo.DiscountCoupon|currency}}</td>
                </tr>
                <tr>
                  <td class="pr15">
                    立减总额
                  </td>
                  <td>￥{{objDataInfo.DiscountManjian|currency}}</td>
                </tr>
                <tr>
                  <td class="pr15">
                    <span class="text-danger text-middle">实付金额</span>
                  </td>
                  <td>
                    <b class="text-danger text-large">
                      ￥{{objDataInfo.FinalTotalMoney|currency}}
                    </b>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="details-box mt15">
      <div class="summary on">
        <span class="txt">详细日志</span>
      </div>
      <div class="content">
        <table class="table-v-top text-muted">
          <tbody>
            <tr v-for="item in objDataInfo.OrderRecord">
              <td style="width:150px;">
                <span>{{item.DateAdded|datetime}}</span></td>
              <td><span class="mr30">【{{item.OrderStatusDesc}}】{{item.Desc}}</span>
                <span>操作人：{{item.OperatorName}}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 查看发货单弹窗 -->
    <div class="popup" v-if="isShowDeliverDetail">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="closePopup">&times;</a>发货单详细</h2>
        <div class="body">
          <div class="content" style="width:800px">
            <p><b class="text-middle">发货单号：{{objSendInfo.SendCode}}</b></p>
            <hr>
            <table class="justshow thin">
              <tbody>
                <tr>
                  <th>
                    物流公司
                  </th>
                  <td>{{objSendInfo.LogisticsName}}
                  </td>
                </tr>
                <tr>
                  <th>
                    物流单号
                  </th>
                  <td>
                    {{objSendInfo.ExpressCode}}
                  </td>
                </tr>
                <tr>
                  <th>
                    收货信息
                  </th>
                  <td>
                    收货人：{{objSendInfo.ReceiverName}}<span class="ml20">联系方式：{{objSendInfo.ReceiverPhone}}</span><span class="ml20">收货地址：{{objSendInfo.AddressInfo}}</span>
                  </td>
                </tr>
                <tr>
                  <th>
                    发货信息
                  </th>
                  <td>
                    发货人：{{objSendInfo.SendName}}<span class="ml20">联系方式：{{objSendInfo.SendPhone}}</span><span class="ml20">发货地址：{{objSendInfo.SendDetailsAddress}}</span>
                  </td>
                </tr>
                <tr>
                  <th>
                    备注信息
                  </th>
                  <td>
                    {{objSendInfo.Message}}
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="table table-bordered-all datalist small">
              <thead>
                <tr>
                  <th>商品</th>
                  <th style="width:120px;">发货数</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in objSendInfo.Details">
                  <td>{{item.ProName}}</td>
                  <td>{{item.SendCount}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- 查看物流 -->
    <div class="popup" v-if="isShowPostDetail">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="closePopup">&times;</a>查看物流</h2>
        <div class="body">
          <div class="content" style="width:800px">
            <p class="text-middle"><b>{{objExpressInfo.LogisticsName}}：{{objExpressInfo.ExpressCode}}</b></p>
            <ul class="audit-flow mt10">
              <li class="item" v-for="(item,index) in objExpressInfo.Details">
                <p class="time"><span :class="{'text-primary':0==index}">{{item.time|datetime}}</span></p>
                <div class="detail" :class="{'text-primary':0==index}">
                  {{item.context}}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 改价 -->
    <div class="popup" v-if="isShowChangePrice">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="closePopup">&times;</a>修改订单价格</h2>
        <div class="body">
          <div class="content set w8em" style="width:400px">
            <dl class="item">
              <dt class="title">订单实付金额</dt>
              <dd class="content">
                ￥{{objDataInfo.FinalTotalMoney}}
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">
                修改订单实付金额
              </dt>
              <dd class="content">
                <input type="text" placeholder="请输入金额" data-validate="required money" v-model="newPrice" class="com-ipt small" @keydown.enter="changePriceClick">
              </dd>
            </dl>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="changePriceClick">确定</button>
          <button class="btn btn-default" @click="closePopup">取消</button>
        </div>
      </div>
    </div>
    <!-- 关闭订单 -->
    <div class="popup" v-if="isShowCloseOrder">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="closePopup">&times;</a>关闭订单</h2>
        <div class="body">
          <div class="content set" style="width:400px">
            <textarea type="text" rows="7" placeholder="请填写关闭订单原因" data-validate="required" v-model="closeDesc" class="com-ipt block" @keydown.enter="closeOrderClick"></textarea>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="closeOrderClick">确定</button>
          <button class="btn btn-default" @click="closePopup">取消</button>
        </div>
      </div>
    </div>
    <order-deliver :show.sync="isShowDeliver" :order-code="curOrderCode" @deliver-ok="initPageData"></order-deliver>
  </div>
</template>
<script>
/**
 * 交易管理-订单详情
 */
import orderDeliver from './orderDeliver.vue';
import countDown from 'commonScripts/zcountdown.js';
export default {
  components: {
    orderDeliver
  },
  data() {
    return {
      curOrderCode: '',
      isShowDeliver: false, //发货弹窗
      isShowDeliverDetail: false, //发货单详情
      isShowPost: false,
      isShowPostDetail: false,

      isShowCloseOrder: false,
      isShowChangePrice: false,

      newPrice: '', //改价新价格
      closeDesc: '', //关闭订单原因
      objDataInfo: {
        OrderStatus: '',
        ProofStatus: '',
        GoodsSendList: [],
        PayDetails: [],
      },
      objSendInfo: { //发货信息

      },
      objExpressInfo: {
        Details: []
      },
      orderStatusDetail: '',
      timeCountDown: 0,
    }
  },

  computed: {

  },
  methods: {
    initPageData() {
      fetchData({
        API: '/api/OrderCenter/GetOrderDetails',
        para: {
          orderCode: this.curOrderCode,
        },
        callback: data => {
          this.objDataInfo = data;
          if (this.objDataInfo.OrderStatus == 1 && this.objDataInfo.ProofStatus == 0) {

            this.timeCountDown = setInterval(() => {
              this.orderStatusDetail = '剩余支付时间 ' + countDown(this.objDataInfo.OrderCloseTime) + ' 买家逾期不付款，订单自动关闭';
            }, 1000)
          }
          if (this.objDataInfo.OrderStatus == 1 && this.objDataInfo.ProofStatus == 1) {
            this.orderStatusDetail = '线下支付，等待买家上传支付凭证';
          }
          if (this.objDataInfo.OrderStatus == 1 && this.objDataInfo.ProofStatus == 2) {
            this.orderStatusDetail = '线下支付，等待财务确认线下付款信息';
          }
          if (this.objDataInfo.OrderStatus == 1 && this.objDataInfo.ProofStatus == 3) {
            this.orderStatusDetail = '线下支付，财务审核线下付款信息未通过';
          }
          if (this.objDataInfo.OrderStatus == 2 || this.objDataInfo.OrderStatus == 3) {
            this.orderStatusDetail = '请尽快安排发货';
          }
          if (this.objDataInfo.OrderStatus == 4) {
            this.orderStatusDetail = '等待买家确认收货';
          }
          if (this.objDataInfo.OrderStatus == 5) {
            this.orderStatusDetail = '订单待结算';
          }
        }
      })
    },
    showDeliver() {
      this.isShowDeliver = true;
    },
    showDeliverDetail(sendCode) { //查看发货详情
      this.isShowDeliverDetail = true;
      fetchData({
        API: '/api/OrderCenter/GetSendGoodsInfo',
        hideLoading: true,
        para: {
          sendCode,
        },
        callback: data => {
          this.objSendInfo = data;
        }
      })
    },
    showPostDetail(item) { //物流跟踪
      this.objExpressInfo.LogisticsName = item.LogisticsName;
      this.objExpressInfo.ExpressCode = item.ExpressCode;
      fetchData({
        API: '/api/OrderCenter/GetOrderExpress',
        hideLoading: true,
        para: {
          sendCode: item.SendCode,
        },
        callback: data => {
          this.objExpressInfo.Details = data.Data;
        }
      })
      this.isShowPostDetail = true;
    },
    showChangePrice() { //弹出改价
      this.newPrice = '';
      this.isShowChangePrice = true;
    },
    changePriceClick() { //改价点击
      if (!zmm_validator(this.$el.querySelector('.popup'))) {
        return;
      }
      let para = {};
      para.OrderCode = this.curOrderCode;
      para.NewTotalMoney = this.newPrice;
      fetchData({
        API: '/api/OrderCenter/SHmmOrderChangePrice',
        para,
        callback: data => {
          this.initPageData();
          this.closePopup();
        }
      })
    },
    showCloseOrder() { //取消订单弹出
      this.isShowCloseOrder = true;
      this.closeDesc = '';
    },
    closeOrderClick() { //取消订单确认
      if (!zmm_validator(this.$el.querySelector('.popup'))) {
        return;
      }
      let para = {};
      para.OrderCode = this.curOrderCode;
      para.Desc = this.closeDesc;
      fetchData({
        API: '/api/OrderCenter/SHmmOrderCancel',
        para,
        callback: data => {
          this.initPageData();
          this.closePopup();
        }
      })
    },
    closePopup() {
      this.isShowDeliverDetail = false;
      this.isShowPost = false;
      this.isShowPostDetail = false;
      this.isShowChangePrice = false;
      this.isShowCloseOrder = false;
    },
  },
  created() {
    this.curOrderCode = this.$route.params.code;
    this.initPageData();
  },
  beforeDestroy() {
    clearInterval(this.timeCountDown);
  }
}
</script>