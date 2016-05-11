// var waiting=require('waiting.js');
// var $=require('jQuery');
// waiting.show();


var dialog=require('dialog');

var  waiting = require('waiting');

// var  validator = require('validator');


var popup=require('popupMobile');

require('tabSwitcher.js')();


// import al from 'alert.js';
// al(3)


     //小标签选择弹窗
    $('[data-dialog-content]').on('click', function() {
       var $t = $(this), dialog_content = $t.data('dialogContent'),
            dialog_title = $t.data('dialogTitle');
        var d = dialog({
            title: dialog_title,
            onshow: function() {
                //分页，后台来时删除库及本段代码
                $('.user-selected-pagination').twbsPagination({
                    totalPages: 15,
                    visiblePages: 5,
                    prev: '<',
                    next: '>',
                    onPageClick: function(event, page) {
                        $('#page-content').text('Page ' + page);
                    }
                });
            },
            cancel: function() {
                // alert('h')
            },
            cancelDisplay: false
        });
        d.content($('.popup-html').find('.' + dialog_content).html()).showModal();
    });
 
// popup({
// 	title:'提示',
// 	content:'你好啊',
// 	ok:function(){
// 		alert('ok')
// 	}

// })


// var w1= waiting().show();
// setTimeout(function(){
//     w1.hide();
// },5000);

// var w2= waiting($('.wrapper')).show();
// setTimeout(function(){
//     w2.remove();
// },1e4)

var showTipsOnTop=require('showTipsOnTop.js');

showTipsOnTop('操作成功','.wrapper',3333);

var SPIN=require('spinZ.js');

var s1=new SPIN($('.wrapper'));

setTimeout(function(){s1.stop()}, 2000)