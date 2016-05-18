$('.footer.menu').on('click', '>.item .js-toggle', function() {
    var $t = $(this);
    $t.closest('.menu-l1').addClass('on').find('.on').removeClass('on').end().siblings('.item').removeClass('on');
    $t.addClass('on');
});

require('tabSwitcher.js');

//前进后退下步，不刷页面
function showByHash() {
    var hash = location.hash.split('#')[1];
    var $currentContent = $('.step').children('[data-step=' + hash + ']');
    if ($currentContent.length) {
        $currentContent.addClass('am-ease-show on').siblings('.item').removeClass('on am-ease-show');
    } else {
        $('.step').children('.item').first().addClass('am-ease-show on');
    }
    var title = $currentContent.data('stepTitle');
    if (title) {
        document.title = title;
    }
}
showByHash();
window.addEventListener('hashchange', showByHash);

//只拖动，不读数
var htmlMenuL2 = '<li class="item js-toggle">$text</li>';
$('.menu-l2').dragsort({
    itemSelector: 'li:not(.add-wrapper)',
    dragSelector: 'li',
    dragBetween: true,
    placeHolderTemplate: "<li></li>"
}).find('.add-wrapper').on('click', function() {
    var $t = $(this);
    var $parent = $t.closest('.menu-l2');
    if ($parent.children().length > 5) {
        $t.hide();
        return;
    }
    $t.closest('.menu-l2').children().first().before(htmlMenuL2);
})

//删除菜单
var slideDel = require('slideDelete');
$('.del-menu').on('click', function() {
    var $on = $('.footer.menu').find('.on .on');
    var $prev = $on.prev('.js-toggle'),
        $next = $on.next('.js-toggle');
    var $parent = $on.parent();
    slideDel($on, function() {
        if ($parent.hasClass('menu-l2')) {
            if ($prev.length) {
                $prev.click();
            } else if ($next.length) {
                $next.click();
            }
            $parent.find('.add-wrapper').show();
        }
    });
})
