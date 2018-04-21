<template>
<div class="aside-tree" ref="asideTree">
  <slot></slot>
  <ul v-for="(menuItem,index) in theModel" :key="index">
    <i-tree :model="menuItem" @upName="upName" :choose="defaultArr" :indexArr="[]" :indexNum="index" @cancelAct="cancelAct" ref="tree" :isChecked="actFlag"></i-tree>
  </ul>
</div>
</template>

<script>
import iTree from './iTree';
export default {
  props: ['theModel'],
  data(){
    return {
      actFLag: false,
      defaultArr: [0],
    }
  },
  components: {
    iTree
  },
  methods:{
    cancelAct(...data){   //取消选中效果
      if (Array.isArray(data)){
        this.defaultArr = data;
      }
      this.defaultArr = data[0];
      this.$emit('input', this.defaultArr);
    },
    upName(...args){
      this.$emit('upName', ...args);
    }
  },
  created(){
    this.$emit('input', this.defaultArr);
  }

}
</script>

<style lang="scss" scoped>
@import '../../../SCSS/base/_variables.scss';
$color-defalut: #333;
.aside-tree{
  width: 200px;
  background-color: #f6f6f6;
  box-sizing: border-box;
  padding: 10px 10px 0;
  border-radius: 5px;
  overflow: hidden;
}
</style>


