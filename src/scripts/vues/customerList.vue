<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title">
        <a href="javascript:;" class="close" title="关闭" @click.stop="cancel_Click">×</a>选择客户</h2>
        <div class="body">
          <div class="content" style="width:900px">
            <button class="btn btn-default fr" @click="reload()">刷新</button>
            <input type="text" placeholder="输入关键字" class="com-ipt large" maxlength="50" v-model="dataOut.search.Name" @keydown.enter="getCustomerList(1)">
            <button class="btn btn-primary ml5" @click="getCustomerList(1)">搜索</button>
            <div class="select-box-goods mt10">
              <div class="border-box tree fr">
                <ul class="content list v-tree" style="margin-left:0;margin-top:3px;">
                  <v-tree :model="dataIn.objDataTree" :open.sync="isOpen" @after-toggle-on="afterToggleOn"></v-tree>
                </ul>
              </div>
              <div class="list-goods">
                <div class="list-table border-box ">
                  <table class="text-center table table-hover table-odd">
                    <thead>
                      <th>客户</th>
                      <th>所属机构</th>
                      <th>操作</th>
                    </thead>
                    <tbody>
                      <tr v-for="item in dataIn.arrCustomer">
                        <td>
                          <p class="text-nowrap">{{item.Name}}</p>
                        </td>
                        <td>{{item.BranchName}}</td>
                        <td>
                          <p class="text-nowrap">
                            <a href="javascript:;" class="highlight" @click.stop="add_Click(item)">选择</a>
                          </p>
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-if="dataIn.inited&&!dataIn.arrCustomer.length>0">
                      <tr>
                        <td colspan=3>
                          <div class="data-empty">
                            <i class="icon"></i>
                            <p class="text-center">暂无相关数据</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="text-center bg-muted border-box mt-1" style="height:70px;">
                  <div class="pageBox"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vTree from 'commonVues/vTreeSimple.vue';
export default {
  components: {
    vTree
  },
  data() {
    return {
      isOpen: true,
      element: null,
      cache: {},
      curDetails: [],
      APILIST: {
        CUSTOMER: '/Api/Customer/AccountList', //客户列表
      },
      dataIn: {
        inited: false,
        arrCustomer: [],
        objDataTree: {},
        dataTable: [],
      },
      dataOut: {
        search: {
          Name: '',
          BranchId: '',
        }
      }
    }
  },
  props: {
    show: {
      type: Boolean,
      twoway: true,
      default: false
    }
  },
  methods: {
    cancel_Click() {
      this.show = false;
    },
    add_Click(item) {
      this.$dispatch('on-add-after', item);
      this.show = false;
    },
    afterToggleOn(item) {
      this.curDetails = item.Details;
    },
    reload() {
      this.getBranchTree();
      this.dataOut.search.BranchId = '';
      this.getCustomerList(1);
    },
    //客户列表
    getCustomerList(pageIndex = 1) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex;
      para.pageSize = 10;
      fetchData({
        API: this.APILIST.CUSTOMER,
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrCustomer = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.getCustomerList, pageIndex);
        }
      })
    },
    getBranchTree() {
      let me = this;
      fetchData({
        api: '/Api/Branch/BranchStoreTree',
        para: {},
        callback: data => {
          this.dataIn.objDataTree = data;
          this.curDetails = data.Details;
        }
      })
    }
  },
  ready() {},
  watch: {
    show(newValue) {
      if (newValue) {
        let me = this;
        this.element = $(this.$el).find('.v-tree');
        if (!this.dataIn.objDataTree.Name) {
          this.getBranchTree();
        }
        this.element.on('click', 'li.item', function(e) {
          me.element.find('li.item').removeClass('on');
          me.dataOut.search.BranchId = $(this).addClass('on').data('id');
          me.getCustomerList(1);
          e.stopPropagation();
        });
        this.dataOut.search.BranchId = this.dataOut.search.Name = '';
        this.getCustomerList(1);
      } else {
        this.isOpen = true;
        // this.element.off('click', 'li.item');
      }
    }
  }
}
</script>
