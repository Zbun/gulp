<template>
  <div class="main">
    <section class="text-center fixed-footer">
      <template v-if="isAudit">
        <button class="btn btn-primary large" @click="submit($event)">提交</button>
        <router-link :to="{name:'HMMhspCheckList'}" class="btn  large">取消</router-link>
      </template>
      <!-- <router-link :to="{name:'HMMhspCheckList'}" v-else class="btn  large">返回</router-link> -->
      <a href="javascript:history.go(-1)" v-else class="btn large">返回</a>
    </section>
    <div class="content-field">
      <p>
        <router-link :to="{name:'HMMhspCheckList'}">审核列表</router-link> >
        <span class="text-muted">慧闪批</span>
      </p>
      <div class="two-column-view mt10">
        <div class="item">
          <h3 class="title">
            商品信息
          </h3>
          <div class="content">
            <table class="justshow thin">
              <tbody>
                <tr>
                  <th style="width:8em">选择SKU</th>
                  <td>{{objEditInfo.GoodsInfo.ProName}}
                  </td>
                </tr>
                <tr>
                  <th>
                    起批量
                  </th>
                  <td>
                    {{objEditInfo.GoodsInfo.MinimumBuy}}台
                  </td>
                </tr>
                <tr>
                  <th>
                    规格参数
                  </th>
                  <td>
                    {{objEditInfo.GoodsInfo.SpecStr}}
                  </td>
                </tr>
                <tr>
                  <th>
                    价格
                  </th>
                  <td>
                    {{objEditInfo.GoodsInfo.ProPrice|currency}}
                    <a href="javascript:;" class="highlight ml10" v-if="objEditInfo.GoodsInfo.MatrixPrice&&objEditInfo.GoodsInfo.MatrixPrice.length" @click="showMatrixPrice">已设置高级价格</a>
                  </td>
                </tr>
                <tr>
                  <th>
                    总库存
                  </th>
                  <td>
                    {{objEditInfo.GoodsInfo.AmountSum}}
                    <a href="javascript:;" class="highlight ml10" v-if="objEditInfo.GoodsInfo.AmountDetails&&objEditInfo.GoodsInfo.AmountDetails.length" @click="showStoreNum">查看库存</a>
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
            <table class="justshow thin">
              <tbody>
                <tr>
                  <th style="width:8em">
                    每期最大销售量
                  </th>
                  <td>
                    {{objEditInfo.Amount}}
                  </td>
                </tr>
                <tr>
                  <th style="width:8em">
                    每期限批量
                  </th>
                  <td>
                    {{objEditInfo.MaxBuyNumPeriods}} 台/人
                  </td>
                </tr>
                <tr>
                  <th style="width:8em">
                    闪批价
                  </th>
                  <td>{{objEditInfo.HSPPrice|currency}}
                    <span class="text-light">
                         （优惠金额：{{objEditInfo.Discount|currency}} 元）
                       </span>
                  </td>
                </tr>
                <tr>
                  <th>
                    参加活动日期
                  </th>
                  <td>
                    {{objEditInfo.StartDate|date}}至{{objEditInfo.EndDate|date}}
                  </td>
                </tr>
                <tr>
                  <th>
                    默认购买量
                  </th>
                  <td>
                    {{objEditInfo.SaleNumVirtual}}
                  </td>
                </tr>
                <tr>
                  <th>
                    是否支持优惠券
                  </th>
                  <td>
                    {{objEditInfo.AllowCoupon==1?'是':'否'}}
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
            <table class="justshow">
              <tbody>
                <tr>
                  <th style="width:8em;">
                    审核结果
                  </th>
                  <td>
                    <label class="radio">
                      <input type="radio" value=1 v-model="AuditingStatus"><span class="icon"></span>同意</label>
                    <label class="radio">
                      <input type="radio" value='-1' v-model="AuditingStatus"><span class="icon"></span>不同意</label>
                  </td>
                </tr>
                <tr>
                  <th>审批意见</th>
                  <td>
                    <input type="text" v-model="AuditingDesc" v-if="isAudit" class="com-ipt xx-large">
                    <input type="text" v-model="objEditInfo.AuditingDesc" v-else readonly="" class="com-ipt xx-large">
                  </td>
                </tr>
                <tr v-if="!isAudit&&objEditInfo.AuditingRecord.length">
                  <th>
                    审批流程
                  </th>
                  <td>
                    <ul class="audit-flow">
                      <li class="item" v-for="item in objEditInfo.AuditingRecord">
                        <p class="time">{{item.ApplyDate|datetime}}</p>
                        <div class="detail">
                          <p><span :class="{'text-danger':item.Status!=1}">【审核{{item.Status==1?'同意':'拒绝'}}】</span>{{item.AuditingUserRealname}}</p>
                          <p>{{item.AuditingDesc}}</p>
                        </div>
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
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
 * 慧闪批审核
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
        HSPPrice: '', //闪批价
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
    clearCurSku() {
      this.objEditInfo = Object.assign({}, this.objMetaInfo);
    },
    showStoreNum() { //显示库存
      this.isShowStoreNum = true;
    },
    showMatrixPrice() {
      this.isShowMatrixPrice = true;
    },
    submit(e) {
      let para = JSON.parse(JSON.stringify(this.objEditInfo));
      fetchData({
        target: e.target,
        API: '/api/Goods/PHspAuditing',
        para: {
          Id: this.objEditInfo.Id,
          AuditingStatus: this.AuditingStatus,
          AuditingDesc: this.AuditingDesc,
        },
        callback: data => {
          this.$router.push({ name: 'HMMhspCheckList' });
        }
      })
    }
  },
  created() {
    // this.objMetaInfo = Object.assign({}, this.objEditInfo); //初始原字段
    this.isAudit = this.$route.query.isAudit == 1;
    this.objEditInfo.Id = this.$route.params.id;
    this.initPageData();
  }
}
</script>