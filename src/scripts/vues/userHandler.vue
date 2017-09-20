<template>
  <span>
	<select class="com-ipt" v-model="handlerId">
    <option :value="item.Id" v-for="item in dataIn.arrUserList">{{item.Real}}</option>
   </select>
	</span>
</template>
<script>
export default {
  props: {
    handlerId: ''
  },
  data() {
    return {
      dataIn: {
        arrUserList: []
      }
    }
  },
  components: {},
  methods: {
    //经手人列表
    getUserList() {
      let me = this;
      fetchData({
        API: 'api/User/UserList',
        para: {
          addMySelf: 1,
          Status: 3
        },
        callback(data) {
          me.dataIn.arrUserList = data;
          if (!me.curCode) {
            me.editInfo.HandlerId = data[0].Id;
          }
        }
      })
    },
  },
  created() {
    this.getUserList();
  }
}
</script>