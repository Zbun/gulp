<template>
  <div id="login-box" v-show="true">
    <section class="content">
      <form class="form-login" onsubmit="return false;">
        <div class="item">
          入驻平台
          <label class="checkbox ml10">
            <input type="checkbox" id="1" value="1" v-model="addItem.join2Hmm">
            <span class="icon"></span>慧买卖</label>
          <!-- <label class="checkbox">
            <input type="checkbox" value="1" v-model="addItem.join2Jdh" id="2">
            <span class="icon"></span>家电汇</label> -->
        </div>
        <div>
          <input type="text" class="com-ipt large userName" placeholder="请输入商铺名称" data-validate="required" v-model="addItem.ShopName" />
        </div>
        <div>
          <input type="text" class="com-ipt large" placeholder="请输入法人身份证号" data-validate="required" v-model="addItem.idNum" />
        </div>
        <div>
          <area-box :area-code.sync="addItem.AreaCode3" :area-code0.sync="addItem.areaCode1" :area-code1.sync="addItem.areaCode2" :area-codes="addItem.AreaCode1+','+addItem.AreaCode2+','+addItem.AreaCode3"></area-box>
        </div>
        <div>
          <textarea type="text" class="com-ipt large" placeholder="请输入详细地址" data-validate="required" v-model="addItem.address" />
        </div>
        <button class="btn btn-primary block mt20" type="submit" @click="onSubmit_Click($event)">
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
      AuthCode: "",
      step: null,
      addItem: {
        join2Hmm: "1",
        // join2Jdh: "1",
        ShopName: ""
      }
    };
  },
  components: { areaBox },
  methods: {
    getParams() {
      // 取到路由带过来的参数
      this.routerParams = this.$route.query.UserSN;
      this.UserType = this.$route.query.UserType;
      this.AuthCode = this.$route.query.AuthCode;
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
            this.addItem.join2Hmm = data.HmmIsOpen;
            // this.addItem.join2Jdh = data.JdhIsOpen;
            this.addItem.idNum = data.LegalPersonIDNum;
            this.addItem.address = data.ShopAddress;
          },
          errorCallback() {}
        });
      }
    },
    onSubmit_Click() {
      var regCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!zmm_validator(this.$el)) {
        return;
      } else if (this.addItem.join2Hmm == "" && this.addItem.join2Jdh == "") {
        showTips("请必须选择至少一位的入驻平台", "error");
        return;
      } else if (regCard.test(this.addItem.idNum) === false) {
        showTips("请输入正确的身份证号", "error");
        return;
      }
      let para = {};
      para = this.addItem;
      para.userSn = this.routerParams;
      para.authCode = this.AuthCode;
      para.join2Hmm = this.addItem.join2Hmm - 0;
      // para.join2Jdh = this.addItem.join2Jdh - 0;
      fetchData({
        API: "api/UserMng/JoinByPersonal_Step2",
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
    this.initPage();
  }
};
</script>