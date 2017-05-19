/**
 * 区域选择，借助jQuery，lodash方便实现
 * zhao.liubin@zol.com.cn
 */

var area = window.ucAreaInfo; //从服务器已经读取到的区域代码数据

var fnAreaSelector = function(obj) {
  // alert(area);
  var DOM = getTarget(obj); //获取真实DOM节点，无论传jQuery对象，或字符串
  if (DOM) {
    if (DOM.nodeName == 'INPUT') {
      var $div = $('<div class="area"><div class="show"></div><div class="selector" tabindex=100><div class="title"></div><div class="content"></div></div></div>');
      var $selector = $div.find('.selector');
      var $show = $div.find('.show'); //选择完成展示文字盒
      var $title = $div.find('.title'); //选择器省、市、县点击区域
      var $content = $div.find('.content'); //选择器省市内容表
      $title.html('<span class="item province">省份</span><span class="item city">城市</span><span class="item town">县区</span>');
      $content.html('<ul class="item"></ul><ul class="item"></ul><ul class="item"></ul>');
      var $DOM = $(DOM).hide();
      var val = $DOM.val();
      $selector.hide();

      //绑定过切换事件的不再二次绑定
      if ($show.data('areaEvent') != 1) {
        $(document).on('click', function(e) {
          if ($(e.target).closest('.selector').length == 0) {
            $selector.hide();
          };
        });
        $show.on('click', function() {
          $(this).data('areaEvent', 1);
          if ($selector.is(':visible')) {
            $selector.hide();
          } else {
            $selector.show();
          }
          return false;
        }).text('请选择');
      }
      //省市县点击切换
      $title.find('.item').on('click', function() {
        var $t = $(this).show();
        var i = $t.index();
        $t.siblings().removeClass('on');
        $t.addClass('on');
        $content.children().eq(i).show().siblings().hide();
      });
      //点击切换下级内容
      $content.on('click', '>.item>.item', function() {
        var $t = $(this).addClass('on');
        $t.siblings().removeClass('on');
        var code = $t.data('code');
        var i = $t.closest('ul.item').index();
        var html1 = '';
        var arrFilter = _.filter(area, { PCode: code });
        arrFilter.forEach(function(item) {
          html1 += '<li class="item" data-code="' + item.Code + '" data-level="' + item.Level + '">' + item.Item + '</li>';
        });
        var textShow = '';
        if (i != 0) {
          var j = i;
          while (j) {
            textShow += $content.find('.on').eq(i - j).text();
            j--;
          }
          textShow += $t.text();
        } else {
          textShow = $t.text();
        }
        $show.text(textShow);
        $content.find('>.item').eq(++i).html(html1);
        if (arrFilter.length > 0) {
          $title.find('.item').eq(i).click().nextAll().hide();
        } else {
          if (3 == i) {
            $title.find('.item').eq(2).click().nextAll().hide();
          } else {
            $title.find('.item').eq(0).click().nextAll().hide();
          }
        }
        $DOM.val($t.data('code'));
        $DOM.change();
        if ($t.data('level') == 2) {
          $selector.hide();
        }
      });
      var html = '';
      _.filter(area, { PCode: 0 }).forEach(function(item) {
        html += '<li class="item" data-code="' + item.Code + '">' + item.Item + '</li>';
      });
      $content.children().first().html(html);
      var curLastObj = _.find(area, { Code: parseInt(val) });
      if (!val || !curLastObj) {
        $show.text('请选择');
        if (val && !curLastObj) {
          $show.text('该地区码可能有误，请重选');
        }
        $title.find('.item').eq(0).siblings().hide();
        $content.find('>.item').eq(0).show().siblings().html('');
        $title.find('.item:first').addClass('on');
      } else {
        // var html1 = '';
        var PCode1 = curLastObj.PCode;
        var PCode0 = '';
        switch (curLastObj.Level) {
          case 0: //只能省级时
            {
              $title.find('.item').eq(0).addClass('on').siblings('.item').removeClass('on');
              $content.find('>.item').eq(0).find('[data-code=' + val + ']').click();
              break;
            }
          case 1: //到市一级
            {
              $content.find('>.item').eq(0).find('[data-code=' + PCode1 + ']').click();
              $content.find('>.item').eq(1).find('[data-code=' + val + ']').click();
              break;
            }
          case 2: //至县级
            {
              PCode0 = _.find(area, { Code: parseInt(PCode1) }).PCode;
              $content.find('>.item').eq(0).find('[data-code=' + PCode0 + ']').click();
              $content.find('>.item').eq(1).find('[data-code=' + PCode1 + ']').click();
              $content.find('>.item').eq(2).find('[data-code=' + val + ']').click();
              break;
            }
        }
      }
      if ($DOM.next().hasClass('area')) {
        $DOM.next().remove();
      }
      $DOM.after($div);
    } else {
      var $DOM = $(DOM);
      var curLastObj2 = _.find(area, { Code: parseInt($DOM.text().trim()) });
      var curPCode = curLastObj2.PCode;
      var str = curLastObj2.Item;
      while (curPCode) {
        curLastObj2 = _.find(area, { Code: parseInt(curPCode) });
        curPCode = curLastObj2.PCode;
        str = curLastObj2.Item + str;
      }
      $DOM.text(str);
    }

  } else {
    console.error('未找到DOM节点，请检查传入节点对象是否正确');
  }
};
module.exports = fnAreaSelector;
