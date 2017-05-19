<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click()">&times;</a>借出串号扫描</h2>
        <div class="body mini">
          <div class="content" style="width:500px">
            <div class="multiply-box">
              <h2 class="title item text-ellipsis text-warning" title="{{proName}}">
                {{proName}}
              </h2>
              <div class="sub-title item">录入串号
                <input autofocus="autofocus" type="text" class="com-ipt sn-in high large" placeholder="请录入串号，回车提交" maxlength="30" v-model="imei" @keyup="snIpt_Keyup($event)"><span class="text-muted ml10">{{imei.length}}</span>
              </div>
              <!--               <ul class="list-box">
                <li class="item" v-for="item in dataIn.snlist">
                  <a href="javascript:;" class="fr text-del ml10 " @click="delImei_Click(item)" title="删除串号">&times;</a>
                  <span class="fr mr10 ml20">{{item.Imei}}</span>
                  <p class="text-ellipsis" :title="item.ProName">{{proName}}</p>
                </li>
              </ul> -->
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-default" @click="onCancel_Click()">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 借机串号扫描弹出层，
 * zhao.liubin@zol.com.cn
 * 2017-01-12
 */
import formDataUpload from 'commonScripts/formDataUpload.js';
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    id: '',
    proName: ''
  },
  data() {
    return {
      curIndex: 0,
      dataIn: {
        datalist: [],
        snlist: [],
        server: window.APISERVER,
        arrImei: []
      },
      imei: '',
      imeiLength: '',
    }
  },
  computed: {},
  methods: {
    initPageData() {
      let me = this;
      this.imei = '';
      this.dataIn.snlist = [];
      setTimeout(function() {
        me.$el.querySelector('.sn-in').focus();
      }, 250);
    },
    snIpt_Keyup(e) {
      let me = this;
      let v = this.imei;
      let regExp = /[^\d]/g;
      if (regExp.test(v)) {
        this.imei = v.replace(regExp, '');
      }
      if (v.length > 0 && 13 == e.keyCode) {
        // this.dataIn.snlist = [];
        // let obj = {};
        // obj.Imei = v;
        // this.dataIn.snlist.push(obj);
        // this.imei = '';
        fetchData({
          api: '/Api/Borrow/Out',
          para: {
            id: this.id,
            imei: this.imei
          },
          callback(data) {
            me.show = false;
            me.$dispatch('on-after-submit');
          },
          errorCallback() {
            me.imei = '';
          }
        })
      }
    },
    delImei_Click(item) {
      this.imei = '';
      this.dataIn.snlist = [];
    },
    onSubmit_Click() {
      let data = this.dataIn.datalist;
      let me = this;
      if (0 == this.dataIn.snlist.length) {
        showTips('请先录入串号', 'error');
        return;
      }
      fetchData({
        api: '/Api/Borrow/Out',
        para: {
          id: this.id,
          imei: this.imei
        },
        callback(data) {
          me.show = false;
          me.$dispatch('on-after-submit');
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    },
  },
  ready() {

  },
  watch: {
    show(newVal) {
      if (newVal) {
        // this.curIndex = 0;
        this.initPageData();
        let me = this;
      }
    }
  }
}
</script>
