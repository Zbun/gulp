<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div>
        <span class="tab-bar">
          <em class="item" :class="{on:dataOut.search.Status===''}" @click="changeStatus('')">全部</em>
         <em class="item" v-for="(value,key) in computedStatus" v-if="key!=0" :class="{on:dataOut.search.Status==key}" @click="changeStatus(key)">
           {{value}}
         </em>
          <em class="item" :class="{on:dataOut.search.Status===0}" @click="changeStatus(0)">交易关闭</em>
        </span>
      </div>
      <div class="search-box clearfix mt10">
        <span class="fr">
          <button class="btn ml5" onclick="alert('稍候实现')">导出</button>
        </span>
        <input type="search" placeholder="订单编号/商品名称/买家账号" class="com-ipt ipt-search " v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <select v-model="timeType" class="ml5">
          <option value="0">下单时间</option>
          <option value="1">付款时间</option>
        </select>
        <span class="date-field ml5">
          <input type="text" class="com-ipt " placeholder="开始时间" id="start" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'end\')}'})"
            ref="timeStart" @focus="changeTime()" v-model="timeStart">
        </span> -
        <span class="date-field">
          <input type="text" class="com-ipt " placeholder="结束时间" id="end" onclick="WdatePicker({minDate: '#F{$dp.$D(\'start\')}'})"
            ref="timeEnd" @focus="changeTime()" v-model="timeEnd">
        </span>
        <label class="checkbox">
          <input type="checkbox" v-model="isHaveSale">需要售后处理<span class="icon"></span></label>
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <div class="table-list mt10">
        <table class="table table-fixed small">
          <colgroup>
            <col>
            <col style="width:110px;">
            <col style="width:80px;">
            <col style="width:160px;">
            <col style="width:120px;">
            <col style="width:100px;">
            <col style="width:100px;">
          </colgroup>
          <thead>
            <tr>
              <th>
                商品
              </th>
              <th>单价</th>
              <th>数量</th>
              <th>金额</th>
              <th>买家信息</th>
              <th>订单状态</th>
              <th>操作</th>
            </tr>
          </thead>
        </table>
        <table class="table table-bordered-all mt10 table-fixed small" v-for="item in dataIn.arrDataList">
          <colgroup>
            <col>
            <col style="width:110px;">
            <col style="width:80px;">
            <col style="width:160px;">
            <col style="width:120px;">
            <col style="width:100px;">
            <col style="width:100px;">
          </colgroup>
          <thead>
            <tr>
              <td colspan="7">
                订单号：
                <router-link class="highlight" :to="{name:'HMMorderDetail',params:{code:item.OrderCode}}">{{item.OrderCode}}</router-link>
                <span class="ml20">下单时间：{{item.CreateTime}}</span>
                <span class="ml20">
                  付款时间：{{item.PayTime}}
                </span>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order,indexOrder) in item.OrderDetails">
              <td>
                <table>
                  <tbody>
                    <template v-if="1==order.IsTaocan">
                      <tr v-for="(order,indexT) in order.TaocanList">
                        <td :class="{pt10:0!=indexT}">
                          <div class="img-thumb-box">
                            <img :src="order.ProImage" alt="商品图片" class="mr5 goods-img-thumb" :title="order.ProName">
                          </div>
                        </td>
                        <td>{{order.ProName}}
                          <p class="text-light ">
                            <span class="mr10">数量：{{order.ProCount}}</span>规格：{{order.SpecStr}}
                          </p>
                          <div class="mt5">
                            <span class="tag-mini mr10" v-if="order.IsManjian==1">
                    满减
                  </span>
                            <span class="tag-mini mr10" v-if="order.IsHsp==1">
                    慧闪购
                  </span>
                            <span class="tag-mini mr10" v-if="order.IsUseCoupon==1">
                    优惠券
                  </span>
                            <span class="tag-mini mr10" v-if="order.IsTaocan==1">
                    优惠套餐
                  </span>
                            <div v-if="order.IsHaveGift==1">
                              <span class="tag-mini mr5">
                                赠品</span>
                              <div class="tooltips-i tooltips-tl">
                                <a href="javascript:;" class="target  text-light">查看赠品</a>
                                <div class="txt">
                                  <p v-for="gift in order.GiftDetails">
                                    {{gift.GiftName}} <span class="ml20">{{gift.GiftCount}}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </template>
                    <template v-else>
                      <tr>
                        <td>
                          <div class="img-thumb-box">
                            <img :src="order.ProImage" alt="商品图片" class="mr5 goods-img-thumb" :title="order.ProName">
                          </div>
                        </td>
                        <td>{{order.ProName}}
                          <p class="text-light ">
                            规格：{{order.SpecStr}}
                          </p>
                          <p class="mt5">
                            <span class="tag-mini mr10" v-if="order.IsManjian==1">
                    满减
                  </span>
                            <span class="tag-mini mr10" v-if="order.IsHsp==1">
                    慧闪购
                  </span>
                            <span class="tag-mini mr10" v-if="order.IsUseCoupon==1">
                    优惠券
                  </span>
                            <span class="tag-mini mr10" v-if="order.IsTaocan==1">
                    优惠套餐
                  </span>
                            <div v-if="order.IsHaveGift==1">
                              <span class="tag-mini mr5">
                                赠品</span>
                              <div class="tooltips-i tooltips-tl">
                                <a href="javascript:;" class="target  text-light">查看赠品</a>
                                <div class="txt">
                                  <p v-for="gift in order.GiftDetails">
                                    {{gift.GiftName}} <span class="ml20">{{gift.GiftCount}}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </p>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </td>
              <td class="text-nowrap">
                ￥{{order.ProPrice|currency}}
              </td>
              <td class="text-nowrap" style="border-radius:0">
                {{order.ProCount}}
              </td>
              <td class="text-nowrap" v-if="0==indexOrder" :rowspan="item.OrderDetails.length">
                <p class="text-light">订单总额：{{item.OrderTotalMoney|currency}}</p>
                <p class="text-light">立减金额：{{item.DiscountManjian|currency}}</p>
                <p class="text-light">优惠金额：{{item.DiscountCoupon|currency}}</p>
                <p>实付金额：{{item.FinalTotalMoney|currency}}</p>
              </td>
              <td v-if="0==indexOrder" :rowspan="item.OrderDetails.length">
                <p>{{item.RealName}}</p>
                <p>{{item.Phone}}</p>
              </td>
              <td v-if="0==indexOrder" :rowspan="item.OrderDetails.length">
                <p>{{item.OrderStatusDesc}}</p>
              </td>
              <td v-if="0==indexOrder" :rowspan="item.OrderDetails.length" style="border-bottom-right-radius:4px;">
                <div class="action-field">
                  <p class="item" v-if="1==item.IsShowChangePrice" @click="changePrice(item,index)">修改价格</p>
                  <p class="item" v-if="1==item.IsShowCancelBtn" @click="closeOrder(item,index)">关闭订单</p>
                  <p class="item" v-if="2==item.OrderStatus||3==item.OrderStatus" @click="deliver(item)">发货</p>
                  <!-- <p class="item" @click="del(item,index)">查看售后单</p> -->
                  <p class="item">
                    <router-link class="highlight" :to="{name:'HMMorderDetail',params:{code:item.OrderCode}}">订单详情</router-link>
                  </p>
                </div>
              </td>
            </tr>
            <!--             <tr>
              <td colspan="7">
                <table class="table-v-top" style="width:100%">
                  <colgroup>
                    <col>
                    <col style="width:110px;">
                    <col style="width:80px;">
                    <col style="width:160px;">
                    <col style="width:120px;">
                    <col style="width:100px;">
                    <col style="width:100px;">
                  </colgroup>
                  <tbody>
                    <tr>
                      <td>
                        <div style="padding-left:90px;" class="text-light">
                          <span class="order-box mr5 ">
                            1
                          </span> 交付定金
                        </div>
                      </td>
                      <td>
                        <div class="text-light pl20">1000</div>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <div style="padding-left:90px;" class="text-light">
                          <span class="order-box mr5 on">
                            1
                          </span> 交付定金
                        </div>
                      </td>
                      <td>
                        <div class="text-light pl20">￥1000</div>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr> -->
          </tbody>
        </table>
      </div>
      <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
        暂无相关数据
      </div>
      <div class="pageBox text-right"></div>
    </div>
    <div class="popup" v-if="isShowChangePrice">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="closePopup">&times;</a>修改订单价格</h2>
        <div class="body">
          <div class="content set w8em" style="width:400px">
            <dl class="item">
              <dt class="title">订单实付金额</dt>
              <dd class="content">
                ￥{{objCurItem.FinalTotalMoney}}
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
    <order-deliver :order-code="objCurItem.OrderCode" @deliver-ok="deliveOk" :show.sync="isShowOrderDeliver"></order-deliver>
  </div>
</template>
<script>
/**
 * 交易管理-订单管理
 */

import orderDeliver from './orderDeliver.vue';
let _dataModule = {
  isShowChangePrice: false,
  objCurItem: {},
  newPrice: '',

  isShowCloseOrder: false, //关闭订单弹窗
  closeDesc: '', //关闭订单原因

  isShowOrderDeliver: false,

  timeType: 0,
  dataIn: {
    inited: false,
    arrDataList: []
  },
  arrChkedId: [],
  pageIndex: 1,
  timeStart: '',
  timeEnd: '',
  isHaveSale: false,
  dataOut: {
    search: {
      "Key": "",
      "Status": "",
      "CreateStart": "",
      "CreateEnd": "",
      "PayStart": "",
      "PayEnd": "",
      "IsHaveAfterSale": "",
    }
  },
  editInfo: {}
};
export default {
  components: { orderDeliver },
  data() {
    return _dataModule
  },
  computed: {
    computedStatus() {
      return dictionary['orderStatus'];
    }
  },
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.IsHaveAfterSale = this.isHaveSale - 0;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 8;
      this.arrChkedId = [];
      fetchData({
        API: '/api/OrderCenter/SGetHmmOrderCenter',
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    changeTime() {
      if (this.timeType == 0) {
        this.dataOut.search.CreateStart = this.$refs.timeStart.value;
        this.dataOut.search.CreateEnd = this.$refs.timeEnd.value;
      } else {
        this.dataOut.search.PayStart = this.$refs.timeStart.value;
        this.dataOut.search.PayEnd = this.$refs.timeEnd.value;
      }
      this.timeStart = this.$refs.timeStart.value;
      this.timeEnd = this.$refs.timeEnd.value;
    },
    changeStatus(status) { //切换商品类型
      this.dataOut.search.Status = status;
      this.initPageData(1);
    },
    changePrice(item) { //弹出改价
      this.newPrice = '';
      this.isShowChangePrice = true;
      this.objCurItem = item;
    },
    deliver(item) { //弹出发货
      this.isShowOrderDeliver = true;
      this.objCurItem = item;
    },
    deliveOk() {
      this.initPageData(this.pageIndex);
    },
    closePopup() {
      this.isShowChangePrice = false;
      this.isShowCloseOrder = false;
    },
    changePriceClick() { //改价点击
      if (!zmm_validator(this.$el.querySelector('.popup'))) {
        return;
      }
      let para = {};
      para.OrderCode = this.objCurItem.OrderCode;
      para.NewTotalMoney = this.newPrice;
      fetchData({
        API: '/api/OrderCenter/SHmmOrderChangePrice',
        para,
        callback: data => {
          this.initPageData(this.pageIndex);
          this.isShowChangePrice = false;
        }
      })
    },
    closeOrder(item) { //取消订单弹出
      this.isShowCloseOrder = true;
      this.closeDesc = '';
      this.objCurItem = item;
    },
    closeOrderClick() { //取消订单确认
      if (!zmm_validator(this.$el.querySelector('.popup'))) {
        return;
      }
      let para = {};
      para.OrderCode = this.objCurItem.OrderCode;
      para.Desc = this.closeDesc;
      fetchData({
        API: '/api/OrderCenter/SHmmOrderCancel',
        para,
        callback: data => {
          this.isShowCloseOrder = false;
          this.initPageData(this.pageIndex);
        }
      })
    }
  },
  created() {
    this.initPageData(this.pageIndex);
  },
  watch: {
    'timeType' () {
      this.dataOut.search.CreateStart = this.dataOut.search.CreateEnd = this.dataOut.search.PayStart = this.dataOut.search.PayEnd = this.timeStart = this.timeEnd = '';
    }
  }
}
</script>