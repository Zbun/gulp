<template>
  <div class="main">
    <section class="text-center fixed-footer">
      <button class="btn btn-primary large" @click="submit($event)">保存</button>
      <router-link :to="{name:'HMMactivityApply'}" class="btn  large">取消</router-link>
    </section>
    <div class="content-field">
      <p>
        <router-link :to="{name:'HMMactivityApply'}">平台活动申报</router-link> >
        <span class="text-muted">{{curTId?'编辑':'新增'}}严选</span>
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
                    <input type="text" readonly="" :value="objEditInfo.MinimumBuy" class="com-ipt x-large"> 台
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
                    严选类型
                  </th>
                  <td>
                    <label class="radio">
                      <input type="radio" v-model="objEditInfo.Type" value="1">
                      <span class="icon"></span>爆款</label>
                    <label class="radio">
                      <input type="radio" v-model="objEditInfo.Type" value="2">
                      <span class="icon"></span>专款</label>
                    <label class="radio">
                      <input type="radio" v-model="objEditInfo.Type" value="3">
                      <span class="icon"></span>毛利王</label>
                    <label class="radio">
                      <input type="radio" v-model="objEditInfo.Type" value="4">
                      <span class="icon"></span>OEM</label>
                  </td>
                </tr>
                <tr>
                  <th style="width:8em">
                    类型说明
                  </th>
                  <td>
                    <textarea class="com-ipt xx-large" v-model="objEditInfo.TypeDesc" rows="5"></textarea>
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
 * 严选申请
 */
import selectSku from './popup/selectSku.vue';
import checkMatrixPrice from './popup/checkMatrixPrice.vue';
import checkStoreNum from './popup/checkStoreNum.vue';
export default {
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
        ProPrice: '', //价格
        AmountSum: '', //总库存
        Type: 1, //类型
        TypeDesc: '', //说明
      }
    }
  },
  components: {
    selectSku,
    checkStoreNum,
    checkMatrixPrice

  },
  methods: {
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
        showTips('请选择SKU', 'error');
        return;
      }
      if (!zmm_validator(this.$el)) {
        return;
      }

      let para = JSON.parse(JSON.stringify(this.objEditInfo));
      fetchData({
        target: e.target,
        API: '/api/Goods/SYanApplyEdit',
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