<template>
  <div class="main">
    <h2 class="content-title">物流信息</h2>
    <div class="content-field">
      <table class="table text-center table-hover table-odd table-bordered datalist">
        <thead>
          <tr>
            <th>名称</th>
            <th style="width:300px;">联系人</th>
            <th style="width:200px;">电话</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of dataIn.dataTable">
            <td>
              {{item.FullName}}
            </td>
            <td>
              {{item.Contact}}
            </td>
            <td>
              {{item.Phone}}
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
          list: '/Api/Misc/CompanyExpressList'
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
