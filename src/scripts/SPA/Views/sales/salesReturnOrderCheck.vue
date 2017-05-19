<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div>
        查看销售退货单
        </h1>
    <div class="content-field invoices">
      <h2 class="header">销售退货单</h2>
      <p class="invoices-summary">
        <strong class="ml20 text-warning">退货单号：{{dataIn.datalist.Code}}</strong>
      </p>
      <div class="invoices-detail">
        <div>
          <table class="table-intro">
            <tbody>
              <tr>
                <td>
                  <span class="title">
                    客户：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.CustomerName}}
                  </span>
                </td>
                <td>
                  <span class="title">
                    退款金额：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.TotalPrice|currency}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">
                    入库机构：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.BranchName}}&nbsp;
                  </span>
                </td>
                <td>
                  <span class="title">
                    入库分仓：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.StoreName}}&nbsp;
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-list">
          <table class="table table-bordered table-hover  text-center">
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
                <td colspan="4" class="text-right"><b>合计：</b></td>
                <td><b>{{goodsAddedCount}}</b></td>
                <td class="text-right"><b>{{dataIn.datalist.TotalPrice|currency}}</b></td>
                <td></td>
              </tr>
            </tfoot>
            <tbody>
              <tr v-for="item of dataIn.datalist.Details">
                <td class="text-nowrap">
                  {{item.ProId}}
                </td>
                <td>
                  {{item.CategoryName}}
                </td>
                <td>{{item.ProName}}<i class="icon-gift" v-if="item.ProType==0">礼</i></td>
                <td class="text-nowrap text-right">{{item.ProPrice|currency}}</td>
                <td class="text-nowrap">{{item.ProCount}}</td>
                <td class="text-nowrap text-right">{{(item.ProPrice * item.ProCount)|currency}}</td>
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
                  <span class="title">
                    备注：
                  </span>
                  <span class="content">
                    {{dataIn.datalist.Description}}
                  </span>
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
        curCode: '',
        dataIn: {
          datalist: {}
        }
      }
    },
    computed: {
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
      },
      goodsAddedCount() {
        var count = 0;
        this.dataIn.datalist.Details.forEach(function(i) {
          count += parseInt(i.ProCount);
        });
        return count;
      },
    },
    methods: {
      initPageData() {
        var me = this;
        this.curCode = me.$route.params.srocCode;
        fetchData({
          API: '/Api/RSalesContract/Preview',
          para: {
            'code': this.curCode
          },
          callback(data) {
            // console.log(data);
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
