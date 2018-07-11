<template>
  <div id="apply-box">
    <header id="header">
      <a href="/" class="logo">
        <img src="/dist/images/logo.png" alt="">
      </a>
      <span>入驻商审核进度</span>
      <div class="action">
        <a href="javascript:;" class="item">已有账号,</a>
        <a href="login.html" class="item highlight" style="color:#0170B7">登录</a>
      </div>
    </header>
    <section class="apply-section audit-progress">
      <div class="h-navbar">
        <section class="progress col4">
          <dl v-for="(item,$index) in items" :class="{'now': $index+1 == step,item}">
            <dt class="bar">
            </dt>
            <dd class="tips">
              {{item.select}}
            </dd>
          </dl>
        </section>
      </div>
      <div id="login-box">
        <section class="content">
          <div class="set w9em">

            <dl class="item mt10">
              <dt class="title">联系人姓名</dt>
              <dd class="content">{{editItem.Contact}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">手机号</dt>
              <dd class="content">{{editItem.Phone}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">邮箱</dt>
              <dd class="content">{{editItem.Email}}</dd>
            </dl>
            <dl class="item mt20">
              <dt class="title">入驻类型</dt>
              <dd class="content">{{editItem.EntryTypeDesc}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">企业名称</dt>
              <dd class="content">{{editItem.CompanyName}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">注册资本</dt>
              <dd class="content">{{editItem.RegisteredCapital}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">法人姓名</dt>
              <dd class="content">{{editItem.LegalPerson}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">法人手机号</dt>
              <dd class="content">{{editItem.LegalPersonPhone}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">身份证</dt>
              <dd class="content">{{editItem.LegalPersonIDNum}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">营业执照所在地址</dt>
              <dd class="content">{{editItem.CompanyAddress1}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">营业执照详细地址</dt>
              <dd class="content">{{editItem.CompanyAddress2}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">店铺属性</dt>
              <dd class="content">
                <span v-if="editItem.ShopProperty==1">旗舰店</span>
                <span v-if="editItem.ShopProperty==2">专营店</span>
                <span v-if="editItem.ShopProperty==3">经销商</span>
                <!-- {{editItem.ShopAttributeName}} -->
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">经营范围</dt>
              <dd class="content">{{editItem.ScopeOfOperation}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">营业执照是否三证合一</dt>
              <dd class="content">
                <span v-if="editItem.ThreeInOne==1">是</span>
                <span v-else>否</span>
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">营业执照证件</dt>
              <dd class="content">
                <img :src="editItem.LicenseImage" alt="" @click="imgProp(editItem.LicenseImage)" class="img-thumb">营业执照号:{{editItem.LicenseNum}} 有效期
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">开户许可证件</dt>
              <dd class="content"><img :src="editItem.AccountOpeningPermitImage" @click="imgProp(editItem.AccountOpeningPermitImage)" alt="" class="img-thumb mr10">开户许可证核准号: {{editItem.AccountOpeningPermitNum}}
              </dd>
            </dl>
            <dl class="item" v-if="editItem.ThreeInOne==0">
              <dt class="title">组织机构代码证</dt>
              <dd class="content"><img :src="editItem.OrganizationImage" alt="" @click="imgProp(editItem.OrganizationImage)" class="img-thumb mr10">组织机构代码号:{{editItem.OrganizationNum}}</dd>
            </dl>
            <dl class="item" v-if="editItem.ThreeInOne==0">
              <dt class="title" v-if="editItem.ThreeInOne==0">税务登记证</dt>
              <dd class="content"><img :src="editItem.TaxImage" alt="" @click="imgProp(editItem.TaxImage)" class="img-thumb mr10">税务登记号:{{editItem.TaxNum}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">身份证</dt>
              <dd class="content"><img :src="editItem.IdCard1" alt="" @click="imgProp(editItem.IdCard1)" class="img-thumb mr10">
                <img :src="editItem.IdCard2" @click="imgProp(editItem.IdCard2)" alt="" class="img-thumb">
              </dd>
            </dl>
          </div>
        </section>
      </div>
      <div class="text-center no-pass" v-if="editItem.Status ==10 || editItem.Status ==15">
        <h2 class="text-danger">审核不通过</h2>
        <p class="mt10">请修改资料后,我们将重新审核</p>
        <router-link :to="{path:'apply/2',query:{UserSN:UserSN,UserType:UserType}}" v-if="editItem.UserType==2&& editItem.EntryType!=3" class="item btn btn-primary mt10">修改资料</router-link>
        <router-link :to="{path:'memberReg/2',query:{UserSN:UserSN,UserType:UserType}}" v-if="editItem.UserType==3&& editItem.EntryType!=3" class="item btn btn-primary mt10">修改资料</router-link>
        <router-link :to="{path:'personReg/2',query:{UserSN:UserSN}}" v-if="editItem.EntryType==3" class="item">修改资料</router-link>
      </div>
      <div class="no-pass" v-if="editItem.Status ==10 || editItem.Status ==15">

        <p class="pb20">驳回原因:{{editItem.RejectDesc}}</p>
      </div>
    </section>
    <div class="text-center b-fixed-footer">
      © 2016 - 2017 家电汇 版权所有
    </div>
    <div class="popup" v-show="isShowImgPop">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>查看</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <img :src="AptitudePic" alt="" width="100%" height="100%" style="padding: 10px;">
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      step: 2,
      isShowImgPop: false,
      isError: false,
      errorMessage: "",
      ok: false,
      UserSN: "",
      items: [
        { select: "提交资料" },
        { select: "客服审核" },
        { select: "完成审核" }
      ],
      editItem: {}
    };
  },
  components: {},
  methods: {
    getParams() {
      this.UserSN = this.$route.query.userSN;
      this.UserType = this.$route.query.userType;
      this.EntryType = this.$route.query.EntryType;
      // this.UserSN = "113143563378";
    },
    initPage() {
      fetchData({
        API: "api/UserMng/JoinByEnterpriseViewAuthStatus",
        para: {
          userSn: this.UserSN,
          userType: this.UserType
        },
        callback: data => {
          this.editItem = data;
        },
        errorCallback() {}
      });
    },
    imgProp(item) {
      this.AptitudePic = item;
      this.isShowImgPop = true;
    },
    onCancel_Click() {
      this.isShowImgPop = false;
    }
  },
  created() {
    this.getParams();
    this.initPage();
  }
};
</script>