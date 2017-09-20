<template>
  <span class="mr10">
		订单进度：<b :class="{'text-muted':dataDetail.Status==-1,'text-warning':dataDetail.Status==1,'text-info':3==dataDetail.Status,'text-primary':6==dataDetail.Status||16==dataDetail.Status}">{{dataDetail.Status|purchaseOrderStatus}}</b>
	</span>
</template>
<script>
export default {
  props: {
    dataDetail: {}
  },
  data() {
    return {

    }
  },
  components: {},
  methods: {},
}
</script>