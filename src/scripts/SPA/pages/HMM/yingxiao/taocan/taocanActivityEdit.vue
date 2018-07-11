<template>
  <div class="main">
    <div class="text-center fixed-footer" v-if="isCheck">
      <router-link class="btn large" :to="{name:'HMMtaocanActivity'}">返回</router-link>
    </div>
    <div class="text-center fixed-footer" v-else>
      <button class="btn btn-primary large" @click="submit($event)">提交</button>
      <router-link class="btn large" :to="{name:'HMMtaocanActivity'}">取消</router-link>
    </div>
    <div class="content-field">
      <p>
        <router-link :to="{name:'HMMtaocanActivity'}">优惠套餐</router-link> >
        <span class="text-muted">{{curTId?'编辑':'新增'}}套餐</span>
      </p>
      <div class="two-column-view mt10">
        <div class="item">
          <h2 class="title">套餐信息</h2>
          <div class="content">
            <div class="set w4em">
              <dl class="item">
                <dt class="title">套餐名称</dt>
                <dd class="content">
                  <input type="text" v-model="objEditInfo.Name" maxlength="50" placeholder="请输入套餐名称" data-validate="required" class="com-ipt xxx-large" :disabled="isCheck">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  生效日期
                </dt>
                <dd class="content">
                  <span>
      <span class="date-field col2">
        <input type="text" :value="objEditInfo.Start|datetime" :disabled="isCheck" readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate: '#F{$dp.$D(\'endDate\')}',minDate:'%y-%M-%d {%H}:%m:%s'})" @focus="changeTimeStart($event)" style="width:140px;">
        <i class="fa fa-calendar icon"></i>
      </span>
                  <span> - </span>
                  <span class="date-field col2">
        <input type="text" :value="objEditInfo.End|datetime" :disabled="isCheck" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate: '#F{$dp.$D(\'startDate\')}'})" @focus="changeTimeEnd($event)" style="width:140px;">
        <i class="fa fa-calendar icon"></i>
      </span>
                  </span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="item">
          <h3 class="title">
            优惠套餐
          </h3>
          <div class="content">
            <a href="javascript:;" class="highlight" @click="editGoods(0)" :class="{disabled:isCheck}">选择套餐商品</a>
            <table class="table table-bordered-all mt10 thin">
              <thead>
                <tr>
                  <th style="width:80px;">套餐</th>
                  <th>商品</th>
                  <th>原价</th>
                  <th style="width:150px;">套餐价</th>
                  <th style="width:150px;">数量</th>
                  <th style="width:240px;">套餐组合价（元）</th>
                  <th style="width:130px;">操作</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item,index) in objEditInfo.Details">
                  <tr v-for="(pro,index1) in item.GoodsInfo">
                    <td v-if="index1==0" :rowspan="item.GoodsInfo.length" :style="{borderBottomLeftRadius:index==(objEditInfo.Details.length-1)?'4px':0}">
                      {{index+1}}
                    </td>
                    <td style="border-radius:0;border-left:0;">
                      {{pro.ProName}}
                    </td>
                    <td class="text-nowrap">
                      {{pro.ProPrice|currency}}
                    </td>
                    <td>
                      <input type="text" placeholder="请输入价格" v-model="pro.SetPrice" class="com-ipt small" data-validate="required money" :disabled="isCheck">
                    </td>
                    <td style="border-radius:0;">
                      <span class="ml5 plus-minus-box" :class="{disabled:isCheck}">
                        <a href="javascript:;" class="item minus" :class="{disabled:pro.ProCount<=1}"  @click="minusGoodsCount(pro,item)">-</a><input type="text" placeholder="输入数量" data-validate="required integer show" v-model="pro.ProCount|posNumberIn" class="com-ipt"><a href="javascript:;"  class="item plus"  @click="plusGoodsCount(pro,item)">+</a>
                      </span>
                    </td>
                    <td class="text-nowrap" v-if="index1==0" :rowspan="item.GoodsInfo.length">
                      <p><span class="text-muted">&#12288;原价<del class="ml10 text-light">{{getOriginPrice(item.GoodsInfo)|currency}}</del></span></p>
                      <p><span class="mr10 text-muted">套餐价</span> {{getSetPrice(item)|currency}}
                      </p>
                    </td>
                    <td v-if="index1==0" :rowspan="item.GoodsInfo.length" :style="{borderBottomRightRadius:index==(objEditInfo.Details.length-1)?'4px':0}">
                      <div class="action-field" :class="{disabled:isCheck}">
                        <a href="javascript:;" class="item" @click="editGoods(1,item)">编辑</a>
                        <a href="javascript:;" class="item" @click="delPro(index)">删除</a>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <goods-list :show.sync="isShowGoodsList" :goods-added-list.sync="curGoods.GoodsInfo" @save-ok="addGoodsOk"></goods-list>
  </div>
</template>
<script>
/**
 * 优惠套餐发布页
 */
import goodsList from './goodsList.vue';

export default {
  components: {
    goodsList,
  },
  data() {
    return {
      isShowGoodsList: false,
      isShowGiftList: false,
      isCopy: false, //是复制
      isCheck: false, //是查看
      curId: '',
      isEdit: false,
      curGoods: {},
      objEditInfo: {
        Id: 0,
        Name: '',
        Start: '',
        End: '',
        Details: []
      },
    }
  },
  methods: {
    changeTimeStart(e) { //临时解决时间选择选不中问题
      this.objEditInfo.Start = e.target.value;
    },
    changeTimeEnd(e) { //临时解决时间选择选不中问题
      this.objEditInfo.End = e.target.value;
    },
    initPageData() {
      fetchData({
        API: '/api/Activity/GetTaocanActivityInfo',
        para: {
          id: this.curId,
        },
        callback: data => {

          if (this.isCopy) {
            data.Start = '';
            data.End = '';
          }
          this.objEditInfo = data;
        }
      })
    },
    editGoods(type, item) { //type0：添加，1：编辑
      this.isEdit = !!type;
      this.isShowGoodsList = true;
      if (type == 1) {
        this.curGoods = item;
      } else {
        this.curGoods = {};
      }
    },
    addGoodsOk(arrGoods) { //添加套餐选择商品
      if (this.isEdit) {
        this.curGoods.GoodsInfo = arrGoods;
      } else {
        let objTemp = {};
        objTemp.Price = '';
        objTemp.GoodsInfo = arrGoods;
        this.objEditInfo.Details.push(objTemp);
      }
    },

    delPro(index) { //删除套餐
      this.objEditInfo.Details.splice(index, 1);
    },
    minusGoodsCount(pro, item) {
      pro.ProCount--;
      let arrTemp = item.GoodsInfo;
      item.GoodsInfo = [];
      setTimeout(() => {
        item.GoodsInfo = arrTemp;
      })
    },
    plusGoodsCount(pro, item) {
      pro.ProCount++;
      let arrTemp = item.GoodsInfo;
      item.GoodsInfo = [];
      setTimeout(() => {
        item.GoodsInfo = arrTemp;
      })
    },
    getOriginPrice(goods) { //计算原价
      let m = 0;
      goods.forEach(item => {
        m += item.ProPrice * item.ProCount;
      });
      return m;
    },
    getSetPrice(item) {
      let count = 0;
      item.GoodsInfo.forEach(pro => {
        count += (parseFloat(pro.SetPrice) || 0) * pro.ProCount;
      });
      return item.Price = count;
    },
    submit(e) {
      if (!zmm_validator(this.$el)) {
        return;
      }
      if (!this.objEditInfo.Start || !this.objEditInfo.End) {
        showTips('请选择日期', 'error');
        return;
      }

      if (this.objEditInfo.Details.length == 0) {
        showTips('请选择商品', 'warning');
        return;
      }
      for (let i = 0; i < this.objEditInfo.Details.length; i++) {
        let curPro = this.objEditInfo.Details[i];
        if (this.getOriginPrice(curPro.GoodsInfo) < curPro.Price - 0) {
          showTips(`套餐${i+1}处套餐价不能大于原价`, 'warning');
          return;
        }
      }
      let para = JSON.parse(JSON.stringify(this.objEditInfo));
      if (this.isCopy) {
        para.Id = 0;
      }
      fetchData({
        target: e.target,
        API: '/api/Activity/ActivityTaocanEdit',
        para,
        callback: data => {
          this.$router.push({ name: 'HMMtaocanActivity' });
        }
      })
    }
  },
  created() {
    this.curId = this.$route.query.id;
    this.isCopy = this.$route.query.isCopy == 1;
    this.isCheck = this.$route.query.isCheck == 1;
    if (this.curId) {
      this.initPageData();
    }
  }
}
</script>