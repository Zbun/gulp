<template>
  <nav class="row home-menu">
    <div class="inner">
      <ul class="nav clearfix">
        <li class="item multi" v-for="item of computedMenu">
          <h4 class="title"><span class="m-icon"><img :src="item.Icon?'/dist/images/menu/'+item.Icon:''" alt=""></span>{{item.Name}}</h4>
          <div class="subitem">
            <div class="item" v-for="item1 in item.Childs">
              <p class="m-title">{{item1.Name}}</p>
              <ul>
                <li v-for="sub of item1.Childs">
                  <a href="javascript:;" class="link small" :class="sub.link" @click="link_Click($event,sub)"><span class="text">{{sub.Name}}</span></a>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="footer">企业版2.0</div>
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
      // let targetMenu = [];
      // let arrMenu = this.$store.state.menu;
      // if (arrMenu.length > 0) {
      //   for (let i = 0; i < arrMenu.length; i++) {
      //     let curObjMenu = arrMenu[i];
      //     let arrTemp = [];
      //     while (curObjMenu.Childs.length) {
      //       arrTemp.push(curObjMenu.Childs.splice(0, 5));
      //     }
      //     curObjMenu.Childs = arrTemp;
      //   }
      //   targetMenu = arrMenu;
      // }
      return this.$store.state.menu;
    },
    computedMainBox() {
      return $('#main-box');
    }
  },
  methods: {
    link_Click(e, sub) {

      $(e.target).closest('.item').addClass('on').siblings().removeClass('on').closest('.nav').find('.link').removeClass('on');
      $(e.target).addClass('on');
      if (sub.Name) document.title = `${sub.Name}-Z管家`;
      if (!this.computedMainBox.find('>#m' + sub.Id).length) {
        var $div = $('<div>');
        $div.addClass('main').attr('id', 'm' + sub.Id).data('id', sub.Id);
        var iframe = document.createElement('iframe');
        iframe.src = (/b2b\//i.test(sub.Url) ? '/page2b.html' : 'page.html') + sub.Url;
        $div.append(iframe);
        this.computedMainBox.append($div);
        $div.siblings().hide();
      } else {
        this.computedMainBox.find('>#m' + sub.Id).show().siblings().hide();
      }

      if (!_.find(this.$store.state.arrTabBar, {
          Id: sub.Id
        })) {
        let objTemp = {};
        objTemp.Id = sub.Id;
        objTemp.Name = sub.Name;
        objTemp.On = 1;
        this.$store.state.arrTabBar.forEach(item => {
          item.On = 0;
        });
        this.$store.state.arrTabBar.push(objTemp);
      } else {
        this.$store.state.arrTabBar.forEach(item => {
          item.On = 0;
          if (item.Id == sub.Id) {
            item.On = 1;
          }
        });
      }
    },
    getMenus() {
      let me = this;
      fetchData({
        API: '/Api/User/UserIndex',
        callback(data) {
          window.localStorage.token = data.Token;
          window.localStorage.Config_AccountingType = data.Config_AccountingType;
          window.localStorage.Config_Stock_IsMinus = data.Config_Stock_IsMinus; //负库存参数
          window.localStorage.Config_Stock_IsUnderCostByOut = data.Config_Stock_IsUnderCostByOut; //是否低于成本价
          window.localStorage.PayFirst = data.PayFirst;
          window.localStorage.Config_TaxRate = data.Config_TaxRate; //税率
          window.localStorage.PricePower = data.PricePower; //是否显示单价
          me.$store.state.userName = window.localStorage.userName = data.Real;
          me.$store.state.companyName = window.localStorage.companyName = data.CompanyName;
          me.$store.state.BranchName = window.localStorage.BranchName = data.BranchName;
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
    if (window.location.hash.indexOf('login') == -1) {
      this.getMenus();
    }
  }
}
</script>