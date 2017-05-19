<template>
  <div>
    <div class="clearfix" :class="{mt14:onlyPro!=1}">
      <div class="search">
        <select v-model="dataOut.search.Category">
          <option value="">选择分类</option>
          <option v-for="item in dataIn.dataCategory" :value="item.Category">{{item.CategoryName}}</option>
        </select>
        <input type="text" placeholder="输入名称关键字" class="com-ipt large ml5" maxlength="50" v-model="dataOut.search.Name" @keydown.enter="initPageData(1)">
        <button class="btn btn-primary ml5" @click="initPageData(1)">搜索</button>
      </div>
    </div>
    <table class="text-center table table-bordered table-hover table-odd mt14">
      <thead>
        <tr>
          <th>分类</th>
          <th>名称</th>
          <th>库存</th>
          <th style="width:80px;">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            <p class="text-nowrap">{{item.CategoryName}}</p>
          </td>
          <td>
            <p class="text-left pl5">{{item.Name}}</p>
          </td>
          <td>
            <p class="text-nowrap">{{item.StoreAmount}}</p>
          </td>
          <td>
            <div class="action">
              <a href="javascript:;" @click="add_Click(item);" class="item">添加</a>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
        <tr>
          <td colspan=4>
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
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    goodsAdded: {
      type: Object,
      twoway: true,
      default: {}
    },
    goodsAddedList: {
      type: Array,
      default: []
    },
    isLonely: {
      type: Boolean,
      default: false
    },
    action: '', //限制商品属性，1为可采购
    storeId: '',
    onlyGift: '',
    onlyPro: ''
  },
  data() {
    return {
      pageIndex: 1,
      dataIn: {
        inited: '',
        dataTable: [],
        dataCategory: []
      },
      dataOut: {
        search: {
          Name: '',
          Category: ''
        },
        curGoodsAdded: {}
      }
    }
  },
  methods: {
    initPageData(pageIndex = 1) {
      this.pageIndex = pageIndex;
      let para = this.dataOut.search;
      para.StoreId = this.storeId;
      para.PageIndex = pageIndex;
      para.action = this.action;
      para.PageSize = 10;
      para.ProType = 1;
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
    getCategory() {
      let me = this;
      fetchData({
        API: 'api/Product/Category',
        para: {
          tree: 1,
        },
        callback(data) {
          me.dataIn.dataCategory = data;
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    },
    add_Click(item) {
      if (_.find(this.goodsAddedList, {
          ProId: item.Id
        })) {
        return;
      } else {
        var obj = {};
        obj.ProId = item.Id;
        obj.StoreAmount = item.StoreAmount;
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
        this.storeId && (obj.StoreAmount = item.StoreAmount);
        if (this.isLonely) {
          this.goodsAddedList = [];
        }
        // this.goodsAddedList.push(obj);
        this.goodsAdded = obj;
        this.$dispatch('on-add-after');
      }
      // console.log(this.goodsAddedList);
    }
  },
  ready() {

  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.initPageData(1);
        this.getCategory();
      }
    }
  }
}
</script>
