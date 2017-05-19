<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{popTitle}}</h2>
        <div class="body">
          <div class="content" style="width:800px">
            <table class="table table-bordered-inner sn-goods-table text-center table-fixed">
              <thead>
                <tr>
                  <td>
                    <p>商品名称</p>
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
                        <i class="on-icon">&clubs; </i>{{v.ProName}}</p>
                      <span class="tooltips-i tooltips-l fl ml5" v-if="v.ImeiLength==0" style="margin-top:-2px;">无串号
                        </span>
                    </div>
                  </td>
                  <td><span class="sn-count">{{v.ProCount}}</span></td>
                  <td>
                    <span class="sn-count on-num" :class="｛'text-warning':v.Details.length>0}" v-if="v.ImeiLength!=0">{{v.Details.length}}</span>
                    <span v-else>/</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="multiply-box" :class="{disabled:curGoods.ProCount==undefined||curGoods.ImeiLength==0}">
              <h2 class="title item text-ellipsis text-warning" :title="curGoods.ProName">
                {{curGoods.ProName}}{{comptedLength}}
              </h2>
              <div class="sub-title item">
                <span class="action fr">
                  <a href="javascript:;" class="highlight mr10" @click="download_Click()" :class="{disabled:!isCanImport}">下载模板</a>
                  <a href="javascript:;" class="highlight" @click="export_Click()" :class="{disabled:!isCanImport}">批量导入</a>
                  <input type="file" class="import-sn hidden">
                </span> 录入串号
                <input autofocus="autofocus" type="text" class="com-ipt sn-in high" placeholder="请录入串号，回车提交" :disabled="(isOut==1&&computedProId.length==0)||(isOut!=1&&(curGoods.ProCount==undefined||curGoods.ImeiLength==0||curGoods.ProCount==curGoods.Details.length))" v-model="iptImei" @keyup="snIpt_Keyup($event)">
                <span class="text-muted" style="width:30px;display:inline-block">{{iptImei.length}}</span>
                <span class="ml10">
                  串号位数 <input type="text" :value="computedIptLength" class="com-ipt high xx-small text-center" style="width:50px" readonly="">
<!--                   <select class="com-ipt high" v-model="computedImeiLength" v-else>
                    <option v-for="v in dataIn.arrImei" :value="v">{{v}}</option>
                  </select> -->
<!--                   <span class="" v-else>
                    {{dataIn.arrImei.join(',')}}
                  </span> -->
                </span>
              </div>
              <!--               <ul class="list-box">
                <li class="item" v-for="item in dataIn.snlist">
                  <a href="javascript:;" class="fr text-del ml10 " @click="delImei_Click(item)" title="删除串号">&times;</a>
                  <span class="fr mr10 ml20">{{item.Imei}}</span>
                  <p class="text-ellipsis" :title="item.ProName">{{item.ProName}}</p>
                </li>
              </ul> -->
              <table class="table list-box text-center table-fixed">
                <thead>
                  <tr>
                    <th>
                      名称
                    </th>
                    <th style="width:140px;">
                      出库单号
                    </th>
                    <th style="width:140px;">
                      出库时间
                    </th>
                    <th style="width:130px;">
                      串号
                    </th>
                    <th style="width:100px;">
                      价格
                    </th>
                    <th style="width:60px">
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in dataIn.snlist">
                    <td>
                      <p class="text-ellipsis text-left" :title="item.ProName">{{item.ProName}}</p>
                    </td>
                    <td>
                      <p class="text-nowrap">
                        {{item.BillCode}}
                      </p>
                    </td>
                    <td>
                      <p class="text-nowrap">
                        {{item.BillDate|datetime}}
                      </p>
                    </td>
                    <td>
                      <p class="text-nowrap">{{item.Imei}}</p>
                    </td>
                    <td>
                      <p class="text-nowrap price-show">{{item.ImeiPrice|money}}</p>
                    </td>
                    <td><a href="javascript:;" class=" text-del" @click="delImei_Click(item)" title="删除串号">&times;</a></td>
                  </tr>
                </tbody>
              </table>
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
 * 通用串号扫描弹出层，需要传入三个API，
 * zhao.liubin@zol.com.cn
 * 2016-12-5
 */
import formDataUpload from 'commonScripts/formDataUpload.js';
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    code: '',
    storeId: '',
    popTitle: '串号扫描',
    apiList: {
      type: Object
    },
    isOut: 0, //是否是出库类，此时需要传可扫描的全部产品ID数组集
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
      // if (this.isOut) {
      //   return this.dataIn.arrImei[0] || 0
      // } else {

      // }
    },
    computedImeiLength() {
      return this.curGoods.ImeiLength;
    },
    computedIptMaxlength() {
      return Math.max(...this.dataIn.arrImei);
    },
    computedProId() {
      var arrTemp = [];
      // this.dataIn.datalist.forEach(function(v, i) {
      //   if (v.ImeiLength > 0 && v.ProCount > v.Details) {
      //     arrTemp.push(v.ProId);
      //   }
      // });
      // return arrTemp;
      let data = this.dataIn.datalist;
      for (let i = 0; i < data.length; i++) {
        if (data[i].ImeiLength > 0 && data[i].ProCount > data[i].Details.length) {
          let objTemp = {};
          objTemp.ProId = data[i].ProId;
          objTemp.ProCount = data[i].ProCount - data[i].Details.length
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
      setTimeout(function() {
        me.$el.querySelector('.sn-in').focus();
      }, 250);
      fetchData({
        api: this.apiList.ready,
        para: {
          code: me.code
        },
        callback(data) {
          // console.dir(data);
          me.dataIn.datalist = data;
          let tempArray = [];
          let arrImei = [];
          data.forEach(function(item, i) {
            tempArray = tempArray.concat(item.Details);
            if (item.ImeiLength > 0) {
              arrImei.push(item.ImeiLength);
            }
          });

          me.dataIn.arrImei = _.uniq(arrImei);
          for (let i = 0; i < data.length; i++) {
            if (data[i].ImeiLength > 0 && data[i].ProCount > data[i].Details.length) {
              me.curIndex = i;
              break;
            }
          }
          me.dataIn.snlist = tempArray;
        }
      })
    },
    toggleGoods_Click(i, v) {
      this.curIndex = i;
    },
    download_Click() {
      let Details = [];
      this.dataIn.datalist.forEach(item => {
        if (item.ImeiLength > 0 && item.ProCount > item.Details.length) {
          let objTemp = {};
          objTemp.ProCount = item.ProCount - item.Details.length;
          objTemp.ProId = item.ProId;
          objTemp.ProName = item.ProName;
          Details.push(objTemp);
        }
      });
      fetchData({
        API: '/Api/Imei/Export',
        para: {
          Details: Details
        },
        callback(data) {
          var server = window.APISERVER;
          dialog({
            title: '下载模板',
            content: `<a class="highlight" href="${server}${data}">点击下载模板</a>`,
            cancelValue: '关闭',
            cancel() {

            }
          }).showModal();
        }
      })
    },
    export_Click() {
      this.$el.querySelector('.import-sn').click();
    },
    getCanUsedPros() {

    },
    snIpt_Keyup(e) {
      let me = this;
      let t = e.target;
      let v = t.value;
      let regExp = /[^\d\s]/g;
      if (regExp.test(v)) {
        t.value = v.replace(regExp, '');
      }
      let goods = this.curGoods;
      let l = goods.ImeiLength;
      if (this.isOut) {
        l = Math.min.apply(null, this.dataIn.arrImei);
      }
      if (t.value.length < l) {
        return;
      } else {
        if (13 == e.keyCode) {
          if (!this.isSendingData) {
            this.isSendingData = true;
            setTimeout(function() {
              me.isSendingData = false;
            }, 1000);
            let para = {};
            para.Imei = t.value;
            para.BillCode = this.code;
            para.storeId = this.storeId;
            para.ProName = goods.ProName;
            let arrImei = t.value.split(' ');
            if (this.isOut) {
              para.Pros = me.computedProId;
            } else {
              para.ProId = Array.of(goods.ProId);
              let objTemp = {};
              objTemp.ProId = goods.ProId;
              let proRemain = this.curGoods.ProCount - this.curGoods.Details.length;
              objTemp.ProCount = proRemain;
              para.Pros = Array.of(objTemp);

              if (proRemain < arrImei.length) {
                showTips('当前商品可扫码数量需要不小于扫进串号数，请检查', 'error', '', 3000);
                t.value = '';
                return;
              }
            }
            para.ImeiLength = this.computedIptLength;
            // console.log(me.computedProId);
            // return;
            fetchData({
              api: 'API/imei/imeiChk',
              para,
              callback(data) {
                me.isSendingData = false;
                var status = data[0].Status;
                if (status != 1) {
                  showTips(data[0].Msg, 'error');
                } else {
                  let obj = {};
                  obj.ProName = me.curGoods.ProName;
                  obj.Imei = data[0].Imei;
                  obj.ProId = me.curGoods.ProId;
                  me.dataIn.snlist.push(data[0]);
                  me.curIndex = _.findIndex(me.dataIn.datalist, {
                    ProId: data[0].ProId
                  });
                  me.curGoods.Details.push(obj);
                  if (me.isOut != 1) {
                    if (me.curGoods.Details.length == me.curGoods.ProCount) {
                      if (me.curIndex != me.dataIn.datalist.length - 1) {
                        me.curIndex++;
                      }
                    }
                  }
                }
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
          para.Imei.push(item.Imei);
        })
      } else {
        content = `删除该串号（<span class="text-warning">${item.Imei}</span>）后相关商品中需要重新录入，请确认`
        para.Imei.push(item.Imei);
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
        }
      }).showModal();
    },
    onSubmit_Click() {
      let data = this.dataIn.datalist;
      let l = data.length;
      for (let i = 0; i < l; i++) {
        if (data[i].ImeiLength != 0 && data[i].Details.length < data[i].ProCount) {
          showTips('串号需要全部录入才能提交，请检查录入', 'error');
          return;
        }
      }
      let me = this;
      // console.log(this.dataIn.snlist);
      fetchData({
        api: this.apiList.submit,
        para: {
          code: this.code,
          Imeis: this.dataIn.snlist
        },
        callback(data) {
          me.show = false;
          me.$dispatch('on-after-submit');
        }
      })
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
        formDataUpload({
          url: this.dataIn.server + '/Api/Imei/Upload',
          obj: this.$el.querySelector('.import-sn'),
          type: 'xlsx,xls',
          callback(data) {
            let Details = [];
            me.dataIn.datalist.forEach(item => {
              if (item.ImeiLength > 0 && item.ProCount > item.Details.length) {
                let objTemp = {};
                objTemp.ProCount = item.ProCount - item.Details.length;
                objTemp.ProId = item.ProId;
                objTemp.ProName = item.ProName;
                Details.push(objTemp);
              }
            });
            //
            let para = {
                Files: data.Message,
                Pros: Details,
                BillCode: me.code
              }
              // console.log(para);
            fetchData({
              API: '/Api/Imei/Import',
              para,
              callback(data) {
                // console.log(data);
                let arrOk = [];
                let arrError = [];
                for (let i = 0; i < data.length; i++) {
                  if (data[i].Status == 0) {
                    arrError.push(data[i]);
                  } else {
                    arrOk.push(data[i])
                  }
                };
                if (arrOk.length || arrError.length) {
                  let htmlStr = '<p>成功导入' + '<span class="text-ok"> ' + arrOk.length + '</span> 条 </span>' + '失败' + '<span class="text-danger"> ' +
                    arrError.length + '</span> 条</p>';

                  let htmlList = ''
                  if (arrError.length) {
                    htmlList = '';
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
