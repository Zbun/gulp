<template>
  <div>
    <header id="header">
      <a href="/" class="logo">
      <img src="/dist/images/logo.png" alt="">
    </a>
      <div class="action">
        <a href="javascript:;" class="item">{{computedUserInfo.RealName}}</a>
        <a href="/" class="item" title="首页"><i class="iconfont icon-shouye"></i></a>
        <a href="javascript:;" class="item" title="安全退出系统" @click="logout"><i class="iconfont icon-tuichu"></i></a>
      </div>
      <div class="nav">
        <a href="javascript:;" class="item" :class="{on:item._on}" @click.prevent="selectCurMenu(item)" v-for="item in arrDataMenu">
          <i :class="'iconfont ' +'icon-'+item.Icon" ></i>
          {{item.Item}}
        </a>
      </div>
    </header>
    <nav id="nav" class="ovh-x">
      <ul class="list">
        <li v-for="item in arrCurMenu">
          <h3 class="title" :class="{spread:item._spread}" @click="spreadMenu(item)">
          <i :class="'icon iconfont ' +'icon-'+item.Icon" ></i>{{item.Item}}
        </h3>
          <div class="list">
            <a :href="'#'+item.MenuUrl" v-for="item in item.Child" @click="clickLink(item)" class="link item" :class="{on:item._on}">{{item.Item}}</a>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
/**
 *  顶通，包含左侧菜单
 */

export default {
  data() {
    return {
      isShowInfo: false,
      arrDataMenu: [],
      arrCurMenu: []
    }
  },
  components: {},
  computed: {
    computedUserInfo() {
      return localStorage._LOGIN_USERINFO ? JSON.parse(localStorage._LOGIN_USERINFO) : {};
    }
  },
  methods: {
    initPageData() {
      fetchData({
        api: '/api/UserAuth/GetUserMenu',
        para: {},
        callback: data => {
          setTimeout(() => { //展开菜单方法，拐弯取到了当前路由
            data.forEach((item, i) => {
              item._on = false;
              if (i == 0) {
                item._on = true;
              }
              item.Child.forEach(item0 => {
                item0._spread = false;
                item0.Child.forEach(item => {
                  item._on = false;
                  if (item.MenuUrl == this.$store.state.currentRoute.path) { //判断是否命中当前路由
                    item0._spread = true;
                    item._on = true;
                  }
                })
              })
            })
            this.arrDataMenu = data;
            this.arrCurMenu = data[0].Child;
          }, 100);

        }
      })
    },
    selectCurMenu(item) {
      this.arrDataMenu.forEach(item => {
        item._on = false;
      })
      item._on = true;
      this.arrCurMenu = item.Child;
    },
    spreadMenu(item) {
      item._spread = !item._spread;
    },
    clickLink(item) {
      this.arrCurMenu.forEach(item => {
        item.Child.forEach(item => {
          item._on = false;
        })
      })
      document.title = item.Item + '-慧聪云商';
      item._on = true;
    },
    logout() {
      fetchData({ //退出
        API: '/api/UserAuth/LoginOut',
        hideLoading: true,
        hideTips: true,
      })
      localStorage.token = '';
      this.$store.state.isShowMenu = false;
      this.$store.state.isAdmin = false;
      localStorage.userName = this.$store.state.userName = '';
      localStorage.companyName = this.$store.state.companyName = '';
      setTimeout(function() {
        location = window.G_LOGINHREF || '/login.html';
      }, 200);
    },

  },
  created() {
    this.initPageData();

  }
}
</script>