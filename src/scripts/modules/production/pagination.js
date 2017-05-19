import 'libs/jquery.twbsPagination.js';


/**
 * 分页的方法
 * @date   2016-09-05
 * @author zhao.liubin@zol.com.cn
 * @param  {}vue组件实例
 * @param  {number}总页数
 * @param  {number}总行数
 * @param  {Function}回调方法
 * @param  {number}页面
 * @return {[type]}
 */

module.exports = (vm, totalPages, totalRows, callback, startPage) => {

  if (vm && vm.nodeType !== 1) {
    console.warn(`VUE组件页面结构可能不正确，请检查一下哦，如下：
      %c<template>%c<div>%c真实所有内容%c</div>%c</template>`, 'color:green', 'color:red', 'color:yellow', 'color:red', 'color:green');
    return;
  }

  let $pagerBox = $(vm).find('.pageBox');
  if (!startPage) {
    console.warn('必须传入页码(pageIndex)这个参数，请检查');
    return;
  }
  let StartPage = parseInt(startPage) || 1;
  if (StartPage > totalPages && totalPages > 0) {
    console.warn('定位页数(pageIndex)需要小于总页数(totalPages)啊~~');
    StartPage = 1;
  }
  if ($pagerBox.length) {
    if (totalRows > 0) {
      $pagerBox.show();
      $pagerBox.twbsPagination({
        first: '<',
        last: '>',
        startPage: StartPage,
        totalPages: totalPages,
        visiblePages: 5,
        initiateStartPageClick: false,
        goVal: false,
        onPageClick(event, page) {
          if (typeof callback === 'function') {
            $(vm).find('.chks').find(':checkbox').prop('checked', false);
            callback(page);
          }
        }
      });
      // $pagerBox.data('totalPages', totalPages);
    } else {
      $pagerBox.hide();
    }

  } else {
    console.warn('没有分页容器哦，需要一个.pageBox框');
  }

};
