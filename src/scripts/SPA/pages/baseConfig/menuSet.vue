<template>
  <div class="main">
    <aside-tree :theModel="treeData" @upName="upName" v-model="curTree" class="aside-tree">
    </aside-tree>
    <!-- 表格区域 -->
    <div class="right-content">
      <div class="menu">
        <p>{{navigation}}</p>
        <div>
          <button class="btn btn-primary fr ml10" @click="addRule">添加</button>
          <!-- <button class="btn btn-danger fr" v-show="curTree.length !== 1">删除</button> -->
        </div>
      </div>
      <table class="table table-bordered table-hover datalist">
        <thead>
          <tr>
            <!-- <th>
              <label class="checkbox">
                <input type="checkbox" v-model="allCheck" @click="checkAll"><span class="icon"></span></label>
            </th> -->
            <th>
              上级
            </th>
            <th v-show="!isLast">菜单名称</th>
            <th v-show="isLast">权限名称</th>
            <th v-show="!isLast">地址</th>
            <th v-show="isLast">cmd</th>
            <th>顺序</th>
            <th v-show="!isLast">状态</th>
            <th v-show="isLast">说明</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <!-- <td>
              <label class="checkbox">
                <input type="checkbox" v-model="checkArr" :value="{'id': item.id, 'index': index}"><span class="icon"></span></label>
            </td> -->
            <td>
              {{curName}}
            </td>
            <td>
              {{ item.Name}}
            </td>
            <td v-show="!isLast">
              {{item.MenuUrl}}
            </td>
            <td v-show="isLast">{{item.Cmd}}</td>
            <td>
              <a href="javascript:;" class="icon icon-up" @click="upAct(item.Id, index)" :class="{disabled:index==0}"></a>
              <a href="javascript:;" class="icon icon-down" @click="dowAct(item.Id, index)" :class="{disabled:index+1==tableData.length}"></a>
            </td>
            <td v-show="!isLast">
              <radio-tab v-model="item.Enable" :id="item.Id" :status="item.Enable"></radio-tab>
            </td>
            <td v-show="isLast">{{item.Description}}</td>
            <td class="act-box">
              <span @click="edit(item.Id, index)">编辑</span>
              <span @click="del(item.Id, index)">删除</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <popover :show="formFlag" @close="formFlag = false;" :tit=" isAdd ? '添加' : '编辑'">
      <div class="set">
        <dl class="item">
          <dt class="title require-mark">上级</dt>
          <dd class="content">
            <input type="text" disabled :value="curName">
          </dd>
        </dl>
        <dl class="item">
          <dt class="title require-mark">{{ isLast ? '权限名称' : '菜单名称'}}</dt>
          <dd class="content">
            <input type="text" v-model="form.name" placeholder="输入内容" data-validate="required pop" class="com-ipt">
          </dd>
        </dl>
        <dl class="item" v-show="!isLast">
          <dt class="title require-mark">地址</dt>
          <dd class="content">
            <input type="text" v-model="form.addr" placeholder="输入内容" data-validate="required pop" class="com-ipt">
          </dd>
        </dl>
        <dl class="item" v-show="!isLast">
          <dt class="title require-mark">ICON</dt>
          <dd class="content">
            <input type="text" v-model="form.icon" placeholder="输入内容" data-validate="required pop" class="com-ipt">
          </dd>
        </dl>
        <!-- <dl class="item" v-show="!isLast">
          <dt class="title require-mark">是否启用</dt>
          <dd class="content">
            <radio-tab :status="form.status" v-model="form.status"></radio-tab>
          </dd>
        </dl> -->
        <dl class="item" v-show="isLast">
          <dt class="title require-mark">cmd</dt>
          <dd class="content">
            <input type="text" v-model="form.cmd" placeholder="输入内容" data-validate="required pop" class="com-ipt">
          </dd>
        </dl>
        <dl class="item" v-show="isLast">
          <dt class="title require-mark">说明</dt>
          <dd class="content">
            <input type="text" v-model="form.desc" placeholder="输入内容" data-validate="required pop" class="com-ipt">
          </dd>
        </dl>
      </div>
      <div slot="footer">
        <button class="btn btn-primary" @click="sub">提交</button>
        <button class="btn btn-default" @click="formFlag = false">关闭</button>
      </div>
    </popover>
  </div>
</template>
<script>
import asideTree from "../../../vues/components/asideTree";
import radioTab from "./radio-tab";
import popover from "./popover";
export default {
  data() {
    return {
      treeData: [], //结构树数据
      tableData: [], //表格数据
      checkArr: [], //已经选中的选项数组
      allCheck: false, //是否已经全选
      formFlag: false, //弹框展示控制
      curTree: [], //当前选中的左边结构树路径
      isAdd: true, //是添加还是编辑
      curName: '', //当前选中项的名称
      curId: '', //当前选中项的id
      editIndex: '', //编辑信息当前的索引值
      form: { //表单信息
        name: '',
        addr: '',
        icon: '',
        status: true,
        cmd: '',
        desc: '',
      },
      isLast: false, //是否是最后一层,即表格是否显示的是权限管理
    };
  },
  components: {
    asideTree, //侧边栏结构树
    radioTab, //选择tab
    popover, //弹框
  },
  methods: {
    upAct(id, i) { //上调
      if (i == 0) {
        return false;
      }
      fetchData({
        API: this.isLast ? '/api/Menu/MenuActionWeightUP' : '/api/Menu/MenuWeightUP',
        para: {
          Id: id
        },
        callback: data => {
          const temI = i - 1;
          const temObj = this.tableData.splice(i, 1)[0];
          this.tableData.splice(temI, 0, temObj);
        }
      })
    },
    dowAct(id, i) { //下调
      if (i == this.tableData.length) {
        return false;
      }
      fetchData({
        API: this.isLast ? '/api/Menu/MenuActionWeightDown' : '/api/Menu/MenuWeightDown',
        para: {
          Id: id
        },
        callback: data => {
          const temI = i + 1;
          const temObj = this.tableData.splice(i, 1)[0];
          this.tableData.splice(temI, 0, temObj);
        }
      })
    },
    edit(id, i) { //编辑
      this.isAdd = false;
      this.formFlag = true;
      this.form.name = this.tableData[i].Name;
      this.form.Id = id;
      if (this.isLast) { //是权限管理
        this.form.cmd = this.tableData[i].Cmd;
        this.form.desc = this.tableData[i].Description;
      } else { //非权限管理
        this.form.Id = this.tableData[i].Id;
        this.form.addr = this.tableData[i].MenuUrl;
        this.form.icon = this.tableData[i].Icon;
        this.form.status = this.tableData[i].Enable;
      }
      // console.log(this.form.name);
      this.editIndex = i; //编辑当前的索引值
    },
    del(id, i) { //删除
      dialog({
        title: '删除',
        content: `确定删除“${this.tableData[i].Name}”此条类别？`,
        ok: () => {
          fetchData({
            API: this.isLast ? '/api/Menu/MenuActionDelete' : '/api/Menu/MenuDelete',
            para: {
              Id: id
            },
            callback: data => {
              this.tableData.splice(i, 1);
            }
          })
        },
        cancel() {}
      }).showModal();

    },
    checkAll() { //点击全选
      if (this.allCheck) { //已经全选了，就取消全选
        this.checkArr.splice(0, this.checkArr.length);
      } else { //没有全部选中，那就选中全部
        this.checkArr.splice(0, this.checkArr.length);
        this.checkArr = this.tableData.map((element, index) => {
          return {
            'id': element.id,
            'index': index
          }
        });
      }
    },
    getMenuList() { //首次获取列表
      fetchData({
        api: '/api/Menu/GetMenuAll',
        callback: data => {
          this.treeData = data;
          this.tableData = data[0].Child;
          this.curName = data[0].Name;
          this.curId = data[0].Id;
        }
      })
    },
    addRule() { //结构树添加
      this.isAdd = true;
      this.formFlag = true;
      this.form.name = '';
      this.form.Id = '';
      this.form.addr = '';
      this.form.icon = '';
      this.form.status = true;
      this.form.cmd = '';
      this.form.desc = '';
    },
    upName(...args) { //获取从结构树中提交上来的当前选中项的名称
      this.curName = args[0];
      this.curId = args[1];
    },
    sub() { //弹窗提交
      const obj1 = { //编辑菜单的参数
        SiteId: this.treeData[this.curTree[0]].Id,
        Id: this.form.Id,
        PId: this.curTree.length == 1 ? '0' : this.curId,
        Item: this.form.name,
        Name: this.form.name,
        MenuUrl: this.form.addr,
        Icon: this.form.icon
      };
      const obj2 = { //添加权限的参数
        Id: this.form.Id,
        PMenuId: this.curId,
        Item: this.form.name,
        Name: this.form.name,
        Cmd: this.form.cmd,
        Description: this.form.desc
      }
      fetchData({
        api: this.isLast ? (this.isAdd ? '/api/Menu/MenuActionAdd' : '/api/Menu/MenuActionModify') : (this.isAdd ? '/api/Menu/MenuAdd' : '/api/Menu/MenuModify'),
        para: this.isLast ? obj2 : obj1,
        callback: data => {
          if (this.isAdd) {
            // this.tableData.push(this.isLast ? obj2 : obj1);
            this.tableData.push(data);
          } else {
            this.tableData.splice(this.editIndex, 1, (this.isLast ? obj2 : obj1));
          }
          // let obj = isLast ? obj2 : obj1;
          // upDataSingle(obj);
        }
      })
      this.formFlag = false;
    },
    upDataSingle(bol, obj) { //单独更改本地数据    bol==> true 更改   false 添加
      let temTableData = this.treeData;
      for (let i = 0; i < this.curTree.length; i++) {
        if (i == 3) {
          temTableData = temTableData[newVal[i]].MenuAction;
        } else {
          temTableData = temTableData[newVal[i]].Child;
        }
      }
      if (bol) {

      } else {
        this.temTableData.push(obj);
        this.tableData.push(obj);
      }
    }
  },
  watch: {
    checkArr(newVal) {
      if (newVal.length == this.tableData.length) {
        this.allCheck = true;
      } else {
        this.allCheck = false;
      }
    },
    curTree(newVal) {
      if (newVal.length >= 4) { //显示权限管理
        this.isLast = true;
      } else {
        this.isLast = false;
      }
      let temTableData = this.treeData;
      if (this.treeData.length <= 0) {
        return false;
      }
      for (let i = 0; i < newVal.length; i++) {
        if (i == 3) {
          temTableData = temTableData[newVal[i]].MenuAction;
        } else {
          temTableData = temTableData[newVal[i]].Child;
        }
      }
      this.tableData = temTableData;
    }
  },
  computed: {
    checkIdArr() { //列表中选中的id数组
      return this.checkArr.map(item => item.id);
    },
    checkIndexArr() { //列表中选中的项的index数组
      return this.checkArr.map(item => item.index);
    },
    navigation() { //导航
      let temArr = this.treeData;
      let temNav = [];

      if (this.treeData.length <= 0) {
        // temNav.push(temArr[0].Name);
      } else {
        for (let i = 0; i < this.curTree.length; i++) {
          temNav.push(temArr[this.curTree[i]].Name);
          if (i != 3) {
            temArr = temArr[this.curTree[i]].Child;
          }
        }
      }
      return temNav.join('>');
    }
  },
  created() {
    this.getMenuList(); //获取菜单列表
  }
};
</script>
<style lang="scss" scoped>
.ml10 {
  margin-left: 10px;
}

.tree-add {
  cursor: pointer;
  height: 40px;
  line-height: 40px;
  color: #f00;
  .add-icon {
    position: relative;
    width: 7px;
    height: 7px;
    vertical-align: middle;
    display: inline-block;
    &::after {
      content: "";
      width: 7px;
      height: 1px;
      left: 0;
      top: 3px;
      position: absolute;
      background-color: #f00;
    }
    &::before {
      content: "";
      width: 1px;
      height: 7px;
      left: 3px;
      top: 0;
      position: absolute;
      background-color: #f00;
    }
  }
}

.main {
  display: flex;
  justify-content: space-between;
  .right-content {
    flex-grow: 1;
    margin-left: 20px;
  }
  .menu {
    display: flex;
    justify-content: space-between;
    line-height: 30px;
  }
}

.act-box {
  span {
    cursor: pointer;
  }
}

.set {
  padding: 20px;
  padding-top: 14px;
  max-height: 100%;
  overflow-x: hidden;
  .item {
    padding: 6px 0;
    line-height: 30px;
    .title {
      float: left;
      min-width: 5em;
      margin-right: 8px;
      font-weight: 400;
      line-height: inherit;
      text-align: right;
      white-space: nowrap;
    }
    .content {
      position: relative;
      overflow: hidden;
      line-height: inherit;
      text-align: left;
      select,
      input {
        vertical-align: middle;
        width: 180px;
      }
    }
  }
}

.required-mark:before {
  content: '*';
  color: #DE3400;
}

.set>.item:after {
  content: '';
  display: table;
  clear: both;
}

input:disabled {
  background-color: #fff;
}
</style>