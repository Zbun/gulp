<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="cancelClick">&times;</a>选择赠品</h2>
        <div class="body">
          <div class="content" style="width:800px">
            <div class="search-box clearfix">
              <input type="search" placeholder="请输入赠品名称" class="com-ipt ipt-search ml5" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
              <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
            </div>
            <table class="table table-bordered datalist table-hover">
              <thead>
                <tr>
                  <th style="width:60px;">
                    <label class="checkbox">
                      <input type="checkbox" :checked="arrChkId.length>0&&computedIsAllChecked" @change="chooseAll($event)"><span class="icon"></span></label>
                  </th>
                  <th>赠品名称</th>
                  <th style="width:150px;">库存</th>
                  <th style="width:150px;">价格</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in dataIn.arrDataList">
                  <td class="text-nowrap">
                    <label class="checkbox">
                      <input type="checkbox" @change="changePro($event,item)" :id="'__p'+item.Id" :value="item.Id" v-model="arrChkId"><span class="icon"></span></label>
                  </td>
                  <td :title="item.Name">
                    <label :for="'__p'+item.Id" class="block">
                      {{item.Name}}
                    </label>
                  </td>
                  <td class="text-nowrap">
                    <label :for="'__p'+item.Id" class="block">
                      {{item.Amount}}</label>
                  </td>
                  <td class="text-nowrap">
                    <label :for="'__p'+item.Id" class="block">
                      {{item.Price|currency}}</label>
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
export default {
  props: {
    show: { twoway: true, default: false },
    goodsAddedList: [], //传入赠品列表
  },
  data() {
    return {
      arrChkId: [],
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
        if (_.indexOf(this.arrChkId, this.dataIn.arrDataList[i].Id) == -1) {
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
        API: '/api/Activity/GetGiftList',
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
        let i = _.indexOf(this.arrChkId, item.Id);
        if (i > -1) {
          if (!isChked) {
            this.arrChkId.splice(i, 1);
          }
        } else if (isChked) {
          this.arrChkId.push(item.Id);
          this.choosePro(item);
        }
      })
    },
    choosePro(item) { //选择赠品
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
      this.arrChkId.forEach(item => {
        let objTemp = _.find(this.arrProSelected, {
          Id: item
        });
        objTemp.GiftId = objTemp.Id;
        if (!objTemp.GiftCount) {
          objTemp.GiftCount = 1; //单次赠品数量
        }
        arrTemp.push(objTemp);
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
        this.arrChkId = [];
        this.arrProSelected = [];
        this.goodsAddedList.forEach(item => {
          item.Id = item.Id || item.GiftId;
          this.arrChkId.push(item.Id);
          this.arrProSelected.push(item);
        })
      }
    }
  }
}
</script>