<template>
  <nav class="row home-menu" v-if="isShowMenu">
    <div class="inner">
      <ul class="nav clearfix">
        <li class="item home on"><a href="#!/home" @click="link_Click($event,'首页')" class="title home link on">首页</a></li>
        <li class="item multi" v-for="item of computedMenu">
          <span class="title">{{item.Item}}</span>
          <ul class="subitem">
            <li v-for="sub of item.ChildMenu">
              <a :href="sub.Url" class="link small" :class="sub.link" @click="link_Click($event,sub.Item)">{{sub.Item}}</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
export default {
  data() {
      return {
        dataIn: {
          menu: []
        }
      }
    },
    computed: {
      isShowMenu() {
        return this.$store.state.isShowMenu || localStorage.token.length > 0;
      },
      computedMenu() {
        let arrTemp = [];
        if (this.$store.state.menu.length > 0) {
          arrTemp = this.$store.state.menu;
        }
        return arrTemp;
      }
    },
    methods: {
      link_Click(e, text) {
        $(e.target).closest('.item').addClass('on').siblings().removeClass('on').closest('.nav').find('.link').removeClass('on');
        $(e.target).addClass('on');
        if (text) document.title = `${text}-Z管家`;
      },
      getMenus() {
        let me = this;
        fetchData({
          API: '/Api/User/UserIndex',
          callback(data) {
            localStorage.token = data.Token;
            localStorage.Config_AccountingType = data.Config_AccountingType;
            me.$store.state.userName = localStorage.userName = data.Real;
            me.$store.state.companyName = localStorage.companyName = data.CompanyName;
            me.$store.state.isShowMenu = true;
            me.$store.state.isAdmin = !!data.IsAdmin;
            me.$store.state.action = data.Action;
            me.$store.state.menu = data.Menus;
            setTimeout(function() {
              let rh = window.location.hash;
              let $nav = $('.home-menu').find('.nav');
              if (rh.indexOf('login') > -1) {
                rh = window.location.hash = 'home';
                $nav.find('.home').addClass('on');
              }
              $nav.find('.link').removeClass('on').closest('.item').removeClass('on');
              if (/\d/.test(rh)) {
                rh = rh.replace(/\d/, '0');
              }
              if (rh == '#!\/') {
                $nav.find('.home').addClass('on');
              } else {
                $nav.find('a[href="' + rh + '"]').addClass('on').closest('.item').addClass('on');
              }
            }, 10);

            //下面为限制菜单权限全部必要代码,
            let fnControlMenu = function() {
                let allChildMenu = [];
                let arrTemp1 = [];
                data.Menus.forEach(item => {
                  item.ChildMenu.forEach(item => {
                    arrTemp1 = item.Url.split('\/');
                    allChildMenu.push(arrTemp1[1] + '\/' + arrTemp1[2]);
                    item.Actions.forEach(item => {
                      if (item.Cmd[0] != '#' && item.Cmd[0] != '!' && item.Cmd[0] != '\/') {
                        item.Cmd = '/' + item.Cmd;
                      }
                      arrTemp1 = item.Cmd.split('\/');
                      allChildMenu.push(arrTemp1[1] + '\/' + arrTemp1[2]);
                    })
                  })
                });
                let strHash = window.location.hash.split('\/')[1] + '\/' + window.location.hash.split('\/')[2];
                if (_.indexOf(allChildMenu, strHash) == -1 && !/login|home|pp\/ps/.test(strHash)) {
                  // return;
                  me.$router.go({
                    name: 'home'
                  });
                }
                me.$router.beforeEach(({
                  to,
                  next
                }) => {
                  // console.log(to);
                  let setPath = to.path.split('\/')[1] + '\/' + to.path.split('\/')[2]
                  if (/login|home|pp\/ps/.test(setPath) || _.indexOf(allChildMenu, setPath) > -1) {
                    // return;
                    to.router.go({
                      name: to.name
                    });
                  } else {
                    // to.router.go({
                    //   name: '404'
                    // });
                    return;
                  }
                  next();
                })
              }
              // fnControlMenu();
          }
        })
      }
    },
    ready() {
      this.getMenus();
    }
}
</script>
