<template>
  <div class="main" v-cloak>
    <h1 class="content-title">客户</h1>
    <div class="content-field">
      <div class="search clearfix mt20">
        <span><span class="mr5 ">客户</span>
        <input type="search" placeholder="请输入客户名称" v-model="dataOut.search.Name">
        </span>
        <span class="ml20"><span class="mr5">来源</span>
        <select style="min-width:135px;" v-model="dataOut.search.Source">
          <option :value="''">请选择</option>
          <option value="0">系统添加</option>
          <option value="1">B2B</option>
        </select>
        </span>
        <span class="ml20"><span class="mr5 ">机构</span>
        <input type="search" placeholder="请输入机构名称" v-model="dataOut.search.BranchName">
        </span>
        <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
      </div>
      <div class="mt20 rp-title" style="padding:15px;border:1px solid #eaeaea;background-color:#fdfdfd;overflow:hidden;height:62px;">
        <!--<button class="btn btn-default fr mr5">导出</button>
        <button class="btn btn-default fr mr10">打印</button>-->
        <template v-if="selectedItem.length!==0">
          <button class="btn btn-default fr mr5" v-if="APIList.Delete" @click.stop="del_Click">删除</button>
        </template>
        <template v-else>
          <button class="btn btn-default fr mr5 btn-disabled" v-if="APIList.Delete">删除</button>
        </template>
        <template v-if="selectedItem.length===1">
          <a class="btn btn-default fr mr10" v-if="APIList.Update" v-link="{name:'updatecustomer',query:{id:selectedItem[0]}}">修改</a>
        </template>
        <template v-else>
          <button class="btn btn-default fr mr10 btn-disabled" v-if="APIList.Update">修改</button>
        </template>
        <a class="btn btn-warning fr mr5" v-if="APIList.Insert" v-link="{name:'addcustomer'}">新增</a>
      </div>
      <table class="table text-center table-hover table-odd table-bordered" style="margin-top:-1px;">
        <thead>
          <tr>
            <th class="text-right" style="width:45px;">
              <label class="checkbox" v-if="dataIn.dataTable.length!=0">
                <input type="checkbox" v-model="checkAll" @change="checkAll_Change"><span class="icon"></span></label>
            </th>
            <th>名称</th>
            <th>来源</th>
            <th>机构</th>
            <th>地址</th>
            <th>联系人</th>
            <th>联系电话</th>
            <th>创建时间</th>
            <th>查看</th>
          </tr>
        </thead>
        <tbody v-if="dataIn.dataTable.length!=0">
          <tr v-for="item in dataIn.dataTable">
            <td class="text-right">
              <label class="checkbox">
                <input type="checkbox" v-model="item.isChecked" @change="checkOne_Change"><span class="icon"></span></label>
            </td>
            <td>{{item.Name}}</td>
            <td>{{item.Source==0?'系统添加':'B2B'}}</td>
            <td>{{item.BranchName}}</td>
            <td>{{item.Address}}</td>
            <td>{{item.Contact}}</td>
            <td>{{item.Phone}}</td>
            <td>{{item.DateAdded | datetime}}</td>
            <td><a href="javascript:;" class="highlight" @click="detail_Click(item)">收货地址</a></td>
          </tr>
        </tbody>
        <tbody v-else>
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
    </div>
    <receipt-place :show.sync="show" :data-obj="curItem"></receipt-place>
  </div>
</template>
<script>
export default {
  components: {
    receiptPlace:require('./popup/receiptPlaceList.vue')
  },
  data() {
    return {
      show:false,
      checkAll: false,
      curItem:{},
      dataIn: {
        dataTable: []
      },
      dataOut: {
        search: {
          Name:'',//客户名称
          Source:'',//来源
          BranchName:''//机构名称
        }
      }
    }
  },
  computed: {
    APIList() {
      let objTemp = _.find(this.$store.state.action, {
        Item: '客户'
      });
      return objTemp ? objTemp.Details : {};
    },
    selectedItem() {
      let arr = [];
      this.dataIn.dataTable.forEach(item=>{
        item.isChecked && arr.push(item.Id)
      });
      return arr;
    }
  },
  methods: {
    checkAll_Change() {
      this.dataIn.dataTable.forEach(item => {
        item.isChecked = this.checkAll
      })
    },
    checkOne_Change() {
      this.checkAll = this.dataIn.dataTable.every(item => {
        return item.isChecked === true
      })
    },
    del_Click() {
      dialog({
        title:'删除客户',
        content:'确定要删除吗？',
        ok:()=>{
          fetchData({
            api:'/Api/Customer/Delete',
            para:{Ids:this.selectedItem.join(',')},
            callback:data=>{
              this.initPageData(1);
            }
          })
        },
        cancel(){}
      }).showModal();
    },
    detail_Click(item) {
      this.curItem = item;
      this.show = true;
    },
    initPageData(pageindex = 1) {
      const me = this;
      this.pageindex = pageindex;
      let para = this.dataOut.search;
      para.PageIndex = pageindex;
      para.PageSize = 15;
      fetchData({
        API: '/Api/Customer/List',
        para,
        callback: (data) => {
          this.checkAll = false;
          data.Details && data.Details.forEach(item => {
            item.isChecked = false;
          });
          this.dataIn.dataTable = data.Details;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
        }
      })
    },
  },
  created() {
    this.initPageData();
  }

}
</script>
