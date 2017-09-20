<template>
  <table class="table table-bordered  text-center text-nowrap sn-list">
    <thead>
      <tr>
        <th style="width:60px">序</th>
        <th style="width:100px">商品编码</th>
        <th style="width:100px">品牌</th>
        <th>名称</th>
        <th v-show="curReceipt==1">带票商品名称</th>
        <th style="width:100px;">颜色</th>
        <th style="width:150px;">
          串码
        </th>
        <th style="width:150px;">
          串码2
        </th>
        <th style="width:150px;">
          串码3
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="item in editInfo.Details">
        <tr v-for="(index,item1) in item.Imei">
          <td class="order">
            <i class="on am-blink icon-triangle-left" v-show="item.On"></i>
            <span class="order-text" v-else>
                        {{index+1}}
                        </span>
          </td>
          <td>
            <p class="text-nowrap">
              {{item.ProId}}
            </p>
          </td>
          <td class="text-nowrap">
            {{item.Brand}}
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
            {{item1.split(',')[0]}}
          </td>
          <td class="text-nowrap">
            {{item1.split(',')[1]||''}}
          </td>
          <td class="text-nowrap">
            {{item1.split(',')[2]}}
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
<script>
export default {
  props: {
    editInfo: {}
  },
  data() {
    return {}
  },
  components: {},
  methods: {},
  ready() {}
}
</script>