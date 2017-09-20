<template>
<div class="v-tree">
  <ul class="list">
    <v-tree :state-name="stateName" :spread-ids="spreadIds" v-for="m in model" :model="m" :has-code="hasCode"></v-tree>
  </ul>
</div>
</template>
<script>
export default {
  components: {
    vTree:require('vues/vTreeHasSwitch.vue')
  },
  props: {
    //原始树数据
    model: {
      type: Array
    },
    stateName:String,
    spreadIds:String,
    hasCode:Boolean,
  }
}

</script>