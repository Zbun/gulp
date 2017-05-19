<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>盘点详情</h2>
        <div class="body">
          <div class="content" style="width:900px">
            <table class="table text-center table-hover table-odd table-bordered table-fixed">
              <thead>
                <tr>
                  <th style="width:80px">商品编号</th>
                  <th>商品名称</th>
                  <th style="width:90px">系统库存</th>
                  <th style="width:90px">实盘库存</th>
                  <th style="width:90px">损溢数量</th>
                  <th style="width:100px">损溢金额</th>
                  <th style="width:140px">时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item of dataIn.arrDataTable">
                  <td>
                    {{item.ProId}}
                  </td>
                  <td>
                    <p class="text-ellipsis" :title="item.ProName">{{item.ProName}}</p>
                  </td>
                  <td>
                    {{item.ProCount}}
                  </td>
                  <td>
                    {{item.ProCount1}}
                  </td>
                  <td>
                    {{item.ProCount1-item.ProCount}}
                  </td>
                  <td>
                    {{item.DiffMoney}}
                  </td>
                  <td>
                    {{item.DateAdded|datetime}}
                  </td>
                </tr>
              </tbody>
              <tbody v-if="dataIn.inited&&0==dataIn.arrDataTable.length">
                <tr>
                  <td colspan=5>
                    <div class="data-empty">
                      <i class="icon"></i>
                      <p class="font-big text">暂无相关数据</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="text-center">
              <div class="pageBox"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    curCode: ''
  },
  data() {
    return {
      pageindex: 1,
      dataIn: {
        arrDataTable: []
      }
    }
  },
  components: {},
  methods: {
    initPageData(pageindex = 1) {
      this.pageindex = pageindex;
      var me = this;
      let para = {};
      para.code = this.curCode;
      para.PageIndex = pageindex;
      para.PageSize = 10;
      fetchData({
        API: '/Api/ Product/StocktakeDetail',
        para,
        callback(data) {
          // console.log(data);
          me.dataIn.inited = true;
          me.dataIn.arrDataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.initPageData(1);
      }
    }
  }
}
</script>
