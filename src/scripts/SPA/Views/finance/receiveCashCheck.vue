<template>
  <div class="main" v-cloak>
    <div class="content-title">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div>查看{{computedAccountType}}收款单
    </div>
    <div class="content-field invoices">
      <h2 class="header">收款单</h2>
      <div class="content-large w70p">
        <p class="pl20"><b class="text-warning">收款单号：{{curCode}}</b></p>
        <div class="invoices-detail  set w6em" style="padding:30px 60px;margin:10px 0;">
          <dl class="item">
            <dt class="title">类型：</dt>
            <dd class="content text-light-muted">
              {{editInfo.CustomerType==0?'供应商':'客户'}}
            </dd>
          </dl>
          <dl class="item">
            <dt class="title">名称：</dt>
            <dd class="content text-light-muted">
              {{editInfo.CustomerName}}
            </dd>
          </dl>
          <dl class=" set item">
            <dt class="title">
              <dd class="content set p20 border-box pl30" style="margin-left:3em">
                <dl class="item">
                  <dt class="title">
                    <b>账户余额：</b>
                    <span v-if="editInfo.AccountType==12">{{editInfo.CashAmount}}</span>
                    <span v-if="editInfo.AccountType==11">{{editInfo.RebateAmount}}</span>
                    <span v-if="editInfo.AccountType==13">{{editInfo.CreditAmount}}</span> 元
                  </dt>
                </dl>
                <dl class="item">
                  <dt class="title">
                    <b>本次收款：</b>
                  </dt>
                  <dd class="content">
                    <span class="currency-box col-statistics">
                      {{editInfo.ChargeAmount}}
                    </span> 元
                    <p class="bg-muted p5 mt5" v-if="editInfo.AccountType==112&&editInfo.ReturnMyCredit==1">
                      <label class="checkbox">
                        <input type="checkbox" disabled checked>冲抵额度<span class="icon"></span></label>
                      <span class="font-small text-light-muted">
                    （应还额度：{{editInfo.CreditDebt}} 元）
                  </span>
                    </p>
                  </dd>
                </dl>
                <dl class="item" v-if="editInfo.AccountType==11">
                  <dt class="title">
                    <b>使用比例：</b>
                  </dt>
                  <dd class="content">
                    {{editInfo.CanUsedRate}} %
                  </dd>
                </dl>
              </dd>
            </dt>
          </dl>
          <dl class="item">
            <dt class="title">备注：</dt>
            <dd class="content text-light-muted">
              {{editInfo.Description}}
            </dd>
          </dl>
          <dl class="item">
            <dt class="title">
              收款人：
            </dt>
            <dd class="content">
              <span class="text-light-muted">{{editInfo.UserNameAdded}}</span>
              <span class="ml30">
                  时间：<span class="text-light-muted">{{editInfo.DateAdded|datetime}}</span>
              </span>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        APILIST: {
          PREVIEW: '/Api/Charge/PREVIEW',
        },
        dataIn: {
          AuditingChked: [],
        },
        curCode: '',
        isUpdating: false, //是更新
        editInfo: {
          Code: ''
        },
      }
    },
    components: {},
    computed: {
      computedAccountType() {
        switch (this.editInfo.AccountType) {
          case 11:
            return '返利';
          case 12:
            return '现金';
          case 13:
            return '额度';
        }
      }
    },
    methods: {
      initPageData() {
        var me = this;
        this.curCode = this.$route.params.receCode || '';
        fetchData({
          API: this.APILIST.PREVIEW,
          para: {
            'code': this.curCode,
          },
          callback(data) {
            me.editInfo = data;
            me.editInfo.Code = me.curCode;
            me.dataIn.AuditingChked = data.AuditingChked;
          }
        });
      },
    },
    ready() {
      this.initPageData();
    },
}
</script>
