<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <button class="btn btn-primary fr" @click="edit(0)">新增</button>
        <input type="search" placeholder="请输入角色名称关键字" class="com-ipt ipt-search" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table table-bordered datalist table-hover">
        <thead>
          <tr>
            <th style="width:130px;">序号</th>
            <th style="width:160px">角色名称</th>
            <th style="width:180px;">创建日期</th>
            <th style="width:180px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in dataIn.arrDataList">
            <td class="text-nowrap">
              {{item.Id}}
            </td>
            <td>
              {{item.Name}}
            </td>
            <td>
              {{item.DateAdded|datetime}}
            </td>
            <td>
              <div class="action-field">
                <a href="javascript:;" class="item" @click="edit(1,item)">编辑</a>
                <a href="javascript:;" class="item" @click="del(item,index)">删除</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
        暂无相关数据
      </div>
      <div class="pageBox text-right"></div>
    </div>
    <div class="popup" v-if="isShowPop">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{isEdit==1?'编辑':'新增'}}</h2>
        <div class="body">
          <div class="content" style="width:400px">
            <ul class="tabBanner">
              <li class="item" v-for="(item,index) in tabsParam" @click="toggleTabs(index)" :class="{on:index==nowIndex}">{{item}}</li>
            </ul>
            <div class="tabConent">
              <div class="set" v-show="nowIndex===0">
                <dl class="item">
                  <dt class="title text-muted">
                    角色名称
                  </dt>
                  <dd class="content">
                    <input name="" class="com-ipt block" palceholder="输入备注" rows="5" v-model="editItem.Name"></input>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title text-muted">
                    角色说明
                  </dt>
                  <dd class="content">
                    <textarea name="" Id="" class="com-ipt block" cols="30" rows="10" v-model="editItem.Description"></textarea>
                  </dd>
                </dl>
              </div>
              <div class="set" v-show="nowIndex===1">
                <!-- <vtree :treeData='arrDataManyUserList' ref='vMenuTree' :clickFun='clickNode' :checkBox='checkbox'></vtree> -->
                <div class="l-tree">
                  <ul class="list">
                    <li class="item dead m0" v-for="item in arrDataManyUserList" :class="{spread:item._spread}">
                      <p class="title" :title="item.Item" @click.stop="clickNode(item,$event)">
                        <label class="checkbox">
                          <input type="checkbox" @change="checkBoxClick(item)" :checked="item.checked">
                          <span class="icon"></span>
                        </label>{{item.Name}}</p>
                      <ul class="list">
                        <li class="item" v-for="item1 in item.Child" :class="{spread:item1._spread}">
                          <p class="title" :title="item.Item" @click.stop="clickNode(item1,$event)">
                            <label class="checkbox">
                              <input type="checkbox" @change="checkBoxClick(item1)" :checked="item1.checked">
                              <span class="icon"></span>
                            </label>{{item1.Name}}</p>
                          <ul class="list">
                            <li class="item" v-for="item2 in item1.Child" :class="{spread:item2._spread}">
                              <p class="title" :title="item2.Item" @click.stop="clickNode(item2,$event)">
                                <label class="checkbox">
                                  <input type="checkbox" @change="checkBoxClick(item2)" :checked="item2.checked">
                                  <span class="icon"></span>
                                </label> {{item2.Name}}
                              </p>
                              <ul class="list list-end">
                                <li class="item" v-for="item3 in item2.MenuAction" :class="{spread:item3._spread}">
                                  <p class="title" :id="item3.Id" :title="item3.Item" @click.stop="clickNode(item3,$event)">
                                    <label class="checkbox">
                                      <input type="checkbox" @change="checkBoxClick(item3)" :checked="item3.checked">
                                      <span class="icon"></span>
                                    </label> {{item3.Name}}
                                  </p>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>

              </div>
              <div class="set" v-show="nowIndex===2">
                <vtree :treeData='arrDataCategoryList' :checkedData.sync="checkedList.CategoryList" ref='vtree' :clickFun='clickNode' :checkBox='checkbox'></vtree>
              </div>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <label class="checkbox fl" v-show="nowIndex===1">

            <input type="checkbox" @click="checkAll($event,1,arrDataManyUserList)" :checked="isCheckedAll(arrDataManyUserList)">
            <span class="icon"></span>
            全选
          </label>
          <label class="checkbox fl" v-show="nowIndex===2">
            <input type="checkbox" @click="checkAll($event,2,arrDataCategoryList)" :checked="isCheckedAll(arrDataCategoryList)">
            <span class="icon"></span>
            全选
          </label>
          <button class="btn btn-primary" @click="onSubmit_Click">确定</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
/**
 * 基础设置-求购列表
 */
import vtree from "vues/components/VueTree.vue";
export default {
  data() {
    return {
      isShowPop: false,
      checkbox: true,
      menuAllChecked: false,
      isEdit: "",
      arrDataCategoryList: [],
      arrDataManyUserList: [],
      arrChkedId: [],
      editItem: {},
      MenuIds: [],
      menuActionIds: [],
      dataIn: {
        inited: false,
        arrDataList: []
      },
      curItem: {
        //分类树选中当前
        Id: "-1" //默认总类
      },
      pageIndex: 1,
      dataOut: {
        search: {
          Key: ""
        }
      },
      tabsParam: ["角色信息", "操作权限", "分类权限"],
      checkedList: {},
      nowIndex: 0
    };
  },
  components: { vtree },
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 15;
      fetchData({
        API: "api/UserMng/GetCustomRoleListPaging",
        para,
        callback: data => {
          this.dataIn.arrDataList = data.Data;
          initPage(
            this.$el,
            data.TotalPages,
            data.TotalRows,
            this.initPageData,
            pageIndex
          );
        }
      });
    },
    toggleTabs: function(index) {
      this.nowIndex = index;
      if (index == 1) {
      }
    },
    getcatagaryList() {
      //获取所有的分类列表
      fetchData({
        API: "api/Supplier/GetSupplierCategoryList",
        callback: data => {
          this.arrDataCategoryList = data;
        }
      });
    },
    getarrDataManyUserList() {
      //获取所有的菜单结构
      fetchData({
        API: "api/Menu/GetSupplierMenuForManyUser",
        callback: data => {
          this.getMenuSpreads(data);
          this.arrDataManyUserList = data;
        }
      });
    },
    getMenuSpreads(data) {
      //新增时所有checked=false
      let getMenuSpread = datas => {
        if (datas) {
          datas.forEach(m => {
            m.checked = false;
            m._spread = false;
            if (m.Child) {
              getMenuSpread(m.Child);
              if (m.MenuAction) {
                getMenuSpread(m.MenuAction);
              }
            }
          });
        }
      };
      getMenuSpread(data);
    },
    checkBoxClick(item) {
      //按钮点击事件
      let arrTemp = [];
      item.checked = !item.checked;
      //查找复选框的所有子节点
      var checkChildFun = ChildDatas => {
        if (ChildDatas) {
          ChildDatas.forEach(m => {
            m.checked = item.checked;
            if (m.Child && m.Child.length != 0) {
              checkChildFun(m.Child);
            } else if (m.MenuAction) {
              checkChildFun(m.MenuAction);
            }
          });
        }
      };
      if (item.Child && item.Child.length != 0) {
        checkChildFun(item.Child);
      } else if (item.MenuAction) {
        checkChildFun(item.MenuAction);
      }

      //查找复选框的所有父节点
      var isFindRootBool = false;
      let PId = "";
      if (item.Child) {
        PId = item.PId;
      } else if (item.MenuId) {
        PId = item.MenuId;
      } else {
        PId = "";
      }
      var recurFuncParent = data => {
        data.forEach(i => {
          if (!isFindRootBool) {
            if (i.Id == PId && PId > 0) {
              PId = i.PId;
              i.checked = item.checked;
              if (i.MenuAction) {
                i.MenuAction.map(el => {
                  if (el.checked == true) {
                    i.checked = true;
                  }
                });
              }
              if (i.Child) {
                i.Child.map(el => {
                  if (el.checked == true) {
                    i.checked = true;
                  }
                });
              }
              // 重新查找
              recurFuncParent(this.arrDataManyUserList);
            } else if (i.Id == item.Id && i.PId == 0) {
              i.checked = item.checked;
              isFindRootBool = true;
            } else {
              recurFuncParent(i.Child, i);
            }

            if (i.checked == true) {
              arrTemp.push(i.Id);
            }
          }
        });
      };
      recurFuncParent(this.arrDataManyUserList);
      this.MenuIds = [...new Set(arrTemp)];
    },
    getMenuActionIds() {
      //获取第四级菜单选中的ID数组
      this.MenuIds = [];
      this.menuActionIds = [];
      var getCheckedNodesFun = datas => {
        if (datas) {
          datas.forEach(m => {
            if (m.Child && m.Child.length != 0) {
              getCheckedNodesFun(m.Child);
            } else {
              getCheckedNodesFun(m.MenuAction);
            }
            if (m.checked === true) {
              if (m.Child) {
                // menuActionIds=[];
                this.MenuIds.push(m.Id);
              } else {
                this.menuActionIds.push(m.Id);
              }
            }
          });
        }
      };
      getCheckedNodesFun(this.arrDataManyUserList);
    },
    clickNode(item, e) {
      //切换三角形的显示
      if (!item._spread != undefined) {
        item._spread = !item._spread;
      }
    },
    isCheckedAll(item) {
      var isChecked = true;
      let getMenuSpread = datas => {
        if (datas && isChecked == true) {
          datas.forEach(m => {
            if (m.checked == true) {
              if (m.Child && isChecked == true) {
                isChecked = true;
                getMenuSpread(m.Child);
                if (m.MenuAction && isChecked == true) {
                  getMenuSpread(m.MenuAction);
                }
              }
            } else {
              isChecked = false;
              return;
            }
          });
        } else {
          isChecked = false;
          return;
        }
      };
      getMenuSpread(item);
      return isChecked;
    },
    checkAll(e, index, item) {
      //点击全选
      // item.checked = e.target.checked;
      if (e.target.checked == true) {
        item.checked = false;
      } else {
        item.checked = true;
      }
      item.checked = !item.checked;
      var checkAllFun = ChildDatas => {
        ChildDatas.forEach(m => {
          // m.partchecked = item.checked;
          m.checked = item.checked;
          if (index == 1) {
            if (m.checked === true && !m.MenuId) {
              this.MenuIds.push(m.Id);
            } else {
              //  this.MenuIds.splice(1, m.Id);
            }
          }
          if (m.Child && m.Child.length != 0) {
            checkAllFun(m.Child);
            if (m.MenuAction) {
              checkAllFun(m.MenuAction);
            }
          }
        });
      };
      checkAllFun(item);
    },

    del(item, index) {
      dialog({
        title: "删除",
        content: `确认删除“${item.Name}”？`,
        ok: () => {
          fetchData({
            API: "api/UserMng/CustomRoleDelete",
            para: {
              Id: item.Id
            },
            callback: data => {
              this.dataIn.arrDataList.splice(index, 1);
            }
          });
        },
        cancel() {}
      }).showModal();
    },
    edit(i, item) {
      this.isEdit = i;
      if (i == 1) {
        this.editItem = Object.assign({}, item);
        fetchData({
          API: "api/UserMng/GetCustomRoleInfo",
          para: {
            Id: item.Id
          },
          callback: data => {
            this.checkedList = data;
            var modifyDataFun = function(datas, checkedData) {
              if (datas) {
                datas.forEach((m, index) => {
                  if (m.Child && m.Child.length != 0) {
                    modifyDataFun(m.Child, data);
                  } else {
                    modifyDataFun(m.MenuAction, data);
                  }
                  if (checkedData) {
                    if (m.Child) {
                      checkedData.MenuList.map(el => {
                        if (m.Id === el) {
                          m.checked = true;
                        }
                      });
                    } else {
                      checkedData.MenuActionList.map(el => {
                        if (m.Id === el) {
                          m.checked = true;
                        }
                      });
                    }
                  }
                });
              }
            };
            modifyDataFun(this.arrDataManyUserList, data);
          }
        });
      } else {
        this.getMenuSpreads(this.arrDataManyUserList);
        this.checkedList.CategoryList = [];
        this.editItem = {
          Name: ""
        };
      }
      this.isShowPop = true;
    },
    onSubmit_Click() {
      let para = this.editItem;
      this.getMenuActionIds();
      //获取选中的分类id数组
      para.CategoryCodes = this.$refs.vtree
        .getCheckedNodes()
        .map(el => el.Code);
      //  para.menuActionIds = this.menuActionIds;
      para.menuActionIds = [...new Set(this.menuActionIds)];
      para.MenuIds = [...new Set(this.MenuIds)];
      fetchData({
        API: "api/UserMng/CustomRoleEdit",
        para,
        callback: data => {
          this.onCancel_Click();
          this.initPageData(this.pageIndex);
        }
      });
    },
    onCancel_Click() {
      this.isShowPop = false;
    }
  },
  created() {
    this.initPageData(1);
    this.getcatagaryList();
    this.getarrDataManyUserList();
  },
  watch() {}
};
</script>