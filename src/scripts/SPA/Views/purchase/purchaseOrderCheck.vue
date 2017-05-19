<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div>
        查看采购单
        </h1>
    <div class="content-field invoices">
      <!--       <button class="btn btn-default fr" @click="print_Click()">
        打印
      </button> -->
      <h2 class="header">采购单</h2>
      <p class="invoices-summary">
        <strong class="ml20 text-warning">单号：{{dataIn.datalist.Code}}</strong>
      </p>
      <div class="invoices-detail">
        <div>
          <table class="table-intro">
            <tbody>
              <tr>
                <td>
                  <span class="title">
                    供应商家：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.SupplierName}}
                  </span>
                </td>
                <td>
                  <span class="title">
                    收货机构：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.BranchName}}
                  </span>
                </td>
                <td>
                  <span class="title">
                    收货分仓：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.StoreName}}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="title">
                    结算方式：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.PayType|payType}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">是否发票：</span>
                  <span class="content">
                    {{dataIn.datalist.Receipt==1?'是':'否'}}
                  </span>
                </td>
                <td>
                  <span class="title">
                    &#12288;经手人：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.HandlerName}}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-list">
          <table class="table table-bordered text-center">
            <thead>
              <tr>
                <th>商品编码</th>
                <th>品牌</th>
                <th>商品名称</th>
                <th>标准</th>
                <th>单价（元）</th>
                <th>数量</th>
                <!--                 <th>税率</th>
                <th>单件税额</th>
                <th>总税额</th> -->
                <th>小计（元）</th>
                <th>备注</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td colspan="5" class="text-right"><b>合计：</b></td>
                <td><b>{{goodsAddedCount}}</b></td>
                <td class="text-right"><b>{{dataIn.datalist.TotalPrice|currency}}</b>
                  <p v-for="item in dataIn.datalist.PayDetails" class="font-small">
                    <i class="icon icon-minus"></i> {{item.PayTitle}}：{{item.PayAmount|currency}}
                  </p>
                </td>
                <td></td>
              </tr>
              <tr class="noborder-lr">
                <td colspan="6"></td>
                <td style="padding:5px 0;">
                  <p class="col-statistics text-nowrap text-right p10">
                    应付金额：<em class="font-bigger text-bold text-warning">{{dataIn.datalist.FinalPrice|currency}}</em>
                  </p>
                </td>
                <td></td>
              </tr>
            </tfoot>
            <tbody>
              <tr v-for="item of dataIn.datalist.Details">
                <td>
                  <p class="text-nowrap">
                    {{item.ProId}}
                  </p>
                </td>
                <td>
                  {{item.CategoryName}}
                </td>
                <td>{{item.ProName}}<i class="icon-gift" v-if="item.ProType==0">礼</i></td>
                <template v-if="item.ProType==1">
                  <td>
                    <p class="text-nowrap">
                      {{item.Standard|SNStandard}}
                    </p>
                  </td>
                  <td v-if="item.ProType==1">
                    <p class="text-nowrap text-right">{{item.ProPrice|currency}}</p>
                  </td>
                </template>
                <template v-else>
                  <td v-else>/</td>
                  <td v-else>/</td>
                </template>
                <td>
                  <p class="text-nowrap">{{item.ProCount}}</p>
                </td>
                <td v-if="item.ProType==1">
                  <p class="text-nowrap text-right">{{item.ProCount*item.ProPrice|currency}}</p>
                </td>
                <td v-else>/</td>
                <td>{{item.Description?item.Description:'暂无'}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-po-status" :class="'bg-po-status-'+dataIn.datalist.Status">
          <i class="icon"></i>
        </div>
        <div class="made-info">
          <table class="table-intro">
            <tbody>
              <tr>
                <td>
                  <span class="title">
                    &#12288;制单人：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.UserNameAdded}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">制单时间：</span>
                  <span class="content">{{dataIn.datalist.DateAdded|datetime}}</span>
                </td>
                <td>
                  <span class="title">备注：</span>
                  <span class="content">{{dataIn.datalist.Description}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="audit-list show" v-if="dataIn.datalist.StateFlow.length>0">
        <div class="title">
          记录：
        </div>
        <ul class="flow-list">
          <li class="item" v-for="item in dataIn.datalist.StateFlow">
            <span class="cell">
            {{item.Status|flowStatus}}
          </span>
            <span class="cell">
            {{item.UserNameAdded}}
          </span>
            <span class="cell">
            {{item.DateAdded|datetime}}
          </span>
            <span class="cell">
            {{item.Description}}
          </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        pageindex: 1,
        curCode: '',
        APILIST: {
          PREVIEW: '/API/PurchasingContract/Preview', //预览
        },
        dataIn: {
          datalist: {}
        }
      }
    },
    computed: {
      goodsAddedCount() {
        var count = 0;
        this.dataIn.datalist.Details.forEach(function(i) {
          count += parseInt(i.ProCount);
        });
        return count;
      }
    },
    methods: {
      initPageData() {
        var me = this;
        this.curCode = me.$route.params.pocode;
        fetchData({
          API: this.APILIST.PREVIEW,
          para: {
            'code': this.curCode
          },
          callback(data) {
            // console.log(data);
            me.dataIn.datalist = data;
          }
        })
      },
      print_Click() {
        let me = this;
        fetchData({
          API: '/api/Misc/BillPrint',
          para: {
            code: this.curCode
          },
          callback(data) {
            try {
              var LODOP = getLodop();
              if (LODOP) {
                LODOP.PRINT_INIT("打印采购单");
                LODOP.SET_PRINT_STYLE("FontSize", 14);
                LODOP.SET_PRINT_STYLE("Bold", 1);
                for (let i = 0; i < data.length; i++) {
                  LODOP.NewPage();
                  LODOP.ADD_PRINT_HTM(5, '5%', '90%', '130mm', data[i].PrintContent);
                }
                // LODOP.PREVIEW();
                if (LODOP.CVERSION) {
                  LODOP.On_Return = function(taskID, Value) {
                    if (Value > 0) {
                      fetchData({
                        API: '/API/MISC/PrintCountUpdate',
                        para: {
                          Code: me.curCode
                        },
                        hideTips: true
                      })
                    } else {
                      alert('放弃打印');
                    }
                  };
                  LODOP.PREVIEW();
                } else {
                  if (LODOP.PRINTA()) {
                    alert('直接加入打印队列');
                  } else {
                    alert('直接放弃打印');
                  }
                }
              }
            } catch (e) {
              console.log(e);
            }
          }
        })
      },
    },
    created() {
      this.initPageData();
    }
}
</script>
