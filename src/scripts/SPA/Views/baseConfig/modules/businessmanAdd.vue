<template>
  <div class="main" v-cloak>
    <div class="content-title" v-if="curCode.length>0">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div>
      编辑业务员
    </div>
    <div :class="{'content-field':curCode.length>0}">
      <article class="p30">
        <section>
          <p><span class="bg-num">1</span><b class="ml5">人员信息</b></p>
          <div class="set ml20">
            <p class="ml30 mt10 mb5">
              <b class="text-warning">推荐码：{{editInfo.RecommendCode}}</b>
            </p>
            <dl class="item">
              <dt class="title required-mark">
                姓名
              </dt>
              <dd class="content">
                <input class="com-ipt large" data-validate="required" type="text" maxlength="100" placeholder="请输入业务员姓名" v-model="editInfo.RealName">
              </dd>
            </dl>
            <dl class="item">
              <dt class="title required-mark">
                手机
              </dt>
              <dd class="content">
                <input class="com-ipt large" data-validate="required phone" type="text" maxlength="11" placeholder="请输入手机号码" v-model="editInfo.Phone">
                <p class="text-warning font-small mt10">
                  业务员暂无登陆系统的权限！
                </p>
              </dd>
            </dl>
          </div>
        </section>
        <section class="mt30">
          <p><span class="bg-num">2</span><b class="ml5">所属机构（<span class="text-warning">{{editInfo.Branchs.length}}</span>）</b></p>
          <div class="mt10 ml20">
            <div class="bg-muted p10 border-box">
              <button class="btn ml10 btn-highlight" @click="selectBranch_Click()">
                <b>选择机构</b>
              </button>
            </div>
            <div class="border-box mt-1 p10 text-light-muted with-min-h">
              <ul>
                <li v-for="item in editInfo.Branchs">
                  <a href="javascript:;" class="text-del" @click="delBranch_Click(item)">&times;</a> {{item.Name}}
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section class="mt30">
          <p><span class="bg-num">3</span><b class="ml5">关联客户（<span class="text-warning">
            {{computedCustomerSelectedCount}}
          </span>）</b></p>
          <div class="clearfix border-box mt10  ml20 with-min-h" :class="{'left-switcher':editInfo.Branchs.length}">
            <ul class="title">
              <li @click="cTabindex_Click($index)" v-for="item in computedCustomerSelected" class="clearfix item" :class="{on:$index==cTabIndex}">
                <p class="text-ellipsis fl" :title="item.Name">
                  <span class="fr ml5">
                    （{{item.Customers.length}}/{{item.CustomersCount}}）
                  </span> {{item.Name}}
                </p>
              </li>
            </ul>
            <div class="content">
              <label class="checkbox" v-show="editInfo.Branchs.length">
                <input type="checkbox" @change="selectAll_Change($event)" :checked="computedIsAllSelected">全选<span class="icon"></span></label>
              <ul v-for="item in editInfo.Branchs" class="col2 item clearfix" :class="{on:$index==cTabIndex}">
                <li v-for="item2 in item.Customers" class="col-item fl">
                  <label class="checkbox">
                    <input type="checkbox" @change="c_Change($event,item,item2)" :checked="item2.Selected">{{item2.CustomerName}}<span class="icon"></span></label>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </article>
      <p class="text-center mb10">
        <button class="btn btn-primary big" @click="save_Click($event)">提交</button>
      </p>
    </div>
    <branch-list :show.sync="isShowBranchList" :branch-added-list.sync="editInfo.Branchs" @on-add-after="dispatchBranchAdded()"></branch-list>
  </div>
</template>
<script>
/**
 * 业务员添加编辑
 * zhao.liubin@zol.com.cn
 * 2017-04-13
 */
import branchList from 'vues/branchList.vue';
export default {
  data() {
      return {
        APIS: {
          INSERT: '/Api/Branch/SalesmanInsert', //默认添加新数据
          PREVIEW: '/Api/Branch/SalesmanView', //编辑时读取数据
          UPDATE: '/Api/Branch/SalesmanUpdate', //编辑更新时接口
        },
        curAPI: '',
        cTabIndex: 0,
        changeTime: 0,
        customerCount: [],
        isShowBranchList: false,
        dataIn: {
          isFrom2B: false,
          arrBranch: []
        },
        curCode: '', //编辑时，业务员ID
        editInfo: {
          RealName: '',
          Phone: '',
          RecommendCode: '',
          Branchs: []
        }
      }
    },
    components: {
      branchList
    },
    computed: {
      computedCustomerSelected() {
        let arrTemp = [];
        if (this.changeTime != undefined) {
          this.editInfo.Branchs.forEach(item => {
            let objTemp = {};
            objTemp.Name = item.Name;
            objTemp.Id = item.Id;
            objTemp.Customers = item.arrSelectedCustomers;
            objTemp.CustomersCount = item.Customers.length;
            arrTemp.push(objTemp);
          });
        }
        return arrTemp;
      },
      //是否全选
      computedIsAllSelected() {
        if (this.changeTime != undefined) {
          let arrCurBranch = this.editInfo.Branchs[this.cTabIndex];
          if (arrCurBranch.Customers.length && arrCurBranch.arrSelectedCustomers.length == arrCurBranch.Customers.length) {
            return true;
          } else {
            return false;
          }
        }
        return false;
      },
      computedCustomerSelectedCount() {
        let numTemp = 0;
        if (this.changeTime != undefined) {
          this.editInfo.Branchs.forEach(item => {
            numTemp += item.arrSelectedCustomers.length;
          });
        }
        return numTemp;
      }
    },
    methods: {
      initPageData() {
        this.curCode = this.$route.params.bmId || '';
        var me = this;
        this.curAPI = this.APIS.INSERT;
        if (this.curCode) {
          fetchData({
            API: this.APIS.PREVIEW,
            para: {
              id: this.curCode
            },
            callback(data) {
              // console.log(data);
              me.curAPI = me.APIS.UPDATE;
              data.Branchs.forEach(item => {
                item.arrSelectedCustomers = [];
                item.Customers.forEach(item2 => {
                  item2.Selected && item.arrSelectedCustomers.push(item2);
                })
              })
              me.editInfo = data;
            }
          })
        } else {
          this.initData();
        }
      },
      //生成大写字母前缀
      createPrefix() {
        return String.fromCharCode(parseInt(Math.random() * 25 + 65))
      },
      //生成推荐码
      createRecommendCode() {
        let me = this;
        fetchData({
          API: '/Api/Branch/CreateRecode',

          callback(data) {
            me.editInfo.RecommendCode = data.RecommendCode;
          }
        })
      },
      //添加成功后初始数据
      initData() {
        this.editInfo.RealName = '';
        this.editInfo.Phone = '';
        this.editInfo.Address = '';
        this.createRecommendCode();
        this.editInfo.Branchs = [];
      },
      delBranch_Click(item) {
        let me = this;
        if (item.arrSelectedCustomers.length) {
          dialog({
            title: '删除机构',
            width: 200,
            content: '该机构下存在客户，删除时将同时删除关联客户，请确认',
            ok() {
              me.editInfo.Branchs.$remove(item);
            },
            cancel() {

            }
          }).showModal();
        } else {
          this.editInfo.Branchs.$remove(item);
          if (this.editInfo.Branchs.length < 2) {
            this.cTabIndex = 0;
          } else if (this.cTabIndex == this.editInfo.Branchs.length) {
            this.cTabIndex--;
          }
        }
      },
      //选择机构
      selectBranch_Click() {
        this.isShowBranchList = true;
      },
      cTabindex_Click(i) {
        this.cTabIndex = i;
      },

      //全选客户
      selectAll_Change(e) {
        let me = this;
        var $t = $(e.target);
        let arrCurBranch = me.editInfo.Branchs[this.cTabIndex];
        let fnChecked = function(checked) {
          arrCurBranch.Customers.forEach(itemC => {
            if (checked) {
              itemC.Selected = true;
            } else {
              itemC.Selected = false;
            }
          });

          $t.closest('.content').find('.item.on').find(':checkbox').prop('checked', checked);

          arrCurBranch.arrSelectedCustomers = [];
          if (checked) {
            arrCurBranch.arrSelectedCustomers = arrCurBranch.arrSelectedCustomers.concat(arrCurBranch.Customers);
          }
        }
        fnChecked(e.target.checked);
        this.changeTime++;
      },
      c_Change(e, item, item2) {
        if (e.target.checked) {
          item2.Selected = true;
          item.arrSelectedCustomers.push(item2);
        } else {
          item2.Selected = false;
          item.arrSelectedCustomers.$remove(item2);
        }
        this.changeTime++;
      },
      save_Click(e) {
        let me = this;
        var para = {};

        if (!zmm_validator(this.$el)) {
          return;
        }
        if (!this.computedCustomerSelectedCount) {
          showTips('当前关联客户数为零，请检查', 'error');
          return;
        }
        let arrBranchSelected = [];
        this.computedCustomerSelected.forEach(item => {
          if (item.Customers.length) {
            arrBranchSelected.push(item);
          }
        });
        para.RecommendCode = this.editInfo.RecommendCode;
        para.Phone = this.editInfo.Phone;
        para.RealName = this.editInfo.RealName;
        para.Branchs = arrBranchSelected;
        if (this.curCode) {
          para.Id = this.curCode;
        }

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
              name: 'businessmanMNG',
              params: {
                bmmTabIndex: 1
              }
            })
          }
        })
      },
      dispatchBranchAdded() {}
    },
    ready() {
      this.initPageData();
    }
}
</script>
