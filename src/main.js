$('body').on('click', '.footer.menu>.item .js-toggle', function() {
    var $t = $(this);
    $t.closest('.menu-l1').toggleClass('expanded').siblings('.item').removeClass('expanded');
    $t.addClass('on').siblings('.item').removeClass('on');
    if (!$t.hasClass('wealthy')) {
        $t.closest('.menu-l1').addClass('on').siblings('.item').removeClass('on');
    }
});

var jsonMenu=require('simulateData/menu.json');

var Vue=require('vue');
var vcomMenu=require('vue/components/menu.vue');

new Vue({
	el:'body',
	data:{
		menulist:jsonMenu
	},
	components:{
		'menu-box':vcomMenu
	}
})

$('.create').on('click',function(){
	var spin1=spinZ($('.show').children('.content'));
	setTimeout(function(){spin1.stop()},3000);
})