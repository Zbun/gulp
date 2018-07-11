<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="cancelClick">&times;</a>选择商品</h2>
        <div class="body">
          <div class="content" style="width:800px">
            <div class="search-box clearfix">
              <input type="search" placeholder="输入SKU名称" class="com-ipt ipt-search ml5" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
              <span class="ml5">
              <select-brand :brand-id.sync="dataOut.search.BrandId"></select-brand>
              </span>
              <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
            </div>
            <table class="table table-bordered datalist table-hover">
              <thead>
                <tr>
                  <th style="width:60px;">
                    <label class="checkbox">
                      <input type="checkbox" :checked="arrChkProId.length>0&&computedIsAllChecked" @change="chooseAll($event)"><span class="icon"></span></label>
                  </th>
                  <th>SKU名称</th>
                  <th style="width:180px;">规格</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in dataIn.arrDataList">
                  <td class="text-nowrap">
                    <label class="checkbox">
                      <input type="checkbox" @change="changePro($event,item)" :id="'__p'+item.ProId" :value="item.ProId" v-model="arrChkProId"><span class="icon"></span></label>
                  </td>
                  <td :title="item.ProName">
                    <label :for="'__p'+item.ProId" class="block">
                      {{item.ProName}}
                    </label>
                  </td>
                  <td class="text-nowrap">
                    <label :for="'__p'+item.ProId" class="block">
                      {{item.SpecStr}}</label>
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
        <div class="footer text-center">
          <button class="btn btn-primary" @click="submitClick">确定</button>
          <button class="btn btn-default" @click="cancelClick">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 满减选择SPU
 */
import selectBrand from 'vues/components/goods/selectBrand.vue';
export default {
  props: {
    show: { twoway: true, default: false },
    goodsAddedList: [], //传入商品列表
  },
  components: { selectBrand },
  data() {
    return {
      arrChkProId: [],
      pageIndex: 1,
      arrProSelected: [],
      dataIn: {
        inited: false,
        arrDataList: []
      },
      dataOut: {
        search: {
          Key: '',
          BrandId: '0',
        }
      },
    }
  },
  computed: {
    computedIsAllChecked() {
      let l = this.dataIn.arrDataList.length;
      let is = !!l;
      for (let i = 0; i < l; i++) {
        if (_.indexOf(this.arrChkProId, this.dataIn.arrDataList[i].ProId) == -1) {
          is = false;
          break;
        }
      }
      return is;
    }
  },

  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 7;
      fetchData({
        API: '/api/Activity/SGetManjianSkuSearchList',
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
      this.dataIn.arrDataList.forEach(item => {
        let i = _.indexOf(this.arrChkProId, item.ProId);
        if (i > -1) {
          if (!isChked) {
            this.arrChkProId.splice(i, 1);
          }
        } else if (isChked) {
          this.arrChkProId.push(item.ProId);
          this.choosePro(item);
        }
      })
    },
    choosePro(item) { //选择商品
      let objTemp = {};
      Object.keys(item).forEach(k => {
        objTemp[k] = item[k];
      })
      this.arrProSelected.push(objTemp);
    },
    changePro(e, item) {
      let isChked = e.target.checked;
      if (isChked) {
        this.choosePro(item);
      }
    },
    submitClick() {
      let arrTemp = [];
      this.arrChkProId.forEach(item => {
        arrTemp.push(_.find(this.arrProSelected, {
          ProId: item
        }));
      })
      this.$emit('update:goodsAddedList', arrTemp);
      this.cancelClick();
    },
    cancelClick() {
      this.show = false;
      this.$emit('update:show', false);
    }
  },
  created() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.initPageData(1);
        this.arrChkProId = [];
        this.arrProSelected = [];
        this.goodsAddedList.forEach(item => {
          this.arrChkProId.push(item.ProId);
          this.arrProSelected.push(item);
        })
      }
    }
  }
}
</script>