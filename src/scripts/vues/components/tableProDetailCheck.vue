<template>
  <table class="table table-bordered  text-center text-nowrap">
    <thead>
      <tr>
        <th style="width:60px;">序</th>
        <th style="width:100px">商品编码</th>
        <th>名称</th>
        <th v-show="curReceipt==1">带票商品名称</th>
        <th>颜色</th>
        <th style="width:100px">品牌</th>
        <th style="width:110px;">不含税单价</th>
        <th style="width:110px;" v-show="curReceipt==1">含税单价</th>
        <th style="width:60px;" v-show="curReceipt==1">税率</th>
        <th style="width:80px">数量</th>
        <th style="width:110px;">不含税金额</th>
        <th style="width:110px;" v-show="curReceipt==1">含税金额</th>
        <th style="width:110px;">备注</th>
      </tr>
    </thead>
    <tfoot>
      <tr class="table-v-top">
        <td :colspan="curReceipt==1?9:6" class="text-right">
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
        <td class="text-nowrap text-right">
          {{item.ProPrice1|currency}}
        </td>
        <td class="text-nowrap text-right" v-show="curReceipt==1">
          {{getProPrice1WithTax(item)|currency}}
        </td>
        <td v-show="curReceipt==1">
          {{item.TaxRate}}%
        </td>
        <td>
          {{item.ProCount}}
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
          {{item.Description}}
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
/**
 * 单据查看商品详情表
 * zhao.liubin@zol.com.cn
 * 2017.09.13
 */
export default {
  props: {
    editInfo: {
      Details: []
    },
    curReceipt: '',
  },
  data() {
    return {}
  },
  computed: {
    //是否显示价格
    computedIsShowPrice() {
      return window.localStorage.PricePower != 0;
    },
    //合计数据集
    computedCount() {
      let objCount = {
        goodsCount: 0,
        amount: 0,
        amountNoTax: 0,
        SNGoodsCount: 0,
        SNAmount: 0
      };
      let me = this;
      this.editInfo.Details.forEach(function(item) {
        let c = !validatorManu.isPosInteger(item.ProCount) ? 0 : item.ProCount;
        objCount.amount += me.getProAmount(item);
        objCount.goodsCount += parseInt(c);
        objCount.amountNoTax += me.getProPrice1Amount(item);
      });
      if (this.editInfo.Details1) {
        this.editInfo.Details1.forEach(item => {
          item.Details.forEach(item1 => {
            objCount.SNGoodsCount += +item1.ProCount;
            objCount.SNAmount += item1.ProCount * item1.ProPrice;
          })
        })
      }

      if (!this.computedIsShowPrice) {
        objCount.amount = objCount.amountNoTax = objCount.SNAmount = '***'
      }
      return objCount;
    },
  },
  components: {},
  methods: {

    getProPrice1WithTax(item) {
      if (!this.computedIsShowPrice) {
        return '***';
      }
      return item.ProPrice1 * (100 + item.TaxRate) / 100;
    },
    //税前总价
    getProPrice1Amount(item) {
      if (!this.computedIsShowPrice) {
        return '***';
      }
      return item.ProCount * item.ProPrice1 || 0;
    },
    //计算单个商品税后总价
    getProAmount(item) {
      if (!this.computedIsShowPrice) {
        return '***';
      }
      return (item.ProCount * (item.ProPrice1 * (100 + (this.curReceipt == 1 ? +item.TaxRate : 0)) / 100).toFixed(2)) || 0;
    },
  },
  ready() {}
}
</script>