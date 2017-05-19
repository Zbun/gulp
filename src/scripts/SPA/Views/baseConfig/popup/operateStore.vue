<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{popupTitle}}分仓</h2>
        <div class="body">
          <div class="content" style="width:650px">
            <p>所属机构：<strong>{{objBranchInfo.Name}} </strong></p>
            <div class="bg-muted p10 set w8em border-box mt10">
              <dl class="item">
                <dt class="title required-mark">
                  分仓名称：
                </dt>
                <dd class="content">
                  <input type="text" placeholder="输入分仓名称" v-model="dataIn.objStore.Name" class="com-ipt large" data-validate="required" maxlength="50">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">
                  分仓类型：
                </dt>
                <dd class="content">
                  <select v-model="dataIn.objStore.StoreType">
                    <option v-for="(key,value) of computedAttributes" :value="key">{{value}}</option>
                  </select>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  分仓属性：
                </dt>
                <dd class="content">
                  <label class="checkbox" v-for="(k,v) in storeAttr">
                    <input type="checkbox" :value="k" v-model="storeattr">
                    <span class="icon"></span>
                    <span class="text">{{v}}</span>
                  </label>
                </dd>
              </dl>
              <dl class="item area-box">
                <dt class="title required-mark">
                  收/发货地址：
                </dt>
                <dd class="content area-box">
                  <input type="text" class="area" data-validate="required" placeholder="选择区域" v-model="dataIn.objStore.Area">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">
                  详细地址：
                </dt>
                <dd class="content">
                  <input type="text" placeholder="输入详细地址" v-model="dataIn.objStore.Address" class="com-ipt x-large" maxlength="150" data-validate="required">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">
                  收/发货人：
                </dt>
                <dd class="content">
                  <input type="text" placeholder="输入收/发货人" v-model="dataIn.objStore.Contact" class="com-ipt" maxlength="150" data-validate="required">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">
                  电话：
                </dt>
                <dd class="content">
                  <input type="text" placeholder="输入电话号码" v-model="dataIn.objStore.Phone" class="com-ipt" maxlength="150" data-validate="required phone">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  身份证：
                </dt>
                <dd class="content">
                  <input type="text" placeholder="输入身份证号" v-model="dataIn.objStore.ContactCard" class="com-ipt" maxlength="150">
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">提交</button>
          <button class="btn btn-default" @click="onCancel_Click">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      show: {
        twoway: true,
        default: false
      },
      objBranchInfo: {},
      curStore: {}
    },
    data() {
      return {
        storeIds: [],
        storeList: [],
        storeattr: [],
        popupTitle: '添加',
        APILIST: {
          INSERT: '/Api/Branch/StoreInsert',
          UPDATE: '/Api/Branch/StoreUpdate'
        },
        dataIn: {
          objStore: {
            BranchId: '',
            Name: '',
            Attributes: 1,
            StoreType: '',
            Area: '',
            Address: '',
            Contact: '',
            Phone: '',
            ContactCard: ''
          }
        }
      }
    },
    components: {},
    computed: {
      computedAttributes() {
        return dictionary.storeType;
      },
      storeAttr() {
        return dictionary.storeAttr;
      }
    },
    methods: {
      initPageData() {
        this.initData();
        setTimeout(this.initAreaSelector, 10);
      },
      initData() {
        this.dataIn.objStore.Name = this.curStore.Name;
        this.dataIn.objStore.Contact = this.curStore.Contact;
        this.dataIn.objStore.Phone = this.curStore.Phone;
        this.dataIn.objStore.ContactCard = this.curStore.ContactCard;
        this.dataIn.objStore.Area = this.curStore.Area;
        this.dataIn.objStore.Address = this.curStore.Address;
        this.dataIn.objStore.StoreType = this.curStore.StoreType || 1;
        if (this.curStore.Attributes) {
          this.storeattr = this.curStore.Attributes.split(',');
        }

        delete this.dataIn.objStore.Id;
      },
      //初始化区域选择
      initAreaSelector() {
        this.$el && areaSelector(this.$el.querySelector('.area'));
      },
      onSubmit_Click() {
        let me = this;
        let API = this.APILIST.UPDATE;
        let para = this.dataIn.objStore;
        para.BranchId = this.objBranchInfo.Id;
        if (!this.curStore.Id) {
          para.BranchCode = createOrderNum.branchCode();
          API = this.APILIST.INSERT;
        } else {
          para.Id = this.curStore.Id;
        }
        if (!zmm_validator(this.$el)) {
          return;
        }
        this.dataIn.objStore.Attributes = this.storeattr.join(',');
        fetchData({
          API,
          para,
          callback() {
            me.show = false;
            this.storeattr = [];
            me.$dispatch('on-after-submit');
          }
        })
      },
      onCancel_Click() {
        this.show = false;
        this.storeattr = [];
      },
    },
    ready() { },
    watch: {
      show(newVal) {
        if (newVal) {
          this.initPageData();
        }
      }
    }
  }

</script>