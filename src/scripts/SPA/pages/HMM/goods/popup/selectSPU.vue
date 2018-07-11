<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>选择SPU</h2>
        <div class="body">
          <div class="content" style="width:1000px">
            <div class="search-box clearfix">
              <input type="search" placeholder="输入关键字" v-model="dataOut.search.Key" class="com-ipt ipt-search" @keydown.enter="initPageData(1)">
              <span class="ml5">
                 <select style="max-width:120px;"  v-model="editInfo.category1Code" @change="changeCategory(1)">
                    <option value="">选择分类</option>
                    <option v-for="item in editInfo.arrCategory1" :value="item.Code">
                      {{item.Name}}
                    </option>
                  </select>
                  <select style="max-width:120px;" class="ml5" v-show="editInfo.category1Code" v-model="editInfo.category2Code" @change="changeCategory(2)">
                    <option value="">二级分类</option>
                    <option v-for="item in editInfo.arrCategory2" :value="item.Code">
                      {{item.Name}}
                    </option>
                  </select>
                  <select style="max-width:120px;" class="ml5" v-show="editInfo.category2Code" v-model="editInfo.category3Code" @change="changeCategory(3)">
                    <option value="">三级分类</option>
                    <option v-for="item in editInfo.arrCategory3" :value="item.Code">
                      {{item.Name}}
                    </option>
                  </select>
              </span>
              <span class="ml5">

              <select-brand :brand-id.sync="dataOut.search.BrandId"></select-brand>
              </span>
              <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
            </div>
            <span class="fr text-muted mr10" style="margin-top:-15px;">
                共 {{numTotal}} 个结果
              </span>
            <table class="table table-bordered datalist table-hover">
              <thead>
                <tr>
                  <th style="width:80px;">选择</th>
                  <th style="width:100px;">SPU编码</th>
                  <th>SPU名称</th>
                  <th style="width:100px;">分类</th>
                  <th style="width:100px;">品牌</th>
                  <th style="width:100px;">更新时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in dataIn.arrDataList">
                  <td class="text-nowrap">
                    <label class="radio">
                      <input type="radio" :id="'__SPU'+item.Id" :value="item" v-model="chkedItem"><span class="icon"></span></label>
                  </td>
                  <td class="text-nowrap">
                    <label :for="'__SPU'+item.Id" class="block">
                      {{item.Id}}
                    </label>
                  </td>
                  <td>
                    <label :for="'__SPU'+item.Id" class="block">
                      {{item.SpuName}}</label>
                  </td>
                  <td class="text-nowrap">
                    <label :for="'__SPU'+item.Id" class="block">
                      {{item.CodeLevelName1+'>'+item.CodeLevelName2+'>'+item.CodeLevelName3}}</label>
                  </td>
                  <td class="text-nowrap">
                    <label :for="'__SPU'+item.Id" class="block">
                      {{item.BrandName}}</label>
                  </td>
                  <td class="text-nowrap">
                    <label :for="'__SPU'+item.Id" class="block">
                      {{item.DateModify|datetime}}</label>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
              暂无相关数据
            </div>
            <div class="pageBox text-right"></div>
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
/**
 * 选择SPU
 */
import selectBrand from 'vues/components/goods/selectBrand.vue';
export default {
  props: {
    show: { twoway: true, default: false },
    curItem: {}, //已选中Item
    isEdit: false,
  },
  data() {
    return {
      pageIndex: 1,
      chkedItem: '',
      dataIn: {
        inited: false,
        arrDataList: []
      },
      numTotal: '',
      dataOut: {
        search: {
          BrandId: '0',
          Key: '', //关键字
          CategoryCode: '',
        }
      },
      editInfo: {
        arrCategory1: [],
        arrCategory2: [],
        arrCategory3: [],
        category1Code: '',
        category2Code: '',
        category3Code: '',
      },
    }
  },
  components: {
    selectBrand
  },
  methods: {
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
      if (order != 3) {
        this.editInfo.arrCategory3 = [];
        this.editInfo.category3Code = '';
        if (1 == order) {
          this.editInfo.arrCategory2 = [];
          this.editInfo.category2Code = '';
        }
        let code = this.editInfo['category' + order + 'Code'];
        this.getCategoryByCode(code, order + 1);
      }
    },
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.CategoryCode = this.editInfo.category3Code || this.editInfo.category2Code || this.editInfo.category1Code;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 10;
      fetchData({
        hideLoading: true,
        API: '/api/Goods/SupplierGetSpuList',
        para,
        callback: data => {
          if (data.Data.length == 0 && this.pageIndex > 1) {
            me.initPageData(--me.pageIndex);
          }
          this.numTotal = data.TotalRows;
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data.Data;
          if (this.curItem && this.curItem.Id) {
            this.dataIn.arrDataList.forEach(item => {
              if (item.Id == this.curItem.Id) {
                this.chkedItem = item;
              }
            })
          }
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    onSubmit_Click() {
      this.$emit('select-ok', Object.assign({}, this.chkedItem));
      this.onCancel_Click();
    },
    onCancel_Click() {
      this.$emit('update:show', false);
    }
  },
  created() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.chkedItem = {};
        this.numTotal = '';
        this.initPageData();
        this.getCategoryByCode();
      }
    }
  }
}
</script>