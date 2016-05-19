/**
 * 模板编辑菜单相关功能，使用webpack、Vue打包文件，修改需要配环境
 * 复制package.json，gulpfile.js 文件，先运行 npm install，完成后运行 gulp
 * @author Zhao Liubin
 */
require('tabSwitcher.js');

//前进后退下步，不刷页面
// function showByHash() {
//     var hash = location.hash.split('#')[1];
//     var $currentContent = $('.step').children('[data-step=' + hash + ']');
//     if ($currentContent.length) {
//         $currentContent.addClass('am-ease-show on').siblings('.item').removeClass('on am-ease-show');
//     } else {
//         $('.step').children('.item').first().addClass('am-ease-show on');
//     }
//     var title = $currentContent.data('stepTitle');
//     if (title) {
//         document.title = title;
//     }
// }
// showByHash();
// window.addEventListener('hashchange', showByHash);

//滑动删除元素方法
var slideDel = require('slideDelete');

var jsonMenu = require('simulateData/menu.json');

var Vue = require('vue');
var vcomMenu = require('vue/components/templateAdmin/menu.vue');
var vm = new Vue({
    el: 'body',
    data: {
        menulist: jsonMenu
    },
    components: {
        'menu-box': vcomMenu
    },
    ready: function() {
        //只拖动，不读数
        $('.menu-l2').dragsort({
            itemSelector: 'li:not(.add-wrapper)',
            dragSelector: 'li',
            dragBetween: true,
            placeHolderTemplate: "<li></li>"
        });
        $('.footer.menu').on('click', '.js-toggle', function() {
            var $t = $(this);
            $t.closest('.menu-l1').addClass('on').find('.on').removeClass('on').end().siblings('.item').removeClass('on');
            $t.addClass('on');
        });
    },
    methods: {
        delMenu: function() {
            var $menu1 = $('.footer.menu').find('.menu-l1.on');
            var $on = $menu1.find('.on');
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
                };
                !$parent.find('.js-toggle').length && $menu1.find('.wealthy').removeClass('wealthy');
            });
        }
    }
})
