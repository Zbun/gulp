// var $=require('jquery');

module.exports = (function($) {
    if (!$) {
        console.warn('需要jQuery赞助哦');
        return;
    }

    $('.js-switcher').children('.title').children('.item').on('click', function() {
        var $t = $(this),
            index = $t.closest('.title').children('.item').index(this);
        $t.addClass('on').siblings('.item').removeClass('on').closest('.js-switcher').children('.content').children('.item').eq(index).addClass('on').siblings('.item').removeClass('on')
    });
})(jQuery)
