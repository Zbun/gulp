/**
 * 模板编辑菜单相关功能，使用webpack、Vue打包文件，修改时需要配环境
 * 复制package.json，gulpfile.js 文件，先运行 npm install，完成后运行 gulp
 * 上线时，需要 gulp build 或npm run build构建一下
 * @author Zhao Liubin
 */

require('tabSwitcher');
import slideDel from 'slideDelete';
import showTips from 'showTipsState';
import waiting from 'waiting';

var showTipsWarning = function(content, callback) {
    showTips(content, 'error', callback);
}

// var jsonMenu = require('simulateData/menu.json');
// var jsonActivity = require('simulateData/activity.json');

var Vue = require('vue');
var vcomMenu = require('vue/components/templateAdmin/menu.vue');

var API = {
    menu: {
        get: '/templatemenu/list.html',
        set: '/templatemenu/saveOrUpdate.html',
        del: '',
    },
    activity: {
        get: '/module/common/modelAppList.html'
    }
}

var leaveTips = {
    add() {
        window.onbeforeunload = null;
        window.onbeforeunload = function() {
            return '------------------------------------------------------\n您辛辛苦苦编辑的菜单还没有保存哦，确认操作吗？\n' +
                '------------------------------------------------------'
        }
    },
    cancel() {
        window.onbeforeunload = null;
    }
}

var bID = $('#businessId').val(),
    tID = $('#templateId').val();

var vm = new Vue({
    el: 'body',
    data: {
        menuList: [],
        menu1Length: 4,
        jsonActivity: [],
        activity: {
            data: [],
            index: 0,
            isAPP: false, //控制选择APP是否显示
            modelText: '',
            appName: ''
        },
        menuSet: {
            name: '',
            siteURL: '',
            type: {
                message: 'MESSAGE',
                own: 'OWN',
                app: 'APP'
            },
            curType: ''
        },
        currentType: 'MESSAGE',
        htmlTplMenu1: '<div class="item menu-l1 on"><div class="title js-toggle" data-name="添加菜单" data-menu-type="MESSAGE" title="添加菜单"><p class="inner">添加菜单</p></div><ul class="content menu-l2"><li class="item add-wrapper"><a href="javascript:;" class="font-bigger add" title="添加菜单" data-menu-type="$type">+</a></li></ul></div>',
        htmlTplMenu2: '<li class="item js-toggle" data-name="菜单名称" data-menu-type="$type"><span class="inner">菜单名称</span></li>',
        hasSubMenu: true,
    },
    computed: {
        activityContent: function() {
            return this.activity.data.length ? this.activity.data[this.activity.index].list : '';
        },
    },
    components: {
        'menu-box': vcomMenu
    },
    ready: function() {
        var vmAgent = this;
        //只拖动，不读数
        var drag = function() {
            $('.menu-l2').dragsort('destroy');
            $('.menu-l2').dragsort({
                itemSelector: 'li:not(.add-wrapper)',
                dragSelector: 'li',
                dragBetween: true,
                dragEnd:leaveTips.add,
                placeHolderTemplate: "<li></li>"
            });
        }
        drag();

        var initActivity = function() {
            vm.activity.data = [];
            Vue.nextTick(function() {
                vm.activity.data = vm.jsonActivity;
                vm.activity.index = 0;
            })
        }

        var s1 = spinZ('.footer.menu');
        //拿菜单数据
        $.ajax({
            type: 'POST',
            url: API.menu.get,
            data: { businessId: bID, templateId: tID },
            dataType: 'JSON',
            success: function(data) {
                s1.stop();
                vmAgent.menuList = data;
                vmAgent.menu1Length = data.data.length;
                vmAgent.hasSubMenu = data.data[0].subMenuList.length > 0 ? true : false;
                setTimeout(function() {
                    drag();
                    $('.footer.menu').find('.js-toggle:first').mouseup()
                }, 0);
            },
            error: function(data) {
                console.warn(data);
            }
        })

        //拿活动数据
        $.post(API.activity.get, { templateId: tID }, function(data) {
            vm.jsonActivity = vmAgent.activity.data = data.data;
        })

        //菜单点击时切换事件
        $('.footer.menu').on('mouseup', '.js-toggle', function() {
            var $t = $(this),
                type = $t.data('menuType');
            var name = $t.data('name');
            vmAgent.menuSet.name = name;
            $t.closest('.menu-l1').addClass('on').find('.on').removeClass('on').end().siblings('.item').removeClass('on');
            $t.addClass('on');

            //点击时，是否显示右边菜单内容功能
            if ($t.hasClass('wealthy')) {
                vmAgent.hasSubMenu = true;
                return;
            } else {
                vmAgent.hasSubMenu = false;
                $('.content-type').find('[data-type=' + type + ']').click();
            }

            if ('OWN' === type) {
                vmAgent.menuSet.siteURL = $t.data('menuContent');
            }
        });

        //添加一、二级菜单
        $('.footer.menu').on('click', '.add-menu1 .add', function() {
            var $t = $(this),
                type = $t.data('menuType');
            $t.closest('.menu-l1').before(vmAgent.htmlTplMenu1.replace('$type', type));
            var $arrayMenu1 = $('.footer.menu').children('.item:not(.add-menu1)');
            vmAgent.menu1Length = $arrayMenu1.length;
            drag();
            $arrayMenu1.last().children('.js-toggle').mouseup();
            leaveTips.add();
        }).on('click', '.content .add', function() {
            var $t = $(this),
                type = $t.closest('.menu-l1').children('.title').data('menuType');
            var $parent = $t.closest('.menu-l2');
            $parent.prev().addClass('wealthy');
            var $on = $t.closest('.menu-l2').find('.add-wrapper').before(vmAgent.htmlTplMenu2.replace('$type', type)).prev().mouseup();
            if ('APP' === type) {
                initActivity();
                Vue.nextTick(function() {
                    var data0 = vm.activity.data[0];
                    $on.data({
                        'modelText': data0['modelText'],
                        'modelType': data0['modelType'],
                        'appName': data0.list[0]['appName'],
                        'appPicUrl': data0.list[0]['appPicUrl'],
                        'appDemoUrl': data0.list[0]['appDemoUrl'],
                        'appType': data0.list[0]['appType'],
                        'appTypeName': data0.list[0]['appTypeName']
                    })
                    vm.activity.modelText = $on.data('modelText');
                    vm.activity.appName = $on.data('appName');
                })
            }

            if ($parent.children().length > 5) {
                $t.parent().hide();
            }
            leaveTips.add();
        });

        //切换内容类型时，菜单类型选项写入
        $('.content-type').on('click', '[data-type]', function() {
            var $t = $(this);
            var $on = $('.footer.menu').find('.on .on');
            var currentType = $on.data('menuType');
            var menuType = $t.data('type');
            vm.menuSet.curType = menuType;
            if (menuType === 'APP') {
                initActivity();
                vm.activity.isAPP = true;
                vm.activity.modelText = $on.data('modelText');
                vm.activity.appName = $on.data('appName');
                if ('APP' !== currentType) {
                    Vue.nextTick(function() {
                        var data0 = vm.activity.data[0];
                        if (!$on.data('modelText')) {
                            $on.data({
                                'modelText': data0['modelText'],
                                'modelType': data0['modelType'],
                                'appName': data0.list[0]['appName'],
                                'appPicUrl': data0.list[0]['appPicUrl'],
                                'appDemoUrl': data0.list[0]['appDemoUrl'],
                                'appType': data0.list[0]['appType'],
                                'appTypeName': data0.list[0]['appTypeName']
                            });
                        }
                        vm.activity.modelText = $on.data('modelText');
                        vm.activity.appName = $on.data('appName');
                    })
                }
            } else {
                vm.activity.isAPP = false;
            }

            if ('OWN' === currentType) {
                $('.menu-site').focus();
            }
            $on.data('menuType', menuType);
            vmAgent.menuSet.siteURL = $on.data('menuContent');
        })
    },
    methods: {
        //删除菜单
        delMenu() {
            var $menu1 = $('.footer.menu').find('.menu-l1.on');
            var $on = $menu1.find('.on');
            var $prev = $on.prev('.js-toggle'),
                $next = $on.next('.js-toggle');
            var $parent = $on.parent();
            if ($parent.hasClass('menu-l1') && vm.menu1Length < 2) {
                showTipsWarning('需要保留至少一菜单哦');
                return;
            }
            dialog({
                skin: 'mini',
                content: '确认删除菜单么？<br><span class=text-muted>（删除后，需要点击保存，才能生效哦）</span>',
                ok: function() {
                    //真正删除及回调 
                    slideDel($on, function() {
                        !$parent.find('.js-toggle').length && $menu1.find('.wealthy').removeClass('wealthy');
                        if ($parent.hasClass('menu-l2')) {
                            if ($prev.length) {
                                $prev.mouseup();
                            } else if ($next.length) {
                                $next.mouseup();
                            } else {
                                $parent.prev().mouseup();
                            }
                            $parent.find('.add-wrapper').show();
                        } else {
                            var $pprev = $parent.prev('.item');
                            if ($pprev.length) {
                                $pprev.children('.js-toggle').mouseup();
                            } else {
                                $parent.next().children('.js-toggle').mouseup();
                            }
                            $parent.remove();
                            vm.menu1Length = $('.footer.menu').children('.item:not(.add-menu1)').length;
                        }
                        leaveTips.add();
                    })
                },
                cancel: function() {}
            }).showModal();
        },
        //保存功能
        save(event) {
            var $t = $(event.target);
            //未知，原生写法有缓存，使用jQuery式写法
            var arrMenu1 = [];
            var menu1 = $('.footer.menu').children('.item:not(.add-menu1)').get();
            menu1.forEach(function(element, index) {
                arrMenu1[index] = {};
                var arrMenu2 = [];
                var $element = $(element),
                    $title = $element.children('.title').data('orderId', index + 1);
                $element.children('.content').children('.js-toggle').get().forEach(function(el, index1) {
                    arrMenu2[index1] = {};
                    $(el).data('orderId', index1 + 1);
                    Object.keys($(el).data()).forEach(function(ele, index2) {
                        arrMenu2[index1][ele] = $(el).data(ele);
                    });
                });
                Object.keys($title.data()).forEach(function(el) {
                    arrMenu1[index][el] = $title.data(el);
                });
                arrMenu1[index]['subMenuList'] = arrMenu2;
            });

            if (/^\s*$/.test(vm.menuSet.name)) {
                $('.menu-name').addClass('error').focus();
                return;
            }

            //是自定义网址时校验不为空
            if (vm.menuSet.curType === 'OWN') {
                if (!vm.menuSet.siteURL || /^\s*$/.test(vm.menuSet.siteURL)) {
                    $('.menu-site').addClass('error').focus();
                    return;
                }
            }

            $t.addClass('disabled');
            waiting.show();
            $.ajax({
                type: 'POST',
                url: API.menu.set,
                contentType: 'Application/JSON',
                data: JSON.stringify({
                    businessId: bID,
                    templateId: tID,
                    menulist: arrMenu1
                }),
                success: function(data) {
                    if (data.success) {
                        showTips(data.message, function() {
                            location = data.data;
                        });
                    } else {
                        showTipsWarning('保存失败，请稍候重试');
                    }
                },
                error: function(data) {
                    showTipsWarning('保存失败，请稍候重试');
                },
                complete: function() {
                    waiting.hide();
                    $t.removeClass('disabled');
                    leaveTips.cancel();
                }
            })
        },
        iptName(event) {
            var name = this.menuSet.name;
            $(event.target).removeClass('error');
            $('.footer.menu').find('.on').find('.on').data('name', name || '菜单名称').find('.inner').text(name || '菜单名称');
            leaveTips.add();
        },
        iptSite(event) {
            $(event.target).removeClass('error');
            $('.footer.menu').find('.on').find('.on').data('menuContent', event.target.value || 'http://www.eqying.com');
            leaveTips.add();
        },
        activityChange(event) {
            var i = event.target.selectedIndex,
                $on = $('.footer.menu').find('.on').find('.on');
            this.activity.index = i;
            var objData = event.target[i].dataset;
            Object.keys(objData).forEach(function(el, index) {
                $on.data(el, objData[el]);
            });
            vm.activity.isAPP = true;
            vm.activity.modelText = objData['modelText'];
            var dataNow = vm.activity.data[i];
            vm.activity.appName = dataNow.list[0] ? dataNow.list[0]['appName'] : '';
            $on.data({
                'appName': dataNow.list[0]['appName'],
                'appPicUrl': dataNow.list[0]['appPicUrl'],
                'appDemoUrl': dataNow.list[0]['appDemoUrl'],
                'appType': dataNow.list[0]['appType'],
                'appTypeName': dataNow.list[0]['appTypeName']
            });
            leaveTips.add();
        },
        activityContentChange(event) {
            var $on = $('.footer.menu').find('.on').find('.on'),
                nodeActivity = $('#activity')[0],
                objActivity = nodeActivity[nodeActivity.selectedIndex].dataset;

            $on.data({
                modelText: objActivity.modelText,
                modelType: objActivity.modelType
            });
            vm.activity.modelText = objActivity['modelText'];

            var objData = event.target[event.target.selectedIndex].dataset;
            Object.keys(objData).forEach(function(el, index) {
                $on.data(el, objData[el]);
            });
            vm.activity.appName = objData['appName'];
            leaveTips.add();
        }
    }
})
