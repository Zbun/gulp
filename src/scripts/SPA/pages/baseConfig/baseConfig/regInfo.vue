<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="data-content">
        <div class="clearfix align-btn">
          <span class="crumbs">
            <a href="javascript:;" @click="onCancel_Click()"> 注册信息</a>
          </span>
        </div>
        <div class="two-column-view">
          <div class="item">
            <h2 class="title">基本信息</h2>
            <div class="content">
              <div class="set two-line w9em">
                <dl class="item">
                  <dt class="title">
                    联系人姓名
                  </dt>
                  <dd class="content">
                    <span v-if="editItem.SupplierModel.EntryType==3"> {{editItem.SupplierModel.LegalPerson}}</span>
                    <span v-else>
                      {{editItem.RealName}}
                    </span>
                  </dd>
                </dl>
                <dl class="item" v-if="editItem.SupplierModel.EntryType!=3">
                  <dt class="title">
                    手机号
                  </dt>
                  <dd class="content">
                    {{editItem.Phone}}
                  </dd>
                </dl>
                <dl class="item" v-if="editItem.SupplierModel.EntryType==3">
                  <dt class="title">
                    身份证号
                  </dt>
                  <dd class="content">
                    {{editItem.SupplierModel.LegalPersonIDNum}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    {{editItem.SupplierModel.EntryType==3?'店铺':'企业'}}名称
                  </dt>
                  <dd class="content">
                    {{editItem.SupplierModel.CompanyName}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    类型
                  </dt>
                  <dd class="content">
                    {{editItem.SupplierModel.EntryTypeDesc}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    注册资金
                  </dt>
                  <dd class="content">
                    {{editItem.SupplierModel.RegisteredCapital}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    店铺属性
                  </dt>
                  <dd class="content">

                    {{editItem.SupplierModel.HuiShopAttributeName}}

                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    店铺归属地
                  </dt>
                  <dd class="content">
                    {{editItem.SupplierModel.AreaName1}}-{{editItem.SupplierModel.AreaName2}}-{{editItem.SupplierModel.AreaName3}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    详细地址
                  </dt>
                  <dd class="content">
                    {{editItem.SupplierModel.CompanyAddress}}
                  </dd>
                </dl>
                <dl class="item" v-if="editItem.SupplierModel.EntryType!=3">
                  <dt class="title">
                    经营范围
                  </dt>
                  <dd class="content">
                    {{editItem.SupplierModel.ScopeOfOperation}}
                  </dd>
                </dl>

              </div>
            </div>
          </div>
          <div class="item" v-if="editItem.SupplierModel.EntryType!=3">
            <h2 class="title">企业认证资料</h2>
            <div class="content">
              <div class="set two-line w9em">
                <dl class="item">
                  <dt class="title">
                    法人姓名
                  </dt>
                  <dd class="content">
                    {{editItem.SupplierModel.LegalPerson}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    身份证
                  </dt>
                  <dd class="content">
                    {{editItem.SupplierModel.LegalPersonIDNum}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    法人手机号码
                  </dt>
                  <dd class="content">
                    {{editItem.SupplierModel.LegalPersonPhone}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    是否三证合一
                  </dt>
                  <dd class="content">
                    {{editItem.SupplierModel.ThreeInOne==1? '是' : '否'}}
                  </dd>
                </dl>
              </div>
              <div class="set w9em">
                <dl class="item">
                  <dt class="title">
                    营业执照证件
                  </dt>
                  <dd class="content">
                    <img :src="editItem.SupplierModel.LicenseImage" alt="" class="img-thumb">
                    <a href="javascript:;" class="highlight mr10" @click="imgProp(editItem.SupplierModel.LicenseImage)">查看</a>
                    营业执照号：{{editItem.SupplierModel.LicenseNum}}
                    <span class="mr10">有效期：{{editItem.SupplierModel.LicenseEndDateTime|datetime}}</span>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    开户许可证件
                  </dt>
                  <dd class="content">
                    <img :src="editItem.SupplierModel.AccountOpeningPermitImage" alt="" class="img-thumb">
                    <a href="javascript:;" class="highlight mr10" @click="imgProp(editItem.SupplierModel.AccountOpeningPermitImage)">查看</a>
                    开发许可证核准号：{{editItem.SupplierModel.AccountOpeningPermitNum}}
                  </dd>
                </dl>
                <dl class="item" v-show="editItem.SupplierModel.ThreeInOne==0">
                  <dt class="title">
                    组织机构代码证
                  </dt>
                  <dd class="content">
                    <img :src="editItem.SupplierModel.OrganizationImage" alt="" class="img-thumb">
                    <a href="javascript:;" class="highlight mr10" @click="imgProp(editItem.SupplierModel.OrganizationImage)">查看</a>
                    组织机构代码证：{{editItem.SupplierModel.OrganizationNum}}
                    <span class="mr10">有效期：{{editItem.SupplierModel.OrganizationEndDateTime|datetime}}</span>
                  </dd>
                </dl>
                <dl class="item" v-show="editItem.ThreeInOne==0">
                  <dt class="title">
                    税务登记证
                  </dt>
                  <dd class="content">
                    <img :src="editItem.TaxImage" alt="" class="img-thumb">
                    <a href="javascript:;" class="highlight mr10" @click="imgProp(editItem.TaxImage)">查看</a>
                    税务登记证： {{editItem.TaxNum}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    身份证
                  </dt>
                  <dd class="content">
                    <img :src="editItem.SupplierModel.FarenZImage" alt="" class="img-thumb">
                    <a href="javascript:;" class="highlight mr10" @click="imgProp(editItem.SupplierModel.FarenZImage)">查看</a>
                    <img :src="editItem.SupplierModel.FarenFImage" alt="" class="img-thumb">
                    <a href="javascript:;" class="highlight mr10" @click="imgProp(editItem.SupplierModel.FarenFImage)">查看</a>
                    有效期： {{editItem.SupplierModel.LegalPersonEndDateTime|datetime}}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="item">
            <h2 class="title">渠道设置</h2>
            <div class="content">
              <table class="table table-bordered-all mt10  table-fixed">
                <thead>
                  <tr>
                    <th style="width:20%">销售分类</th>
                    <th style="width:20%">抽佣比</th>
                    <th>销售区域</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in editItem.SaleCategories">
                    <td>{{item.Category}}</td>
                    <td>{{item.CommissionRatio}}</td>
                    <td :rowspan="editItem.SaleCategories.length" v-if="index===0">
                      <div v-for="item in editItem.SaleAreas">{{item}}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="item">
            <h2 class="title">服务内容</h2>
            <div class="content">
              <table class="table table-bordered-all mt10  table-fixed">
                <thead>
                  <tr>
                    <th>属性</th>
                    <th>缴费时间</th>
                    <th>有效期</th>
                    <th>系统服务费用(元/年)</th>
                    <th>保证金</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in editItem.ServicePeriod">
                    <td>{{item.ServiceInfo}}</td>
                    <td>{{item.DateOfPaid |datetime}}</td>
                    <td>
                      {{item.ServiceEndDateTime |datetime}}
                    </td>
                    <td>
                      {{item.PlatformServiceFee}}
                    </td>
                    <td>
                      {{item.BondMoney}}

                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="mt20">账号状态:正常
                <a href="" class="highlight ml10">我要续费</a>
                <span class="ml20">入驻协议
                  <a href="javascript:;" @click="hmmrzs" class="highlight ml10">慧买卖入驻商协议</a>
                  <a href="javascript:;" @click="khxy" class="highlight ml10">支付开户协议</a>
                </span>
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
    <div class="popup" v-show="isShowKhPop">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>支付开户协议</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <agree-ment :content.sync="Content"></agree-ment>
          </div>
        </div>
      </div>
    </div>
    <div class="popup" v-show="isShowRzsPop">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>慧买卖入驻商协议</h2>
        <div class="body">
          <div class="content" style="width:600px">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import agreeMent from "pages/agreement.vue";
export default {
  data() {
    return {
      isShowImgPop: false,
      isShowRzsPop: false,
      isShowKhPop: false,
      AptitudePic: "",
      editItem: {
        ServicePeriodModel: {},
        UserModel: {},
        SupplierModel: {}
      },
      objCurAreaItem: {}, //编辑当前区域对象
      getCategoryList: {}
    };
  },
  components: { agreeMent },
  methods: {
    initPageData() {
      fetchData({
        API: "api/Supplier/SupplierProfileInfo",
        callback: data => {
          this.editItem = data;
        }
      });
    },

    getCategoryChannelList() {
      fetchData({
        API: "api/UserMng/GetCategoryChannelList",
        para: {
          UserSN: this.UserSN
        },
        callback: data => {
          this.getCategoryList = data;
        }
      });
    },
    imgProp(item) {
      this.AptitudePic = item;
      this.isShowImgPop = true;
    },
    hmmrzs() {
      this.isShowRzsPop = true;
    },
    khxy() {
      this.isShowKhPop = true;
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