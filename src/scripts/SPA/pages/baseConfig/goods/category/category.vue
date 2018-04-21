<template>
  <div class="main">
    <div class="content-field goods-category clearfix">
      <div class="z-tree category-tree">
        <ul class="list">
          <li class="item spread dead" :class="{on:curItem.Id==-1}" @click.stop="selectItem({Id:-1,Child:arrDataCategoryList})">
            <p class="title">全部分类</p>
            <ul class="list">
              <li class="item" v-for="item in arrDataCategoryList" :class="{on:curItem.Id==item.Id,spread:item._spread}">
                <p class="title" @click.stop="selectItem(item)" :class="{on:curItem.Id==item.Id}" :title="item.Item">{{item.Item}}</p>
                <ul class="list list-end">
                  <li class="item" v-for="item in item.Child" :class="{on:curItem.Id==item.Id}">
                    <p class="title" @click.stop="selectItem(item)" :title="item.Item">
                      {{item.Item}}
                    </p>
                  </li>
                </ul>
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
              <th style="width:100px;">
                序号
              </th>
              <th style="width:130px;">
                分类编码
              </th>
              <th>
                名称
              </th>
              <th style="width:130px;">
                顺序
              </th>
              <th style="width:130px;">
                状态
              </th>
              <th style="width:160px">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in curItem.Child">
              <td>
                {{index+1}}
              </td>
              <td>
                {{item.Code}}
              </td>
              <td>
                {{item.Item}}
              </td>
              <td>
                <a href="javascript:;" class="icon icon-up" @click="up(item,index)" :class="{disabled:index==0}"></a>
                <a href="javascript:;" class="icon icon-down" @click="down(item,index)" :class="{disabled:index+1==curItem.Child.length}"></a>
              </td>
              <td>
                <label class="switcher">
                  <input type="checkbox" v-model="item.Enable" @change.stop="enable($event,item)">
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
        <div class="table-data-empty" v-show="curItem.Child&&curItem.Child.length==0">
          暂无相关数据
        </div>
      </div>
    </div>
    <add-category :show.sync="isShowAddCategory" :cur-item.sync="curItem" :edit-item.sync="editItem" :is-edit="isEdit"></add-category>
  </div>
</template>
<script>
/**
 * 基础设置-品类管理
 */
import addCategory from './popup/addCategory.vue';
export default {
  data() {
    return {
      isShowAddCategory: false,
      arrDataCategoryList: [],
      curItem: { //分类树选中当前
        Id: '-1' //默认总类
      },
      isEdit: 0,
      editItem: { //子项选中当前
        Item: '',
        Id: '',
      }
    }
  },
  components: { addCategory },
  methods: {
    initPageData() {
      // console.log(this.$route)
      fetchData({
        API: '/api/Goods/GetCategoryALL',
        callback: data => {
          data.forEach(item => {
            item._spread = false;
          })
          this.curItem = {
            Id: '-1',
            Child: data,
            PCode: 0,
            Code: 0,
            PathName: '',
          }
          this.arrDataCategoryList = data;
        }
      })
    },
    selectItem(item) {
      if (!item._spread != undefined) {
        item._spread = !item._spread;
      }
      this.curItem = item;
    },
    up(item, index) {
      fetchData({
        API: 'api/Goods/CategoryWeightUP',
        para: {
          Id: item.Id
        },
        callback: data => {
          let arrTemp = this.curItem.Child.splice(index - 1, 1);
          this.curItem.Child.splice(index, 0, arrTemp[0]);
        }
      })
    },
    down(item, index) {
      fetchData({
        API: 'api/Goods/CategoryWeightdown',
        para: {
          Id: item.Id
        },
        callback: data => {
          this.curItem.Child.splice(index, 1);
          this.curItem.Child.splice(index + 1, 0, item);
        }
      })
    },
    enable(e, item) {
      let isChked = e.target.checked;
      fetchData({
        API: '/api/Goods/CategoryEnable',
        para: {
          Id: item.Id,
          Enable: isChked - 0
        },
        callback: () => {
          item.Enable = isChked;
        }
      })
    },
    del(item, index) {
      dialog({
        title: '删除',
        content: `确认删除“${item.Item}”此条类别？`,
        ok: () => {
          fetchData({
            API: '/api/Goods/CategoryDelete',
            para: {
              Id: item.Id
            },
            callback: data => {
              this.curItem.Child.splice(index, 1);
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