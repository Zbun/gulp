<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <span class="tab-bar">
          <em class="item" :class="{on:dataOut.search.Status===''}" @click="changeStatus('')">全部</em>
        <em class="item" :class="{on:dataOut.search.Status===0}"  @click="changeStatus(0)">待审核</em>
        <em class="item" :class="{on:dataOut.search.Status===-1}"  @click="changeStatus(-1)">审核失败</em>
        </span>
        <input type="search" placeholder="SKU名称/申请卖家" class="com-ipt ipt-search" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <div class="ovh-y">
        <table class="table table-bordered datalist table-hover">
          <thead>
            <tr>
              <th>商品</th>
              <th style="width:110px;">单价</th>
              <th style="width:110px;">库存</th>
              <th style="width:110px;">闪批价</th>
              <th style="width:110px;">优惠金额</th>
              <th style="width:110px;">每人限批</th>
              <th style="width:110px;">日期范围</th>
              <th style="width:110px;">申请卖家/申请时间</th>
              <th style="width:110px;">状态</th>
              <th style="width:110px;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in dataIn.arrDataList">
              <td class="text-nowrap">
                <img :src="item.Image" class="mr10"> {{item.ProName}}
              </td>
              <td class="text-nowrap">
                {{item.ProPrice|currency}}
              </td>
              <td class="text-nowrap">
                {{item.AmountSum}}
              </td>
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
                {{item.Start}}~{{item.End}}
              </td>
              <td class="text-nowrap">
                {{item.ShopName}}
                <p class="text-light">
                  {{item.ApplyDate|datetime}}
                </p>
              </td>
              <td class="text-nowrap">
                <span :class="{'text-danger':item.Status==-1}">
                {{item.Status|hspStatus}}
                </span>
              </td>
              <td>
                <div class="action-field">
                  <router-link :to="{name:'HMMhspCheck',params:{id:item.HSPId}}" class="item">查看</router-link>
                  <router-link class="item" v-if="item.Status==0" :to="{name:'HMMhspCheck',params:{id:item.HSPId},query:{isAudit:1}}">审核</router-link>
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
 * 营销中心-慧闪批列表
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
          Status: '',
        }
      },
      editInfo: {}
    }
  },
  components: {

  },
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 15;
      this.arrChkedId = [];
      fetchData({
        API: '/api/Goods/HGetHspAuditingList',
        para,
        callback: data => {
          this.dataIn.inited = true;
          data.Data.forEach(item => {
            if (item.Image.length == 0) {

            }
          })
          this.dataIn.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    changeStatus(status) { //切换商品类型
      this.dataOut.search.Status = status;
      this.initPageData(1);
    },

  },
  created() {
    this.initPageData(1);
  }
}
</script>