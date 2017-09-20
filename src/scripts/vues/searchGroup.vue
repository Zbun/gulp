<template>
  <div class="clearfix" :class="{'search':!showContent.autoWidth}">
    <button class="btn btn-default fr" @click="export_Click()" v-if="exportApi">导出</button>
    <span class="mr20" v-if="showContent.isNodes">
    周期 <select v-model="dataOut.Nodes">
      <option value="">请选择</option>
      <option value="30-60-90">30-60-90（天）</option>
      <option value="7-14-28">7-14-28（天）</option>
      <option value="15-30-45">15-30-45（天）</option>
    </select>
  </span>
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
    <span class="mr20" v-if="showContent.isCategory" :class="{'required-mark':showContent.isCategoryRequired}">
    分类 <select v-model="dataOut.Category" class="ml5">
      <option value="">请选择</option>
      <option v-for="item in dataIn.categoryList" :value="item.Category">{{item.CategoryName}}</option>
    </select></span>
    <span class="select-box mr20 " v-if="showContent.isBranch" class="com-ipt ml5" :class="{'required-mark':showContent.isBranchRequired}">机构
          <select v-model="dataOut.BranchId">
            <option :value="item.Id" v-for="item in dataIn.branchList">
              {{item.Name}}
            </option>
          </select>
        </span>
    <span class="select-box mr20 with-del" v-if="showContent.isStore" :class="{'required-mark':showContent.isStoreRequired}">仓库
      <input type="text" @click="selectStore()"  :title="dataOut.StoreName" placeholder="选择仓库" readonly v-model="dataOut.StoreName" class="ml5">
      <i class="icon del" v-show="dataOut.StoreName" @click="delStore()"></i>
      <i class="icon" title="点击选择仓库" @click="selectStore()" ></i>
    </span>
    <span class="mr20" v-if="showContent.isProduct" :class="{'required-mark':showContent.isProductRequired}">商品名称
      <dropdown-pro :show="showContent.isProduct" :data-out.sync="dataOut" @search="search()"></dropdown-pro>
    </span>
    <button class="btn btn-primary" @click="search()" style="margin-left:-10px;">搜索</button>
    <store-list :show.sync="isShowStoreSelect" :store-selected.sync="dataOut"></store-list>
  </div>
</template>
<script>
/**
 * 通用报表搜索条件组件
 */
import storeList from 'vues/storeList.vue';
import dropdownPro from 'vues/components/dropdownPro.vue';
export default {
  props: {
    dataOut: {},
    showContent: {
      isDate: 0, //日期
      isCategory: 0, //分类
      isStore: 0, //仓库
      isProduct: 0, //商品
      isBranch: 0, //机构
      autoWidth: 0, //自动select宽度
    },
    exportApi: '',
    pageIndex: 1, //导出入使用当前分页内容
  },
  data() {
    return {
      isShowStoreSelect: false,
      intelligentMatch: {
        isShow: false,
        isShowPro: false,
        customerName: '',
        proName: ''
      },
      dataIn: {
        arrProList: [],
        categoryList: [],
        branchList: []
      },
    }
  },
  computed: {},
  components: {
    storeList,
    dropdownPro
  },
  methods: {
    //选择仓库弹窗
    selectStore() {
      this.isShowStoreSelect = true;
    },
    delStore() {
      this.dataOut.StoreId = '';
      this.dataOut.StoreName = '';
    },
    getCategory() {
      let me = this;
      fetchData({
        API: 'api/Product/Category',
        callback(data) {
          me.dataIn.categoryList = data;
        }
      })
    },
    getBranchList() {
      let me = this;
      fetchData({
        API: '/Api/User/Branch',
        para: {
          pageIndex: 1,
          pageSize: 10000,
        },
        callback(data) {
          me.dataIn.branchList = data;
          if (data.length > 0) {
            me.dataOut.BranchId = data[0].Id;
          }
        }
      })
    },
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
    this.showContent.isCategory && this.getCategory();
    this.showContent.isBranch && this.getBranchList();
  }
}
</script>