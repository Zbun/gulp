<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <a href="javascript:;" class="btn btn-primary fr">添加自营店铺</a>
        <input type="search" placeholder="输入关键字" class="com-ipt ipt-search" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <select class="ml5" v-model="dataOut.search.Status">
          <option value="0">审核状态筛选</option>
          <option :value="key" v-for="(value,key) in computedStatus">
            {{value}}
          </option>
        </select>
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table table-bordered datalist table-hover">
        <thead>
          <tr>
            <th>企业名称</th>
            <th style="width:160px;">入库商账户</th>
            <th style="width:180px;">手机号码</th>
            <th style="width:180px;">联系人</th>
            <th style="width:160px;">入驻商属性</th>
            <th style="width:180px;">申请时间</th>
            <th style="width:180px;">审核状态</th>
            <th style="width:110px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in dataIn.arrDataList">
            <td>
              {{item.CompanyName}}
            </td>
            <td class="text-nowrap">
              {{item.UserName}}
            </td>
            <td class="text-nowrap">
              {{item.Phone}}
            </td>
            <td class="text-nowrap">
              {{item.RealName}}
            </td>
            <td class="text-nowrap">
              {{item.AdmissionAttribute}}
            </td>
            <td class="text-nowrap">
              {{item.LastApplyDateTime|datetime}}
            </td>
            <td class="text-nowrap" :class="{'text-danger':item.Status==10||item.Status==15}">
              {{item.StatusDesc}}
            </td>
            <td>
              <div class="action-field">
                <a href="javascript:;" v-if="item.Status==15||item.Status==25" class="item" @click="check(item)">审核</a>
                <a href="javascript:;" class="item" v-else @click="checkGoods(item)">详情</a>
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
 * 基础设置-品类管理
 */
export default {
  data() {
    return {
      dataIn: {
        inited: false,
        arrDataList: []
      },
      pageIndex: 1,
      dataOut: {
        search: {
          Key: '',
          Status: '0',
        }
      },
      ExamineActionInfo: {

      }
    }
  },
  computed: {
    computedStatus() {
      return dictionary['platfromSupplierStatus'];
    }
  },
  components: {},
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 15;
      fetchData({
        API: '/api/UserMng/GetToAuditedSupplierList',
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.ExamineActionInfo = data.ExamineActionInfo;
          this.dataIn.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    del(item, index) {
      dialog({
        title: '删除',
        content: `确认删除“${item.LabelName}”？`,
        ok: () => {
          fetchData({
            API: '/api/Goods/GoodsLabelDelete',
            para: {
              Id: item.Id
            },
            callback: data => {
              this.dataIn.arrDataList.splice(index, 1);
            }
          })
        },
        cancel() {

        }
      }).showModal();
    },
    checkGoods(item) {
      alert('稍候实现');
    },
  },
  created() {
    this.initPageData(1);

  }
}
</script>