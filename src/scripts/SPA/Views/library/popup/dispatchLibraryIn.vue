<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>入库</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <p class="text-warning">
              <b>调拨单号：<span class="font-big">{{curItem.Code}}</span></b>
            </p>
            <ul class="mt10 library-in-snlist">
              <li v-for="item in dataIn.dataList">
                <table class="table-bordered table table-fixed">
                  <thead>
                    <tr>
                      <th>
                        <p class=" title pl10"><span class="text text-ellipsis" :title="item.ProName">{{item.ProName}}</span>
                          <a href="javascript:;" class=" action" @click="showContent(item)"></a>
                        </p>
                      </th>
                      <th style="width:100px;">
                        <p class="text-center text-warning">{{item.Details.length}}</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody v-show="item.show">
                    <td colspan="2">
                      <div class="clearfix">
                        <p class="fl pl10" style="width:50%" v-for="item2 in item.Details">{{item2}}</p>
                      </div>
                    </td>
                  </tbody>
                </table>
              </li>
            </ul>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">入库</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
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
    curItem: {

    },
    apiInsert: '',
  },
  data() {
    return {
      dataIn: {
        dataList: []
      }
    }
  },
  components: {},
  methods: {
    initPageData() {
      let me = this;
      fetchData({
        API: 'Api/Imei/History',
        para: {
          status: 3, //串号状态，调拨出库
          billcode: this.curItem.Code
        },
        callback(data) {
          // console.log(data);
          data.forEach(item => {
            item.show = true;
          })
          me.dataIn.dataList = data;
        }
      })
    },
    showContent(item) {
      item.show = !item.show;
    },
    onSubmit_Click() {
      let me = this;
      dialog({
        title: '确认入库',
        content: '确认要入库吗？',
        ok() {
          fetchData({
            API: me.apiInsert,
            para: {
              code: me.curItem.Code
            },
            callback() {
              me.show = false;
              me.$dispatch('on-added-ok');
            }
          })
        },
        cancel() {}
      }).showModal();
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
