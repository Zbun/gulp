<template>
  <div class="main">
    <h2 class="content-title">
            <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div>{{paraSend.flowType|flowType}}审核设置</h2>
    <div class="content-field">
      <div class="content-large w70p">
        <div class="set">
          <dl class="item">
            <dt class="title" style="margin-top:7px;">
              <b>增加流程</b>
            </dt>
            <dd class="content">
              <div class="set">
                <dl class="item" v-if="computedIsNum">
                  <dt class="title required-mark">
                    数量
                  </dt>
                  <dd class="content">
                    <span class="flow-amount">
                      <span class="tag">≥</span>
                    <input type="text" data-validate="show required notPositiveInteger" placeholder="输入数量" class="com-ipt" maxlength="10" v-model="paraSend.AmountMin">
                    </span>
                    件
                  </dd>
                </dl>
                <dl class="item" v-else>
                  <dt class="title required-mark">
                    金额
                  </dt>
                  <dd class="content">
                    <span class="flow-amount">
                      <span class="tag">≥</span>
                    <input type="text" placeholder="输入金额" data-validate="show required money notPositive" class="com-ipt" maxlength="10" v-model="paraSend.AmountMin">
                    </span>
                    元
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title required-mark">
                    审核人
                  </dt>
                  <dd class="content">
                    <table class="table table-bordered table-v-top">
                      <thead>
                        <tr>
                          <td style="width:50%">所有审核人</td>
                          <td style="width:50%">审核顺序排列</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="bg-muted">
                            <div class="compare-list">
                              <ul class="inner">
                                <li class="item" v-for="item in userList" v-if="!item.isSelected">
                                  <div class="info">
                                    <a href="javascript:;" class="action fr ml20 highlight" @click="add_Click(item)">添加</a>
                                    <span class="name">{{item.UserName}}</span>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </td>
                          <td class="bg-muted">
                            <div class="compare-list">
                              <ul class="inner">
                                <li class="item" v-for="item in paraSend.AuditingSteps">
                                  <div class="info">
                                    <a href="javascript:;" class="action fr highlight icon icon-del2" @click="del_Click(item)"></a>
                                    <a href="javascript:;" class="action fr highlight icon icon-down" @click="modifyOrder_Click(item,$index,0)" :class="{disabled:$index==paraSend.AuditingSteps.length-1}"></a>
                                    <a href="javascript:;" class="action fr highlight icon icon-up" @click="modifyOrder_Click(item,$index,1)" :class="{disabled:$index==0}"></a>
                                    <span class="name">{{item.UserName}}</span>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="mt20 text-center">
                      <button class="btn-primary btn big" @click="save_Click($event)">保存</button>
                    </div>
                  </dd>
                </dl>
              </div>
            </dd>
          </dl>
          <dl class="item" v-if="flowList.length>0">
            <dt class="title">
              <b>流程列表</b>
            </dt>
            <dd class="content">
              <table class="table table-bordered text-center table-odd">
                <thead>
                  <tr>
                    <th style="width:20%"><span v-if="paraSend.flowType==41">数量</span><span v-else>金额</span></th>
                    <th style="width:60%">审核人</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in flowList">
                    <td>
                      ≥ {{item.AmountMin}}
                    </td>
                    <td>
                      <div class="flow-show text-left">
                        <span class="flow ml20">
                          <span class="item" v-for="step in item.AuditingSteps">{{step.UserName}}</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="action">
                        <a href="javascript:;" class="item" @click="editFlow_Click(item)">修改</a>
                        <a href="javascript:;" class="item" @click="delFlow_Click(item)">删除</a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        APIS: {
          INSERT: '/Api/Misc/WorkFlowInsert',
          UPDATE: '/Api/Misc/WorkFlowUpdate'
        },
        curAPI: '',
        userList: [],
        flowList: [],
        paraSend: {
          Id: '',
          AmountMin: '',
          flowType: '',
          AuditingSteps: []
        }
      }
    },
    computed: {
      computedIsNum() {
        return this.paraSend.flowType == 41 || this.paraSend.flowType == 61 || this.paraSend.flowType == 71
      }
    },
    components: {},
    methods: {
      initPageData() {
        this.initParaSend();
        this.getUserList();
        this.getFlowList();
      },
      getFlowList() {
        let me = this;
        fetchData({
          API: '/Api/Misc/WorkFlowListByType',
          para: {
            BillType: this.paraSend.flowType
          },
          callback(data) {
            // console.log(data);
            me.flowList = data;
          }
        })
      },
      getUserList() {
        let me = this;
        fetchData({
          API: 'api/User/UserList',
          callback(data) {
            // console.log(data);
            data.forEach(item => {
              item.isSelected = false;
              item.UserId = item.Id;
            })
            me.userList = data;
          }
        })
      },
      initUserList() {
        this.userList.forEach(item => {
          item.isSelected = false;
          item.UserId = item.Id;
        })
      },
      initParaSend() {
        this.curAPI = this.APIS.INSERT;
        this.paraSend.Id = '';
        this.paraSend.AmountMin = '';
        this.paraSend.AuditingSteps = [];
      },
      //添加用户到右侧
      add_Click(item) {
        item.isSelected = true;
        this.paraSend.AuditingSteps.push(item);
      },
      //调顺序
      modifyOrder_Click(item, i, dir) {
        this.paraSend.AuditingSteps.$remove(item);
        if (dir) {
          this.paraSend.AuditingSteps.splice(--i, 0, item);
        } else {
          this.paraSend.AuditingSteps.splice(++i, 0, item);
        }
      },
      //右侧审核人列表删除
      del_Click(item) {
        item.isSelected = false;
        this.paraSend.AuditingSteps.$remove(item);
      },
      //保存
      save_Click(e) {
        let me = this;
        var para = this.paraSend;
        if (!zmm_validator(this.$el)) {
          return;
        }
        if (para.AuditingSteps.length == 0) {
          showTips('审核人需要选择，请选择', 'error');
          return;
        }
        // console.log(para);
        // return;
        fetchData({
          API: this.curAPI,
          target: e.target,
          para,
          callback() {
            me.initParaSend();
            me.initUserList();
            me.getFlowList();
          }
        })
      },
      //编辑流程
      editFlow_Click(item) {
        let me = this;
        this.paraSend.Id = item.Id;
        this.paraSend.AmountMin = item.AmountMin;
        this.curAPI = this.APIS.UPDATE;
        this.paraSend.AuditingSteps = [];
        this.initUserList();
        let arrTemp = this.userList;
        for (let i = 0; i < item.AuditingSteps.length; i++) {
          var curUser = _.find(arrTemp, {
            Id: item.AuditingSteps[i].Id - 0
          });
          curUser.isSelected = true;
          me.paraSend.AuditingSteps.push(curUser);
        }
        this.userList = [];
        setTimeout(function() {
          me.userList = arrTemp;
        }, 10)

      },
      //删除流程
      delFlow_Click(item) {
        let me = this;
        // console.log(item);
        dialog({
          title: '删除流程',
          content: '删除流程不可恢复，请确认',
          ok() {
            fetchData({
              API: '/Api/Misc/WorkFlowDelete',
              para: {
                id: item.Id
              },
              callback() {
                me.flowList.$remove(item);
              }
            })
          },
          cancel() {}
        }).showModal();

      },
    },
    ready() {
      this.paraSend.flowType = this.$route.params.flowType;
      this.initPageData();
    }
}
</script>
