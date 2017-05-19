<template>
  <div class="main">
    <div class="content-title">机构设置</div>
    <div class="content-field">
      <div class="mb20 mt20">
        <div class="border-box mt14 with-aside clearfix">
          <div class="v-tree tree-branch aside" style="min-height:450px;min-width:350px;width:auto;border-right:1px solid #dcdcdc;">
            <ul class="content list">
              <v-tree :model="dataIn.objDataTree" :open.sync="isOpen" @after-toggle-on="afterToggleOn" @todo-update="toUpdate" @todo-delete="toDelete"></v-tree>
            </ul>
          </div>
          <div class="content" style="min-height:450px;border-left:none;">
            <div class="">
              <div class="clearfix align-btn">
                <button class="fr btn btn-warning" @click="operateStore_Click()">
                  添加分仓
                </button>
                <button class="fr btn btn-warning mr20" v-if="parseInt(objCurBranch.BranchLevel)<4" @click="operateBranch_Click('insert')">
                  添加机构
                </button>
                <h3>{{curContentTitle}}</h3>
              </div>
              <div class="divider-dashed"></div>
              <div class="branch-list-box">
                <div class="mt14">
                  <table class="table table-bordered text-center">
                    <thead>
                      <tr>
                        <th style="width:230px;">
                          机构名称
                        </th>
                        <th>
                          地址
                        </th>
                        <th style="width:180px;">
                          分仓名称
                        </th>
                        <th style="width:130px;">
                          分仓属性
                        </th>
                        <th style="width:80px;">
                          状态
                        </th>
                        <th style="width:130px;">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody v-if="dataIn.arrStoreList.length!=0">
                      <template v-for="item of dataIn.arrStoreList">
                        <tr :class="{'bg-muted':item.isOdd}">
                          <td>
                            {{item.BranchName}}
                          </td>
                          <td>
                            {{item.Address}}
                          </td>
                          <td>
                            {{item.Name}}
                          </td>
                          <td>
                            {{item.StoreType|storeType}}
                          </td>
                          <td>
                            <label class="switcher">
                              <input type="checkbox" v-model="item.Status" @change="changeStoreStatus(item)">
                              <span class="icon"></span></label>
                          </td>
                          <td>
                            <div class="action">
                              <a href="javascript:;" @click="operateStore_Click(item)" class="item">修改</a>
                              <a href="javascript:;" @click="delStore_Click(item)" class="item">删除</a>
                            </div>
                          </td>
                        </tr>
                      </template>
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
                  <div class="text-center">
                    <div class="pageBox"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Operate-branch :show.sync="isShowPopupBranchOperate" :cur-branch="objCurBranch" :type="branchType" @on-after-submit="afterOperateBranch"></Operate-branch>
    <Operate-store :show.sync="isShowPopupStoreOperate" :obj-branch-info="objCurBranchInfo" :cur-store="objCurStore" @on-after-submit="afterOperateStore()"></Operate-store>
  </div>
</template>
<script>
import operateBranch from './popup/operateBranch.vue';
import operateStore from './popup/operateStore.vue';
import vTree from 'commonVues/vTree.vue';
export default {
  data() {
      return {
        branchType: 'insert',
        isOpen: true,
        curContentTitle: '',
        isBranchListContent: true,
        isShowPopupBranchOperate: false,
        pageIndexBranchList: 1,
        objCurBranch: {
          Id: ''
        },
        objCurBranchInfo: {},
        isShowPopupStoreOperate: false,
        objCurStore: {},
        curId: '',
        type: '',

        dataIn: {
          objDataTree: {},
          finalSyncTime: '',
          isBranchListInited: false,
          arrBranchList: [],
          arrStoreList: []
        },
      }
    },
    components: {
      operateBranch,
      operateStore,
      vTree
    },
    watch: {
      "objCurBranch.Id" (nV, oV) {
        this.getStoreByBranchId()
      }
    },
    methods: {
      getBranchTree() {
        let me = this;
        fetchData({
          API: '/Api/Branch/BranchStoreTree',
          callback(data) {
            let curBranchId = '';
            if (me.objCurBranchInfo.Id) {
              data.spread = false;
              curBranchId = me.objCurBranchInfo.Id;
              me.curContentTitle = me.objCurBranchInfo.Name;
            } else {
              data.spread = true;
              me.curContentTitle = data.Name;
            }
            me.objCurBranchInfo = me.objCurBranch = me.dataIn.objDataTree = data;

            me.$nextTick(() => {
              // $(me.$el).find('li.item:first').addClass('on');
              if (me.type == 'update' || me.type == 'insert') {
                if (me.curId) {
                  $(me.$el).find('li[data-id=' + me.curId + ']').trigger('click');
                  $(me.$el).find('li[data-id=' + me.curId + ']').parents('li.item').each((i, el) => {
                    $(el).addClass('spread')
                      .find('ul:first').css('display', 'block')
                  });
                  $(me.$el).find('li[data-id=' + me.curId + ']').find('li:first').addClass('spread').closest('ul').show();
                  // if (me.type == 'update') {//机构名字变了，所以右侧也需要更新机构名字
                  let getName = function(id, data) {
                    if (data.Id == me.curId) {
                      me.objCurBranchInfo = me.objCurBranch = data;
                      me.curContentTitle = data.Name;
                    } else {
                      if (data.Details && data.Details.length) {
                        data.Details.forEach((item) => {
                          getName(id, item);
                        })
                      }
                    }
                  };
                  getName(me.curId, data);
                  // }
                }
              } else if (me.type == 'delete') {
                $(me.$el).find('li.item:first').addClass('on').trigger('click');
                me.curContentTitle = data.Name;
                // me.objCurBranch = data;
                // me.objCurBranch.Id = data.Id;
              }
            })
          }
        })
      },
      getStoreByBranchId() {
        let me = this;
        let para = {};
        para.id = this.objCurBranch.Id;
        para.pageSize = 10000;
        fetchData({
          API: '/Api/Branch/StoreList',
          para,
          callback(data) {
            me.dataIn.arrStoreList = data.Data;
          }
        })
      },
      afterToggleOn(item) {
        this.objCurBranchInfo = this.objCurBranch = item;
        this.curContentTitle = item.Name;
        this.curId = item.Id;
      },
      toUpdate(item) {
        this.operateBranch_Click('update', item);
        this.type = 'update';
      },
      toDelete(item) {
        this.delBranch_Click(item);
        this.type = 'delete';
      },
      //公司机构-分仓列表
      getBranchList(pageindex = 1) {
        let me = this;
        let para = {};
        this.pageIndexBranchList = pageindex;
        para.PageIndex = pageindex;
        para.PageSize = 10;
        fetchData({
          API: '/Api/Branch/BranchStoreList',
          para,
          callback(data) {
            me.dataIn.isBranchListInited = true;
            data.Data.forEach((item, i) => {
              item.isOdd = i % 2 == 1;
            })
            me.dataIn.arrBranchList = data.Data;
            initPage(me.$el.querySelector('.branch-list-box'), data.TotalPages, data.TotalRows, me.getBranchList, pageindex);
          }
        })
      },
      operateBranch_Click(type, curBranch) {
        this.branchType = type;
        this.isShowPopupBranchOperate = true;
        this.type = type;
      },
      afterOperateBranch(type) {
        // if(type=='update'){
        this.getBranchTree();
        // }else{

        // }
      },
      //删除机构
      delBranch_Click(item) {
        let me = this;
        dialog({
          title: '删除机构',
          content: `确认删除机构：<span class="text-warning">${item.Name}</span> 吗？`,
          ok() {
            fetchData({
              API: '/Api/Branch/BranchDelete',
              para: {
                Id: item.Id
              },
              callback() {
                me.getBranchTree();
              }
            })
          },
          cancel() {}
        }).showModal();
      },
      //添加、编辑分仓
      operateStore_Click(curStore) {
        this.isShowPopupStoreOperate = true;
        if (curStore) {
          this.objCurStore = curStore;
        } else {
          this.objCurStore = {};
        }
      },
      afterOperateStore() {
        this.getStoreByBranchId();
      },
      changeStoreStatus(item) {
        let me = this;
        let status = item.Status & 1;
        fetchData({
          API: '/Api/Branch/StoreDisabled',
          para: {
            Id: item.Id,
            status,
          },
          callback() {
            item.Status = status;
          },
          errorCallback() {
            item.Status = !status;
          }
        })
      },
      //删除仓库
      delStore_Click(item) {
        let me = this;
        dialog({
          title: '删除仓库',
          content: `确认删除仓库：<span class="text-warning">${item.Name} </span>吗？`,
          ok() {
            fetchData({
              API: '/Api/Branch/StoreDelete',
              para: {
                Id: item.Id
              },
              callback() {
                me.dataIn.arrStoreList.$remove(item);

                let objBranchs = me.dataIn.objDataTree.Branchs;
                for (let i = 0; i < objBranchs.length; i++) {
                  if (objBranchs[i].Id == me.objCurBranchInfo.Id) {
                    for (let j = 0; j < objBranchs[i].Store.length; j++) {
                      if (objBranchs[i].Store[j].Id == item.Id) {
                        if (item.Status) {
                          me.dataIn.objDataTree.Branchs[i].Store.splice(j, 1);
                        }
                        me.dataIn.arrBranchList[i].Store.splice(j, 1);
                        break;
                      }
                    }
                    break;
                  }
                }
              }
            })
          },
          cancel() {}
        }).showModal();
      },
    },
    ready() {
      this.getBranchTree();
      let $el = $(this.$el).find('.v-tree');
      $el.on('click', 'li.item', function(e) {
        $el.find('li.item').removeClass('on');
        $(this).addClass('on');
        e.stopPropagation();
      })
    }
}
</script>
