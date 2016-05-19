var jsonMenu = require('simulateData/menu.json');

var Vue = require('vue');
var vcomMenu = require('vue/components/menu.vue');

var vm = new Vue({
    el: 'body',
    data: {
        menulist: []
    },
    components: {
        'menu-box': vcomMenu
    }
})

var spin1 = spinZ($('.show-list'));
setTimeout(function() {
    spin1.stop();
    vm.menulist = jsonMenu;
}, 2000)
