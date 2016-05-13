	  //全选处理，到时合至通用JS文件
module.exports=(function($){

	if(!$){
		console.warn('需要jQuery赞助哦');
		return;
	}

    $('.chks').on('change', '.chk-all', function() {
        $(this).closest('.chks').find('.chk').prop('checked', this.checked);
    }).on('change', '.chk:not(.chk-all)', function() {
        var $data_Container = $(this).closest('.chks');
        if (!this.checked) {
            $data_Container.find('.chk-all').prop('checked', false);
            return;
        }
        var length_checkbox = $data_Container.find('.chk:not(".chk-all")').length,
            length_checked = $data_Container.find(':checked').length;
        if (length_checkbox == length_checked) {
            $data_Container.find('.chk-all').prop('checked', true);
        }
    });
})(jQuery);