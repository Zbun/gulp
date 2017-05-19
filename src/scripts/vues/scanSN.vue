<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{popTitle}}</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <table class="table table-bordered-inner sn-goods-table text-center table-fixed">
              <thead>
                <tr>
                  <td>
                    <p>商品名称</p>
                  </td>
                  <td style="width:100px" v-if="isByStandard">
                    标准
                  </td>
                  <td style="width:90px">数量</td>
                  <td style="width:90px">已扫</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(i,v) in dataIn.datalist" :class="{on:i==curIndex}" @click="toggleGoods_Click(i,v)">
                  <td>
                    <div class="clearfix">
                      <p class="text-left text-ellipsis fl" style="max-width:100%;padding-right:80px;margin-right:-70px" :title="v.ProName">
                        <i class="on-icon">&clubs; </i>{{v.ProName}}<i class="icon-gift" v-if="v.ProType==0">礼</i></p>
                      <span class="tooltips-i tooltips-l fl ml5" v-if="v.ImeiLength==0">无串号
                        </span>
                    </div>
                  </td>
                  <td v-if="isByStandard">
                    {{v.Standard|SNStandard}}
                  </td>
                  <td><span class="sn-count">{{v.ProCount}}</span></td>
                  <td>
                    <span class="sn-count on-num" :class="｛'text-warning':v.Details.length>0}" v-if="v.ImeiLength!=0">{{v.Details.length}}</span>
                    <span v-else>
                      <input type="number" data-validate="notPositive show" min=0 :max="v.ProCount" v-model="v.proCountNoImei" class="com-ipt x-small" placeholder="输入数量">
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="multiply-box" :class="{disabled:curGoods.ProCount==undefined||curGoods.ImeiLength==0}">
              <h2 class="title item text-ellipsis text-warning" title="{{curGoods.ProName}}">
                {{curGoods.ProName}}{{comptedLength}}
              </h2>
              <div class="sub-title item">
                <span class="action fr">
                  <a href="javascript:;" class="highlight mr10" @click="download_Click()" :class="{disabled:!isCanImport}">下载模板</a>
                  <a href="javascript:;" class="highlight" @click="export_Click()" :class="{disabled:!isCanImport}">批量导入</a>
                  <input type="file" class="import-sn hidden">
                </span> 录入串号
                <input autofocus="autofocus" type="search" class="com-ipt sn-in high" placeholder="请录入串号，回车提交" :disabled="(autoMatch==1&&computedProId.length==0)||(autoMatch!=1&&(curGoods.ProCount==undefined||curGoods.ImeiLength==0||curGoods.ProCount==curGoods.Details.length))" v-model="iptImei" @keyup="snIpt_Keyup($event)">
                <span class="text-muted" style="width:30px;display:inline-block">{{iptImei.length}}</span>
                <span class="ml10">
                  串号位数：{{computedIptLength}}
                </span>
              </div>
              <ul class="list-box">
                <li class="item" v-for="item in dataIn.snlist">
                  <a href="javascript:;" class="fr text-del ml10 " @click="delImei_Click(item)" title="删除串号">&times;</a>
                  <ol class="sn-show fr mr10 ml20" v-if="item.Standard>1">
                    <li v-for="item2 in item.ImeiShow">
                      {{item2}}
                    </li>
                  </ol>
                  <span v-else class="fr mr10 ml20">{{item.Imei}}</span>
                  <p class="text-ellipsis" :title="item.ProName">{{item.ProName}}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">提交</button>
          <button class="btn btn-default" @click="delImei_Click(0)">清空</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 通用串号扫描弹出层，需要传入三个API，一机N串上传
 * zhao.liubin@zol.com.cn
 * 2017-03-28
 */
import formDataUpload from 'commonScripts/formDataUpload.js';
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    isGoback: '', //提交后是否页面是否后退
    code: '', //当前单号
    storeId: '', //仓库ID
    isByStandard: '', //串号标准是否起作用
    popTitle: '串号扫描',
    receipt: '', //是否发票
    autoMatch: '', //是否是出库自动匹配类，此时需要传可扫描的全部产品ID数组集
    // autoMatch: '',
    apiList: {
      type: Object
    },
  },
  data() {
    return {
      curIndex: 0,
      APILIST: {
        READY: 'api/imei/InputImeiPre'
      },
      dataIn: {
        datalist: [],
        snlist: [],
        server: localStorage.APIServer || window.APISERVER,
        arrImei: [],
      },
      objProImeiTemp: {},
      iptImei: '',
      isSendingData: false,
      imeiLength: '',
    }
  },
  components: {},
  computed: {
    curGoods: {
      get() {

        return this.dataIn.datalist[this.curIndex] || {};
      },
      set: function(v) {
        // this.aaa = v.ImeiLength;
      }
    },
    computedIptLength() {
      return this.curGoods.ImeiLength;
    },
    computedImeiLength() {
      return this.curGoods.ImeiLength;
    },
    computedIptMaxlength() {
      return Math.max.apply(null, this.dataIn.arrImei);
    },
    //计算可录入的商品合集
    computedProId() {
      var arrTemp = [];
      let data = this.dataIn.datalist;
      for (let i = 0; i < data.length; i++) {
        if (this.getMinImeiLength(data[i].ImeiLength) > 0 && data[i].ProCount > data[i].Details.length) {
          let objTemp = {};
          objTemp.ProId = data[i].ProId;
          objTemp.ProCount = data[i].ProCount - data[i].Details.length
          objTemp.ProName = data[i].ProName;
          objTemp.ImeiLength = data[i].ImeiLength;
          arrTemp.push(objTemp);
        }
      }
      return arrTemp;
    },
    //计算是否禁用下载上传
    isCanImport() {
      let isOk = true;
      let lenDetails = 0;
      let lenProCount = 0;
      this.dataIn.datalist.forEach(item => {
        lenProCount += item.ProCount;
        lenDetails += item.Details.length;
      });
      if (lenDetails == lenProCount) {
        isOk = false;
      };
      return isOk;
    }
  },
  methods: {
    initPageData() {
      let me = this;
      this.iptImei = '';
      setTimeout(function() {
        me.$el.querySelector('.sn-in').focus();
      }, 250);
      fetchData({
        api: this.APILIST.READY,
        para: {
          code: me.code
        },
        callback(data) {
          // console.dir(data);

          let tempArray = [];
          let arrImei = [];
          data.forEach(function(item, i) {
            item.proCountNoImei = item.ProCount;
            item.Details.forEach((item2) => {
              item2.Standard = item.Standard;
              item2.ImeiShow = [];
              if (item.Standard > 1) { //在1机超过1个串号时，构造一个串号展示的数组
                item2.ImeiShow = item2.Imei.split(/\s+/);
              }
            })
            tempArray = tempArray.concat(item.Details);
            me.getMinImeiLength(item.ImeiLength) > 0 && arrImei.push(item.ImeiLength);
          });
          me.dataIn.datalist = data;
          me.dataIn.arrImei = _.uniq(arrImei);
          for (let i = 0; i < data.length; i++) {
            if (me.getMinImeiLength(data[i].ImeiLength) > 0 && data[i].ProCount > data[i].Details.length) {
              me.curIndex = i;
              break;
            }
          }
          me.dataIn.snlist = tempArray;
        }
      })
    },
    getMinImeiLength(imeiLength) {
      return Math.min.apply(null, (imeiLength + '').split(','));
    },
    toggleGoods_Click(i, v) {
      this.curIndex = i;
      let tempPro = _.find(this.dataIn.snlist, {
        ProId: v.ProId,
        isWaiting: true
      });

      if (tempPro) {
        let tempProIndex = 0;

        for (let o = 0; o < this.dataIn.snlist.length; o++) {
          if (this.dataIn.snlist[o].isWaiting && this.dataIn.snlist[o].ProId == v.ProId) {
            tempProIndex = o;
            break;
          }
        }
        let snTemp = this.dataIn.snlist[tempProIndex];
        this.dataIn.snlist.splice(tempProIndex, 1);
        this.dataIn.snlist.unshift(snTemp);
      }
    },
    download_Click() {
      fetchData({
        API: '/Api/Imei/Export',
        para: {
          Details: this.computedProId
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
    },
    snIpt_Keyup(e) {
      let me = this;
      let t = e.target;
      let v = t.value;
      let regExp = /[^\w\d\s-]/g;
      if (regExp.test(v)) {
        t.value = v.replace(regExp, '');
      }
      let goods = this.curGoods;
      let l = this.getMinImeiLength(goods.ImeiLength);
      if (this.autoMatch) {
        l = Math.min.apply(null, this.dataIn.arrImei);
      }
      let vTrim = t.value.trim();
      if (vTrim.length < l) {
        return;
      } else {
        if (13 == e.keyCode) {
          if (!this.isSendingData) {
            this.isSendingData = true;
            setTimeout(function() {
              me.isSendingData = false;
            }, 1000);
            let para = {};
            para.Imei = vTrim.replace(/,/g, ' ');
            para.BillCode = this.code;
            para.storeId = this.storeId;
            para.AutoMatch = this.autoMatch || '';
            let arrImei = para.Imei.split(/\s+/);
            if (this.autoMatch) {
              para.Pros = me.computedProId;
            } else {
              let objTemp = {};
              objTemp.ProId = goods.ProId;
              objTemp.ProName = goods.ProName;
              objTemp.ImeiLength = goods.ImeiLength;
              objTemp.Standard = goods.Standard || 1;
              let proRemain = (goods.ProCount - goods.Details.length) * objTemp.Standard;
              objTemp.ProCount = proRemain;
              para.Pros = Array.of(objTemp);
              if (me.isByStandard && arrImei.length < goods.Standard) {
                objTemp.ImeiShow = [];
                objTemp.Imei = para.Imei;
                objTemp.isWaiting = true;
                let arrTemp = arrImei;
                let tempPro = _.find(this.dataIn.snlist, {
                  ProId: objTemp.ProId,
                  isWaiting: true
                });
                for (let i = arrImei.length; i < goods.Standard; i++) {
                  arrImei[i] = '';
                }
                let isFull = false;
                if (tempPro) {
                  let tempProIndex = 0;
                  for (let o = 0; o < this.dataIn.snlist.length; o++) {
                    if (this.dataIn.snlist[o].isWaiting && this.dataIn.snlist[o].ProId == objTemp.ProId) {
                      tempProIndex = o;
                      break;
                    }
                  }
                  let curPro = this.dataIn.snlist[tempProIndex];
                  for (let j = 0, k = 0; j < curPro.ImeiShow.length; j++) {
                    if (curPro.ImeiShow[j] == '') {
                      curPro.ImeiShow[j] = arrImei[k++];
                    }
                  }
                  if (curPro.ImeiShow[objTemp.Standard - 1] == '') {
                    isFull = false;
                    objTemp.ImeiShow = this.dataIn.snlist[tempProIndex].ImeiShow;
                    this.dataIn.snlist.splice(tempProIndex, 1);
                    me.dataIn.snlist.unshift(objTemp);
                    t.value = '';
                    return;
                  } else {
                    this.dataIn.snlist.splice(tempProIndex, 1);
                    para.Imei = curPro.ImeiShow.join(' ');
                  }
                } else {
                  objTemp.ImeiShow = arrImei;
                  me.dataIn.snlist.unshift(objTemp);
                  t.value = '';
                  return;
                }
              }

              if (proRemain < arrImei.length) {
                showTips('当前商品可扫码数量需要不小于扫进串号数，请检查', 'error', '', 3000);
                t.value = '';
                return;
              }
            }
            para.receipt = this.receipt;
            para.Imei = para.Imei.split(' ').sort(function(a, b) {
              return a.length > b.length
            }).join(' ');
            fetchData({
              api: 'API/imei/imeiChk',
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
                } else {
                  data.forEach(function(item) {
                    var status = item.Status;
                    if (status != 1) {
                      // showTips(item.Msg, 'error');
                    } else {
                      let obj = {};
                      obj.ProName = item.ProName;
                      obj.Imei = item.Imei;
                      obj.ProId = item.ProId;
                      obj.Standard = goods.Standard;
                      obj.ImeiShow = [];
                      if (obj.Standard > 1) {
                        obj.ImeiShow = obj.Imei.split(/\s+/);
                      }
                      me.dataIn.snlist.unshift(obj);
                      me.curIndex = _.findIndex(me.dataIn.datalist, {
                        ProId: item.ProId
                      });
                      me.curGoods.Details.unshift(obj);
                      if (me.isOut != 1) {
                        if (me.curGoods.Details.length == me.curGoods.ProCount) {
                          if (me.curIndex != me.dataIn.datalist.length - 1) {
                            me.curIndex++;
                          }
                        }
                      }
                    }
                  })
                }
                t.value = '';
              },
              errorCallback() {
                t.value = '';
              }
            })
          }
        }
      }
    },
    delImei_Click(item) {
      let me = this;
      let para = {};
      para.Imei = [];
      let content = '';
      if (item == 0) {
        para.Imei = [];
        content = '清空操作是清除该单号中所有已录入的串号，请确认';
        this.dataIn.snlist.forEach(function(item) {
          let strTempImei = item.Imei;
          para.Imei.push(strTempImei);
        })
      } else {
        content = `删除该串号（<span class="text-warning">${item.Imei}</span>）后相关商品中需要重新录入，请确认`;

        let strTempImei = item.Imei;
        if (item.isWaiting) {
          me.dataIn.snlist.$remove(item);
          return;
        }
        para.Imei.push(strTempImei);
      }
      if (para.Imei.length == 0) {
        // showTips('没有选中串号需要删除，检查', 'error');
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
              if (item == 0) {
                me.dataIn.snlist = [];
                me.dataIn.datalist.forEach(item => {
                  item.Details = [];
                })
              } else {
                _.find(me.dataIn.datalist, {
                  ProId: item.ProId
                }).Details.pop();
                me.dataIn.snlist.$remove(item);
              }
            }
          })
        },
        cancel() {}
      }).showModal();
    },
    onSubmit_Click() {
      let data = this.dataIn.datalist;
      let l = data.length;
      let me = this;
      let isOk = true;
      let arrDetail = [];
      let proCounts = 0;
      if (!zmm_validator(this.$el)) {
        return;
      }
      for (let i = 0; i < l; i++) {
        let objTemp = {};
        let curData = data[i];
        objTemp.ProId = curData.ProId;
        objTemp.Standard = curData.Standard;
        objTemp.ImeiLength = Math.min.apply(null, (curData.ImeiLength + '').split(','));
        if (objTemp.ImeiLength > 0) {
          objTemp.ProCount = curData.Details.length;
        } else {
          objTemp.ProCount = curData.proCountNoImei || 0;
        }
        if (objTemp.ProCount < curData.ProCount) {
          isOk = false;
        }
        objTemp.Category = curData.Category;
        arrDetail.push(objTemp);
        proCounts += objTemp.ProCount;
      }
      if (proCounts == 0) {
        showTips('商品已扫码总数需要大于零，请检查', 'error');
        return;
      }
      let fnSubmit = function() {
        fetchData({
          api: me.APILIST.SUBMIT,
          para: {
            // code: createOrderNum.storageIn(),
            code: me.code,
            Details: arrDetail
          },
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
      if (!isOk) {
        dialog({
          title: '提示',
          content: '当前订单未将串号全部录入成功，请确认',
          ok: fnSubmit,
          cancel: function() {}
        }).showModal();
      } else {
        fnSubmit();
      }
    },
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {

  },
  watch: {
    show(newVal) {
      if (newVal) {
        // this.curIndex = 0;
        this.initPageData();
        let me = this;
        this.APILIST.SUBMIT = this.apiList.Insert;
        formDataUpload({
          url: this.dataIn.server + '/Api/Imei/Upload',
          obj: this.$el.querySelector('.import-sn'),
          type: 'xlsx,xls',
          callback(data) {
            let para = {
                Files: data.Message,
                BillCode: me.code,
                Pros: me.computedProId,
                StoreId: me.storeId,
              }
              // console.log(para);
            fetchData({
              API: '/Api/Imei/Import',
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
                    title: '串号导入',
                    content: htmlStr + htmlList,
                    okValue: '好的',
                    ok() {}
                  }).showModal();
                  me.initPageData();
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
</script>
