<template>
  <div>
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
      <span class="ml20">
          <span class="mr5">客户</span>
      <span class="intelligent-match">
        <span class="">
                <input type="search" class="select-long" placeholder="输入关键字，点击选择" v-model="intelligentMatch.customerName" @focus="IMIptFocus()" @input="IMIptInput()">
              </span>
      <ul class="list" v-show="intelligentMatch.isShow&&computedFilterCustomerInfo.length>0">
        <li class="item" v-for="item in computedFilterCustomerInfo" @click="selectedThisCustomerId(item)">{{item.Name}}</li>
      </ul>
      </span>
      </span>
      <span class="ml20">
          <span class="mr5">销售单号</span>
      <input type="search" class="com-ipt width" placeholder="输入单号" v-model="dataOut.search.Code" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      <span class="ml20">
        <span class="mr5">状态</span>
      <select v-model="dataOut.search.Status">
        <option value="">请选择</option>
        <option v-for="(key,value) of purchaseOrderStatus" :value="key">{{value}}</option>
      </select>
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <div class="clearfix border-box bg-muted p20 mt20">
      <div class="fr">
        <button class="btn btn-warning" v-if="rightsApi.Insert" @click="action_insert()">添加</button>
        <button class="btn btn-default" v-if="rightsApi.Update" @click="action_update()" :class="{'btn-disabled':computedIsUpdateDisable}">修改</button>
        <button class="btn btn-default" v-if="rightsApi.Delete" @click="action_delete()" :class="{'btn-disabled':computedIsDeleteDisable}">删除</button>
        <div class="select-style" :class="{'btn-disabled':arrChkCode.length==0}" v-if="rightsApi.Check">
          <span @click="action_check(3)">审核</span>
          <ul class="list">
            <li><a href="javascript:;" @click="action_check(1)">反审核</a></li>
            <li><a href="javascript:;" @click="action_check(-1)">关闭</a></li>
          </ul>
        </div>
        <button class="btn btn-default" :class="{'btn-disabled':arrChkCode.length==0}" @click="action_print()" v-if="rightsApi.Print">打印</button>
        <button class="btn btn-default" v-if="rightsApi.Export">导出</button>
      </div>
    </div>
    <table class="table text-center table-hover table-odd table-bordered mt-1">
      <thead>
        <tr>
          <th>
            <label class="checkbox">
              <input type="checkbox" @change="all_Change($event)" :checked="dataIn.dataTable.length&&dataIn.dataTable.length==arrChkCode.length"><span class="icon"></span></label>
          </th>
          <th>销售单号</th>
          <th>订单号</th>
          <th>销售金额（元）</th>
          <th>客户</th>
          <th>制单人</th>
          <th>制单时间</th>
          <th>状态</th>
          <th>发票</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            <label class="checkbox">
              <input type="checkbox" :value="item.Code" v-model="arrChkCode"><span class="icon"></span></label>
          </td>
          <td>
            <p class="text-nowrap">
              <a v-link="{ name: 'salesOrderCheck', params:{ soccode: item.Code}}" class="highlight">{{item.Code}}</a></p>
          </td>
          <td>
            <p class="text-nowrap"><span v-if="item.SourceCode">{{item.SourceCode}}</span>
              <span v-else>/</span></p>
          </td>
          <td>
            <p class="text-nowrap text-right">
              {{item.TotalPrice|currency}}
            </p>
          </td>
          <td>
            {{item.CustomerName}}
          </td>
          <td>
            {{item.UserNameAdded}}
          </td>
          <td>
            <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
          </td>
          <td>
            <p class="text-nowrap" :class="'order-status-'+item.Status">{{item.Status|purchaseOrderStatus}}
            </p>
          </td>
          <td>
            <i class="icon" :class="{'icon-error-circle':item.Receipt==0,'icon-ok-circle':item.Receipt==1}"></i>
          </td>
        </tr>
      </tbody>
      <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
        <tr>
          <td colspan=9>
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
    <gift-list :show.sync="isShowGiftList" :code="curPCode"></gift-list>
  </div>
</template>
<script>
import giftList from './../popup/giftList.vue';
export default {
  props: {
    loadedFirst: false,
    refresh: false,
    customerList: [],
    rightsApi: {}
  },
  data() {
    return {
      pageindex: 1,
      isShowLibraryOutForeshow: false,
      isShowGiftList: false,
      curPCode: '',
      arrChkCode: [],
      APILIST: {
        LIST: '/Api/SalesContract/LIST'
      },
      dataIn: {
        inited: false,
        dataTable: {},
        storeList: [],
        customerList: []
      },
      intelligentMatch: {
        isShow: false,
        customerName: ''
      },
      dataOut: {
        search: {
          StartDate: '',
          EndDate: '',
          Code: '',
          Status: '',
          CustomerId: ''
        }
      }
    }
  },
  computed: {
    purchaseOrderStatus() {
      return dictionary['purchaseOrderStatus'];
    },
    computedFilterCustomerInfo() {
      let me = this;
      if (validatorManu.isEmpty(this.intelligentMatch.customerName)) {
        return this.customerList;
      } else {
        return this.customerList.filter((item) => {
          return item.Name.indexOf(me.intelligentMatch.customerName.trim()) > -1;
        })
      }
    },
    computedIsUpdateDisable() {
      let l = this.arrChkCode.length;
      if (l > 1) {
        return true;
      }
      let is = !!!l;
      for (let i = 0; i < l; i++) {
        if (_.find(this.dataIn.dataTable, {
            Code: this.arrChkCode[i]
          }).Status != 1) {
          is = true;
          break;
        }
      }
      return is;
    },
    computedICheckDisable() {
      let l = this.arrChkCode.length;
      let is = !!!l;
      for (let i = 0; i < l; i++) {
        if (_.find(this.dataIn.dataTable, {
            Code: this.arrChkCode[i]
          }).Status != 1) {
          is = true;
          break;
        }
      }
      return is;
    },
    computedIsDeleteDisable() {
      let l = this.arrChkCode.length;
      let is = !!!l;
      for (let i = 0; i < l; i++) {
        if (_.find(this.dataIn.dataTable, {
            Code: this.arrChkCode[i]
          }).Status > 1) {
          is = true;
          break;
        }
      }
      return is;
    },
    // rightsApi() {
    //   let objTemp = _.find(this.$store.state.action, {
    //     Item: '销售单'
    //   });
    //   return objTemp ? objTemp.Details : {};
    // }
  },
  components: {
    giftList
  },
  methods: {
    initPageData(pageindex = 1) {
      this.pageindex = pageindex;
      var me = this;
      var para = this.dataOut.search;
      para.PageIndex = pageindex;
      para.PageSize = 15;
      this.arrChkCode = [];
      fetchData({
        API: this.APILIST.LIST,
        para,
        callback(data) {
          me.dataIn.inited = true;
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
        }
      })
    },
    IMIptFocus() {
      this.intelligentMatch.isShow = true;
    },
    IMIptInput() {
      this.dataOut.search.CustomerId = '';
    },
    selectedThisCustomerId(item) {
      this.dataOut.search.CustomerId = item.Id;
      this.intelligentMatch.customerName = item.Name;
      this.intelligentMatch.isShow = false;
    },
    submit_Click(item) {
      let me = this;
      dialog({
        title: '提示',
        content: '提示过后该销售单将不能修改，请确认',
        ok() {
          fetchData({
            API: '/api/SO/SCSubmit',
            para: {
              code: item.Code
            },
            callback(data) {
              // console.log(data);
              me.initPageData(me.pageindex);
              me.$dispatch('on-refresh');
            }
          })
        },
        cancel() {}
      }).showModal();

    },
    all_Change(e) {
      let isChked = e.target.checked;
      if (isChked) {
        let arrTemp = [];
        this.dataIn.dataTable.forEach(item => {
          arrTemp.push(item.Code);
        });
        this.arrChkCode = arrTemp;
      } else {
        this.arrChkCode = [];
      }
    },
    action_update() {
      if (this.computedIsUpdateDisable) {
        return;
      }
      this.$router.go({
        name: 'salesOrderEdit',
        params: {
          socode: this.arrChkCode[0]
        }
      });
    },
    action_insert() {
      this.$router.go({
        name: 'salesOrderEdit',
        params: {
          socode: 0
        }
      });
    },
    action_delete() {
      let me = this;
      if (!this.rightsApi.Delete || this.computedIsDeleteDisable) {
        return;
      }
      dialog({
        title: '批量删除单据',
        content: `删除操作不可恢复，请确认？`,
        ok() {
          fetchData({
            API: me.rightsApi.Delete,
            para: {
              codes: me.arrChkCode
            },
            callback(data) {
              me.initPageData(me.pageindex);
            }
          })
        },
        cancel() {}
      }).showModal();
    },
    action_check(i) {
      let me = this;
      fetchData({
        API: me.rightsApi.Check,
        para: {
          codes: me.arrChkCode,
          status: i
        },
        callback(data) {
          me.initPageData(me.pageindex);
        }
      })
    },
    action_print() {
      let me = this;
      fetchData({
        API: this.rightsApi.Print,
        para: {
          codes: this.arrChkCode
        },
        callback(data) {
          try {
            var LODOP = getLodop();
            if (LODOP) {
              LODOP.PRINT_INIT("打印单据");
              LODOP.SET_PRINT_STYLE("FontSize", 14);
              LODOP.SET_PRINT_STYLE("Bold", 1);
              for (let i = 0; i < data.length; i++) {
                LODOP.NewPage();
                LODOP.ADD_PRINT_HTM(5, '5%', '90%', '130mm', data[i].PrintContent);
              }
              // LODOP.PREVIEW();
              if (LODOP.CVERSION) {
                LODOP.On_Return = function(taskID, Value) {
                  if (Value > 0) {
                    fetchData({
                      API: '/API/MISC/PrintCountUpdate',
                      para: {
                        Codes: me.arrChkCode
                      },
                      hideTips: true
                    })
                  } else {
                    alert('放弃打印');
                  }
                };
                LODOP.PREVIEW();
              } else {
                if (LODOP.PRINTA()) {
                  alert('直接加入打印队列');
                } else {
                  alert('直接放弃打印');
                }
              }
            }
          } catch (e) {
            console.log(e);
          }
        }
      })
    },
  },
  ready() {
    this.dataOut.search.StartDate = zmm_date.getTheDay({
      x: parseInt(window.localStorage.DISSTARTDATE) || -7
    });
    this.dataOut.search.EndDate = zmm_date.getTheDay({
      x: parseInt(window.localStorage.DISENDDATE) || 0
    });
  },
  watch: {
    refresh(newVal) {
      if (newVal) {
        this.initPageData(1);
      }
    },
    loadedFirst(newVal) {
      if (newVal) {
        this.initPageData(1);
      }
    }
  }
}
</script>
