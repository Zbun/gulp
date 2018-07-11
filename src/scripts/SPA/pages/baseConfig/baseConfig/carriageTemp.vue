<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix mb15">
        <span class="fr">
          <router-link class="btn btn-primary ml5" :to="{name:'BCcarriageTempAdd'}">新增</router-link>
        </span>
        <input type="search" placeholder="输入关键字" class="com-ipt ipt-search" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table table-bordered-all mt10 table-hover table-fixed" v-for="(item,index) in dataIn.arrDataList">
        <thead>
          <tr>
            <td :colspan="item.IsFree==0?7:2">
              <div class="fr text-muted">
                <span class="mr20">
                  最后编辑时间：{{item.DateModify|datetime}}
                </span>
                <span class="text-lighter">
                  <router-link class="highlight" :to="{name:'BCcarriageTempEdit',params:{id:item.Id},query:{isCopy:1}}">复制模板</router-link>&#12288;|&#12288;
                  <router-link class="highlight" :to="{name:'BCcarriageTempEdit',params:{id:item.Id}}">编辑</router-link>&#12288;|&#12288;
                  <a href="javascript:;" class="highlight" @click="del(item,index)">删除</a>
                </span>
              </div>
              <strong>
                {{item.Name}}
              </strong>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="width:100px;">
              是否包邮
            </td>
            <td>
              配送区域
            </td>
            <td v-if="item.IsFree==0" style="width:130px;">
              计价方式
            </td>
            <td v-if="item.IsFree==0" style="width:130px;">
              首{{item.ChargingMode|carriageChargingModeText}}
            </td>
            <td v-if="item.IsFree==0" style="width:130px;">
              运费（元）
            </td>
            <td v-if="item.IsFree==0" style="width:130px;">
              续{{item.ChargingMode|carriageChargingModeText}}
            </td>
            <td v-if="item.IsFree==0" style="width:130px;">运费（元）</td>
          </tr>
          <tr v-for="item in item.Details">
            <td>
              {{item.IsFree==1?'包邮':'不包邮'}}
            </td>
            <td>
              {{item.Area}}
            </td>
            <td class="text-nowrap" v-if="item.IsFree==0">
              按{{item.ChargingMode|carriageChargingModeDetail}}计价
            </td>
            <td class="text-nowrap" v-if="item.IsFree==0">
              {{item.Ykg}}
            </td>
            <td class="text-nowrap" v-if="item.IsFree==0">
              {{item.FirstPrice |currency}}
            </td>
            <td class="text-nowrap" v-if="item.IsFree==0">
              {{item.Nkg}}
            </td>
            <td class="text-nowrap" v-if="item.IsFree==0">
              {{item.NextPrice | currency}}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
        暂无相关数据
      </div>
      <!-- <div class="pageBox text-right"></div> -->
    </div>
  </div>
</template>
<script>
/**
 * 基础设置-运费模板
 */
export default {
  data() {
    return {
      dataIn: {
        inited: false,
        arrDataList: []
      },
      pageIndex: 1,
      dataOut: {
        search: {
          Key: '',
        }
      },
    }
  },
  components: {},
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 10;
      this.arrChkedId = [];
      fetchData({
        API: '/api/Supplier/SupplierGetTransFeeTemplateList',
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data;
          // initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    del(item, index) {
      dialog({
        title: '删除',
        content: `确认删除“${item.Name}”？`,
        ok: () => {
          fetchData({
            API: '/api/Supplier/TransFeeTemplateDelete',
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
  },
  created() {
    this.initPageData(1);
  }
}
</script>