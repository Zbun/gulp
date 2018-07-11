<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <button class="btn btn-primary fr" @click="edit(0)">新增</button>
        <input type="search" placeholder="输入姓名/账号" class="com-ipt ipt-search" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <!-- <date-picker :data-out.sync="dataOut.search"></date-picker> -->
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <div class="ovh-y">

        <table class="table table-bordered datalist table-hover">
          <thead>
            <tr>
              <th style="width:160px;">序号</th>
              <th style="width:180px;">姓名</th>
              <th style="width:180px;">账号</th>
              <th style="width:160px;">性别</th>
              <th style="width:180px;">邮箱</th>
              <th style="width:180px;">所在区域</th>
              <th style="width:160px;">部门</th>
              <th>职位</th>
              <th style="width:180px;">创建日期</th>
              <th style="width:180px;">更新日期</th>

              <th style="width:180px;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in dataIn.arrDataList">
              <td class="text-nowrap">
                {{index+1}}
              </td>
              <td class="text-nowrap">
                {{item.RealName}}
              </td>
              <td class="text-nowrap">
                {{item.UserName}}
              </td>
              <td class="text-nowrap">
                {{item.Sex==1 ?'男':'女'}}
              </td>
              <td class="text-nowrap">
                {{item.Email}}
              </td>
              <td class="text-nowrap">
                {{item.AreaName}}
              </td>
              <td class="text-nowrap">
                {{item.DepartMent}}
              </td>
              <td class="text-nowrap">
                {{item.JobTitle}}
              </td>
              <td class="text-nowrap">
                {{item.DateAdded|datetime}}
              </td>
              <td class="text-nowrap">
                {{item.DateModify|datetime}}
              </td>

              <td>
                <div class="action-field">
                  <a href="javascript:;" class="item" @click="edit(1,item)">修改</a>
                  <a href="javascript:;" class="item" @click="del(item,index)">删除</a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
        暂无相关数据
      </div>
      <div class="pageBox text-right"></div>
    </div>
    <div class="popup" v-if="isShowPop">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{isEdit==1?'修改':'新增'}}</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <div class="set">
              <dl class="item">
                <dt class="title text-muted required-mark">
                  管理角色
                </dt>
                <dd class="content">

                  <select v-model="editItem.CustomRoleId" class="com-ipt" style="width:145px;" data-validate="required">
                    <option value="">选择角色</option>
                    <option :value="item.Id" v-for="item in arrRole">
                      {{item.Name}}
                    </option>
                  </select>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title text-muted required-mark">
                  姓名
                </dt>
                <dd class="content">
                  <input name="" v-model="editItem.RealName" class="com-ipt" palceholder="请输入姓名" data-validate="required" data-validate-maxlength="20"></input>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title text-muted required-mark">
                  账号
                </dt>
                <dd class="content">
                  <input name="" v-model="editItem.Username" class="com-ipt" palceholder="请输入账号" data-validate="required phone" data-validate-maxlength="20"></input>
                </dd>
              </dl>

              <dl class="item">
                <dt class="title text-muted required-mark">
                  性别
                </dt>
                <dd class="content">
                  <div class="inline-radio">
                    <label class="radio"><input type="radio" name="matchStatus" value="1" v-model="editItem.Sex">
                      <span class="icon"></span>男</label>
                    <label class="radio"><input type="radio" name="matchStatus" value="0" v-model="editItem.Sex">
                      <span class="icon"></span>女</label>
                  </div>
                </dd>
              </dl>

              <dl class="item">
                <dt class="title text-muted required-mark">
                  邮箱
                </dt>
                <dd class="content">
                  <input name="" v-model="editItem.Email" class="com-ipt x-large" palceholder="请输入邮箱" data-validate="required email"></input>
                </dd>
              </dl>

              <dl class="item">
                <dt class="title text-muted required-mark">
                  所在区域
                </dt>
                <dd class="content areabox">
                  <area-box :area-codes="editItem.AreaCode1+','+editItem.AreaCode2+','+editItem.AreaCode3" :area-code.sync="editItem.AreaCode"></area-box>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title text-muted required-mark">
                  部门
                </dt>
                <select class="mr5" v-model="editItem.DepartmentId1" @change="changeCategory(1)" style="width:164px;">
                  <option value="">一级部门</option>
                  <option v-for="item in curItem.arrCategory1" :value="item.Id">
                    {{item.Name}}
                  </option>
                </select>
                <select class="mr5" v-model="editItem.DepartmentId2" @change="changeCategory(2)" style="width:164px;" data-validate="required">
                  <option value="">二级部门</option>
                  <option v-for="item in curItem.arrCategory2" :value="item.Id">
                    {{item.Name}}
                  </option>
                </select>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title text-muted required-mark">
                  职位
                </dt>
                <dd class="content">
                  <input name="" v-model="editItem.JobTitle" class="com-ipt x-large" palceholder="请输入职位" data-validate="required" data-validate-maxlength="20"></input>
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
import areaBox from "vues/components/tAreaBox.vue";
export default {
  props: {
    areaCodes: "", //接受传入的以,隔开的多级code，作为请求下级数据时使用
    areaCode: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isShowPop: false,
      dataIn: {
        inited: false,
        arrDataList: []
      },
      dataOut: {
        search: {
          Key: "",
          StartDate: "",
          EndDate: ""
        }
      },
      isEdit: 0,
      pageIndex: 1,
      SiteId: 1,
      arrRole: [],
      editItem: {},
      curItem: {
        arrCategory1: [],
        arrCategory2: [],
        DepartmentId1: "",
        DepartmentId2: ""
      }
    };
  },
  components: { areaBox },
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 15;
      fetchData({
        API: "api/UserMng/GetMyMultiuserList",
        para,
        callback: data => {
          this.dataIn.inited = true;
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
    getRoleList() {
      //获取角色列表
      fetchData({
        hideLoading: true,
        API: "api/UserMng/GetCustomRoleList",
        callback: data => {
          this.arrRole = data;
        }
      });
    },

    getCategoryByCode(PId, order) {
      //根据上级Code获取分类，
      order = order || 1;
      for (let i = order; i < 3; i++) {
        this.curItem["arrCategory" + i] = [];
      }
      if (PId === "") {
        return;
      }
      fetchData({
        API: "api/UserMng/GetPlatformDepartmentList",
        hideLoading: true,
        para: {
          PId: PId
        },
        callback: data => {
          this.curItem["arrCategory" + order] = data;
        }
      });
    },
    changeCategory(order) {
      let code = this.editItem["DepartmentId" + order];
      this.getCategoryByCode(code, order + 1);
    },
    del(item, index) {
      dialog({
        title: "删除",
        content: `确认删除“${item.UserName}”？`,
        ok: () => {
          fetchData({
            API: "api/UserMng/MultiuserDelete",
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
      //i为1时编辑，0时添加
      this.isEdit = i;
      this.getRoleList();
      this.getCategoryByCode(0);
      if (i == 1) {
        fetchData({
          API: "api/UserMng/GetMultiuserInfo",
          para: {
            Id: item.Id
          },
          callback: data => {
            this.editItem = data;
            //this.getCategoryByCode(0, 1);
            this.getCategoryByCode(data.DepartmentId1, 2);
          }
        });
      } else {
        this.editItem = {
          CustomRoleId: "",
          Sex: 1,
          DepartmentId1: "",
          DepartmentId2: ""
        };
      }
      this.isShowPop = true;
    },
    onSubmit_Click() {
      if (!zmm_validator(this.$el.querySelector(".popup"))) {
        return;
      }
      let para = this.editItem;
      para.DepartmentId = this.editItem.DepartmentId2;
      para.Password = "111111";
      para.SiteId = this.SiteId;
      para.Phone = para.Username;
      fetchData({
        api: "api/UserMng/MultiuserEdit",
        para,
        callback: () => {
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
  }
};
</script>