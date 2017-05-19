<template>
  <div>
    <div class="search clearfix mt20">
      <span class="ml20">
          <span class="mr5">供应商</span>
      <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.Name" maxlength="50" @keydown.enter="initPageData(1)">
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <table class="table text-center table-hover table-odd table-bordered datalist">
      <thead>
        <tr>
          <th>供应商全称</th>
          <th>地址</th>
          <th>联系人</th>
          <th>联系电话</th>
          <th>添加时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            <p class="text-nowrap">{{item.Name}}</p>
          </td>
          <td>
            {{item.Address}}
          </td>
          <td>
            <p class="text-nowrap"> {{item.Contact}}</p>
          </td>
          <td>
            {{item.Phone}}
          </td>
          <td>
            <p class="text-nowrap">{{item.DateAdded|datetime}}
          </td>
          </p>
          <td>
            <div class="action" v-if="item.Source!=1">
              <a v-link="{ name: 'supplierEdit', params:{ sid: item.Id}}" class="item">修改</a>
              <a href="javascript:;" class="item" @click="bankInfo_Click(item)">银行账户</a>
              <a href="javascript:;" class="item" @click="del_Click(item)">删除</a>
            </div>
            <span v-else>/</span>
          </td>
        </tr>
      </tbody>
      <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
        <tr>
          <td colspan=6>
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
    <bank-info :show.sync="isShowBankInfo" :cur-item="curItem"></bank-info>
  </div>
</template>
<script>
import bankInfo from './supplierBank.vue';
export default {
  props: {
    refresh: false
  },
  data() {
    return {
      curItem: {},
      isShowBankInfo: false,
      pageindex: 1,
      dataIn: {
        inited: false,
        dataTable: {},
      },
      dataOut: {
        search: {
          Name: ''
        }
      }
    }
  },
  computed: {},
  components: {
    bankInfo
  },
  methods: {
    initPageData(pageindex = 1) {
      this.pageindex = pageindex;
      var me = this;
      var para = this.dataOut.search;
      para.PageIndex = pageindex;
      para.PageSize = 15;
      fetchData({
        API: '/Api/Misc/SupplierList',
        para,
        callback(data) {
          // console.log(data);
          me.dataIn.inited = true;
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
        }
      })
    },

    del_Click(item) {
      let me = this;
      dialog({
        title: '删除供应商',
        content: '删除该供应商将无法恢复，请确认',
        ok() {
          fetchData({
            API: '/Api/Misc/SupplierDelete',
            para: {
              id: item.Id
            },
            callback() {
              me.initPageData(me.pageindex);
            }
          })
        },
        cancel() {}
      }).showModal();
    },
    bankInfo_Click(item) {
      this.curItem = item;
      this.isShowBankInfo = true;
    }
  },
  ready() {
    this.initPageData(1);
  },
  watch: {
    refresh(newVal) {
      if (newVal) {
        this.initPageData(1);
      }
    }
  }
}
</script>
