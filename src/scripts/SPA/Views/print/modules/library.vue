<template>
  <div class="main">
    <table class="table text-center table-hover table-odd table-bordered datalist">
      <thead>
        <tr>
          <th style="width:200px;">模块名称</th>
          <th>模板代码</th>
          <th>修改时间</th>
          <th style="width:200px">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of dataIn.dataTable">
          <td>
            <p class="text-nowrap">{{item.Name}}</p>
          </td>
          <td>
            <input type="text" class="com-ipt x-large" placeholder="模板HTML串" v-model="item.Template">
          </td>
          <td>
            <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
          </td>
          <td>
            <p class="action">
              <a href="javascript:;" class="item" @click="save_Click(item.Id,item.Template)">保存</a>
              <a href="javascript:;" class="item" @click="preview_Click(item.Template,$event)">预览</a>
            </p>
          </td>
        </tr>
      </tbody>
      <tbody v-if="dataIn.inited&&!dataIn.objDataList.Detail.length>0">
        <tr>
          <td colspan=4>
            <div class="data-empty">
              <i class="icon"></i>
              <p class="font-big text">暂无相关数据</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  data() {
      return {
        dataIn: {
          inited: false,
          dataTable: {},
          expressList: []
        },
      }
    },
    components: {},
    methods: {
      initPageData() {
        var me = this;
        fetchData({
          API: '/Api/Misc/PrintTempList',
          callback(data) {
            // console.log(data);
            me.dataIn.inited = true;
            me.dataIn.dataTable = data;
          }
        })
      },
      //保存、更新
      save_Click(id, template) {
        let me = this;
        template = template.replace(/\s+|\n|\r|\t/g, ' ');
        fetchData({
          api: '/Api/Misc/PrintTempUpdate',
          para: {
            Id: id,
            Template: template
          },
          callback(data) {
            me.initPageData();
          }
        })
      },
      preview_Click(template, e) {
        var LODOP = getLodop();
        let tempHTML = template;
        LODOP.PRINT_INIT("打印预览");
        LODOP.SET_PRINT_STYLE("FontSize", 14);
        LODOP.SET_PRINT_STYLE("Bold", 1);
        // LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, "打印页面部分内容");
        LODOP.ADD_PRINT_HTM(5, '5%', '90%', '130mm', tempHTML);
        // LODOP.SET_PRINT_STYLEA(0, "Horient", 2);
        // LODOP.PRINT_DESIGN();
        // LODOP.PREVIEW();
        if (LODOP.CVERSION) {
          LODOP.On_Return = function(taskId, Value) {
            // if (Value) {
            //   alert('已发出实际打印命令');
            // } else alert('放弃打印');

          }
          LODOP.PREVIEW();
          return;
        }
        if (LODOP.PREVIEW()) {
          alert('已发出实际打印命令222');
        } else alert('放弃打印222')
      },
    },
    ready() {
      this.initPageData();
    }
}
</script>
