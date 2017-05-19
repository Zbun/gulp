/**
 * 标签及单选之类切换，需要对应DOM结构
 * @author Zhao Liubin
 * @date   2016-05-19
 * @param  {[type]}
 * @return {[type]}
 */
module.exports = (function($) {
  if (!$) {
    console.warn('需要jQuery赞助哦');
    return;
  }


  $('body').on('click', '.tab-switcher>.title>.item', function() {
    var $t = $(this),
      index = $t.closest('.title').children('.item').index(this);
    $t.addClass('on').siblings('.item').removeClass('on').closest('.tab-switcher').children('.content').children('.item').removeClass('on').eq(index).addClass('on');
  })

})(jQuery);
