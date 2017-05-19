<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{title?title:'发货'}}</h2>
        <div class="body">
          <div class="content" style="width:700px">
            <div class="invoices">
              <h2 class="header">出库单</h2>
              <p class="invoices-summary">
                <strong class="ml20 text-warning">出库单号：{{dataIn.datalist.Code}}</strong>
              </p>
              <div class="invoices-detail">
                <div>
                  <table class="table-intro">
                    <tbody>
                      <tr>
                        <td>
                          <span class="title">
                    销售单号：
                  </span>
                          <span class="content">
                    {{dataIn.datalist.SalesContractCode}}&nbsp;
                  </span>
                        </td>
                        <td>
                          <span class="title">
                    客户：
                  </span>
                          <span class="content">
                    {{dataIn.datalist.CustomerName}}&nbsp;
                  </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="title">
                    发货机构：
                  </span>
                          <span class="content">
                    {{dataIn.datalist.BranchName}}&nbsp;
                  </span>
                        </td>
                        <td>
                          <span class="title">
                    发货分仓：
                  </span>
                          <span class="content">
                    {{dataIn.datalist.StoreName}}&nbsp;
                  </span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <span class="title">
                    收货信息：
                  </span>
                          <span class="text-muted-light">
                    <span class="font-small">（收货人）</span> {{dataIn.datalist.Contact}}
                          <span class="font-small ml30">（电话）</span> {{dataIn.datalist.Phone}}
                          <span class="font-small ml30">（地址）</span> {{dataIn.datalist.Address}}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="table-list">
                  <table class="table table-bordered  text-center">
                    <thead>
                      <tr>
                        <th>商品名称</th>
                        <th>数量</th>
                        <th>已出</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item of dataIn.datalist.Details">
                        <td>{{item.ProName}}</td>
                        <td>{{item.ProCount}}</td>
                        <td>{{item.ProCountOut}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="made-info">
                  <table class="table-intro">
                    <tr>
                      <td>
                        <span class="title">
                          操作人：
                        </span>
                        <span class="content">
                          {{dataIn.datalist.UserNameAdded}}
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              <div class="set">
                <dl class="item">
                  <dt class="title">
                    物流公司
                  </dt>
                  <dd class="content">
                    <select v-model="editInfo.ExpressId">
                      <option :value="item.Id" v-for="item in expressList">{{item.FullName}}</option>
                    </select>
                    <span class="ml10">
                        <select v-model="computedTemplateId">
                          <option value="">请选择</option>
                        <option :value="item.TemplateId" v-for="item of computedArrTemplates">{{item.TemplateName}}</option>
                        </select>
                    <a class="highlight ml5" href="javascript:;" @click="previewTemp_Click()">
                    查看物流模板
                  </a>
                    </span>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title required-mark">物流单号</dt>
                  <dd class="content">
                    <input type="text" data-validate="required show" placeholder="请输入单号" v-model="editInfo.ExpressNum">
                    <button class="ml10 btn btn-default" @click="print_Click()">打印物流单</button>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    备注
                  </dt>
                  <dd class="content">
                    <input type="text" placeholder="请输入备注" class="com-ipt x-large" v-model="editInfo.Description">
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="submit_Click">提交</button>
          <button class="btn btn-default" @click="empty_Click">清空</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    code: '',
    expressList: [],
    title: ''
  },
  data() {
    return {
      dataIn: {
        SERVER: localStorage.APIServer || window.APISERVER,
        datalist: {},
        arrExpressTemplates: [],
      },
      editInfo: {
        Code: '',
        ExpressId: '',
        ExpressName: '',
        ExpressNum: '',
        Description: '',
        Print: 0
      }
    }
  },
  computed: {
    computedExpressName() {
      return _.find(this.expressList, {
        Id: this.editInfo.ExpressId
      }).FullName;
    },
    computedTemplateId() {
      let objCurTemplate = _.find(this.computedArrTemplates, {
        ExpressId: this.editInfo.ExpressId
      });
      if (objCurTemplate) {
        return objCurTemplate.TemplateId
      }
      return '';
    },
    computedArrTemplates() {
      let arrTemp = [];
      let curExpressId = this.editInfo.ExpressId
      this.dataIn.arrExpressTemplates.forEach(item => {
        if (item.ExpressId == curExpressId) {
          arrTemp.push(item);
        }
      })

      return arrTemp;
    },
    computedImgSrc() {
      return this.computedCurTemplate ? (this.dataIn.SERVER + this.computedCurTemplate.TemplateImage) : '';
    },
    computedCurTemplate() {
      return this.dataIn.arrExpressTemplates.length > 0 ? _.find(this.dataIn.arrExpressTemplates, {
        ExpressId: this.editInfo.ExpressId
      }) : '';
    },
  },
  components: {},
  methods: {
    initPageData() {
      var me = this;
      this.editInfo.Print = 0;
      this.editInfo.ExpressId = this.expressList.length > 0 ? this.expressList[0].Id : '';
      fetchData({
        API: '/Api/Invoice/Preview',
        para: {
          'code': this.code
        },
        callback(data) {
          // console.log(data);
          data.Details.forEach(function(item) {
            if (data.Status == 6) {
              item.ProCountOut = item.ProCount;
            } else {
              item.ProCountOut = 0;
            }
          })
          me.dataIn.datalist = data;
          if (data.ExpressId) {
            me.editInfo.ExpressId = data.ExpressId;
            me.editInfo.ExpressNum = data.ExpressNum;
            me.editInfo.Description = data.Description;
          }
        }
      })
    },
    //获取物流模板列表，打印前请求
    getExpressTempates() {
      let me = this;
      fetchData({
        API: '/Api/Misc/CompanyExpressTemplate',
        callback(data) {
          // console.log(data);
          me.dataIn.arrExpressTemplates = data;
        }
      })
    },
    //预览打印模板
    previewTemp_Click() {
      let me = this;
      if (!this.computedTemplateId) {
        showTips('请先选择打印模板', 'error');
        return;
      }
      let curTemplate = _.find(this.dataIn.arrExpressTemplates, {
        ExpressId: this.editInfo.ExpressId
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
    //打印点击
    print_Click() {
      let me = this;
      if (!this.computedTemplateId) {
        showTips('请先选择打印模板', 'error');
        return;
      }
      let img = new Image();
      img.src = this.computedImgSrc;
      img.onload = function() {
        fetchData({
          API: '/Api/Invoice/ExpressTemplate',
          para: {
            code: me.code,
            TemplateId: me.computedTemplateId
          },
          callback(data) {
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
                    // me.initPageData(me.pageindex);
                    me.editInfo.Print = 1;
                  } else {
                    alert('放弃打印');
                  }
                  // console.log(getStatusValue('PRINT_STATUS_OK', Value))
                };
                LODOP.PRINTA();
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
    submit_Click() {
      if (!zmm_validator(this.$el)) {
        return;
      }
      let me = this;
      let para = this.editInfo;
      para.Code = this.code;
      para.ExpressName = this.computedExpressName;
      fetchData({
        API: '/API/Invoice/Express',
        para,
        callback(data) {
          // console.log(data);
          me.show = false;
          me.$dispatch('on-submit-click');
        }
      })
    },
    empty_Click() {
      this.editInfo.ExpressNum = '';
      this.editInfo.Description = '';
    },
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {
    this.getExpressTempates();
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.initPageData();
      }
    }
  }
}
</script>
