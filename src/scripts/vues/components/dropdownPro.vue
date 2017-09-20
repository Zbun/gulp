<template>
  <span class="intelligent-match ml5">
      <span class="">
        <input type="search" class="select-long" placeholder="输入关键字" @keydown.enter="search()" v-model="dataOut.ProName" @focus="IMIProFocus()" @input="IMIInput()">
      </span>
  <ul class="list" v-show="intelligentMatch.isShowPro&&computedFilterProInfo.length>0">
    <li class="item" v-for="item in computedFilterProInfo" :title="item.Name" @click="selectedThisProId(item)">{{item.Name}}</li>
  </ul>
  </span>
</template>
<script>
export default {
  props: {
    show: 0, //是否加载
    dataOut: {} //数据回传
  },
  data() {
    return {
      intelligentMatch: {
        isShow: false,
        isShowPro: false,
        customerName: '',
        proName: ''
      },
      dataIn: {
        arrProList: [],
      },
    }
  },
  computed: {
    //智能感知匹配商品名
    computedFilterProInfo() {
      let me = this;
      let newPros = this.dataIn.arrProList;
      if (validatorManu.isEmpty(this.dataOut.ProName)) {
        return newPros;
      } else {
        return newPros.filter((item) => {
          return item.Name.toLowerCase().indexOf(me.dataOut.ProName.trim().toLowerCase()) > -1;
        })
      }
    },
  },
  components: {},
  methods: { //商品感知
    getGoodsList(proType = 1) {
      var me = this;
      fetchData({
        API: '/api/Product/List',
        para: {
          pageIndex: 1,
          pageSize: 100000,
          ProType: proType
        },
        callback(data) {
          me.dataIn.arrProList = data.Data;
        }
      });
    },
    IMIProFocus() {
      this.intelligentMatch.isShowPro = true;
    },
    IMIInput() {
      this.dataOut.ProId = '';
      this.intelligentMatch.isShowPro = true;
    },
    selectedThisProId(item) {
      this.dataOut.ProId = item.Id;
      this.dataOut.ProName = item.Name;
      this.intelligentMatch.isShowPro = false;
    },
    search() {
      this.$dispatch('search');
    }
  },
  created() {
    this.show && this.getGoodsList();
  }
}
</script>