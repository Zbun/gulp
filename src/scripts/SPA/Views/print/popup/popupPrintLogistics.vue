<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>批打物流单</h2>
        <div class="body">
          <div class="content" style="min-width:600px">
            <div style="padding:0 40px;">
              <section class="set w6em">
                <dl class="item">
                  <dt class="title">
                    剩余打印单号总数
                  </dt>
                  <dd>
                    <span class="text-warning font-big">{{arrChkCode.length}}</span> 个
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title required-mark">
                    打印模板
                  </dt>
                  <dd>
                    <select v-model="filter.TemplateId">
                      <option :value="item.TemplateId" v-for="item of arrExpressTemplates">{{item.TemplateName}}</option>
                    </select>
                    <a class="highlight ml5" href="javascript:;" @click="previewTemp_Click()">
                    查看物流模板
                  </a>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title required-mark">
                    起始单号
                  </dt>
                  <dd>
                    <input type="text" placeholder="输入起始物流单号" data-validate="required show" class="com-ipt large" @keydown.enter="create_Click()" v-model="dataIn.beginCode">
                    <button class="btn btn-default ml5" @click="create_Click()">生成</button>
                  </dd>
                </dl>
              </section>
              <div class="created-express-list border-box  mt5">
                <table class="table text-center">
                  <thead>
                    <tr>
                      <th style="width:12%;">
                        序号
                      </th>
                      <th style="width:44%">
                        物流单号
                      </th>
                      <th style="width:44%">
                        出库单号
                      </th>
                    </tr>
                    <tbody>
                      <tr v-for="item of createdList">
                        <td>
                          {{$index+1}}
                        </td>
                        <td>
                          {{item.ExpressNum}}
                        </td>
                        <td>
                          {{item.Code}}
                        </td>
                      </tr>
                    </tbody>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="print_Click()" :class="{'btn-disabled':isPrinting}">打印</button>
          <button class="btn btn-default" @click="onCancel_Click">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 弹窗-批量打印物流单页面
 * zhao.liubin@zol.com.cn 2017-02-14
 */
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    arrChkCode: [],
    curId: '',
    arrExpressTemplates: []
  },
  data() {
    return {
      isPrinting: false,
      dataIn: {
        SERVER: localStorage.APIServer || window.APISERVER,
        beginCode: ''
      },
      createdList: [],
      APIS: {
        insert: '/Api/Misc/ExpTempInsert',
        update: '/Api/Misc/ExpTempUpdate',
      },
      API: '',
      filter: {
        Name: '',
        ExpressId: '',
        TemplateId: '',
        Image: '',
        Template: ''
      }
    }
  },
  computed: {
    computedCurTemplate() {
      return this.arrExpressTemplates.length > 0 ? _.find(this.arrExpressTemplates, {
        TemplateId: this.filter.TemplateId
      }) : '';
    },
    computedExpressName() {
      return this.computedCurTemplate ? this.computedCurTemplate.ExpressName : '';
    },
    computedImgSrc() {
      return this.computedCurTemplate ? (this.dataIn.SERVER + this.computedCurTemplate.TemplateImage) : '';
    },
    computedTemplateId() {
      return this.computedCurTemplate ? this.computedCurTemplate.TemplateId : '';
    }
  },
  components: {},
  methods: {
    initPagaData() {

    },
    previewTemp_Click() {
      let me = this;
      if (!this.filter.TemplateId) {
        showTips('请先选择打印模板', 'error');
        return;
      }
      let curTemplate = _.find(this.arrExpressTemplates, {
        TemplateId: this.filter.TemplateId
      });
      let imgServer = this.dataIn.SERVER;
      // let img = curTemplate.TemplateImage;
      let htmlTemplate = curTemplate.TemplateContent;
      let img1 = new Image();
      img1.src = this.computedImgSrc;
      let l1 = loading.show();
      img1.onload = function() {
        l1.hide();
        dialog({
          title: '预览物流模板',
          content: `<div class="design-box"><img src="${me.computedImgSrc}"><div class="design-area design-detail">${htmlTemplate}</div></div>`,
        }).showModal();
      };
      img1.onerror = function() {
        l1.hide();
        showTips('该模板可能存在问题，请稍候重试', 'error');
      }
    },
    create_Click() {
      if (!zmm_validator(this.$el)) {
        return;
      }
      if (!validatorManu.isPosInteger(this.dataIn.beginCode)) {
        showTips('起始单号需要输入纯数字，请检查', 'error');
        return;
      }
      let me = this;
      let arrTemp = [];
      let startNum = this.dataIn.beginCode;
      this.arrChkCode.forEach(item => {
        let objTemp = {};
        objTemp.Code = item;
        objTemp.ExpressNum = startNum++;
        arrTemp.push(objTemp);
      });
      this.createdList = [];
      this.createdList = arrTemp;
      // console.log(this.createdList);
    },
    //打印点击
    print_Click() {
      let me = this;

      if (!zmm_validator(this.$el)) {
        return;
      }
      if (this.createdList.length == 0) {
        showTips('请先生成物流单列表', 'error');
        return;
      }
      let img = new Image();
      img.src = this.computedImgSrc;

      img.onload = function() {
        fetchData({
          API: '/Api/SO/ExpressTemplate',
          para: {
            code: me.arrChkCode.join(','),
            TemplateId: me.computedTemplateId
          },
          callback(data) {
            // console.log(data);
            try {
              var LODOP = getLodop();
              LODOP.PRINT_INIT("打印物流单");
              LODOP.SET_PRINT_STYLE("FontSize", 14);
              LODOP.SET_PRINT_STYLE("Bold", 1);
              // console.log(data);
              for (let i = 0; i < data.length; i++) {
                LODOP.NewPage();
                LODOP.ADD_PRINT_HTM(0, 0, img.width + 'mm', img.height + 'mm', data[i].PrintContent);
              }
              if (LODOP.CVERSION) {
                LODOP.On_Return = function(taskID, Value) {
                  // P_ID = Value;
                  if (Value > 0) {
                    me.isPrinting = true;
                    let iS = 0;
                    let fnSend = function() {
                      let para = {};
                      para.TemplateId = me.filter.TemplateId;
                      para.ExpressName = me.computedExpressName;
                      let lenArr = me.createdList.length;
                      para.Code = me.createdList[0].Code;
                      para.ExpressNum = me.createdList[0].ExpressNum;
                      iS++;
                      para.Print = 1;
                      me.createdList.shift();
                      me.arrChkCode.shift();
                      if (0 == me.createdList.length) {
                        me.show = false;
                      }
                      fetchData({
                        API: '/API/SO/InvoiceExpress',
                        para,
                        callback(data) {
                          // console.log(data);

                          me.$dispatch('on-print-click');

                        }
                      })
                      if (iS < lenArr) {
                        setTimeout(fnSend, 2000);
                      }
                    }
                    setTimeout(fnSend, 2000);
                    // me.initPageData(me.pageindex);
                  } else {
                    alert('放弃打印');
                  }
                  // console.log(getStatusValue('PRINT_STATUS_OK', Value))
                };
                LODOP.PREVIEW();
              } else {
                // P_ID = me.LODOP.PRINTA();
                if (LODOP.PRINTA()) {
                  alert('加入打印队列');
                } else {
                  alert('放弃打印');
                }
              }
            } catch (e) {
              console.log(e);
            }
          }
        })
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
        this.isPrinting = false;
        this.dataIn.beginCode = '';
        this.createdList = [];
      }
    },
    arrExpressTemplates(newVal) {
      if (newVal.length) {
        this.filter.TemplateId = newVal[0].TemplateId;
      }
    }
  }
}
</script>
