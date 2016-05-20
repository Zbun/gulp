/**
 * 模板编辑菜单相关功能，使用webpack、Vue打包文件，修改时需要配环境
 * 复制package.json，gulpfile.js 文件，先运行 npm install，完成后运行 gulp
 * 上线时，需要 gulp build 或npm run build构建一下
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

var showTips = require('showTipsState');

var showTipsWarning = function(content) {
    showTips(content, 'error');
}

var jsonMenu = require('simulateData/menu.json');

var Vue = require('vue');
var vcomMenu = require('vue/components/templateAdmin/menu.vue');
var vm = new Vue({
    el: 'body',
    data: {
        menulist: jsonMenu,
        menu1Length: jsonMenu.data.length,
        menuSet: {
            name: '',
            type: {
                message: 'MESSAGE',
                own: 'OWN',
                app: 'APP'
            }
        },
        htmlTplMenu1: '<div class="item menu-l1 on"><div class="title js-toggle" data-name="添加菜单" title="添加菜单"><p class="inner">添加菜单</p></div><ul class="content menu-l2"><li class="item add-wrapper"><a href="javascript:;" class="font-bigger add" title="添加菜单">+</a></li></ul></div>',
        htmlTplMenu2: '<li class="item js-toggle" data-name="菜单名称"><span class="inner">菜单名称</span></li>',
    },
    computed: {
        // menu1Length: function() {
        //     return this.menulist.data.length;
        // }
    },
    components: {
        'menu-box': vcomMenu
    },
    ready: function() {
        var context = this;
        //只拖动，不读数
        function drag() {
            $('.menu-l2').dragsort('destroy');
            $('.menu-l2').dragsort({
                itemSelector: 'li:not(.add-wrapper)',
                dragSelector: 'li',
                dragBetween: true,
                placeHolderTemplate: "<li></li>"
            });
        }
        drag();

        //菜单点击切换事件
        $('.footer.menu').on('click', '.js-toggle', function() {
            var $t = $(this);
            var name = $t.data('name');
            context.menuSet.name = name;
            $t.closest('.menu-l1').addClass('on').find('.on').removeClass('on').end().siblings('.item').removeClass('on');
            $t.addClass('on');
        }).find('.js-toggle:first').click();

        //添加一、二级菜单
        $('.footer.menu').on('click', '.add-menu1 .add', function() {
            $(this).closest('.menu-l1').before(vm.htmlTplMenu1);
            var $arrayMenu1 = $('.footer.menu').children('.item:not(.add-menu1)');
            vm.menu1Length = $arrayMenu1.length;
            drag();
            $arrayMenu1.last().children('.js-toggle').click();
        }).on('click', '.content .add', function() {
            var $t = $(this);
            var $parent = $t.closest('.menu-l2');
            $parent.prev().addClass('wealthy');
            $t.closest('.menu-l2').children().first().before(vm.htmlTplMenu2);
            if ($parent.children().length > 5) {
                $t.parent().hide();
            }
        })
    },
    methods: {
        //删除菜单选项
        delMenu() {
            var $menu1 = $('.footer.menu').find('.menu-l1.on');
            var $on = $menu1.find('.on');
            var $prev = $on.prev('.js-toggle'),
                $next = $on.next('.js-toggle');
            var $parent = $on.parent();
            if (vm.menu1Length < 2) {
                showTipsWarning('最后一个菜单不能删除哦');
                return;
            }
            slideDel($on, function() {
                if ($parent.hasClass('menu-l2')) {
                    if ($prev.length) {
                        $prev.click();
                    } else if ($next.length) {
                        $next.click();
                    }
                    $parent.find('.add-wrapper').show();
                } else {
                    var $pprev = $parent.prev('.item');
                    if ($pprev.length) {
                        $pprev.children('.js-toggle').click();
                    }
                    else{
                        $parent.next().children('.js-toggle').click();
                    }
                    $parent.remove();
                    vm.menu1Length = $('.footer.menu').children('.item:not(.add-menu1)').length;
                }
                !$parent.find('.js-toggle').length && $menu1.find('.wealthy').removeClass('wealthy');
            });
        },
        save() {
            alert(this.menuSet.name.getUTFLength());
        },
        iptName() {
            $('.footer.menu').find('.on').find('.on').find('.inner').text(this.menuSet.name || '菜单名称');
        },
        iptSite() {

        }
    }
})
