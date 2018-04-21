<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>选择Sku</h2>
        <div class="body">
          <div class="content" style="width:800px">
            <div class="search-box clearfix">
              <input type="search" placeholder="输入关键字" v-model="dataOut.search.Key" class="com-ipt ipt-search" @keydown.enter="initPageData(1)">
              <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
            </div>
            <span class="fr text-muted mr10" style="margin-top:-15px;">
                共 {{dataIn.arrDataList.length}} 个结果
              </span>
            <table class="table table-bordered datalist table-hover">
              <thead>
                <tr>
                  <th style="width:80px;">选择</th>
                  <th style="width:100px;">商品编码</th>
                  <th>商品名称</th>
                  <th style="width:100px;">价格</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in dataIn.arrDataList">
                  <td class="text-nowrap">
                    <label class="radio">
                      <input type="radio" :id="'__Sku'+item.Id" :value="item" v-model="chkedItem"><span class="icon"></span></label>
                  </td>
                  <td class="text-nowrap">
                    <label :for="'__Sku'+item.Id" class="block">
                      {{item.ProId}}
                    </label>
                  </td>
                  <td>
                    <label :for="'__Sku'+item.Id" class="block">
                      {{item.ProName}}</label>
                  </td>
                  <td class="text-nowrap">
                    <label :for="'__Sku'+item.Id" class="block">
                      {{item.ProPrice|currency}}</label>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
              暂无相关数据
            </div>
            <div class="pageBox text-right"></div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">确定</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 选择Sku
 */
export default {
  props: {
    show: { twoway: true, default: false },
    curItem: {}, //已选中Item
    isEdit: false,
  },
  data() {
    return {
      pageIndex: 1,
      chkedItem: '',
      dataIn: {
        inited: false,
        arrDataList: []
      },
      dataOut: {
        search: {
          Key: '', //关键字
        }
      },
    }
  },
  components: {},
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 15;
      fetchData({
        hideLoading: true,
        API: '/api/Goods/SGetSkuListAndPaging',
        para,
        callback: data => {
          if (data.Data.length == 0 && this.pageIndex > 1) {
            me.initPageData(--me.pageIndex);
          }
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data.Data;
          if (this.curItem && this.curItem.ProId) {
            this.dataIn.arrDataList.forEach(item => {
              if (item.ProId == this.curItem.ProId) {
                this.chkedItem = item;
              }
            })
          }
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    onSubmit_Click() {
      this.$emit('select-ok', Object.assign({}, this.chkedItem));
      this.onCancel_Click();
    },
    onCancel_Click() {
      this.show = false;
      this.$emit('update:show', false);
    }
  },
  created() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.chkedItem = {};
        this.initPageData();
      }
    }
  }
}
</script>