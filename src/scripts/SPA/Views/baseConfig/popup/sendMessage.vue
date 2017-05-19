<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>发送短信</h2>
        <div class="body mini">
          <div class="content" style="width:400px">
            <p>业务员：
              <b>
                {{computedRealnames}}
              </b></p>
            <div class="mt10">
              <textarea style="width:100%" v-model="dataOut.Content" rows="6" placeholder="请输入信息内容" :maxlength="maxContentLength"></textarea>
              <p class="clearfix">
                <span class="fr mt5 font-small text-muted">
                  {{dataOut.Content.length}}/{{maxContentLength}}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" :class="{'btn-disabled':!dataOut.Content}" @click="onSubmit_Click">发送</button>
          <button class="btn btn-default" @click="onCancel_Click">关闭</button>
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

    arrCustomer: []
  },
  data() {
    return {
      maxContentLength: 100,
      dataOut: {
        Content: ''
      }
    }
  },
  computed: {
    computedRealnames() {
      let arrTemp = [];
      this.arrCustomer.forEach(item => {
        arrTemp.push(item.RealName);
      });
      return arrTemp.join(',');
    }
  },
  methods: {
    onSubmit_Click() {
      let me = this;
      let para = {};
      para.Content = this.dataOut.Content;
      let arrTemp = [];
      this.arrCustomer.forEach(item => {
        arrTemp.push(item.Phone);
      })
      para.Phone = arrTemp.join(',');
      fetchData({
        API: '/Api/Branch/SendMsg',
        para,
        callback() {
          me.$dispatch('send-ok');
          me.show = false;
        }
      })
    },
    onCancel_Click() {
      // this.$dispatch('send-ok');
      this.show = false;
    }
  },
  ready() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.dataOut.Content = '';
      }
    }
  }
}
</script>
