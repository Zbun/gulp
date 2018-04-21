<template>
  <div class="main">
    <div class="content-field goods-category clearfix topList">
      <div class="z-tree category-tree">
        <div class="treeBanner">慧头条栏目
          <a href="javascript:;" @click="toTopicList">栏目管理</a>
        </div>
        <ul class="list toplist">
          <li class="item dead m0" :class="{on:curItem.Id==item.Id}" v-for="item in arrDataTopList">
            <p class="topList" @click.stop="selectItem(item,1)" :title="item.SectionTitle">{{item.SectionTitle}}</p>
          </li>
        </ul>
        </li>
        </ul>
      </div>
      <div class="data-content">
        <div class="clearfix align-btn">
          <div class="fr">
            <input type="text" placeholder="" class="com-ipt ipt-search btn-iconsearch" v-model="dataOut.Key" @keydown.enter="initPageData(1)">
            <button @click="initPageData(1)">
              <i class="iconfont icon-sousuo"></i>
            </button>
            <button class="btn btn-primary fr" @click="addArticle()">
              新增头条
            </button>
          </div>
          <span class="crumbs">
            全部栏目{{curItem.SectionTitle?('>'+curItem.SectionTitle):''}}
          </span>
        </div>
        <table class="table table-bordered table-hover datalist">
          <thead>
            <tr>
              <th style="width:300px;">
                标题
              </th>
              <th style="width:30px;">
                作者
              </th>
              <th style="width:30px;">
                小编
              </th>
              <th style="width:130px;">
                栏目
              </th>
              <th style="width:130px;">
                发布时间
              </th>
              <th style="width:30px">
                阅读次数
              </th>
              <th style="width:130px;">
                状态
              </th>
               <th style="width:130px;">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in arrTableData">
              <td>
                {{item.Title}}
              </td>
              <td>
                {{item.Author}}
              </td>
              <td>
                {{item.Editer}}
              </td>
              <td>
                {{item.SectionTitle}}
              </td>
              <td>
                 {{item.DateAdded|datetime}}
              </td>
              <td>
                {{item.ReadingNum}}
              </td>
              <td>
                <label class="switcher">
                  <input type="checkbox" v-model="item.Status" @change.stop="enable($event,item)">
                  <span class="icon"></span>
                </label>
              </td>
               <td>
                <a href="javascript:;" class="item" @click="addArticle(item.Id)">编辑</a>
                <a href="javascript:;" class="item" @click="del(item,index)">删除</a>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="table-data-empty" v-show="arrTableData&&arrTableData.length==0">
          暂无相关数据
        </div>
        <div class="pageBox text-right"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      arrDataTopList: [],
      arrTableData: [],
      curItem: {
        //分类树选中当前
        Id: "-1" //默认总类
      },
      dataOut: {

      }
    };
  },
  components: {},
  methods: {
    initPageData(pageIndex) {
      //首次获取列表
      fetchData({
        API: "api/Misc/GetArticleSectionList",
        callback: data => {
          this.arrDataTopList = data;
          console.log(data);
          this.curItem = data;
          this.selectItem(data[0], 1);
        }
      });
    },
    selectItem(item, pageIndex) {
      let para = {};
      para.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 15;
      para.SectionId = item.Id;
      para.key = this.dataOut.Key;
      fetchData({
        API: "api/Misc/PGetArticleListPaging",
        para,
        hideLoading: true,
        callback: data => {
          this.arrTableData = data.Data;
          initPage(
            this.$el,
            data.TotalPages,
            data.TotalRows,
            this.selectItem,
            pageIndex
          );
        }
      });
      this.curItem = item;
    },
    enable(e, item) {
      let isChked = e.target.checked;
      fetchData({
        API: "api/Misc/ArticleStatus",
        para: {
          Id: item.Id,
          Status: isChked - 0
        },
        callback: () => {
          item.Status = isChked;
        }
      });
    },
    upName(...args) {
      //获取从结构树中提交上来的当前选中项的名称
      this.curName = args[0];
      this.curId = args[1];
    },
    toTopicList(){
      this.$router.push('topicList');
    },
    del(item, index) {
      console.log(item);
      dialog({
        title: '删除',
        content: `确认删除“${item.Title}”？`,
        ok: () => {
          fetchData({
            API: 'api/Misc/ArticleDelete',
            para: {
              Id: item.Id
            },
            callback: data => {
              this.arrTableData.splice(index, 1);
            }
          })
        },
        cancel() {

        }
      }).showModal();
    },
    addArticle(topid){       
            this.$router.push({
          path: 'addTopList',
          query: {
            id: topid
          }
        })
    }
  },
  created() {
    this.initPageData(1); //获取头条列表
  }
};
</script>
