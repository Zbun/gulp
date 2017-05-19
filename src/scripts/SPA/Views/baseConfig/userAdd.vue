<template>
  <div class="main" v-cloak>
    <slot name="title">
      <h1 class="content-title">
        <div class="action">
          <a href="javascript:history.go(-1)" class="item">返回列表</a>
        </div>
        {{hasCopyId?'复制':hasUpdateId?'修改':'新增'}}用户
      </h1>
    </slot>
    <div class="content-field">
      <div class="content-large w80p">
        <span class="bg-num">1</span>
        <b class="ml5">基础信息</b>
        <div class="set mt10">
          <template v-if="!hasUpdateId">
            <dl class="item">
              <dt class="title required-mark">
                用户名
              </dt>
              <dd class="content">
                <input v-else class="com-ipt large userName" data-validate="required" data-validate-rules="[{rule:/[\u4E00-\u9FA5]/,msg:'用户名不能中文，请检查'}]" type="text" maxlength="100" placeholder="请输入用户名称" v-model="editInfo.UserName">
              </dd>
            </dl>
            <dl class="item area-box">
              <dt class="title required-mark">
                密码
              </dt>
              <dd class="content area-box">
                <input class="com-ipt large" data-validate="required" data-validate-length=6 type="password" maxlength="100" placeholder="请输入密码" v-model="editInfo.UserPwd">
              </dd>
            </dl>
          </template>
          <dl class="item">
            <dt class="title required-mark">
              姓名
            </dt>
            <dd class="content">
              <input class="com-ipt large" data-validate="required" type="text" maxlength="100" placeholder="请输入姓名" v-model="editInfo.Real">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title required-mark">
              手机
            </dt>
            <dd class="content">
              <input class="com-ipt large" data-validate="required phone" type="text" maxlength="11" placeholder="请输入手机号码" v-model="editInfo.Phone">
            </dd>
          </dl>
        </div>
        <p class="mt20">
          <span class="bg-num">2</span>
          <b class="ml5">所属机构</b>
        </p>
        <table class="table table-bordered mt10">
          <thead>
            <tr>
              <th>
                <button class="btn btn-default ml10" style="color:#1e8ccb;" @click.stop="showBranch=true">选择机构</button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <template v-if="dataIn.branch.length!==0">
                  <span class="ml20" style="cursor:pointer;" title="删除" @click.stop="dataIn.branch=[]">&times; </span>
                  <span v-for="(index,item) in dataIn.branch" 
                    :style="{color:index==dataIn.branch.length-1?'#333':'#999',fontWeight:index==dataIn.branch.length-1?'bold':''}">{{item.Name+(index==dataIn.branch.length-1?'':' > ')}}
                  </span>
                </template>
                <span class="ml20" v-else>您还没有选择所属机构</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="mt20">
          <span class="bg-num">3</span>
          <b class="ml5">分配权限</b>
        </p>
        <table class="table table-bordered mt10">
          <thead>
            <tr>
              <th colspan="3">
                <label class="checkbox ml10">
                  <input type="checkbox" v-model="checkAll" @change="checkAll_Change">
                  <span class="icon"></span>
                  <span class="text"> 全选</span>
                </label>
                <span class="ml5"> 菜单设置</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(index,item) in dataIn.menuList">
              <tr class="chks-re" v-for="(j,el) in item.ChildMenu" :style="{backgroundColor:index%2===1?'#fdfdfd':''}">
                <td :rowspan="item.ChildMenu.length" v-if="j===0">
                  <label class="checkbox">
                    <input type="checkbox" v-model="item.isChecked" @change="chk1_Change(item)">
                    <span class="icon"></span>
                    <span class="text">{{item.Item}}</span>
                  </label>
                </td>
                <td>
                  <label class="checkbox">
                    <input type="checkbox" v-model="el.isChecked" @change="chk2_Change(item,el)">
                    <span class="icon"></span>
                    <span class="text">{{el.Item}}</span>
                  </label>
                </td>
                <td>
                  <label class="checkbox" v-for="(jj,action) in el.Actions">
                    <input type="checkbox" v-model="action.isChecked" @change="chk3_Change(item,el,action)">
                    <span class="icon"></span>
                    <span class="text">{{action.Item}}</span>
                  </label>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <p class="mt20">
          <span class="bg-num">3</span>
          <b class="ml5">绑定分仓</b>
        </p>
        <table class="table table-bordered mt10">
          <thead>
            <tr>
              <th>
                <div class="search clearfix" style="float:right;">
                  <span>
                    <input type="search" placeholder="请输入关键字" v-model="searchText">
                  </span>
                  <button class="btn btn-primary ml10">搜索</button>
                </div>
                <b class="ml10 font-small" style="vertical-align: text-bottom;">
                  机构：
                  <template v-if="dataIn.branch.length!==0">
                    <span v-for="(index,item) in dataIn.branch" 
                      :style="{color:index==dataIn.branch.length-1?'#333':'#999',fontWeight:index==dataIn.branch.length-1?'bold':'normal'}">{{item.Name+(index==dataIn.branch.length-1?'':' > ')}}
                    </span>
                  </template>
                  <span v-else>请先选择机构！</span>
                </b>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style="padding:5px 15px;">
                  <label class="checkbox" v-if="dataIn.branch.length!==0">
                    <input type="checkbox" v-model="checkAllStore" @change="checkAllStore_Change">
                    <span class="icon"></span>
                    <span class="text"> 全选</span>
                  </label>
                  <ul style="overflow:hidden;padding:5px;">
                    <li style="width:33.333%;float:left;" v-for="item in dataIn.storeList | filterBy searchText in 'Name'">
                      <label class="checkbox">
                        <input type="checkbox" v-model="item.isChecked" @change="checkOneStore_Change">
                        <span class="icon"></span>
                        <span class="text"> {{item.Name}}</span>
                      </label>
                    </li>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-center mb10">
        <button class="btn btn-primary big" @click="save_Click($event)">提交{{hasUpdateId?'修改':hasCopyId?'复制':''}}</button>
      </p>
    </div>
    <select-branch :show.sync="showBranch" @after-select-branch="afterSelectBranch"></select-branch>
  </div>
</template>
<script>
/**
 * 用户添加编辑
 * zhao.liubin@zol.com.cn
 * 2016-12-15
 * updated by wyj
 * 2017-05-16
 */

export default {
  data() {
      return {
        showBranch:false,
        checkAll:false,
        checkAllStore:false,
        searchText:'',
        APIS: {
          INSERT: '/Api/User/UserInsert', //默认添加新数据
          PREVIEW: '/Api/User/UserPreview', //编辑时读取数据
          UPDATE: '/Api/User/UserUpdate', //编辑更新时接口
        },
        curAPI: '',
        dataIn: {
          menuList: [],
          storeList:[],
          idDataList:{},
          branch:[]
        },
        updateId: '', //编辑时，用户ID
        copyId:'',//复制时的id
        id:'',//新增时带过来的id
        editInfo: {
          UserName: '',
          UserPwd: '',
          Real: '',
          Phone: ''
        }
      }
    },
    components: {
      selectBranch:require('./popup/selectBranch.vue')
    },
    computed: {
      hasUpdateId() {
        return !isNaN(this.updateId) && typeof this.updateId === 'number';
      },
      hasCopyId() {
        return !isNaN(this.copyId) && typeof this.copyId === 'number';
      }
    },
    methods: {
      getMenuIds() {
        let arr = [];
        this.dataIn.menuList.forEach(item1=>{
          item1.isChecked && arr.push(item1.Code);
          item1.ChildMenu && item1.ChildMenu.forEach(item2=>{
            item2.isChecked && arr.push(item2.Code);
            item2.Actions && item2.Actions.forEach(item3=>{
              item3.isChecked && arr.push(item3.Code);
            })
          })
        });
        return arr;
      },
      getStoreIds() {
        let arr = [];
        this.dataIn.storeList.forEach(item=>{
          item.isChecked && arr.push(item.Id)
        });
        return arr;
      },
      //分仓全选
      checkAllStore_Change() {
        this.dataIn.storeList.forEach(item=>{
          item.isChecked = this.checkAllStore
        })
      },
      //分仓单选
      checkOneStore_Change() {
        this.checkAllStore = this.dataIn.storeList.every(item=>{
          return item.isChecked === true
        })
      },
      //全选
      checkAll_Change() {
        this.changeData(this.dataIn.menuList,this.checkAll)
      },
      //选择一级
      chk1_Change(item) {
        item.ChildMenu && item.ChildMenu.forEach(el=>{
          el.isChecked = item.isChecked;
          el.Actions && el.Actions.forEach(action=>{
            action.isChecked = item.isChecked;
          })
        })
      },
      //选择二级
      chk2_Change(item,el) {
        item.isChecked = item.ChildMenu.some(el=>{
          return el.isChecked === true;
        });
        el.Actions && el.Actions.forEach(action=>{
          action.isChecked = el.isChecked;
        });
      },
      //选择三级
      chk3_Change(item,el,action) {
        el.Actions && el.Actions.some(action=>{
          if(action.isChecked) {
            item.isChecked = el.isChecked = true;
          }
        })
      },
      afterSelectBranch(item,treePath) {
        this.dataIn.branch = treePath;
        this.getStoreList();
      },
      initPageData() {
        this.uid = this.$route.params.uid || '';
        var me = this;
        this.curAPI = this.APIS.INSERT;
        if (this.uid) {
          fetchData({
            API: this.APIS.PREVIEW,
            para: {
              id: this.uid
            },
            callback(data) {
              // console.log(data);
              me.curAPI = me.APIS.UPDATE;
              me.editInfo = data;
            }
          })
        } else {
          this.initData();
        }
      },
      //添加成功初始化数据
      initData() {
        this.editInfo.UserName = '';
        this.editInfo.UserPwd = '';
        this.editInfo.Real = '';
        this.editInfo.Phone = '';
        this.editInfo.MenuIds = [];
      },
      //获取所有菜单
      getAllMenu() {
        const def = $.Deferred();
        fetchData({
          API: '/Api/User/UserMenus',
          callback:(data)=> {
            this.changeData(data);
            this.dataIn.menuList = data;
            def.resolve(data);
          }
        });
        return def;
      },
      changeData(data,type) {
        const b = !!type;
        data.forEach(item1=>{
          item1.isChecked = b;
          item1.ChildMenu && item1.ChildMenu.forEach(item2=>{
            item2.isChecked = b;
            item2.Actions && item2.Actions.forEach(item3=>{
              item3.isChecked = b;
            })
          })
        })
      },
      save_Click(e) {
        const me = this;
        if (!zmm_validator(this.$el)) {
          return;
        }
        if (/[\u4E00-\u9FA5]/.test(this.editInfo.UserName)) {
          showTips('用户名不能含中文，请检查', 'error');
          this.$el.querySelector('.userName').focus();
          return;
        }
        const menuIds = this.getMenuIds();
        if (menuIds.length === 0) {
          showTips('请配置用户权限', 'error');
          return;
        }
        const branchId = this.dataIn.branch[this.dataIn.branch.length-1].Id;
        if(branchId === undefined || branchId === '') {
          showTips('请选择所属机构','error');
          return;
        }

        let para = this.editInfo;
        para.BranchId = branchId;
        para.MenuIds = menuIds;
        const storeIds = this.getStoreIds();
        if(storeIds.length!==0) {
          para.StoreIds = storeIds;
        }

        let API = this.APIS.INSERT;
        if(this.hasUpdateId) {
          para.Id = this.updateId;
          API = this.APIS.UPDATE;
        }else{
          
        }
        fetchData({
          API,
          para,
          callback(data) {
            setTimeout(()=>{
              me.$router.go({
                name: 'userList'
              })
            },1000)
          }
        })
      },
      getStoreList() {
        const def = $.Deferred();
        fetchData({
          API:'/Api/Branch/StoreListForCommon',
          para:{BranchId:this.dataIn.branch[this.dataIn.branch.length-1].Id},
          callback:data=>{
            data.forEach(item=>{
              item.isChecked = false
            });
            this.dataIn.storeList = data;
            def.resolve(data);
          }
        });
        return def;
      },
      getDataById() {
        const def = $.Deferred();
        fetchData({
          API:'/Api/User/UserPreview',
          para:{Id:this.hasUpdateId?this.updateId:this.copyId},
          callback:data=>{
            if(this.hasUpdateId) {
              this.editInfo.UserName = data.UserName;
              this.editInfo.Real = data.Real;
              this.editInfo.Phone = data.Phone;
            }
            this.changeData(data.MenuIds,true);
            this.dataIn.idDataList = data;
            def.resolve(data);
          }
        });
        return def;
      },
      backToPage(){
        $.when(this.getAllMenu(),this.getDataById()).then(()=>{
          this.getStoreList().then(()=>{
            //分仓数据回绑
            this.dataIn.storeList.forEach(item=>{
              this.dataIn.idDataList.Stores.forEach(el=>{
                if(el.StoreId==item.Id) {
                  item.isChecked = true;
                }
              })
            })
            //菜单权限回绑
            //循环较多，不如["130002","130003","130004"]这样的格式好绑！
            
            this.dataIn.menuList.forEach(item1=> {
              this.dataIn.idDataList.MenuIds.forEach(idItem1=>{
                if(item1.Code==idItem1.Code) {
                  item1.isChecked = true;
                }

              })
              item1.ChildMenu && item1.ChildMenu.forEach(item2=>{
                this.dataIn.idDataList.MenuIds.forEach(idItem1=>{
                  idItem1.ChildMenus && idItem1.ChildMenus.forEach(idItem2=>{
                    if(idItem2.Code==item2.Code) {
                      item2.isChecked = true;
                    }
                  })
                })
                item2.Actions && item2.Actions.forEach(item3=>{
                  this.dataIn.idDataList.MenuIds.forEach(idItem1=>{
                    idItem1.ChildMenus && idItem1.ChildMenus.forEach(idItem2=>{
                      idItem2.Actions && idItem2.Actions.forEach(idItem3=>{
                        if(item3.Code==idItem3.Code) {
                          item3.isChecked = true
                        }
                      })
                    })
                  })
                })
              })
            })
          });
        })
      }
    },
    created() {
      const updateId = parseFloat(this.$route.query.updateId);
      const copyId = parseFloat(this.$route.query.copyId);
      let treePath = JSON.parse(window.localStorage.getItem('branchtreepath'));
      this.dataIn.branch = (treePath.length===1 && treePath[0].Id===0)?[]:treePath;
      if(!isNaN(updateId) && typeof updateId === 'number') {
        //修改
        this.updateId = updateId;
      }else if(!isNaN(copyId) && typeof copyId === 'number'){
        //复制
        this.copyId = copyId;
      }else{
        //新增
        this.getAllMenu();
        if(this.dataIn.branch.length) {
          this.id = treePath[treePath.length-1].Id;
        }
      }
    },
    watch: {
      copyId(newValue) {
        this.backToPage()
      },
      updateId(newValue) {
        this.backToPage()
      },
      id(newValue) {
        this.getStoreList()
      }
    }
}
</script>
