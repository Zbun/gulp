<template>
  <div class="content" :class="{on:status==1}">
    <div class="js-hover-fadein">
      <div class="title">
        <a :href="item.url" @mouseenter="fadeIn(index)" @mouseleave="loop" class="item" :data-index='index' :class="{on:index==cur}" v-for="(index,item) of list" v-cloak>
          <div class="inner">
            <i class="icon" :class="item.icon"></i>
            <p>
              {{item.title}}
            </p>
          </div>
        </a>
      </div>
      <div class="content">
        <a v-for="(index,item) of list" :href="item.url" class="item" @mouseenter="loopEnd" @mouseleave="loop" :data-index='index' :class="{on:index==cur}" :title="item.title" v-cloak><img :src="item.image" alt=""></a>
      </div>
    </div>
  </div>
</template>
<script>
var yCase = require('src/config.js').case;
export default {
  props: ['status'],
  data() {
    return {
      list: [],
      cur: 0,
      isLooping: 0
    }
  },
  computed: {},
  methods: {
    fadeIn: function(i) {
      this.loopEnd();
      this.cur = i;
    },
    loop: function() {
      var vm = this;
      vm.isLooping = setInterval(function() {
        if (vm.cur == 2) {
          vm.cur = 0;
        } else {
          vm.cur++;
        }
      }, 5e3);
    },
    loopEnd: function() {
      clearInterval(this.isLooping);
    }
  },
  ready: function() {
    var vm = this;
    this.loop();
    //数据
    $.get(yCase.API.get, function(data) {
      vm.list = data.data;
    }, 'JSON');
  }
};
</script>
