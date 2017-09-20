<template>
  <div class="trend show-history">
    <span class="action-show" title="余额">
      <i class="icon icon-rmb">￥</i>
    </span>
    <div v-show="customerId">
      <div class="history-price p10">
        <div class=" pl10 pr10">
          <p style="border-bottom:1px solid #ddd;line-height:1;padding-bottom:10px"><b>账户余额</b></p>
          <ul class="pl10 mt10" style="font-size:12px;line-height:26px;">
            <li>
              预{{customerType==2?'收':'付'}}：{{dataIn.objDataContent.Prepay|currency}}
            </li>
            <li>
              应{{customerType==2?'收':'付'}}：{{dataIn.objDataContent.Balance|currency}}
            </li>
            <li>
              返利：{{dataIn.objDataContent.Rebate|currency}}
            </li>
            <li>
              额度：{{dataIn.objDataContent.Credit|currency}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    customerType: '',
    customerId: '',
  },
  data() {
    return {
      APILIST: {
        LIST: '/Api/Finance/ListAccount',
      },
      dataIn: {
        objDataContent: {}
      }
    }
  },
  methods: {
    initPageData() {
      var me = this;
      var para = {};
      para.PageIndex = 1;
      para.CustomerId = this.customerId;
      para.CustomerType = this.customerType;
      fetchData({
        API: this.APILIST.LIST,
        hideLoading: true,
        para,
        callback(data) {
          me.dataIn.objDataContent = data.Data[0];
        }
      })
    },
  },
  ready() {},
  watch: {
    customerId(newVal) {
      if (newVal) {
        this.initPageData();
      }
    }
  }
}
</script>