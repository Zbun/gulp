<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>付款明细</h2>
        <div class="body">
          <div class="content" style="width:800px">
            <p class="bg bg-warning mb20">
              <span class="fr">&#8744; 共<b class="text-warning"> {{datalist.length}} </b>个付款单</span><b>来源单号：{{datalist[0].BillCode||'无'}}</b></p>
            <div class="invoices" v-for="item of datalist">
              <h2 class="header m10">付款单</h2>
              <!--               <p class="invoices-summary">
                <strong class="ml20 text-warning">付款单号：{{item.PayNumber}}</strong>
              </p> -->
              <div class="invoices-detail">
                <div>
                  <table class="table-intro">
                    <tbody>
                      <tr>
                        <td style="width:50%">
                          <span class="title">
                            供应商：
                          </span>
                          <span class="content">
                          {{item.SupplierName}}
                          </span>
                        </td>
                        <td>
                          <span class="title">付款金额：</span>
                          <span class="content">
                            {{item.PayAmount|money}}
                          </span>
                          <span class="title">类型：</span>
                          <span class="content">
                            {{item.PayType|cashType}}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <span class="title">
                            备注：
                          </span>
                          <span class="content">
                            {{item.Description}}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="title">
                            付款人：
                          </span>
                          <span class="content">
                            {{item.UserNameAdded}}
                          </span>
                        </td>
                        <td>
                          <span class="title">
                            付款日期：
                          </span>
                          <span class="content">
                            {{item.DateAdded|datetime}}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 待付款订单明细
 * zhao.liubin@zol.com.cn
 * 2016-12-2
 */
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    billCode: '',
    datalist: []
  },
  data() {
    return {}
  },
  methods: {
    initPageData() {},
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {}
}
</script>
