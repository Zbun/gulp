<template>
  <header id="header" class="row">
    <div class="inner clearfix">
      <div class="fl">
        <a href="/" class="home-link"><img src="/dist/images/logo.png" alt="Z管家Logo"></a>
      </div>
      <div class="fr">
        <div class="user-info fl" v-show="userName.length>0">
          <span class="detail">
            <span class="company-name mr30" title="公司名称" style="position:relative;" @mouseover="onOver" @mouseout="onOut">
              <i class="icon"></i>
              {{computedCompanyName}}
              <i class="icon-dropdown" :class="{'icon-dropdown-hover':show}"></i>
              <div title="修改密码" class="modify-password" @mouseover="onOver" @mouseout="onOut" v-if="show">
                <span @click="update_Click">修改密码</span>
        </div>
        </span>
        <span class="name mr20" title="真实姓名">
              <i class="icon"></i>
              {{userName}}
            </span>
        <!--             <span v-if="computedIsAdmin" title="卖家中心" class="mr10 gozmm" style="cursor:pointer" @click="goZMM()">
              <i class="icon"></i>
              Z买卖
            </span> -->
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
    <update-psw :show.sync="showModal" @after:update="logout"></update-psw>
  </header>
</template>
<script>
export default {
  components: {
    updatePsw: require('./updatePswd.vue')
  },
  data() {
    return {
      show: false,
      timer: null,
      delay: 200,
      showModal: false,
    }
  },
  methods: {
    update_Click() {
      this.showModal = true;
    },
    onOut() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.show = false;
      }, this.delay)
    },
    onOver() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.show = true;
      }, this.delay)
    },
    logout() {
      localStorage.token = '';
      this.$store.state.isShowMenu = false;
      this.$store.state.isAdmin = false;
      // this.$store.state.arrTabBar = this.$store.state.arrTabBar.splice(0, 1); //清除选项卡标签
      // this.$store.state.arrTabBar[0].On = 1;
      localStorage.userName = this.$store.state.userName = '';
      localStorage.companyName = this.$store.state.companyName = '';
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