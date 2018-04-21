<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <!-- <a class="btn btn-primary fr" href="#/bc/goods/goodsSKU/">新增</a> -->
        <input type="search" placeholder="输入店铺名称" class="com-ipt ipt-search" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <span class="ml5">
          <select v-model="dataOut.search.UserType">
            <option value="" disabled selected>反馈人类型 </option>
            <option value="2">慧买卖入驻商 </option>
            <option value="3">慧买卖会员 </option>
            <option value="4">家电汇入驻商 </option>
            <option value="5">家电汇C端客户 </option>
            <option value="6">合伙人 </option>
          </select>
        </span>
        <span class="ml5">
          <select v-model="dataOut.search.SuggestType">
            <option value="" disabled selected>意见类型 </option>
            <option value="1">功能异常 </option>
            <option value="2">平台投诉 </option>
            <option value="3">体验建议 </option>
            <option value="4">其他 </option>
            <option value="5">帐号注册/登录/密码/验证相关</option>
            <option value="6">交易/支付功能相关</option>
            <option value="7">APP相关（卡顿/白屏/闪退</option>
          </select>
        </span>
        <span class="ml5">
          <select v-model="dataOut.search.Status">
            <option value="" disabled selected>处理状态</option>
            <option value="1">未处理 </option>
            <option value="2">处理中 </option>
            <option value="3">已处理 </option>
          </select>
        </span>
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table table-bordered datalist table-hover">
        <thead>
          <tr>
            <th style="width:130px;">反馈ID</th>
            <th>反馈账号</th>
            <th style="width:180px;">店铺名称</th>
            <th style="width:160px;">联系人</th>
            <th style="width:160px;">反馈人类型</th>
            <th style="width:180px;">意见类型</th>
            <th style="width:180px;">反馈时间</th>
            <th style="width:180px;">处理状态</th>
            <th style="width:180px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in dataIn.arrDataList">
            <td class="text-nowrap">
              {{item.Id}}
            </td>
            <td>
              {{item.Contacts}}
            </td>
            <td>
              {{item.ShopName}}
            </td>
            <td>
              {{item.Contacts}}
            </td>
            <td>
               <span v-if="item.UserType==2">慧买卖入驻商</span> 
               <span v-else-if="item.UserType==3">慧买卖会员</span>
               <span v-else-if="item.UserType==4">家电汇入驻商</span>
               <span v-else-if="item.UserType==5">家电汇C端客户</span>
               <span v-else="item.UserType==6">合伙人</span>
            </td>
            <td class="text-nowrap">
              <span v-if="item.SuggestType==1">功能异常</span>
              <span v-else-if="item.SuggestType==2">平台投诉</span>
              <span v-else-if="item.SuggestType==3">体验建议</span>
              <span v-else-if="item.SuggestType==4">其他</span>
              <span v-else-if="item.SuggestType==5">帐号注册/登录/密码/验证相关</span>
              <span v-else-if="item.SuggestType==6">交易/支付功能相关</span>
              <span v-if="item.SuggestType==7">APP相关（卡顿/白屏/闪退)</span>
            </td>
             <td class="text-nowrap">
              {{item.DateAdded|datetime}}
            </td>
             <td class="text-nowrap">
               <span v-if="item.Status==1">未处理</span>
               <span v-else-if="item.Status==2">处理中</span>
               <span v-else="item.Status==3">已处理</span>
            </td>
            <td>
              <div class="action-field">
                 <a href="javascript:;" @click="match(item)" class="item">{{item.Status=='3' ? '查看':'处理'}}</a>
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
</template>
<script>
/**
 * 基础设置-用户反馈
 */
export default {
  data() {
    return {
        isShowPop: false,
      dataIn: {
        inited: false,
        arrDataList: []
      },
      pageIndex: 1,
      dataOut: {
        search: {
          Key: "",
          UserType: "",
          SuggestType: "",
          Status: "",
        }
      },
      matchInfo:{},
      feedBackInfo:{}
    };
  },
  components: {},
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 15;
      fetchData({
        API: "api/Misc/PGetSuggestListAndPaging",
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
    match(item){
        this.$router.push({
          path: 'feedbackDispose',
          query: {
            id: item.Id
          }
        })
    }
  },
  created() {
    this.initPageData(1);
  }
};
</script>