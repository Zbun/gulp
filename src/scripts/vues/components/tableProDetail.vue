<template>
  <table class="table table-bordered  text-center text-nowrap">
    <thead>
      <tr>
        <th style="width:60px">序</th>
        <th style="width:50px;">
          <label class="checkbox">
            <input type="checkbox" @change="all_ChangeProId($event)" :checked="editInfo.Details.length>0&&editInfo.Details.length==arrChkProId.length"><span class="icon"></span></label>
        </th>
        <th style="width:100px">商品编码</th>
        <th>名称</th>
        <th v-show="curReceipt==1">带票商品名称</th>
        <th style="width:100px;">颜色</th>
        <th style="width:100px">品牌</th>
        <th style="width:110px;">不含税单价</th>
        <th style="width:110px;" v-show="curReceipt==1">含税单价</th>
        <th style="width:60px;" v-show="curReceipt==1">税率</th>
        <th style="width:100px">数量</th>
        <th style="width:110px;">不含税金额</th>
        <th style="width:110px;" v-show="curReceipt==1">含税金额</th>
        <th style="width:150px;">备注</th>
      </tr>
    </thead>
    <tfoot>
      <tr class="table-v-top">
        <td :colspan="curReceipt==1?10:7" class="text-right">
          <b class="mr20">合计</b>
        </td>
        <td>
          <b>{{computedCount.goodsCount}}</b>
        </td>
        <td class="text-right"><b>{{computedCount.amountNoTax|currency}}</b></td>
        <td class="text-right" v-show="curReceipt==1">
          <p class="price-show">
            <b>{{computedCount.amount|currency}}</b>
          </p>
        </td>
        <td></td>
      </tr>
    </tfoot>
    <tbody>
      <tr v-for="(index,item) of editInfo.Details">
        <td class="order">
          {{index+1}}
        </td>
        <td>
          <label class="checkbox">
            <input type="checkbox" :value="item.ProId" v-model="arrChkProId"><span class="icon"></span></label>
        </td>
        <td>
          <p class="text-nowrap">
            {{item.ProId}}
          </p>
        </td>
        <td class="text-nowrap text-left">{{item.ProName}}
        </td>
        <td v-show="curReceipt==1" class="text-left">
          {{item.AnotherProName}}
        </td>
        <td>
          {{item.Color}}
        </td>
        <td class="text-nowrap">
          {{item.Brand}}
        </td>
        <td class="text-nowrap">
          <template v-if="computedIsShowPrice">
            <span v-if="isDispatch==1">{{item.ProCostPrice|currency}}</span>
            <input v-else type="text" placeholder="输入价格" v-model="item.ProPrice1|currencyIn" data-validate="required money popShow" class="com-ipt x-small text-right" maxlength="9">
          </template>
          <span v-else>***</span>
        </td>
        <td class="text-nowrap text-right" v-show="curReceipt==1">
          {{getProPrice1WithTax(item)|currency}}
        </td>
        <td v-show="curReceipt==1">
          <select v-model="item.TaxRate">
            <option v-for="item in computedArrTaxRate" :value="item">{{item}}%</option>
          </select>
        </td>
        <td class="bg-currency">
          <input type="text" min=1 placeholder="数量" v-model="item.ProCount|posNumberInNotRequired" class="com-ipt xx-small pro-count" data-validate="required posInteger popShow" maxlength="9">
        </td>
        <td class="text-nowrap text-right bg-currency">
          {{getProPrice1Amount(item)|currency}}
        </td>
        <td class="bg-currency" v-show="curReceipt==1">
          <p class="text-nowrap text-right">
            {{getProAmount(item)|currency}}
          </p>
        </td>
        <td>
          <input type="text" class="com-ipt" placeholder="输入备注" v-model="item.Description" maxlength="500">
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
/**
 * 单据添加页商品详情表
 * zhao.liubin@zol.com.cn
 * 2017.09.13
 */
export default {
  props: {
    editInfo: {
      Details: []
    },
    arrChkProId: [],
    curReceipt: '',
    dataCount: {},
    isDispatch: '', //是调拨时，此时取proCostPrice价格
  },
  data() {
    return {}
  },
  computed: {
    computedArrTaxRate() {
      return window.localStorage.Config_TaxRate.split(',');
    },
    //是否显示价格
    computedIsShowPrice() {
      return window.localStorage.PricePower != 0;
    },
    //合计数据集
    computedCount() {
      let objCount = {
        goodsCount: 0,
        amount: 0,
        amountNoTax: 0
      };
      let me = this;
      this.editInfo.Details.forEach(function(item) {
        let c = !validatorManu.isPosInteger(item.ProCount) ? 0 : item.ProCount;
        objCount.amount += me.getProAmount(item);
        objCount.goodsCount += parseInt(c);
        objCount.amountNoTax += me.getProPrice1Amount(item);
      });
      if (!this.computedIsShowPrice) {
        objCount.amount = objCount.amountNoTax = '***'
      }
      return this.dataCount = objCount;
    },
  },
  components: {},
  methods: {
    //明细全选
    all_ChangeProId(e) {
      let isChked = e.target.checked;
      if (isChked) {
        let arrTemp = [];
        this.editInfo.Details.forEach(item => {
          arrTemp.push(item.ProId);
        });
        this.arrChkProId = arrTemp;
      } else {
        this.arrChkProId = [];
      }
    },
    //计算单个商品税后总价
    getProAmount(item) {
      if (!this.computedIsShowPrice) {
        return '***';
      }
      let price = this.isDispatch == 1 ? item.ProCostPrice : item.ProPrice1;
      return (item.ProCount * (price * (100 + (this.curReceipt == 1 ? +item.TaxRate : 0)) / 100).toFixed(2)) || 0;
    },
    getProPrice1WithTax(item) {
      if (!this.computedIsShowPrice) {
        return '***';
      }
      let price = this.isDispatch == 1 ? item.ProCostPrice : item.ProPrice1;
      return price * (100 + +item.TaxRate) / 100;
    },
    //税前总价
    getProPrice1Amount(item) {
      if (!this.computedIsShowPrice) {
        return '***';
      }
      let price = this.isDispatch == 1 ? item.ProCostPrice : item.ProPrice1;
      return item.ProCount * price || 0;
    },
  },
  ready() {}
}
</script>