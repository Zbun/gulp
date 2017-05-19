<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
      <div class="action">
        <a href="javascript:history.back();" class="item">返回</a>
      </div>
      查看调拨单
    </h1>
    <div class="content-field invoices">
      <!--       <button class="btn btn-default fr" @click="print_Click()">
        打印
      </button> -->
      <h2 class="header">调拨单</h2>
      <p class="invoices-summary">
        <strong class="ml20 text-warning">调拨单号：{{dataIn.datalist.Code}}</strong>
      </p>
      <div class="invoices-detail">
        <div>
          <table class="table-intro">
            <tbody>
              <tr>
                <td>
                  <span class="title">
                    调拨类型：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.BillType==0?'同价调拨':'异价调拨'}}
                  </span>
                </td>
                <td>
                  <span class="title">
                    经手人：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.HandlerName}}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="title">
                    调出机构：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.OutBranchName}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">
                    调出分仓：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.OutStoreName}}&nbsp;
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="title">
                    调入机构：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.InBranchName}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">
                    调入分仓：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.InStoreName}}&nbsp;
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
                <th>单价（元）</th>
                <th>数量</th>
                <th>小计（元）</th>
                <th>备注</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td class="text-right" colspan="4"><b>合计：</b></td>
                <td class=""><b class="text-warning">{{computedGoodsAddedCount.Amount}}</b></td>
                <td class="text-right"><b class="text-warning">{{computedGoodsAddedCount.ProPrice|currency}}</b></td>
                <td></td>
              </tr>
            </tfoot>
            <tbody>
              <tr v-for="item of dataIn.datalist.Details">
                <td class="text-nowrap">{{item.ProId}}</td>
                <td>{{item.CategoryName}}</td>
                <td>{{item.ProName}}</td>
                <td class="text-nowrap text-right">{{item.ProPrice|currency}}</td>
                <td class="text-nowrap">{{item.ProCount}}</td>
                <td class="text-nowrap text-right">{{(item.ProCount*item.ProPrice)|currency}}</td>
                <td>{{item.Description}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-po-status" :class="'bg-po-status-'+dataIn.datalist.Status">
          <i class="icon"></i>
        </div>
        <div class="made-info">
          <table class="table-intro">
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
              <td><span class="title">备注：</span>
                <span class="content">
                  {{dataIn.datalist.Description}}
                </span></td>
            </tr>
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
        curCode: '',
        APILIST: {
          PREVIEW: '/Api/TransferContract/Preview',
        },
        dataIn: {
          datalist: {}
        }
      }
    },
    computed: {
      //计算合计数据
      computedGoodsAddedCount() {
        var objTemp = {};
        objTemp.Amount = 0;
        objTemp.ProCostPrice = 0;
        objTemp.ProPrice = 0;
        this.dataIn.datalist.Details.forEach(function(item) {
          let c = !validatorManu.isPosInteger(item.ProCount) ? 0 : item.ProCount;
          objTemp.Amount += parseInt(c);
          objTemp.ProCostPrice += item.ProCostPrice * c;
          objTemp.ProPrice += item.ProPrice * c;
        });
        return objTemp;
      },
      //计算当前调拨类型
      computedBillTypeIsSync() {
        return this.dataIn.datalist.BillType == 0;
      },
      computedAuditString() {
        var arrTemp = [];
        var arrAS = this.dataIn.datalist.AuditingString || [];
        var i = 0;
        if (arrAS && arrAS.length > 0) {
          i = _.findIndex(arrAS, {
            Id: this.dataIn.datalist.CurrentUserId + ''
          });
          for (var j = 0; j <= i; j++) {
            arrAS[j].isAudited = true;
          }
        }
        return arrAS;
      }
    },
    methods: {
      initPageData() {
        var me = this;
        this.curCode = me.$route.params.doCode;
        fetchData({
          API: this.APILIST.PREVIEW,
          para: {
            'code': this.curCode
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
          }
        })
      },
    },
    ready() {
      this.initPageData();
    }
}
</script>
