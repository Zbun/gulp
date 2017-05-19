<template>
  <div class="main">
    <h2 class="content-title">银行信息</h2>
    <div class="content-field">
      <table class="table text-center table-hover table-odd table-bordered datalist">
        <thead>
          <tr>
            <th>账户名称</th>
            <th>开户行</th>
            <th>账号</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of dataIn.dataTable">
            <td>
              {{item.Bank}}
            </td>
            <td>
              {{item.OpenAt}}
            </td>
            <td>
              {{item.Account}}
            </td>
          </tr>
        </tbody>
        <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
          <tr>
            <td colspan=3>
              <div class="data-empty">
                <i class="icon"></i>
                <p class="font-big text">暂无相关数据</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        API: {
          list: '/Api/Misc/CompanyBankList'
        },
        dataIn: {
          inited: false,
          dataTable: []
        }
      }
    },
    computed: {},
    components: {},
    methods: {
      initPageData() {
        var me = this;
        fetchData({
          API: this.API.list,
          callback(data) {
            // console.log(data);
            me.dataIn.inited = true;
            me.dataIn.dataTable = data;
          }
        })
      },
    },
    ready() {
      this.initPageData();
    },
}
</script>
