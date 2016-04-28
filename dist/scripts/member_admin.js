/**
 * Created by Administrator on 2016/4/22.
 */
API={
    tag:{
        get: '/member/memberGroup/getGroups.html'
    }
}

//var TagsList=Vue.extend({
//    template:'<span class="item btn-tag btn-tag-info" v-for="item in tags.list" :data-id="item.id" :data-name="item.name">{{item.name}} </span>'
//});
//Vue.component('tags-list',TagsList);

var vm = new Vue({
    el: 'body',
    data: {
        tags: {
            list:[],
            selected: []
        },
    },
    methods: {
        clearSelected:function(){
            this.tags.selected=[];
        }
    },
    computed: {
        tagsSelectedIdList:function(){
            var arr=[];
            for(var i=0;i<this.tags.selected.length;i++){
                arr.push(this.tags.selected[i].id);
            }
            return arr;
        }
    }
})


//标签选择相关
//弹窗
var htmlTagsList='';
var $htmlTagsSelected=$('.user-tag-list-selected');//存储选中标签HTML结构

$('[data-dialog-content]').on('click', function () {
    var $t = $(this), dialog_content = $t.data('dialogContent'),
        dialog_title = $t.data('dialogTitle');
    var d = dialog({
        title: dialog_title,
        ok: function () {
            vm.tags.selected = $(d.node).find('.user-tag-list').find('.on').map(function(){
                return {id:$(this).data('id'),name:$(this).data('name')}
            }).get();

        },
        button: [
            {
                value: '清空',
                callback: function () {
                    $(d.node).find('.user-tag-list').find('.on').click();
                    return false;
                }
            }
        ],
    }).showModal();

    if(vm.tags.list.length>0){
        if(vm.tags.selected.length>0){
            d.content($htmlTagsSelected.html());
            return;
        }
        d.content(htmlTagsList);
        return;
    }
    $.getJSON(API.tag.get,{},function(data){
        vm.tags.list=data.data;
        if(data.data.length<=0){
            d.content('暂无标签可选');
            return;
        }
        var getRealContent = function (){
            htmlTagsList=$('.popup-html').find('.'+dialog_content).children('.content').html();
            d.content(htmlTagsList);
        }
        setTimeout(getRealContent);
    });

});

//通用标签联动内容切换
$('.tab-switcher-horizontal').children('.title').children('.item').on('click', function() {
    var $this = $(this),
        index = $this.index();
    $this.addClass('on').siblings('.item').removeClass('on').closest('.tab-switcher-horizontal').children('.content').children('.item').eq(index).addClass('on').siblings('.item').removeClass('on')
});

//通用选择标签,及删除标签操作
$('body').on('click', '.js-toggle-class>.title>.item', function () {
    $(this).toggleClass('on').closest('.js-toggle-class').children('.content').children('.item').toggleClass('on');
}).on('click','.tags-action-member>.tag .icon',function(){
    $htmlTagsSelected.find('[data-id='+$(this).closest('.tag').data('id')+']').removeClass('on');

    vm.tags.selected =$(this).closest('.tag').siblings('.tag').map(function(){
        return  {id:$(this).data('id'),name:$(this).data('name')}
    }).get();
});

//处理选中标签继续选择带回啊
$('body').on('click','.user-tag-list .btn-tag',function(){
    $htmlTagsSelected.html($(this).closest('.ui-dialog-content').html())
})


//通用全选处理，个别情况单独处理
$('.chks').on('change', '.chk-all', function () {
    $(this).closest('.chks').find('.chk').prop('checked', this.checked);
}).on('change', '.chk:not(.chk-all)', function () {
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

function alertMsg(content,okVal){
    var okVal=okVal||'好的';
    dialog({
        title:'提示',
        skin:'mini',
        content:content,
        okValue:okVal,
        ok:function(){},
    }).showModal();
}

//一些验证方法
;
Gvalidator = {
    _reg: {
        empty: /^\s*$/,
        phone: /^1\d{10}$/,
        email: /^\w+[\w-+.]*@[\w-]+(\.[\w-])+$/,
        moneyFormat: /^\d+(\.\d{1,2})?$/,
        integer: /^\d+$/,
        illegal: /[<>]/,
        percent: /^0$|^[1-9]\d?$|^100$/
    },
    _check: function(pattern) {
        return function(arg) {
            return pattern.test(arg);
        }
    },
    isEmpty: function(arg) {
        var l = arguments.length;
        for (i = 0; i < l; i++) {
            if (this._check(this._reg.empty)(arguments[i]))
                return true;
        }
        return false;
    },
    isNotPhone: function(arg) {
        return !this._check(this._reg.phone)(arg);
    },
    isNotEmail: function(arg) {
        return !this._check(this._reg.email)(arg);
    },
    isNotMoneyFormat: function(arg) {
        return !this._check(this._reg.moneyFormat)(arg);
    },
    isNotInteger: function(arg) {
        return !this._check(this._reg.integer)(arg);
    },
    isIllegal: function(arg) {
        return this._check(this._reg.illegal)(arg);
    },
    isNotPercent: function(arg) {
        var l = arguments.length;
        for (i = 0; i < l; i++) {
            if (!this._check(this._reg.percent)(arguments[i]))
                return true;
        }
        return false;
    }
};

//加载等待提示，pcWaiting.show()、waiting.remove(),电脑端等待，没有提示文字,arg=global：局部小等待
PCwaiting = {
    _getDiv: function (arg) {
        var w = document.querySelector('.PCwaiting');

        if (!w) {
            var div = document.createElement('div');
            div.className = 'PCwaiting '+(arg=='global'?'':'local');
            w = div;
            var style = document.createElement('style');
            style.innerHTML = ".PCwaiting{position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.5);z-index:8888}.PCwaiting.local{left:50%;top:36%;width:50px;height:48px;margin-left:-25px;border-radius:3px;}.PCwaiting:after {content: ''; position: absolute; top: 50%; left: 50%; width: 3px; height: 3px; margin-top: -2px; margin-left: -2px; text-align: center; -webkit-border-radius: 100%; border-radius: 100%; box-shadow:0 0 3px; -webkit-transition: all, 0.3s, linear; transition: all, 0.3s, linear; -webkit-animation: am-wait 1.2s linear infinite; animation: am-wait 1.2s linear infinite;box-shadow:0 -10px 0 1px #eee, 10px 0px #eee, 0 10px #eee, -10px 0 #eee, -7px -7px 0 0.5px #eee, 7px -7px 0 0.5px #eee, 7px 7px #eee, -7px 7px #eee }@-webkit-keyframes am-wait {100% {-webkit-transform: rotate(1turn);transform: rotate(1turn);}}@keyframes am-wait {100% {-webkit-transform: rotate(1turn);transform: rotate(1turn);}";
            w.appendChild(style);
            document.body.appendChild(w);
        }
        return w;
    },
    show: function (arg) {
        this._getDiv(arg).style.display = 'block';
    },
    hide: function () {
        this._getDiv().style.display = 'none';
    },
    remove: function () {
        document.body.removeChild(this._getDiv());
    }
};
