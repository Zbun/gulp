<template>
  <div class="main">
    <section class="text-center fixed-footer">
      <button class="btn btn-primary large" @click="submit($event)">保存</button>
      <router-link :to="{name:'HMMactivityApply'}" class="btn  large">取消</router-link>
    </section>
    <div class="content-field">
      <p>
        <router-link :to="{name:'HMMactivityApply'}">平台活动申报</router-link> >
        <span class="text-muted">{{curTId?'编辑':'新增'}}慧闪购</span>
      </p>
      <div class="two-column-view mt15">
        <div class="item">
          <h3 class="title">
            商品信息
          </h3>
          <div class="content">
            <table class="justshow">
              <tbody>
                <tr>
                  <th style="width:8em">选择SKU</th>
                  <td>
                    <span class="tag tag-pure on" style="margin:0;" v-if="objEditInfo.ProName">
                    {{objEditInfo.ProName}}
                    <i class="tag-del" @click="clearCurSku">×</i>
                  </span>
                    <a href="javascript:;" class="highlight ml5" @click="showSelectSku">选择SKU</a>
                    <select-Sku :show.sync="isShowSelectSku" :cur-item="objEditInfo" @select-ok="selectSkuOk"></select-Sku>
                  </td>
                </tr>
                <tr>
                  <th>
                    起批量
                  </th>
                  <td>
                    <input type="text" v-model="objEditInfo.MinimumBuy" class="com-ipt x-large" placeholder="请输入起批量" data-validate="required show posInteger"> 台
                  </td>
                </tr>
                <tr>
                  <th>
                    一件几台
                  </th>
                  <td>
                    <input type="text" placeholder="请输入一件几台" class="com-ipt x-large" v-model="objEditInfo.PieceOfNum" data-validate="required show posInteger">
                  </td>
                </tr>
                <tr>
                  <th>
                    规格参数
                  </th>
                  <td>
                    {{objEditInfo.SpecStr}}
                  </td>
                </tr>
                <tr>
                  <th>
                    价格
                  </th>
                  <td>
                    <input type="text" :value="objEditInfo.ProPrice" class="com-ipt x-large" readonly>
                    <a href="javascript:;" class="highlight" v-if="objEditInfo.MatrixPrice.length" @click="showMatrixPrice">已设置高级价格</a>
                  </td>
                </tr>
                <tr>
                  <th>
                    总库存
                  </th>
                  <td>
                    <input type="text" :value="objEditInfo.AmountSum" class="com-ipt x-large" readonly> <a href="javascript:;" class="highlight" v-if="objEditInfo.AmountDetails.length" @click="showStoreNum">查看库存</a>
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
                    <div class="ipt-with-tips" style="z-index:5">
                      <input type="text" data-validate-text="请填写最大销量" data-validate="required integer show" placeholder="请填写最大销量" class="com-ipt x-large" v-model="objEditInfo.Amount"> <span class="tooltips-i tooltips-t"><a href="javascript:;" class="icon icon-tips">!</a> <span class="txt">
                        数量不能超过总库存
                      </span></span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th style="width:8em">
                    每期限批量
                  </th>
                  <td>
                    <div class="ipt-with-tips">
                      <input type="text" data-validate-text="请填写限批量" data-validate="required integer show" placeholder="请填写限批量" class="com-ipt x-large" v-model="objEditInfo.MaxBuyNumPeriods"> <span class="tooltips-i tooltips-t"><a href="javascript:;" class="icon icon-tips">!</a> <span class="txt">
                        0代表不限购
                      </span></span>
                    </div> 台/人
                  </td>
                </tr>
                <tr>
                  <th style="width:8em">
                    闪购价
                  </th>
                  <td>
                    <input type="text" data-validate-text="请填写闪购价" data-validate="required money show" placeholder="请填写闪购价" class="com-ipt x-large" v-model="objEditInfo.HSPPrice">
                    <div class="bubble-box bubble-l ml5">优惠金额：{{comptutedDiscount|currency}} 元</div>
                  </td>
                </tr>
                <tr>
                  <th>
                    参加活动日期
                  </th>
                  <td>
                    <span>
      <span class="date-field col2">
        <input type="text" v-model="objEditInfo.Start" readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate: '#F{$dp.$D(\'endDate\')}',minDate:'%y-%M-%d {%H}:%m:%s'})" @focus="changeTimeStart($event)" style="width:140px;">
        <i class="fa fa-calendar icon"></i>
      </span>
                    <span> - </span>
                    <span class="date-field col2">
        <input type="text" v-model="objEditInfo.End" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate: '#F{$dp.$D(\'startDate\')}'})" @focus="changeTimeEnd($event)" style="width:140px;">
        <i class="fa fa-calendar icon"></i>
      </span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>
                    默认购买量
                  </th>
                  <td>
                    <input type="search" placeholder="请填写默认购买量" class="com-ipt x-large" data-validate-text="请填写默认购买量" data-validate="required intger show" v-model="objEditInfo.SaleNumVirtual">
                  </td>
                </tr>
                <tr>
                  <th>
                    是否支持优惠券
                  </th>
                  <td>
                    <label class="radio">
                      <input type="radio" v-model="objEditInfo.AllowCoupon" value="1">
                      <span class="icon"></span>是</label>
                    <label class="radio">
                      <input type="radio" v-model="objEditInfo.AllowCoupon" value="0">
                      <span class="icon"></span>否</label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <check-store-num :show.sync="isShowStoreNum" :obj-edit-info="objEditInfo"></check-store-num>
    <check-matrix-price :show.sync="isShowMatrixPrice" :obj-edit-info="objEditInfo"></check-matrix-price>
  </div>
</template>
<script>
/**
 * 慧闪购申请
 */
import selectSku from './popup/selectSku.vue';
import checkMatrixPrice from './popup/checkMatrixPrice.vue';
import checkStoreNum from './popup/checkStoreNum.vue';
export default {
  components: {
    selectSku,
    checkStoreNum,
    checkMatrixPrice
  },
  data() {
    return {
      isShowSelectSku: false,
      isShowStoreNum: false,
      isShowMatrixPrice: false,
      objMetaInfo: {},
      objEditInfo: {
        Id: 0,
        ProId: '',
        ProName: '',
        AmountDetails: [], //库存数组
        MatrixPrice: [], //高级价格数组
        MinimumBuy: '', //起批量
        PieceOfNum: '', //一件几台
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
  computed: {
    comptutedDiscount() {
      return this.objEditInfo.ProPrice - this.objEditInfo.HSPPrice;
    }
  },
  methods: {
    changeTimeStart(e) { //临时解决时间选择选不中问题
      this.objEditInfo.Start = e.target.value;
    },
    changeTimeEnd(e) { //临时解决时间选择选不中问题
      this.objEditInfo.End = e.target.value;
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
      if (!this.objEditInfo.ProId) {
        showTips('请选择SKU', 'warning');
        return;
      }
      if (!zmm_validator(this.$el)) {
        return;
      }

      if (this.objEditInfo.Amount > this.objEditInfo.AmountSum) {
        showTips('最大销量不能超过库存', 'warning');
        return;
      }
      if (this.objEditInfo.HSPPrice > this.objEditInfo.ProPrice) {
        showTips('闪购价不能大于商品原价', 'warning');
        return;
      }
      if (!this.objEditInfo.Start || !this.objEditInfo.End) {
        showTips('请选择日期', 'warning');
        return;
      }
      if (new Date(this.objEditInfo.Start) < new Date()) {
        showTips('活动时间不能早于当前时间', 'warning');
        return;
      }
      let para = JSON.parse(JSON.stringify(this.objEditInfo));

      fetchData({
        target: e.target,
        API: '/api/Goods/SHspApplyEdit',
        para,
        callback: data => {
          this.$router.push({ name: 'HMMmyactivity' });
        }
      })
    }
  },
  created() {
    this.objMetaInfo = Object.assign({}, this.objEditInfo); //初始原字段
  }
}
</script>