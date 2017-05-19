<template>
  <div class="main">
    <h2 class="content-title">流程配置</h2>
    <div class="content-field">
      <table class="table text-center table-bordered datalist">
        <thead>
          <tr>
            <th>单据类型</th>
            <th style="width:60%">流程</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item of dataIn.dataTable">
            <tr>
              <td :rowspan="item.Details.length||1">
                <p class="text-nowrap">{{item.FlowName}}</p>
              </td>
              <td v-if="item.Details.length>0" class="text-left">
                <div class="flow-show">
                  <span class="order">{{1}}</span>
                  <span class="amount"><span v-if="getType(item.FlowType)">数量 ≥ {{item.Details[0].AmountMin}} 件</span><span v-else>金额 ≥ {{item.Details[0].AmountMin}} 元</span>
                  </span>
                  <span class="flow">
                  审核流程 ：
                  <span class="item" v-for="item2 in item.Details[0].AuditingSteps">
                   {{item2.UserName}}
                 </span>
                  </span>
                </div>
              </td>
              <td v-else>
                &nbsp;
              </td>
              <td :rowspan="item.Details.length||1">
                <div class="action">
                  <a href="javascript:;" class="item" v-link="{name:'flowSet',params:{flowType:item.FlowType,flowName:item.FlowName}}">设置</a>
                </div>
              </td>
            </tr>
            <template v-for="(key,value) of item.Details" v-if="item.Details.length>1">
              <tr v-if="key!=0">
                <td class="text-left">
                  <div class="flow-show">
                    <span class="order">{{key+1}}</span>
                    <span class="amount"><span v-if="getType(item.FlowType)">数量 ≥ {{value.AmountMin}} 件</span><span v-else>金额 ≥ {{value.AmountMin}} 元</span></span>
                    <span class="flow">审核流程 ：
                      <span class="item" v-for="item in value.AuditingSteps">{{item.UserName}}
                     </span>
                    </span>
                  </div>
                </td>
              </tr>
            </template>
          </template>
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
        dataIn: {
          dataTable: {}
        },
        dataOut: {}
      }
    },
    components: {

    },
    methods: {
      initPageData() {
        var me = this;
        fetchData({
          API: '/Api/Misc/WorkFlowList',
          callback(data) {
            // console.log(data);
            me.dataIn.inited = true;
            me.dataIn.dataTable = data;
          }
        })
      },
      //区分以数量还是以金额
      getType(flowType) {
        return flowType == 41 || flowType == 61 || flowType == 71;
      }
    },
    ready() {
      this.initPageData();
    }
}
</script>
