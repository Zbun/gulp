<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>审批</h2>
        <div class="body">
          <div class="content" style="width:640px">
            <ul class="audit-list">
              <li v-for="item in auditList">
                <span class="date" v-if="item.Status==1">
          				<span class="inner">{{item.OpinionDate|datetime}}
          				</span>
                </span>
                <span v-else class="date">
                	<span class="inner">现在</span>
                </span>
                <div class="detail">
                  <h4 class="user">审批人：{{item.UserName}}</h4>
                  <div class="opinion">
                    <div v-if="$index==auditList.length-1" class="mt10">是否同意：
                      <label class="radio">
                        <input type="radio" value=1 v-model="item.OpinionResult"><span class="icon"></span>是</label>
                      <label class="radio">
                        <input type="radio" value=0 v-model="item.OpinionResult"><span class="icon"></span>否</label>
                      <p class="mt10">
                        <input type="text" placeholder="请输入审批意见" class="com-ipt x-large" v-model="item.OpinionDesc">
                        <button class="btn btn-primary ml10" @click="submit_Click(item)">提交</button>
                      </p>
                    </div>
                    <div v-else class="font-small mt5">
                      <span class="status mr20 mr30">是否同意：{{item.OpinionResult|yesOrNo}}</span>
                      <span class="opinion">审批意见：{{item.OpinionDesc}}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
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
    curItem: {}
  },
  data() {
    return {
      auditList: []
    }
  },
  computed: {
    flowType() {
      return this.curItem.FlowType;
    }
  },
  components: {},
  methods: {
    initPageData() {
      let me = this;
      fetchData({
        API: 'api/user/OpinionPreview',
        para: {
          BillCode: this.curItem.BillCode
        },
        callback(data) {
          // console.log(data);
          me.auditList = data;
        }
      })
    },
    submit_Click(item) {
      let me = this;
      var para = item;
      para.BillCode = this.curItem.BillCode;
      para.flowType = this.curItem.FlowType;
      // console.log(para);
      fetchData({
        API: 'API/User/AuditingOpinion',
        para,
        callback() {
          me.show = false;
          me.$dispatch('on-after-audit');
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
