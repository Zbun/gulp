<template>
  <span>
		<input type="text" placeholder="输入内容"  class="com-ipt xxx-large" :class="{'disabled':disabledByCode}" maxlength="200" v-model="description">
	</span>
</template>
<script>
/**
 * 通用备注
 */
export default {
  props: {
    description: '',
    disabledByCode: '',
  },
  data() {
    return {}
  },
  components: {},
  methods: {},
  ready() {}
}
</script>