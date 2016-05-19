/**
 * 全部选中方法，对应一个顶层的class:chks,
 * 全选class:chks,子checkbox的class:chk
 * @author zhaoliubin@knet.cn
 * @date   2016-05-19
 * @param  {[type]}
 * @return {[type]}
 */
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