<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click()">&times;</a>选择机构</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <div class="clearfix">
              <div class="search">
                <input type="text" placeholder="输入名称关键字" class="com-ipt large ml5" maxlength="50" v-model="dataOut.search.Name" @keydown.enter="initPageData(1)">
                <button class="btn btn-primary ml5" @click="initPageData(1)">搜索</button>
              </div>
            </div>
            <table class="text-center table table-bordered table-hover table-odd mt14">
              <thead>
                <tr>
                  <th>机构编码</th>
                  <th>机构名称</th>
                  <th style="width:120px;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item of dataIn.dataTable">
                  <td>
                    <p class="text-nowrap">
                      {{item.BranchCode}}
                    </p>
                  </td>
                  <td>
                    {{item.Name}}
                  </td>
                  <td>
                    <div class="action">
                      <a href="javascript:;" @click="add_Click(item);" class="item">添加</a>
                    </div>
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
    branchAdded: {
      type: Object,
      twoway: true,
      default: {}
    },
    branchAddedList: {
      type: Array,
      default: []
    },
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
        },
        curBranchAdded: {}
      }
    }
  },
  methods: {
    initPageData(pageIndex = 1) {
      this.pageIndex = pageIndex;
      let para = this.dataOut.search;
      para.PageIndex = pageIndex;
      para.PageSize = 10;
      var me = this;
      fetchData({
        API: '/Api/Branch/BranchSelectList',
        para,
        callback(data) {
          me.dataIn.inited = true;
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageIndex);
        }
      });
    },
    onCancel_Click() {
      this.show = false;
    },
    add_Click(item) {
      if (_.find(this.branchAddedList, {
          Id: item.Id
        })) {
        return;
      } else {
        item.arrSelectedCustomers = [];
        item.Customers.forEach(item2 => {
          item2.Selected = false;
        });
        this.branchAddedList.push(item);
        this.$dispatch('on-add-after');
      }
    }
  },
  ready() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.dataOut.search.Name = '';
        this.initPageData(1);
      }
    }
  }
}
</script>
