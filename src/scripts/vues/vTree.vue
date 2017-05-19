<template>
  <li class="item" :data-id="computedModel.Id" :class="{'spread':open==true}">
    <h2 class="category" @click="toggle_Click(computedModel)">
          <p :title="computedModel.Name">
            <span class="fr" v-if="computedModel.Id!=0">
              <a href="javascript:;" @click.stop="update_Click(computedModel)">编辑</a>
              <a href="javascript:;" @click.stop="del_Click(computedModel)">删除</a>
            </span>
            {{computedModel.Name}}
          </p>
        </h2>
    <ul class="list" v-show="open" v-if="isFolder">
      <v-tree v-for="model in computedModel.Details" :model="model"></v-tree>
    </ul>
  </li>
</template>
<script>
export default {
  name: 'vTree',
  data() {
    return {
      // open: false
    }
  },
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
    },
    update_Click(item) {
      this.$dispatch('todo-update', item);
    },
    del_Click(item) {
      this.$dispatch('todo-delete', item);
    }
  }
}

</script>