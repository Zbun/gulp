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
      <div id="login-box" class="pt20 pb30">
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

            <dl class="item mt20">
              <dt class="title">注册类型</dt>
              <dd class="content">{{editItem.EntryTypeDesc}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">店铺名称</dt>
              <dd class="content">{{editItem.ShopName}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">身份证号</dt>
              <dd class="content">{{editItem.LegalPersonIDNum}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">所在地区</dt>
              <dd class="content">{{editItem.ShopAddress1}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">详细地址</dt>
              <dd class="content">{{editItem.ShopAddress}}</dd>
            </dl>
            <!-- <dl class="item">
              <dt class="title">店铺属性</dt>
              <dd class="content"></dd>
            </dl> -->
            <dl class="item">
              <dt class="title">申请注册平台</dt>
              <dd class="content">
                {{editItem.HmmIsOpen==1?"慧买卖":""}} {{editItem.JdhIsOpen==1?"家电汇":""}}
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">是否交过定金</dt>
              <dd class="content">
                {{editItem.EarnestMoneyPaid==0?"否":"是"}}
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">身份证正面</dt>
              <dd class="content" @click="imgProp(editItem.IdCard1)"><img :src="editItem.IdCard1" alt="" class="img-thumb mr10"></dd>
            </dl>
            <dl class="item">
              <dt class="title">身份证反面</dt>
              <dd class="content" @click="imgProp(editItem.IdCard1)"><img :src="editItem.IdCard2" alt="" class="img-thumb mr10"></dd>
            </dl>

          </div>
        </section>
      </div>
      <div class="text-center no-pass" v-if="editItem.Status ==10 || editItem.Status ==15">
        <h2 class="text-danger">审核不通过</h2>
        <router-link :to="{path:'personReg/2',query:{UserSN:UserSN,UserType:userType}}" class="item btn btn-primary mt10">修改资料</router-link>
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
      isError: false,
      errorMessage: "",
      isShowImgPop: false,
      ok: false,
      UserSN: "",
      userType: "",
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
      this.userType = this.$route.query.userType;
      // this.UserSN="287654645444";
    },
    initPage() {
      fetchData({
        API: "api/UserMng/JoinByEnterpriseViewAuthStatus",
        para: {
          userSn: this.UserSN,
          userType: this.userType
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