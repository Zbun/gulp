<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>增加明细</h2>
        <div class="body">
          <div class="content" style="width:900px">
            <button class="btn btn-default fr" @click="reload()">刷新</button>
            <input type="text" placeholder="输入名称关键字" class="com-ipt large" maxlength="50" v-model="dataOut.search.Name" @keydown.enter="initPageData(1)">
            <button class="btn btn-primary ml5" @click="initPageData(1)">搜索</button>
            <div class="select-box-goods mt10 goods-box">
              <div class="list-goods">
                <div class="list-table border-box ">
                  <table class="text-center table table-hover table-odd">
                    <thead>
                      <tr>
                        <th>
                          <label class="checkbox">
                            <input type="checkbox" @change="all_Change($event)" :checked="computedIsAllChecked"><span class="icon"></span></label>
                        </th>
                        <th>商品编码</th>
                        <th>商品名称</th>
                        <th>颜色</th>
                        <th>品牌</th>
                        <th>库存量</th>
                        <th>可用量</th>
                        <th>占用量</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item of dataIn.dataTable">
                        <td>
                          <label class="checkbox">
                            <input type="checkbox" :id="'p'+item.Id" :value="item.Id" @change="proId_Change($event,item)" v-model="arrChkProId"><span class="icon"></span></label>
                        </td>
                        <td class="text-nowrap">
                          <label class="block" :for="'p'+item.Id">{{item.Id}}</label>
                        </td>
                        <td>
                          <label class="text-left block" :for="'p'+item.Id">
                            {{item.Name}}
                          </label>
                        </td>
                        <td class="text-nowrap">
                          <label class="block" :for="'p'+item.Id">{{item.Color}}</label>
                        </td>
                        <td>
                          <label class="text-nowrap block text-left" :for="'p'+item.Id">{{item.Brand}}</label>
                        </td>
                        <td class="text-nowrap">
                          <label class="block" :for="'p'+item.Id">{{item.Amount}}</label>
                        </td>
                        <td>
                          <label class="text-nowrap block" :for="'p'+item.Id">{{item.AmountCanUsed}}</label>
                        </td>
                        <td class="text-nowrap">
                          <label class="block" :for="'p'+item.Id">{{item.Amount-item.AmountCanUsed||0}}</label>
                        </td>
                      </tr>
                      <template v-if="dataIn.inited&&dataIn.dataTable.length>0&&dataIn.dataTable.length<10">
                        <tr v-for="n in 10-dataIn.dataTable.length">
                          <td v-for="n in 8">&nbsp;</td>
                        </tr>
                      </template>
                    </tbody>
                    <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
                      <tr>
                        <td colspan=8>
                          <div class="data-empty">
                            <i class="icon"></i>
                            <p class="font-big text">暂无相关数据</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="text-center bg-muted border-box" style="height:64px;margin-top:-2px;">
                  <div class="pageBox"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">确认</button>
          <button class="btn btn-default" @click="onCancel_Click(0)">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 添加商品及礼品合成页
 * zhaoliubin@zol.com.cn
 * 2017-01-09
 */
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    goodsAdded: {
      type: Object,
      twoway: true,
      default: {}
    },
    goodsAddedList: {
      type: Array,
      default: []
    },
    action: '', //限制商品属性，1为可采购
    storeId: '',
  },
  data() {
    return {
      pageIndex: 1,
      arrChkProId: [],
      arrProSelected: [],
      dataIn: {
        inited: '',
        dataTable: [],
        dataCategory: []
      },
      dataOut: {
        search: {
          Name: '',
          Category: ''
        }
      }
    }
  },
  computed: {
    computedIsAllChecked() {
      let l = this.dataIn.dataTable.length;
      let is = !!l;
      for (let i = 0; i < l; i++) {
        if (_.indexOf(this.arrChkProId, this.dataIn.dataTable[i].Id) == -1) {
          is = false;
          break;
        }
      }
      return is;
    }
  },
  methods: {
    initPageData(pageIndex = 1) {
      this.pageIndex = pageIndex;
      let para = this.dataOut.search;
      para.StoreId = this.storeId;
      para.PageIndex = pageIndex;
      para.action = this.action;
      para.PageSize = 10;
      // para.ProType = 1;
      var me = this;
      fetchData({
        API: '/api/Product/List',
        para,
        callback(data) {
          // console.log(data);
          me.dataIn.inited = true;
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageIndex);
        }
      });
    },
    all_Change(e) {
      let me = this;
      let isChked = e.target.checked;
      this.dataIn.dataTable.forEach(item => {
        let i = _.indexOf(me.arrChkProId, item.Id);
        if (i > -1) {
          if (!isChked) {
            this.arrChkProId.splice(i, 1);
          }
        } else if (isChked) {
          this.arrChkProId.push(item.Id);
          this.selectThisPro(item);
        }
      })
    },
    selectThisPro(item) {
      var obj = {};
      obj.ProId = item.Id;
      obj.StoreAmount = item.StoreAmount;
      obj.Amount = item.Amount; //库存
      obj.AmountCanUsed = item.AmountCanUsed; //可用库存
      // obj.Category = item.Category; //类别
      obj.Color = item.Color; //颜色
      // obj.Series = item.Series; //系列
      obj.Brand = item.Brand; //品牌
      obj.CategoryName = item.CategoryName; //分类
      // obj.Standard = item.Standard || ''; //商品规格
      obj.ProName = item.Name;
      obj.AnotherProName = item.AnotherProName; //带票商品名
      obj.PriceHistory = item.PriceHistory; //历史价格
      obj.ProCount = ''; //数量
      obj.ProCountNow = ''; //用于入库添加商品数量时用
      obj.ProPrice = ''; //原价
      obj.ProPrice1 = ''; //税前价
      obj.HaveImei = item.HaveImei; //是否需要串号
      obj.ProCostPrice = item.ProPrice; //成本价
      obj.Description = obj.Description1 = obj.Description2 = ''; //备注
      obj.TaxRate = window.localStorage.Config_TaxRate.split(',')[0] || 0; //税率
      obj.ProType = item.ProType; //商品类型
      this.storeId && (obj.StoreAmount = item.StoreAmount);
      if (this.isLonely) {
        this.goodsAddedList = [];
      }
      this.arrProSelected.push(obj);
    },
    proId_Change(e, item) {
      let isChked = e.target.checked;
      if (isChked) {
        this.selectThisPro(item);
      }
    },
    getCategory() {
      let me = this;
      fetchData({
        API: 'api/Product/Category',
        para: {
          tree: 1,
        },
        callback(data) {
          data.forEach((item) => {
            item.spread = false;
            item.on = false;
            item.Details.forEach(item2 => {
              item2.spread = false;
              item2.on = false;
            })
          });
          me.dataIn.dataCategory = data;
        }
      })
    },
    category_Click(e, item, itemP) {
      item.spread = !item.spread;
      if (item.on) {
        return;
      }
      this.dataIn.dataCategory.forEach(el => {
        el.on = false;
        el.Details.forEach(el2 => {
          el2.on = false;
        })
      })
      item.on = true;
      if (item.Code == 0 || (itemP && itemP.Code == 0)) {
        this.dataOut.search.ProType = 0;
      } else {
        this.dataOut.search.ProType = 1;
      }
      this.dataOut.search.Category = item.Code;
      this.initPageData(1);
    },
    reload() {
      this.dataOut.search.Category = '';
      this.initPageData(1);
    },
    onCancel_Click() {
      this.show = false;
    },
    onSubmit_Click() {
      let arrTemp = [];
      this.arrChkProId.forEach(item => {
        arrTemp.push(_.find(this.arrProSelected, {
          ProId: item
        }));
      })
      this.goodsAddedList = arrTemp;
      this.show = false;
    },

  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.dataOut.search.Name = this.dataOut.search.Category = '';
        this.initPageData(1);
        if (!this.dataIn.dataCategory.length) {
          // this.getCategory();
        } else {
          this.dataIn.dataCategory.forEach((item) => {
            item.spread = false;
            item.on = false;
            item.Details.forEach(item2 => {
              item2.spread = false;
              item2.on = false;
            })
          });
        }
        this.arrChkProId = [];
        this.arrProSelected = [];
        this.goodsAddedList.forEach(item => {
          this.arrChkProId.push(item.ProId);
          this.arrProSelected.push(item);
        })
      }
    }
  }
}
</script>