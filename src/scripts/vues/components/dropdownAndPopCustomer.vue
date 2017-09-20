<template>
  <div class="intelligent-match">
    <span class="select-box">
                <input type="search" class="select-long com-ipt" placeholder="关键字" v-model="intelligentMatch.customerName" @focus="IMIptFocus()" @input="IMIptInput()">
                <i class="icon" title="点击选择客户" @click="selectCustomer()"></i>
              </span>
    <ul class="list" v-show="intelligentMatch.isShow&&computedFilterCustomerInfo.length>0">
      <li class="item" v-for="item in computedFilterCustomerInfo" @click="selectedThisCustomerId(item)">{{item.Name}}</li>
    </ul>
  </div>
  <customer-list :show.sync="isShowCustomerSelect" @on-add-after="selectedThisCustomerId"></customer-list>
</template>
<script>
/**
 * 下拉感知客户组件
 */
import customerList from 'vues/customerList.vue';
export default {
  props: {
    show: 0, //是否加载/同时=='l'，时加载长输入框
    dataOut: {} //数据回传
  },
  data() {
    return {
      isShowCustomerSelect: false,
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
  components: {
    customerList,
  },
  computed: {
    //智能感知客户名
    computedFilterCustomerInfo() {
      let me = this;
      if (validatorManu.isEmpty(this.intelligentMatch.customerName)) {
        return this.dataIn.arrCustomer;
      } else {
        return this.dataIn.arrCustomer.filter((item) => {
          return item.Name.indexOf(me.intelligentMatch.customerName.trim()) > -1;
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
          me.intelligentMatch.customerName = me.dataOut.CustomerName || '';
        }
      })
    },
    //选择客户弹窗
    selectCustomer() {
      this.isShowCustomerSelect = true;
    },
  },
  created() {
    setTimeout(this.getCustomerList);
  }
}
</script>