<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>查看串号</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <p class="font-small">共 <b class="text-warning">{{dataIn.datalist.length}}</b> 个串号</p>
            <table class="table table-bordered text-center table-fixed mt10">
              <thead>
                <tr>
                  <th style="width:60%">
                    商品名称
                  </th>
                  <th>串号</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in dataIn.datalist">
                  <td colspan="2">
                    <div class="clearfix">
                      <p class="text-ellipsis fl" style="width:60%" :title="item.ProName">{{item.ProName}}</p><span class="fl" style="width:40%">
                        {{item.Imei}}
                      </span>
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
</template>
<script>
/**
 * 查看串号弹出层
 * zhao.liubin@zol.com.cn
 * 2016-12-5
 */
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    billCode: '',
    proId: ''
  },
  data() {
    return {
      dataIn: {
        datalist: [],
      },
    }
  },
  components: {},
  computed: {},
  methods: {
    initPageData() {
      let me = this;
      fetchData({
        api: 'Api/Imei/History',
        para: {
          ProId: this.proId,
          BillCode: this.billCode
        },
        callback(data) {
          me.dataIn.datalist = data;
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.initPageData();
      }
    }
  }
}
</script>
