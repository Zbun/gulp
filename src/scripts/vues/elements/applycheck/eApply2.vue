<template>
  <div id="login-box" v-show="true">
    <section class="content">
      <form class="form-login" onsubmit="return false;">
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
        <div>入驻类型
          <label class="radio">
            <input type="radio" name="iftype" id="" value="1" v-model="addItem.EntryType">
            <span class="icon"></span>企业</label>
          <label class="radio">
            <input type="radio" name="iftype" id="" value="2" v-model="addItem.EntryType">
            <span class="icon"></span>个体户</label>
        </div>
        <div>
          <input type="text" class="com-ipt large userName" placeholder="请务必正确填写营业执照对应的企业名称" data-validate="required" v-model="addItem.regCompanyName" />
        </div>
        <div>
          <input type="text" class="com-ipt large email" placeholder="请输入注册资本" data-validate="required" v-model="addItem.regCapital" />
        </div>
        <div>是否交过定金
          <label class="radio">
            <input type="radio" name="ifdj" id="" value="1" v-model="addItem.IsPrePaid">
            <span class="icon"></span>是</label>
          <label class="radio">
            <input type="radio" name="ifdj" id="" value="0" v-model="addItem.IsPrePaid">
            <span class="icon"></span>否</label>
        </div>
        <div>
          <input type="text" class="com-ipt large tel" placeholder="请输入法人代表姓名" data-validate="required" v-model="addItem.regName" />
        </div>
        <div>
          <input type="text" class="com-ipt large" placeholder="请输入法人代表手机号" data-validate="required phone" v-model="addItem.regTel" />
        </div>
        <div>
          <input type="text" class="com-ipt large" placeholder="请输入法人身份证号" data-validate="required" v-model="addItem.regId" />
        </div>
        <div>
          <area-box :area-code.sync="addItem.AreaCode3" :area-codes="addItem.AreaCode1+','+addItem.AreaCode2+','+addItem.AreaCode3"></area-box>
        </div>
        <div>
          <textarea type="text" class="com-ipt large" placeholder="请输入详细地址" data-validate="required" v-model="addItem.regAddress" />
        </div>
        <div class="login-tips text-left" v-show="isError">
          <i class="fa fa-info-circle text-danger"></i>
          <span class="text-danger">{{errorMessage}}</span>
        </div>
        <button class="btn btn-primary block" type="submit" @click="onSubmit_Click($event)">
          下一步
        </button>
      </form>
    </section>
    <div class="text-center b-fixed-footer">
      © 2000 - 2018 huimaimai.com 版权所有
    </div>
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

      profileStatus: "2",
      addItem: {
        // JdhIsOpen: "1",
        HmmIsOpen: "1",
        EntryType: "1",
        IsPrePaid: "0",
        regCompanyName: "",
        regName: "",
        regCapital: ""
      },
      arrCurAreas: []
    };
  },
  components: { areaBox },
  computed: {
    computedUserInfo() {
      return localStorage._LOGIN_USERINFO ?
        JSON.parse(localStorage._LOGIN_USERINFO) :
        {};
    }
  },
  methods: {
    getParams() {
      // 取到路由带过来的参数
      this.routerParams = this.$route.query.UserSN;
      this.UserType = this.$route.query.UserType;
      if (this.routerParams) {} else {
        this.$router.push({
          path: "1"
        });
      }
    },
    initpageData() {
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
            // this.editItem.JdhIsOpen=
            this.addItem.regCompanyName = data.CompanyName;
            this.addItem.regName = data.LegalPerson;
            this.addItem.regCapital = data.RegisteredCapital;
            this.addItem.regTel = data.LegalPersonPhone;
            this.addItem.regId = data.LegalPersonIDNum;
            this.addItem.regAddress = data.CompanyAddress2;
          },
          errorCallback() {}
        });
      }
    },
    onSelectType(data) {
      this.AreaList = data;
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
      } else if (regCard.test(this.addItem.regId) === false) {
        showTips("请输入正确的身份证号", "error");
        return;
      }
      let para = {};
      para = this.addItem;
      // para.JdhIsOpen = para.JdhIsOpen - 0;
      para.HmmIsOpen = para.HmmIsOpen - 0;
      para.UserSN = this.routerParams;

      para.profileStatus = this.profileStatus;
      fetchData({
        API: "api/UserMng/SupplierAddOrUpdate",
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
    }
  },
  created() {
    this.getParams();
    this.initpageData();
  }
};
</script>