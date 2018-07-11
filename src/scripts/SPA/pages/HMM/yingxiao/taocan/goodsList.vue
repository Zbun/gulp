<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="cancelClick">&times;</a>选择商品</h2>
        <div class="body">
          <div class="content" style="width:1000px">
            <table class="table table-bordered-all thin ">
              <thead>
                <tr>
                  <th style="width:50%">
                    <div class="search-box clearfix">
                      <input type="search" placeholder="请输入商品名称" class="com-ipt ipt-search" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
                      <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
                    </div>
                  </th>
                  <th>已选套餐商品（{{arrProSelected.length}}）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:0;vertical-align:top;">
                    <table class="table small table-hover">
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
                    <div class="pageBox text-right mr10"></div>
                  </td>
                  <td style="padding:0;vertical-align:top;">
                    <table class="table small table-hover">
                      <colgroup>
                        <col>
                        <col style="width:50px;">
                      </colgroup>
                      <tbody>
                        <tr v-for="(item,index) in arrProSelected">
                          <td>
                            {{item.ProName}}
                          </td>
                          <td>
                            <a href="javascript:;" class="highlight" @click="delPro(item,index)">删除</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
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
export default {
  props: {
    show: { twoway: true, default: false },
    goodsAddedList: [], //传入商品列表
  },
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
  components: {},
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 7;
      fetchData({
        API: '/api/Activity/SGetTaocanSkuSearchList',
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    choosePro(item) { //选择商品
      let objTemp = {};
      Object.keys(item).forEach(k => {
        objTemp[k] = item[k];
        objTemp.SetPrice = '';
      })
      this.arrProSelected.push(objTemp);
    },
    changePro(e, item) {
      let isChked = e.target.checked;
      if (isChked) {
        if (this.arrProSelected.length == 5) {
          showTips('最多选择5个商品，请知悉', 'warning');
          this.arrChkProId.splice(this.arrChkProId.indexOf(item.ProId), 1);
          return;
        }
        this.choosePro(item);
      } else {
        let index = _.findIndex(this.arrProSelected, {
          ProId: item.ProId
        });
        this.arrProSelected.splice(index, 1);
      }
    },
    delPro(item, index) {
      this.arrChkProId.splice(this.arrChkProId.indexOf(item.ProId), 1);
      this.arrProSelected.splice(index, 1);
    },
    submitClick() {
      if (this.arrProSelected.length == 0) {
        showTips('请选择商品', 'warning');
        return;
      }
      this.arrProSelected.forEach(item => {
        item.ProCount = item.ProCount || 1;
      })
      this.$emit('save-ok', this.arrProSelected);
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
        if (this.goodsAddedList) {
          this.goodsAddedList.forEach(item => {
            this.arrChkProId.push(item.ProId);
            this.arrProSelected.push(item);
          })
        }

      }
    }
  }
}
</script>