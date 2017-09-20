<template>
  <div class="pageBox" v-if="computedRows.length>0">
    <ul class="pagination">
      <li class="first" :class="{disabled:1==pageIndex}"><a href="javascript:;" @click="pageGo(-10)">&lt;</a></li>
      <li class="prev" :class="{disabled:1==pageIndex}"><a href="javascript:;" @click="pageGo(-1)" rel="prev">&lt;</a></li>
      <li class="page" :class="{active:pageIndex==index+1}" v-for="(index,item) in computedRows"><a href="javascript:;" @click="paging(index,item)">{{index+1}}</a></li>
      <li class="next" :class="{disabled:computedRows.length==pageIndex}"><a href="javascript:;" @click="pageGo(1)" rel="next">&gt;</a></li>
      <li class="last" :class="{disabled:computedRows.length==pageIndex}"><a href="javascript:;" @click="pageGo(10)">&gt;</a></li>
    </ul>
  </div>
</template>
<script>
/**
 * 前端分页
 * zhaoliubin@zol.com.cn
 * 2017/07/18
 */
export default {
  props: {
    rows: 1, //数据总行数
    fePage: {
      pageIndex: 1, //当前页
      pageSize: 500, //页大小
    },
  },
  data() {
    return {
      pageSizeDefault: 50,
      pageIndex: 1
    }
  },
  computed: {
    computedRows() {
      let r = parseInt(this.rows) || 0;
      let ps = this.fePage.pageSize || this.pageSizeDefault;
      let l = ((r / ps == parseInt(r / ps)) ? (r / ps - 1) : parseInt(r / ps)) + 1;
      let arrTemp = [];
      for (let i = 0; i < l; i++) {
        let objTemp = {};
        objTemp.on = false;
        arrTemp.push(objTemp);
      }
      return arrTemp;
    }
  },
  methods: {
    paging(index, item) {
      this.computedRows.forEach(item => {
        item.on = false;
      });
      item.on = true;
      this.fePage.pageIndex = this.pageIndex = index + 1;
    },
    pageGo(i) {
      switch (i) {
        case -10: //页首
          {
            if (this.pageIndex == 1) {
              return;
            }
            this.fePage.pageIndex = this.pageIndex = 1;
            break;
          }
        case -1: //前页
          {
            if (this.pageIndex == 1) {
              return;
            }
            this.fePage.pageIndex = --this.pageIndex;
            break;
          }
        case 1: //下页
          {
            if (this.pageIndex == this.computedRows.length) {
              return;
            }
            this.fePage.pageIndex = ++this.pageIndex;
            break;
          }
        case 10: //页尾
          {
            if (this.pageIndex == this.computedRows.length) {
              return;
            }
            this.fePage.pageIndex = this.pageIndex = this.computedRows.length;
            break;
          }
      }
    }
  },
  ready() {}
}
</script>