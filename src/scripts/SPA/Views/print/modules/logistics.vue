<template>
  <div class="main">
    <button class="btn btn-default mt10" @click="modify_Click()">添加模板</button>
    <table class="table text-center table-hover table-odd table-bordered mt10">
      <thead>
        <tr>
          <th style="width:300px;">模板名称</th>
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
            <p class="text-nowrap">{{item.DateAdded|datetime}}</p>
          </td>
          <td>
            <p class="action">
              <a href="javascript:;" class="item" @click="modify_Click(item.Id)">修改</a>
              <a href="javascript:;" class="item" @click="del_Click(item.Id)">删除</a>
            </p>
          </td>
        </tr>
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
    <popup-logistics :cur-id="curTempId" @on-after-save="initPageData()" :show.sync="isShowPopup" :express-list="dataIn.expressList"></popup-logistics>
  </div>
</template>
<script>
import popupLogistics from './../popup/popupLogistics.vue';
export default {
  data() {
      return {
        isShowPopup: false,
        curTempId: '',
        dataIn: {
          inited: false,
          dataTable: {},
          expressList: []
        },
      }
    },
    components: {
      popupLogistics
    },
    methods: {
      initPageData() {
        var me = this;
        fetchData({
          API: '/Api/Misc/ExpTempList',
          callback(data) {
            // console.log(data);
            me.dataIn.inited = true;
            me.dataIn.dataTable = data;
          }
        })
      },
      //修改按钮点击
      modify_Click(id) {
        if (this.dataIn.expressList.length == 0) {
          this.getExpressList();
        }
        if (id) {
          this.curTempId = id;
        } else {
          this.curTempId = '';
        }
        this.isShowPopup = true;
      },
      getExpressList() {
        let me = this;
        fetchData({
          API: 'Api/Misc/ExpressList',
          callback(data) {
            // console.log(data);
            me.dataIn.expressList = data;
          }
        })
      },
      //删除
      del_Click(id) {
        let me = this;
        dialog({
          title: '删除模板',
          content: '删除该模板将不可恢复，请确认',
          ok() {
            fetchData({
              api: '/Api/Misc/ ExpTempDelete',
              para: {
                Id: id,
              },
              callback(data) {
                me.initPageData();
              }
            })
          },
          cancel() {}
        }).showModal();

      },
      preview_Click(tempate) {
        var LODOP = getLodop();
        LODOP.PRINT_INIT("打印预览");
        LODOP.SET_PRINT_STYLE("FontSize", 14);
        LODOP.SET_PRINT_STYLE("Bold", 1);
        // LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, "打印页面部分内容");
        LODOP.ADD_PRINT_HTM(5, '5%', '90%', '130mm', tempate);
        // LODOP.SET_PRINT_STYLEA(0, "Horient", 2);
        // LODOP.PRINT_DESIGN();
        LODOP.PREVIEW();
      },
    },
    ready() {
      this.initPageData();
    }
}
</script>
