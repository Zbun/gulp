<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>选择客户</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <div class="clearfix">
              <div class="search fr">
                <input type="text" placeholder="输入客户名称" class="com-ipt x-large ml5" maxlength="50" v-model="dataOut.search.Name" @keydown.enter="initPageData(1)">
                <button class="btn btn-primary ml5" @click="initPageData(1)">搜索</button>
              </div>
            </div>
            <table class="text-center table table-bordered table-hover table-odd mt14">
              <thead>
                <tr>
                  <th>客户</th>
                  <th style="width:80px">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item of dataIn.dataTable">
                  <td>
                    {{item.Name}}
                  </td>
                  <td>
                    <label class="checkbox">
                      <input type="checkbox" :value="item.Id" v-model="computedSelected" @change="sel_Change(item,$event)"><span class="icon"></span></label>
                  </td>
                </tr>
              </tbody>
              <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
                <tr>
                  <td colspan=3>
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
    customers: []
  },
  data() {
    return {
      pageIndex: 1,
      dataIn: {
        inited: '',
        dataTable: [],
      },
      dataOut: {
        search: {
          Name: '',
        }
      },
      arrTemp: []
    }
  },
  computed: {
    computedSelected() {
      let a = [];
      this.arrTemp.forEach(item => {
        a.push(item.Id);
      });
      return a;
    }
  },
  components: {},
  methods: {
    initPageData(pageIndex = 1) {
      this.pageIndex = pageIndex;
      let para = this.dataOut.search;
      para.PageIndex = pageIndex;
      para.PageSize = 10;
      this.arrTemp = [];
      this.arrTemp = this.customers;
      var me = this;
      fetchData({
        API: '/Api/Misc/CustList',
        para,
        callback(data) {
          // console.log(data);
          me.dataIn.inited = true;
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageIndex);
        }
      });
    },
    sel_Change(item, e) {
      let target = e.target;
      let l = 0;
      for (let i = 0; i < this.customers.length; i++) {
        if (this.customers[i]) {
          l++;
        }
      }
      if (target.checked) {
        if (l > 1) {
          showTips('已选中调出，调入，若要重选，请先勾掉一个', 'error');
          target.checked = false;
          return;
        } else {
          for (let i = 0; i < 2; i++) {
            if (!this.customers[i]) {
              this.customers.splice(i, 1, item);
              break;
            }
          }
        }
      } else {
        let i = _.findIndex(this.customers, {
          Id: item.Id
        });
        this.customers.splice(i, 1, '');
      }

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
