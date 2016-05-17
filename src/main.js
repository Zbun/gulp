$('.footer.menu').on('click', '>.item .js-toggle', function() {
    var $t = $(this);
    $t.closest('.menu-l1').toggleClass('expanded').siblings('.item').removeClass('expanded');
    $t.addClass('on').siblings('.item').removeClass('on');
    if (!$t.hasClass('wealthy')) {
        $t.closest('.menu-l1').addClass('on').siblings('.item').removeClass('on');
    }
});
