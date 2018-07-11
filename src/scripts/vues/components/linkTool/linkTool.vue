<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="cancelClick">&times;</a>链接小工具</h2>
        <div class="body">
          <div class="content" style="width:1000px">
            <div class="tab-switcher">
              <div class="title">
                <span class="item" :class="{on:index==curTabIndex}" @click="switchTab(index)" v-for="(item,index) in arrTabTitle">
                  {{item.name}}
                </span>
              </div>
              <div class="content mt10 link-tool-box">
                <div class="item goodsList" :class="{on:curTabIndex==0}" style="min-height:390px;">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th colspan="3">
                          <input type="text" placeholder="输入关键字" v-model="keyGoods" class="com-ipt large" @keydown.enter="getGoodsList(1)">
                          <button class="btn search ml5" @click="getGoodsList(1)">搜索</button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in dataIn.arrGoodsList">
                        <td style="width:60px;">
                          <label class="radio">
                            <input type="radio" :id="'__pro'+item.ProId" :value="item.ProId" v-model="dataOut.ProId">
                            <span class="icon"></span>
                          </label>
                        </td>
                        <td>
                          <label :for="'__pro'+item.ProId" class="block">
                            <img :src="item.Images|imagesLink" alt="" class="ml5"> {{item.ProName}}
                          </label>
                        </td>
                        <td class="text-nowrap" style="width:100px;">
                          {{item.ProPrice|currency}}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="table-data-empty" v-show="dataIn.arrGoodsList.length==0">
                    暂无相关数据
                  </div>
                  <div class="pageBox text-right"></div>
                </div>
                <div class="item hyperLink" :class="{on:curTabIndex==1}">
                  <div class="set">
                    <dl class="item">
                      <dt class="title">
                        链接工具
                      </dt>
                      <dd class="content">
                        <input type="text" style="width:600px;" placeholder="请输入链接地址" v-model="hyperLink" data-validate="required url" class="com-ipt">
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="submitClick($event)">确定</button>
          <button class="btn btn-default" @click="cancelClick">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: { twoway: true, default: false },
    toolId: '', //有Id时，获取link数据信息
  },
  data() {
    return {
      curTabIndex: 0,
      arrTabTitle: [
        { linkType: 1, name: '商品链接' },
        { linkType: 11, name: '超链接' }
      ],
      dataIn: {
        arrGoodsList: [],
        arrOperationCategory: [],
      },
      dataOut: {
        ProId: '', //商品ID
        OCId: '0', //运营分类ID;
        FTId: '', //专题栏目ID
      },
      keyGoods: '',
      linkType: '1', //链接类型
      curFTindex: 0, //专题活动当前选项卡索引
      arrCurFocusThemeDataList: [], //当前专题活动右侧数据
      keyFT: '', //专题活动数据搜索框model

      hyperLink: '',
    }
  },
  components: {},
  methods: {
    switchTab(index) {
      this.curTabIndex = index;
      if (2 == index) { //处理专题活动时的链接类型
        this.linkType = this.arrFocusTheme[this.curFTindex].linkType;
      } else {
        this.linkType = this.arrTabTitle[this.curTabIndex].linkType;
      }
    },
    getGoodsList(pageIndex) { //获取商品列表
      let para = {};
      para.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 5;
      para.key = this.keyGoods;
      fetchData({
        hideLoading: true,
        API: '/api/Supplier/GetShopRenovationGoodsList',
        para,
        callback: data => {
          this.dataIn.arrGoodsList = data.Data;
          initPage(
            this.$el.querySelector('.goodsList'),
            data.TotalPages,
            data.TotalRows,
            this.getGoodsList,
            pageIndex
          );
        }
      })
    },

    submitClick(e) { //提交
      let para = {};
      para.Id = 0;
      para.linkType = this.linkType;
      switch (this.linkType - 0) {
        case 1:
          { //商品链接
            para.IdKey = this.dataOut.ProId;
            if (!para.IdKey) {
              showTips('请选择商品链接', 'warning');
              return;
            }
            break;
          }
        case 2:
          { //运营分类
            para.IdKey = this.dataOut.OCId;
            if (!para.IdKey) {
              showTips('请选择运营分类', 'warning');
              return;
            }
            break;
          }
        case 11:
          { //超链接
            if (!zmm_validator(this.$el.querySelector('.hyperLink'))) {
              return;
            }
            para.IdKey = this.hyperLink;

            break;
          }
        default: //专题活动走这里呀
          {
            para.IdKey = this.dataOut.FTId;
            if (!para.IdKey) {
              showTips('请选择活动项目', 'warning');
              return;
            }
            break;
          }
      }
      fetchData({
        API: '/api/ShopCategory/LinkToolEdit',
        target: e.target,
        hideTips: true,
        para,
        callback: data => {
          this.$emit('save-ok', data);
          this.cancelClick();
        }
      })
    },
    cancelClick() {
      this.show = false;
      this.$emit('update:show', false);
    }
  },
  created() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.dataOut.OCId = '0';
        this.dataOut.ProId = '';
        this.dataOut.FTId = '0';
        this.curFTindex = 0;
        if (this.toolId) {
          fetchData({
            hideLoading: true,
            API: '/api/ShopCategory/GetLinkToolInfo',
            para: {
              Id: this.toolId,
            },
            callback: data => {
              this.linkType = data.LinkType;
              switch (this.linkType - 0) {
                case 1:
                  { //商品链接
                    this.curTabIndex = 0;
                    this.dataOut.ProId = data.IdKey;
                    break;
                  }
                case 2:
                  { //运营分类
                    this.curTabIndex = 1;
                    this.dataOut.OCId = data.IdKey;
                    break;
                  }
                case 11:
                  { //超链接
                    this.curTabIndex = 1;
                    this.hyperLink = data.IdKey;
                    break;
                  }
                default: //专题活动走这里呀
                  {
                    this.curTabIndex = 2;
                    this.dataOut.FTId = data.IdKey;
                    this.curFTindex = _.findIndex(this.arrFocusTheme, {
                      linkType: this.linkType
                    });
                    break;
                  }
              }
            }
          })
        }

        this.getGoodsList(1);
      }
    }
  }
}
</script>