<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <span class="tab-bar mr30">
          <em class="item" :class="{on:curIndex==1}" @click="changeStatus(1)">慧闪购</em>
        <em class="item" :class="{on:curIndex==2}"  @click="changeStatus(2)">严选货源</em>
        <em class="item" :class="{on:curIndex==3}"  @click="changeStatus(3)">众筹集采</em>
        </span>
        <select v-model="dataOut.search.Status" class="ml5 com-ipt">
          <option value="">状态</option>
          <option :value="key" v-for="(value,key) in computedStatus">
            {{value}}
          </option>
        </select>
        <input type="search" placeholder="商品名称" class="com-ipt ipt-search ml5" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <div class="ovh-y">
        <table class="table table-bordered datalist table-hover">
          <thead>
            <tr>
              <th>商品名称</th>
              <th style="width:110px;">单价</th>
              <th style="width:110px;">库存</th>
              <template v-if="curIndex==1">
                <th style="width:110px;">闪购价</th>
                <th style="width:110px;">优惠金额</th>
                <th style="width:110px;">每人限批</th>
                <th style="width:110px;">创建时间</th>
              </template>
              <template v-if="curIndex==2">
                <th style="width:110px;">严选类型</th>
                <th style="width:110px;">严选分类</th>
              </template>
              <th style="width:110px;">状态</th>
              <th style="width:110px;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in dataIn.arrDataList">
              <td class="text-nowrap">
                <img :src="item.Images|imagesLink" class="mr10"> {{item.ProName}}
              </td>
              <td class="text-nowrap">
                {{item.ProPrice|currency}}
              </td>
              <td class="text-nowrap">
                {{item.AmountSum}}
              </td>
              <template v-if="curIndex==1">
                <td class="text-nowrap">
                  {{item.HSPPrice|currency}}
                </td>
                <td class="text-nowrap">
                  {{item.Discount|currency}}
                </td>
                <td class="text-nowrap">
                  {{item.MaxBuyNumPeriods}}
                </td>
                <td class="text-nowrap">
                  {{item.DateAdded|datetime}}
                </td>
              </template>
              <template v-if="curIndex==2">
                <td class="text-nowrap">
                  {{item.YanType|yanType}}
                </td>
                <td class="text-nowrap">
                  {{item.YanCategoryName}}
                </td>
              </template>
              <td class="text-nowrap">
                <span :class="{'text-danger':item.Status==-1}">
                  {{item.Status|hspStatus}}
                </span>
              </td>
              <td>
                <div class="action-field">
                  <router-link class="item" v-if="curIndex==1" :to="{name:'HMMhuishanpiCheck',params:{id:item.Id}}">查看</router-link>
                  <router-link class="item" v-if="curIndex==2" :to="{name:'HMMyanxuanCheck',params:{id:item.Id}}">查看</router-link>
                  <a href="javascript:;" class="item" v-if="item.Status==1" @click="stop(item.Id)">暂停</a>
                  <a href="javascript:;" class="item" v-if="item.Status==2" @click="reload(item.Id)">重启</a>
                  <!-- <a href="javascript:;" class="item" @click="del(item,index)">删除</a> -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
        暂无相关数据
      </div>
      <div class="pageBox text-right"></div>
    </div>
  </div>
</template>
<script>
/**
 * 基础设置-商品库
 */

let _dataModule = {
  dataIn: {
    inited: false,
    arrDataList: []
  },
  APILIST: {
    LIST1: '/api/Goods/SGetHspList', //慧闪购
    LIST2: '/api/Goods/SGetYanList', //严选
    STOP1: '/api/Goods/HspSetStatus', //慧闪购暂停
    STOP2: '/api/Goods/YanSetStatus', //严选停止
  },
  curIndex: 1,
  pageIndex: 1,
  dataOut: {
    search: {
      Key: '',
      Status: '',
    }
  },
  editInfo: {}
}
export default {
  data() {
    return _dataModule
  },
  components: {},
  computed: {
    computedStatus() {
      return dictionary['hspStatus'];
    }
  },
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 10;
      fetchData({
        API: this.APILIST['LIST' + this.curIndex],
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    changeStatus(i) {
      this.curIndex = i;
      this.$router.replace({ name: 'HMMmyactivity', query: { type: this.curIndex } });
      this.initPageData(1);
    },
    stop(id) { //暂停活动
      fetchData({
        API: this.APILIST['STOP' + this.curIndex],
        para: {
          Id: id,
          Status: 2,
        },
        callback: () => {
          this.initPageData();
        }
      })
    },
    reload(id) { //重启
      fetchData({
        API: this.APILIST['STOP' + this.curIndex],
        para: {
          Id: id,
          Status: 1,
        },
        callback: () => {
          this.initPageData();
        }
      })
    },
    del(item, index) {
      alert('稍候实现');
      return;
      dialog({
        title: '删除',
        content: `确认删除“${item.Name}”？`,
        ok: () => {
          fetchData({
            API: '/api/Goods/PlatformSpuDelete',
            para: {
              Id: item.Id
            },
            callback: data => {
              this.dataIn.arrDataList.splice(index, 1);
            }
          })
        },
        cancel() {}
      }).showModal();
    },
    checkGoods(item) {
      alert('稍候实现');
    },
  },
  created() {
    this.curIndex = this.$route.query.type || 1;
    this.initPageData(1);
  }
}
</script>