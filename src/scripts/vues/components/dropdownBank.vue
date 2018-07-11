<template>
  <span class="intelligent-match" style="position:static;">
    <div style="position:relative;padding: 2px 0;">
      <span class="">
        <input type="search" class="select-long" placeholder="输入关键字" v-model="BankName" @focus="IMIInput()" @input="IMIInput()" style="width:100%">
      </span>
      <ul class="list-match" v-show="intelligentMatch.isShowPro&&computedFilterProInfo.length>0" style="z-index:3;width:100%">
        <li class="item" v-for="item in computedFilterProInfo" :title="item.Name" @click="selectedThisProId(item)">{{item.BankName}}</li>
      </ul>
    </div>
  </span>
</template>
<script>
export default {
  props: {
    show: 0, //是否加载
    arrBankList: [],
    large: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      BankName: "",
      bankCode: "",
      intelligentMatch: {
        isShowPro: false
      }
    };
  },
  computed: {
    computedFilterProInfo() {
      let newPros = this.arrBankList;
      if (validatorManu.isEmpty(this.BankName || "")) {
        return newPros;
      } else {
        return newPros.filter(item => {
          return (
            item.BankName.toLowerCase().indexOf(
              this.BankName.trim().toLowerCase()
            ) > -1
          );
        });
      }
    }
  },
  components: {},
  methods: {
    //商品感知
    IMIInput() {
      this.intelligentMatch.isShowPro = true;
    },
    selectedThisProId(item) {
      this.BankCode = item.BankCode;
      this.BankName = item.BankName;
      this.intelligentMatch.isShowPro = false;
      this.$emit("update:bankCode", this.BankCode);
      this.$emit("update:bankName", this.BankName);
    },
    search() {
      // this.$emit('search');
    }
  },
  created() {
    // this.show && this.getGoodsList();
  }
};
</script>