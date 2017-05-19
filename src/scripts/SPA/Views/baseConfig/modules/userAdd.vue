<template>
  <div class="main" v-cloak>
    <h1 class="content-title" v-if="uid.length>0">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div>
      编辑用户
    </h1>
    <div :class="{'content-field':uid.length>0}">
      <div class="content-large w70p">
        <span class="bg-num">1</span><b class="ml5">基础信息</b>
        <div class="set mt10">
          <dl class="item">
            <dt class="title required-mark">
              用户名
            </dt>
            <dd class="content">
              <span v-if="uid.length>0">{{editInfo.UserName}}</span>
              <input v-else class="com-ipt large userName" data-validate="required" data-validate-rules="[{rule:/[\u4E00-\u9FA5]/,msg:'用户名不能中文，请检查'}]" type="text" maxlength="100" placeholder="请输入用户名称" v-model="editInfo.UserName">
            </dd>
          </dl>
          <dl class="item area-box" v-if="uid.length==0">
            <dt class="title required-mark">
              密码
            </dt>
            <dd class="content area-box">
              <input class="com-ipt large" data-validate="required" data-validate-length=6 type="password" maxlength="100" placeholder="请输入密码" v-model="editInfo.UserPwd">
            </dd>
          </dl>
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
          <dl class="item">
            <dt class="title required-mark">
              状态
            </dt>
            <dd class="content">
              <select v-model="editInfo.Status">
                <option v-for="(key,value) in userStatus" :value="key">
                  {{value}}
                </option>
              </select>
            </dd>
          </dl>
        </div>
        <p class="mt20"><span class="bg-num">2</span><b class="ml5">权限设置</b></p>
        <table class="table table-bordered mt10">
          <thead>
            <tr>
              <th colspan="2"><span class="ml10">菜单设置</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(i,v) in dataIn.menuList" class="chks-re">
              <td style="width:120px;line-height:30px;">
                <div class="p10 pl20 pr20">
                  <label class="checkbox">
                    <input type="checkbox" :value="v.Code" v-model="editInfo.MenuIds" @change="chkAll_Change(i,v.Code,$event)" class="chk-all">{{v.Item}}<span class="icon"></span></label>
                </div>
              </td>
              <td style="line-height:30px;">
                <div class="p10">
                  <span class="ml10" v-for="(i2,v2) in v.ChildMenu">
                    <label class="checkbox" >
                    <input type="checkbox" class="chk" @change="chk_Change(i,v,$event)" v-model="editInfo.MenuIds" :value="v2.Code">{{v2.Item}}<span class="icon"></span></label>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-center mb10">
        <button class="btn btn-primary big" @click="save_Click($event)">提交</button>
      </p>
    </div>
  </div>
</template>
<script>
/**
 * 用户添加编辑
 * zhao.liubin@zol.com.cn
 * 2016-12-15
 */

export default {
  data() {
      return {
        APIS: {
          INSERT: '/Api/User/UserInsert', //默认添加新数据
          PREVIEW: '/Api/User/UserPreview', //编辑时读取数据
          UPDATE: '/Api/User/UserUpdate', //编辑更新时接口
        },
        curAPI: '',
        dataIn: {
          menuList: []
        },
        uid: '', //编辑时，用户ID
        editInfo: {
          UserName: '',
          UserPwd: '',
          Real: '',
          Phone: '',
          Status: 3,
          MenuIds: []
        }
      }
    },
    components: {

    },
    computed: {
      userStatus() {
        return dictionary['userStatus'];
      }
    },
    methods: {
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
        this.editInfo.Status = 3;
        this.editInfo.MenuIds = [];
      },
      //获取所有菜单
      getAllMenu() {
        let me = this;
        fetchData({
          API: '/Api/User/UserMenus',
          callback(data) {
            for (let i = 0; i < data.length; i++) {
              if (1 == data[i].isAdmin) { //去掉是管理员才能有的菜单
                data.splice(i, 1);
              } else {
                let childMenu = data[i].ChildMenu;
                for (let j = 0; j < childMenu.length; j++) {
                  if (1 == childMenu[j].IsAdmin) {
                    data[i].ChildMenu.splice(j, 1);
                  }
                }
              }
            }
            //
            me.dataIn.menuList = data;
          }
        })
      },
      //全选change
      chkAll_Change(i, code, e) {
        let me = this;
        let node = e.target;
        if (node.checked) {
          me.dataIn.menuList[i].ChildMenu.forEach(item => {
            if (_.indexOf(me.editInfo.MenuIds, item.Code) == -1) {
              me.editInfo.MenuIds.push(item.Code);
            }
          })
        } else {
          let arrTemp = me.editInfo.MenuIds;
          me.dataIn.menuList[i].ChildMenu.forEach(item => {
            _.remove(arrTemp, function(n) {
              return n == item.Code;
            });
          });
          me.editInfo.MenuIds = [];
          me.editInfo.MenuIds = arrTemp;
        }
      },
      chk_Change(i, V, e) {
        let me = this;
        let node = e.target;
        if (node.checked) {
          if (_.indexOf(me.editInfo.MenuIds, V.Code) == -1) {
            me.editInfo.MenuIds.push(V.Code);
          }
        } else {
          let arrTemp = me.editInfo.MenuIds;
          let isIn = false;
          for (let j = 0; j < V.ChildMenu.length; j++) {
            if (_.indexOf(arrTemp, V.ChildMenu[j].Code) > -1) {
              isIn = true;
              break;
            }
          }
          if (isIn) {
            if (_.indexOf(arrTemp, V.Code) == -1) {
              me.editInfo.MenuIds.push(V.Code);
            }
          } else {
            _.remove(arrTemp, function(n) {
              return n == V.Code;
            });
          }
          me.editInfo.MenuIds = [];
          me.editInfo.MenuIds = arrTemp;
        }
      },
      save_Click(e) {
        let me = this;
        if (!zmm_validator(this.$el)) {
          return;
        }
        if (!this.uid && /[\u4E00-\u9FA5]/.test(this.editInfo.UserName)) {
          showTips('用户名不能含中文，请检查', 'error');
          this.$el.querySelector('.userName').focus();
          return;
        }
        if (this.editInfo.MenuIds.legnth == 0) {
          showTips('请配置用户权限', 'error');
          return;
        }
        var para = this.editInfo;

        // console.log(para)

        fetchData({
          API: this.curAPI,
          target: e.target,
          para,
          callback(data) {
            if (!/update/i.test(me.API)) {
              me.$dispatch('on-added-ok');
              me.initData();
            }
            me.$router.go({
              name: 'userMNG',
              params: {
                buTabIndex: 1
              }
            })
          }
        })
      }
    },
    ready() {
      this.getAllMenu();
      this.initPageData();
    }
}
</script>
