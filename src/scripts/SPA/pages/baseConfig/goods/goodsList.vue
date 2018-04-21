<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <!-- <a class="btn btn-primary fr" href="#/bc/goods/goodsSKU/">新增</a> -->
        <input type="search" placeholder="输入关键字" class="com-ipt ipt-search" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <span class="ml5">
        <select-brand :brand-id.sync="dataOut.search.BrandId"></select-brand>
        </span>
        <span class="ml5">
                            <select  v-model="editInfo.category1Code" @change="changeCategory(1)">
                    <option value="">分类</option>
                    <option v-for="item in editInfo.arrCategory1" :value="item.Code">
                      {{item.Name}}
                    </option>
                  </select>
                  <select class="ml5" v-show="editInfo.category1Code" v-model="editInfo.category2Code" @change="changeCategory(2)">
                    <option value="">二级分类</option>
                    <option v-for="item in editInfo.arrCategory2" :value="item.Code">
                      {{item.Name}}
                    </option>
                  </select>
                  <select class="ml5" v-show="editInfo.category2Code" v-model="editInfo.category3Code" @change="changeCategory(3)">
                    <option value="">三级分类</option>
                    <option v-for="item in editInfo.arrCategory3" :value="item.Code">
                      {{item.Name}}
                    </option>
                  </select>
        </span>
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table table-bordered datalist table-hover">
        <thead>
          <tr>
            <th style="width:130px;">商品ID</th>
            <th>商品</th>
            <th style="width:180px;">所性三级类目</th>
            <th style="width:160px;">品牌名称</th>
            <th style="width:160px;">创建人</th>
            <th style="width:180px;">创建时间</th>
            <th style="width:180px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in dataIn.arrDataList">
            <td class="text-nowrap">
              {{item.Id}}
            </td>
            <td>
              {{item.Title}}
            </td>
            <td>
              {{item.CodeLevelName3}}
            </td>
            <td>
              {{item.BrandName}}
            </td>
            <td>
              {{item.AddUserRealName}}
            </td>
            <td class="text-nowrap">
              {{item.DateAdded|datetime}}
            </td>
            <td>
              <div class="action-field">
                <a :href="'#/bc/goods/goodsSKU/'+item.Id" class="item">编辑</a>
                <a href="javascript:;" class="item" @click="checkGoods(item)">查看商品详情</a>
                <a href="javascript:;" class="item" @click="del(item,index)">删除</a>
              </div>
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
</template>
<script>
/**
 * 基础设置-商品库
 */
import selectBrand from 'vues/components/goods/selectBrand.vue';
export default {
  data() {
    return {
      dataIn: {
        inited: false,
        arrDataList: []
      },
      pageIndex: 1,
      dataOut: {
        search: {
          Key: '',
          BrandId: 0,
          StartDate: '',
          EndDate: '',
          CategoryCode: ''
        }
      },
      editInfo: {
        arrCategory1: [],
        arrCategory2: [],
        arrCategory3: [],
        category1Code: '',
        category2Code: '',
        category3Code: '',
      }
    }
  },
  components: {
    selectBrand,
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
      para.pageSize = 15;
      fetchData({
        API: '/api/Goods/PlatformGetSpuList',
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    del(item, index) {
      dialog({
        title: '删除',
        content: `确认删除“${item.Title}”？`,
        ok: () => {
          fetchData({
            API: '/api/Goods/PlatformSpuDelete',
            para: {
              Id: item.Id
            },
            callback: data => {
              this.dataIn.arrDataList.splice(index, 1);
            }
          })
        },
        cancel() {

        }
      }).showModal();
    },
    checkGoods(item) {
      alert('稍候实现');
    },
  },
  created() {
    this.initPageData(1);
    this.getCategoryByCode();
  }
}
</script>