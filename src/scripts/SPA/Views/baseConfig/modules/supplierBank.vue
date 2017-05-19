<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>银行账户</h2>
        <div class="body">
          <div class="content" style="width:800px">
            <div class="p10">
              <div class="border-box invoices-detail">
                <div class="set w6em">
                  <dl class="item">
                    <dt class="title">供应商：</dt>
                    <dd class="content">{{curItem.Name}}</dd>
                  </dl>
                  <dl class="item">
                    <dt class="title required-mark">
                      账户名称
                    </dt>
                    <dd class="content">
                      <input type="text" data-validate="required" placeholder="请输入账户名称" class="com-ipt x-large" maxlength="50" v-model="editInfo.Bank">
                    </dd>
                  </dl>
                  <dl class="item">
                    <dt class="title required-mark">
                      开户行
                    </dt>
                    <dd class="content">
                      <input type="text" data-validate="required" placeholder="请输入开户行" class="com-ipt x-large" maxlength="50" v-model="editInfo.OpenAt">
                    </dd>
                  </dl>
                  <dl class="item">
                    <dt class="title required-mark">
                      账号
                    </dt>
                    <dd class="content">
                      <input type="text" data-validate="required" placeholder="请输入账户名称" class="com-ipt x-large" maxlength="50" v-model="editInfo.Account">
                    </dd>
                  </dl>
                  <dl class="item">
                    <dt class="title">
                      凭证
                    </dt>
                    <dd class="content">
                      <input type="hidden" v-model="editInfo.Proof">
                      <a :href="computedImgSrc" target="_blank">
                        <img :src="computedImgSrc" alt="" style="max-width:80px;max-height:80px;">
                      </a>
                      <button class="btn btn-default" @click="upload_Click()">
                        上传
                      </button>
                      <input type="file" class="import-sn hidden">
                    </dd>
                  </dl>
                </div>
                <div class="divider-dashed" style="margin:10px 0"></div>
                <div class="set w6em">
                  <dl class="item">
                    <dt class="title">
                      &nbsp;
                    </dt>
                    <dd class="content">
                      <button class="btn btn-primary" @click="save_Click()">保存</button>
                    </dd>
                  </dl>
                </div>
                <div class="table-list">
                  <table class="table table-bordered table-hover text-center">
                    <thead>
                      <tr>
                        <th>账户名称</th>
                        <th>开启行</th>
                        <th>账号</th>
                        <th>凭证</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in bankList">
                        <td>
                          {{item.Bank}}
                        </td>
                        <td>
                          {{item.OpenAt}}
                        </td>
                        <td>
                          {{item.Account}}
                        </td>
                        <td>凭证</td>
                        <td>
                          <div class="action">
                            <a class="item" @click="edit_Click(item)" href="javascript:;">修改</a>
                            <a class="item" @click="del_Click(item)" href="javascript:;">删除</a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import formDataUpload from 'commonScripts/formDataUpload.js';
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    curItem: {}
  },
  data() {
    return {
      dataIn: {
        server: localStorage.APIServer || window.APISERVER,
        imgPath: '',
        imgSrc: '',
      },
      APIS: {
        INSERT: '/Api/Misc/SupplierBankInsert',
        UPDATE: '/Api/Misc/SupplierBankUpdate',
        LIST: '/Api/Misc/SupplierBankList',
        PREVIEW: '/Api/Misc/SupplierBankPreview',
        DELETE: '/Api/Misc/SupplierBankDelete',
      },
      curAPI: '',
      editInfo: {
        Bank: '',
        OpenAt: '',
        Account: '',
        Proof: '',
      },
      bankList: []
    }
  },
  computed: {
    computedImgSrc() {
      let img = '';
      if (this.editInfo.Proof) {
        img = this.dataIn.server + this.editInfo.Proof;
      } else {
        img = '';
      }
      return img;
    }
  },
  components: {},
  methods: {
    initPageData() {
      let me = this;
      this.curAPI = this.APIS.INSERT;
      this.editInfo = {
        Bank: '',
        OpenAt: '',
        Account: '',
        Proof: '',
      };
      this.editInfo.SupplierId = this.curItem.Id;
      this.getBankList();
    },
    getBankList() {
      let me = this;
      fetchData({
        API: this.APIS.LIST,
        para: {
          SupplierId: this.editInfo.SupplierId
        },
        callback(data) {
          me.bankList = data;
        }
      })
    },
    //上传凭证
    upload_Click() {
      this.$el.querySelector('.import-sn').click();
    },
    save_Click() {
      let me = this;
      let para = this.editInfo;
      // console.log(para);
      if (!zmm_validator(this.$el)) {
        return;
      }
      fetchData({
        API: this.curAPI,
        para,
        callback() {
          me.initPageData();
        }
      })
    },
    edit_Click(item) {
      this.editInfo = item;
      this.curAPI = this.APIS.UPDATE;
    },
    del_Click(item) {
      let me = this;
      dialog({
        title: '删除银行账户',
        content: '删除将不可恢复，请确认',
        ok() {
          fetchData({
            API: me.APIS.DELETE,
            para: {
              id: item.Id
            },
            callback() {
              me.bankList.$remove(item);
            }
          })
        },
        cancel() {}
      }).showModal();
    },
    onCancel_Click() {
      this.show = false;
    },

  },
  ready() {},
  watch: {
    show(newVal) {
      let me = this;
      if (newVal) {
        this.initPageData();
        formDataUpload({
          url: this.dataIn.server + 'Api/Misc/UploadImg',
          obj: this.$el.querySelector('.import-sn'),
          type: 'png,jpg,jpeg,gif',
          callback(data) {
            // console.log(data);
            let img = new Image();
            img.src = me.dataIn.server + data.Message;
            img.onload = function() {
              me.editInfo.Proof = data.Message;
            }
          }
        });
      }
    }
  }
}
</script>
