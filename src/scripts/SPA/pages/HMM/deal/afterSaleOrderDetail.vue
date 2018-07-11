<template>
  <div class="main">
    <div class="content-field">
      <p class="clearfix">
        <!-- <a href="javascript:history.back();" class=" fr">返回</a> -->
        <router-link :to="{name:'HMMafterSaleOrder'}">售后单列表</router-link> > 售后单详情
      </p>
    </div>
    <article class="order-info">
      <section class="title">
        <div class="sub-title">
          <span class="text-danger">
          {{objDataInfo.CSStatus|afterSaleOrderStatus}}
          </span>
        </div>
        <div class="sub-content clearfix">
          <span class="fr" v-if="objDataInfo.CSStatus==1">
            <button class="btn btn-primary" @click="agreeReturn" >同意{{computedReturnTypeDesc}}</button>
            <button class="btn" @click="refuseReturn">拒绝{{computedReturnTypeDesc}}</button>
          </span>
          <span class="fr" v-if="objDataInfo.CSStatus==3">
            <button class="btn btn-primary" @click="showCloseOrder" >确认收货并退款</button>
            <button class="btn" @click="showCloseOrder">拒绝退款</button>
          </span>
          <span class="fr" v-if="objDataInfo.CSStatus==6&&objDataInfo.PayType==1">
            <button class="btn btn-primary" @click="showCloseOrder" >确认线下退款</button>
          </span>
          <span class="fr" v-if="objDataInfo.CSStatus==7">
            <button class="btn btn-primary" @click="showCloseOrder" >上传举证</button>
          </span>
          <span class="orderStatus" v-html="orderStatusDetail"></span>
          <div class="tooltips-i tooltips-tl" v-if="tipsInfo"><a href="javascript:;" class="icon icon-tips">!</a>
            <div class="txt" style="width:300px;" v-html="tipsInfo">
            </div>
          </div>
        </div>
      </section>
      <section class="content">
        <div class="item">
          <div class="sub-title">售后单信息</div>
          <div class="sub-content">
            <span class="item with-width">
              售后单号：{{curOrderCode}}
            </span>
            <span class=" item  with-width">售后类型：{{objDataInfo.ReturnType|afterSaleReturnType}}</span>
            <span class=" item  with-width">退款原因：{{objDataInfo.ReturnReason}}</span>
            <span class=" item  with-width">退款数量：{{objDataInfo.ReturnCount}}</span>
            <span class=" item  with-width">退款金额：{{objDataInfo.ReturnMoney|currency}}</span>
          </div>
        </div>
        <div class="item">
          <div class="sub-title">订单信息</div>
          <div class="sub-content">
            <span class="item with-width">
              订单号：{{objDataInfo.OrderCode}}
            </span>
            <span class=" item ">订单状态：{{objDataInfo.OrderStatusDesc}}</span>
          </div>
        </div>
        <div class="item">
          <div class="sub-title">买家信息</div>
          <div class="sub-content">
            <span class="item with-width">
              店铺名称：{{objDataInfo.BuyerShopName}}
            </span>
            <span class=" item with-width">买家：{{objDataInfo.BuyerRealName}}</span>
            <span class=" item ">联系方式：{{objDataInfo.BuyerPhone}}</span>
          </div>
        </div>
        <div class="item">
          <div class="sub-title">描述信息</div>
          <div class="sub-content">
            <div class="item">
              收货人：{{objDataInfo.Desc}}
              <div class="mt10" v-if="objDataInfo.Images&&objDataInfo.Images.length">
                <ul class="upload-img-list">
                  <li class="item" v-for="item in objDataInfo.Images">
                    <a :href="item" target="_blank"><img :src="item" alt=""></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="sub-title">退货信息</div>
          <div class="sub-content">
            <span class="item with-width">
              联系人：{{objDataInfo.Name}}
            </span>
            <span class=" item with-width">联系方式：{{objDataInfo.Phone}}</span>
            <span class=" item ">退货地址：{{objDataInfo.DetailsAddress}}
              <button class="btn ml10" v-if="objDataInfo.CSStatus ==1" @click="changeAddress">修改地址</button></span>
          </div>
        </div>
        <div class="item" v-if="objDataInfo.PayType==1">
          <div class="sub-title">退款银行信息</div>
          <div class="sub-content">
            <span class="item with-width">
              开启行：{{objDataInfo.BankName}}
            </span>
            <span class=" item with-width">开户支行名称：{{objDataInfo.BankSubName}}</span>
            <span class=" item with-width">户名：{{objDataInfo.BankAccountName}}
              </span> <span class=" item with-width">卡号：{{objDataInfo.BankAccountNumber}}
              </span>
          </div>
        </div>
        <!--    <div class="item">
          <div class="sub-title">
            退货物流信息
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
        </div> -->
      </section>
    </article>
    <table class="table table-bordered-all small mt10">
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
            已退款数量
          </th>
          <th style="width:130px;">
            申请退款数量
          </th>
          <th style="width:130px;">
            申请退款金额
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <table>
              <tbody>
                <tr>
                  <td>
                    <div class="img-thumb-box">
                      <img :src="objDataInfo.ProImage" alt="商品图片" class="mr5 goods-img-thumb" :title="objDataInfo.ProName">
                    </div>
                  </td>
                  <td>
                    {{objDataInfo.ProName}}
                    <p class="text-light ">
                      规格：{{objDataInfo.SpecStr}}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td class="text-nowrap">
            {{objDataInfo.ProPrice|currency}}
          </td>
          <td class="text-nowrap">
            {{objDataInfo.ProCount}}
          </td>
          <td class="text-nowrap">
            {{objDataInfo.ReturnedCount}}
          </td>
          <td class="text-nowrap">
            {{objDataInfo.ReturnCount}}
          </td>
          <td class="text-nowrap">
            {{objDataInfo.ReturnMoney|currency}}
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
            <tr v-for="item in objDataInfo.OperateLog">
              <td style="width:150px;">
                <span>{{item.DateAdded|datetime}}</span></td>
              <td><span class="mr30">【{{item.StatusDesc}}】{{item.Desc}}</span>
                <span>操作人：{{item.OperateUserName}}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 查看物流 -->
    <!--     <div class="popup" v-if="isShowPostDetail">
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
    </div>     -->
    <div class="popup" v-if="isShowRefuse">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="closePopup">&times;</a>拒绝{{computedReturnTypeDesc}}</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <p class="bg bg-warning">
              提示：建议您先找买家沟通，拒绝换货后，买家可以申请平台客服介入，对售后单进行仲裁
            </p>
            <div class="set">
              <dl class="item">
                <dt class="title">拒绝原因</dt>
                <dd class="content">
                  <select v-model="refuseInfo.RefuseReason">
                    <option value="商品已经影响二次销售">商品已经影响二次销售</option>
                    <option value="商品没问题，买家未举证">商品没问题，买家未举证</option>
                    <option value="商品没问题，买家举证无效">商品没问题，买家举证无效</option>
                    <option value="要求买家承担发货运费">要求买家承担发货运费</option>
                    <option value="其他">其他</option>
                    <option value="商家已经缺货，无法帮助调换">商家已经缺货，无法帮助调换</option>
                  </select>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">拒绝说明</dt>
                <dd class="content">
                  <textarea rows="4" v-model="refuseInfo.RefuseDesc" class="block" placeholder="请输入拒绝描述"></textarea>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">上传凭证</dt>
                <dd class="content">
                  <ul class="upload-img-list">
                    <li class="item" v-for="(item,index) in refuseInfo.RefuseImages">
                      <sup class="del" @click="delImg(index)"></sup>
                      <img :src="item" alt="">
                    </li>
                  </ul>
                  <upload-file @upload-ok="uploadOk"></upload-file>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="footer">
          <button class="btn btn-primary" @click="refuseSubmit">确定</button>
          <button class="btn btn-default" @click="closePopup">取消</button>
        </div>
      </div>
    </div>
    <div class="popup" v-if="isShowAddressList">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="closePopup">&times;</a>选择收货地址</h2>
        <div class="body">
          <div class="content" style="width:700px">
            <ul class="return-address-list">
              <li class="item" :class="{on:objCurAddress.Id==item.Id}" @click="chooseAddress(item)" v-for="item in arrAddressList">
                <p class="fr">
                  <router-link :to="{name:'BCshopInfo'}" class="highlight" target="_blank">修改</router-link>
                </p>
                <h3 class="name">{{item.Name}}</h3>
                <p>
                  {{item.Phone}}
                </p>
                <p>
                  {{item.AreaMergerName}}
                </p>
                <p>
                  {{item.FullAddressStr}}
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <button class="btn btn-primary" @click="confirmAddress">确定</button>
          <button class="btn btn-default" @click="closePopup">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 交易管理-售后单详情
 */
import countDown from 'commonScripts/zcountdown.js';
import uploadFile from 'vues/components/uploadFile.vue';
export default {
  components: {
    uploadFile
  },
  data() {
    return {
      isShowRefuse: false,
      curOrderCode: '',
      isShowPost: false,
      isShowPostDetail: false,
      isShowAddressList: false,
      objDataInfo: { //订单信息
        GoodsSendList: [],
      },
      objExpressInfo: {
        Details: []
      },
      arrAddressList: [],
      objCurAddress: {
        Id: '',
      },
      orderStatusDetail: '', //订单状态详情描述二级文字
      tipsInfo: '', //状态相关提示
      timeCountDown: 0, //倒计时
      refuseInfo: { //拒绝退时提交信息对象
        RefuseReason: '商品已经影响二次销售',
        ResuseDesc: '',
        RefuseImages: [],
      }
    }
  },
  computed: {
    computedReturnTypeDesc() {
      let str = '';
      switch (this.objDataInfo.ReturnType - 0) {
        case 1:
          {
            str = '退款';
            break;
          }
        case 2:
          {
            str = '退货';
            break;
          }
        case 3:
          {
            str = '换货';
            break;
          }
      }
      return str;
    },
  },
  methods: {
    initPageData() {
      fetchData({
        API: 'api/OrderCenter/GetAfterSaleDetails',
        para: {
          ReturnCode: this.curOrderCode,
        },
        callback: data => {
          data.Images = data.Images.length ? data.Images.split(',') : [];
          this.objDataInfo = data;
          clearInterval(this.timeCountDown);
          this.orderStatusDetail = '';
          this.tipsInfo = '';
          if (this.objDataInfo.CSStatus == 1) { //待商家处理
            this.timeCountDown = setInterval(() => {
              this.orderStatusDetail = '剩余' + countDown(this.objDataInfo.OrderCloseTime) + ' 买家逾期不处理，系统将自动关闭售后单';
            }, 1000);
            if (this.objDataInfo.ReturnType == 1) {

              this.tipsInfo = '1.如果未发货，符合退款条件，请点击同意退款给买家<p>2.如果实际已发货，请主动与买家联系'
            } else {
              this.tipsInfo = '1.如果符合退货条件，请点击同意退货<p>2.如果拒绝退货，买家可以申请客服介入或重新申请售后'
            }
          }
          if (this.objDataInfo.CSStatus == 3) { //待家商收货
            this.orderStatusDetail = '您逾期不处理，将自动发起';
            this.tipsInfo = '1.买家已退货，如果收到买家退货时，请验收货物同意退款，如果货物有问题，请联系买家<p>2.如果拒绝退款，买家可以申请客服介入处理<p>3.点击确认收货并退款后，退款金额原路返回买家账户';
          }
          if (this.objDataInfo.CSStatus == 5) { //待买家确认换货
            this.timeCountDown = setInterval(() => {
              this.orderStatusDetail = '剩余' + countDown(this.objDataInfo.OrderCloseTime) + ' 倒计时结束后，系统自动换货成功';
            }, 1000);
            this.tipsInfo = '1.在此期间，如有问题请主动联系买家协调<p>2.买家逾期不确认换货，系统自动确认换货成功';
          }
          if (this.objDataInfo.CSStatus == 6) { //退款中
            this.orderStatusDetail = '银行处理中，到账时间预计1-5个工作日';
          }
          if (this.objDataInfo.CSStatus == 7) { //待平台仲裁
            this.orderStatusDetail = '等待款项原路返回，1-5个工作日';
          }
          if (this.objDataInfo.CSStatus == 10) { //商家拒绝
            this.orderStatusDetail = '买家逾期不处理，系统将自动关闭售后单';
            this.tipsInfo = '买家在有效期内可以申请平台仲裁或重新发起申请'
          }
          if (this.objDataInfo.CSStatus == 11) { //成功
            this.orderStatusDetail = '售后服务成功，请通知客户查收';
          }
          if (this.objDataInfo.CSStatus == -1) { //关闭
            this.orderStatusDetail = '买家撤消退款申请或逾期，售后单自动关闭';
          }
        }
      })
    },
    agreeReturn() { //同意退款、货
      dialog({
        title: `同意${this.computedReturnTypeDesc}`,
        content: `您确定要${this.computedReturnTypeDesc}吗？`,
        ok: () => {
          fetchData({
            API: '/api/OrderCenter/SOrderAfterSaleAgree',
            para: {
              ReturnCode: this.objDataInfo.ReturnCode,
              ReturnAddressId: this.objDataInfo.ReturnAddressId,
            },
            callback: () => {
              this.initPageData();
            }
          })
        },
        cancel() {}
      }).showModal();
    },

    refuseReturn() { //拒绝退货、退款
      this.isShowRefuse = true;
    },
    refuseSubmit() { //拒绝退提交
      let para = JSON.parse(JSON.stringify(this.refuseInfo));
      para.RefuseImages = para.RefuseImages.join(',');
      para.ReturnCode = this.objDataInfo.ReturnCode;
      fetchData({
        API: '/api/OrderCenter/SOrderAfterSaleRefuse',
        para,
        callback: () => {
          this.initPageData();
          this.closePopup();
        }
      })
    },
    uploadOk(data) { //上传拒绝凭证
      this.refuseInfo.RefuseImages.push(data.Data);
    },
    delImg(index) { //删除凭证图
      this.refuseInfo.RefuseImages.splice(index, 1);
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
    getAddressList() {
      fetchData({
        hideLoading: true,
        API: '/api/Misc/AddressList',
        callback: data => {
          this.arrAddressList = data;
        }
      })
    },
    changeAddress() { //修改地址弹出
      this.objCurAddress.Id = this.objDataInfo.ReturnAddressId;
      this.isShowAddressList = true;
      this.getAddressList();
    },
    chooseAddress(item) {
      this.objCurAddress = item;
    },
    confirmAddress() { //选择地址确认
      this.objDataInfo.ReturnAddressId = this.objCurAddress.Id;
      this.objDataInfo.Name = this.objCurAddress.Name;
      this.objDataInfo.DetailsAddress = this.objCurAddress.FullAddressStr;
      this.objDataInfo.Phone = this.objCurAddress.Phone;
      this.isShowAddressList = false;
    },
    closePopup() {
      this.isShowRefuse = false;
      this.isShowPost = false;
      this.isShowPostDetail = false;
      this.isShowAddressList = false;
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