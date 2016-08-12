let config = {
  guide: {
    API: {
      get: '/home/guide/task.html',
      ignore: '/home/guide/ignore.html{?id}'
    },
    consts: {
      GUIDE_FORWARD_URL: '/forward/guide.html{?id}',
      GUIDE_UNFINISHED: 0,
      GUIDE_DONE: 1,
      GUIDE_IGNORE: 2
    }
  },
  homeIntro:{
    get:'/home/guide/queryHomeStep.html'
  },
  toolbar: {
    API: {
      get: '/module/shortcut/queryMyShortcut.html',
      getIgnore: '/module/shortcut/queryNotMyShortcut.html',
      set: '/module/shortcut/editMyShortcut.html'
    },
    consts: {
      TOOLBAR_UNSELECTED: 0,
      TOOLBAR_SELECTED: 1
    }
  },
  case: {
    API: {
      get: '/home/banner/queryBanner.html',
      isHide: '/home/banner/queryIsShow.html',
      setShow: '/home/banner/editIsShow.html'
    }
  },
  chart: {
    API: {
      get: '/module/data/chart.html'
    }
  },
  operation: {
    API: {
      get: '/module/activity/page.html',
      tag: {
        get: '/module/activity/queryById.html',
        set: '/module/activity/updateTag.html'
      },
      remark: {
        get: '/module/activity/queryById.html',
        set: '/remark/remarkActivity.html'
      },
      analysis: {
        get: '/module/activity/analysis.html'
      },
      activity: {
        set: ' /module/activity/end.html'
      }
    },
    pagination: {
      visiblePage: 5,
      size: 8
    }
  },
  spread: {
    API: {
      get: '/home/choose/queryOffice.html'
    }
  }
};
module.exports = config;
