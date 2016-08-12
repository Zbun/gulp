import Vue from 'vue';
import config from './config.js';
import YqyGuide from 'vues/guide';
import YqyToolbar from 'vues/toolbar';
import YqyChart from 'vues/chart';
import yqyCase from 'vues/case.vue';
import yqyOperation from 'vues/operation.vue';
import yqyBigOffice from 'vues/spread.vue';
import YqyScroll from 'vues/directives/scroll';


const BANNERSTATUS = {
  show: 1,
  hide: 0
};
new Vue({
  el: '#app',
  data: {
    bannerStatus: BANNERSTATUS.hide
  },
  methods: {
    caseExpand() {
      var vm = this;
      vm.bannerStatus = +!+vm.bannerStatus;
      if (window.localStorage) {
        localStorage.bannerStatus = vm.bannerStatus;
      } else {
        $.post(config.case.API.setShow, {
          isShow: vm.bannerStatus
        });
      }
    }
  },
  ready: function() {
    var vm = this;
    if (window.localStorage) {
      vm.bannerStatus = localStorage.bannerStatus == undefined ? localStorage.bannerStatus = 1 : localStorage.bannerStatus;
    } else {
      $.get(config.case.API.isHide, function(data) {
        vm.bannerStatus = data.data.isShow;
      }, 'JSON');
    }

  },
  components: { YqyGuide, YqyToolbar, YqyChart, yqyCase, yqyOperation, yqyBigOffice },
  directives: { YqyScroll }
});

require('tabSwitcher');
