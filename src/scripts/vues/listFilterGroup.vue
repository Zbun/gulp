<template>
  <div class="search clearfix" :class="{mt20:showContent.isTab}">
    <span v-if="showContent.isDate" class="mr20" :class="{'required-mark':showContent.isDateRequired}">时间段
    <span class="date-field ml5">
      <input type="text" v-model="dataOut.StartDate"  readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'endDate\')}'})">
      <i class="fa fa-calendar icon"></i>
    </span>
    <span> - </span>
    <span class="date-field">
      <input type="text" v-model="dataOut.EndDate" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({minDate: '#F{$dp.$D(\'startDate\')}',maxDate:'%y-%M-%d'})">
      <i class="fa fa-calendar icon"></i>
    </span>
    </span>
    <span class="mr20" v-if="showContent.isCode">
    {{codeTitle||'单号'}}
    <input type="search" class="com-ipt width ml5" placeholder="输入单号" v-model="dataOut.Code" @keydown.enter="search(1)" maxlength="50">
  </span>
    <span class="mr20" v-if="showContent.isCustomer">
    <span class="mr5">客户</span>
    <dropdown-customer :show="showContent.isCustomer" :data-out.sync="dataOut"></dropdown-customer>
    </span>
    <span class="mr20" v-if="showContent.isSupplier">
    {{showContent.supplierStr||'供应商'}}
    <input type="search" class="com-ipt width ml5" placeholder="输入关键字" v-model="dataOut.SupplierName" maxlength="50" @keydown.enter="search()">
  </span>
    <span class="mr20" v-if="showContent.isFinacePayType">
    付款类别
    <select v-model="dataOut.PayType"  class="com-ipt ml5">
      <option value="">请选择</option>
      <option value="{{key}}" v-for="(key,value) in computedFinacePayType">{{value}}</option>
    </select>
  </span>
    <span class="mr20" v-if="showContent.isFinaceProceedsType">
    收款类别
    <select v-model="dataOut.PayType"  class="com-ipt ml5">
      <option value="">请选择</option>
      <option value="{{key}}" v-for="(key,value) in computedFinaceProceedsType">{{value}}</option>
    </select>
  </span>
    <span class="mr20" v-if="showContent.isStatus">
    状态
    <select  class="ml5" v-model="dataOut.Status">
      <option value="">请选择</option>
      <option v-for="(key,value) of purchaseOrderStatus" :value="key">{{value}}</option>
    </select>
  </span>
    <span class="mr20" v-if="showContent.isProduct" :class="{'required-mark':showContent.isProductRequired}">商品名称
    <dropdown-pro :show="showContent.isProduct" :data-out.sync="dataOut"></dropdown-pro>
  </span>
    <button class="btn btn-primary" @click="search()" style="margin-left:-10px;">搜索</button>
    <slot name="somethingOthers"></slot>
  </div>
</template>
<script>
/**
 * 通用表单搜索条件过滤组件
 */
import dropdownCustomer from 'vues/components/dropdownCustomer.vue';
import dropdownPro from 'vues/components/dropdownPro.vue';
export default {
  props: {
    dataOut: {},
    showContent: {
      isTab: 0, //在选项卡内时，加20像素上边距
      isDate: 0, //日期
      isCode: 0, //单号
      isSupplier: 0, //供应商
      supplierStr: '',
      isCustomer: 0, //客户
      isProduct: 0, //商品
      isStatus: 0, //商品
      isFinacePayType: 0, //商品
    },
    codeTitle: '单号',
    exportApi: '',
    pageIndex: 1, //导出入使用当前分页内容
  },
  data() {
    return {
      isShowStoreSelect: false,
    }
  },
  computed: {
    purchaseOrderStatus() {
      return dictionary['purchaseOrderStatus'];
    }, //结算类别
    computedFinacePayType() {
      return dictionary['finacePayType'];
    },
    computedFinaceProceedsType() {
      return dictionary['finaceProceedsType'];
    },
  },
  components: {
    dropdownCustomer,
    dropdownPro
  },
  methods: {
    search(v) {
      let v1 = v || '';
      this.$dispatch('search-ok', v1);
    },
    //导出
    export_Click() {
      var me = this;
      var para = this.dataOut;
      para.RptType = 1;
      para.PageIndex = this.pageIndex || 1;
      para.PageSize = 15;
      // para.billtype = this.billtype;
      fetchData({
        API: this.exportApi + '_Excel',
        para,
        callback(data) {
          // console.log(data);
          var server = window.APISERVER;
          dialog({
            title: '导出',
            content: `<a class="highlight" href="${server}${data}">导出Excel表格</a>`,
            cancelValue: '关闭',
            cancel() {}
          }).showModal();
        }
      })
    },
  },
  created() {
    // if (this.showContent.isDate) {
    //   this.dataOut.StartDate = zmm_date.getTheDay({
    //     x: parseInt(window.localStorage.DISSTARTDATE) || -7
    //   });
    //   this.dataOut.EndDate = zmm_date.getTheDay({
    //     x: parseInt(window.localStorage.DISENDDATE) || 0
    //   });
    // }
  }
}
</script>
