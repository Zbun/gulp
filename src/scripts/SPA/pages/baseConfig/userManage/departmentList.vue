<template>
  <div class="main">
    <div class="content-field goods-category clearfix">
      <div class="z-tree category-tree">
        <ul class="list">
          <li class="item spread dead" @click.stop="selectItem({Id:0})">
            <p class="title">全部部门</p>
            <ul class="list list-end">
              <li class="item" v-for="item in arrDepartmentList" :class="{on:curItem.Id==item.Id}">
                <p class="title" @click.stop="selectItem(item)" :title="item.Name">
                  {{item.Name}}
                </p>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="data-content">
        <div class="clearfix align-btn">
          <button class="btn btn-primary fr" @click="edit(0)">
            新增
          </button>
          <span class="fr mr10">{{curItem.Name}}共计{{tableData.length}}个子部门</span>
          <span class="crumbs">
            全部部门 {{curItem.Name?('>'+curItem.Name):''}}
          </span>
        </div>
        <table class="table table-bordered table-hover datalist">
          <thead>
            <tr>
              <th style="width:100px;">
                部门Id
              </th>
              <th style="width:130px;">
                部门名称
              </th>
              <th style="width:100px;">
                上级部门Id
              </th>
              <th style="width:100px;">
                排序
              </th>
              <th style="width:130px;">
                创建时间
              </th>
              <th style="width:130px;">
                更新时间
              </th>
              <!-- <th style="width:130px;">
                排序
              </th> -->
              <th style="width:160px">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in tableData">
              <td>
                {{item.Id}}
              </td>
              <td>
                {{item.Name}}
              </td>
              <td>
                {{item.PId}}
              </td>
              <td>
                {{item.Weight}}
              </td>
              <td>
                {{item.DateAdded|datetime}}
              </td>
              <td>
                {{item.DateModify|datetime}}
              </td>
              <!-- <td>
                <a href="javascript:;" class="icon icon-up" @click="up(item,index)" :class="{disabled:index==0}"></a>
                <a href="javascript:;" class="icon icon-down" @click="down(item,index)" :class="{disabled:index+1==tableData.length}"></a>
              </td> -->
              <td>
                <div class="action-field">
                  <a href="javascript:;" class="item" @click="edit(1,item)">编辑</a>
                  <a href="javascript:;" class="item" @click="del(item,index)">删除</a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="table-data-empty" v-show="tableData&&tableData.length==0">
          暂无相关数据
        </div>
        <div class="pageBox text-right"></div>
      </div>
    </div>
    <div class="popup" v-if="isShowPop">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{isEdit==1?'编辑':'新增'}}</h2>
        <div class="body">
          <div class="content" style="width:400px">
            <div class="set">
              <dl class="item">
                <dt class="title text-muted required-mark">上级部门</dt>
                <dd class="content">
                  <select class="mr5 com-ipt large" v-model="editItem.PId" :disabled="isEdit==1">
                    <option value="0">全部部门</option>
                    <option v-for="item in arrDepartmentList" :value="item.Id">
                      {{item.Name}}
                    </option>
                  </select>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title text-muted">
                  排序
                </dt>
                <dd class="content">
                  <input name="" v-model="editItem.Weight" class="com-ipt large" palceholder="请输入排序字段" data-validate="required"></input>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title text-muted">
                  部门名称
                </dt>
                <dd class="content">
                  <input name="" v-model="editItem.Name" class="com-ipt block" palceholder="请填写部门名称" data-validate="required"></input>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">确定</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 基础设置-分类管理
 */
export default {
  data() {
    return {
      isShowPop: false,
      arrDepartmentList: [],
      tableData: [],
      curItem: {
        //分类树选中当前
        PId: "0" //默认总类
      },
      isEdit: 0,
      editItem: {
        PId: "0"
      }
    };
  },
  components: {},
  methods: {
    initPageData(pageIndex, item) {
      let para = {};
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 15;
      if (item) {
        para.PId = item.Id;
      } else {
        para.PId = this.curItem.PId;
      }
      fetchData({
        API: "api/UserMng/GetPlatformDepartmentList",
        para,
        callback: data => {
          data.map(el => {
            if (el.Level == 1) {
              this.arrDepartmentList = data;
            }
          });
          this.tableData = data;
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
    selectItem(item) {
      this.curItem = item;
      this.initPageData(1, item);
    },
    del(item, index) {
      dialog({
        title: "删除",
        content: `确认删除“${item.Name}”此部门？`,
        ok: () => {
          fetchData({
            API: "api/UserMng/DepartmentDelete",
            para: {
              Id: item.Id
            },
            callback: data => {
              if (item.Level == 1) {
                this.arrDepartmentList.splice(index, 1);
              }
              this.tableData.splice(index, 1);
            }
          });
        },
        cancel() {}
      }).showModal();
    },
    edit(i, item) {
      //i为1时编辑，0时添加
      this.isEdit = i;
      if (i == 1) {
        this.editItem = Object.assign({}, item);
        this.curItem = item;
      } else {
        this.editItem = {
          Id: 0,
          PId: 0
        };
      }
      this.isShowPop = true;
    },
    onSubmit_Click() {
      if (!zmm_validator(this.$el.querySelector(".popup"))) {
        return;
      }
      let para = {};
      para.Name = this.editItem.Name;
      if (this.isEdit == 1) {
        para.Id = this.editItem.Id;
        fetchData({
          API: "api/UserMng/DepartmentModify",
          para,
          callback: data => {
            // this.arrDepartmentList = data;
            this.isShowPop = false;
            this.initPageData(1);
          }
        });
      } else {
        para.PId = this.editItem.PId;
        para.Weight = this.editItem.Weight;
        fetchData({
          API: "api/UserMng/DepartmentAdd",
          para,
          callback: data => {
            // if (data.Level == 1) {
            //   this.arrDepartmentList.push(data);
            // } else {
            //   this.tableData.push(data);
            // }
            this.curItem = {};
            this.initPageData(1);
            this.isShowPop = false;
          }
        });
      }
    },
    onCancel_Click() {
      this.isShowPop = false;
    }
  },
  created() {
    this.initPageData(1);
  }
};
</script>