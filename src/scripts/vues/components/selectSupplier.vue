<template>
  <span>
		<select v-model="iD" @change="changeId">
			<option value="0">选择供应商</option>
                    <option :value="item.Id" v-for="item in arrList">
                      {{item.CompanyName}}
                    </option>
		</select>
	</span>
</template>
<script>
/**
 * 供应商下拉组件
 */
export default {
  props: {
    iD: ''
  },
  data() {
    return {
      arrList: []
    }
  },
  components: {},
  methods: {
    getList() { //获取列表
      fetchData({
        hideLoading: true,
        API: '/api/Supplier/GetAllSupplierCompanyList',
        callback: data => {
          this.arrList = data;
        }
      })
    },
    changeId() {
      this.$emit('update:iD', this.iD);
    }
  },
  created() {
    this.getList();
  }
}
</script>