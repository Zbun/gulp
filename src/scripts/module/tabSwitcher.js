
// var $=require('jquery');

module.exports=function(){
	$('.tab-switcher-horizontal').children('.title').children('.item').on('click', function() {
        var $this = $(this),
            index = $this.index();
        $this.addClass('on').siblings('.item').removeClass('on').closest('.tab-switcher-horizontal').children('.content').children('.item').eq(index).addClass('on').siblings('.item').removeClass('on')
    });
}