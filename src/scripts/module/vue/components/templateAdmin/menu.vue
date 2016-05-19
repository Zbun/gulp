<template>
    <div><i class="ico keyboard"></i></div>
    <div class="item menu-l1" v-for="item of arrayMenu" :class="{on:$index==0}">
        <div class="title js-toggle" :class="{'wealthy':item.list.length>0}">
            <p class="inner">{{item.name}}</p>
        </div>
        <ul class="content menu-l2">
            <li class="item js-toggle" v-for="item2 of item.list"><a href="javascript:;">{{item2.name}}</a></li>
            <li class="item add-wrapper">
                <a href="javascript:;" class="font-bigger add" v-on:click="add" title="添加菜单">+</a>
            </li>
        </ul>
    </div>
</template>
<script>
import footerMenu from 'vue/components/footerMenu.vue';
export default {
    props: {
        arrayMenu: Array
    },
    data() {
        return {
            list: [],
            htmlTplMenu2:'<li class="item js-toggle">$text</li>'
        }
    },
    methods: {
        add: function() {
            var $t = $(event.target);
            var $parent = $t.closest('.menu-l2');
            $parent.prev().addClass('wealthy');
            $t.closest('.menu-l2').children().first().before(this.htmlTplMenu2);
            if ($parent.children().length > 5) {
                $t.parent().hide();
            }
        },
        toggle: function() {
            //对添加元素失效，暂时用jQuery全局绑定事件了
            var $t = $(event.target);
            $t.closest('.menu-l1').addClass('on').find('.on').removeClass('on').end().siblings('.item').removeClass('on');
            $t.addClass('on');
        }
    }
}
</script>
