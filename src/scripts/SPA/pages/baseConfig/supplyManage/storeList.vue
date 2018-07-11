<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <button class="btn btn-primary fr" @click="edit(0)">新增</button>
        <input type="search" placeholder="输入仓库名称" class="com-ipt ipt-search" v-model="dataOut.search.KeyName" @keydown.enter="initPageData(1)">
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table table-bordered datalist table-hover">
        <thead>
          <tr>
            <th>仓库编号</th>
            <th>供应商名称</th>
            <th>仓库名称</th>
            <th style="width:160px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in dataIn.arrDataList">
            <td class="text-nowrap">
              {{item.Id}}
            </td>
            <td class="text-nowrap">
              {{item.CompanyName}}
            </td>
            <td>
              {{item.Name}}
            </td>
            <td>
              <div class="action-field">
                <a href="javascript:;" class="item" @click="edit(1,item)">编辑</a>
                <a href="javascript:;" class="item" @click="del(item,index)">删除</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
        暂无相关数据
      </div>
      <div class="pageBox text-right"></div>
    </div>
    <edit-template :show.sync="isShowPop" :cur-item="editItem" @save-ok="editOk"></edit-template>
  </div>
</template>
<script>
/**
 * 供应管理--仓库列表
 */
import editTemplate from './storeAddPopup.vue';
export default {
  data() {
    return {
      isShowPop: false,
      pageIndex: 1,
      dataIn: {
        inited: false,
        arrDataList: []
      },
      dataOut: {
        search: {
          KeyName: '', //仓库
        }
      },
      isEdit: 0,
      curItem: {
        Id: '',
      },
      editItem: {}
    }
  },
  components: {
    editTemplate
  },
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 10;
      fetchData({
        API: '/api/Supplier/GetStorehouseList',
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    del(item, index) {
      dialog({
        title: '删除',
        content: `确认删除“${item.Name}”？`,
        ok: () => {
          fetchData({
            API: '/api/Supplier/SupplierStorehouseDelete',
            para: {
              Id: item.Id
            },
            callback: data => {
              this.dataIn.arrDataList.splice(index, 1);
            }
          })
        },
        cancel() {

        }
      }).showModal();
    },
    edit(i, item) { //i为1时编辑，0时添加
      this.isEdit = i;
      if (i == 1) {
        this.editItem = Object.assign({}, item);
        this.curItem = item;
      } else {
        this.editItem = {
          Id: 0,
          SCId: 0, //初始化供应商为0
          Areas: [],
        };
      }
      this.isShowPop = true;
    },
    editOk() {
      this.initPageData(this.pageIndex);
    },
    checkGoods(item) {
      alert('稍候实现');
    },
  },
  created() {
    this.initPageData(1);
  }
}
</script>