<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>收款明细</h2>
        <div class="body">
          <div class="content" style="width:800px">
            <p class="bg bg-warning mb20">
              <span class="fr">&#8744; 共<b class="text-warning"> {{datalist.length}} </b>个收款单</span><b>来源单号：{{billCode}}</b></p>
            <div class="invoices" v-for="item of datalist">
              <h2 class="header m10">收款单</h2>
              <!--               <p class="invoices-summary">
                <strong class="ml20 text-warning">收款单号：{{item.ReceiveNumber}}</strong>
              </p> -->
              <div class="invoices-detail">
                <div>
                  <table class="table-intro">
                    <tbody>
                      <tr>
                        <td>
                          <span class="title">
                            &#12288;&#12288;客户：
                          </span>
                          <span class="content">
                          {{item.CustomerName}}
                          </span>
                        </td>
                        <td>
                          <span class="title">
                            收款金额：
                          </span>
                          <span class="content">
                            {{item.PayAmount|money}}
                          </span>
                          <span class="title">
                            类型：
                          </span>
                          <span class="content">
                            {{item.PayType|cashType}}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <span class="title">
                            &#12288;&#12288;备注：
                          </span>
                          <span class="content">
                            {{item.Description}}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="title">
                            &#12288;收款人：
                          </span>
                          <span class="content">
                            {{item.UserNameAdded}}
                          </span>
                        </td>
                        <td>
                          <span class="title">
                            收款日期：
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
 * 弹出层收款明细
 * zhao.liubin@zol.com.cn
 * 2016-12-8
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
