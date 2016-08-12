<template>
  <article class="item spread">
    <h3 class="content-title">
                    没有推广渠道？试试他们吧！
                </h3>
    <div class="content">
      <div class="tab-switcher-horizontal js-switcher">
        <a :href="checkMore" class="btn btn-primary fr">更多</a>
        <div class="title">
          <a href="javascript:;" class="item" :class="{on:index==0}" v-for="(index,item) of list" v-cloak>
                               {{item.name}}
                            </a>
        </div>
        <div class="content">
          <ul class="list item" :class="{on:index==0}" v-for="(index,item) of list">
            <li class="item" v-for="itemIn of item.list">
              <a :href="itemIn.url" class="inner" :data-id="itemIn.id">
                <div class="img-wrapper">
                  <img :src="itemIn.image" alt="{{itemIn.name}}">
                </div>
                <div class="info">
                  <h4 class="name" :title="itemIn.name">{{itemIn.name}}</h4>
                  <p class="count">粉丝数据：<span class="num">{{itemIn.mark}}</span></p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
</template>
<script>
var sp = require('src/config.js').spread;
export default {
  props: ['checkMore'],
  data() {
    return {
      list: []
    }
  },
  ready: function() {
    var vm = this;
    $.get(sp.API.get, function(data) {
      vm.list = data.data;
    }, 'JSON')
  }
}
</script>
