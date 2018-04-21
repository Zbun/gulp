<template>
<div class="mt5">
  <label class="switcher">
    <input type="checkbox" @click="upStatus" v-model="thisStatus">
    <span class="icon"></span></label>
</div>
</template>

<script>
export default {
  props:['status','id'],
  data(){
    return {
      thisStatus: false
    }
  },
  methods: {
    upStatus(){

      fetchData({
        API: '/api/Menu/MenuEnable',
        para: {
          Id: this.id,
          Enable: this.thisStatus == true ? '0' : '1'
        },
        callback: data => {
          this.$emit('input', this.thisStatus);
        }
      })
    }
  },
  created(){
    this.thisStatus = this.status == 1 ? true : false;
  }
}
</script>

<style lang="scss" scoped>
// .switcher {
//   position: relative;
// }

// .switcher input[type=checkbox] {
//   opacity: 0;
// }

// .switcher input[type=checkbox] ~ .icon {
//   position: absolute;
//   left: 0;
//   top: 50%;
//   width: 28px;
//   height: 26px;
//   background: 0;
//   -ms-transform: translate(0, -50%);
//   -webkit-transform: translate(0, -50%);
//   transform: translate(0, -50%);
// }

// .switcher input[type=checkbox] ~ .icon:before {
//   content: '';
//   position: absolute;
//   top: 6px;
//   bottom: 6px;
//   left: 0;
//   right: 0;
//   background: #ccc;
//   -webkit-border-radius: 7px;
//   -moz-border-radius: 7px;
//   border-radius: 7px;
//   -ms-transition: 0.3s;
//   -webkit-transition: 0.3s;
//   transition: 0.3s;
// }

// .switcher input[type=checkbox] ~ .icon:after {
//   content: '';
//   position: absolute;
//   left: 1px;
//   top: 7px;
//   width: 12px;
//   height: 12px;
//   background: #fff;
//   -webkit-border-radius: 100%;
//   -moz-border-radius: 100%;
//   border-radius: 100%;
//   -ms-transition: 0.3s;
//   -webkit-transition: 0.3s;
//   transition: 0.3s;
// }

// .switcher input[type=checkbox]:checked ~ .icon:before {
//   background: #0075B8;
// }

// .switcher input[type=checkbox]:checked ~ .icon:after {
//   -ms-transform: translate(14px, 0);
//   -webkit-transform: translate(14px, 0);
//   transform: translate(14px, 0);
// }
</style>


