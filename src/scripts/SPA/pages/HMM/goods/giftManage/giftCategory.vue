<template>
  <div class="main">
    <div class="content-field goods-category clearfix">
      <div class="z-tree category-tree">
        <p class="topBanner">
          <b><router-link :to="{name:'HMMgiftList'}">赠品管理</router-link></b> > 分类管理
        </p>
        <ul class="list">
          <li class="item spread dead" :class="{on:curItem.Id==0}" @click.stop="selectItem({Id:'0',Child:arrDataCategoryList})">
            <p class="title">全部分类</p>
            <ul class="list no-spread">
              <li class="item" v-for="item in arrDataCategoryList" :class="{on:curItem.Id==item.Id,spread:item._spread}">
                <p class="title" @click.stop="selectItem(item)" :class="{on:curItem.Id==item.Id}" :title="item.Name">{{item.Name}}</p>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="data-content">
        <div class="clearfix align-btn">
          <button class="btn btn-primary fr" @click="edit(0)">
            新增
          </button>
          <span class="crumbs">
        全部分类{{curItem.PathName?('>'+curItem.PathName):''}}
        </span>
        </div>
        <table class="table table-bordered table-hover datalist">
          <thead>
            <tr>
              <th>
                名称
              </th>
              <th style="width:30%">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in dataIn.arrDataList">
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
        <div class="table-data-empty" v-show="dataIn.arrDataList.length==0">
          暂无相关数据
        </div>
      </div>
    </div>
    <add-category :show.sync="isShowAddCategory" :cur-item.sync="curItem" :edit-item.sync="editItem" :is-edit="isEdit" @save-ok="initPageData"></add-category>
  </div>
</template>
<script>
/**
 *商品管理--赠品分类管理
 */
import addCategory from './popGiftCategory.vue';
export default {
  data() {
    return {
      isShowAddCategory: false,
      arrDataCategoryList: [],
      curItem: { //分类树选中当前
        Id: '0' //默认总类
      },
      dataIn: {
        arrDataList: [],
      },
      isEdit: 0,
      editItem: { //子项选中当前
        Item: '',
        Id: '',
      }
    }
  },
  components: {
    addCategory,
  },
  methods: {
    initPageData() {
      fetchData({
        API: '/api/Activity/SGetGiftCategoryTree',
        callback: data => {
          data.forEach(item => {
            item._spread = false;
          })
          if (this.curItem.Level != 1) { //编辑及新增二级分类时刷新树同时当前选中状态
            this.curItem = {
              Id: '0',
              Child: data,
              PathName: '',
              Level: 0,
            }
          }
          this.arrDataCategoryList = data;
          this.getDataList();
        }
      })
    },
    getDataList() {
      fetchData({
        API: '/api/Activity/SGetGiftCategoryByPId',
        hideLoading: true,
        para: {
          PId: this.curItem.Id,
        },
        callback: data => {
          this.dataIn.arrDataList = data;
        }
      })
    },
    selectItem(item) {
      if (!item._spread != undefined) {
        item._spread = !item._spread;
      }
      this.curItem = item;
      this.getDataList();
    },
    del(item, index) {
      dialog({
        title: '删除',
        content: `确认删除“${item.Name}”此条类别？`,
        ok: () => {
          fetchData({
            API: '/api/Activity/GiftCategoryDelete',
            para: {
              Id: item.Id
            },
            callback: data => {
              this.initPageData();
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
        this.editItem = item;
      }
      this.isShowAddCategory = true;
    },
  },
  created() {
    this.initPageData();
  }
}
</script>