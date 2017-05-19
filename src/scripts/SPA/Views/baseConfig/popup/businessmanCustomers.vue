<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>关联客户</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <p>业务员：<b>
          		{{objData.RealName}}
          	</b></p>
            <div class=" bg-muted mt10 font-small border-box popup-businessman">
              <ul class="pb-b-list">
                <li class="pb-b-item" v-for="item in objData.Details">
                  <h4 class="pb-b-title">
          				{{item.BranchName}}（<span class="text-warning">
          					{{item.Customers.length}}
          				</span>）
          				</h4>
                  <ul class="clearfix  pb-c-list">
                    <li class="pb-c-item" v-for="item2 in item.Customers">
                      {{item2.CustomerName}}
                    </li>
                  </ul>
                </li>
              </ul>
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
    objData: {}
  },
  data() {
    return {}
  },
  components: {},
  methods: {
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {}
}
</script>
