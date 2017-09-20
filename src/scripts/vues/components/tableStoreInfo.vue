<template>
  <table class="table table-bordered text-center">
    <thead>
      <tr>
        <th>
          {{isOut==1?'出':'入'}}库单号
        </th>
        <th>
          {{isOut==1?'出':'入'}}库时间
        </th>
        <th>
          {{isOut==1?'出':'入'}}库审核时间
        </th>
        <th>
          {{isOut==1?'发':'收'}}货仓库
        </th>
        <th>商品编码</th>
        <th>名称</th>
        <th>颜色</th>
        <th>品牌</th>
        <th>单价</th>
        <th>{{isOut==1?'出':'入'}}库数量</th>
        <th>小计</th>
      </tr>
    </thead>
    <tfoot>
      <tr>
        <td colspan="9" class="text-right"><b class="mr20">
                      合计
                    </b></td>
        <td class="text-nowrap"><b>{{computedCount.SNGoodsCount}}</b></td>
        <td class="text-nowrap text-right"><b>
                      {{computedCount.SNAmount|currency}}
                    </b>
        </td>
      </tr>
    </tfoot>
    <tbody>
      <template v-for="item of editInfo.Details1">
        <tr>
          <td :rowspan="item.Details.length" class="text-nowrap">
            {{item.Code}}
          </td>
          <td :rowspan="item.Details.length" class="text-nowrap">
            {{item.DateAdded|datetime}}
          </td>
          <td :rowspan="item.Details.length" class="text-nowrap">
            {{item.ChkDateTime|datetime}}
          </td>
          <td :rowspan="item.Details.length">
            {{item.StoreName}}
          </td>
          <td class="text-nowrap">
            {{item.Details[0].ProId}}
          </td>
          <td class="text-left">
            {{item.Details[0].ProName}}
          </td>
          <td>
            {{item.Details[0].Color}}
          </td>
          <td>
            {{item.Details[0].Brand}}
          </td>
          <td class="text-nowrap text-right">
            {{item.Details[0].ProPrice1|currency}}
          </td class="bg-currency">
          <td class="text-nowrap">
            {{item.Details[0].ProCount}}
          </td>
          <td class="bg-currency text-nowrap text-right">
            {{item.Details[0].ProPrice*item.Details[0].ProCount|currency}}
          </td>
        </tr>
        <tr v-for="item1 in item.Details.slice(1)">
          <td class="text-nowrap">
            {{item1.ProId}}
          </td>
          <td class="text-left">
            {{item1.ProName}}
          </td>
          <td>
            {{item1.Color}}
          </td>
          <td>
            {{item1.Brand}}
          </td>
          <td class="text-nowrap text-right">
            {{item1.ProPrice1|currency}}
          </td>
          <td class="text-nowrap">
            {{item1.ProCount}}
          </td>
          <td class="bg-currency text-nowrap text-right">
            {{item1.ProPrice*item1.ProCount|currency}}
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
<script>
export default {
  props: {
    editInfo: {},
    isOut: '', //是否出库
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
      this.editInfo.Details1.forEach(item => {
        item.Details.forEach(item1 => {
          objCount.SNGoodsCount += +item1.ProCount;
          objCount.SNAmount += item1.ProCount * item1.ProPrice;
        })
      })
      if (!this.computedIsShowPrice) {
        objCount.amount = objCount.amountNoTax = objCount.SNAmount = '***'
      }
      return objCount;
    },
  },
  components: {},
  methods: {},
  ready() {}
}
</script>