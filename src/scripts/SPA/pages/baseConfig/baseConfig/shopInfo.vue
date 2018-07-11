<template>
  <div class="main">
    <section class="text-center fixed-footer">
      <button class="btn btn-primary large" @click="submit($event)">保存</button>
      <a class="btn  large" v-if="computedIsReturn" href="javascript:history.back();">取消</a>
    </section>
    <div class="content-field">
      <div class="two-column-view mt20">
        <div class="item">
          <div v-if="computedIsReturn">
            <b>
              <a class=" "  href="javascript:history.back();">商铺装修</a>
            </b> > 商铺信息
          </div>
          <h3 class="title" v-else>
            商铺信息
          </h3>
          <div class="content">
            <div class="set w7em">
              <dl class="item">
                <dt class="title required-mark">商铺名称</dt>
                <dd class="content">
                  <input type="search" placeholder="请输入商铺名称" class="com-ipt large xx-large mr10" v-model="objEditInfo.ShopName" data-validate="required"> {{objEditInfo.HuiShopAttributeName}}
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">公司Logo</dt>
                <dd class="content">
                  <upload-file @upload-ok="uploadOk" v-if="!objEditInfo.CompanyLogo"></upload-file>
                  <ul class="upload-img-list" v-else>
                    <li class="item">
                      <sup class="del" @click="delImage"></sup>
                      <img :src="objEditInfo.CompanyLogo" alt="">
                    </li>
                  </ul>
                  <p class="text-muted">
                    图片宽高为160 X 60像素，仅支持jpg、jpeg、gif、png，文件小于800K。
                  </p>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">商铺类型</dt>
                <dd class="content">
                  {{objEditInfo.HuiShopAttributeName}}
                  <!--                   <select>
                    <option value="1">旗舰店</option>
                    <option value="2">会员店</option>
                  </select> -->
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">商铺主营分类</dt>
                <dd class="content">
                  <input type="search" v-model="objEditInfo.ShopCategory" placeholder="请输入主营分类" data-validate="" class="com-ipt large">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">主营品牌</dt>
                <dd class="content">
                  <input type="search" placeholder="请输入主营品牌" data-validate="" v-model="objEditInfo.ShopBrand" class="com-ipt large">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">联系人姓名</dt>
                <dd class="content">
                  <input type="search" placeholder="请输入联系人姓名" data-validate="" v-model="objEditInfo.RealName" class="com-ipt large">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">手机号</dt>
                <dd class="content">
                  <input type="search" placeholder="请输入手机号" data-validate="phone" v-model="objEditInfo.Phone" class="com-ipt large" maxlength="11">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">商铺描述</dt>
                <dd class="content">
                  <textarea rows="5" placeholder="请输入商铺描述" class="block" v-model="objEditInfo.ShopDesc"></textarea>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">地址库维护</dt>
                <dd class="content">
                  <button class="btn" @click="editAddress('')">新增地址</button>
                  <table class="table-bordered table mt10">
                    <thead>
                      <tr>
                        <th>发货地址</th>
                        <th>退货地址</th>
                        <th>联系人</th>
                        <th>手机号码</th>
                        <th>所在地区</th>
                        <th>详细地址</th>
                        <th>邮政编码</th>
                        <th style="width:100px;">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in dataIn.arrAddressList">
                        <td>
                          <label class="radio">
                            <input type="radio" :value="item.Id" v-model="defaultAddr" @change="changeDeaultAddress(item)"><span class="icon"></span>默认</label>
                        </td>
                        <td>
                          <label class="radio">
                            <input type="radio" :value="item.Id" v-model="defaultReturnAddr" @change="changeDeaultAddress(item,1)"><span class="icon"></span>默认</label>
                        </td>
                        <td class="text-nowrap">
                          {{item.Name}}
                        </td>
                        <td class="text-nowrap">
                          {{item.Phone}}
                        </td>
                        <td>
                          {{item.AreaMergerName}}
                        </td>
                        <td>
                          {{item.FullAddressStr}}
                        </td>
                        <td class="text-nowrap">
                          {{item.ZipCode}}
                        </td>
                        <td>
                          <div class="action">
                            <a href="javascript:;" class="item" @click="editAddress(item)">编辑</a>
                            <a href="javascript:;" class="item" @click="delAddress(item)">删除</a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="cancelClick">&times;</a>{{isEditAddr?'编辑':'新增'}}地址信息</h2>
        <div class="body">
          <div class="content" style="width:600px;">
            <div class="set w6em">
              <dl class="item">
                <dt class="title required-mark">
                  联系人姓名
                </dt>
                <dd class="content">
                  <input type="search" placeholder="请输入联系人姓名" data-validate="required" class="com-ipt x-large" maxlength="200" v-model="objAddressInfo.Name">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">
                  联系人电话
                </dt>
                <dd class="content">
                  <input type="search" placeholder="请输入联系人电话" data-validate="required phone" class="com-ipt x-large" maxlength="11" v-model="objAddressInfo.Phone">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">
                  地区
                </dt>
                <dd class="content">
                  <area-box is-required="1" :area-codes="objAddressInfo.AreaCode1+','+objAddressInfo.AreaCode2+','+objAddressInfo.AreaCode3+','+objAddressInfo.AreaCode4" :area-code.sync="objAddressInfo.AreaCode"></area-box>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">
                  详细地址
                </dt>
                <dd class="content">
                  <input type="search" placeholder="请输入详细地址" data-validate="required" class="com-ipt x-large" maxlength="11" v-model="objAddressInfo.DetailsAddress">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  邮政编码
                </dt>
                <dd class="content">
                  <input type="search" placeholder="请输入邮政编码" class="com-ipt x-large" maxlength="11" v-model="objAddressInfo.ZipCode">
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="submitClick($event)">确定</button>
          <button class="btn btn-default" @click="cancelClick">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 赠品添加、编辑模板
 */

import uploadFile from 'vues/components/uploadFile.vue';
import areaBox from 'vues/components/areaBox.vue';
export default {
  components: {
    uploadFile,
    areaBox
  },
  data() {
    return {
      show: false,
      objEditInfo: {
        "ShopName": "",
        "CompanyLogo": "",
        "ShopCategory": "",
        "ShopBrand": "",
        "RealName": "",
        "Phone": "",
        "ShopDesc": "",
      },
      isEditAddr: false,
      defaultAddr: '',
      defaultReturnAddr: '',
      objMetaAddress: {
        "Id": 0,
        "Name": "",
        "Phone": "",
        "ZipCode": "",
        "AreaCode": '',
        "DetailsAddress": "",
      },
      objAddressInfo: {
        "Id": 0,
        "Name": "",
        "Phone": "",
        "ZipCode": "",
        "AreaCode": '',
        "DetailsAddress": "",
      },
      dataIn: {
        arrAddressList: [],
      },
    }
  },
  computed: {
    computedIsReturn() {
      return this.$route.query.isReturn == 1;
    }
  },
  methods: {
    initPageData() {
      fetchData({
        API: '/api/Supplier/SGetShopInfo',
        para: { Id: this.curId },
        callback: data => {
          this.objEditInfo = data;
        }
      })
    },
    uploadOk(data) {
      this.objEditInfo.CompanyLogo = data.Data;
    },
    delImage() {
      this.objEditInfo.CompanyLogo = '';
    },
    getAddressList() {
      fetchData({
        hideLoading: true,
        API: '/api/Misc/AddressList',
        callback: data => {
          data.forEach(item => {
            if (item.IsDefault == 1) {
              this.defaultAddr = item.Id;
            }
            if (item.IsDefaultReturn == 1) {
              this.defaultReturnAddr = item.Id;
            }
          })
          this.dataIn.arrAddressList = data;
        }
      })
    },
    submit(e) {
      if (!zmm_validator(this.$el)) {
        return;
      }
      let para = JSON.parse(JSON.stringify(this.objEditInfo));
      fetchData({
        target: e.target,
        API: '/api/Supplier/SEditShopInfo',
        para,
        callback: data => {}
      })
    },
    changeDeaultAddress(item, isReturn) {
      let API = 1 == isReturn ? '/api/Misc/AddressSetDefaultReturn' : '/api/Misc/AddressSetDefault';
      fetchData({
        hideLoading: true,
        API,
        para: {
          Id: item.Id,
          IsDefault: 1
        },
        callback: () => {
          this.getAddressList();
        }
      })
    },
    editAddress(item) {
      this.isEditAddr = false;
      this.objAddressInfo = JSON.parse(JSON.stringify(this.objMetaAddress));
      if (item) {
        this.isEditAddr = true;
        fetchData({
          API: '/api/Misc/GetAddressInfo',
          hideLoading: true,
          para: {
            Id: item.Id
          },
          callback: data => {
            this.objAddressInfo = data;
          }
        })
      }
      this.show = true;
    },
    delAddress(item) {
      if (item.IsDefault == 1 || item.IsDefaultReturn == 1) {
        showTips('默认地址不能删除，请知悉', 'warning');
        return;
      }
      dialog({
        title: '删除',
        content: `您确定要删除该地址信息吗？`,
        ok: () => {
          fetchData({
            API: '/api/Misc/AddressDelete',
            para: {
              Id: item.Id,
            },
            callback: () => {
              this.getAddressList();
            }
          })
        },
        cancel() {}
      }).showModal();
    },
    submitClick(e) { //保存地址
      if (!zmm_validator(this.$el.querySelector('.popup'))) {
        return;
      }
      if (!this.objAddressInfo.AreaCode) {
        showTips('请选择所在地区', 'warning');
        return;
      }
      let para = JSON.parse(JSON.stringify(this.objAddressInfo));
      fetchData({
        target: e.target,
        API: '/api/Misc/AddressEdit',
        para,
        callback: () => {
          this.getAddressList();
          this.cancelClick();
        }
      })
    },
    cancelClick() {
      this.show = false;
    }
  },
  created() {
    this.initPageData();
    this.getAddressList();
  }
}
</script>