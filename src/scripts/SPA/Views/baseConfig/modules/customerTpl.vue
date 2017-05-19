<template>
  <div class="main">
    <slot name="title">
      <h2 class="content-title">
        <div class="action">
          <a href="javascript:history.go(-1)" class="item">返回列表</a>
        </div>
        新增客户</h2>
    </slot>
    <div class="content-field">
      <div class="content-large w60p">
        <span class="bg-num" style="margin-left:-25px;">1</span>
        <b class="ml5">基础信息</b>
        <div class="set mt10">
          <dl class="item">
            <dt class="title required-mark">
              客户名称
            </dt>
            <dd class="content">
              <input class="com-ipt large userName" data-validate="required" type="text" maxlength="50" placeholder="请输入客户名称" v-model="dataOut.customerBaseInfo.Name">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title required-mark">
              所属机构
            </dt>
            <dd class="content">
              <input class="com-ipt large" type="text" maxlength="100" placeholder="请选择所属机构" readonly @click.stop="selectBranch_Click" v-model="dataOut.customerBaseInfo.BranchName">
              <input type="hidden" v-model="dataOut.customerBaseInfo.BranchId">
            </dd>
          </dl>
          <dl class="item area-box">
            <dt class="title required-mark">
              区域
            </dt>
            <dd class="content area-box">
              <input class="com-ipt area" data-validate="required  " type="text" maxlength="100" placeholder="请输入区域" v-model="dataOut.customerBaseInfo.Area">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title required-mark">
              地址
            </dt>
            <dd class="content">
              <input class="com-ipt large" data-validate="required" type="text" maxlength="50" placeholder="请输入姓名" style="width:400px;" v-model="dataOut.customerBaseInfo.Address">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title required-mark">
              联系人
            </dt>
            <dd class="content">
              <input class="com-ipt large" data-validate="required" type="text" maxlength="11" placeholder="请输入联系人姓名" v-model="dataOut.customerBaseInfo.Contact">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title required-mark">
              电话
            </dt>
            <dd class="content">
              <input class="com-ipt large" data-validate="required phone" type="text" maxlength="11" placeholder="请输入电话号码" v-model="dataOut.customerBaseInfo.Phone">
            </dd>
          </dl>
        </div>
        <p class="mt30" style="margin-left:-25px;">
          <span class="bg-num">2</span>
          <b class="ml5">收货地址（<span class="text-warning">{{dataOut.customerBaseInfo.Details.length}}</span>）</b>
        </p>
        <div class="mt15" style="border:1px solid #dcdcdc;">
          <div style="background-color:#fdfdfd;padding:11px 20px;">
            <a href="javascript:;" class="font-small highlight" @click.stop="addAddr_Click">+ 新增地址</a>
          </div>
          <div v-for="(index,item) in dataOut.customerBaseInfo.Details" style="padding: 0 15px 10px;margin: 0 15px;" :style="{borderBottom:index!=dataOut.customerBaseInfo.Details.length-1?'1px dashed #e9e9e9':'none'}">
            <div class="set" style="position:relative;">
              <div class="text-right">
                <span v-if="dataOut.customerBaseInfo.Details.length>1" title="删除" style="cursor:pointer;font-size:18px;" @click.stop="delAddr_Click(item,index)">&times;</span>
              </div>
              <dl class="item">
                <dt class="title required-mark">收货人</dt>
                <dd class="content">
                  <input type="text" data-validate="required" class="com-ipt large" maxlength="100" placeholder="请输入收货人姓名" v-model="item.Receiver">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">电话</dt>
                <dd class="content">
                  <input class="com-ipt large" data-validate="phone" type="text" maxlength="11" placeholder="请输入电话号码" v-model="item.Phone">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">地址</dt>
                <dd class="content">
                  <input class="com-ipt large" data-validate="required  down" type="text" maxlength="100" style="width:90%" placeholder="请输入收货人地址" v-model="item.AddressDetail">
                </dd>
              </dl>
              <dl class="item" style="padding-top:0;">
                <dt class="title" style="visibility:hidden;">地址</dt>
                <dd class="content">
                  <label class="checkbox" style="margin:0">
                    <input type="checkbox" v-model="item.isChecked" @change="defaultAddr_Change(item)">
                    <span class="icon"></span>
                    <span class="text"> 默认地址</span>
                  </label>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="audit-list show" v-if="dataIn.StateFlow.length>0">
          <div class="title">
            记录：
          </div>
          <ul class="flow-list">
            <li class="item" v-for="item in dataIn.StateFlow">
              <span class="cell">
                {{item.ModifyType}}
              </span>
              <span class="cell">
                {{item.UserName}}
              </span>
              <span class="cell">
                {{item.DateAdded|datetime}}
              </span>
              <span class="cell">
                {{item.ModifyContent}}
              </span>
            </li>
          </ul>
        </div>
      </div>
  
      <div class="text-center">
        <button class="btn btn-primary big" @click="save_Click">提交</button>
      </div>
    </div>
    <select-branch :show.sync="showBranch" @after-select-branch="afterSelectBranch"></select-branch>
  </div>
</template>
<script>
let addrTemplate = () => {
  return JSON.parse(JSON.stringify({
    AddressDetail: '',
    Receiver: '',
    Phone: '',
    IsDefault: 0,
    isChecked: false//自定义属性
  }));
};
import selectBranch from '../popup/selectBranch.vue';
export default {
  components: {
    selectBranch
  },
  data() {
    return {
      showBranch: false,
      id: '',//修改客户时的那个id
      dataIn: {
        StateFlow: []
      },
      dataOut: {
        customerBaseInfo: {
          Name: '',
          BranchId: '',
          BranchName: '',
          Area: '',
          AreaName: '',
          Address: '',
          Contact: '',
          Phone: '',
          Details: [{
            AddressDetail: '',
            Receiver: '',
            Phone: '',
            IsDefault: 0,
            isChecked: false//自定义属性
          }]
        }
      }
    }
  },
  methods: {
    //获取区域名称，因为区域选择插件没有给出区域名称，所以这里通过jQuery来简单获取
    getAreaName() {
      return $(this.$el).find('dd.area-box > .area > .show').text()
    },
    afterSelectBranch(item) {
      this.dataOut.customerBaseInfo.BranchId = item.Id;
      this.dataOut.customerBaseInfo.BranchName = item.Name;
    },
    //选择机构
    selectBranch_Click() {
      this.showBranch = true;
    },
    //删除一条地址
    delAddr_Click(item,index) {
      dialog({
        title:'删除地址',
        content:`确认要删除该收货地址吗？`,
        ok:()=>{
          fetchData({
            API:'api/Customer/AddressDelete',
            para:{Id:item.Id},
            callback:()=>{
              this.dataOut.customerBaseInfo.Details.splice(index, 1);
            }
          })
        }
      }).showModal()
    },
    //新增地址
    addAddr_Click() {
      this.dataOut.customerBaseInfo.Details.push(addrTemplate());
    },
    //设置默认收货地址
    defaultAddr_Change(item) {
      const isChecked = item.isChecked;
      this.dataOut.customerBaseInfo.Details.forEach((el) => {
        el.isChecked = false;
        el.IsDefault = 0;
      });
      this.$nextTick(() => {
        if (isChecked) {
          item.IsDefault = 1;
          item.isChecked = true;
        } else {
          item.IsDefault = 0;
          item.isChecked = false;
        }
      })
    },
    initAreaSelector() {
      this.$el && areaSelector(this.$el.querySelector('.area'));
    },
    getCustomerById() {
      fetchData({
        API: '/Api/Customer/CustomerView',
        para: { Id: this.id },
        callback: data => {
          if (data.Details && data.Details.length) {
            data.Details.forEach(item => {
              item.isChecked = item.IsDefault == 1;
            })
          }
          let info = this.dataOut.customerBaseInfo
          for (let k in info) {
            if (k === 'Details' && data.Details.length === 0) {
              //
            } else {

              info[k] = data[k];
            }

          }
          setTimeout(this.initAreaSelector, 10);
        }
      })
    },
    save_Click() {
      if (!zmm_validator(this.$el)) {
        return;
      }
      // 针对所属机构要单独验证，
      if (this.dataOut.customerBaseInfo.BranchId == '') {
        showTips('请选择所属机构！', 'error');
        return;
      }
      this.dataOut.customerBaseInfo.AreaName = this.getAreaName();
      let para = JSON.parse(JSON.stringify(this.dataOut.customerBaseInfo))
      para.Details.forEach(item => {
        delete item.isChecked
      });
      if (this.id !== '' && this.id!==undefined) {
        para.Id = this.id;
      }
      fetchData({
        api: (this.id !== '' && this.id!==undefined) ? '/Api/Customer/Update' : '/Api/Customer/Insert',
        para,
        callback: data => {
          setTimeout(() => {
            this.$router.go({ name: 'customerList' })
          }, 1000)
        }
      })
    },
    getFlowData() {
      fetchData({
        API: '/Api/Customer/ModifyHistoryList',
        para: { CustomerId: this.id },
        callback: data => {
          this.dataIn.StateFlow = data.Details
        }
      })
    }
  },
  ready() {
    this.initAreaSelector();
  },
  created() {
    this.id = this.$route.query.id;
  },
  watch: {
    id(newValue) { this.getCustomerById(); this.getFlowData() }
  }
}
</script>