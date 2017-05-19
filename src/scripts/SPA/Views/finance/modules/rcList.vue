<template>
  <div>
    <div class="search clearfix mt20">
      <span>
        <span class="mr5 required-mark">类型</span>
      <select v-model="dataOut.search.CustomerType">
        <option value="">请选择</option>
        <option value="0">供应商</option>
        <option value="1">客户</option>
      </select>
      </span>
      <span class="mr5 ml20">时间段</span>
      <span class="date-field">
            <input type="text" v-model="dataOut.search.StartDate"  readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({maxDate: '#F{$dp.$D(\'endDate\')}'})">
            <i class="fa fa-calendar icon"></i>
          </span>
      <span> - </span>
      <span class="date-field">
            <input type="text" v-model="dataOut.search.EndDate" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({minDate: '#F{$dp.$D(\'startDate\')}'})">
            <i class="fa fa-calendar icon"></i>
         </span>
      <span class="ml20">名称</span>
      <input type="text" placeholder="输入关键字" v-model="dataOut.search.CustomerName" @keydown.enter="initPageData(1)">
      <span class="ml20">
      <span class="mr5">状态</span>
      <select v-model="dataOut.search.Status">
        <option value="">请选择</option>
        <option value="1">待审核</option>
        <option value="3">已审核</option>
        <option value="-1">已关闭</option>
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
            <li><a href="javascript:;" @click="action_check(-1)">关闭</a></li>
          </ul>
        </div>
      </div>
    </div>
    <table class="table text-center table-hover table-odd table-bordered mt-1">
      <thead>
        <tr>
          <th>
            <label class="checkbox">
              <input type="checkbox" @change="all_Change($event)" :checked="dataIn.dataTable.length&&dataIn.dataTable.length==arrChkCode.length"><span class="icon"></span></label>
          </th>
          <th>收款单号</th>
          <th>类型</th>
          <th>客户</th>
          <th>本次收款</th>
          <th v-if="accountType==11">使用比例</th>
          <th>收款人</th>
          <th>时间</th>
          <th>状态</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            <label class="checkbox">
              <input type="checkbox" :value="item.Code" v-model="arrChkCode"><span class="icon"></span></label>
          </td>
          <td class="text-nowrap">
            <a v-link="{ name: 'receiveCashCheck', params:{ receCode: item.Code}}" class="highlight">{{item.Code}}</a>
          </td>
          <td class="text-nowrap">
            {{item.CustomerType==0?'供应商':'客户'}}
          </td>
          <td>
            {{item.CustomerName}}
          </td>
          <td class="text-nowrap text-right">
            {{item.ChargeAmount|currency}}
          </td>
          <td v-if="11==accountType" class="text-nowrap">
            {{item.CanUsedRate}}%
          </td>
          <td class="text-nowrap">
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
            {{item.Description?item.Description:'/'}}
          </td>
        </tr>
      </tbody>
      <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
        <tr>
          <td :colspan="accountType==11?10:9">
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
</template>
<script>
export default {
  props: {
    loadedFirst: false,
    refresh: false,
    rightsApi: {},
    accountType: ''
  },
  data() {
    return {
      pageindex: 1,
      dataIn: {
        inited: false,
        dataTable: {},
      },
      arrChkCode: [],
      APILIST: {
        LIST: '/Api/Charge/List',
        DELETE: '/Api/Charge/Delete',
      },
      dataOut: {
        search: {
          CustomerType: '',
          CustomerName: '',
          StartDate: '',
          EndDate: '',
          Status: '',
        }
      }
    }
  },
  computed: {
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
    computedURLTo() {
      let URL = '';
      switch (this.accountType) {
        case 12:
          {
            URL = 'receiveCashEdit';
            break;
          }
        case 13:
          {
            URL = 'receiveCreditEdit';
            break;
          }
        case 11:
          {
            URL = 'receiveRebateEdit';
            break;
          }
        default:
          URL = 'receiveCashEdit'
      }
      return URL;
    }
  },
  components: {},
  methods: {
    initPageData(pageindex = 1) {
      this.pageindex = pageindex;
      var me = this;
      this.arrChkCode = [];
      var para = this.dataOut.search;
      para.accountType = this.accountType;
      para.PageIndex = pageindex;
      para.PageSize = 15;
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
        name: this.computedURLTo,
        params: {
          receCode: this.arrChkCode[0]
        }
      });
    },
    action_insert() {
      this.$router.go({
        name: this.computedURLTo,
        params: {
          receCode: 0
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
          if (3 == i) {
            me.refresh = true;
          }
          me.initPageData(me.pageindex);
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
    this.initPageData(1);
  }
}
</script>
