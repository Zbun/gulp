<template>
  <div>
    <div class="popup" v-show="computedRealShow">
      <div class="content">
        <h2 class="title style-show">近期更新（{{dataIn.objData.DateAdded|date}}）</h2>
        <div class="body">
          <div class="content bg-muted" style="width:700px;">
            <ol class="list-decimal pl10 ml20 text-muted" style="line-height:2;">
              <li v-for='item in dataIn.objData.Data'>
                {{item}}
              </li>
            </ol>
            <p class="text-muted-light clearfix font-small"><span class="fr">---Z买卖·SaaS服务</span></p>
          </div>
        </div>
        <div class="footer text-center">
          <label class="checkbox text-muted" style="position:absolute;left:24px;top:24px;" v-show="!computedIsChecked">
            <input type="checkbox" @change="noMore($event)" :checked="computedIsChecked">不再自动弹出<span class="icon"></span></label>
          <button class="btn btn-primary btn-radial fat mt10" @click="onSubmit_Click">我知道了</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: { twoway: true, default: false }
  },
  data() {
    return {
      dataIn: {
        objData: {
          DateAdded: '2017-09-15',
          Data: ["新增财务会计科目管理",
            "新增采购保价、采购返利流程",
            "新增转仓流程",
            "新增串号流转历史明细",
            "新增机构、供应商、客户对账",
            "优化收（预收）、付（预付）款流程",
            "实现与上游厂家的数据交互和推送队列",
            "部分单据增加操作权限",
            "入库、出库列表页面增加商品明细",
            "优化商品大批量入出库的性能",
            "调整采购退货的数据逻辑",
            "调整平均加权计算法的分组计算方式",
            "单据实现“审核/反审核”，增加“强制完成”",
            "与中邮实现数据联调并通过测试",
            "出库、入库时调整为库管可以重新选择相应的仓库",
            "商品串号位数调整为可配置项，支持多类型",
          ]
        }
      }
    }
  },
  computed: {
    computedRealShow() {
      return this.show || (this.show && !(window.localStorage.hideUpdateLog - 0));
    },
    computedIsChecked() {
      return !!(window.localStorage.hideUpdateLog - 0);
    }
  },
  components: {},
  methods: {
    onSubmit_Click() { this.show = false; },
    onCancel_Click() {},
    noMore(e) {
      e = e.target;
      window.localStorage.hideUpdateLog = +e.checked;
    }
  },
  ready() {}
}
</script>