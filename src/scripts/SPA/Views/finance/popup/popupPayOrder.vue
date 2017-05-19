<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>付款</h2>
        <div class="body">
          <div class="content" style="width:800px">
            <div class="invoices">
              <h2 class="header">付款单</h2>
              <div class="invoices-detail mt20">
                <table class="table-intro lh36">
                  <tr>
                    <td style="width:60%">
                      <span class="title">&#12288;&#12288;供应商：</span>
                      <span class="content">{{dataIn.datalist.SupplierName}}</span>
                    </td>
                    <td><span class="title">来源单号：</span>
                      <span class="content">{{dataIn.datalist.BillCode}}</span></td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div class="table-in-wrapper">
                        <table class="table-in-table">
                          <tr>
                            <td style="width:60%">
                              <b class="title">
                          <b>
                          待付款总额：
                          </b>
                              </b>
                              <b class="content">
                          {{dataIn.datalist.Amount|money}}
                          </b>
                            </td>
                            <td>
                              &nbsp;
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2">
                              <div class="divider-dashed thin"></div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span class="title">
                            &#12288;已付金额：
                          </span>
                              <span class="content">
                            {{dataIn.datalist.AmountPayed|money}}
                             <span class="ml10" v-if="computedCashType">（{{computedCashType}}
                                ）
                              </span>
                              </span>
                            </td>
                            <td>
                              &nbsp;
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span class="title">
                            &#12288;本次应付：
                          </span>
                              <span class="content">
                            {{computedShouldPay|money}}
                            <span class="line"></span>
                              </span>
                            </td>
                            <td>
                              <span>
                                <span class="title">本次实付：</span>
                              <span class="content">
                            <span class="currency-box"><i class="icon">￥</i><input type="text" placeholder="输入金额"  v-model="dataOut.PayAmount|currencyIn" class="ipt-currency col-statistics">
                            <span class="line"></span></span>
                              </span>
                              </span>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <span class="title">&#12288;&#12288;&#12288;备注：</span>
                      <span class="content">
                        <span class="currency-box">
                          <input type="text" placeholder="输入备注" v-model="dataIn.datalist.Description" class="ipt-currency" style="width:547px;">
                          <span class="line"></span>
                      </span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span class="title text-right">
                        &#12288;&#12288;付款人：
                      </span>
                      <span class="content">
                        <span class="currency-box">
                          <input type="text" :value="dataIn.userName" class="ipt-currency" readonly="">
                          <span class="line"></span>
                      </span>
                      </span>
                    </td>
                    <td>
                      <span class="title">
                        付款日期：
                      </span>
                      <span class="content">
                        <span class="currency-box">
                          <input type="text" readonly v-model="DatePay" class="ipt-currency">
                          <span class="line"></span>
                      </span>
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onOk_Click($event)">确认</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
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
    billCode: ''
  },
  data() {
    return {
      DatePay: zmm_date.nowDate().ymdhmms,
      dataIn: {
        userName: '',
        datalist: {}
      },
      dataOut: {
        PayAmount: '',
      }
    }
  },
  computed: {
    computedShouldPay() {
      return (this.dataIn.datalist.Amount - this.dataIn.datalist.AmountPayed).toFixed(2);
    },
    computedCashType() {
      let objTemp = [];
      this.dataIn.datalist.PayDetails.forEach(item => {
        let str1 = item.PayType in dictionary['cashType'] ? dictionary['cashType'][item.PayType] : '其它';
        objTemp.push(str1 + '：' + item.PayAmount || '');
      });
      return objTemp.join('，');
    }
  },
  components: {},
  methods: {
    initPageData() {
      let me = this;
      this.dataIn.userName = localStorage.userName;
      fetchData({
        api: '/api/Finance/APPreview',
        para: {
          billcode: this.billCode
        },
        callback(data) {
          me.dataIn.datalist = data;
          me.dataOut.PayAmount = (data.Amount - data.AmountPayed).toFixed(2);

        }
      })
    },
    onOk_Click(e) {
      let me = this;
      var realPay = this.dataOut.PayAmount;

      if (validatorManu.isEmpty(realPay)) {
        showTips('请填写要付的金额数', 'error');
        return;
      }
      if (this.computedShouldPay > 0) {
        if (realPay < 0) {
          showTips('当应付为正时，实付也需要为正，请检查', 'error');
          return;
        }
      } else {
        if (realPay > 0) {
          showTips('当应付为负时，实付也需要为负，请检查', 'error');
          return;
        }
        if (realPay < this.computedShouldPay) {
          showTips('实付为负时，实付金额应不小于应付金额，请检查', 'error');
          return;
        }
      }

      let para = {};
      para.id = this.dataIn.datalist.SupplierId;
      let objTemp = {};
      objTemp.BillCode = this.dataIn.datalist.BillCode;
      objTemp.PayAmount = realPay;
      objTemp.Description = this.dataIn.datalist.Description;
      para.Details = [objTemp];
      fetchData({
        target: e.target,
        api: '/api/Finance/APPay',
        para,
        callback() {
          me.$dispatch('on-after-submit');
        }
      })
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
      }
    }
  }
}
</script>
