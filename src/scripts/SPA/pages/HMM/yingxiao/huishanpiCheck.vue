<template>
  <div class="main">
    <section class="text-center fixed-footer">
      <a href="javascript:history.go(-1)" class="btn large">返回</a>
    </section>
    <div class="content-field">
      <p>
        <router-link :to="{name:'HMMmyactivity'}">活动列表</router-link> >
        <span class="text-muted">慧闪购</span>
      </p>
      <div class="two-column-view mt10">
        <div class="item">
          <h3 class="title">
            商品信息
          </h3>
          <div class="content">
            <table class="justshow">
              <tbody>
                <tr>
                  <th style="width:8em">选择SKU</th>
                  <td><span class="tag tag-pure on" style="margin:0;">
                    {{objEditInfo.GoodsInfo.ProName}}
                  </span>
                  </td>
                </tr>
                <tr>
                  <th>
                    起批量
                  </th>
                  <td>
                    <input type="text" placeholder="" class="com-ipt x-large" readonly="" :value="objEditInfo.MinimumBuy"> 台
                  </td>
                </tr>
                <tr>
                  <th>
                    一件几台
                  </th>
                  <td>
                    <input type="text" placeholder="" class="com-ipt x-large" readonly="" :value="objEditInfo.PieceOfNum"> 台
                  </td>
                </tr>
                <tr>
                  <th>
                    规格参数
                  </th>
                  <td>
                    <input type="text" placeholder="" class="com-ipt x-large" readonly="" :value="objEditInfo.GoodsInfo.SpecStr">
                  </td>
                </tr>
                <tr>
                  <th>
                    价格
                  </th>
                  <td>
                    <input type="text" placeholder="" class="com-ipt x-large" readonly="" :value="objEditInfo.GoodsInfo.ProPrice|currency">
                    <a href="javascript:;" class="highlight ml5" v-if="objEditInfo.GoodsInfo.MatrixPrice&&objEditInfo.GoodsInfo.MatrixPrice.length" @click="showMatrixPrice">已设置高级价格</a>
                  </td>
                </tr>
                <tr>
                  <th>
                    总库存
                  </th>
                  <td>
                    <input type="text" placeholder="" class="com-ipt x-large" readonly="" :value="objEditInfo.GoodsInfo.AmountSum">
                    <a href="javascript:;" class="highlight ml5" v-if="objEditInfo.GoodsInfo.AmountDetails&&objEditInfo.GoodsInfo.AmountDetails.length" @click="showStoreNum">查看库存</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="item">
          <h3 class="title">
            活动信息
          </h3>
          <div class="content">
            <table class="justshow">
              <tbody>
                <tr>
                  <th style="width:8em">
                    每期最大销售量
                  </th>
                  <td>
                    <input type="text" placeholder="" class="com-ipt x-large" readonly="" :value="objEditInfo.Amount">
                  </td>
                </tr>
                <tr>
                  <th style="width:8em">
                    每期限批量
                  </th>
                  <td>
                    <input type="text" placeholder="" class="com-ipt x-large" readonly="" :value="objEditInfo.MaxBuyNumPeriods"> &nbsp;台/人
                  </td>
                </tr>
                <tr>
                  <th style="width:8em">
                    闪购价
                  </th>
                  <td>
                    <input type="text" placeholder="" class="com-ipt x-large" readonly="" :value="objEditInfo.HSPPrice|currency">
                    <div class="bubble-box bubble-l ml5">优惠金额：{{objEditInfo.Discount|currency}} 元
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>
                    参加活动日期
                  </th>
                  <td>
                    <span class=" col2">
        <input type="text" :value="objEditInfo.StartDate|datetime" style="width:118px" readonly="" placeholder="开始时间" >
      </span> - <span class=" col2">
        <input type="text" :value="objEditInfo.EndDate|datetime" style="width:118px" readonly="" placeholder="开始时间" >
      </span>
                  </td>
                </tr>
                <tr>
                  <th>
                    默认购买量
                  </th>
                  <td>
                    <input type="text" placeholder="" class="com-ipt x-large" readonly="" :value="objEditInfo.SaleNumVirtual">
                  </td>
                </tr>
                <tr>
                  <th>
                    是否支持优惠券
                  </th>
                  <td>
                    <label class="radio">
                      <input type="radio" disabled v-model="objEditInfo.AllowCoupon" value="1">
                      <span class="icon"></span>是</label>
                    <label class="radio">
                      <input type="radio" disabled v-model="objEditInfo.AllowCoupon" value="0">
                      <span class="icon"></span>否</label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="item">
          <h3 class="title">
            审核信息
          </h3>
          <div class="content">
            <div class="set w8em">
              <!--               <dl class="item">
                <dt class="title">
                  审核结果
                </dt>
                <dd class="content">
                  {{objEditInfo.LastStatus==1?'同意':'不同意'}}
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  审批意见
                </dt>
                <dd class="content">
                  {{objEditInfo.AuditingDesc}}
                </dd>
              </dl> -->
              <dl class="item">
                <dt class="title">
                  审批流程
                </dt>
                <dd class="content">
                  <ul class="audit-flow">
                    <li class="item" v-for="item in objEditInfo.AuditingRecord">
                      <p class="time">{{item.ApplyDate|datetime}}</p>
                      <div class="detail">
                        <p><span :class="{'text-danger':item.Status==-1}">【{{item.Status|hspCheckStatus}}】</span>{{item.AuditingUserRealname}}</p>
                        <p>{{item.AuditingDesc}}</p>
                      </div>
                    </li>
                  </ul>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
    <check-store-num :show.sync="isShowStoreNum" :obj-edit-info="objEditInfo.GoodsInfo"></check-store-num>
    <check-matrix-price :show.sync="isShowMatrixPrice" :obj-edit-info="objEditInfo.GoodsInfo"></check-matrix-price>
  </div>
</template>
<script>
/**
 * 慧闪购审核
 */
import checkMatrixPrice from './popup/checkMatrixPrice.vue';
import checkStoreNum from './popup/checkStoreNum.vue';
export default {
  components: {
    checkStoreNum,
    checkMatrixPrice
  },
  data() {
    return {
      isShowStoreNum: false,
      isShowMatrixPrice: false,
      objMetaInfo: {},
      AuditingStatus: 1,
      AuditingDesc: '',

      isAudit: false,

      objEditInfo: {
        GoodsInfo: {},
        Id: 0,
        AuditingRecord: [], //审核流
        ProId: '',
        ProName: '',
        DisCount: '', //差价
        AmountDetails: [], //库存数组
        MatrixPrice: [], //高级价格数组
        MinimumBuy: '', //起批量
        ProPrice: '', //价格
        HSPPrice: '', //闪购价
        Amount: '', //每期最大销量
        MaxBuyNumPeriods: 0, //每期最大限批量
        SaleNumVirtual: 999, //默认购买量
        AllowCoupon: 1, //优惠券
        AmountSum: '', //总库存
        Start: '', //开始
        End: '', //结束
      }
    }
  },
  computed: {},
  methods: {
    initPageData() {
      fetchData({
        hideLoading: true,
        API: '/api/Goods/GetHspInfo',
        para: {
          Id: this.objEditInfo.Id,
        },
        callback: data => {
          this.objEditInfo = data;
        }
      })
    },
    showSelectSku() {
      this.isShowSelectSku = true;
    },
    selectSkuOk(data) {
      this.objEditInfo.ProId = data.ProId;
      this.getSkuInfo();
    },
    getSkuInfo() {
      fetchData({
        hideLoading: true,
        API: '/api/Goods/GetGoodsInfoByApplyHSP',
        para: {
          proId: this.objEditInfo.ProId
        },
        callback: data => {
          this.objEditInfo = Object.assign(this.objEditInfo, data);
        }
      })
    },

    showStoreNum() { //显示库存
      this.isShowStoreNum = true;
    },
    showMatrixPrice() {
      this.isShowMatrixPrice = true;
    },
  },
  created() {
    this.isAudit = this.$route.query.isAudit == 1;
    this.objEditInfo.Id = this.$route.params.id;
    this.initPageData();
  }
}
</script>