<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>银行账户</h2>
        <div class="body">
          <div class="content" style="width:800px">
            <div class="p10">
              <div>
                <table class="table table-bordered table-hover text-center">
                  <thead>
                    <tr>
                      <th>账户名称</th>
                      <th>账号</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in dataIn.bankList">
                      <td>
                        {{item.Bank}}
                      </td>
                      <td>
                        {{item.Account}}
                      </td>
                      <td>
                        <div class="action">
                          <a class="item" @click="select(item)" href="javascript:;">选择</a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    bankSelected: {}
  },
  data() {
    return {
      dataIn: {
        bankList: []
      },

    }
  },
  computed: {},
  components: {},
  methods: {
    initPageData() {
      this.getBankList();
    },
    getBankList() {
      let me = this;
      fetchData({
        API: G_APILIST.FINACE.BANK.LIST,
        para: {},
        callback(data) {
          me.dataIn.bankList = data;
        }
      })
    },
    select(item) {
      this.bankSelected.BankId = item.Id;
      this.bankSelected.BankName = item.Bank;
      this.show = false;
    },
    onCancel_Click() {
      this.show = false;
    },
  },
  created() {
    this.initPageData();
  },
}
</script>
