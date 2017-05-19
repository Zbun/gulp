<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{computedTitle}}款</h2>
        <div class="body">
          <div class="content" style="min-width:900px">
            <h3>
              {{objCurItem.Name}} <span v-if="!isSupplier">
                <span class="m10">|</span>{{objCurItem.BranchName}}
              </span>
            </h3>
            <div class="mt10 mb10  align-btn">
              <span class="font-small  bg-muted text-light-muted p5 pl10 pr10 mt10 mb10">
              {{computedTitle}}款人：{{dataAddedInfo.name}}
             </span>
              <span class="font-small ml10 bg-muted text-light-muted p5 pl10 pr10">
              日期：{{dataAddedInfo.time}}
             </span>
            </div>
            <table class="table text-center table-hover table-odd table-bordered">
              <thead>
                <tr>
                  <th class="td-warning-pure">
                    <label class="checkbox">
                      <input type="checkbox" @change="all_Change($event)" :checked="dataIn.arrDataTable.length>0&&computedSelectedObject.length==dataIn.arrDataTable.length"><span class="icon"></span></label>
                  </th>
                  <th class="td-warning-pure">序号</th>
                  <th class="td-warning-pure" style="">来源单号</th>
                  <th class="td-warning-pure" style="">交易日期</th>
                  <th class="td-warning-pure" style="width:80px;">应{{computedTitle}}</th>
                  <th class="td-warning-pure" style="">本次实{{computedTitle}}</th>
                  <th class="td-warning-pure" style="">备注</th>
                </tr>
              </thead>
              <tfoot v-if="dataIn.inited&&dataIn.arrDataTable.length>0">
                <tr class="table-bg-default">
                  <td colspan="4" class="text-right">
                    <b>合计：</b>
                  </td>
                  <td class="text-nowrap">
                    <b>{{computedCount.ShouldPay|currency}}</b>
                  </td>
                  <td class="text-nowrap">
                    <b>{{computedCount.PayAmount|currency}}</b>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
              <tbody>
                <tr v-for="item in dataIn.arrDataTable">
                  <td>
                    <label class="checkbox">
                      <input type="checkbox" v-model="item.checked"><span class="icon"></span></label>
                  </td>
                  <td>
                    {{(pageIndex-1)*pageSize+$index+1}}
                  </td>
                  <td class="text-nowrap">
                    {{item.BillCode}}
                  </td>
                  <td class="text-nowrap">
                    {{item.DateAdded|datetime}}
                  </td>
                  <td class="text-nowrap" :class="{'bg-currency':item.checked}">
                    {{item.ShouldPay|currency}}
                  </td>
                  <td :class="{'bg-currency':item.checked}">
                    <input type="text" class="com-ipt small" v-model="item.PayAmount|posCurrencyIn2" maxlength="10" :readonly="0==item.Amount" placeholder="输入金额">
                  </td>
                  <td>
                    <input type="text" v-model="item.Description" maxlength="100" placeholder="输入备注">
                  </td>
                </tr>
              </tbody>
              <tbody v-if="dataIn.inited&&!dataIn.arrDataTable.length>0">
                <tr>
                  <td colspan=7>
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
        <div class="footer text-center">
          <button class="btn btn-primary" :class="{disabled:dataIn.arrDataTable.length==0||computedSelectedObject==0}" @click="onSubmit_Click">核销</button>
          <button class="btn btn-default" @click="onCancel_Click">关闭</button>
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
    isSupplier: 0,
    objCurItem: {}
  },
  data() {
    return {
      pageIndex: 1,
      APILIST: {
        LIST: '/Api/Finance/APList',
        LISTP: '/Api/Finance/APList',
        LISTR: '/Api/Finance/ARList',
        PAY: 'API/Finance/APPay',
        PAYP: 'API/Finance/APPay',
        PAYR: 'API/Finance/ARPay'
      },
      pageIndex: 1,
      pageSize: 10,
      dataIn: {
        inited: false,
        arrDataTable: []
      },
      changeTimes: 0,
      dataAddedInfo: {
        time: '',
        name: '',
      }
    }
  },
  components: {},
  computed: {
    computedTitle() {
      return this.isSupplier ? '付' : '收';
    },
    computedSelectedObject() {
      let arrTemp = []
      if (this.changeTimes != undefined) {
        this.dataIn.arrDataTable.forEach(item => {
          if (item.checked) {
            arrTemp.push(item);
          }
        })
      }
      return arrTemp;
    },
    computedCount() {
      let objTemp = {};
      objTemp.Amount = 0,
        objTemp.PayAmount = 0,
        objTemp.ShouldPay = 0;
      this.computedSelectedObject.forEach(item => {
        // objTemp.Amount += item.Amount;
        objTemp.ShouldPay += item.ShouldPay;
        objTemp.PayAmount += parseFloat(item.PayAmount);
      })
      return objTemp;
    }
  },
  methods: {
    initPageData(pageIndex = 1) {
      this.pageIndex = pageIndex;
      var me = this;
      let para = {};
      para.PageIndex = pageIndex;
      para.PageSize = this.pageSize;
      para.Id = this.objCurItem.Id;
      fetchData({
        API: this.APILIST.LIST,
        para,
        callback(data) {
          me.dataIn.inited = true;
          data.Data.forEach(item => {
            item.checked = false;
            item.Description = '';
            item.PayAmount = item.ShouldPay = (item.Amount - item.AmountPayed).toFixed(2);
          })
          me.dataIn.arrDataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageIndex);
        }
      })
    },
    all_Change(e) {
      this.dataIn.arrDataTable.forEach(item => {
        item.checked = e.target.checked;
      })
    },
    onSubmit_Click() {
      let me = this;
      fetchData({
        API: this.APILIST.PAY,
        para: {
          id: this.objCurItem.Id,
          details: this.computedSelectedObject
        },
        callback() {
          me.show = false;
          // me.dispatch('on-check-ok');
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
        this.APILIST.PAY = this.isSupplier == 1 ? this.APILIST.PAYP : this.APILIST.PAYR;
        this.APILIST.LIST = this.isSupplier == 1 ? this.APILIST.LISTP : this.APILIST.LISTR;
        this.initPageData();
        this.dataAddedInfo.time = zmm_date.nowDate().ymdhmms;
        this.dataAddedInfo.name = localStorage.userName;
      }
    }
  }
}
</script>
