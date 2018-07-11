<template>
  <div class="main">
    <section class="text-center fixed-footer">
      <a href="javascript:history.go(-1)" class="btn large">返回</a>
    </section>
    <div class="content-field">
      <p>
        <router-link :to="{name:'HMMmyactivity',query:{type:2}}">活动列表</router-link> >
        <span class="text-muted">严选</span>
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
                    <input type="text" placeholder="" class="com-ipt x-large" readonly="" :value="objEditInfo.GoodsInfo.MinimumBuy"> 台
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
            <table class="table justshow">
              <tbody>
                <tr>
                  <th style="width:8em">
                    严选类型
                  </th>
                  <td>
                    <label class="radio">
                      <input type="radio" disabled v-model="objEditInfo.Type" value="1">
                      <span class="icon"></span>爆款</label>
                    <label class="radio">
                      <input type="radio" disabled v-model="objEditInfo.Type" value="2">
                      <span class="icon"></span>专款</label>
                    <label class="radio">
                      <input type="radio" disabled v-model="objEditInfo.Type" value="3">
                      <span class="icon"></span>毛利王</label>
                    <label class="radio">
                      <input type="radio" disabled v-model="objEditInfo.Type" value="4">
                      <span class="icon"></span>OEM</label>
                  </td>
                </tr>
                <tr>
                  <th style="width:8em">
                    类型说明
                  </th>
                  <td>
                    <textarea class="com-ipt xx-large" v-model="objEditInfo.TypeDesc" readonly="" rows="5"></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="item" v-if="objEditInfo.Status!=0">
          <h3 class="title">
            审核信息
          </h3>
          <div class="content">
            <div class="set w8em">
              <dl class="item">
                <dt class="title">
                  审核结果
                </dt>
                <dd class="content">
                  {{objEditInfo.LastStatus==1?'同意':'不同意'}}
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  货源分类
                </dt>
                <dd class="content">
                  {{objEditInfo.YanCategoryName}}
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  审批意见
                </dt>
                <dd class="content">
                  {{objEditInfo.AuditingDesc}}
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  审批流程
                </dt>
                <dd class="content">
                  <ul class="audit-flow">
                    <li class="item" v-for="item in objEditInfo.AuditingRecord">
                      <p class="time">{{item.ApplyDate|datetime}}</p>
                      <div class="detail">
                        <p><span :class="{'text-danger':item.Status!=1}">【审核{{item.Status==1?'同意':'拒绝'}}】</span>{{item.AuditingUserRealname}}</p>
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
 * 严选查年
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
        AuditingRecord: [],
        Id: 0,
        ProId: '',
        ProName: '',
        AmountDetails: [], //库存数组
        MatrixPrice: [], //高级价格数组
        MinimumBuy: '', //起批量
        ProPrice: '', //价格
        AmountSum: '', //总库存
        Type: 1, //类型
        TypeDesc: '', //说明
      }
    }
  },
  computed: {},
  methods: {
    initPageData() {
      fetchData({
        hideLoading: true,
        API: '/api/Goods/GetYanInfo',
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