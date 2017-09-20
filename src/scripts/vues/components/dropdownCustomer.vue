<template>
  <span class="intelligent-match">
        <span class="">
                <input type="search" class="select-long com-ipt" :class="{width:show=='l'}" placeholder="输入关键字，点击选择" v-model="intelligentMatch.customerName" @focus="IMIptFocus()" @input="IMIptInput()">
              </span>
  <ul class="list" v-show="intelligentMatch.isShow&&computedFilterCustomerInfo.length>0">
    <li class="item" v-for="item in computedFilterCustomerInfo" @click="selectedThisCustomerId(item)">{{item.Name}}</li>
  </ul>
  </span>
</template>
<script>
/**
 * 下拉感知客户组件
 */
export default {
  props: {
    show: 0, //是否加载/同时=='l'，时加载长输入框
    dataOut: {} //数据回传
  },
  data() {
    return {
      dataIn: {
        arrProList: [],
        categoryList: [],
        arrCustomer: []
      },
      intelligentMatch: {
        isShow: false,
        customerName: '',
      },
    }
  },
  components: {},
  computed: {
    //智能感知客户名
    computedFilterCustomerInfo() {
      let me = this;
      if (validatorManu.isEmpty(this.intelligentMatch.customerName)) {
        return this.dataIn.arrCustomer;
      } else {
        return this.dataIn.arrCustomer.filter((item) => {
          return !~item.Name.indexOf(me.intelligentMatch.customerName.trim());
        })
      }
    },
  },
  methods: { //客户智能感知
    IMIptFocus() {
      this.intelligentMatch.isShow = true;
    },
    IMIptInput() {
      this.dataOut.CustomerId = '';
      this.dataOut.CustomerName = '';
    },
    selectedThisCustomerId(item) {
      this.dataOut.CustomerId = item.Id;
      this.dataOut.CustomerName = item.Name;
      this.intelligentMatch.customerName = item.Name;
      this.intelligentMatch.isShow = false;
    },
    getCustomerList() {
      let me = this;
      fetchData({
        API: G_APILIST.CUSTOMER.DROPDOWNLIST,
        para: {
          pageIndex: 1,
          pageSize: 10000,
        },
        callback(data) {
          me.dataIn.arrCustomer = data.Data;
        }
      })
    },
  },
  created() {
    if (this.show) {

      this.getCustomerList();
      this.intelligentMatch.customerName = this.dataOut.CustomerName || '';
    }
  }
}
</script>