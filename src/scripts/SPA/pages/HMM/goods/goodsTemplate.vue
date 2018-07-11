<template>
  <div class="main">
    <div class="text-center fixed-footer">
      <button class="btn btn-primary large" v-if="isShowFeeSpec" @click="submit($event)" :class="{disabled:objEditInfo.SkuInfo.length==0}">提交</button>
      <router-link class="btn large" :to="{name:'HMMgoodsList'}">取消</router-link>
    </div>
    <div class="content-field">
      <div class="two-column-view">
        <div class="item">
          <h2 class="title">商品名称</h2>
          <div class="content">
            <div class="set">
              <dl class="item">
                <dt class="title">SPU名称</dt>
                <dd class="content" v-if="!isEdit">
                  <span class="tag tag-pure on" v-if="objCurSPUItem.SpuName">
                    {{objCurSPUItem.SpuName}}
                    <i class="tag-del" @click="clearCurSPU">×</i>
                  </span>
                  <a href="javascript:;" class="highlight" @click="showSelectSpu">选择SPU</a>
                  <select-spu :show.sync="isShowSelectSpu" :cur-item="objCurSPUItem" @select-ok="selectSPUOk"></select-spu>
                </dd>
                <dd class="content" v-else>
                  <span class="tag tag-pure on">
                    {{objEditInfo.PlatformSpuName}}
                  </span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="item">
          <h2 class="title">
            交易属性
          </h2>
          <div class="content">
            <div class="set">
              <dl class="item">
                <dt class="title">
                  商品卖点
                </dt>
                <dd class="content">
                  <textarea rows="4" v-model="objEditInfo.SellingPoint" style="width:740px;" placeholder="请输入商品卖点"></textarea>
                </dd>
              </dl>
            </div>
            <div class="clearfix">
              <div class="fl set">
                <dl class="item">
                  <dt class="title">
                    供应商
                  </dt>
                  <dd class="content">
                    <select class="com-ipt x-large" v-model="objEditInfo.SCId" @change="changeSupplier">
                      <option value="">请选择</option>
                      <option :value="item.Id" v-for="item in dataIn.arrSupplierList">
                        {{item.CompanyName}}
                      </option>
                    </select>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    起订量
                  </dt>
                  <dd class="content">
                    <input type="text" v-model="objEditInfo.MinimumBuy" data-validate="required integer" placeholder="请填写" class="com-ipt x-large">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    一件几台
                  </dt>
                  <dd class="content">
                    <input type="text" v-model="objEditInfo.PieceOfNum" data-validate="required integer" placeholder="请填写" class="com-ipt x-large">
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    商铺分类
                  </dt>
                  <dd class="content">
                    <select style="width:81px;" class="com-ipt" v-model="objEditInfo.ShopCodeLevel1" @change="changeShopCode(1)">
                      <option value="">请选择</option>
                      <option :value="item.Code" v-for="item in objShopCode.arrShopCode1">{{item.Name}}</option>
                    </select>
                    <select style="width:81px;" class="com-ipt" v-model="objEditInfo.ShopCodeLevel2" @change="changeShopCode(2)">
                      <option value="">请选择</option>
                      <option :value="item.Code" v-for="item in objShopCode.arrShopCode2">{{item.Name}}</option>
                    </select>
                    <select style="width:81px;" class="com-ipt" v-model="objEditInfo.ShopCodeLevel3" @change="changeShopCode(3)">
                      <option value="">请选择</option>
                      <option :value="item.Code" v-for="item in objShopCode.arrShopCode3">{{item.Name}}</option>
                    </select>
                  </dd>
                </dl>
                <!--                 <dl class="item">
                  <dt class="title">
                    平台抽佣
                  </dt>
                  <dd class="content">
                    <input type="text" data-validate="required" v-model="objEditInfo.CommisionRatio" placeholder="请填写" class="com-ipt x-large"> %
                  </dd>
                </dl> -->
              </div>
              <div class="fl set w5em" style="margin-left:142px;">
                <!--                 <dl class="item">
                  <dt class="title">付款设置</dt>
                  <dd class="content">
                    <label class="radio">
                      <input type="radio" v-model="objEditInfo.PayModel" value="1">
                      <span class="icon"></span>买家下单时付款</label>
                    <label class="radio">
                      <input type="radio" v-model="objEditInfo.PayModel" value="0">
                      <span class="icon"></span>卖家确认后付款</label>
                  </dd>
                </dl> -->
                <dl class="item">
                  <dt class="title">
                    运费模板
                  </dt>
                  <dd class="content">
                    <select class="com-ipt x-large" v-model="objEditInfo.TFTId">
                      <option value="">请选择模板</option>
                      <option :value="item.Id" v-for="item in dataIn.arrPostList">{{item.Name}}</option>
                    </select>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    限购量
                  </dt>
                  <dd class="content">
                    <div class="ipt-with-tips">
                      <input type="text" data-validate="required integer" placeholder="请填写" v-model="objEditInfo.OneDayMaxBuyNum" class="com-ipt x-large">
                      <span class="tooltips-i tooltips-t">
                        <a href="javascript:;" class="icon icon-tips">!</a>
                        <span class="txt">
                          0代表不限购
                        </span>
                      </span>
                    </div> 台/天
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    售后服务
                  </dt>
                  <dd class="content">
                    <select class="com-ipt x-large" v-model="objEditInfo.ASTId">
                      <option value="">请选择</option>
                      <option :value="item.Id" v-for="item in dataIn.arrAfterSaleList">{{item.Name}}</option>
                    </select>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">上下架状态</dt>
                  <dd class="content">
                    <span class="text-danger">默认下架状态</span>
                    <!--                    <label class="radio">
                      <input type="radio" v-model="objEditInfo.Status" value="1">
                      <span class="icon"></span>上架</label>
                    <label class="radio">
                      <input type="radio" v-model="objEditInfo.Status" value="0">
                      <span class="icon"></span>下架</label> -->
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="item" v-if="isShowFeeSpec">
          <h2 class="title">
            费用属性
          </h2>
          <div class="content">
            &nbsp;技术服务费用佣金点：{{defaultCommisionRatio}}%<span class="text-muted">（包含：交易、提现手续费+系统使用费）</span>
            <div class="mt10">
              <label class="checkbox">
                <input type="checkbox" value="1" v-model="objEditInfo.IsCustomCommision">
                <span class="icon"></span>
              </label>
              <span :class="{disabled:objEditInfo.IsCustomCommision!=1}">
              特殊申请技术服务费用佣金点
              <input type="text" placeholder="请输入佣金点" data-validate="required show" :disabled="objEditInfo.IsCustomCommision!=1" v-model="objEditInfo.CommisionRatio" class="com-ipt small"> %，有效期
                                  <span>
      <span class="date-field col2">
        <input type="text" v-model="objEditInfo.CommisionStart" readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate: '#F{$dp.$D(\'endDate\')}'})" @focus="changeTimeStart($event)" style="width:140px;">
        <i class="fa fa-calendar icon"></i>
      </span>
              <span> - </span>
              <span class="date-field col2">
        <input type="text" v-model="objEditInfo.CommisionEnd" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate: '#F{$dp.$D(\'startDate\')}'})" @focus="changeTimeEnd($event)" style="width:140px;">
        <i class="fa fa-calendar icon"></i>
      </span>
              </span>
              </span>
              <p class="text-danger">
                （卖家特殊申请技术服务费用佣金后需要平台审核才生效）
              </p>
            </div>
          </div>
        </div>
        <div class="item">
          <h2 class="title">
            SKU列表
          </h2>
          <div class="content">
            <div class="table-box">
              <table class="table table-bordered-all thin">
                <thead>
                  <tr>
                    <th style="width:60px;">
                      <label class="checkbox">
                        <input type="checkbox" :checked="objEditInfo.SkuInfo.length>0&&objEditInfo.SkuInfo.filter(sku=>{return sku._on==1}).length==objEditInfo.SkuInfo.length" @change="changeAll($event)">
                        <span class="icon"></span>
                      </label>
                    </th>
                    <th style="width:150px;">
                      商品编码
                    </th>
                    <th style="width:150px;">
                      SKU编码
                    </th>
                    <th>
                      SKU组合
                    </th>
                    <th style="width:150px;">
                      SKU名称
                    </th>
                    <th style="width:300px;">
                      图片
                    </th>
                    <th style="width:80px;">
                      视频
                    </th>
                    <th style="width:330px;">
                      物流体积（长*宽*高/cm³）
                      <span class="tooltips-i tooltips-b"><a href="javascript:;" class="icon icon-tips">!</a>
                        <span class="txt">
                        注意：单位体积和重量会用于运费的计算，请准确填写
                      </span></span>
                    </th>
                    <th style="width:180px;">
                      物流重量/KG
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in objEditInfo.SkuInfo" :class="{on:item._on}">
                    <td>
                      <label class="checkbox" :class="{disabled:item.AllowEdit==0}">
                        <input type="checkbox" :id="'__sku'+item.SkuId" v-model="item._on">
                        <span class="icon"></span>
                      </label>
                    </td>
                    <td class="text-nowrap">
                      <label :for="'__sku'+item.SkuId" class="block">{{item.ProId}}</label>
                    </td>
                    <td class="text-nowrap">
                      <label :for="'__sku'+item.SkuId" class="block">{{item.SkuCode}}</label>
                    </td>
                    <td class="text-nowrap">
                      <label :for="'__sku'+item.SkuId" class="block">{{item.SpecName}}</label>
                    </td>
                    <td>
                      <input type="text" placeholder="请输入SKU标题" class="com-ipt" v-model="item.ProName">
                    </td>
                    <td class="text-nowrap">
                      <ul class="upload-img-list">
                        <li class="item" v-for="(img,index) in item.Images" v-if="img.length>0">
                          <a :href="img" target="_blank">
                                  <img :src="img" alt="">
                                </a>
                        </li>
                      </ul>
                    </td>
                    <td>
                      <ul class="upload-img-list" v-if="item.Video.length">
                        <li class="item">
                          <a :href="item.Video" target="_blank">
                            <video :src="item.Video"></video>
                          </a>
                        </li>
                      </ul>
                    </td>
                    <td class="text-nowrap">
                      <input type="text" placeholder="长/cm" v-model="item.Length" class="com-ipt xx-small"> X
                      <input type="text" placeholder="宽/cm" v-model="item.Width" class="com-ipt xx-small"> X
                      <input type="text" placeholder="高/cm" v-model="item.Height" class="com-ipt xx-small">
                    </td>
                    <td>
                      <input type="text" class="com-ipt xx-small" placeholder="重量/KG" v-model="item.Weight">
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="item">
          <h2 class="title">
            价格库存
          </h2>
          <div class="content">
            <div class="table-box">
              <table class="table table-bordered-all thin">
                <thead>
                  <tr>
                    <th style="width:200px;">SKU组合</th>
                    <th style="width:250px;">公开价</th>
                    <th>库存</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in objEditInfo.SkuInfo" v-if="item._on">
                    <td>{{item.SpecName}}</td>
                    <td class="text-nowrap">
                      <a href="javascript:;" class="highlight fr" @click="showAdvancedPrice(item)">高级价格</a>
                      <input type="text" placeholder="请输入价格" class="com-ipt small" v-model="item.ProPrice" data-validate="required money">
                    </td>
                    <td>
                      <table class="table">
                        <tbody>
                          <tr>
                            <td class="text-nowrap" v-for="ST in item.SkuStoreNum.slice(0,3)" style="padding:5px;">
                              {{ST.StoreName}}
                              <input type="text" data-validate="required integer" placeholder="请输入库存" v-model="ST.StoreNum" class="com-ipt small">
                            </td>
                            <td style="width:50px;padding:5px;" class="text-nowrap" v-if="item.SkuStoreNum.length>3" rowspan="2">
                              <a href="javascript:;" class="highlight" @click="showMoreStore(item)">更多</a>
                            </td>
                          </tr>
                          <tr>
                            <td class="text-nowrap" v-for="ST in item.SkuStoreNum.slice(3,6)" style="padding:5px;">
                              {{ST.StoreName}}
                              <input type="text" data-validate="required integer ml5" placeholder="请输入库存" v-model="ST.StoreNum" class="com-ipt small">
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="popup" v-if="isShowMoreStore">
        <div class="content">
          <h2 class="title">
            <a href="javascript:;" class="close" title="关闭" @click="cancelMoreStore">&times;</a>{{objCurSKUItem.SpecName}}库存</h2>
          <div class="body">
            <div class="content clearfix" style="width:700px;color:#666;">
              <span class="text-nowrap fl mr20 mb10" v-for="ST in objCurSKUItem.SkuStoreNum">
                {{ST.StoreName}}
                <input type="text" data-validate="required integer" placeholder="请输入库存" v-model="ST.StoreNum" class="com-ipt small ml5">
              </span>
              <!--               <table class="table">
                <tbody>
                  <tr v-for="item in arrCurSKUItemSKUStore">
                    <td v-for="ST in item" class="text-right;text-nowrap" style="padding:10px 5px;width:30%;">

                    </td>
                  </tr>
                </tbody>
              </table> -->
            </div>
          </div>
          <div class="footer text-center">
            <span class="fl" style="color:#666;">共计 {{objCurSKUItem.SkuStoreNum.length}} 个仓库</span>
            <button class="btn btn-primary" @click="saveMoreStore">确定</button>
            <button class="btn btn-default" @click="cancelMoreStore">取消</button>
          </div>
        </div>
      </div>
    </div>
    <advanced-price :show.sync="isShowAdvancedPrice" :s-id="objEditInfo.SCId" :cur-item="objCurSKUItem"></advanced-price>
  </div>
</template>
<script>
/**
 * 商品发布页面模板
 */
import selectSpu from './popup/selectSPU.vue';
import advancedPrice from './popup/publishAdvancedPrice.vue';
export default {
  data() {
    return {
      isShowSelectSpu: false,
      objCurSPUItem: {},

      isShowMoreStore: false,
      objCurSKUItem: {}, //点级更多仓库时，当前选中的Item

      isShowFeeSpec: true, //显示费用属性

      isShowAdvancedPrice: false,
      defaultCommisionRatio: 0,
      // objSpuPreview:{},
      SPUId: '',
      isEdit: false, //是否编辑状态
      objEditInfo: {
        GoodsSpuId: 0,
        IsCustomCommision: 0, //是否自定义佣金比例
        CommisionStart: '', //自定义佣金开始
        CommisionEnd: '', //自定义佣金结束
        CommisionRatio: '', //平台抽佣
        SellingPoint: '', //卖点
        PlatformSpuId: '', //SPUID
        OneDayMaxBuyNum: '0', //限购量
        TFTId: '', //运费模板
        PayModel: '1', //付款方式
        SCId: '', //供应商ID
        ASTId: '', //售后服务模板
        ShopCodeLevel1: '', //商铺分类
        ShopCodeLevel2: '',
        ShopCodeLevel3: '', //商铺分类
        MinimumBuy: '1', //起批量
        PieceOfNum: '1', //一件几台
        Status: '0', //是否上下架、默认下架
        SkuInfo: [],
      },
      dataIn: {
        arrSupplierList: [], //供应商下拉
        arrAfterSaleList: [], //售后模板
        arrPostList: [], //运费模板列表
        arrStoreList: [], //供应商列表

      },
      objShopCode: {
        arrShopCode1: [],
        arrShopCode2: [],
        arrShopCode3: [],
      },
    }
  },
  components: { selectSpu, advancedPrice },
  methods: {
    initPageData() {
      fetchData({
        API: '/api/Goods/SGetGoodsSpuInfo',
        para: {
          goodsSPUId: this.SPUId,
        },
        callback: data => {

          data.SkuInfo.forEach(el => {
            el._on = false;
            el.Images = el.Images.split(',');
          })
          this.objEditInfo = data;
          this.getSpuInfo();
          this.changeSupplier();
          this.getShopCode(data.ShopCodeLevel1, 1);
          this.getShopCode(data.ShopCodeLevel2, 2);
        }
      })
    },
    showSelectSpu() {
      this.isShowSelectSpu = true;
    },
    selectSPUOk(data) {
      this.objCurSPUItem = data;
      this.objEditInfo.PlatformSpuId = data.Id;
      this.getSpuInfo();
    },
    clearCurSPU() {
      this.objCurSPUItem = {};
      this.objEditInfo.SkuInfo = [];
    },
    changeTimeStart(e) { //临时解决时间选择选不中问题
      this.objEditInfo.CommisionStart = e.target.value;
    },
    changeTimeEnd(e) { //临时解决时间选择选不中问题
      this.objEditInfo.CommisionEnd = e.target.value;
    },
    getSpuInfo() { //选取SPU后获取SKU列表
      fetchData({
        API: '/api/Goods/SGetPlatformSpuInfo',
        hideLoading: true,
        para: {
          Id: this.objEditInfo.PlatformSpuId
        },
        callback: data => {
          this.getCommisionRatioByCategoryCode(data.CategoryCode);
          if (!this.isEdit) { //新增
            data.SkuList.forEach(item => {
              item._on = true;
              item.ProPrice = ''; //初始化一个公开价
              item.SkuStoreNum = [];
              item.SkuPrice = [];
              item.Images = item.Images.split(',');
            })
            this.objEditInfo.SkuInfo = data.SkuList;
            this.initSkuStoreNum();
          } else { //编辑
            data.SkuList.forEach(item => {
              item._on = false;
              let objTempItem = _.find(this.objEditInfo.SkuInfo, {
                SkuId: item.SkuId
              });
              if (objTempItem) {
                for (let key in objTempItem) {
                  item[key] = objTempItem[key];
                }
                if (1 == item.IsShow) {
                  item._on = true;
                }
              } else {
                item.ProPrice = ''; //初始化一个公开价
                item.SkuStoreNum = [];
                item.SkuPrice = [];
                item.Images = item.Images.split(',');
              }
            })
            this.objEditInfo.SkuInfo = data.SkuList;

          }
        }
      })
    },

    changeAll(e) { //全选SKU
      let isChked = e.target.checked;
      if (isChked) {
        this.objEditInfo.SkuInfo.forEach(item => {
          item._on = true;
        })
      } else {
        this.objEditInfo.SkuInfo.forEach(item => {
          item._on = false;
        })
      }
    },
    getSupplierList() { //供应商下拉
      fetchData({
        hideLoading: true,
        API: '/api/Supplier/GetAllSupplierCompanyListAndHaveStore',
        callback: data => {
          if (!this.isEdit && data.length) {
            this.objEditInfo.SCId = data[0].Id;
          }
          this.dataIn.arrSupplierList = data;
          if (!this.isEdit) { //编辑时更新库存已调用过获取仓库，故只新增时需要
            this.getStoreListBySCId();
          }
        }
      })
    },
    initSkuStoreNum() { //初始化SKU分仓价
      this.objEditInfo.SkuInfo.forEach(item => {
        item.SkuStoreNum = this.dataIn.arrStoreList.map(st => {
          let objTemp = {};
          objTemp.StoreName = st.Name;
          objTemp.StoreId = st.Id;
          objTemp.StoreNum = 0;
          if (this.isEdit) { //编辑时，写入库存值
            let objCurItem = _.find(item.SkuStoreNum, {
              StoreId: st.Id
            });
            if (objCurItem) {
              objTemp.StoreNum = objCurItem.StoreNum;
            }
          }
          return objTemp;
        });
      })
    },
    changeSupplier() { //供应商change，更新对应仓库信息
      this.getStoreListBySCId().then(this.initSkuStoreNum);
    },

    getStoreListBySCId() { //根据供应商ID获取仓库列表
      if (!this.objEditInfo.SCId) {
        return;
      }
      return fetchData({
        hideLoading: true,
        API: '/api/Supplier/GetStorehouseListByCom',
        para: {
          SCId: this.objEditInfo.SCId,
        },
        callback: data => {
          this.dataIn.arrStoreList = data;
        }
      })
    },
    getPostList() { //运费模板下拉
      fetchData({
        hideLoading: true,
        API: '/api/Supplier/GetTransFeeTemplateList',
        callback: data => {
          if (!this.isEdit && data.length) {
            this.objEditInfo.TFTId = data[0].Id;
          }
          this.dataIn.arrPostList = data;
        }
      })
    },

    getAfterSaleList() { //获取售后模板
      fetchData({
        hideLoading: true,
        API: '/api/Supplier/SGetAfterSalesTemplateListForSelect',
        callback: data => {
          if (!this.isEdit && data.length) {
            this.objEditInfo.ASTId = data[0].Id;
          }
          this.dataIn.arrAfterSaleList = data;
        }
      })
    },
    getCommisionRatioByCategoryCode(cCode) { //获取抽拥比例
      fetchData({
        hideLoading: true,
        API: '/api/Supplier/GetCommisionRatioByCategoryCode',
        para: {
          CategoryCode: cCode,
        },
        callback: data => {
          this.defaultCommisionRatio = data;
          // this.objEditInfo.CommisionRatio = data;
        },
        errorCallback: () => {
          this.isShowFeeSpec = false;
        }
      })
    },
    getShopCode(pCode, i, isChange) { //获取商铺分类，i为次序
      let para = {};
      if (1 == isChange) {
        for (let j = i + 1; j < 4; j++) {
          this.objEditInfo['ShopCodeLevel' + j] = '';
          this.objShopCode['arrShopCode' + j] = [];
        }
      }

      para.pCode = pCode || '',
        fetchData({
          api: '/api/ShopCategory/GetCategoryByPCode',
          hideLoading: true,
          para,
          callback: data => {
            this.objShopCode['arrShopCode' + (i + 1)] = data;
          }
        })
    },
    changeShopCode(i) { //
      let pCode = this.objEditInfo['ShopCodeLevel' + i];
      this.getShopCode(pCode, i, 1);
    },
    showAdvancedPrice(item) { //显示高级价格
      this.objCurSKUItem = item;
      this.isShowAdvancedPrice = true;
    },

    showMoreStore(item) { //显示更多仓库
      this.objCurSKUItem = item;
      this.isShowMoreStore = true;
    },
    saveMoreStore() { //设置更多仓库时保存
      if (!zmm_validator(this.$el.querySelector('.popup'))) {
        return;
      }
      this.cancelMoreStore();
    },
    cancelMoreStore() { //关闭更新仓库弹窗
      this.isShowMoreStore = false;
    },
    submit(e) {
      if (!zmm_validator(this.$el)) {
        return;
      }
      if (!this.objEditInfo.SCId) {
        showTips('请选择供应商', 'warning');
        return;
      }
      if (!this.objEditInfo.TFTId) {
        showTips('请选择运费模板', 'warning');
        return;
      }
      if (!this.objEditInfo.ASTId) {
        showTips('请选择售后模板', 'warning');
        return;
      }
      if (!this.objEditInfo.ShopCodeLevel3) {
        showTips('请选择商铺分类', 'warning');
        return;
      }
      if (this.objEditInfo.IsCustomCommision != 1) {
        this.objEditInfo.CommisionRatio = this.defaultCommisionRatio;
      } else {
        if (!this.objEditInfo.CommisionStart || !this.objEditInfo.CommisionEnd) {
          showTips('请填写佣金有效期', 'warning');
          return;
        }
      }
      let para = JSON.parse(JSON.stringify(this.objEditInfo));
      para.Status = 0; //默认下架
      para.IsCustomCommision = para.IsCustomCommision - 0;
      para.SkuInfo = para.SkuInfo.filter(item => item._on);
      for (let i = 0; i < para.SkuInfo.length; i++) {
        let curSku = para.SkuInfo[i];
        for (let j = 0; j < curSku.SkuPrice.length; j++) {
          let curPrice = curSku.SkuPrice[j];
          if (curPrice.ProPrice1 - 0 > curSku.ProPrice) {
            showTips(`${curSku.SpecName}-高级价格-价格${j+1}处一级价格应小于等于公开价`, 'warning');
            return;
          }
        }
      }
      fetchData({
        target: e.target,
        API: '/api/Goods/SupplierGoodsPublish',
        para,
        callback: data => {
          this.$router.push({ name: 'HMMgoodsList' });
        }
      })
    }
  },
  created() {
    this.SPUId = this.$route.params.id;
    if (this.SPUId) {
      this.isEdit = true;
      this.initPageData();
    } else {}
    this.getSupplierList();
    this.getPostList();
    this.getAfterSaleList();
    this.getShopCode('', 0);
  }
}
</script>