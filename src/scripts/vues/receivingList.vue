<template>
  <div>
    <div class="search clearfix mt20">
      <span class="mr5">时间段</span>
      <span class="date-field">
            <input type="text" v-model="dataOut.search.StartDate"  readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'endDate\')}'})">
            <i class="fa fa-calendar icon"></i>
          </span>
      <span> - </span>
      <span class="date-field">
            <input type="text" v-model="dataOut.search.EndDate" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({minDate: '#F{$dp.$D(\'startDate\')}'})">
            <i class="fa fa-calendar icon"></i>
         </span>
      <span class="ml20">
          <span class="mr5">入库单号</span>
      <input type="search" class="com-ipt width" placeholder="输入单号" v-model="dataOut.search.Code" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      <span class="ml20">
          <span class="mr5">供应商</span>
      <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.SupplierName" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <table class="table text-center table-hover table-odd table-bordered mt-1">
      <thead>
        <tr>
          <th>
            <label class="checkbox">
              <input type="checkbox" @change="all_Change($event)" :checked="dataIn.dataTable.length>0&&dataIn.dataTable.length==arrChkCode.length"><span class="icon"></span></label>
          </th>
          <th>入库单号</th>
          <th>供应商</th>
          <th>收货机构</th>
          <th>收货仓库</th>
          <th>入库时间</th>
          <th>操作人</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            <label class="checkbox">
              <input type="checkbox" :value="item.Code" v-model="arrChkCode"><span class="icon"></span></label>
          </td>
          <td>
            <p class="text-nowrap">
              <a v-link="{ name: 'libraryInOrderCheck', params:{ lioCode: item.Code}}" class="highlight">{{item.Code}}</a></p>
          </td>
          <td>
            {{item.SupplierName}}
          </td>
          <td>
            {{item.BranchName}}
          </td>
          <td>
            {{item.StoreName}}
          </td>
          <td>
            <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
          </td>
          <td>
            {{item.UserNameAdded}}
          </td>
        </tr>
      </tbody>
      <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
        <tr>
          <td colspan=7>
            <div class="data-empty">
              <i class="icon"></i>
              <p class="font-big text">暂无相关数据</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="text-center">
      <div class="pageBox"></div>
    </div>
  </div>
</template>
<script>
import vTree from 'commonVues/vTreeSimple.vue';
export default {
  components: {
    vTree
  },
  crAddedList: {
    type: Array,
    default: []
  },
  data() {
    return {
      isOpen: true,
      element: null,
      curDetails: [],
      searchText: '',
      arrCRCode: [],
      arrCRSelected: [],
      dataIn: {
        objDataTree: {}
      }

    }
  },
  props: {
    show: {
      type: Boolean,
      twoway: true,
      default: false
    }
  },
  methods: {
    initPageData(pageIndex = 1) {
      this.pageIndex = pageIndex;
      let para = this.dataOut.search;
      para.PageIndex = pageIndex;
      para.action = this.action;
      para.PageSize = 10;
      // para.ProType = 1;
      var me = this;
      fetchData({
        API: '/api/Product/List',
        para,
        callback(data) {
          // console.log(data);
          me.dataIn.inited = true;
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageIndex);
        }
      });
    },
    selectThisCR(item) {
      var obj = {};
      obj.ProId = item.Id;
      obj.StoreAmount = item.StoreAmount;
      obj.Amount = item.Amount; //库存
      obj.AmountCanUsed = item.AmountCanUsed; //可用库存
      obj.Category = item.Category;
      obj.CategoryName = item.CategoryName;
      obj.Standard = 1; //标准，一机2串，3串等
      obj.ProName = item.Name;
      obj.PriceHistory = item.PriceHistory; //历史价格
      obj.ProCount = ''; //数量
      obj.ProPrice = ''; //原价
      obj.ProCostPrice = obj.ProPrice1 = item.ProPrice; //成本价
      obj.Description = ''; //备注
      obj.TaxRate = 0; //税率
      obj.ProType = item.ProType; //商品类型
      if (this.isLonely) {
        this.crAddedList = [];
      }
      // this.arrChkProId.push(obj.ProId);
      this.arrCRSelected.push(obj);
    },
    proId_Change(e, item) {
      let isChked = e.target.checked;
      if (isChked) {
        this.selectThisCR(item);
      }
    },
    all_Change(e) {
      let me = this;
      let isChked = e.target.checked;
      this.dataIn.dataTable.forEach(item => {
        let i = _.indexOf(me.arrCRCode, item.Code);
        if (i > -1) {
          if (!isChked) {
            this.arrCRCode.splice(i, 1);
            // this.arrProSelected.splice(i, 1);
          }
        } else if (isChked) {
          this.arrCRCode.push(item.Code);
          this.arrCRSelected(item);
        }
      })
    },
    onSubmit_Click() {
      // this.goodsAddedList = this.arrProSelected;
      let arrTemp = [];
      this.arrCRCode.forEach(item => {
        arrTemp.push(_.find(this.arrCRSelected, {
          Code: item
        }));
      })
      this.crAddedList = arrTemp;
      this.show = false;
    },

    cancel_Click() {
      this.show = false;
    },
    afterToggleOn(item) {
      this.curDetails = item.Details;
    }
  },
  watch: {
    show(newValue) {
      if (newValue) {
        this.getBranchTree();
        const me = this;
        this.element = $(this.$el).find('.v-tree');
        this.element
          .on('click', 'li.item', function(e) {
            me.element.find('li.item').removeClass('on');
            $(this).addClass('on');
            e.stopPropagation();
          })
      } else {
        this.isOpen = true;
        this.element.off('click');
      }
    }
  }
}
</script>