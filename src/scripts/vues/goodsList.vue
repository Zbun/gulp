<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>选择商品</h2>
        <div class="body">
          <div class="content" style="width:900px">
            <button class="btn btn-default fr" @click="reload()">刷新</button>
            <input type="text" placeholder="输入名称关键字" class="com-ipt large" maxlength="50" v-model="dataOut.search.Name" @keydown.enter="initPageData(1)">
            <button class="btn btn-primary ml5" @click="initPageData(1)">搜索</button>
            <div class="select-box-goods mt10">
              <div class="border-box tree fr">
                <ul class="content list" v-cloak>
                  <li class="item" :class="{spread: item.spread,on:item.on}" v-for="item of dataIn.dataCategory">
                    <p class="category  text-ellipsis" :title="item.Item" @click="category_Click($event,item)">
                      {{item.Item}}
                    </p>
                    <ul class="list">
                      <li class="item " :class="{spread: item1.spread,on:item1.on}" v-for="item1 of item.Details">
                        <p class="text-ellipsis" @click="category_Click($event,item1,item)" :title="item1.Item">{{item1.Item}}</p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div class="list-goods">
                <div class="list-table border-box ">
                  <table class="text-center table table-hover table-odd">
                    <thead>
                      <tr>
                        <th>
                          <label class="checkbox">
                            <input type="checkbox" @change="all_Change($event)" :checked="computedIsAllChecked"><span class="icon"></span></label>
                        </th>
                        <th>品牌</th>
                        <th>编码</th>
                        <th>名称</th>
                        <th>可用/库存</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item of dataIn.dataTable">
                        <td>
                          <label class="checkbox">
                            <input type="checkbox" :value="item.Id" @change="proId_Change($event,item)" v-model="arrChkProId"><span class="icon"></span></label>
                        </td>
                        <td>
                          <p class="text-nowrap">{{item.CategoryName}}</p>
                        </td>
                        <td class="text-nowrap">
                          {{item.Id}}
                        </td>
                        <td>
                          <p class="text-left">{{item.Name}}</p>
                        </td>
                        <td>
                          <p class="text-nowrap">{{item.AmountCanUsed}} / {{item.Amount}}</p>
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
                      <tr>
                        <td colspan=5>
                          <div class="data-empty">
                            <i class="icon"></i>
                            <p class="font-big text">暂无相关数据</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="text-center bg-muted border-box mt-1" style="height:70px;">
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
            // this.arrProSelected.splice(i, 1);
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
      obj.Category = item.Category;
      obj.CategoryName = item.CategoryName;
      obj.Standard = 1; //标准，一机2串，3串等
      obj.ProName = item.Name;
      obj.PriceHistory = item.PriceHistory; //历史价格
      obj.ProCount = ''; //数量
      obj.ProPrice = ''; //原价
      obj.ProCostPrice = obj.ProPrice1 = item.ProPrice; //成本价
      obj.Description = ''; //备注
      obj.TaxRate = 0; //税率
      obj.ProType = item.ProType; //商品类型
      this.storeId && (obj.StoreAmount = item.StoreAmount);
      if (this.isLonely) {
        this.goodsAddedList = [];
      }
      // this.arrChkProId.push(obj.ProId);
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
      this.getCategory();
    },
    onCancel_Click() {
      this.show = false;
    },
    onSubmit_Click() {
      // this.goodsAddedList = this.arrProSelected;
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
          this.getCategory();
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
