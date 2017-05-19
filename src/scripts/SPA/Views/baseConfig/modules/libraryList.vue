<template>
  <div>
    <div class="search clearfix mt20">
      <span class="ml20">
          <span class="mr5">关键字</span>
      <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.Name" maxlength="50" @keydown.enter="initPageData(1)">
      </span>
      <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
    </div>
    <table class="table text-center table-hover table-odd table-bordered datalist">
      <thead>
        <tr>
          <th>名称</th>
          <th>地址</th>
          <th>收货人</th>
          <th>身份证</th>
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
            <p class="text-nowrap">{{item.ContactCard}}</p>
          </td>
          </p>
          <td>
            <div class="action">
              <a v-link="{ name: 'libraryEdit', params:{ lId: item.Id}}" class="item">修改</a>
              <a href="javascript:;" class="item" @click="del_Click(item)">删除</a>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
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
        storeList: []
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
        API: '/Api/Misc/StoreList',
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
        title: '删除分仓',
        content: '删除该分仓将无法恢复，请确认',
        ok() {
          fetchData({
            API: '/Api/Misc/StoreDelete',
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
