<template>
  <div class="main">
    <!-- <h2 class="content-title">首页</h2> -->
    <div class="content-field">
      <!--       <h1 class="text-center text-ok mt20">
        欢迎光临>0<
      </h1> -->
      <div class="clearfix">
        <div class="fr">
          <span class="ml10 font-small">最近同步时间：<b>{{dataIn.finalSyncTime|datetime}}</b></span>
          <button class="btn btn-primary ml20" :class="{disabled:true==isOnSending}" @click="syncAll_Click()">
            同步数据
          </button>
        </div>
      </div>
      <div class="sync-box">
        <div class="top">
          <h3 class="title">
            同步B2b重要信息
          </h3>
          <div class="loading-bar" v-if="!computedSyncOk"></div>
        </div>
        <div class="steps">
          <ul class="lists">
            <li :class="{ok:true==isOnline,error:false==isOnline}">
              <i class="icon"></i>
              <span class="text">
                   准备数据
                 </span>
            </li>
            <li class="item companyInfo">
              <span class="text-statistics fr text-warning mr30"></span>
              <i class="icon"></i> 同步公司信息
            </li>
            <li class="item express"><span class="text-statistics fr text-warning mr30"></span>
              <i class="icon"></i> 同步物流信息
            </li>
            <li class="item customer"><span class="text-statistics fr text-warning mr30"></span>
              <i class="icon"></i> 同步客户
            </li>
            <li class="item product"><span class="text-statistics fr text-warning mr30"></span>
              <i class="icon"></i> 同步商品
            </li>
            <li class="item Attachment"><span class="text-statistics fr text-warning mr30"></span>
              <i class="icon"></i> 同步礼品
            </li>
            <li class="item order"><span class="text-statistics fr text-warning mr30"></span>
              <i class="icon"></i> 同步订单
            </li>
          </ul>
          <p class="text-center footer" v-if="computedSyncOk">
            <button class="btn btn-primary" @click="finish_Click()">
              完成
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import formDataUpload from 'commonScripts/formDataUpload.js';
export default {
  data() {
      return {
        syncCount: 6,
        syncNum: 0,
        isOnline: true,
        isOnSending: false,
        arrSyncInfo: [
          'companyInfo', 'express', 'customer', 'product', 'Attachment', 'order'
        ],
        dataIn: {
          finalSyncTime: ''
        }
      }
    },
    computed: {
      computedSyncOk() {
        return this.syncNum == this.syncCount;
      }
    },
    components: {},
    methods: {
      getFinalSyncTime() {
        let me = this;
        fetchData({
          API: '/Api/di/LastSyncDateTime',
          hideLoading: true,
          callback(data) {
            me.dataIn.finalSyncTime = data;
          }
        })
      },
      sync_Click(api) {
        let me = this;
        fetchData({
          api: '/Api/di/Sync' + api,
          hideLoading: true,
          hideTips: true,
          callback(data) {
            $(me.$el).find('.sync-box').find('.' + api).addClass('ok').find('.text-statistics').text('（' + data + '）');
            me.syncNum++;
            if (me.syncNum == me.syncCount) {
              me.getFinalSyncTime();
              return;
            } else {
              me.sync_Click(me.arrSyncInfo[me.syncNum]);
            }
          },
          errorCallback() {
            me.$el.querySelector('.sync-box').querySelector('.' + api).classList.add('error');
            me.syncNum++;
            if (me.syncNum == me.syncCount) {
              me.getFinalSyncTime();
              return;
            } else {
              me.sync_Click(me.arrSyncInfo[me.syncNum]);
            }
          }
        })
      },
      syncAll_Click() {
        let me = this;
        this.syncNum = 0;
        let $syncBox = $(this.$el).find('.sync-box');
        $syncBox.show().find('.item').removeClass('ok error').find('.text-statistics').text('');
        this.isOnline = undefined != window.navigator.onLine ? window.navigator.onLine : true;
        if (this.isOnline) {
          this.isOnSending = true;
          setTimeout(function() {
            me.isOnSending = false;
          }, 1000);
          me.sync_Click(me.arrSyncInfo[me.syncNum]);
          // for (let i = 0; i < this.arrSyncInfo.length; i++) {
          //   let api = this.arrSyncInfo[i];
          //   if (this.arrSyncInfo[i] == 'order') {
          //     setTimeout(function() {
          //       me.sync_Click(api);
          //     }, 1500);
          //   } else {
          //     setTimeout(function() {
          //       me.sync_Click(api);
          //     }, 200 * i);
          //   }
          // }
        } else {
          showTips('您处于离线状态，请检查联网状况', 'error');
        }
      },
      finish_Click() {
        $(this.$el).find('.sync-box').hide().find('.item').removeClass('ok error');
      }
    },
    ready() {
      let me = this;
      // fetchData({
      //   API: '/Api/User/UserIndex',

      //   callback(data) {
      //     localStorage.token = data.Token;
      //     me.$store.state.userName = localStorage.userName = data.Real;
      //     me.$store.state.isShowMenu = true;
      //   }
      // })
      //
      //初始化起止时间间隔
      window.localStorage.DISSTARTDATE = -7;
      window.localStorage.DISENDDATE = 0;
      this.getFinalSyncTime();
    }
}
</script>
