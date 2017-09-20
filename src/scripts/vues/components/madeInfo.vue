<template>
  <table class="table-intro mb10">
    <tr>
      <td>
        <span class="title">
                        制单人&nbsp;
                      </span>
        <span class="content">
                        <span class="currency-box">
                          <input type="text" placeholder="" class="ipt-currency disabled" readonly v-model="editInfo.UserNameAdded">
                          <span class="line"></span>
        </span>
        </span>
      </td>
      <td>
        <span class="title">
                            审核人&nbsp;
                          </span>
        <span class="content">
                            <span class="currency-box">
                              <input type="text" placeholder="" v-model="editInfo.ChkUserName" class="ipt-currency disabled" readonly >
                              <span class="line"></span>
        </span>
        </span>
      </td>
      <td>
        <span class="title">审核时间 </span>
        <span class="content">
                                <span class="currency-box">
                                  <input type="text" placeholder="" :value="editInfo.ChkDateTime|datetime" class="ipt-currency disabled com-ipt large" readonly >
                                  <span class="line"></span>
        </span>
        </span>
      </td>
    </tr>
  </table>
</template>
<script>
export default {
  props: {
    editInfo: {}
  },
  data() {
    return {}
  },
  components: {},
  methods: {},
  ready() {}
}
</script>