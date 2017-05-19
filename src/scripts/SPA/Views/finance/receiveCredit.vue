<template>
  <div class="main" v-cloak>
    <h1 class="content-title">
        {{pageTitle}}
        </h1>
    <div class="content-field">
      <div class="tab-switcher">
        <div class="title">
          <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex==0}">收款列表</span>
          <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">账户明细</span>
        </div>
        <div class="content">
          <div class="item" :class="{on:tabIndex==0}">
            <rc-list :refresh.sync="isRefreshList" :account-type="accountType" :rights-api="computedAPILIST"></rc-list>
          </div>
          <div class="item" :class="{on:tabIndex==1}">
            <rc-detail :refresh="isRefreshList" :account-type="accountType" :rights-api="computedAPILIST"></rc-detail>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import rcList from './modules/rcList.vue';
import rcDetail from './modules/rcDetail.vue';
export default {
  data() {
      return {
        dataIn: {
          datalist: {}
        },
        accountType: 13,
        pageTitle: '额度收款',
        loadedAsync: {
          '0': false,
          '1': false,
        },
        tabIndex: 0,
        isRefreshList: false
      }
    }, computed: {
      computedAPILIST() {
        let objTemp = _.find(this.$store.state.action, {
          Item: this.pageTitle
        });
        return objTemp ? objTemp.Details : {};
      }
    },
    components: {
      rcList,
      rcDetail
    },
    methods: {
      toggle_Click(v, isAlwaysReload) {
        this.tabIndex = v;
        if (isAlwaysReload) {
          this.loadedAsync[v] = false;
          setTimeout(() => {
            this.loadedAsync[v] = true;
          }, 5)
        } else {
          this.loadedAsync[v] = true;
        }
        this.$router.go({
          name: 'receiveCredit',
          params: {
            recrTabIndex: v
          }
        });
      }
    },
    ready() {
      var me = this;
      this.tabIndex = this.$route.params.recrTabIndex;
    }
}
</script>
