<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <input type="search" placeholder="请输入物流公司名称/编码" class="com-ipt ipt-search" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table table-bordered datalist table-hover">
        <thead>
          <tr>
            <th style="width:60px;">
              <label class="checkbox">
                <input type="checkbox" @change="chooseAll($event)"><span class="icon"></span></label>
            </th>
            <th style="width:130px;">序号</th>
            <th>物流公司名称</th>
            <th style="width:150px;">物流公司ID</th>
            <th style="width:180px;">物流公司编码</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataIn.arrDataList">
            <td class="text-nowrap">
              <label class="checkbox">
                <input type="checkbox" :checked="1==item.IsSelected" @change="changeSelect($event,item)"><span class="icon"></span></label>
            </td>
            <td class="text-nowrap">
              {{item._index}}
            </td>
            <td :title="item.Name">
              {{item.Name}}
            </td>
            <td class="text-nowrap">
              {{item.Id}}
            </td>
            <td class="text-nowrap">
              {{item.LogisticsCode}}
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
</template>
<script>
/**
 * 基础设置-物流工具
 */
export default {
  data() {
    return {
      dataIn: {
        inited: false,
        arrDataList: []
      },
      arrChkedId: [],
      pageIndex: 1,
      dataOut: {
        search: {
          Key: '',
        }
      },
    }
  },
  components: {

  },
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 30;
      fetchData({
        API: '/api/Supplier/GetSupplierLogisticsList',
        hideLoading: true,
        para,
        callback: data => {
          this.dataIn.inited = true;
          data.Data.forEach((item, index) => {
            item._index = (para.pageIndex - 1) * para.pageSize + index + 1;
          })
          this.dataIn.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    updateSelect(selected, Ids) { //更新是否选中
      fetchData({
        API: '/api/Supplier/SupplierLogisticsSet',
        para: {
          selected,
          Ids
        },
        callback: data => {
          this.initPageData(this.pageIndex);
        }
      })
    },
    chooseAll(e) {
      let isChked = e.target.checked;
      let Ids = '',
        selected = 0;
      Ids = this.dataIn.arrDataList.map(el => el.Id).join(',');
      if (isChked) {
        selected = 1;
      }
      this.updateSelect(selected, Ids);
    },
    changeSelect(e, item) {
      let isChked = e.target.checked;
      this.updateSelect(isChked - 0, item.Id);
    }
  },
  created() {
    this.initPageData(1);
  }
}
</script>