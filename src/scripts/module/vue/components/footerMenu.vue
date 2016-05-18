

<template >
    <div class="title js-toggle" :class="{'wealthy':list.list.length>0}">
        <p class="inner">{{list.name}}</p>
    </div>
    <ul class="content menu-l2">
        <li class="item js-toggle" v-for="item2 of list.list"><a href="javascript:;">{{item2.name}}</a>
    </ul>

</template>

<script>

export default {
    props: ['objMenu'],
    data() {
        return {
            list: this.objMenu
        }
    }
}

</script>
