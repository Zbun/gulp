<template>
  <div>
    <div class="search clearfix mt20">
      <span class="ml20">
          <span class="mr5">用户名</span>
      <input type="search" class="com-ipt width" placeholder="输入关键字" v-model="dataOut.search.UserName" maxlength="50">
      </span>
      <button class="btn btn-primary ml10" @click="initPageData()">搜索</button>
    </div>
    <table class="table text-center table-hover table-odd table-bordered datalist">
      <thead>
        <tr>
          <th style="width:200px">用户名</th>
          <th style="width:200px">姓名</th>
          <th>库房权限</th>
          <th style="width:100px">状态</th>
          <th style="width:200px">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable | filterBy dataOut.search.UserName in 'UserName'">
          <td>
            <p class="text-nowrap">{{item.UserName}}</p>
          </td>
          <td>
            {{item.Real}}
          </td>
          <td>
            {{item.StoreNames}}
          </td>
          <td>
            {{item.Status|userStatus}}
          </td>
          </p>
          <td>
            <div class="action">
              <a href="javascript:;" class="item" @click="selectStores_Click(item.StoreIds,item.Id)">选择仓库</a>
              <a v-link="{ name: 'userEdit', params:{ uid: item.Id}}" class="item">编辑</a>
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
    <store-select :show.sync='isShowStoreSelect' :user-id="curUid" :sids="curStoreIds" @on-save-click="dispatchSave"></store-select>
  </div>
</template>
<script>
import storeSelect from './../popup/storeSelect.vue';
export default {
  props: {
    refresh: false
  },
  data() {
    return {
      isShowStoreSelect: false,
      pageindex: 1,
      dataIn: {
        inited: false,
        dataTable: {},
        storeList: []
      },
      curUid: '',
      curStoreIds: '',
      dataOut: {
        search: {
          UserName: ''
        }
      }
    }
  },
  computed: {},
  components: {
    storeSelect
  },
  methods: {
    initPageData() {
      var me = this;
      var para = this.dataOut.search;
      fetchData({
        API: 'api/User/UserListWithPage',
        para,
        callback(data) {
          // console.log(data);
          me.dataIn.inited = true;
          me.dataIn.dataTable = data.Data;
        }
      })
    },
    //选择分仓弹窗
    selectStores_Click(sids, uid) {
      this.curStoreIds = sids;
      this.curUid = uid;
      this.isShowStoreSelect = true;
    },
    dispatchSave() {
      this.initPageData()
    },
    del_Click(item) {
      let me = this;
      dialog({
        title: '删除用户',
        content: '删除该用户将无法恢复，请确认',
        ok() {
          fetchData({
            API: '/Api/User/UserDelete',
            para: {
              id: item.Id
            },
            callback() {
              me.initPageData();
            }
          })
        },
        cancel() {}
      }).showModal();
    }
  },
  ready() {
    this.initPageData();
  },
  watch: {
    refresh(newVal) {
      if (newVal) {
        this.initPageData();
      }
    }
  }
}
</script>
