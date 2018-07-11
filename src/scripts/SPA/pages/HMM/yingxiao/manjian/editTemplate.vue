<template>
  <div class="main">
    <div class="text-center fixed-footer" v-if="isCheck">
      <router-link class="btn large" :to="{name:'HMMmanjianList'}">返回</router-link>
    </div>
    <section class="text-center fixed-footer" v-else>
      <button class="btn btn-primary large" @click="submit($event)">提交</button>
      <router-link class="btn large" :to="{name:'HMMmanjianList'}">取消</router-link>
    </section>
    <div class="content-field">
      <p>
        <router-link :to="{name:'HMMmanjianList'}">满减活动</router-link> >
        <span class="text-muted">{{curTId?'编辑':'新增'}}活动</span>
      </p>
      <div class="two-column-view mt20">
        <div class="item">
          <h3 class="title">
            活动信息
          </h3>
          <div class="content">
            <div class="set w4em">
              <dl class="item">
                <dt class="title">活动名称</dt>
                <dd class="content">
                  <input type="search" v-model="objEditInfo.Name" data-validate="required" placeholder="请输入活动名称" class="com-ipt xx-large" :disabled="isCheck">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">生效时间</dt>
                <dd class="content">
                  <span class="date-field col2">
         <input type="text" :value="objEditInfo.Start|datetime" readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate: '#F{$dp.$D(\'endDate\')}',minDate:'%y-%M-%d {%H}:%m:%s'})" @focus="changeTimeStart($event)" style="width:140px;"  :disabled="isCheck">
        <i class="fa fa-calendar icon"></i>
      </span>
                  <span> - </span>
                  <span class="date-field col2">
        <input type="text" :value="objEditInfo.End|datetime" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate: '#F{$dp.$D(\'startDate\')}'})" @focus="changeTimeEnd($event)" style="width:140px;"  :disabled="isCheck">
        <i class="fa fa-calendar icon"></i>
      </span>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">满减规则</dt>
                <dd class="content">
                  活动最多添加5级优惠
                </dd>
              </dl>
              <dl class="item">
                <dt class="title"></dt>
                <dd class="content">
                  满
                  <input type="search" v-model="objEditInfo.Amount1" data-validate="required show integer" placeholder="请输入数字" class="com-ipt small" :disabled="isCheck"> 元 &#12288;减
                  <input type="search" v-model="objEditInfo.Discount1" placeholder="请输入金额" data-validate="required show money" class="com-ipt small" :disabled="isCheck"> 元
                  <span class="ml10">
                    <a href="javascript:;" v-if="objEditInfo.LevelType<5" @click="addLevelType" :class="{disabled:isCheck}" class="iconfont text-light icon-tianjia1"></a>
                  </span>
                </dd>
              </dl>
              <dl class="item" v-if="objEditInfo.LevelType>=2">
                <dt class="title"></dt>
                <dd class="content">
                  满
                  <input type="search" v-model="objEditInfo.Amount2" data-validate="required show integer" placeholder="请输入数字" class="com-ipt small" :disabled="isCheck"> 元 &#12288;减
                  <input type="search" v-model="objEditInfo.Discount2" placeholder="请输入金额" data-validate="required show money" class="com-ipt small" :disabled="isCheck"> 元
                  <span class="ml10">
                    <a href="javascript:;" @click="delLevelType" :class="{disabled:isCheck}" v-if="2==objEditInfo.LevelType" class="iconfont text-light icon-shanchu"></a>
                  </span>
                </dd>
              </dl>
              <dl class="item" v-if="objEditInfo.LevelType>=3">
                <dt class="title"></dt>
                <dd class="content">
                  满
                  <input type="search" v-model="objEditInfo.Amount3" data-validate="required show integer" placeholder="请输入数字" class="com-ipt small" :disabled="isCheck"> 元 &#12288;减
                  <input type="search" v-model="objEditInfo.Discount3" placeholder="请输入金额" data-validate="required show money" class="com-ipt small" :disabled="isCheck"> 元
                  <span class="ml10">
                    <a href="javascript:;" @click="delLevelType" :class="{disabled:isCheck}" v-if="3==objEditInfo.LevelType" class="iconfont text-light icon-shanchu"></a>
                  </span>
                </dd>
              </dl>
              <dl class="item" v-if="objEditInfo.LevelType>=4">
                <dt class="title"></dt>
                <dd class="content">
                  满
                  <input type="search" v-model="objEditInfo.Amount4" data-validate="required show integer" placeholder="请输入数字" class="com-ipt small" :disabled="isCheck"> 元 &#12288;减
                  <input type="search" v-model="objEditInfo.Discount4" placeholder="请输入金额" data-validate="required show money" class="com-ipt small" :disabled="isCheck"> 元
                  <span class="ml10">
                    <a href="javascript:;" @click="delLevelType" :class="{disabled:isCheck}" v-if="4==objEditInfo.LevelType" class="iconfont text-light icon-shanchu"></a>
                  </span>
                </dd>
              </dl>
              <dl class="item" v-if="objEditInfo.LevelType>=5">
                <dt class="title"></dt>
                <dd class="content">
                  满
                  <input type="search" v-model="objEditInfo.Amount5" data-validate="required show integer" placeholder="请输入数字" class="com-ipt small" :disabled="isCheck"> 元 &#12288;减
                  <input type="search" v-model="objEditInfo.Discount5" placeholder="请输入金额" data-validate="required show money" class="com-ipt small" :disabled="isCheck"> 元
                  <span class="ml10">
                    <a href="javascript:;" @click="delLevelType" :class="{disabled:isCheck}" v-if="5==objEditInfo.LevelType" class="iconfont text-light icon-shanchu"></a>
                  </span>
                </dd>
              </dl>
            </div>
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
                <tr v-for="(item,index) in objEditInfo.ProIds">
                  <td>
                    {{item.ProName}}
                  </td>
                  <td class="text-nowrap">
                    {{item.SpecStr}}
                  </td>
                  <td :class="{disabled:isCheck}">
                    <a href="javascript:;" class="highlight" @click="delPro(index)">删除</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <goods-list :show.sync="isShowGoodsList" :goods-added-list.sync="objEditInfo.ProIds"></goods-list>
  </div>
</template>
<script>
/**
 * 满减活动添加、编辑模板
 */
import goodsList from './goodsList.vue';
export default {
  components: {
    goodsList,
  },
  data() {
    return {
      isShowGoodsList: false,
      isCopy: false, //是复制
      isCheck: false, //是查看
      objMetaInfo: {},
      curId: '',
      objEditInfo: {
        Id: 0,
        Name: '', //名称
        ProIds: [], //商品
        Start: '', //开始
        End: '', //结束
        UserMaxBuyNum: 15,
        LevelType: 1,
        Amount1: '',
        Amount2: '',
        Amount3: '',
        Amount4: '',
        Amount5: '',
        Discount1: '',
        Discount2: '',
        Discount3: '',
        Discount4: '',
        Discount5: '',
      }
    }
  },
  computed: {
    comptutedDiscount() {
      return this.objEditInfo.ProPrice - this.objEditInfo.HSPPrice;
    }
  },
  methods: {
    initPageData() {
      fetchData({
        API: '/api/Activity/GetManjianInfo',
        para: { Id: this.curId },
        callback: data => {

          if (this.isCopy) {
            data.Start = '';
            data.End = '';
          }
          this.objEditInfo = data;
        }
      })
    },
    changeTimeStart(e) { //临时解决时间选择选不中问题
      this.objEditInfo.Start = e.target.value;
    },
    changeTimeEnd(e) { //临时解决时间选择选不中问题
      this.objEditInfo.End = e.target.value;
    },
    addLevelType() {
      this.objEditInfo.LevelType++;
    },
    delLevelType() {
      this.objEditInfo.LevelType--;
    },
    addGoods() {
      this.isShowGoodsList = true;
    },
    delPro(index) {
      this.objEditInfo.ProIds.splice(index, 1);
    },
    submit(e) {
      if (!zmm_validator(this.$el)) {
        return;
      }
      if (!this.objEditInfo.Start || !this.objEditInfo.End) {
        showTips('请选择日期', 'error');
        return;
      }
      for (let i = 1; i < this.objEditInfo.LevelType; i++) {
        if (this.objEditInfo['Amount' + i] - 0 >= this.objEditInfo['Amount' + (i + 1)] || this.objEditInfo['Discount' + i] - 0 >= this.objEditInfo['Discount' + (i + 1)]) {
          showTips(`价格${i+1}规则设置不正确，请检查`, 'warning');
          return;
        }
      }
      if (this.objEditInfo.ProIds.length == 0) {
        showTips('请选择商品', 'warning');
        return;
      }

      let para = JSON.parse(JSON.stringify(this.objEditInfo));
      para.ProIds = para.ProIds.map(el => el.ProId).join(',');
      for (let i = para.LevelType + 1; i < 6; i++) {
        para['Amount' + i] = para['Discount' + i] = 0;
      }
      if (this.isCopy) {
        para.Id = 0;
      }
      fetchData({
        target: e.target,
        API: '/api/Activity/ActivityManjianEdit',
        para,
        callback: data => {
          this.$router.push({ name: 'HMMmanjianList' });
        }
      })
    }
  },
  created() {
    this.curId = this.$route.query.id || '';
    this.isCopy = this.$route.query.isCopy == 1;
    this.isCheck = this.$route.query.isCheck == 1;
    if (this.curId) {
      this.initPageData();
    }
    this.objMetaInfo = Object.assign({}, this.objEditInfo); //初始原字段
  }
}
</script>