<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>添加标签</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <div class="search-box">
              <input type="search" v-model="dataOut.search.key" placeholder="输入名称" class="com-ipt ipt-search" @keydown.enter="initPageData(1)">
              <div class="btn btn-search" @click="initPageData(1)">搜索</div>
            </div>
            <table class="table table-bordered datalist">
              <thead>
                <tr>
                  <th style="width:60px;">
                    <!--                     <label class="checkbox">
                      <input type="checkbox"><span class="icon"></span></label> -->
                  </th>
                  <th>标签名称</th>
                  <th style="width:100px;">关联商品</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in arrDataList">
                  <td>
                    <label class="checkbox">
                      <input type="checkbox" :id="'ll'+item.Id" v-model="arrChkItem" :value="item"><span class="icon"></span></label>
                  </td>
                  <td>
                    <label :for="'ll'+item.Id" class="block">
                      {{item.LabelName}}
                    </label>
                  </td>
                  <td>
                    <label :for="'ll'+item.Id" class="block">
                      {{item.SkuCount}}</label>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="table-data-empty" v-show="arrDataList.length==0">
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
export default {
  props: {
    show: { twoway: true, default: false },
    chkItem: [],
    isEdit: false,
  },
  data() {
    return {
      arrDataList: [],
      arrChkItem: [],
      dataOut: {
        search: {
          key: '',
        }
      }
    }
  },
  components: {},
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 15;
      fetchData({
        API: '/api/Goods/GetGoodsLabelListAndSkuCount',
        para,
        callback: data => {
          if (this.isEdit) {
            for (let i = 0; i < this.arrChkItem.length; i++) { //编辑时把已有的选中标签替换为当前数据中的对象，执行关联
              let curChked = _.find(data.Data, {
                Id: this.arrChkItem[i].Id
              });
              if (curChked) {
                this.arrChkItem.splice(i, 1, curChked);
              }
            }
          }
          this.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    onSubmit_Click() {
      this.$emit('update:chkItem', this.arrChkItem);
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
        if (this.isEdit) {
          this.arrChkItem = this.chkItem;
        }
        this.initPageData();
      }
    }
  }
}
</script>