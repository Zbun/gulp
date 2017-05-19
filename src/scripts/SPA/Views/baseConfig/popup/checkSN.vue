<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>查看串号</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <p class="font-small">共 <b class="text-warning">{{arrDetail.length}}</b> 个串号</p>
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
                <tr v-for="item in arrDetail">
                  <td colspan="2">
                    <div class="clearfix">
                      <p class="text-ellipsis fl" style="width:60%" :title="item.ProName">{{proName}}</p><span class="fl" style="width:40%">
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
 * 2017-03-08
 */
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    arrDetail: [],
    proName: ''
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
    },
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {}
}
</script>
