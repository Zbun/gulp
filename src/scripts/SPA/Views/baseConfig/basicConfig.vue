<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        基础配置
      </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="content">
          <div class="basic-config">
            <div>
              <div class="basic-item">
                <b>库存设置</b>
              </div>
              <div class="basic-content">
                <ul class="basic-content-list">
                  <li>
                    <label class="checkbox">
                      <input type="checkbox" class="chk" v-model="dataIn.datalist.SyncAmountToSource">
                      <span class="icon"></span>
                      <span class="text">是否同步2B</span>
                    </label>
                  </li>
                  <li>
                    <label class="checkbox">
                      <input type="checkbox" class="chk" v-model="dataIn.datalist.Config_Stock_IsMinus">
                      <span class="icon"></span>
                      <span class="text">允许负库存</span>
                    </label>
                  </li>
                  <li>
                    <label class="checkbox">
                      <input type="checkbox" class="chk" v-model="dataIn.datalist.Config_Stock_IsSubtractByOut">
                      <span class="icon"></span>
                      <span class="text">出库减库存</span>
                    </label>
                  </li>
                  <li>
                    <label class="checkbox">
                      <input type="checkbox" class="chk" v-model="dataIn.datalist.Config_Stock_IsUnderCostByOut">
                      <span class="icon"></span>
                      <span class="text">低于成本价出库</span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <div class="basic-item">
                <b>结算方式</b>
              </div>
              <div class="basic-content">
                <ul class="basic-content-list">
                  <li v-for="(k,v) in payType">
                    <label class="checkbox">
                      <input type="checkbox" class="chk" :value="k" v-model="payTypeList">
                      <span class="icon"></span>
                      <span class="text">{{v}}</span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <div class="basic-item">
                <b>提醒设置</b>
              </div>
              <div class="basic-content">
                <ul class="basic-content-list">
                  <li>
                    <label class="checkbox">
                      <input type="checkbox" class="chk" v-model="checkedStockAge">
                      <span class="icon"></span>
                      <span class="text">库龄天数</span>
                    </label>
                    <span class="currency-box">
                        <input type="text" placeholder="" class="ipt-currency" v-model="dataIn.datalist.Config_Remind_StockAge | numberIn">
                        <span class="line"></span>
                    </span>
                  </li>
                  <li>
                    <label class="checkbox">
                      <input type="checkbox" class="chk" v-model="checkedAccountAge">
                      <span class="icon"></span>
                      <span class="text">账龄</span>
                    </label>
                    <span class="currency-box">
                        <input type="text" placeholder="" class="ipt-currency" v-model="dataIn.datalist.Config_Remind_AccountAge | numberIn">
                        <span class="line"></span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <div class="basic-item">
                <b>成本核算方法</b>
              </div>
              <div class="basic-content">
                <ul class="basic-content-list ml5">
                  <li>
                    <label class="radio">
                      <input type="radio" class="chk" value="1" v-model="dataIn.datalist.Config_CostAdjust">
                      <span class="icon"></span>
                      <span class="text">加权平均</span>
                    </label>
                  </li>
                  <li>
                    <label class="radio">
                      <input type="radio" class="chk" value="2" v-model="dataIn.datalist.Config_CostAdjust">
                      <span class="icon"></span>
                      <span class="text">先进先出</span>
                    </label>
                  </li>
                  <li>
                    <label class="radio">
                      <input type="radio" class="chk" value="3" v-model="dataIn.datalist.Config_CostAdjust">
                      <span class="icon"></span>
                      <span class="text">个别计价</span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <div class="basic-item">
                <b>交易方式</b>
              </div>
              <div class="basic-content">
                <ul class="basic-content-list ml5">
                  <li>
                    <label class="radio">
                      <input type="radio" class="chk" value="1" v-model="dataIn.datalist.PayFirst">
                      <span class="icon"></span>
                      <span class="text">先款后货</span>
                    </label>
                  </li>
                  <li>
                    <label class="radio">
                      <input type="radio" class="chk" value="2" v-model="dataIn.datalist.PayFirst">
                      <span class="icon"></span>
                      <span class="text">先货后款</span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <div class="basic-item">
                <b>账户使用规则</b>
              </div>
              <div class="basic-content" style="padding-bottom:20px;">
                <div class="pl20">用户使用账户规则优先顺序</div>
                <table class="table-basic-config table text-center table-bordered ml20 mt5">
                  <tbody>
                    <tr v-for="(index,item) in guide">
                      <td>{{index+1}}</td>
                      <td>{{item.v}}</td>
                      <td>
                        <i title="下移" class="icon icon-down" v-if="index==0" @click.stop="down_Click(item,index)"></i>
                        <template v-if="index>0 && index<guide.length-1">
                          <i title="上移" class="icon icon-up" @click.stop="up_Click(item,index)"></i>
                          <i title="下移" class="icon icon-down" @click.stop="down_Click(item,index)"></i>
                        </template>
                        <i title="上移" class="icon icon-up" v-if="index==guide.length-1" @click.stop="up_Click(item,index)"></i>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="text-center mt20 mb20">
            <button class="btn btn-primary" @click="submitData">
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataIn: {
        datalist: {}
      },
      payType: dictionary.payType,
      //选择的结算方式
      payTypeList: [],
      guide: []
    }
  },
  computed: {
    checkedStockAge() {
      return this.dataIn.datalist.Config_Remind_StockAge != 0;
    },
    checkedAccountAge() {
      return this.dataIn.datalist.Config_Remind_AccountAge != 0;
    }
  },
  methods: {
    down_Click(item, index) {
      let obj = this.guide[index + 1];
      this.guide.$set(index + 1, item);
      this.guide.$set(index, obj);
    },
    up_Click(item, index) {
      let obj = this.guide[index - 1];
      this.guide.$set(index - 1, item);
      this.guide.$set(index, obj);
    },
    getBasicConfigData() {
      fetchData({
        api: '/Api/User/GetCompanyBaseConfig',
        para: {},
        callback: data => {
          //是否同步2B
          data.SyncAmountToSource = data.SyncAmountToSource == 1;
          //是否允许负库存
          data.Config_Stock_IsMinus = data.Config_Stock_IsMinus == 1;
          //是否出库减库存
          data.Config_Stock_IsSubtractByOut = data.Config_Stock_IsSubtractByOut == 1;
          //是否低于成本价出库
          data.Config_Stock_IsUnderCostByOut = data.Config_Stock_IsUnderCostByOut == 1;
          if (data.Config_AccountingType != 0) {
            this.payTypeList = data.Config_AccountingType.split(',');
          }
          if (data.PaymentOrder) {
            let arr = data.PaymentOrder.split(',');
            let guide = this.guide;
            this.guide = [];
            arr.forEach((item) => {
              guide.forEach((g) => {
                if (item == g.k) {
                  this.guide.push(g)
                }
              })
            })
          }
          this.dataIn.datalist = data;
        }
      })
    },
    submitData() {
      let para = this.$data.dataIn.datalist;
      para.SyncAmountToSource = para.SyncAmountToSource ? 1 : 0;
      para.Config_Stock_IsMinus = para.Config_Stock_IsMinus ? 1 : 0;
      para.Config_Stock_IsSubtractByOut = para.Config_Stock_IsSubtractByOut ? 1 : 0;
      para.Config_Stock_IsUnderCostByOut = para.Config_Stock_IsUnderCostByOut ? 1 : 0;
      para.Config_AccountingType = this.payTypeList.join(',');
      para.PaymentOrder = (() => {
        let arr = [];
        this.guide.forEach((item) => {
          arr.push(item.k)
        });
        return arr.join(',');
      })();
      fetchData({
        api: '/Api/User/CompanyBaseConfig',
        para,
        callback: data => {
          localStorage.Config_AccountingType = para.Config_AccountingType;
        }
      })
    }
  },
  created() {
    this.guide = (() => {
      let arr = [];
      for (let type in dictionary.cashType) {
        arr.push({
          k: type,
          v: dictionary.cashType[type]
        })
      }
      return arr;
    })();
    this.getBasicConfigData();
  }
}
</script>
