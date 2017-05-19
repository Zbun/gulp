<template>
  <div>
    <div class="search clearfix mt20">
      <span class="ml20">
          <span class="mr5">客户名称</span>
      <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.Name" @keydown.enter="initPageData(1)" maxlength="50">
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <table class="table text-center table-hover table-odd table-bordered datalist">
      <thead>
        <tr>
          <th>客户名称</th>
          <th>客户来源</th>
          <th>所属机构</th>
          <th>地址</th>
          <th>联系人</th>
          <th>联系电话</th>
          <th>创建时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            <p class="text-nowrap">{{item.Name}}</p>
          </td>
          <td>
            {{item.Source|customerOrigin}}
          </td>
          <td>
            {{item.BranchName}}
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
            <div class="action">
              <a v-link="{ name: 'customerEdit', params:{ cid: item.Id}}" class="item">修改</a>
              <a v-if="0==item.Source" href="javascript:;" class="item" @click="del_Click(item)">删除</a>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
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
</template>
<script>
export default {
  props: {
    refresh: false
  },
  data() {
    return {
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

  },
  methods: {
    initPageData(pageindex = 1) {
      this.pageindex = pageindex;
      var me = this;
      var para = this.dataOut.search;
      para.PageIndex = pageindex;
      para.PageSize = 15;
      fetchData({
        API: '/Api/Misc/CustList',
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
        title: '删除客户',
        content: '删除该客户将无法恢复，请确认',
        ok() {
          fetchData({
            API: '/Api/Misc/CustDelete',
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
