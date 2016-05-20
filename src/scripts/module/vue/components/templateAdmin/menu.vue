<template>
    <div><i class="ico keyboard"></i></div>
    <div class="item menu-l1" v-for="item of menuItem" :class="{on:$index==0}">
        <div class="title js-toggle" :class="{'wealthy':item.subMenuList.length>0}" :data-name="item.name" :title="item.name">
            <p class="inner">{{item.name}}</p>
        </div>
        <ul class="content menu-l2">
            <li class="item js-toggle" v-for="item2 of item.subMenuList" :data-name="item2.name" :title="item2.name"><span class="inner">{{item2.name}}</span></li>
            <li class="item add-wrapper">
                <a href="javascript:;" class="font-bigger add"  title="添加菜单">+</a>
            </li>
        </ul>
    </div>
    <div class="item menu-l1 add-menu1" v-if="menu1Length<4">
        <p class="item add-wrapper">
            <a href="javascript:;" class="font-bigger add">+</a>
        </p>
    </div>
</template>
<script>
import footerMenu from 'vue/components/footerMenu.vue';
export default {
    props: ['menuItem','menu1Length'],
    data() {
        return {
            list: [],
        }
    },
    ready:function(){

    },
    methods: {
    }
}
</script>
