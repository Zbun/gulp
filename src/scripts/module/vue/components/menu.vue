

<template>

<div class="show title phone">
    <h3 class="title text-ellipsis">
                                易企赢
                            </h3>
    <div class="content">
        <img class="show-img" alt=""> 俺是内容 俺 是内容
        <p style='height: 200px'>
            俺蛤内空
        </p>
        <p style='height: 200px'>
            俺蛤内空
        </p>
        <p style='height: 200px'>
            俺蛤内空
        </p>
        <p>
            我是最后一行字
        </p>
    </div>
    <footer class="footer menu dis-flex abs">
        <i class="ico keyboard"></i>
        <div class="item menu-l1" v-for="item of arrayMenu">
        	<footer-menu :obj-menu="item"></footer-menu>
        </div>
    </footer>
</div>
<div class="text-center select">
    <button class="btn btn-primary big">就选这个</button>
    <span class="pl10 text-muted">
                        		点击菜单预览效果
                        	</span>
</div>

</template>

<script>

import footerMenu from 'vue/components/footerMenu.vue';
export default {
    props: {arrayMenu:Array},
    data() {
        return {
            list: []
        }
    },
    components: {
        'footer-menu':footerMenu
    }
}

</script>
