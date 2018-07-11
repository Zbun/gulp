<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <button class="btn btn-primary fr" @click="edit(0)">新增</button>
        <input type="search" placeholder="输入关键字" class="com-ipt ipt-search" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table table-bordered datalist table-hover">
        <thead>
          <tr>
            <th style="width:80px;">编号</th>
            <th>售后服务标题</th>
            <th style="width:100px;">创建人</th>
            <th style="width:100px;">创建时间</th>
            <th style="width:100px;">最后更新人</th>
            <th style="width:100px;">最后更新时间</th>
            <th style="width:100px;">状态</th>
            <th style="width:100px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in dataIn.arrDataList">
            <td class="text-nowrap">
              {{item.Id}}
            </td>
            <td>
              {{item.Name}}
            </td>
            <td class="text-nowrap">
              {{item.AddUserRealName}}
            </td>
            <td class="text-nowrap">
              {{item.DateAdded|datetime}}
            </td>
            <td class="text-nowrap">
              {{item.LastModifyRealName}}
            </td>
            <td class="text-nowrap">
              {{item.DateModify|datetime}}
            </td>
            <td class="text-nowrap">
              <label class="switcher">
                <input type="checkbox" v-model="item.Status" @change="changeStatus($event,item)">
                <span class="icon"></span></label>
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
 * 基础配置-售后服务模板
 */
import editTemplate from './afterSaleEditPopup.vue';
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
          Key: '', //关键字
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
        API: '/api/Supplier/SGetAfterSalesTemplateList',
        para,
        callback: data => {
          if (data.Data.length == 0 && this.pageIndex > 1) {
            me.initPageData(--me.pageIndex);
          }
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    changeStatus(e, item) {
      let isChked = e.target.checked;
      fetchData({
        API: 'api/Supplier/AfterSalesTemplateEnable',
        para: {
          Id: item.Id,
          Status: isChked - 0
        },
        callback: data => {

        }
      })
    },
    del(item, index) {
      dialog({
        title: '删除',
        content: `确认删除“${item.Name}”？`,
        ok: () => {
          fetchData({
            API: '/api/Supplier/AfterSalesTemplateDelete',
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
          Status: 1,
        };
      }
      this.isShowPop = true;
    },
    editOk() {
      this.initPageData(this.pageIndex);
    },
  },
  created() {
    this.initPageData(1);
  }
}
</script>