<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>串号发票调整</h2>
        <div class="body">
          <div class="content" style="width:600px;">
            <h3 class="mb10 pl10">{{obj.ProName}}</h3>
            <table class="table-invoice-adjust">
              <tbody v-if="dataIn.dataTable.length!=0">
                <tr class="title1">
                  <td colspan=2>采购数量：{{dataIn.dataTable.length}} 台</td>
                  <td colspan=2>调前单价：￥{{obj.ProPrice}}</td>
                  <td></td>
                </tr>
                <tr class="title2">
                  <td colspan=2>本次调整：<span class="ajust-number">{{howMany}}</span> 台</td>
                  <td colspan=2><b>调后单价：
                                <span class="currency-box">
                                  <i class="icon">￥</i>
                                  <input type="text" placeholder="" class="ipt-currency" v-model="price|posCurrencyIn2" >
                                  <span class="line"></span>
                                </span>
                              </td>
                              <td></td>
                            </tr>
                            <tr style="border-bottom:1px solid #dcdcdc;height:35px;">
                              <td>
                                <label class="checkbox">
                                  <input type="checkbox" v-model="checkAll" @change="checkAll_Change">
                                  <span class="icon"></span>
                                  <span class="text">全选</span>
                                </label>
                              </td>
                              <td>串号</td>
                              <td>调后单价（元）</td>
                              <td>调价时间</td>
                              <td>发票</td>
                            </tr>
        
                                <template v-for="item in dataIn.dataTable">
                                  <tr :class="{warning:status4(item).text!='带票'}">
                                    <td>
                                      <label class="checkbox">
                                        <input type="checkbox" v-model="item.isChecked" @change="checkOne_Change(item)" :disabled="status4(item).text!='带票'">
                                        <span class="icon"></span>
                                      </label>
                                    </td>
                                    <td>{{item.Imei}}</td>
                                    <td><span v-if="status4(item).p">{{item.ReceivingPrice?'￥'+item.ReceivingPrice:''}}</span></td>
                                    <td><span v-if="status4(item).t">{{item.DateAdded| datetime}}</span></td>
                                    <td>{{status4(item).text}}</td>
                                  </tr>
                                </template>
                              </tbody>
                              <tbody v-else>
                                <tr>
                                  <td colspan=3>
                                    <div class="data-empty text-center">
                                      <i class="icon"></i>
                                      <p class="font-big text">暂无相关数据</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div class="footer">
                          <!--<div class="text-left" v-if="showCheckAll">
                            <label class="checkbox" style="margin-left:37px;" >
                              <input type="checkbox" v-model="checkAll" @change="checkAll_Change">
                              <span class="icon"></span>
                              <span class="text">全选</span>
                            </label>
                          </div>-->
                          <div class="text-center">
                            <button class="btn btn-primary" :class="{disabled:howMany==0}" @click="onSubmit_Click">确认</button>
                            <button class="btn btn-default" @click="onCancel_Click">取消</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      twoway: true,
      default: false
    },
    obj: Object
  },
  data() {
    return {
      checkAll: false,
      price: '',
      dataIn: {
        dataTable: []
      }
    }
  },
  computed: {
    showCheckAll() {
      return this.dataIn.dataTable.some(item => {
        return item.Enabled == 1
      })
    },
    howMany() {
      let i = 0;
      this.dataIn.dataTable.forEach(item => {
        item.isChecked && i++;
      });
      return i;
    }
  },
  methods: {
    status4(item) {
      // status=1 receipt=0  不带票              显示价格    显示调整时间
      // status=1 receipt=1  带票                不显示价格  不显示时间
      // status>1 storeOutReceipt=0 receipt=0  不带票出库  显示价格    显示时间 调过价
      // status>1 storeOutReceipt=0 receipt=1  不带票出库  不显示价格    不显示时间 没有调过价
      // status>1 storeOutReceipt=1 receipt=0  带票出库    显示价格    显示调整时间 调过价
      // status>1 storeOutReceipt=1 receipt=1  带票出库    不显示价格    不显示调整时间 没有调过价
      let obj = { text: '带票', p: false, t: false };
      if (item.Status == 1) {
        if (item.Receipt == 0) {
          obj.text = '不带票';
          obj.p = obj.t = true;
        }
      } else {
        let outReceipt = item.StoreOutReceipt == 1 ? "带票" : "不带票";
        //调整过发票，已经出库
        obj.text = outReceipt + '出库';
        if (item.Receipt == 0) {
          obj.p = obj.t = true;
        }
      }
      return obj;
    },
    checkOne_Change() {
      let arr = this.dataIn.dataTable.filter(item => {
        return item.Status == 1 && item.Receipt == 1
      })
      this.checkAll = arr.every(item => {
        return item.isChecked === true;
      });
    },
    checkAll_Change() {
      this.dataIn.dataTable.forEach(item => {
        if (item.Status == 1 && item.Receipt == 1)
          item.isChecked = this.checkAll;
      });
    },
    onSubmit_Click() {
      if (!this.howMany) {
        showTips('请至少选择一项进行调整！', 'error');
        return false;
      }
      if (this.price <= 0) {
        showTips('调后价格应大于0！', 'error');
        return false;
      }
      let para = { Details: [] };
      this.dataIn.dataTable.forEach(item => {
        if (item.isChecked) {
          para.Details.push({ Imei: item.Imei, ReceivingPrice: this.price })
        }
      })
      fetchData({
        api: '/Api/Finance/ImeiReceiptUpdate',
        para,
        callback: data => {
          this.checkAll = false;
          this.price = '';
          this.getDataList();
          // setTimeout(() => {
          //   // this.onCancel_Click()
          // }, 1000)
        }
      })
    },
    onCancel_Click() {
      this.show = false;
      this.checkAll = false;
      this.price = '';
    },
    getDataList() {
      fetchData({
        api: '/Api/Finance/ImeiReceiptList',
        para: {
          Code: this.obj.Code,
          ProId: this.obj.ProId
        },
        callback: data => {
          data.Details.forEach(item => {
            item.isChecked = false;
          });
          this.dataIn.dataTable = data.Details;
        }
      })
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.getDataList();
      }
    }
  }
}

</script>
