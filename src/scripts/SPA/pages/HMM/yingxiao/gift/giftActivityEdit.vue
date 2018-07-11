<template>
  <div class="main">
    <div class="text-center fixed-footer" v-if="isCheck">
      <router-link class="btn large" :to="{name:'HMMgiftActivity'}">返回</router-link>
    </div>
    <div class="text-center fixed-footer" v-else>
      <button class="btn btn-primary large" @click="submit($event)">提交</button>
      <router-link class="btn large" :to="{name:'HMMgiftActivity'}">取消</router-link>
    </div>
    <div class="content-field">
      <p>
        <router-link :to="{name:'HMMgiftActivity'}">赠品活动</router-link> >
        <span class="text-muted">{{curTId?'编辑':'新增'}}活动</span>
      </p>
      <div class="two-column-view mt10">
        <div class="item">
          <h2 class="title">活动信息</h2>
          <div class="content">
            <div class="set">
              <dl class="item">
                <dt class="title">活动名称</dt>
                <dd class="content">
                  <input type="text" v-model="objEditInfo.Name" placeholder="请输入活动名称" data-validate="required" :disabled="isCheck" class="com-ipt xxx-large">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  生效时间
                </dt>
                <dd class="content">
                  <span>
      <span class="date-field col2">
        <!-- <input type="text" :value="objEditInfo.Start|datetime" readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate: '#F{$dp.$D(\'endDate\')}',minDate:'%y-%M-%d {%H}:%m:%s'})" ref="timeStart" @focus="changeTime" style="width:140px;" :disabled="isCheck"> -->
        <input type="text" :value="objEditInfo.Start|datetime" readonly="" placeholder="开始时间" id="startDate"  @click="selTime($event)" ref="timeStart"  style="width:140px;" :disabled="isCheck">
        <i class="fa fa-calendar icon"></i>
      </span>
                  <span> - </span>
                  <span class="date-field col2">
        <input type="text" :value="objEditInfo.End|datetime" ref="timeEnd" readonly="" placeholder="结束时间" id="endDate" @click="selTime($event,1)"  style="width:140px;" :disabled="isCheck">
        <i class="fa fa-calendar icon"></i>
      </span>
                  </span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="item">
          <h2 class="title">
            选择赠品
          </h2>
          <div class="content">
            <a href="javascript:;" class="highlight" @click="addGift" :class="{disabled:isCheck}">选择赠品</a>
            <table class="table table-bordered-all datalist thin">
              <thead>
                <tr>
                  <th>赠品名称</th>
                  <th style="width:170px;">单次赠品数量</th>
                  <th style="width:100px">赠品总库存</th>
                  <th style="width:100px">价格</th>
                  <th style="width:100px">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in objEditInfo.GiftList">
                  <td>
                    {{item.Name}}
                  </td>
                  <td class="text-nowrap">
                    <input type="search" data-validate="required posInteger" v-model="item.GiftCount" placeholder="输入数量" :disabled="isCheck" class="com-ipt block">
                  </td>
                  <td class="text-nowrap">
                    {{item.Amount}}
                  </td>
                  <td class="text-nowrap">
                    {{item.Price|currency}}
                  </td>
                  <td>
                    <a href="javascript:;" class="highlight" :class="{disabled:isCheck}" @click="delGift(index)">删除</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="item">
          <h3 class="title">
            选择商品
          </h3>
          <div class="content">
            <a href="javascript:;" class="highlight" @click="addGoods" :class="{disabled:isCheck}">选择商品</a>
            <table class="table table-bordered-all mt10 thin">
              <thead>
                <tr>
                  <th>SKU名称</th>
                  <th style="width:200px;">规格</th>
                  <th style="width:100px;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in objEditInfo.ProList">
                  <td>
                    <span :class="{'text-danger':item._isIn}">{{item.ProName}}</span>
                  </td>
                  <td class="text-nowrap">
                    {{item.SpecStr}}
                  </td>
                  <td>
                    <a href="javascript:;" class="highlight" :class="{disabled:isCheck}" @click="delPro(index)">删除</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <gift-list :show.sync="isShowGiftList" :goods-added-list.sync="objEditInfo.GiftList"></gift-list>
    <goods-list :show.sync="isShowGoodsList" :goods-added-list.sync="objEditInfo.ProList"></goods-list>
  </div>
</template>
<script>
/**
 * 赠品活动发布页
 */
import goodsList from './goodsList.vue';
import giftList from 'vues/components/giftList.vue';
export default {
  components: {
    goodsList,
    giftList,
  },
  data() {
    return {
      isShowGoodsList: false,
      isShowGiftList: false,
      isCopy: false, //是复制
      isCheck: false, //是查看
      curId: '',
      timeStart: '',
      timeEnd: '',
      objEditInfo: {
        Id: 0,
        Name: '',
        Start: '',
        End: '',
        ProList: [],
        ProIds: [],
        GiftList: [],
      },
    }
  },
  methods: {
    changeTime() { //临时解决时间选择选不中问题
      // dialog({
      //   API: '修改操作',
      //   content: '修改活动时间后，需要重新选择活动商品，是否确认操作',
      //   ok: () => {
      //     this.clearData();
      //     this.objEditInfo.Start = this.$refs.timeStart.value;
      //     this.objEditInfo.End = this.$refs.timeEnd.value;
      //   },
      //   cancel() {

      //   }
      // }).showModal();
      this.objEditInfo.Start = this.$refs.timeStart.value;
      this.objEditInfo.End = this.$refs.timeEnd.value;
    },
    selTime(e, isEnd) {
      let el = e.target;
      let me = this;
      let preStart = this.$refs.timeStart.value;
      let preEnd = this.$refs.timeEnd.value;

      let writeInTime = function() {
        me.objEditInfo.Start = me.$refs.timeStart.value;
        me.objEditInfo.End = me.$refs.timeEnd.value;
      };

      let fnPick = function() {
        if (preStart && preEnd) {
          dialog({
            title: '修改操作',
            content: '修改活动时间后，需要重新选择活动商品，是否确认操作？',
            ok() {
              writeInTime();
              me.clearData();
            },
            cancel() {
              me.$refs.timeStart.value = preStart;
              me.$refs.timeEnd.value = preEnd;
            }
          }).showModal();
        } else {
          writeInTime();
        }

      };
      if (isEnd == 1) {
        WdatePicker({ el: el, onpicked: fnPick, dateFmt: 'yyyy-MM-dd HH:mm:ss', minDate: '#F{$dp.$D(\'startDate\')}' })
      } else {
        WdatePicker({ el: el, onpicked: fnPick, dateFmt: 'yyyy-MM-dd HH:mm:ss', maxDate: '#F{$dp.$D(\'endDate\')}', minDate: '%y-%M-%d {%H}:%m:%s' })
      }
    },
    clearData() {
      // this.objEditInfo.Name = '';
      this.objEditInfo.ProList = [];
      this.objEditInfo.ProIds = '';
      this.objEditInfo.GiftList = [];
    },
    initPageData() {
      fetchData({
        API: '/api/Activity/GetGiftActivityInfo',
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
    addGoods() {
      this.isShowGoodsList = true;
    },
    delPro(index) {
      this.objEditInfo.ProList.splice(index, 1);
    },
    addGift() {
      this.isShowGiftList = true;
    },
    delGift(index) {
      this.objEditInfo.GiftList.splice(index, 1);
    },
    submit(e) {
      if (!zmm_validator(this.$el)) {
        return;
      }
      if (!this.objEditInfo.Start || !this.objEditInfo.End) {
        showTips('请选择日期', 'error');
        return;
      }
      if (this.objEditInfo.GiftList.length == 0) {
        showTips('请选择赠品', 'warning');
        return;
      }
      if (this.objEditInfo.ProList.length == 0) {
        showTips('请选择商品', 'warning');
        return;
      }

      let para = JSON.parse(JSON.stringify(this.objEditInfo));
      if (this.isCopy) {
        para.Id = 0;
      }
      para.ProIds = para.ProList.map(el => el.ProId).join(',');
      para.GiftList = para.GiftList.map(el => {
        let objTemp = {};
        objTemp.GiftId = el.Id || el.GiftId;
        objTemp.GiftCount = el.GiftCount;
        return objTemp;
      })

      fetchData({
        target: e.target,
        API: '/api/Activity/ActivityGiftEdit',
        para,
        callback: data => {
          this.$router.push({ name: 'HMMgiftActivity' });
        },
        errorCallback: data => {
          this.objEditInfo.ProList.forEach(item => {
            item._isIn = data.Data.ProIds.indexOf(item.ProId) > -1;
          });
        }
      })
    }
  },
  created() {
    this.curId = this.$route.query.id;
    this.isCopy = this.$route.query.isCopy == 1;
    this.isCheck = this.$route.query.isCheck == 1;
    if (this.curId) {
      this.isEdit = true;
      this.initPageData();
    }
  }
}
</script>