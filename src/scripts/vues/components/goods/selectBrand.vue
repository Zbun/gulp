<template>
  <span>
		<select v-model="brandId" @change="changeBrand">
			<option value="0">选择品牌</option>
                    <option :value="item.Id" v-for="item in arrBrand">
                      {{item.BrandName}}
                    </option>
		</select>
	</span>
</template>
<script>
/**
 * 商品品牌组件
 */
export default {
  props: {
    brandId: ''
  },
  data() {
    return {
      arrBrand: []
    }
  },
  components: {},
  methods: {
    getBrandList() { //获取品牌列表
      fetchData({
        hideLoading: true,
        API: '/api/Goods/GetBrandListBySelectControl',
        callback: data => {
          this.arrBrand = data;
        }
      })
    },
    changeBrand() {
      this.$emit('update:brandId', this.brandId);
    }
  },
  created() {
    this.getBrandList();
  }
}
</script>