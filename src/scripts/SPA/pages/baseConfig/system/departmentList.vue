<template>
  <div class="main">
    <div class="content-field goods-category clearfix">
      <div class="z-tree category-tree">
        <ul class="list">
          <li class="item spread dead" @click.stop="selectItem({Id:0})">
            <p class="title">全部分类</p>
            <ul class="list list-end">
              <li class="item" v-for="item in arrDataCategoryList" :class="{on:curItem.Id==item.Id}">
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
          <span class="crumbs">
            全部分类 {{curItem.Name?('>'+curItem.Name):''}}
          </span>
        </div>
        <table class="table table-bordered table-hover datalist">
          <thead>
            <tr>
              <th style="width:100px;">
                序号
              </th>
              <th style="width:130px;">
                部门名称
              </th>
              <th style="width:130px;">
                创建时间
              </th>
              <th style="width:130px;">
                更新时间
              </th>
              <th style="width:130px;">
                排序
              </th>
              <th style="width:160px">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in tableData">
              <td>
                {{index+1}}
              </td>
              <td>
                {{item.Name}}
              </td>
              <td>
                {{item.DateAdded|datetime}}
              </td>
              <td>
                {{item.DateModify|datetime}}
              </td>
              <td>
                <a href="javascript:;" class="icon icon-up" @click="up(item,index)" :class="{disabled:index==0}"></a>
                <a href="javascript:;" class="icon icon-down" @click="down(item,index)" :class="{disabled:index+1==tableData.length}"></a>
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
        <div class="table-data-empty" v-show="tableData&&tableData.length==0">
          暂无相关数据
        </div>
      </div>
    </div>
     <div class="popup" v-if="isShowPop">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{isEdit==1?'编辑':'新增'}}</h2>
        <div class="body">
          <div class="content" style="width:400px">
            <div class="set">
              <dl class="item">
                <dt class="title text-muted required-mark">上级部门</dt>
                <dd class="content">
                  <select class="mr5" v-model="editItem.PId"  @change="dropDepartment()">
                    <option value="" disabled selected>上级部门</option>
                    <option v-for="item in arrDataCategoryList" :value="item.Id">
                      {{item.Name}}
                    </option> 
                  </select>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title text-muted">
                  部门名称
                </dt>
                <dd class="content">
                  <textarea name="" v-model="editItem.Name" class="com-ipt block" palceholder="输入备注" rows="5"></textarea>
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
 * 基础设置-品类管理
 */
export default {
  data() {
    return {
      isShowPop: false,
      arrDataCategoryList: [],
      tableData:[],
      curItem: {
        //分类树选中当前
        PId: "0" //默认总类
      },
      isEdit: 0,
      editItem: {
        //子项选中当前
        Item: "",
        Id: ""
      }
    };
  },
  components: {},
  methods: {
    initPageData(item, pageIndex) {
      let para = {};
      if (item) {
        para.PId = item.Id;
      } else {
        para.PId = this.curItem.PId;
      }
      fetchData({
        API: "api/UserMng/GetPlatformDepartmentList",
        para,
        callback: data => {
          console.log(this.curItem);
          if (!item) {
            this.arrDataCategoryList = data;
          }
            this.tableData=data;
        }
      });
    },
    selectItem(item) {
      this.curItem = item;
      this.initPageData(item);
    },
    up(item, index) {
      fetchData({
        API: "api/Goods/CategoryWeightUP",
        para: {
          Id: item.Id
        },
        callback: data => {
          let arrTemp = this.curItem.Child.splice(index - 1, 1);
          this.curItem.Child.splice(index, 0, arrTemp[0]);
        }
      });
    },
    down(item, index) {
      fetchData({
        API: "api/Goods/CategoryWeightdown",
        para: {
          Id: item.Id
        },
        callback: data => {
          this.curItem.Child.splice(index, 1);
          this.curItem.Child.splice(index + 1, 0, item);
        }
      });
    },
    del(item, index) {
      dialog({
        title: "删除",
        content: `确认删除“${item.Item}”此条类别？`,
        ok: () => {
          fetchData({
            API: "/api/Goods/CategoryDelete",
            para: {
              Id: item.Id
            },
            callback: data => {
              this.curItem.Child.splice(index, 1);
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
        this.editItem = item;
      }
      this.isShowPop = true;
    },
    dropDepartment(){
        fetchData({
        API: "api/UserMng/GetPlatformDepartmentList",
        para:{PId:0},
        callback: data => {
          console.log(data);
           
        }
      });
    },
     onSubmit_Click(){

     },
      onCancel_Click() {
      this.isShowPop = false;
    }
  },
  created() {
    this.initPageData();
  }
};
</script>