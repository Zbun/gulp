<template>
    <div class="title js-toggle" @click="toggle" :class="{'wealthy':list.list.length>0}">
        <p class="inner">{{list.name}}</p>
    </div>
    <ul class="content menu-l2">
        <li class="item js-toggle" @click="toggle" v-for="item2 of list.list">
            <a href="javascript:;">{{item2.name}}</a>
        </li>
    </ul>
</template>
<script>
export default {
    props: ['objMenu'],
    data() {
        return {
            list: this.objMenu
        }
    },
    methods: {
        toggle: function() {
            var $t = $(event.target);
            $t.closest('.menu-l1').toggleClass('expanded').siblings('.item').removeClass('expanded');
            $t.addClass('on').siblings('.item').removeClass('on');
            if (!$t.hasClass('wealthy')) {
                $t.closest('.menu-l1').addClass('on').siblings('.item').removeClass('on');
            }
        }
    }
}
</script>
