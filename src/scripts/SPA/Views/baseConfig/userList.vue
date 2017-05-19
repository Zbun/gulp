<template>
  <div class="main">
    <h1 class="content-title">用户管理</h1>
    <div class="content-field">
      <table class="table table-bordered table-hastree mt20 mb20">
        <tbody>
          <tr>
            <td class="left-tree v-tree">
              <ul class="content list " style="margin-left:0;margin-top:3px;">
                <v-tree :model="dataIn.objDataTree" :open.sync="isOpen" @after-toggle-on="afterToggleOn"></v-tree>
              </ul>
            </td>
            <td>
              <div class="content-field" style="padding:5px 25px 25px;">
                <div class="search clearfix mt20">
                  <span>
                    <span class="mr5 font-middle">用户名</span>
                    <input type="search" placeholder="请输入用户名称" v-model="dataOut.search.UserName" @keyup.enter="initPageData(1)">
                  </span>
                  <button class="btn btn-primary ml10" @click="initPageData(1)">搜索</button>
                </div>
                <div class="mt20 rp-title" style="padding:15px;border:1px solid #eaeaea;background-color:#fdfdfd;height:60px;">
                  <!--<button class="btn btn-default fr mr5">导出</button>
                      <button class="btn btn-default fr mr10">打印</button>-->
                  <template v-if="selectedItem.length===1">
                    <div class="select-style fr">
                      <span @click.stop="audit_Click(3)">审核</span>
                      <ul class="list">
                        <li>
                          <a href="javascript:;" @click.stop="audit_Click(1)">反审核</a>
                        </li>
                      </ul>
                    </div>
                    <button class="btn btn-default fr mr10" @click.stop="del_Click">删除</button>
                    <a class="btn btn-default fr mr5" v-link="{name:'userEdit',query:{updateId:selectedItem[0]}}">修改</a>
                    <a class="btn btn-primary fr mr5" v-link="{name:'userEdit',query:{copyId:selectedItem[0]}}">复制</a>
                  </template>
                  <template v-else>
                    <div class="select-style disabled fr">
                      <span>审核</span>
                      <ul class="list">
                        <li>
                          <a href="javascript:;">反审核</a>
                        </li>
                      </ul>
                    </div>
                    <button class="btn btn-default fr mr10 btn-disabled">删除</button>
                    <button class="btn btn-default fr mr5 btn-disabled">修改</button>
                    <button class="btn btn-primary fr mr5 btn-disabled">复制</button>
                  </template>
                  <a class="btn btn-warning fr mr5" v-link="{name:'userEdit'}">新增</a>
                  <span class="font-middle" style="vertical-align:middle;">此平台共
                    <span class="text-warning">{{dataIn.dataTable.length}}</span> 个用户</span>
                </div>
                <table class="table text-center table-hover table-odd table-bordered" style="margin-top:-1px;">
                  <thead>
                    <tr>
                      <th class="text-right" style="width:45px;">
                        <!--<label class="checkbox" v-if="dataIn.dataTable.length!=0">
                          <input type="checkbox" v-model="checkAll" @change="checkAll_Change">
                          <span class="icon"></span>
                        </label>-->
                      </th>
                      <th>用户名</th>
                      <th>姓名</th>
                      <th>手机</th>
                      <th>状态</th>
                    </tr>
                  </thead>
                  <tbody v-if="dataIn.dataTable.length!=0">
                    <tr v-for="item in dataIn.dataTable">
                      <td class="text-right">
                        <label class="checkbox">
                          <input type="checkbox" v-model="item.isChecked" @change="checkOne_Change">
                          <span class="icon"></span>
                        </label>
                      </td>
                      <td>{{item.UserName}}</td>
                      <td>{{item.Real}}</td>
                      <td>{{item.Phone}}</td>
                      <td>
                        <span v-if="item.Status==3">{{type[item.Status+'']}}</span>
                        <span v-else class="text-warning">{{type[item.Status+'']}}</span>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
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
                <!--<div class="text-center">
                      <div class="pageBox"></div>
                    </div>-->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    vTree:require('commonVues/vTreeSimple.vue')
  },
  data() {
    return {
      pageindex:1,
      isOpen:true,
      curDetails:[],
      dataIn: {
        dataTable:[],
        objDataTree:{}
      },
      dataOut: {
        search: {
          BranchId:'',
          UserName:''
        }
      }
    }
  },
  watch: {
    "dataOut.search.BranchId"(newValue) {
      this.initPageData(1);
    }
  },
  computed: {
    selectedItem() {
      let arr = [];
      let curItem = [];
      this.dataIn.dataTable.forEach(item=>{
        if(item.isChecked) {
          arr.push(item.Id);
          curItem.push(item);
        }
      });
      let obj = this.getPId(curItem[0].BranchId);
      obj.Id = curItem[0].BranchId;
      this.getTreePath(this.dataIn.objDataTree,obj);
      return arr;
    },
    type() {
      return dictionary['userStatus']
    }
  },
  methods: {
    getPId(Id) {
      let obj = {};
      let fn = (data,Id)=>{
        if(data.Id==Id) {
          obj = {PId:data.PId,Name:data.Name}
        }else{
          if(data.Details && data.Details.length) {
            for(let i=0;i<data.Details.length;i++) {
              fn(data.Details[i],Id)
            }
          }
        }
      }
      fn(this.dataIn.objDataTree,Id);
      return obj;
    },
    audit_Click(n) {//1是禁用，3是启用
      fetchData({
        API:'/Api/User/UserEnabled',
        para:{
          Id:this.selectedItem[0],
          Status:n
        },
        callback:data=>{
          this.initPageData()
        }
      })
    },
    update_Click() {

    },
    del_Click() {
      dialog({
        title: '删除用户',
        content: '删除该用户将无法恢复，请确认',
        ok:()=> {
          fetchData({
            API:'/Api/User/UserDelete',
            para:{Id:this.selectedItem[0]},
            callback:data=>{
              this.initPageData()
            }
          })
        },
        cancel() {}
      }).showModal();
    },
    copy_Click() {

    },
    getTreePath(treeData,item) {
      //无论新增、复制、修改，都走这个方法，最终把机构树路径写入状态机
      //然后在新增、复制、修改页面，取出机构树路径，并展示出来
      let arr = [
        {
          Id:item.Id,Name:item.Name,PId:item.PId
        }
      ];
      let fn = (data)=>{
        if(data.Id == arr[0].PId) {
          arr.unshift({Id:data.Id,Name:data.Name,PId:data.PId});
          fn(treeData);
        }else{
          if(data.Details && data.Details.length) {
            for(let i=0;i<data.Details.length;i++) {
              fn(data.Details[i]);
            }
          }
        }
      }
      fn(treeData);
      window.localStorage.setItem('branchtreepath',JSON.stringify(arr));
      return arr;
    },
    afterToggleOn(item) {
      this.dataOut.search.BranchId = item.Id;
      this.getTreePath(this.dataIn.objDataTree,item);
    },
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
    initPageData(pageindex = 1) {
      const me = this;
      this.pageindex = pageindex;
      let para = this.dataOut.search;
      para.PageIndex = pageindex;
      para.PageSize = 10000;
      fetchData({
        API: '/Api/User/UserListWithPage',
        para,
        callback: (data) => {
          data && data.forEach(item => {
            item.isChecked = false;
          });
          this.dataIn.dataTable = data;
          // initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageindex);
        }
      })
    },
    getBranchTree() {
      fetchData({
        api:'/Api/Branch/BranchStoreTree',
        para:{},
        callback:data=>{
          this.dataIn.objDataTree = data;
          this.curDetails = data.Details;
          this.dataOut.search.BranchId = data.Id;
          window.localStorage.setItem('branchtreepath',JSON.stringify([{Id:data.Id,Name:data.Name}]));
          this.$nextTick(()=>{
            $(this.$el).find('li[data-id=0]').addClass('on')
          })
        }
      })
    }
  },
  created() {
    this.getBranchTree();
  },
  ready() {
    const $el = $(this.$el);
    $el.find('.v-tree').on('click', 'li.item', function(e) {
      $el.find('li.item').removeClass('on');
      $(this).addClass('on');
      e.stopPropagation();
    })
  }
}
</script>

