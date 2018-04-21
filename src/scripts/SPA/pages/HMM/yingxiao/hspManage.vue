<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <span class="fr">
          <!-- <button class="btn">批量结束</button> -->
          <button class="btn btn-primary" @click="setTop(1)">设置为尖货</button>
          <button class="btn btn-warning" @click="setTop(0)">取消尖货</button>
        </span>
        <span class="date-field ">
        <input type="text" v-model="dataOut.search.ShowTime" readonly="" placeholder="开始时间"  onclick="WdatePicker()" @focus="changeTime($event)">
        <i class="fa fa-calendar icon"></i>
      </span>
        <select class="ml5">
          <option>早市</option>
          <option>夜市</option>
        </select>
        <input type="search" placeholder="商品名称/申请卖家" class="com-ipt ml5 ipt-search" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <div class="ovh-y">
        <table class="table table-bordered datalist table-hover">
          <thead>
            <tr>
              <th style="width:60px;">
                <label class="checkbox">
                  <input type="checkbox" :checked="arrChkedId.length>0&&arrChkedId.length==dataIn.arrDataList.length" @change="chooseAll($event)"><span class="icon"></span></label>
              </th>
              <th>商品</th>
              <th style="width:110px;">单价</th>
              <th style="width:110px;">库存</th>
              <th style="width:110px;">闪批价</th>
              <th style="width:110px;">优惠金额</th>
              <th style="width:110px;">每人限批</th>
              <th style="width:110px;">日期范围</th>
              <th style="width:110px;">申请卖家/申请时间</th>
              <th style="width:110px;">状态</th>
              <th style="width:110px;">顺序</th>
              <th style="width:110px;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in dataIn.arrDataList">
              <td class="text-nowrap">
                <label class="checkbox">
                  <input type="checkbox" :value="item.HSPId" v-model="arrChkedId"><span class="icon"></span></label>
              </td>
              <td class="text-nowrap">
                <img :src="item.Image" class="mr10">{{item.ProName}} <span v-if="item.IsGood==1" class="tag-mini">尖货</span>
              </td>
              <td class="text-nowrap">
                {{item.ProPrice|currency}}
              </td>
              <td class="text-nowrap">
                {{item.AmountSum}}
              </td>
              <td class="text-nowrap">
                {{item.HSPPrice|currency}}
              </td>
              <td class="text-nowrap">
                {{item.Discount|currency}}
              </td>
              <td class="text-nowrap">
                {{item.MaxBuyNumPeriods}}
              </td>
              <td class="text-nowrap">
                {{item.Start}}~{{item.End}}
              </td>
              <td class="text-nowrap">
                {{item.ShopName}}
                <p class="text-light">
                  {{item.ApplyDate|datetime}}
                </p>
              </td>
              <td class="text-nowrap">
                <span :class="{'text-danger':item.Status==3}">
                {{item.StatusDesc}}
                </span>
              </td>
              <td class="text-nowarp">
                {{item.Weight}}
              </td>
              <td>
                <div class="action-field">
                  <router-link :to="{name:'HMMhspCheck',params:{id:item.HSPId}}" class="item">查看</router-link>
                  <a href="javascript:;" class="item" v-if="item.Status==2" @click="setStatus(item,5)">继续</a>
                  <a href="javascript:;" class="item" v-if="item.Status==5" @click="setStatus(item,2)">暂停</a>
                  <a href="javascript:;" class="item" v-if="item.Status!=3" @click="setStatus(item,3)">结束</a>
                  <a href="javascript:;" class="item" @click="setWeight(item)">排序</a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
        暂无相关数据
      </div>
      <div class="pageBox text-right"></div>
    </div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>排序</h2>
        <div class="body">
          <div class="content" style="width:400px">
            <div class="set w4em">
              <dl class="item">
                <dt class="title">
                  商品名称
                </dt>
                <dd class="content">
                  <input type="text" :title="curItem.ProName" readonly="" v-model="curItem.ProName" class="com-ipt block">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">排序</dt>
                <dd class="content">
                  <input type="text" placeholder="请输入" data-validate-text="请输入排序" v-model="weight" data-validate="required integer" class="com-ipt block">
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">确定</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 营销中心-慧闪批管理
 */
export default {
  data() {
    return {
      dataIn: {
        inited: false,
        arrDataList: []
      },
      show: false,
      curItem: {},
      weight: '',
      arrChkedId: [],
      pageIndex: 1,
      dataOut: {
        search: {
          ShowTime: zmm_date.getTheDay({ x: 0 }),
          Key: '',
          Status: '',
        }
      },
      editInfo: {}
    }
  },
  components: {

  },
  methods: {
    changeTime(e) { //临时解决时间选择选不中问题
      this.dataOut.search.ShowTime = e.target.value;
    },
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 15;
      this.arrChkedId = [];
      fetchData({
        API: '/api/Goods/HGetHspList',
        para,
        callback: data => {
          this.dataIn.inited = true;
          data.Data.forEach(item => {
            if (item.Image.length == 0) {

            }
          })
          this.dataIn.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    setTop(type) { //设置尖货
      if (this.arrChkedId.length == 0) {
        showTips('请先勾选商品', 'warning');
        return;
      }
      fetchData({
        API: '/api/Goods/PHspSetGood',
        para: {
          Ids: this.arrChkedId,
          IsGood: type,
          Time: this.dataOut.search.ShowTime
        },
        callback: data => {
          this.initPageData(this.pageIndex);
        }
      })
    },
    setStatus(item, status) { //设置状态
      let fn = () => {
        fetchData({
          API: '/api/Goods/HspSetStatus',
          para: {
            Id: item.HSPId,
            Status: status,
          },
          callback: data => {
            this.initPageData(this.pageIndex);
          }
        });
      }
      if (status == 3) {
        dialog({
          title: '结束活动',
          content: `确认结束“${item.ProName}”此条活动？`,
          ok: fn,
          cancel() {}
        }).showModal();
      } else {
        fn();
      }
    },
    chooseAll(e) {
      let isChked = e.target.checked;
      if (isChked) {
        this.arrChkedId = this.dataIn.arrDataList.map(el => el.HSPId);
      } else {
        this.arrChkedId = [];
      }
    },
    setWeight(item) {
      this.curItem = item;
      this.weight = item.Weight;
      this.show = true;
    },
    onSubmit_Click() {
      if (!zmm_validator(this.$el.querySelector('.popup'))) {
        return;
      }
      fetchData({
        API: '/api/Goods/PHspSetWeight',
        para: {
          HspId: this.curItem.HSPId,
          Time: this.dataOut.search.ShowTime,
          Weight: this.weight,
        },
        callback: data => {
          this.initPageData(this.pageIndex);
          this.onCancel_Click();
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    }
  },
  created() {

    this.initPageData(1);
  }
}
</script>