<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>交易历史</h2>
        <div class="body" style="width:900px">
          <div class="content">
            <h3>
                                    <span class="mr20">{{obj.Name}}</span>
                                    <template v-if="obj.BranchName!='' && type=='customer'">
                                      <span>|</span>
                                      <span class="ml20">{{obj.BranchName}}</span>
                                    </template>
                                  </h3>
            <div class="search clearfix mt20">
              <span class="mr5">时间段</span>
              <span class="date-field">
                                      <input type="text" v-model="dataOut.search.StartDate"  readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'endDate\')}'})">
                                      <i class="fa fa-calendar icon"></i>
                                    </span>
              <span> - </span>
              <span class="date-field">
                                      <input type="text" v-model="dataOut.search.EndDate" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({minDate: '#F{$dp.$D(\'startDate\')}'})">
                                      <i class="fa fa-calendar icon"></i>
                                    </span>
              <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
            </div>
            <div class="mt10" style="border:1px solid #ebebeb;background-color:#fdfdfd;padding:10px 15px;">
              <span style="border-right:1px solid #eaeaea;padding:0 40px;">交易次数：<b style="color:#ff6600;">{{dataIn.total.TotalRows}}</b></span>
              <span style="border-right:1px solid #eaeaea;padding:0 40px;">交易数量：<b style="color:#ff6600;">{{dataIn.total.ProCount}}</b></span>
              <span style="padding:0 40px;">交易总额：<b style="color:#ff6600;">￥{{dataIn.total.SubTotal}}</b></span>
            </div>
            <table class="table text-center table-hover table-bordered mt10">
              <thead>
                <tr>
                  <th style="background-color:#fffee7;">序号</th>
                  <th style="background-color:#fffee7;">单号</th>
                  <th style="background-color:#fffee7;">状态</th>
                  <th style="background-color:#fffee7;">时间</th>
                  <th style="background-color:#fffee7;">出库分仓</th>
                  <th style="background-color:#fffee7;">数量</th>
                  <th style="background-color:#fffee7;">金额(元)</th>
                  <th style="background-color:#fffee7;">制单人</th>
                </tr>
              </thead>
              <tbody v-if="dataIn.dataTable.length!=0">
                <tr v-for="(index,item) in dataIn.dataTable">
                  <td>{{item.RowId}}</td>
                  <td>{{item.Code}}</td>
                  <td>已完成</td>
                  <td>{{item.DateAdded | datetime}}</td>
                  <td>{{item.StoreName}}</td>
                  <td>{{item.ProCount}}</td>
                  <td style="color:#ff6600;">{{item.SubTotal}}</td>
                  <td>{{item.UserNameAdded}}</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan=8>
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
      type: Boolean,
      twoway: true,
      default: false
    },
    type: String,//取值'customer' || 'supplier',
    obj: Object
  },
  data() {
    return {
      dataIn: {
        dataTable: [],
        total: {}
      },
      dataOut: {
        search: {
          StartDate: zmm_date.getTheDay({ x: parseInt(window.localStorage.DISSTARTDATE) || -7 }),
          EndDate: zmm_date.getTheDay({ x: parseInt(window.localStorage.DISENDDATE) || 0 })
        }
      }
    }
  },
  computed: {},
  methods: {
    initPageData(pageindex = 1) {
      this.pageindex = pageindex;
      var para = this.dataOut.search;
      para.PageIndex = pageindex;
      para.PageSize = 10;
      let api = '';
      if (this.type === 'customer') {
        para.CustomerId = this.obj.Id;
        api = '/api/Report/StoreOutByCustomer';
      } else {
        para.SupplierName = this.obj.Name;
        api = '/api/Report/StoreInBySupplier';
      }
      fetchData({
        API: api,
        para,
        callback: (data) => {
          this.dataIn.dataTable = data.Data;
          this.dataIn.total = data.Total;
          this.dataIn.total.TotalRows = data.TotalRows;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageindex);
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() { },
  watch: {
    show(nV) {
      console.log(this.obj);
      nV && this.initPageData()
    }
  }
}