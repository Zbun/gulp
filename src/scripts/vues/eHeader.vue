<template>
  <header id="header" class="row">
    <div class="inner clearfix">
      <div class="fl">
        <a href="/"><img src="/dist/images/logo.png" alt="Z管家Logo"></a>
      </div>
      <div class="fr">
        <div class="user-info fl" v-show="userName.length>0">
          <span class="detail">
            <span class="company-name mr30" title="公司名称">
              <i class="icon"></i>
              {{computedCompanyName}}
            </span>
          <span class="name mr20" title="真实姓名">
            <i class="icon"></i>
            {{userName}}
          </span>
          <span v-if="computedIsAdmin" title="卖家中心" class="mr10 gozmm" style="cursor:pointer" @click="goZMM()">
            <i class="icon"></i>
            Z买卖
          </span>
          </span>
        </div>
        <ul class="action">
          <!--           <li>
            <a href="javascript:;" class="item help" title="帮助">帮助</a>
          </li>
          <li>
            <a href="javascript:;" class="item message" title="点击查看站内信">站内信</a>
          </li> -->
          <li>
            <a href="javascript:;" class="item logout" title="点击退出系统" @click="logout">退出</a>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  data() {
      return {}
    },
    methods: {
      logout() {
        localStorage.token = '';
        localStorage.userName = '';
        localStorage.companyName = '';
        this.$store.state.isShowMenu = false;
        this.$store.state.isAdmin = false;
        this.$store.state.userName = '';
        this.$store.state.companyName = '';
        setTimeout(function() {
          location = window.G_LOGINHREF;
          // location.reload();
        }, 200);
        // location.reload();
      },
      goZMM() {
        let l = location.host.split('.')[0];
        let refer = document.referrer;
        let pre = 'www';
        if (refer.indexOf('demo') > -1) {
          pre = 'demo';
        }
        location = location.protocol + '\/\/' + pre + '.zmaimai.com' + '\/s\/';
      }
    },
    computed: {
      userName() {
        return this.$store.state.userName || localStorage.userName || '';
      },
      computedCompanyName() {
        return this.$store.state.companyName || localStorage.companyName || '';
      },
      computedIsAdmin() {
        return this.$store.state.isAdmin;
      }
    },
    ready() {}
}
</script>
