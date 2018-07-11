<template>
  <div id="login-box" v-show="true">
    <section class="content">
      <form class="form-login" onsubmit="return false;">
        <div>入驻类型
          <label class="radio">
            <input type="radio" name="ifdj" id="" value="1" v-model="addItem.EntryType">
            <span class="icon"></span>企业</label>
          <label class="radio">
            <input type="radio" name="ifdj" id="" value="2" v-model="addItem.EntryType">
            <span class="icon"></span>个体户</label>
        </div>
        <div>申请注册平台
          <!-- <label class="checkbox ml10">
            <input type="checkbox" id="" value="" v-model="addItem.JdhIsOpen">
            <span class="icon"></span>
            家电汇
          </label> -->
          <label class="checkbox">
            <input type="checkbox" id="" value="" v-model="addItem.HmmIsOpen">
            <span class="icon"></span> 慧买卖
          </label>
        </div>
        <div>
          <input type="text" class="com-ipt large userName" placeholder="请务必正确填写营业执照对应的企业名称" data-validate="required" v-model="addItem.CompanyName" />
        </div>
        <div>
          <input type="text" class="com-ipt large email" placeholder="请输入注册资本" data-validate="required" v-model="addItem.RegisteredCapital" />
        </div>
        <div>
          <input type="text" class="com-ipt large tel" placeholder="请输入法人代表姓名" data-validate="required" v-model="addItem.LegalPerson" />
        </div>
        <div>
          <input type="text" class="com-ipt large" placeholder="请输入法人代表手机号" data-validate="required phone" v-model="addItem.LegalPersonPhone" />
        </div>
        <div>
          <input type="text" class="com-ipt large" placeholder="请输入法人身份证号" data-validate="required" v-model="addItem.LegalPersonIDNum" />
        </div>
        <div>
          <label for="">营业执照所在地区</label>
        </div>
        <div>
          <area-box :area-code.sync="addItem.AreaCode3" :area-codes="addItem.AreaCode1+','+addItem.AreaCode2+','+addItem.AreaCode3"></area-box>
        </div>
        <div>
          <textarea type="text" class="com-ipt large" placeholder="请输入详细地址" data-validate="required" v-model="addItem.Address" />
        </div>
        <div>店铺实际地址是否与营业执照地址相同
          <label class="radio">
            <input type="radio" name="ifdzzx" id="" value="1" v-model="addItem.CompanyShopAddressIsSame">
            <span class="icon"></span>是</label>
          <label class="radio">
            <input type="radio" name="ifdzxt" id="" value="2" v-model="addItem.CompanyShopAddressIsSame">
            <span class="icon"></span>否</label>
        </div>
        <div v-if="addItem.CompanyShopAddressIsSame!=1">
          <label for="">店铺所在地区</label>
        </div>
        <div v-if="addItem.CompanyShopAddressIsSame!=1">
          <area-box :area-code.sync="addItem.ShopAreaCode3" :area-codes="addItem.ShopAreaCode1+','+addItem.ShopAreaCode2+','+addItem.ShopAreaCode3"></area-box>
        </div>
        <div v-if="addItem.CompanyShopAddressIsSame!=1">
          <textarea type="text" class="com-ipt large" placeholder="请输入详细地址" data-validate="required" v-model="addItem.ShopAddress" />
        </div>
        <div>
          店铺属性
          <select class="ml5" v-model="addItem.ShopProperty" data-validate="required">
            <option :value="value.Id" v-for="(value,key) in ShopPropertyList">
              {{value.AttributeName}}
            </option>
          </select>
        </div>
        <div class="login-tips text-left" v-show="isError">
          <i class="fa fa-info-circle text-danger"></i>
          <span class="text-danger">{{errorMessage}}</span>
        </div>
        <button class="btn btn-primary  mt20 block" type="submit" @click="onSubmit_Click($event)">
          下一步
        </button>
      </form>
    </section>
  </div>
</template>
<script>
/**
 * 基础设置-分类管理
 */
import areaBox from "vues/components/tAreaBox.vue";
export default {
  data() {
    return {
      isShowPop: false,
      routerParams: "",
      isEdit: 0,
      step: null,
      ExamineType: 1,
      ShopPropertyList: {},
      addItem: {
        EntryType: "2",
        // JdhIsOpen: "1",
        HmmIsOpen: "1",
        ShopProperty: "1",
        CompanyShopAddressIsSame: "2",
        CompanyName: "",
        RegisteredCapital: "",
        LegalPerson: "",
        LegalPersonPhone: "",
        LegalPersonIDNum: "",
        Address: ""
      }
    };
  },
  components: { areaBox },
  methods: {
    getParams() {
      // 取到路由带过来的参数
      this.routerParams = this.$route.query.UserSN;
      this.UserType = this.$route.query.UserType;
      if (this.routerParams) {
      } else {
        this.$router.push({
          path: "1"
        });
      }
    },
    initPage() {
      if (this.UserType) {
        fetchData({
          API: "api/UserMng/JoinByEnterpriseViewAuthStatus",
          hideOkTips: true,
          para: {
            userSn: this.routerParams,
            userType: this.UserType
          },
          callback: data => {
            this.addItem = data;
            //this.addItem.CompanyShopAddressIsSame=data.IsSameAddress;
            this.addItem.Address = data.CompanyAddress2;
          },
          errorCallback() {}
        });
      }
    },
    onSelectType(data) {
      this.AreaList = data;
    },
    getShopPropertyList() {
      fetchData({
        API: "api/UserMng/GetShopAttributeList",
        para: {
          Kind: 1
        },
        callback: data => {
          this.ShopPropertyList = data;
        }
      });
    },
    uploadOk(data) {
      this.editItem.Logo = data.Data;
    },

    onSubmit_Click() {
      var regCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!zmm_validator(this.$el)) {
        return;
      } else if (this.addItem.JdhIsOpen == 0 && this.addItem.HmmIsOpen == 0) {
        showTips("必须申请一个注册平台", "error");
        return;
      } else if (regCard.test(this.addItem.LegalPersonIDNum) === false) {
        showTips("请输入正确的身份证号", "error");
        return;
      }
      let para = {};
      para = this.addItem;
      // para.JdhIsOpen = para.JdhIsOpen - 0;
      para.HmmIsOpen = para.HmmIsOpen - 0;
      para.ExamineType = this.ExamineType;
      para.UserSN = this.routerParams;
      if (para.CompanyShopAddressIsSame == "1") {
        para.ShopAreaCode3 = para.AreaCode3;
        para.ShopCompanyAddress = para.Address;
      }
      fetchData({
        API: "api/UserMng/RetailerAddOrUpdate",
        para,
        callback: data => {
          this.$router.push({
            path: "3",
            query: {
              UserSN: this.routerParams,
              UserType: this.UserType
            }
          });
        }
      });
    },
    onCancel_Click() {}
  },
  created() {
    this.getParams();
    this.getShopPropertyList();
    this.initPage();
  }
};
</script>