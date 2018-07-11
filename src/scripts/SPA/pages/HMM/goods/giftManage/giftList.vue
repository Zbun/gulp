<template>
  <div class="main">
    <div class="content-field goods-category clearfix">
      <div class="z-tree category-tree">
        <p class="topBanner">
          <router-link :to="{name:'HMMgiftCategory'}" class="fr highlight">管理</router-link>
          <b>赠品分类</b>
        </p>
        <ul class="list">
          <li class="item dead" v-for="item in arrDataCategoryList" :class="{on:curItem.Id==item.Id,spread:item._spread}">
            <p class="title" @click.stop="selectItem(item)" :class="{on:curItem.Id==item.Id}" :title="item.Name">{{item.Name}}</p>
            <ul class="list no-spread">
              <li class="item" v-for="item in item.Child" :class="{on:curItem.Id==item.Id}">
                <p class="title" @click.stop="selectItem(item)" :title="item.Name">
                  {{item.Name}}
                </p>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="data-content">
        <div class="clearfix align-btn">
          <span class="crumbs">
        {{curItem.PathName}}
        </span>
        </div>
        <div class="search-box clearfix">
          <button class="btn btn-primary fr" v-if="2==curItem.Level" @click="edit(0)">
            新增赠品
          </button>
          <input type="search" @keydown.enter="getListByCId" v-model="dataOut.search.key" class="ipt-search com-ipt" placeholder="请输入赠品名称">
          <button class="btn btn-primary btn-search" @click="getListByCId">搜索</button>
        </div>
        <table class="table table-bordered table-hover datalist">
          <thead>
            <tr>
              <th>
                赠品名称
              </th>
              <th style="width:100px">图片</th>
              <th style="width:130px;">
                价格
              </th>
              <th style="width:130px;">
                库存
              </th>
              <th style="width:130px;">
                创建时间
              </th>
              <th style="width:130px">
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
                <img :src="item.Image|imageLink" alt="">
              </td>
              <td class="text-nowrap">
                {{item.Price|currency}}
              </td>
              <td class="text-nowrap">
                {{item.Amount}}
              </td>
              <td class="text-nowrap">
                {{item.DateAdded|datetime}}
              </td>
              <td>
                <div class="action">
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
        <div class="pageBox text-right"></div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 *商品管理--赠品管理
 */

let _dataModule = {
  isShowAddCategory: false,
  arrDataCategoryList: [],
  curItem: { //分类树选中当前
    Id: '' //默认总类
  },
  curCategoryId: '', //
  pageIndex: 1,
  dataIn: {
    arrDataList: []
  },
};
export default {
  data() {
    return {
      isShowAddCategory: false,
      arrDataCategoryList: [],
      curItem: { //分类树选中当前
        Id: '' //默认总类
      },
      curCategoryId: '', //
      pageIndex: 1,
      dataIn: {
        arrDataList: []
      },
      dataOut: {
        search: {
          key: '',
        }
      }
    }
  },
  components: {

  },
  methods: {
    initPageData() {
      fetchData({
        API: '/api/Activity/SGetGiftCategoryTree',
        callback: data => {
          data.forEach(item => {
            item._spread = false;
            if (this.curCategoryId && !this.curItem.Id) {
              for (let i = 0; i < item.Child.length; i++) {
                if (this.curCategoryId == item.Child[i].Id) {
                  item._spread = true;
                  this.curItem = item.Child[i];
                  this.dataOut.search.key = '';
                  this.getListByCId(1);
                  break;
                }
              }
            }
          })
          this.arrDataCategoryList = data;
          if (!this.curCategoryId && data[0] && data[0].Child.length) {
            data[0]._spread = true;
            this.curItem = data[0].Child[0];
            this.dataOut.search.key = '';
            this.getListByCId(1);
          }
        }
      })
    },
    getListByCId(pageIndex) {
      let para = {};
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 10;
      this.arrChkedId = [];
      fetchData({
        API: '/api/Activity/GetGiftListByCategroyId',
        hideLoading: true,
        para: {
          key: this.dataOut.search.key,
          categoryId: this.curItem.Id,
        },
        callback: data => {
          this.dataIn.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.getListByCId, pageIndex);
        }
      })
    },
    selectItem(item) {
      if (!item._spread != undefined) {
        item._spread = !item._spread;
      }
      if (item.Level == 2 && this.curItem.Id != item.Id) {
        this.curItem = item;
        this.$router.replace({
          name: 'HMMgiftList',
          query: {
            categoryId: item.Id
          }
        });
        this.dataOut.search.key = '';
        this.getListByCId();
      }
    },

    del(item, index) {
      dialog({
        title: '删除',
        content: `确认删除“${item.Name}”？`,
        ok: () => {
          fetchData({
            API: '/api/Activity/GiftDelete',
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
      let query = {
        pathName: encodeURI(this.curItem.PathName),
      };
      let params = {
        categoryId: this.curItem.Id,
      };
      if (i == 1) {
        query.id = item.Id; //编辑时需读取当前商品的ID
      }
      this.$router.push({
        name: 'HMMgiftEdit',
        params,
        query,
      })
    },
  },
  created() {
    this.curCategoryId = this.$route.query.categoryId || '';
    this.initPageData();
  }
}
</script>