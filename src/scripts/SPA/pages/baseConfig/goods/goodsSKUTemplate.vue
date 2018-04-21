<template>
  <div class="main">
    <div class="content-field">
      <div class="two-column-view">
        <div class="item">
          <h2 class="title">选择商品</h2>
          <div class="content">
            <div class="set w8em">
              <dl class="item">
                <dt class="title">选择分类</dt>
                <dd class="content" :class="{disabled:isEdit}">
                  <select class="mr5" v-model="editInfo.category1Code" @change="changeCategory(1)">
                    <option value="c1">一级分类</option>
                    <option v-for="item in editInfo.arrCategory1" :value="item.Code">
                      {{item.Name}}
                    </option>
                  </select>
                  <select class="mr5" v-model="editInfo.category2Code" @change="changeCategory(2)">
                    <option value="c2">二级分类</option>
                    <option v-for="item in editInfo.arrCategory2" :value="item.Code">
                      {{item.Name}}
                    </option>
                  </select>
                  <select class="mr5" v-model="objSKU.CategoryCode" @change="changeCategory(3)">
                    <option value="c3">三级分类</option>
                    <option v-for="item in editInfo.arrCategory3" :value="item.Code">
                      {{item.Name}}
                    </option>
                  </select>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">
                  SPU商品名称
                </dt>
                <dd class="content">
                  <input type="text" placeholder="输入名称" data-validate="required" v-model="objSKU.SpuName" class="com-ipt xx-large" @input="updateSPUTableData">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">
                  品牌
                </dt>
                <dd class="content">
                  <select-brand :brand-id.sync="objSKU.BrandId"></select-brand>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="item">
          <h2 class="title">
            规格参数设置
          </h2>
          <div class="content">
            <div class="set w8em">
              <dl class="item" v-for="item0 in editInfo.objAttrList.SpecInfo">
                <dt class="title">{{item0.SpecName}}</dt>
                <dd class="content">
                  <span class="tags">
                    <span class="tag large" :class='{on:item._on}' @click="selectSpec(item)" v-for="item in item0.Values">
                      {{item.ValueTitle}}
                    </span>
                  </span>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  颜色
                </dt>
                <dd class="content">
                  <span class="tags">
                  <span class="tag large" v-for="item in arrChkColorItem" :class='{on:item._on}' @click="selectSpec(item)">
                    {{item.ColorName}}
                   </span>
                  </span>
                  <a href="javascript:;" class="highlight" @click="addColor">添加</a>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  关联标签
                </dt>
                <dd class="content">
                  <span class="tags">
                  <span class="tag large tag-primary-o" v-for="item in arrChkLabelItem">
                    {{item.LabelName}}
                   </span>
                  </span>
                  <a href="javascript:;" class="highlight" @click="selectLabel">添加</a>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="item">
          <h2 class="title">
            商品SKU
          </h2>
          <div class="content">
            <div class="set w8em">
              <dl class="item">
                <dt class="title">选择商品
                  <input type="file" class="import-img hidden" :accept="uploadAcceptImg">
                  <input type="file" class="import-video hidden" :accept="uploadAcceptVideo">
                </dt>
                <dd class="content">
                  <div class="table-box">
                    <table class="table table-bordered-all">
                      <thead>
                        <tr>
                          <th style="width:60px;">
                            <label class="checkbox">
                              <input type="checkbox" :checked="objSKU.SkuInfo.length>0&&objSKU.SkuInfo.filter(sku=>{return sku._on==1}).length==objSKU.SkuInfo.length" @change="changeAll($event)"><span class="icon"></span></label>
                          </th>
                          <th>
                            SKU组合
                          </th>
                          <th style="width:300px;">
                            图片
                          </th>
                          <th style="width:80px;">
                            视频
                          </th>
                          <!--                           <th style="width:330px;">
                            物流体积（长*宽*高/cm）
                          </th>
                          <th style="width:180px;">
                            物流重量/KG
                          </th> -->
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in objSKU.SkuInfo" :class="{on:item._on}">
                          <td>
                            <label class="checkbox" :class="{disabled:item.AllowEdit==0}">
                              <input type="checkbox" v-model="item._on"><span class="icon"></span></label>
                          </td>
                          <td>{{item.SkuName}}</td>
                          <td class="text-nowrap">
                            <ul class="upload-img-list">
                              <li class="item" v-for="(img,index) in item.Images">
                                <sup class="del" @click="delSPUImg(item,index)"></sup>
                                <img :src="img" alt="">
                              </li>
                            </ul>
                            <div class="upload-box" @click="clickUpload(item,0)" v-show="item.Images.length<5"></div>
                            <span class="ml5 text-muted">
                              {{item.Images.length}}/5
                            </span>
                          </td>
                          <td>
                            <ul class="upload-img-list">
                              <li class="item" v-for="(video,index) in item.Video">
                                <sup class="del" @click="delSPUImg(item,index,type)"></sup>
                                <video :src="video"></video>
                              </li>
                            </ul>
                            <div class="upload-box" v-if="item.Video.length==0" @click="clickUpload(item,1)"></div>
                          </td>
                          <!--                           <td class="text-nowrap">
                            <input type="text" placeholder="长/cm" v-model="item.Length" class="com-ipt x-small"> X
                            <input type="text" placeholder="宽/cm" v-model="item.Width" class="com-ipt x-small"> X
                            <input type="text" placeholder="高/cm" v-model="item.Height" class="com-ipt x-small">
                          </td>
                          <td>
                            <input type="text" class="com-ipt small" placeholder="重量/KG" v-model="item.Weight">
                          </td> -->
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  常规参数
                </dt>
                <dd class="content">
                  <table class="table table-bordered-all">
                    <tbody>
                      <tr v-for="item0 in editInfo.objAttrList.AttrInfo">
                        <td class="text-nowrap text-center" style="width:150px">
                          {{item0.AttrName}}
                        </td>
                        <td>
                          <div class="set">
                            <dl class="item" v-for="item1 in item0.Values">
                              <dt class="title">
                                {{item1.ValueTitle}}
                              </dt>
                              <dd class="content">
                                <input type="text" class="com-ipt xx-large" placeholder="" v-model="item1._content">
                              </dd>
                            </dl>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  详细信息
                </dt>
                <dd class="content">
                  <u-editor :content.sync="objSKU.Details"></u-editor>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center">
        <div class="btn btn-primary large" @click="saveSPU($event)" :class="{disabled:objSKU.SkuInfo.length==0}">保存</div>
        <div class="btn  large">取消</div>
      </div>
    </div>
    <select-label :show.sync="isShowSelectLabel" :is-edit="isEdit" :chk-item.sync="arrChkLabelItem"></select-label>
    <select-color :show.sync="isShowSelectColor" :is-edit="isEdit" :chk-item.sync="arrChkColorItem" @update-table="updateSPUTableData"></select-color>
  </div>
</template>
<script>
/**
 * 商品新增及编辑
 */
import formDataUpload from 'commonScripts/formDataUpload.js';
import descartes from 'modules/production/descartes.js';
import selectLabel from './popup/selectLabel.vue';
import selectColor from './popup/selectColor.vue';
import selectBrand from 'vues/components/goods/selectBrand.vue';
import uEditor from 'vues/components/uEditor.vue';
export default {
  data() {
    return {
      isShowSelectLabel: false,
      arrChkLabelItem: [],

      isShowSelectColor: false,
      arrChkColorItem: [],

      uploadAcceptVideo: '.wmv,.avi,.mpg,.mpeg,.3gp,.mov,.mp4,.flv,.f4v,.m4v,.m2t,.mts,.rmvb,.vob,.mkv',
      uploadAcceptImg: '.jpg,.jpeg,.gif,.png',

      SpuId: '',
      isEdit: false, //标记是否是编辑状态
      editor: {}, //初始化一个富文编辑器对象
      objSKU: {
        'SpuId': 0,
        'SpuName': '', //
        'CategoryCode': 'c3',
        'BrandId': 0,
        'LabelIds': [],
        'Details': '',
        'SkuInfo': [],
        'AttrInfo': [{
          'AttrId': 16,
          'Content': '小米（MI）1'
        }, ],
      },
      editInfo: {
        arrCategory1: [], //分类1列表
        arrCategory2: [],
        arrCategory3: [],
        category1Code: 'c1', //分类1选中code
        category2Code: 'c2',
        arrBrand: [],
        objAttrList: {
          SpecInfo: [], //规格参数
          AttrInfo: [], //常规参数
        },
        arrSKUTable: []
      },
      curSPUTableItem: {}, //点击上传动作时，当前表格行作为选中SPU对象
      isUploadVideo: false, //上传类型
      dataOut: {}
    }
  },
  components: {
    selectLabel,
    selectColor,
    selectBrand,
    uEditor,
  },
  computed: {},
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    if (this.SPuId) {
      this.initPageData();
    }
    console.log(to);
    next();
  },
  methods: {
    initPageData() {
      fetchData({
        API: '/api/Goods/GetSpuInfoForEdit',
        para: {
          SpuId: this.SpuId
        },
        callback: data => {
          data.SkuInfo.forEach(item => {
            item._on = true;
            item.Images = item.Images.length ? item.Images.split(',') : []; //组装图片数据结构
            item.Video = item.Video.length ? item.Video.split(',') : [];
            item.Spec = item.Spec.map(sp => sp.SpecId);
          })

          this.editInfo.category1Code = data.CategoryCode.substr(0, 3); //前三位即1级分类
          this.editInfo.category2Code = data.CategoryCode.substr(0, 6); //前六位为2级分类
          this.getCategoryByCode(data.CategoryCode.substr(0, 3), 2); //获取二级分类列表
          this.getCategoryByCode(data.CategoryCode.substr(0, 6), 3); //获取三级分类列表

          this.objSKU = data;
          this.getAttrListByCategory(); //标记规格参数标签
          this.getColorList(); //标记已选颜色
          this.arrChkLabelItem = this.objSKU.LabelIds; //关联标签表
        }
      })
    },
    getCategoryByCode(PCode, order) { //根据上级Code获取分类，
      order = order || 1;
      fetchData({
        API: '/api/Goods/UserGetCategoryByPCode',
        hideLoading: true,
        para: {
          PCode: PCode || ''
        },
        callback: data => {
          this.editInfo['arrCategory' + order] = data;
        }
      })
    },
    changeCategory(order) { //1,2,3，分类change
      this.objSKU.SkuInfo = []; //切换就需要清除table数据
      // this.arrChkLabelItem = [];
      this.editInfo.objAttrList = {};
      if (order != 3) { //非第3个时，取下一级分类数据
        this.editInfo.arrCategory3 = [];
        this.objSKU.CategoryCode = 'c3';

        if (1 == order) {
          this.editInfo.arrCategory2 = [];
          this.editInfo.category2Code = 'c2';
        }
        let code = this.editInfo['category' + order + 'Code'];
        this.getCategoryByCode(code, order + 1);
      } else {
        this.getAttrListByCategory();
      }
    },
    getAttrListByCategory() { //根据三级分类，获取规格及常规属性总列表
      fetchData({
        hideLoading: true,
        API: '/api/Goods/SkuAddGetAttrListByCategory',
        para: {
          CategoryCode: this.objSKU.CategoryCode
        },
        callback: data => {
          data.SpecInfo.forEach(item => {
            item.Values.forEach(item => { //默认不选中
              item._on = false;
              if (this.isEdit) { //编辑时上色已选标签
                if (this.objSKU.SpecIds.indexOf(item.Id) > -1) {
                  item._on = true;
                }
              }
            })
          })
          data.AttrInfo.forEach(item => {
            item.Values.forEach(item => {
              item._content = '';
              if (this.isEdit) { //编辑时，写入内容
                let objCurAttr = _.find(this.objSKU.AttrInfo, {
                  AttrId: item.Id
                })
                if (objCurAttr) {
                  item._content = objCurAttr.Content;
                }
              }
            })
          })
          this.editInfo.objAttrList = data;
        }
      })
    },
    getColorList() { //获取颜色列表，只在编辑时用到
      fetchData({
        API: '/api/Goods/GetColorList',
        callback: data => {
          data.forEach(colorType => {
            colorType.ColorList.forEach(color => {
              color._on = false; //生成SPU时使用，判断当前是否选中
              color._isActive = false; //是否选择加入
              if (this.objSKU.ColorIds.indexOf(color.Id) > -1) {
                color._on = true;
                this.arrChkColorItem.push(color);
              }
            })
          })
        }
      })
    },
    updateSPUTableData() { //更新SPU表格数据
      let arrDes = [];
      let strSplit = 'zzz,,,zz'
      let arrSpecInfo = [];
      this.editInfo.objAttrList.SpecInfo.forEach(spec => {
        let arrTemp = [];
        spec.Values.forEach(value => {
          if (value._on) {
            arrTemp.push(value.Id + strSplit + value.ValueTitle);
          }
        });
        if (arrTemp.length) {
          arrDes.push(arrTemp);
        }
      })

      let arrColorSelected = [];
      this.arrChkColorItem.forEach(item => {
        if (item._on) {
          arrColorSelected.push(item.Id + strSplit + '我是颜色' + item.ColorName);
        }
      })
      if (arrColorSelected.length) {
        arrDes.push(arrColorSelected);
      }

      arrDes = descartes(arrDes);

      this.objSKU.SkuInfo = this.objSKU.SkuInfo.filter(ssku => {
        return ssku.AllowEdit == 0;
      });
      arrDes.forEach(sku => { //组装SKU表格数据
        let objTemp = {};
        let arrTempSku = sku.map(skui => skui.split(strSplit));
        objTemp.SkuName = `${this.objSKU.SpuName}(${arrTempSku.map(a=> a[1]).join(',').replace('我是颜色','')})`;

        objTemp.ColorId = 0;
        objTemp.Spec = [];
        sku.forEach(skui => {
          if (skui.indexOf('我是颜色') > -1) {
            objTemp.ColorId = skui.split(strSplit)[0] - 0;
          } else {
            objTemp.Spec.push(skui.split(strSplit)[0] - 0);
          }
        })
        objTemp.Spec = objTemp.Spec.sort(function(a, b) {
          return a - b;
        });
        objTemp._on = true;
        objTemp.SkuId = 0;
        objTemp.Images = []; //页面中使用数组，交付服务器时使用','隔开的串
        objTemp.Video = [];
        objTemp.Length = '';
        objTemp.Width = '';
        objTemp.Height = '';
        objTemp.Weight = '';
        this.objSKU.SkuInfo.push(objTemp);
      })
      // }
    },
    selectSpec(item) { //选择规格标签
      item._on = !item._on;
      this.updateSPUTableData();
    },
    selectLabel() { //关联标签
      this.isShowSelectLabel = true;
    },
    addColor() { //添加颜色
      this.isShowSelectColor = true;
    },
    changeAll(e) {
      let isChked = e.target.checked;
      if (isChked) {
        this.objSKU.SkuInfo.forEach(item => {
          item._on = true;
        })
      } else {
        this.objSKU.SkuInfo.forEach(item => {
          if (item.AllowEdit != 0) {
            item._on = false;
          }
        })
      }
    },
    initImport() { //初始化上传图片方法
      let me = this;
      formDataUpload({
        url: window.UPLOADSERVER,
        obj: this.$el.querySelector('.import-img'),
        type: this.uploadAcceptImg,
        size: '10M',
        callback(data) {
          me.uploadOk(data.Data);
        }
      })
    },
    initImportVideo() { //初始化上传视频方法
      let me = this;
      formDataUpload({
        url: window.UPLOADSERVER,
        obj: this.$el.querySelector('.import-video'),
        type: this.uploadAcceptVideo,
        size: '10M',
        callback(data) {
          me.uploadOk(data.Data);
        }
      })
    },
    uploadOk(data) { //上传成功，处理数据
      if (this.isUploadVideo == 1) { //上传视频时
        this.curSPUTableItem.Video.push(data);
      } else {
        this.curSPUTableItem.Images.push(data);
      }
    },
    clickUpload(item, type) { //type1是图片，2是视频
      this.curSPUTableItem = item;
      this.isUploadVideo = type || 0;
      if (type == 1) {
        this.$el.querySelector('.import-video').click();
      } else {
        this.$el.querySelector('.import-img').click();
      }
    },
    delSPUImg(item, index, type) { //删除图片及视频
      if (type == 1) { //删除视频
        item.Video = [];
      } else {
        item.Images.splice(index, 1);
      }
    },

    saveSPU(e) { //保存
      if (!zmm_validator(this.$el)) {
        return;
      }
      if (!this.objSKU.BrandId) {
        showTips('请选择品牌', 'error');
        return;
      }
      let para = JSON.parse(JSON.stringify(this.objSKU));
      para.LabelIds = this.arrChkLabelItem.map(la => {
        return la.Id - 0;
      });
      para.SkuInfo = para.SkuInfo.filter(item => {
        return item._on == 1;
      });
      if (para.SkuInfo.length == 0) {
        showTips('请先勾选需要保存的商品', 'error');
        return;
      }
      para.SkuInfo.forEach(item => {
        if (validatorManu.isEmpty(item.Length)) {
          item.Length = 0;
        }
        if (validatorManu.isEmpty(item.Width)) {
          item.Width = 0;
        }
        if (validatorManu.isEmpty(item.Height)) {
          item.Height = 0;
        }
        if (validatorManu.isEmpty(item.Weight)) {
          item.Weight = 0;
        }
        item.Images = item.Images.join(',');
        item.Video = item.Video.join(',');
      })
      para.AttrInfo = [];
      this.editInfo.objAttrList.AttrInfo.forEach(item => {
        item.Values.forEach(v => {
          if (v._content) {
            let objTemp = {};
            objTemp.AttrId = v.Id;
            objTemp.Content = v._content;
            para.AttrInfo.push(objTemp);
          }
        })
      })
      // console.log(para);
      fetchData({
        target: e.target,
        API: '/api/Goods/SkuTemplateEdit',
        para,
        callback: data => {
          this.$router.push({ name: 'bcGoodsList' }); //保存成功去列表
        }
      })
    },

  },
  created() {
    this.getCategoryByCode();
    this.SpuId = this.$route.params.SpuId;
    if (this.SpuId) {
      this.isEdit = true;
      this.initPageData();
    }
    setTimeout(() => {
      this.initImport(); //初始化上传图片
      this.initImportVideo(); //初始化上传视频
    })
  },
  destroyed() {}
}
</script>