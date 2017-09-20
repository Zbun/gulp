<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{showParams.popTitle||'扫描串号'}}</h2>
        <div class="body">
          <div class="content" style="width:1100px">
            <table class="filter" v-if="isDispatch">
              <tbody>
                <tr>
                  <td><span class="mr5">调拨单号：</span>
                    <span class="text-muted ">{{dataList.Code}}</span>
                    </span>
                  </td>
                  <td>
                    <span class="mr5 ml20">调出机构：</span>
                    <span class="text-muted">{{dataList.OutBranchName}}</span>
                  </td>
                  <td>
                    <span class="mr5 ml20">调出仓库：</span>
                    <span class="text-muted" v-if="1==isDispatch">{{dataList.OutStoreName}}</span>
                    <span class="select-box" :class="{disabled:computedCount.IMEIIn>0}" @click="selectStore()" v-else>
                      <input type="text" :title="dataList.OutStoreName" placeholder="选择仓库" readonly v-model="dataList.OutStoreName">
                      <i class="icon" title="点击选择仓库"></i>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>&#12288;<span>经手人：
                      <span class="text-muted">{{dataList.HandlerName}}</span>
                    </span>
                  </td>
                  <td>
                    <span class="mr5 ml20">调入机构：</span>
                    <span class="text-muted">{{dataList.InBranchName}}</span>
                  </td>
                  <td>
                    <span class="mr5 ml20">调入仓库：</span>
                    <span class="text-muted" v-if="0==isDispatch">{{dataList.InStoreName}}</span>
                    <span class="select-box" @click="selectStore()" v-else>
                      <input type="text" :title="dataList.InStoreName" placeholder="选择仓库" readonly v-model="dataList.InStoreName">
                      <i class="icon" title="点击选择仓库"></i>
                    </span>
                  </td>
                  <td>
                    <span class="mr5 ml20">制单时间：</span>
                    <span class="text-muted">
                      {{dataList.DateAdded|datetime}}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="filter" v-else>
              <tbody>
                <tr>
                  <td><span class="mr5">{{showParams.orderName}}单号： </span>
                    <span class="text-muted ">{{dataList.Code}}</span>
                    </span>
                  </td>
                  <td>
                    &#12288;&nbsp;
                    <span class="ml20">
                      经手人：
                      <span class="text-muted">{{dataList.HandlerName}}</span>
                    </span>
                  </td>
                  <td v-if="!showParams.hidePayType">
                    <span class="mr5">结算方式：</span>
                    <span class="text-muted">{{dataList.PayType|payType}}</span>
                  </td>
                  <!--                   <td v-if="showParams.showPrice">
                    <span>{{showParams.strPrice||'单据'}}金额：<span class="text-muted ml5">{{dataList.TotalPrice|currency}}</span></span>
                  </td> -->
                </tr>
                <tr>
                  <td>
                    <span v-if="showParams.customer">&#12288;&#12288;客户：<span class="text-muted ml5">{{dataList.CustomerName}}</span></span>
                    <span v-else>&#12288;供货商： <span class="text-muted ml5">{{dataList.SupplierName}}</span></span>
                  </td>
                  <td>
                    <span class="mr5 ml20 required-mark">{{showParams.btn}}货仓库：</span>
                    <span class="select-box mr20" @click="selectStore()" :class="{disabled:computedCount.IMEIIn>0}">
                      <input type="text" :title="dataList.StoreName" placeholder="选择仓库" readonly v-model="dataList.StoreName">
                      <i class="icon" title="点击选择仓库"></i>
                    </span>
                  </td>
                  <td>
                    <span class="mr5">制单时间：</span>
                    <span class="text-muted">
                      {{dataList.DateAdded|datetime}}
                    </span>
                  </td>
                </tr>
                <tr v-if="showParams.showContact">
                  <td colspan="3">
                    <span class="title">
                    收货信息：
                  </span>
                    <span class="content">
                    <span class="font-small">（收货人）</span> {{dataList.Contact}}
                    <span class="font-small ml30">（电话）</span> {{dataList.Phone}}
                    <span class="font-small ml30">（地址）</span> {{dataList.Address}}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="tab-switcher mt15">
              <div class="title">
                <span class="item" :class="{on:computedIsPureHaveNoImei}">明细</span>
                <span class="item" :class="{on:!computedIsPureHaveNoImei}">串号</span>
              </div>
              <div class="content mt10">
                <div class="item" :class="{on:computedIsPureHaveNoImei}">
                  <table class="table text-center table-bordered mt-1" v-if="1==isDispatch">
                    <thead>
                      <tr>
                        <th>编号</th>
                        <th>品牌</th>
                        <th>名称</th>
                        <th>数量</th>
                        <th>备注</th>
                      </tr>
                    </thead>
                    <tfoot>
                      <tr class="font-small">
                        <td colspan="3" class="text-right"><b class="mr10">总计</b></td>
                        <td>
                          <b>
                           {{computedCount.goods}}
                          </b>
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                    <tbody>
                      <tr v-for="item in dataList.Details">
                        <td class="text-nowrap">
                          {{item.ProId}}
                        </td>
                        <td class="text-nowrap">
                          {{item.CategoryName}}
                        </td>
                        <td class="text-left">
                          {{item.ProName}}
                          <span class="tooltips-i tooltips-l ml5" v-if="item.HaveImei==0">无串号
                        </span>
                        </td>
                        <td class="text-nowrap">
                          {{item.ProCount}}
                        </td>
                        <td>
                          {{item.Description}}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="table text-center table-bordered" v-else>
                    <thead>
                      <tr>
                        <th>编号</th>
                        <th>品牌</th>
                        <th>名称</th>
                        <th>数量</th>
                        <th>已{{showParams.btn}}</th>
                        <th>待{{showParams.btn}}</th>
                        <th style="width:96px;">本次{{showParams.btn}}</th>
                        <th>备注</th>
                      </tr>
                    </thead>
                    <tfoot>
                      <tr class="font-small">
                        <td colspan="3" class="text-right"><b class="mr10">总计</b></td>
                        <td>
                          <b>
                           {{computedCount.goods}}
                          </b>
                        </td>
                        <td>
                          <b>
                           {{computedCount.countIn}}
                          </b>
                        </td>
                        <td>
                          <b>
                           {{computedCount.countTo}}
                          </b>
                        </td>
                        <td><b>{{computedCount.curCountIn}}</b></td>
                        <td></td>
                      </tr>
                    </tfoot>
                    <tbody>
                      <tr v-for="item in dataIn.dataProsList">
                        <td class="text-nowrap">
                          {{item.ProId}}
                        </td>
                        <td class="text-nowrap">
                          {{item.CategoryName}}
                        </td>
                        <td class="text-left">
                          {{item.ProName}}
                          <span class="tooltips-i tooltips-l ml5" v-if="item.HaveImei==0">无串号
                        </span>
                        </td>
                        <td class="text-nowrap">
                          {{item.ProCount}}
                        </td>
                        <td class="text-nowrap">
                          {{item.ProCount1}}
                        </td>
                        <td class="text-nowrap">
                          {{item.ProCount-item.ProCount1}}
                        </td>
                        <td>
                          <input type="text" placeholder="输入数量" @blur="proCountCurIn_Blur(item)" v-if="0==item.HaveImei" v-model="item.ProCountCurIn|posNumberInNotRequired" class="com-ipt x-small">
                          <span v-else>{{item.ProCountCurIn}}</span>
                        </td>
                        <td>
                          {{item.Description}}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="item" :class="{on:!computedIsPureHaveNoImei}">
                  <div class="bg-muted clearfix border-box p15 font-small text-muted-light" v-if="1!=isDispatch">
                    <span class="fr">
                      <span v-if="showParams.autoMatch==1">
                                              <label class="font-small mr30">输入串号：
                        <input type="search" v-model="preferenceImei" :readonly="computedCount.IMEIIn==computedCount.IMEIShouldBeIn"  placeholder="输入串号自动匹配"  @keyup.enter="verifyImei_Keyup" style="margin:-9px 0" data-imei>
                      </label>
                      <label class="radio font-small">
                        <input type="radio" name="standard" v-model="standard" value="1">
                        <span class="icon"></span>1机1串</label> <span class="m20">|</span>
                    </span>
                    <template v-if="showParams.autoMatch!=1&&isDispatch==undefined">
                      <label class="radio font-small" v-for="n in 3">
                        <input type="radio" name="standard" v-model="standard" :value="n+1"><span class="icon"></span>1机{{n+1}}串</label>
                      <span class="m20">|</span>
                    </template>
                    <a href="/dist/files/SN_TEMPLATE.xlsx" class="highlight mr10" v-if="showPrams.autoMatch==1" :class="{disabled:isNotBeImported}">下载模板</a>
                    <a href="javascript:;" class="highlight mr10" @click="download_Click()" v-else :class="{disabled:isNotBeImported}">下载模板</a>
                    <a href="javascript:;" class="highlight" :class="{disabled:isNotBeImported}" @click="export_Click()">批量导入</a>
                    <input type="file" class="import-sn hidden">
                    </span>
                    <a href="javascript:;" class="ml20" :class="{disabled:arrChkItem.length==0}" @click="delImei_Click(0)">清除</a>
                    <!-- <a href="javascript:;" class="ml20" @click="delImei_Click(1)">清除全部</a> -->
                  </div>
                  <div class="mt-1" style="max-height:330px; overflow-x:hidden;">
                    <table class="table table-bordered text-center">
                      <thead>
                        <tr>
                          <th style="width:30px" v-if="1!=isDispatch">
                            <label class="checkbox">
                              <input type="checkbox" @change="all_Change($event)" :checked="computedIsALlChecked">
                              <span class="icon"></span>
                            </label>
                          </th>
                          <th style="width:90px;">品牌</th>
                          <th>名称</th>
                          <th v-for="n in parseInt(standard)" :colspan="0==n?2:1">
                            串码{{n+1}}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <template v-for="item in dataIn.dataImeiList">
                          <tr v-for="(i2,item2) in item.Details">
                            <td v-if="1!=isDispatch">
                              <i class="on am-blink icon-triangle-left" v-show="item2.On"></i>
                              <label class="checkbox" v-else>
                                <input type="checkbox" :value="item2" v-model="arrChkItem">
                                <span class="icon"></span>
                              </label>
                            </td>
                            <td class="text-nowrap" :class="{'text-bold':item2.On}">
                              {{item.CategoryName}}
                            </td>
                            <td class="text-left" :class="{'text-bold':item2.On}" :data-proid="item.ProId">
                              {{item.ProName}}
                            </td>
                            <td style="width:40px">{{i2+1}}</td>
                            <template v-if="item2.Imei.length>0">
                              <td v-for="(index,item3) in item2.Imei" class="text-nowrap" v-if="index+1<=standard">
                                {{item3}}
                              </td>
                              <td v-for="n in (standard-item2.Imei.length<0?0:standard-item2.Imei.length)">/</td>
                            </template>
                            <template v-else>
                              <td v-for="n in parseInt(standard)">
                                <input @focus="snIpt_Focus($event,item2)" @blur="snIpt_Blur($event,item2)" type="search" class=" ipt-imei" @keyup="snIpt_Keyup($event,item2)" type="text" placeholder="输入串号" maxlength="20">
                              </td>
                            </template>
                          </tr>
                        </template>
                        <tr v-if="1!=isDispatch">
                          <td colspan="3" class="text-right">
                            <b class="mr20">总计</b>
                          </td>
                          <td :colspan="standard-0+1">
                            <b>{{computedCount.IMEIIn+'/'+computedCount.IMEIShouldBeIn}}</b>
                          </td>
                        </tr>
                        <tr v-else>
                          <td colspan="2" class="text-right">
                            <b class="mr20">总计</b>
                          </td>
                          <td :colspan="standard-0+1">
                            <b>{{computedCount.goods}}</b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="text-center">
                    <div class="pageBox"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">{{showParams.btn}}库</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
        </div>
      </div>
    </div>
    <store-list :show.sync="isShowStoreSelect" :is-out="computedDispatchOutOrIn" is-in-pop="1" :store-selected.sync="dataList"></store-list>
  </div>
</template>
<script>
/**
 * 采购、退，销售、退，出入库弹窗，showParams参数对应需要显隐数据
 * zhao.liubin@zol.com.cn
 * 2017-06-13
 */
import formDataUpload from 'commonScripts/formDataUpload.js';
import storeList from 'vues/storeList.vue';
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    code: '', //当前单号
    receipt: '', //是否发票
    dataList: {}, //接受单据如单号，支付方式，仓库等单据原有信息
    isDispatch: 0, //是否调拨出，此时区别于采销，0作为调拨出，1为入
    apiList: { //接受API列表
      type: Object
    },
    showParams: { //显示相关DOM参数
      type: Object
    }
  },
  data() {
    return {
      curIndex: 0,
      isShowStoreSelect: false,
      pageIndex: 1,
      APILIST: {
        CHECK: '/api/Imei/Checking',
        IMPORT: '/Api/Imei/Importing',
        READY: 'api/imei/InputImeiPre',
        PREVIEW: 'api/imei/ImeiTempList', //预览
        PREVIEWDISPATCHIN: 'api/Imei/TCImeiDetailList', //预览调拨入库
      },
      dataIn: {
        dataProsList: [],
        dataImeiList: [],
        snlist: [],
        server: localStorage.APIServer || window.APISERVER,
        arrImei: [],
      },
      arrChkItem: [],
      objProImeiTemp: {},
      iptImei: '',
      isSendingData: false,
      imeiLength: '',
      standard: '1',
      preferenceImei: ''
    }
  },
  components: {
    storeList
  },
  computed: {
    computedBranchIdForStore() {
      if (0 == this.isDispatch) {
        return this.dataList.OutBranchId;
      } else if (1 == this.isDispatch) {
        return this.dataList.InBranchId;
      } else {
        return this.dataList.BranchId;
      }
    },
    //是否是调拨，此时信息显示异于其他
    computedDispatchOutOrIn() {
      if (0 == this.isDispatch) {
        return 1; //是出
      } else if (1 == this.isDispatch) {
        return 0; //是入
      } else {
        return '';
      }
    },
    curGoods: {
      get() {
        return this.dataIn.dataList[this.curIndex] || {};
      },
      set: function(v) {
        // this.aaa = v.ImeiLength;
      }
    },
    computedIsALlChecked() {
      let l = 0;
      this.dataIn.dataImeiList.forEach(item => {
        item.Details.forEach(item2 => {
          l++;
        })
      });
      return this.dataIn.dataImeiList.length > 0 && this.arrChkItem.length == l;
    },
    //计算合计
    computedCount() {
      let objCount = {
        goods: 0, //商品总数
        countIn: 0, //已入总数
        countTo: 0, //待入总数
        curCountIn: 0, //本次入总数
        IMEIIn: 0, //有串号当前已入
        IMEIShouldBeIn: 0 //有串号应入
      }
      if (1 == this.isDispatch) {
        this.dataList.Details.forEach(item => {
          objCount.goods += +item.ProCount;
        });
      } else {
        this.dataIn.dataProsList.forEach(item => {
          objCount.goods += +item.ProCount;
          objCount.countTo += item.ProCount - item.ProCount1;
          objCount.countIn += +item.ProCount1;
          if (item.HaveImei != 0) {
            objCount.IMEIShouldBeIn += item.ProCount - item.ProCount1;
            objCount.IMEIIn += +item.ProCountCurIn;
          } else {
            objCount.curCountIn += +item.ProCountCurIn;
          }
        })
        objCount.curCountIn += +objCount.IMEIIn;
      }

      return objCount;
    },
    //是否全部是没串号商品
    computedIsPureHaveNoImei() {
      let data = this.dataIn.dataProsList;
      let is = true;
      for (let i = 0; i < data.length; i++) {
        if (data[i].HaveImei != 0 && data[i].ProCount > data[i].ProCount1) {
          is = false;
          break;
        }
      }
      return is;
    },
    //计算可录入的商品合集
    computedProId() {
      var arrTemp = [];
      let data = this.dataIn.dataProsList;
      for (let i = 0; i < data.length; i++) {
        arrTemp.push(this.assetPros(data[i]));
      }
      return arrTemp;
    },
    //计算是否禁用下载上传
    isNotBeImported() {
      return this.computedCount.IMEIIn == this.computedCount.IMEIShouldBeIn;
    }
  },
  methods: {
    initPageData(pageIndex = 1) {
      this.dataIn.dataImeiList = [];
      let me = this;
      let para = {};
      para.pageIndex = this.pageIndex = pageIndex;
      para.pageSize = 500;
      para.Code = this.dataList.Code;
      para.Details = this.dataList.Details;
      let api = 1 == this.isDispatch ? this.APILIST.PREVIEWDISPATCHIN : this.APILIST.PREVIEW;
      fetchData({
        api,
        para,
        callback(data) {
          // console.dir(data);
          let s = 0;
          data.Data.forEach(item => {
            me.dataList.StoreId = item.StoreId || me.dataList.StoreId;
            me.dataList.StoreName = item.StoreName || me.dataList.StoreName;
            item.Details.forEach(item2 => {
              item2.ProId = item.ProId;
              item2.ProName = item.ProName;
              item2.On = false;
              if (s > 0) {
                return;
              } else {
                s = item2.Imei.length;
              }
            })
          })
          me.standard = s > 0 ? s : 1;
          me.dataIn.dataImeiList = data.Data;
          me.dataIn.dataProsList = data.Details;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageIndex);
        }
      })
    },
    getMinImeiLength(imeiLength) {
      return Math.min.apply(null, (imeiLength + '').split(','));
    },
    download_Click() {
      fetchData({
        API: '/Api/Imei/Export',
        para: {
          Details: this.computedProId,
        },
        callback(data) {
          var server = window.APISERVER;
          dialog({
            title: '下载模板',
            content: `<a class="highlight" href="${server}${data}">点击下载模板</a>`,
            cancelValue: '关闭',
            cancel() {}
          }).showModal();
        }
      })
    },
    export_Click() {
      this.$el.querySelector('.import-sn').click();
    }, //选择仓库弹窗
    selectStore() {
      this.isShowStoreSelect = true;
    },
    all_Change(e) {
      let c = e.target.checked;
      this.arrChkItem = [];
      let me = this;
      if (c) {
        this.dataIn.dataImeiList.forEach(item => {
          item.Details.forEach(item2 => {
            me.arrChkItem.push(item2);
          })
        })
      }
    },
    //本次入失焦
    proCountCurIn_Blur(item) {
      if (item.ProCountCurIn && item.ProCountCurIn > item.ProCount - item.ProCount1) {
        item.ProCountCurIn = item.ProCount - item.ProCount1;
      }
    },
    //更新本次入数据
    getProCountCurIn(ProId, isDel) {
      let arrDetail = this.dataIn.dataProsList;
      arrDetail.forEach(item => {
        if (item.HaveImei != 0) {
          if (ProId) {
            if (item.ProId == ProId) {
              if (isDel) {
                item.ProCountCurIn--;
              } else {
                item.ProCountCurIn++;
              }
            }
          } else {
            item.ProCountCurIn = 0;
          }
        }
      })
    },
    //拼装数组元素数据
    assetPros(goods) {
      let objTemp = {};
      objTemp.ProId = goods.ProId;
      objTemp.ProName = goods.ProName;
      objTemp.Category = goods.Category;
      // objTemp.ImeiLength = goods.ImeiLength;
      objTemp.Standard = this.standard || 1;
      objTemp.ProCount = goods.ProCount ? (goods.ProCount - goods.ProCount1 - goods.ProCountCurIn) : 1;
      return objTemp;
    },
    //拼装校验串号送服务器结构
    assetChkDB() {
      let para = {};
      para.BillCode = this.dataList.Code;
      para.storeId = this.dataList.OutStore || this.dataList.StoreId; //调拨也时为OutStore，其它情况为StoreId
      para.Standard = this.standard || 1;
      para.CustomerId = this.dataList.SupplierId || this.dataList.CustomerId || 0;
      para.receipt = this.dataList.Receipt;
      para.AutoMatch = this.showParams.autoMatch || 0;
      return para;
    },
    verifyImei_Keyup(e) {
      let tar = e.target;
      let imei = this.preferenceImei.trim();
      if (!imei) {
        return;
      }
      let para = this.assetChkDB();
      para.Imei = imei;
      para.Pros = [];
      this.dataIn.dataImeiList
        .forEach(item => {
          let c = 0;
          item.Details.forEach(item2 => {
            if (!item2.Imei.length) {
              c++;
            }
          })
          if (c) {
            para.Pros.push({
              ProId: item.ProId,
              ProName: item.ProName,
              ProCount: c,
              Standard: this.standard || 1
            })
          }
        })
      if (!para.Pros.length) {
        let strTips = this.showParams.btn || '出';
        showTips(`当前页商品串号已全部录入，请翻页或直接${strTips}库`, 'warning', '', 3000);
        return;
      }
      fetchData({
        api: this.APILIST.CHECK,
        para,
        callback: (data) => {
          if (data.length) {
            data = data[0];
          }
          this.preferenceImei = '';
          if (data.Status == 0) {
            showTips(data.Msg, 'error');
            tar.select();
            return;
          }
          for (let i = 0; i < this.dataIn.dataImeiList.length; i++) {
            let curItem = this.dataIn.dataImeiList[i];
            if (data.ProId != curItem.ProId) {
              continue;
            } else {
              for (let j = 0; j < curItem.Details.length; j++) {
                let curD = curItem.Details[j];
                if (curD.Imei.length == 0) {
                  curD.Imei = data.Imei.split(' ');

                  break;
                }
              }
              break;
            }
          }
          this.getProCountCurIn(data.ProId);
        }
      })
    },
    snIpt_Keyup(e, curGoods) {
      let me = this;
      let t = e.target;
      let $t = $(t);
      let $p = $t.closest('tr');
      let $pp = $p.closest('tbody');
      me.curIndex = $p.index();
      let v = t.value;
      let regExp = /[^\w\d\s-]/g;
      if (regExp.test(v)) {
        t.value = v.replace(regExp, '');
      }
      let goods = curGoods;
      let vTrim = t.value.replace(/\s/g, '');

      if (13 == e.keyCode) {
        if (me.standard > 1) {
          let indexT = $p.find('.ipt-imei').index(t);
          if (indexT + 1 < me.standard) {
            $p.find('.ipt-imei').eq(++indexT).focus();
            return;
          }
        }
        if (!this.isSendingData) {
          this.isSendingData = true;
          setTimeout(function() {
            me.isSendingData = false;
          }, 1000);
          let para = this.assetChkDB();
          let arrImeiTemp = [];
          let issOk = true;
          $p.find('.ipt-imei').each(function(i) {
            if (!this.value) {
              issOk = false;
              this.focus();
              return;
            }
            arrImeiTemp.push(this.value.trim());
          })
          if (!issOk) {
            return;
          }
          para.Imei = arrImeiTemp.join(' ');
          para.Pros = Array.of(this.assetPros(goods)); //拼装服务器需要数据结构
          fetchData({
            api: this.APILIST.CHECK,
            para,
            callback(data) {
              me.isSendingData = false;
              let isWithError = _.find(data, {
                Status: 0
              });
              if (isWithError) {
                let strTipsError = '<div>以下串号存在问题，请核对</div>';
                data.forEach(function(item) {
                  if (1 != item.Status) {
                    strTipsError += `<p class="text-left font-small"><span class="text-warning">${item.Imei}</span>: ${item.Msg}</p>`;
                  }
                });
                showTips(strTipsError, 'error', '', 5000);
                $p.find('.ipt-imei').each(function() {
                  this.value = '';
                });
              } else {
                data.forEach(function(item) {
                  var status = item.Status;
                  if (status != 1) {} else {
                    curGoods.Imei = data[0].Imei.split(' ');
                    $pp.children().eq(++me.curIndex).find('.ipt-imei').eq(0).focus();
                  }
                })
                me.getProCountCurIn(curGoods.ProId);
              }
            },
            errorCallback() {
              $p.find('.ipt-imei').each(function() {
                this.value = '';
              }).eq(0).focus();
            }
          })
        }
      }
    },
    snIpt_Focus(e, item) {
      $(e.target).closest('td').addClass('td-danger');
      this.dataIn.dataImeiList.forEach(item => {
        item.Details.forEach(item2 => {
          item2.On = false;
        })
      })
      item.On = true;
    },
    snIpt_Blur(e, item) {
      $(e.target).closest('td').removeClass('td-danger');
      this.dataIn.dataImeiList.forEach(item => {
        item.Details.forEach(item2 => {
          item2.On = false;
        })
      })
    },
    delImei_Click(item) {
      let me = this;
      let para = {};
      para.Imei = [];
      let content = '';
      if (item == 1) {
        para.Imei = [];
        content = '清空操作是清除该单号中所有已录入的串号，请确认';
        this.dataIn.dataImeiList.forEach(item => {
          item.Details.forEach(item2 => {
            if (item2.Imei.length) {
              let strTempImei = item2.Imei.join(' ');
              para.Imei.push(strTempImei);
            }
          })
        })
      } else {
        content = `删除串号需要重新录入，请确认`;
        this.arrChkItem.forEach(function(item) {
          if (item.Imei.length) {
            let strTempImei = item.Imei.join(' ');
            para.Imei.push(strTempImei);
          }
        })
      }
      if (para.Imei.length == 0) {
        showTips('没有需要清除的串号，请先选中或输入', 'error');
        return;
      }
      dialog({
        width: 250,
        title: '删除串号',
        content,
        ok() {
          fetchData({
            api: '/Api/Imei/TempDelete',
            para,
            callback(data) {
              if (item == 1) {
                me.dataIn.dataImeiList.forEach(item => {
                  item.Details.forEach(item2 => {
                    item2.Imei = [];
                  })
                })
                me.getProCountCurIn();
              } else {
                me.arrChkItem.forEach(itt => {
                  itt.Imei = [];
                  me.getProCountCurIn(itt.ProId, 1);
                })
              }
              me.arrChkItem = [];
            }
          })
        },
        cancel() {}
      }).showModal();
    },
    onSubmit_Click() {
      let arrDetail = [];
      let me = this;
      let strTips = this.showParams.btn || '出';
      let isOk = true;
      if (1 != this.isDispatch) {
        let dataDetails = this.dataIn.dataProsList;
        let l = dataDetails.length;
        let proCounts = 0;
        if (!zmm_validator(this.$el)) {
          return;
        }
        for (let i = 0; i < l; i++) {
          let objTemp = {};
          let curData = dataDetails[i];
          objTemp.ProId = curData.ProId;
          objTemp.Standard = me.standard;
          objTemp.ProCount = 0;
          if (curData.HaveImei != 0) {
            objTemp.ProCount = curData.ProCountCurIn;
            proCounts += curData.ProCountCurIn - 0;
          } else {
            if (curData.ProCountCurIn < curData.ProCount - curData.ProCount1) {
              isOk = false;
            }
            objTemp.Standard = 0;
            objTemp.ProCount = curData.ProCountCurIn - 0;
          }
          arrDetail.push(objTemp);
          proCounts += objTemp.ProCount;
        }
        if (proCounts == 0) {
          showTips(`本次${strTips}库商品数量需要大于零，请检查`, 'error');
          return;
        }
      }
      let para = {
        BranchId: this.dataList.BranchId,
        storeId: this.dataList.StoreId,
        code: this.dataList.Code,
        Details: arrDetail
      };
      if (0 == this.isDispatch) { //调拨出
        para.OutBranchId = this.dataList.OutBranchId;
        para.OutStore = this.dataList.OutStore;
      } else if (1 == this.isDispatch) { //调拨入
        para.InBranchId = this.dataList.InBranchId;
        para.InStore = this.dataList.InStore;
      }
      let fnSubmit = function() {
        fetchData({
          api: me.APILIST.SUBMIT,
          para,
          callback(data) {
            me.show = false;
            if (me.isGoback) {
              history.back();
            } else {
              me.$dispatch('on-after-submit');
            }
          }
        })
      }
      if (1 != this.isDispatch && !isOk) {
        dialog({
          title: '提示',
          content: `当前订单串号未全部录入，确认${strTips}库么？`,
          ok: fnSubmit,
          cancel: function() {}
        }).showModal();
      } else {
        dialog({
          title: '提示',
          content: `确认${strTips}库么？`,
          ok: fnSubmit,
          cancel() {}
        }).showModal();
      }
    },
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.initPageData();
        let me = this;
        this.APILIST.SUBMIT = this.apiList.Insert || this.apiList.Out || this.apiList.In;
        if (1 != this.isDispatch) {
          formDataUpload({
            url: this.dataIn.server + '/Api/Imei/Upload',
            obj: this.$el.querySelector('.import-sn'),
            type: 'xlsx,xls',
            callback(data) {
              let para = me.assetChkDB();
              para.Files = data.Message;
              para.Pros = me.computedProId;
              // console.log(para);
              fetchData({
                API: me.APILIST.IMPORT,
                para,
                callback(data) {
                  // console.log(data);
                  let arrOk = [];
                  let arrError = [];
                  let isAllOk = true;
                  for (let i = 0; i < data.length; i++) {
                    if (data[i].Status == 0) {
                      arrError.push(data[i]);
                      isAllOk = false;
                    } else {
                      arrOk.push(data[i])
                    }
                  };
                  if (arrOk.length || arrError.length) {
                    let htmlStr = '';
                    let htmlList = '';
                    if (isAllOk) {
                      htmlStr = '<p>成功导入' + '<span class="text-ok"> ' + arrOk.length + '</span> 条</p> ';
                    } else {
                      htmlStr = '<p>验证成功' + '<span class="text-ok"> ' + arrOk.length + '</span> 条 </span>' + '失败' + '<span class="text-danger"> ' +
                        arrError.length + '</span> 条</p>';
                      if (arrError.length) {
                        let strTemp = '';
                        let isAllNull = true;
                        for (let j = 0; j < arrError.length; j++) {
                          if (arrError[j].Imei.length > 0) {
                            strTemp = strTemp + '<p>' + arrError[j].Imei + '<span class="text-muted font-small">（' + arrError[j].Msg + '）</span>';
                            isAllNull = false;
                          }
                        }
                        if (!isAllNull) {
                          htmlList = '<div>以下串号导入失败：';
                        } else {
                          htmlList = '<p class="text-warning">（模板中可能存在空串号，请检查）</p>';
                        }
                        htmlList += strTemp;
                      }
                    }
                    dialog({
                      width: 250,
                      title: '串号导入',
                      content: htmlStr + htmlList,
                      okValue: '确定',
                      ok() {}
                    }).showModal();
                    if (arrOk.length) {
                      me.initPageData(me.pageIndex);
                    }
                  } else {
                    showTips('导入错误，请检查该Excel或先下载模板再执行导入', 'error');
                  }
                }
              })
            }
          })
        }
      }
    }
  }
}
</script>