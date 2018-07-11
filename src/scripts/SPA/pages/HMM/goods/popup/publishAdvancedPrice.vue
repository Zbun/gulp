<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{curItem.SpecName}}高级价格</h2>
        <div class="body">
          <div class="content" style="width:800px">
            <div class="tab-switcher">
              <div class="title clearfix">
                <a href="javascript:;" class="fr highlight" @click="add">+新增价格</a>
                <span class="item" :class="{on:curIndex==index}" v-for="(item,index) in editItem.SkuPrice" @click="switchTab(index)">价格{{index+1}} <span title="删除价格" @click="delPrice(index)">&times;</span></span>
              </div>
              <div class="content">
                <div class="item" v-for="(item,index) in editItem.SkuPrice" :class="{on:curIndex==index}">
                  <div class="set">
                    <dl class="item">
                      <dt class="title">
                        阶梯价格
                      </dt>
                      <dd class="content">
                        <label class="radio">
                          <input type="radio" value="1" v-model="item.PriceType"><span class="icon"></span>一级价</label>
                        <label class="radio">
                          <input type="radio" value="2" v-model="item.PriceType"><span class="icon"></span>二级价</label>
                        <label class="radio">
                          <input type="radio" value="3" v-model="item.PriceType"><span class="icon"></span>三级价</label>
                      </dd>
                    </dl>
                    <dl class="item">
                      <dt class="title">
                        一级价格
                      </dt>
                      <dd class="content">
                        <input type="text" :value="1" placeholder="" class="com-ipt small" readonly=""> 至
                        <input type="text" value="无限大" readonly class="com-ipt small" v-show="item.PriceType==1">
                        <input type="text" placeholder="请输入台数" v-if="item.PriceType>1" v-model="item.ProCount1" data-validate="show required posInteger" class="com-ipt small"> 台
                        <input type="text" placeholder="请输入价格" data-validate="show required money positive" v-model="item.ProPrice1" class="com-ipt small ml20"> 元
                      </dd>
                    </dl>
                    <dl class="item" v-if="item.PriceType>1">
                      <dt class="title">二级价格</dt>
                      <dd class="content">
                        <input type="text" :value="item.ProCount1-0+1" placeholder="" class="com-ipt small" readonly=""> 至
                        <input type="text" value="无限大" readonly class="com-ipt small" v-show="item.PriceType==2">
                        <input type="text" placeholder="请输入台数" v-if="item.PriceType>2" v-model="item.ProCount2" data-validate="show required posInteger" class="com-ipt small"> 台
                        <input type="text" placeholder="请输入价格" data-validate="show required money positive" v-model="item.ProPrice2" class="com-ipt small ml20"> 元
                      </dd>
                    </dl>
                    <dl class="item" v-if="item.PriceType>2">
                      <dt class="title">三级价格</dt>
                      <dd class="content">
                        <input type="text" :value="item.ProCount2-0+1" placeholder="" class="com-ipt small" readonly=""> 至
                        <input type="text" value="无限大" readonly class="com-ipt small"> 台
                        <input type="text" placeholder="请输入价格" data-validate="show required money positive" v-model="item.ProPrice3" class="com-ipt small ml20"> 元
                      </dd>
                    </dl>
                    <dl class="item">
                      <dt class="title">
                        客户级别
                      </dt>
                      <dd class="content">
                        <label class="checkbox-plus" v-for="objC in dataIn.arrCustomerLevelList">
                          <input type="checkbox" :value="objC.Id" v-model="item.CustomerLevelId">
                          <span class="text">{{objC.Name}}</span>
                        </label>
                        <label class="checkbox">
                          <input type="checkbox" :checked="item.CustomerLevelId.length==dataIn.arrCustomerLevelList.length" @change="changeAllCustomerLevel($event,item)">全部<span class="icon"></span></label>
                      </dd>
                    </dl>
                    <dl class="item">
                      <dt class="title">
                        定向省份
                      </dt>
                      <dd class="content">
                        <div class="border-box radius-box p5">
                          <label class="checkbox">
                            <input type="checkbox" :checked="item.AreaCodes.length==dataIn.arrArea.length" @change="changeAllArea($event,item)">全部<span class="icon"></span></label>
                          <label class="checkbox" v-for="area in dataIn.arrArea">
                            <input type="checkbox" v-model="item.AreaCodes" :value="area.AreaCode">{{area.AreaName}}<span class="icon"></span></label>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">确定</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: { twoway: true, default: false },
    sId: '', //供应商ID
    curItem: {}
  },
  data() {
    return {
      editItem: {
        SkuPrice: []
      },
      curIndex: 0,
      objMetaPrice: {
        PriceType: 1, //定价类别
        IsHaveHighGradePrice: '1', //
        ProCount1: 1,
        ProPrice1: '',
        ProCount2: '',
        ProPrice2: '',
        ProCount3: 0, //永远为0
        ProPrice3: '',
        CustomerLevelId: [], //客户级别
        IsLimitArea: 1,
        AreaCodes: [], //定向省份
      },
      dataIn: {
        arrArea: [],
        arrCustomerLevelList: [],
      }
    }
  },
  components: {},
  computed: {},
  methods: {
    switchTab(index) { //选项卡切换
      this.curIndex = index;
    },
    add() { //新增价格
      let l = this.editItem.SkuPrice.length;
      this.editItem.SkuPrice.push(Object.assign({}, this.objMetaPrice));
      this.curIndex = l;
    },
    delPrice(index) {
      this.editItem.SkuPrice.splice(index, 1);
      setTimeout(() => {
        this.curIndex = --index;
      })
    },
    changeAllCustomerLevel(e, item) {
      let isChked = e.target.checked;
      if (isChked) {
        item.CustomerLevelId = this.dataIn.arrCustomerLevelList.map(el => el.Id);
      } else {
        item.CustomerLevelId = [];
      }
    },
    changeAllArea(e, item) {
      let isChked = e.target.checked;
      if (isChked) {
        item.AreaCodes = this.dataIn.arrArea.map(el => el.AreaCode);
      } else {
        item.AreaCodes = [];
      }
    },

    getAreaList() { //根据供应商ID获取区域信息
      fetchData({
        hideLoading: true,
        API: '/api/Supplier/GetSupplierCompanyDeliveryAreaProvinceList',
        para: {
          Id: this.sId,
        },
        callback: data => {
          this.dataIn.arrArea = data;
        }
      })
    },
    getCustomerLevelList() { //获取用户级别列表
      fetchData({
        API: '/api/Supplier/GetSupplierCustomerLevelForSelect',
        callback: data => {
          this.dataIn.arrCustomerLevelList = data;
        }
      })
    },
    onSubmit_Click() {
      if (this.editItem.SkuPrice.length && !zmm_validator(this.$el.querySelector('.tab-switcher .content .on'))) { //数据必填校验
        return;
      }

      let arrAllPreAreaCode = [];
      for (let i = 0; i < this.editItem.SkuPrice.length; i++) {
        let curItem = this.editItem.SkuPrice[i];

        if (curItem.PriceType == 1) { //选择阶梯价格时，后续台数及价格需要处理为0
          curItem.ProCount1 = curItem.ProCount2 = curItem.ProPrice2 = curItem.ProPrice3 = 0;
        }
        if (curItem.PriceType == 2) {
          curItem.ProCount2 = curItem.ProPrice3 = 0;
        }

        if (!curItem.ProPrice1) {
          showTips(`价格${i+1}一级价格金额需要填写`, 'warning');
          return;
        }

        if (curItem.PriceType > 1) { //处理阶梯价格为2、3时数据判断
          if (!curItem.ProCount1 || curItem.ProCount1 < 2) {
            showTips(`价格${i+1}一级价格结束台数必填且需要大于起始台数`, 'warning');
            return;
          }
          if (!curItem.ProPrice2 || curItem.ProPrice1 <= curItem.ProPrice2 - 0) {
            showTips(`价格${i+1}二级价格金额必填且需要小于一级价格金额`, 'warning');
            return;
          }
          if (curItem.PriceType == 3) {
            if (!curItem.ProCount2 || curItem.ProCount2 <= curItem.ProCount1 - 0) {
              showTips(`价格${i+1}二级价格台数必填且需要大于一级价格台数`, 'warning');
              return;
            }
            if (!curItem.ProPrice3 || curItem.ProPrice2 <= curItem.ProPrice3 - 0) {
              showTips(`价格${i+1}三级价格金额必填且需要小于二级价格金额`, 'warning');
              return;
            }
          }
        }

        for (let j = 0; j < curItem.AreaCodes.length; j++) {
          if (arrAllPreAreaCode.indexOf(curItem.AreaCodes[j]) > -1) {
            showTips(`价格${i+1}定向省份在前置价格中已存在，请重选`, 'warning');
            return;
          }
        }
        arrAllPreAreaCode.push(...curItem.AreaCodes);

      }

      this.curItem.SkuPrice = this.editItem.SkuPrice;
      this.onCancel_Click();
    },
    onCancel_Click() {
      this.show = false;
      this.$emit('update:show', false);
    }
  },
  created() {},
  watch: {
    show(newVal) {
      if (newVal) {
        // this.editItem.SkuPrice = this.curItem.SkuPrice;
        this.editItem = JSON.parse(JSON.stringify(this.curItem));
        this.getAreaList();
        this.curIndex = 0;
        if (this.dataIn.arrCustomerLevelList.length == 0) {
          this.getCustomerLevelList();
        }
        if (this.editItem.SkuPrice.length == 0) {
          this.editItem.SkuPrice.push(Object.assign({}, this.objMetaPrice));
        }
      }
    }
  }
}
</script>