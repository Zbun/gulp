<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <span class="fr">

          <router-link  class="btn btn-primary ml5" :to="{name:'HMMtaocanActivityEdit'}" >新增活动</router-link>
        </span>
        <span class="tab-bar">
          <em class="item" :class="{on:dataOut.search.Status===''}" @click="changeStatus('')">所有活动</em>
        <em class="item" :class="{on:dataOut.search.Status===2}"  @click="changeStatus(2)">未开始</em>
        <em class="item" :class="{on:dataOut.search.Status===1}"  @click="changeStatus(1)">进行中</em>
        <em class="item" :class="{on:dataOut.search.Status===0}"  @click="changeStatus(0)">已结束</em>
        </span>
        <!--         <input type="search" placeholder="输入关键字" class="com-ipt ipt-search ml5" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button> -->
      </div>
      <table class="table table-bordered datalist table-hover">
        <thead>
          <tr>
            <th>活动名称</th>
            <th style="width:180px;">生效时间</th>
            <th style="width:150px;">活动状态</th>
            <th style="width:130px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataIn.arrDataList">
            <td :title="item.Name">
              {{item.Name}}
            </td>
            <td class="text-nowrap">
              {{item.Start|datetime}}至{{item.End|datetime}}
            </td>
            <td class="text-nowrap">
              {{item.StatusDesc}}
            </td>
            <td>
              <div class="action-field">
                <template v-if="item.IsShowBtnEdit==1">
                  <router-link class="item" :to="{name:'HMMtaocanActivityEdit',query:{id:item.Id}}">编辑</router-link>
                  <a href="javascript:;" class="item" @click="del(item)">删除</a>
                </template>
                <template v-if="item.IsShowBtnStop==1">
                  <router-link class="item" :to="{name:'HMMtaocanActivityEdit',query:{id:item.Id,isCheck:1}}">查看</router-link>
                  <a href="javascript:;" class="item" @click="end(item)">结束</a>
                </template>
                <template v-if="item.IsShowBtnCopy==1">
                  <router-link class="item" :to="{name:'HMMtaocanActivityEdit',query:{id:item.Id,isCopy:1}}">复制</router-link>
                  <a href="javascript:;" class="item" @click="del(item)">删除</a>
                </template>
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
  </div>
</template>
<script>
/**
 * 营销活动--优惠套餐活动列表
 */

let _dataModule = {
  dataIn: {
    inited: false,
    arrDataList: []
  },
  arrChkedId: [],
  pageIndex: 1,
  dataOut: {
    search: {
      Key: '',
      Status: '',
    }
  },
  editInfo: {}
};
export default {
  data() {
    return _dataModule
  },
  components: {

  },
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 10;
      fetchData({
        API: '/api/Activity/SGetTaocanList',
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },

    changeStatus(status) { //切换商品类型
      this.dataOut.search.Status = status;
      this.initPageData(1);
    },
    del(item) { //删除
      dialog({
        title: '删除操作',
        content: `确认删除该活动吗？`,
        ok: () => {
          fetchData({
            API: '/api/Activity/TaocanDelete',
            para: {
              Id: item.Id,
            },
            callback: data => {
              this.initPageData(this.pageIndex);
            }
          })
        },
        cancel() {

        }
      }).showModal();
    },
    end(item) { //结束
      dialog({
        title: '结束操作',
        content: `确认结束该活动吗？`,
        ok: () => {
          fetchData({
            API: '/api/Activity/ActivitySetStatus',
            para: {
              Id: item.Id,
              Status: 0,
            },
            callback: data => {
              this.initPageData(this.pageIndex);
            }
          })
        },
        cancel() {

        }
      }).showModal();
    },
  },
  created() {
    this.initPageData(1);
  }
}
</script>