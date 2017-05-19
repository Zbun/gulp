<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>查看串号</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <p>商品：<strong>{{proName}}</strong>（共 <b class="text-warning">{{arrDetail.length}}</b> 个串号）</p>
            <table class="table table-bordered text-center table-fixed mt10">
              <thead>
                <tr>
                  <th style="width:60%">
                    串号
                  </th>
                  <th>成本</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in arrDetail">
                  <td colspan="2">
                    <div class="clearfix">
                      <p class="text-ellipsis fl" style="width:60%">{{item.Imei}}</p><span class="fl text-right pr10" style="width:40%">
                        {{item.ImeiPrice|money}}
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
