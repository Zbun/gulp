<template>
  <div class="main">
    <div class="content-field goods-category clearfix topList">
      <div class="z-tree category-tree">
        <div class="treeBanner">
          <b>商铺装修管理</b>
        </div>
        <ul class="list toplist">
          <li class="item dead m0" :class="{on:curIndex==index}" v-for="(item,index) in arrDataTopList">
            <p @click.stop="selectItem(index)" :title="item.name">{{item.name}}</p>
          </li>
        </ul>
        </li>
        </ul>
      </div>
      <article class="data-content">
        <input type="file" class="import hidden" accept=".png, .jpg, .jpeg, .gif">
        <section v-if="curIndex==0">
          <div class="search-box clearfix">
            <span class="tab-bar">
              <em class="item" :class="{on:objCurTabIndex.index0==0}" @click="clickTabBar(curIndex,0)">店招栏位</em>
              <em class="item" :class="{on:objCurTabIndex.index0==1}" @click="clickTabBar(curIndex,1)">轮播图栏位</em>
              <em class="item" :class="{on:objCurTabIndex.index0==2}" @click="clickTabBar(curIndex,2)">商品内容栏位</em>
            </span>
          </div>
          <div class="content">
            <div v-if="objCurTabIndex.index0==0">
              <div class="set  mt10">
                <dl class="item">
                  <dt class="title">
                    商铺名称
                  </dt>
                  <dd class="content">
                    {{dataIn.objShopInfo.ShopName}}
                    <router-link class="ml20 highlight" :to="{name:'BCshopInfo',query:{isReturn:1}}">修改</router-link>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    商铺Logo
                  </dt>
                  <dd class="content">
                    <ul class="upload-img-list" style="vertical-align:top;">
                      <li class="item">
                        <img :src="dataIn.objShopInfo.Logo" alt="商铺Logo">
                      </li>
                    </ul>
                    <router-link class="ml20 highlight" :to="{name:'BCshopInfo',query:{isReturn:1}}">更换Logo</router-link>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">店招背景</dt>
                  <dd class="content">
                    <div class="border-box-light radius-box  p10 ">
                      <label class="radio">
                        <input type="radio" v-model="isOfficalRecommend" value="1"><span class="icon"></span>官方推荐</label>
                      <label class="radio">
                        <input type="radio" v-model="isOfficalRecommend" value="0"><span class="icon"></span>自定义上传</label>
                      <div class="mt10">
                        <ul class="upload-img-list" v-if="isOfficalRecommend==1">
                          <li class="item" v-for="item in dataIn.objShopInfo.DefaultSignImages" style="height:40px;" @click="chooseSignImage(item)" :class="{on:item.Image==dataIn.objShopInfo.ShopSignImage}">
                            <img :src="item.Image" :title="item.Title">
                          </li>
                        </ul>
                        <div v-else>
                          <span>
                              <span class="upload-box" @click="import_Click(dataIn.objShopInfo)" style="height:40px;line-height:40px;" v-if="!dataIn.objShopInfo.ShopSignImage">
                              </span>
                          <ul class="upload-img-list" v-else>
                            <li class="item" style="margin-right: 0;height:40px;">
                              <sup class="del" @click="delAdImage(item,1)"></sup>
                              <img :src="dataIn.objShopInfo.ShopSignImage">
                            </li>
                          </ul>
                          </span>
                        </div>
                      </div>
                      <p class="text-muted">店招背景图片呈渐变显示，请在设计时注意整体效果。尺寸750x350, 建议400K左右, 支持类型：jpg、png</p>
                    </div>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title"></dt>
                  <dd class="content">
                    <button class="btn btn-primary large mt10" @click="saveDianZhao">保存</button>
                  </dd>
                </dl>
              </div>
            </div>
            <div v-if="objCurTabIndex.index0==1">
              <div class="mt10">
                <button class="btn" :class="{disabled:dataIn.arrAdList.length>=6}" @click="addAdOrNav(0)">新增广告</button>
                <span class="text-muted">（栏位最多添加6个，图片建议尺寸 750x350像素）</span>
              </div>
              <div class="border-box-light radius-box mt10">
                <div class="p15" style="border-top:1px solid #f3f4f6;margin-top:-1px;" v-for="(item,index) of dataIn.arrAdList">
                  <span class="action fr">
                    <a href="javascript:;" class="item text-light iconfont mr5 icon-xiangshang" :class="{disabled:index==0}" @click.stop="setAdOrNavWeight(item,1)"
                      title="升序"></a>
                    <a href="javascript:;" class="item text-light iconfont mr5 icon-xiangxia" :class="{disabled:index==dataIn.arrAdList.length-1}"
                      @click.stop="setAdOrNavWeight(item,0)" title="降序"></a>
                    <a href="javascript:;" class="item text-light iconfont mr5 icon-shanchu" @click.stop="delAdOrNav(item,index,0)" title="删除"></a>
                  </span>
                  <span class="fl">
                    <span class="upload-box" @click="import_Click(item)" v-if="!item.ADImageUrl">
                    </span>
                  <ul class="upload-img-list" v-else>
                    <li class="item" style="margin-right: 0;">
                      <sup class="del" @click="delAdImage(item)"></sup>
                      <img :src="item.ADImageUrl" alt="">
                    </li>
                  </ul>
                  </span>
                  <div class="set w4em">
                    <dl class="item">
                      <dt class="title">
                        标题
                      </dt>
                      <dd class="content">
                        <input type="search" data-validate="required" v-model="item.ADTitle" class="com-ipt xxx-large" placeholder="请填写标题">
                      </dd>
                    </dl>
                    <dl class="item">
                      <dt class="title">
                        链接
                      </dt>
                      <dd class="content">
                        <button class="btn " @click="addAdOrNavLink(item)">选择关联</button>
                        <span v-if="item.LinkToolId!=0">
                          <a href="javascript:;" class="highlight ml5">{{item.ADLinkName}}</a>
                          <a href="javascript:;" title="删除链接" class="ml5" @click="delLinkTool(1,item)">&times;</a>
                        </span>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <button class="btn btn-primary large mt20" @click="saveAd">保存</button>
            </div>
            <div v-if="objCurTabIndex.index0==2">
              <div class="set w4em mt10">
                <div class="mt10">
                  <button class="btn" :class="{disabled:dataIn.arrGoodsContentList.length>=6}" @click="addAdOrNav(1)">新增</button>
                  <span class="text-muted">（栏位最多添加6个）</span>
                  <span class="ml30">
                    查看全部商品：<label class="radio">
                  <input type="radio"  v-model="dataIn.objShopInfo.ShowAllGoods" value="1" @change="saveDianZhao"><span class="icon"></span>显示</label>
                  <label class="radio">
                    <input type="radio" v-model="dataIn.objShopInfo.ShowAllGoods" value="0" @change="saveDianZhao"><span class="icon"></span>不显示</label>
                  </span>
                </div>
                <div class="border-box-light radius-box mt10">
                  <div class="p15" style="border-top:1px solid #f3f4f6;margin-top:-1px;" v-for="(item,index) of dataIn.arrGoodsContentList">
                    <span class="action fr">
                    <a href="javascript:;" class="item text-light iconfont mr5 icon-xiangshang" :class="{disabled:index==0}" @click.stop="setAdOrNavWeight(item,1,1)"
                      title="升序"></a>
                    <a href="javascript:;" class="item text-light iconfont mr5 icon-xiangxia" :class="{disabled:index==dataIn.arrGoodsContentList.length-1}"
                      @click.stop="setAdOrNavWeight(item,0,1)" title="降序"></a>
                    <a href="javascript:;" class="item text-light iconfont mr5 icon-shanchu" @click.stop="delAdOrNav(item,index,1)" title="删除"></a>
                  </span>
                    <div class="set w4em">
                      <dl class="item">
                        <dt class="title">
                          模块标题
                        </dt>
                        <dd class="content">
                          <input type="search" data-validate="required" v-model="item.Title" class="com-ipt xxx-large" placeholder="请填写标题">
                        </dd>
                      </dl>
                      <dl class="item">
                        <dt class="title">
                          商品数量
                        </dt>
                        <dd class="content">
                          <select v-model="item.GoodsNum" class="com-ipt large">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                          </select>
                        </dd>
                      </dl>
                      <dl class="item">
                        <dt class="title">
                          商铺分类
                        </dt>
                        <dd class="content">
                          <select class="com-ipt large" v-model="item.ShopCategory1">
                            <option value="">全部分类</option>
                            <option :value="cat.Code" v-for="cat in dataIn.arrDataCategoryList">
                              {{cat.Item}}
                            </option>
                          </select>
                        </dd>
                      </dl>
                      <dl class="item">
                        <dt class="title">
                          排序规则
                        </dt>
                        <dd class="content">
                          <select class="com-ipt large" v-model="item.SortRule">
                            <option :value="rule.rule" v-for="rule in arrSortRule">
                              {{rule.title}}
                            </option>
                          </select>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <button class="btn btn-primary mt10" @click="saveAd(1)">保存</button>
            </div>
          </div>
        </section>
      </article>
    </div>
    <link-tool :show.sync="isShowLinkTool" @save-ok="updateLinkTool" :tool-id="objCurAdItem.LinkToolId||''"></link-tool>
  </div>
</template>
<script>
/**
 * APP装修管理
 **/
import formDataUpload from 'commonScripts/formDataUpload.js';
import linkTool from 'vues/components/linkTool/linkTool.vue';
export default {
  components: {
    linkTool,
  },
  data() {
    return {
      isShowLinkTool: false,
      curIndex: 0,
      objCurTabIndex: {
        index0: 0,
        index1: 0,
        index2: 0,
      },
      arrDataTopList: [
        { name: '首页', id: 0 },
      ],
      objCurAdItem: {},

      isOfficalRecommend: 1,

      dataIn: {
        arrAdList: [],
        arrGoodsContentList: [],
        arrDataCategoryList: [],
        objShopInfo: {
          ShowAllGoods: 1, //是否显示全部商品
          ShopSignImage: '', //店招选中图片
          DefaultSignImages: [], //店招系统默认图表列表
        },
      },
      arrSortRule: [{
        rule: 1,
        title: '上新'
      }, {
        rule: 2,
        title: '销量'
      }, {
        rule: 3,
        title: '价格（从低到高）'
      }]
    };
  },

  methods: {
    initPageData() {
      this.getAdList();
      this.getGoodsContentList();
      this.getShopCategoryList();
      this.getShopInfo();
    },
    initImport() {
      let me = this;
      formDataUpload({
        url: window.UPLOADSERVER,
        obj: this.$el.querySelector('.import'),
        type: 'jpg,jpeg,gif,png',
        callback(data) {
          me.objCurAdItem.ADImageUrl = data.Data;
          me.objCurAdItem.ShopSignImage = data.Data;
        }
      })
    },
    import_Click(item) {
      this.objCurAdItem = item;
      this.$el.querySelector('.import').click();
    },
    getShopInfo() {
      fetchData({
        hideLoading: true,
        API: '/api/Supplier/GetShopRenovationInfo',
        callback: data => {
          this.dataIn.objShopInfo = data;
        }
      })
    },
    chooseSignImage(item) {
      this.dataIn.objShopInfo.ShopSignImage = item.Image;
    },

    getAdList() { //获取轮播广告列表
      fetchData({
        hideLoading: true,
        API: '/api/Supplier/SGetHmmShopRenovationAdsList',
        callback: data => {
          this.dataIn.arrAdList = data;
        }
      })
    },

    getShopCategoryList() { //获取商品内容下拉分类
      fetchData({
        hideLoading: true,
        API: '/api/ShopCategory/GetCategoryALL',
        callback: data => {
          this.dataIn.arrDataCategoryList = data;
        }
      })
    },
    getGoodsContentList() { //获取商品内容列表
      fetchData({
        hideLoading: true,
        API: '/api/Supplier/SGetHmmShopRenovationColumnList',
        callback: data => {
          this.dataIn.arrGoodsContentList = data;
        }
      })
    },
    selectItem(index) {
      this.curIndex = index;
    },
    clickTabBar(curI, i) { //选项卡切换
      this.objCurTabIndex['index' + curI] = i;
    },
    addAdOrNav(isGoodsContent) { //添加轮播栏位
      let objTemp = {
        ADTitle: '',
        ADImageUrl: '',
        Id: 0,
        ADLinkName: '',
        LinkToolId: 0,
      };
      if (1 == isGoodsContent) {
        objTemp = {
            Title: '',
            GoodsNum: 6,
            ShopCategory1: '',
            SortRule: 1,
            Id: 0
          },
          this.dataIn.arrGoodsContentList.push(objTemp);
      } else {
        this.dataIn.arrAdList.push(objTemp);
      }
    },
    delAdOrNav(item, index, isGoodsContent) {
      if (item.Id == 0) {
        if (1 == isGoodsContent) {
          this.dataIn.arrGoodsContentList.splice(index, 1);
        } else {
          this.dataIn.arrAdList.splice(index, 1);
        }
        return;
      }
      let API = 1 == isGoodsContent ? '/api/Supplier/HmmShopRenovationColumnDelete' : '/api/Supplier/HmmShopRenovationAdsDelete';
      dialog({
        title: '删除栏目',
        content: `确认删除“${item.Title || item.ADTitle||'栏目'}”？`,
        ok: () => {
          fetchData({
            API,
            para: {
              Id: item.Id,
            },
            callback: data => {
              if (1 == isGoodsContent) {
                this.dataIn.arrGoodsContentList.splice(index, 1);
                return;
              }
              this.dataIn.arrAdList.splice(index, 1);
            }
          })
        },
        cancel() {}
      }).showModal();
    },
    setAdOrNavWeight(item, type, isShopContent) { //type 1为升序，0为降序
      let API = '';
      if (1 == isShopContent) { //商品内容栏排序
        API = '/api/Supplier/HmmShopRenovationColumnWeightUP';
        if (type == 0) {
          API = '/api/Supplier/HmmShopRenovationColumnWeightDown';
        }
      } else {
        API = '/api/Supplier/HmmShopRenovationAdsWeightUP';
        if (type == 0) {
          API = '/api/Supplier/HmmShopRenovationAdsWeightDown';
        }
      }
      fetchData({
        hideLoading: true,
        API,
        para: { Id: item.Id },
        callback: () => {
          if (1 == isShopContent) {
            this.getGoodsContentList();
            return;
          }
          this.getAdList();
        }
      })
    },
    addAdOrNavLink(item) { //添加关联链接，轮播、导航、banner
      this.objCurAdItem = item;
      this.isShowLinkTool = true;
    },
    updateLinkTool(data) { //更新链接小工具
      let me = this;
      if (this.objCurAdItem.IsShowBannerAd != undefined) { //banner广告位
        this.dataIn.objOtherInfo.BannerLinkToolId = data.Id;
        this.objCurAdItem.BannerLinkName = data.LinkDesc;
      } else {
        this.objCurAdItem.ADLinkName = data.LinkDesc;
        this.objCurAdItem.LinkName = data.LinkDesc;
        this.objCurAdItem.LinkToolId = data.Id;
      }
    },
    delLinkTool(tips, item, type) { //删除链接小工具,type:1删除导航，2：删除banner
      let me = this;
      let fn = function() {
        return fetchData({
          API: '/api/ShopCategory/LinkToolDelete',
          hideLoading: true,
          hideOkTips: true,
          para: {
            Id: 2 == type ? item.BannerLinkToolId : item.LinkToolId,
          },
          callback: data => {
            item.LinkToolId = 0;
            if (2 == type) {
              me.dataIn.objOtherInfo.BannerLinkToolId = 0;
              me.saveGoodsContent();
            } else {
              if (tips) { //直接删除时，更新数据
                me.updateAdOrNavItem(item, type);
              }
            }
          }
        })
      }
      if (tips) {
        dialog({
          title: '删除链接',
          content: `确认删除“${type == 2 ? 'banner广告位' : item.Title || item.ADTitle
              }”的关联链接？`,
          ok: fn,
          cancel() {}
        }).showModal();
      } else {
        return fn();
      }
    },
    updateAdOrNavItem(item, isGoodsContent) { //更新轮播广告栏位数据,isGoodsContent是否是商品内容
      let para = item;
      let curItem = item;
      let API = 1 == isGoodsContent ? '/api/Supplier/HmmShopRenovationColumnEdit' : '/api/Supplier/HmmShopRenovationAdsEdit';
      fetchData({
        async: false,
        API,
        para,
        callback: data => {
          curItem = data;
        }
      })
    },
    saveDianZhao() {
      fetchData({
        API: '/api/Supplier/ShopRenovationEdit',
        para: this.dataIn.objShopInfo,
        callback: data => {
          console.log(data);
        }
      })
    },
    saveAd(isGoodsContent) { //保存轮播广告栏位
      if (!zmm_validator(this.$el)) {
        return;
      }
      if (1 == isGoodsContent) { //商品内容栏保存
        for (let i = 0; i < this.dataIn.arrGoodsContentList.length; i++) {
          this.updateAdOrNavItem(this.dataIn.arrGoodsContentList[i], 1);
        }

        setTimeout(() => {
          this.getGoodsContentList();
        })
      } else { //轮播图位保存
        for (let i = 0; i < this.dataIn.arrAdList.length; i++) {
          this.updateAdOrNavItem(this.dataIn.arrAdList[i]);
        }
        setTimeout(() => {
          this.getAdList();
        })
      }
    },
    delAdImage(item, isShopSign) { //删除图片
      if (1 == isShopSign) {
        this.dataIn.objShopInfo.ShopSignImage = '';
      } else {
        item.ADImageUrl = '';
      }
    },
  },
  created() {
    this.initPageData();
  },
  mounted() {
    this.initImport();
  },
};
</script>
<style lang="scss" scoped>
</style>