<template>
  <li class="item" :data-id="computedModel.Id" :class="{'spread':open==true}">
    <p @click="toggle_Click(computedModel)" class="category text-ellipsis" :title="computedModel.Name">{{computedModel.Name}}</p>
    <ul class="list" v-show="open" v-if="isFolder">
      <v-tree v-for="model in computedModel.Details" :model="model"></v-tree>
    </ul>
  </li>
</template>
<script>
export default {
  name: 'vTree',
  computed: {
    computedModel() {
      //如果需要对数据进行处理，那么在这里进行。
      return this.model
    },
    isFolder() {
      return this.computedModel.Details &&
        this.computedModel.Details.length
    }
  },
  props: {
    //原始树数据
    model: {
      type: Object
    },
    open: {
      type: Boolean,
      twoway: true,
      default: false
    }
  },
  methods: {
    toggle_Click(item) {
      if (this.isFolder) {
        this.open = !this.open;
      }
      this.$dispatch('after-toggle-on', item);
    }
  }
}

</script>