<template>
  <div class="main toBuy">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <input type="search" placeholder="输入关键字" class="com-ipt ipt-search" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <span class="ml5">
          <input type="text" class="com-ipt x-small" placeholder="开始时间" onclick="WdatePicker()" ref="StartDate" @focus="changeTime()" v-model="dataOut.search.StartDate"> -
          <input type="text" class="com-ipt x-small" placeholder="结束时间" onclick="WdatePicker()" ref="EndDate" @focus="changeTime()" v-model="dataOut.search.EndDate">
        </span>
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
         <div class="fr">  
            <button class="btn btn-primary fr" @click="addArticle()">
              新增
            </button>
          </div>
      </div>
      <table class="table table-bordered datalist table-hover">
        <thead>
          <tr>
            <th style="width:130px;">编号</th>
            <th>公司名称</th>
            <th style="width:180px;">企业品牌</th>
            <th style="width:200px;">地区</th>
            <th style="width:80px;">联系人</th>
            <th style="width:80px;">手机号</th>
            <th style="width:60px;">推荐指数</th>
            <th style="width:180px;">更新时间</th>
            <th style="width:80px;">状态</th>
            <th style="width:180px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in dataIn.arrDataList">
            <td class="text-nowrap">
              {{item.Id}}
            </td>
            <td>
              {{item.CompanyName}}
            </td>
            <td>
              {{item.CompanyBrand}}
            </td>
            <td>
              {{item.AreaMergerName}}
            </td>
            <td class="text-nowrap">
              {{item.Contacts}}
            </td>
            <td class="text-nowrap">
              {{item.Phone}}
            </td>
            <td class="text-nowrap">
              {{item.RecommendValue}}
            </td>
            <td class="text-nowrap">
              {{item.DateModify|datetime}}
            </td>
            <td class="text-nowrap">
              <label class="switcher">
                <input type="checkbox" v-model="item.Status" @change.stop="enable($event,item)">
                <span class="icon"></span>
              </label>
            </td>
            <td>
              <div class="action-field">
                <a href="javascript:;" class="item" @click="addArticle(item.Id)">编辑</a>
                <a href="javascript:;" class="item" @click="del(item,index)">删除</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
        暂无相关数据
      </div>
      <div class="pageBox text-right"></div>
    </div>

  </div>
  </div>
</template>
<script>
/**
 * 基础设置-求购列表
 */
export default {
  data() {
    return {
      isHidden: false,
      dataIn: {
        inited: false,
        arrDataList: []
      },
      pageIndex: 1,
      dataOut: {
        search: {
          Key: "",
          tobuyStatusId: "",
          StartDate: "",
          EndDate: "",
          CategoryCode: ""
        }
      },
      getBuyInfo: {},
      buyMatchInfo: {}
    };
  },
  components: {},
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 15;
      fetchData({
        API: "api/Misc/PGetAgentListAndPaging",
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data.Data;
          initPage(
            this.$el,
            data.TotalPages,
            data.TotalRows,
            this.initPageData,
            pageIndex
          );
        }
      });
    },
    changeTime() {
      this.dataOut.search.StartDate = this.$refs.StartDate.value;
      this.dataOut.search.EndDate = this.$refs.EndDate.value;
    },
    enable(e, item) {
      let isChked = e.target.checked;
      fetchData({
        API: "api/Misc/PAgentSetStatus",
        para: {
          Id: item.Id,
          Status: isChked - 0
        },
        callback: () => {
          item.Status = isChked;
        }
      });
    },
    del(item, index) {
      fetchData({
            API: "api/Misc/PAgentDelete",
            para: {
              Id: item.Id
            },
            callback: data => {
              this.dataIn.arrDataList.splice(index, 1);
            }
          });
    },
     addArticle(topid){       
          this.$router.push({
          path: 'addAgent',
          query: {
            id: topid
          }
        })
    },
    onCancel_Click() {
      this.isShowPop = false;
    }
  },
  computed: {},
  created() {
    this.initPageData(1);
  }
};
</script>