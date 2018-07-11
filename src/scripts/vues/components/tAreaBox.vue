<template>
  <span>
    <select v-model="code1" @change="getAreaList(1,1)">
      <option value="">省</option>
      <option :value="item.AreaCode" v-for="item in arrList1">
        {{item.AreaName}}
      </option>
    </select>

    <select class="ml5" v-model="code2" @change="getAreaList(2,1)">
      <option value="">市</option>
      <option :value="item.AreaCode" v-for="item in arrList2">
        {{item.AreaName}}
      </option>
    </select>
    <select class="ml5" v-model="selAreaCode" @change="updateAreaCode" data-validate="required">
      <option value="">区</option>
      <option :value="item.AreaCode" v-for="item in arrList3">
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
    areaCodes: "", //接受传入的以,隔开的多级code，作为请求下级数据时使用
    areaCode: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isLastChange: false,
      code0: 0,
      code1: "",
      code2: "",
      selAreaCode: "",
      arrList1: [],
      arrList2: [],
      arrList3: []
    };
  },
  components: {},
  methods: {
    getAreaList(order, isChange) {
      let pCode = this["code" + order];
      if (isChange) {
        this.selAreaCode = "";
        this.emitAreaCode();
      }
      for (let i = order; i < 3; i++) {
        this["code" + (i + 1)] = "";
        this["arrList" + (i + 1)] = [];
      }
      if (pCode === "") {
        return;
      }

      fetchData({
        api: "/api/Misc/GetAreaInfo",
        hideLoading: true,
        para: {
          pCode
        },
        callback: data => {
          this["arrList" + (order + 1)] = data;
        }
      });
    },
    updateAreaCode() {
      this.isLastChange = true;
      this.emitAreaCode();
    },
    emitAreaCode() {
      this.$emit("update:areaCode", this.selAreaCode);
      this.$emit("update:areaCode0", this.code1);
      this.$emit("update:areaCode1", this.code2);
    },
    hitData() {
      this.selAreaCode = this.areaCode || "";
      var arrTemp = this.areaCodes.split(",");
      if (this.areaCodes && arrTemp[2] != "") {
        for (let i = 0; i < 2; i++) {
          //编辑时初始化各级数据
          if (!this.isLastChange) {
            if (arrTemp[i] != "undefined") {
              this["code" + (i + 1)] = arrTemp[i];
              this.getAreaList(i + 1);
            }
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
};
</script>
<style scoped lang="SASS">
select {
  width: 90px !important;
}
</style>