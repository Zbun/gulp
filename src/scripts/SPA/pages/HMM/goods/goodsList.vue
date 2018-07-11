<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <span class="fr">
          <button class="btn" v-if="dataOut.search.Status==0" @click="batchModifyStatus(1)">上架</button>
          <button class="btn ml5" v-if="dataOut.search.Status==1" @click="batchModifyStatus(0)">下架</button>
          <template v-if="dataOut.search.Status==-1" >
           <a href="javascript:;" class="btn ml5" @click="batchRestore">还原</a>
           <a href="javascript:;" class="btn ml5" @click="batchTerminate">彻底删除</a>
          </template>
          <button class="btn ml5" @click="batchDel" v-else>删除</button>
          <router-link  class="btn btn-primary ml5" :to="{name:'HMMgoodsPublish'}" >发布商品</router-link>
        </span>
        <span class="tab-bar">
          <em class="item" :class="{on:dataOut.search.Status==1}" @click="changeStatus(1)">销售中的商品</em>
        <em class="item" :class="{on:dataOut.search.Status==0}"  @click="changeStatus(0)">下架商品</em>
        <em class="item" :class="{on:dataOut.search.Status==-1}"  @click="changeStatus(-1)">回收站商品</em>
        </span>
        <input type="search" placeholder="输入SKU名称" class="com-ipt ipt-search ml5" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table table-bordered datalist table-hover">
        <thead>
          <tr>
            <th style="width:60px;">
              <label class="checkbox">
                <input type="checkbox" :checked="arrChkedId.length>0&&arrChkedId.length==dataIn.arrDataList.length" @change="chooseAll($event)"><span class="icon"></span></label>
            </th>
            <th style="width:130px;">SKU编号</th>
            <th>SKU名称</th>
            <!-- <th style="width:180px;">价格</th> -->
            <th style="width:150px;">库存</th>
            <th style="width:130px;">状态</th>
            <th style="width:180px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in dataIn.arrDataList">
            <td class="text-nowrap">
              <label class="checkbox">
                <input type="checkbox" :value="item.Id" v-model="arrChkedId"><span class="icon"></span></label>
            </td>
            <td class="text-nowrap">
              {{item.Id}}
            </td>
            <td :title="item.Name">
              {{item.Name}}
            </td>
            <!-- <td class="text-nowrap">
  {{item.Price}}
</td> -->
            <td class="text-nowrap">
              {{item.StoreNum}}
            </td>
            <td class="text-nowrap">
              {{item.StatusDesc}}
              <span v-if="item.Status==5" class="tooltips-i tooltips-tl tooltips-hover"><a href="javascript:;" class="icon icon-tips target" style="background:#999;margin-top:-2px;">!</a> <span class="txt" style="left:-10px;">
                        {{item.AuditingResult}}
                      </span></span>
            </td>
            <td>
              <div class="action-field">
                <a href="javascript:;" @click="modifyGoodsStatus(item,0)" class="item" v-if="item.Status==1">下架</a>
                <a href="javascript:;" @click="modifyGoodsStatus(item,1)" class="item" v-if="item.Status==0">上架</a>
                <router-link class="item" :to="{name:'HMMgoodsEdit',params:{id:item.Id}}">编辑</router-link>
                <a href="javascript:;" class="item" v-if="item.Status!=-1" @click="del(item)">删除</a>
                <a href="javascript:;" class="item" v-if="item.Status==-1" @click="restore(item)">还原</a>
                <a href="javascript:;" class="item" v-if="item.Status==-1" @click="terminate(item)">彻底删除</a>
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
 * 基础设置-商品库
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
      BrandId: 0,
      StartDate: '',
      Status: '1',
      EndDate: '',
    }
  },
  editInfo: {}
};
export default {
  data() {
    return _dataModule
  },
  components: {},
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 10;
      this.arrChkedId = [];
      fetchData({
        API: '/api/Goods/SGetSupplierGoodsSpuListAndPaging',
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    chooseAll(e) {
      let isChked = e.target.checked;
      if (isChked) {
        this.arrChkedId = this.dataIn.arrDataList.map(el => el.Id);
      } else {
        this.arrChkedId = [];
      }
    },
    changeStatus(status) { //切换商品类型
      this.dataOut.search.Status = status;
      this.initPageData(1);
    },
    changeGoodsStatus(status, ids) { //更改商品状态、上、下架操作
      let API = status == 0 ? '/api/Goods/SSupplierSpuOffStore' : '/api/Goods/SSupplierSpuOnStore'
      fetchData({
        API,
        para: {
          ids,
        },
        callback: data => {
          this.initPageData(this.pageIndex);
        }
      })
    },
    modifyGoodsStatus(item, status) { //修改商品状态：staus==0下架，1上架
      this.changeGoodsStatus(status, item.Id);
    },
    batchModifyStatus(status) { //批量1上、0下架,
      if (this.arrChkedId.length == 0) {
        showTips('请先勾选商品', 'warning');
        return;
      }
      this.changeGoodsStatus(status, this.arrChkedId.join(','));
    },
    delGoods(ids) { //删除商品方法
      fetchData({
        API: '/api/Goods/SSupplierSpuRecycleBin',
        para: {
          ids,
        },
        callback: data => {
          this.initPageData(this.pageIndex);
        }
      })
    },
    del(item) { //删除商品操作
      dialog({
        title: '删除',
        content: `确认删除“${item.Name}”？`,
        ok: () => {
          this.delGoods(item.Id);
        },
        cancel() {

        }
      }).showModal();
    },
    batchDel() { //批量删除商品
      if (this.arrChkedId.length == 0) {
        showTips('请先勾选商品', 'warning');
        return;
      }
      dialog({
        title: '批量删除',
        content: `确认删除这些商品吗？`,
        ok: () => {
          this.delGoods(this.arrChkedId.join(','));
        },
        cancel() {}
      }).showModal();
    },
    restoreGoods(ids) {
      fetchData({
        API: '/api/Goods/SSupplierSpuReductionFormRecycleBin',
        para: {
          ids,
        },
        callback: data => {
          this.initPageData(this.pageIndex);
        }
      })
    },
    restore(item) {
      this.restoreGoods(item.Id);
    },
    batchRestore() {
      if (this.arrChkedId.length == 0) {
        showTips('请先勾选商品', 'warning');
        return;
      }
      this.restoreGoods(this.arrChkedId.join(','));
    },
    terminateGoods(ids) { //彻底删除方法
      fetchData({
        API: '/api/Goods/SSupplierSpuDelete',
        para: {
          ids,
        },
        callback: data => {
          this.initPageData(this.pageIndex);
        }
      })
    },
    terminate(item) { //彻底删除
      dialog({
        title: '彻底删除',
        content: `确认彻底删除“${item.Name}”？`,
        ok: () => {
          this.terminateGoods(item.Id);
        },
        cancel() {

        }
      }).showModal();
    },
    batchTerminate() {
      if (this.arrChkedId.length == 0) {
        showTips('请先勾选商品', 'warning');
        return;
      }
      dialog({
        title: '批量彻底删除',
        content: `确认彻底删除这些商品吗？`,
        ok: () => {
          this.terminateGoods(this.arrChkedId.join(','));
        },
        cancel() {}
      }).showModal();
    },
  },
  created() {
    this.initPageData(1);
  }
}
</script>