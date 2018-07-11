<template>
  <span>
    <select v-model="code1" @change="getAreaList(1,1)" :data-validate="isRequired==1?'required':''" data-validate-text="请选择省">
      <option value="">省</option>
      <option :value="item.AreaCode" v-for="item in arrList1">
        {{item.AreaName}}
      </option>
    </select>
    <select class="ml5" v-model="code2" @change="getAreaList(2,1)" :data-validate="isRequired==1?'required':''" data-validate-text="请选择市">
      <option value="">市</option>
      <option :value="item.AreaCode" v-for="item in arrList2">
        {{item.AreaName}}
      </option>
    </select>
    <select class="ml5" v-model="code3" @change="getAreaList(3,1)" :data-validate="isRequired==1?'required':''" data-validate-text="请选择县">
      <option value="">县</option>
      <option :value="item.AreaCode" v-for="item in arrList3">
        {{item.AreaName}}
      </option>
    </select>
    <select class="ml5" v-model="selAreaCode" @change="updateAreaCode" :data-validate="isRequired==1?'required':''" data-validate-text="请选择乡">
      <option value="">乡</option>
      <option :value="item.AreaCode" v-for="item in arrList4">
        {{item.AreaName}}
      </option>
    </select>
  </span>
</template>
<script>
/**
 * 区域选择
 * zhao.liubin@zol.com.cn
 * 2018.04.09
 * @return {'区域Code'}
 */
export default {
  props: {
    areaCodes: '', //接受传入的以,隔开的多级code，作为请求下级数据时使用
    areaCode: {
      type: String,
      default: ''
    },
    isRequired: 0,
  },
  data() {
    return {
      isLastChange: false,
      code0: 0,
      code1: '',
      code2: '',
      code3: '',
      selAreaCode: '',

      arrList1: [],
      arrList2: [],
      arrList3: [],
      arrList4: [],
    }
  },
  components: {},
  methods: {
    getAreaList(order, isChange) {
      let pCode = this['code' + order];
      if (isChange) {
        this.selAreaCode = '';
        this.emitAreaCode();
      }
      for (let i = order; i < 4; i++) {
        this['code' + (i + 1)] = '';
        this['arrList' + (i + 1)] = [];
      }
      if (pCode === '') {
        return;
      }
      fetchData({
        api: '/api/Misc/GetAreaInfo',
        hideLoading: true,
        para: {
          pCode,
        },
        callback: data => {
          this['arrList' + (order + 1)] = data;
        }
      })
    },
    updateAreaCode() {
      this.isLastChange = true;
      this.emitAreaCode();
    },
    emitAreaCode() {
      this.$emit('update:areaCode', this.selAreaCode);
    },
    hitData() {
      this.selAreaCode = this.areaCode || '';
      let arrTemp = this.areaCodes.split(',');
      for (let i = 0; i < 3; i++) { //编辑时初始化各级数据
        if (!this.isLastChange) {
          if (arrTemp[i] != 'undefined' && arrTemp[i] != 0) {
            this['code' + (i + 1)] = arrTemp[i];
            this.getAreaList(i + 1);
          }
        }

      }
    }
  },
  created() {
    this.getAreaList(0);
    this.hitData();
  },
  watch: {
    areaCodes(newVal) {
      this.hitData();
    }
  }
}
</script>
<style scoped lang="SASS">
select {
  width: 90px;
}
</style>