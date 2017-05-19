<template>
  <div>
    <div class="search clearfix mt20">
      <a href="/dist/files/DATA_INIT_TEMPLATE_OWNLIB.xlsx" class="fr highlight align-btn">下载模板</a>
      <span class="mr5 required-mark">仓库</span>
      <select v-model="dataOut.search.StoreId" @change="sotre_Change()">
        <option value="">请选择</option>
        <option v-for="item of dataIn.arrStores" :value="item.Id">{{item.Name}}</option>
      </select>
      <button v-if="!dataOut.search.StoreId" @click="showTipsNoStore()" class="btn btn-default ml10">
        导入
      </button>
      <button v-else class="btn btn-default ml10 btn-import" @click="import_Click()">
        导入
      </button>
      <input type="file" class="hidden import-sn">
    </div>
    <table class="table text-center table-hover table-odd table-bordered datalist">
      <thead>
        <tr>
          <th>商品编码</th>
          <th>商品名称</th>
          <th>数量</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            <p class="text-nowrap">{{item.ProId}}</p>
          </td>
          <td>
            {{item.ProName}}
          </td>
          <td>
            <p class="text-nowrap"><a href="javascript:;" class="highlight" @click="checkSN_Click(item.Details,item.ProName)">{{item.ProCount}}</a></p>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="text-center">
      <button class="btn big btn-primary mt10" :class="{'btn-disabled':!dataOut.search.StoreId||dataIn.dataTable.length==0}" @click="submit_Click()">
        确认提交
      </button>
    </div>
    <check-sn :show.sync="isShowCheckSn" :pro-name="curProName" :arr-detail="curArrDetail"></check-sn>
  </div>
</template>
<script>
import formDataUpload from 'commonScripts/formDataUpload.js';
import checkSn from './../popup/checkSN.vue';
export default {
  props: {
    refresh: false
  },
  data() {
    return {
      pageindex: 1,
      isShowCheckSn: false,
      curProName: '',
      curArrDetail: [],
      dataIn: {
        inited: false,
        SERVER: localStorage.APIServer || window.APISERVER,
        dataTable: [],
        arrStores: []
      },
      dataOut: {
        search: {
          Name: '',
          StoreId: ''
        }
      }
    }
  },
  computed: {},
  components: {
    checkSn
  },
  methods: {
    initPageData(pageindex = 1) {
      this.pageindex = pageindex;
      var me = this;
      var para = this.dataOut.search;
      formDataUpload({
        url: this.dataIn.SERVER + '/Api/Imei/Upload',
        obj: this.$el.querySelector('.import-sn'),
        type: 'xlsx,xls',
        callback(data) {
          let Details = [];
          me.strImeis = '';
          // console.log(data);
          fetchData({
            API: '/Api/Misc/InvInitPre',
            para: {
              StoreId: me.dataOut.search.StoreId,
              files: data.Message
            },
            callback(dataT) {
              me.dataIn.inited = true;
              me.dataIn.dataTable = dataT;
            }
          })
        }
      })
    },
    import_Click() {
      this.$el.querySelector('.import-sn').click();
    },
    checkSN_Click(arrDetail, proName) {
      this.curArrDetail = arrDetail;
      this.curProName = proName;
      this.isShowCheckSn = true;
    },
    showTipsNoStore() {
      showTips('请先选择分仓', 'error');
      return;
    },
    sotre_Change() {
      this.dataIn.dataTable = [];
    },
    getStores() {
      let me = this;
      fetchData({
        API: '/Api/User/Store',
        para: {},
        callback(data) {
          // console.log(data);
          me.dataIn.arrStores = data;
        }
      });
    },
    submit_Click() {
      let me = this;
      dialog({
        title: '提交',
        content: '此操作将更新库存，请确认',
        ok() {
          fetchData({
            API: '/Api/Misc/InvInit',
            para: {
              StoreId: me.dataOut.search.StoreId,
              data: me.dataIn.dataTable
            },
            callback(dataT) {
              me.dataIn.dataTable = [];
              // showTips('更新成功，请至库存分布页面查看');
            }
          })
        },
        cancel() {

        }
      }).showModal();

    }
  },
  ready() {
    this.getStores();
    this.initPageData();
  }
}
</script>
