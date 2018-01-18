export default {
  computed: {
    computedMainBox() {
      return $('#main-box');
    }
  },
  methods: {
    link_Click(e, sub) {
      // $(e.target).closest('.item').addClass('on').siblings().removeClass('on').closest('.nav').find('.link').removeClass(
      //   'on');
      // $(e.target).addClass('on');
      if (sub.Name) document.title = `${sub.Name}-Z管家`;
      if (!this.computedMainBox.find('>#m' + sub.Id).length) {
        var $div = $('<div>');
        $div.addClass('main').attr('id', 'm' + sub.Id).data('id', sub.Id);
        var iframe = document.createElement('iframe');
        iframe.src = (/b2b\//i.test(sub.Url) ? '/page2b.html' : 'page.html') + '?date=' + window.localStorage.G_SEARCH_PARA_NOT_CACHE +
          sub.Url;
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
  }
}