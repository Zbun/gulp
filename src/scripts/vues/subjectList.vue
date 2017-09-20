<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>选择科目</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <input type="text" placeholder="输入名称关键字" class="com-ipt large" maxlength="50" v-model="dataOut.search.Name" @keydown.enter="initPageData(1)">
            <button class="btn btn-primary ml5" @click="initPageData(1)">搜索</button>
            <div class="mt10 border-box">
              <table class="table table-odd table-hover text-center">
                <thead>
                  <tr>
                    <th>编码</th>
                    <th>科目类别</th>
                    <th>科目名称</th>
                    <th></th>
                  </tr>
                </thead>
                <colgroup>
                  <col>
                  <col style="width:100px">
                </colgroup>
                <tbody>
                  <tr v-for="item of dataIn.dataTable">
                    <td>
                      {{item.Code}}
                    </td>
                    <td>
                      {{item.SubjectType}}
                    </td>
                    <td>
                      {{item.SubjectName}}
                    </td>
                    <td>
                      <a href="javascript:;" class="highlight" @click="addItem_Click(item)">添加</a>
                    </td>
                  </tr>
                </tbody>
                <tbody v-if="dataIn.inited&&!dataIn.dataTable.length>0">
                  <tr>
                    <td colspan=2>
                      <div class="data-empty">
                        <i class="icon"></i>
                        <p class="font-big text">暂无相关数据</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="text-center">
              <div class="pageBox"></div>
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
    subjectSelected: {}, //
  },
  data() {
    return {
      pageIndex: 1,
      APILIST: {
        LIST: 'api/AccountSubject/List'
      },
      dataIn: {
        inited: '',
        dataTable: [],
      },
      dataOut: {
        search: {
          Name: ''
        },

      }
    }
  },
  components: {},
  methods: {
    initPageData(pageIndex = 1) {
      let para = this.dataOut.search;
      para.pageindex = this.pageIndex = pageIndex;
      para.PageSize = 10;
      var me = this;
      fetchData({
        API: this.APILIST.LIST,
        para,
        callback(data) {
          me.dataIn.inited = true;
          me.dataIn.dataTable = data.Data;
          initPage(me.$el, data.TotalPages, data.TotalRows, me.initPageData, pageIndex);
        }
      });
    },
    addItem_Click(item) {
      this.subjectSelected.AccountingSubjectsCode = this.subjectSelected.Code = item.Code;
      this.subjectSelected.SubjectType = item.SubjectType;
      this.subjectSelected.SubjectName = item.SubjectName;
      this.show = false;
    },
    onSubmit_Click() {},
    onCancel_Click() {
      this.show = false;
    }
  },
  created() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.dataOut.search.Name = '';
        this.initPageData()
      }
    }
  }
}
</script>
