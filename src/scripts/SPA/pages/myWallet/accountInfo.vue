<template>
  <div class="main">
    <div class="text-center fixed-footer">
      <a href="/#/myWallet/index" class="btn btn-default large">返回 </a>
    </div>
    <div class="content-field  clearfix">

      <div class="data-content">
        <div class="two-column-view">
          <div class="item">
            <h2 class="title">个人资料</h2>
            <div class="content">
              <div class="set  w9em">
                <dl class="item">
                  <dt class="title">
                    联系人姓名
                  </dt>
                  <dd class="content">
                    {{editItem.Contact}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    手机号
                  </dt>
                  <dd class="content">
                    {{editItem.Phone}}
                  </dd>
                </dl>
                <dl class="item" v-if="editItem.EntryTypeDesc!='个人'">
                  <dt class="title">
                    电子邮箱
                  </dt>
                  <dd class="content">
                    {{editItem.Email}}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="item">
            <h2 class="title">公司资料</h2>
            <div class="content">
              <div class="set w9em">
                <dl class="item">
                  <dt class="title">
                    入驻类型
                  </dt>
                  <dd class="content">
                    {{editItem.EntryTypeDesc}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    法人代表姓名
                  </dt>
                  <dd class="content">
                    {{editItem.LegalPerson}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    身份证号码
                  </dt>
                  <dd class="content">
                    {{editItem.IDNum}}
                  </dd>
                </dl>
                <dl class="item">

                  <dt class="title" v-if="editItem.EntryTypeDesc!='个人'">
                    注册资本
                  </dt>
                  <dd class="content">
                    {{editItem.RegCaptial}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    公司地址
                  </dt>
                  <dd class="content">
                    {{editItem.CompanyAddress}}
                  </dd>
                </dl>

                <dl class="item" v-if="editItem.EntryTypeDesc!='个人'">
                  <dt class="title">
                    营业执照
                  </dt>
                  <dd class="content">
                    <img :src="editItem.LicenseImg" alt="" class="img-thumb">
                    <a href="javascript:;" class="highlight mr10" @click="imgProp(editItem.LicenseImg)">查看</a>

                  </dd>
                </dl>

                <dl class="item">
                  <dt class="title">
                    身份证正面
                  </dt>
                  <dd class="content">
                    <img :src="editItem.IDCardFront" alt="" class="img-thumb">
                    <a href="javascript:;" class="highlight mr10" @click="imgProp(editItem.IDCardFront)">查看</a>

                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    身份证反面
                  </dt>
                  <dd class="content">
                    <img :src="editItem.IDCardBack" alt="" class="img-thumb">
                    <a href="javascript:;" class="highlight mr10" @click="imgProp(editItem.IDCardBack)">查看</a>

                  </dd>
                </dl>
              </div>

            </div>
          </div>
        </div>
      </div>

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
      isShowImgPop: false,
      AptitudePic: "",
      editItem: {}
    };
  },
  components: {},
  methods: {
    initPageData() {
      fetchData({
        API: "api/Supplier/SupplierAccountProfile",
        callback: data => {
          this.editItem = data;
        }
      });
    },
    imgProp(item) {
      this.AptitudePic = item;
      this.isShowImgPop = true;
    },
    onCancel_Click() {
      this.isShowImgPop = false;
      this.isShowKhPop = false;
      this.isShowRzsPop = false;
    }
  },
  watch: {},
  created() {
    this.initPageData();
  }
};
</script>