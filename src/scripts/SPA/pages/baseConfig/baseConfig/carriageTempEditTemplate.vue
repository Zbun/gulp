<template>
  <div class="main">
    <section class="text-center fixed-footer">
      <button class="btn btn-primary large" @click="submit($event)">保存</button>
      <router-link :to="{name:'BCcarriageTemp'}" class="btn  large">取消</router-link>
    </section>
    <article class="content-field">
      <div class="two-column-view">
        <div class="item">
          <p>
            <router-link :to="{name:'BCcarriageTemp'}">模板列表</router-link> >
            <span class="text-muted">{{isCopy?'复制':curTId?'编辑':'新增'}}运费模板</span>
          </p>
          <div class="content mt10">
            <div class="set">
              <dl class="item">
                <dt class="title required-mark">
                  模板名称
                </dt>
                <dd class="content">
                  <input type="search" placeholder="请输入模板名称" data-validate-text="请输入模板名称" data-validate="required" class="com-ipt xxx-large" maxlength="20" v-model="editInfo.Name">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">
                  发货地
                </dt>
                <dd class="content">
                  <area-box :area-codes="editInfo.AreaCode1+','+editInfo.AreaCode2+','+editInfo.AreaCode3+','+editInfo.AreaCode4" :area-code.sync="editInfo.AreaCode"></area-box>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  运送方式
                </dt>
                <dd class="content">
                  <label class="radio">
                    <input type="radio" v-model="editInfo.TransportMode" value="0">物流
                    <span class="icon"></span>
                  </label>
                  <label class="radio">
                    <input type="radio" v-model="editInfo.TransportMode" value="1">快递
                    <span class="icon"></span>
                  </label>
                  <label class="radio">
                    <input type="radio" v-model="editInfo.TransportMode" value="2">其他
                    <span class="icon"></span>
                  </label>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  是否包邮
                </dt>
                <dd class="content">
                  <label class="radio ">
                    <input type="radio" v-model="editInfo.IsFree" value="1">
                    <span class="icon"></span>包邮</label>
                  <label class="radio">
                    <input type="radio" v-model="editInfo.IsFree" value="0">
                    <span class="icon"></span>不包邮</label>
                </dd>
              </dl>
            </div>
            <div v-if="editInfo.IsFree==0">
              <div class="set">
                <dl class="item">
                  <dt class="title">
                    计价方式
                  </dt>
                  <dd class="content">
                    <label class="radio ">
                      <input type="radio" v-model="editInfo.ChargingMode" @change="changeChargingMode" value="1">
                      <span class="icon"></span>按件计价</label>
                    <label class="radio">
                      <input type="radio" v-model="editInfo.ChargingMode" @change="changeChargingMode" value="2">
                      <span class="icon"></span>按重量计价</label>
                    <label class="radio">
                      <input type="radio" v-model="editInfo.ChargingMode" @change="changeChargingMode" value="3">
                      <span class="icon"></span>按体积计价</label>
                  </dd>
                </dl>
              </div>
              <table class="table table-bordered-all thin table-fixed">
                <colgroup>
                  <col>
                  <col style="width:110px;">
                  <col style="width:110px;">
                  <col style="width:110px;">
                  <col style="width:110px;">
                  <col style="width:110px;">
                </colgroup>
                <thead>
                  <tr>
                    <td colspan="6">
                      <div class="fr">除指定地区外，其余地区的运费采用“默认运费”</div>
                      默认运费
                      <input type="search" class="com-ipt x-small" v-model="editInfo.DefaultYkg" data-validate="required show money"> {{editInfo.ChargingMode|carriageChargingMode}}内
                      <input type="search" class="com-ipt x-small" v-model="editInfo.DefaultFirstPrice" data-validate="required show money"> 元，每增加
                      <input type="search" class="com-ipt x-small" v-model="editInfo.DefaultNkg" data-validate="required show money"> {{editInfo.ChargingMode|carriageChargingMode}}，增加运费
                      <input type="search" class="com-ipt x-small" v-model="editInfo.DefaultNextPrice" data-validate="required show money"> 元。
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      运送到
                    </td>
                    <td>
                      首{{editInfo.ChargingMode|carriageChargingModeText}}
                    </td>
                    <td>
                      首费（元）
                    </td>
                    <td>
                      续{{editInfo.ChargingMode|carriageChargingModeText}}
                    </td>
                    <td>
                      续费（元）
                    </td>
                    <td>
                      操作
                    </td>
                  </tr>
                  <tr v-for="item in editInfo.SpecialRule">
                    <td>
                      {{item.AreaNames.join('，')}}
                    </td>
                    <td>
                      <input type="search" class="com-ipt block" v-model="item.Ykg" data-validate="required money" data-validate-text="应输入0.00至9999.99的数字，小数保留两位" data-validate-min="0" data-validate-max="9999.99">
                    </td>
                    <td>
                      <input type="search" class="com-ipt block" v-model="item.FirstPrice" data-validate="required money" data-validate-text="应输入0.00至9999.99的数字，小数保留两位" data-validate-min="0" data-validate-max="9999.99">
                    </td>
                    <td>
                      <input type="search" class="com-ipt block" v-model="item.Nkg" data-validate="required money" data-validate-text="应输入0.00至9999.99的数字，小数保留两位" data-validate-min="0" data-validate-max="9999.99">
                    </td>
                    <td>
                      <input type="search" class="com-ipt block" v-model="item.NextPrice" data-validate="required money" data-validate-text="应输入0.00至9999.99的数字，小数保留两位" data-validate-min="0" data-validate-max="9999.99">
                    </td>
                    <td>
                      <div class="action-field">
                        <a href="javascript:;" class="item" @click="editArea(1,item)">编辑</a>
                        <a href="javascript:;" class="item" @click="delArea(item,index)">删除</a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="6">
                      <a href="javascript:;" class="highlight" @click="editArea(0)">+为指定地区设置运费</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </article>
    <area-show :show.sync="isShowAreaShow" :cur-item="objCurAreaItem" @save="saveArea"></area-show>
  </div>
</template>
<script>
/**
 * 基础设置--运费模板
 */
import areaBox from 'vues/components/areaBox.vue';
import areaShow from './popup/carriageTempAddArea.vue';
export default {
  data() {
    return {
      isShowAreaShow: false,

      isEdit: false, //编辑
      curTId: '', //当前ID
      isCopy: false, //是否复制

      isEditArea: false, //点击编辑选择区域时
      objCurAreaItem: {}, //编辑当前区域对象
      objSpecialRule: {
        TFTId: 0, //默认写入ID:0
        FirstPrice: '', //首价
        NextPrice: '', //续价
        Ykg: '', //首重等
        Nkg: '', //续重等
        AreaNames: [],
        PlaceAreaCodes: [] //特定区域
      },
      editInfo: {
        Name: '',
        IsFree: 1, //是否包邮
        TransportMode: 0, //运送方式
        ChargingMode: 1, //计价方式
        AreaCode: '', //最终区域代码
        AreaCode1: '',
        AreaCode2: '',
        AreaCode3: '',
        AreaCode4: '',
        DefaultFirstPrice: '', //首价
        DefaultNextPrice: '', //续价
        DefaultYkg: '', //首重等
        DefaultNkg: '', //续重等
        SpecialRule: []
      }
    }
  },
  components: {
    areaShow,
    areaBox
  },
  methods: {
    initPageData() {
      fetchData({
        API: '/api/Supplier/GetTransFeeTemplateInfo',
        para: {
          Id: this.curTId
        },
        callback: data => {
          if (this.isCopy) {
            data.Id = 0;
            data.Name = data.Name + '-副本';
          }
          this.editInfo = data;
        }
      })
    },
    changeChargingMode() {
      this.editInfo.DefaultFirstPrice = '';
      this.editInfo.DefaultNextPrice = '';
      this.editInfo.DefaultYkg = '';
      this.editInfo.DefaultNkg = '';
      this.editInfo.SpecialRule = [];
    },
    editArea(type, item) { //0:添加，1：编辑
      this.isEditArea = !!type;
      if (item) {
        this.objCurAreaItem = item;
      } else {
        this.objCurAreaItem = {};
      }
      this.isShowAreaShow = true;
    },
    delArea(item, index) {
      this.editInfo.SpecialRule.splice(index, 1);
    },
    saveArea(data) { //选择区域回传调用
      let objTemp = {};
      objTemp.AreaNames = [];
      objTemp.PlaceAreaCodes = [];
      data.forEach(el => {
        objTemp.AreaNames = objTemp.AreaNames.concat(el.arrAreaName);
        objTemp.PlaceAreaCodes = objTemp.PlaceAreaCodes.concat(el.arrAreaCode);
      })
      if (!this.isEditArea) { //添加时
        let objArea = JSON.parse(JSON.stringify(this.objSpecialRule));
        objArea.AreaNames = objTemp.AreaNames;
        objArea.PlaceAreaCodes = objTemp.PlaceAreaCodes;
        this.editInfo.SpecialRule.push(objArea);
      } else { //编辑时
        this.objCurAreaItem = Object.assign(this.objCurAreaItem, objTemp);
      }
    },
    submit(e) {
      if (!zmm_validator(this.$el)) {
        return;
      }
      let para = JSON.parse(JSON.stringify(this.editInfo));
      if (!para.AreaCode) {
        showTips('请选择发货地', 'error');
        return;
      }
      fetchData({
        API: '/api/Supplier/TransFeeTemplateEdit',
        para,
        callback: data => {
          this.$router.push({ name: 'BCcarriageTemp' });
        }
      })
    }
  },
  created() {
    this.curTId = this.$route.params.id;
    if (this.curTId) {
      this.initPageData();
    };
    this.isCopy = !!this.$route.query.isCopy;
  }
}
</script>