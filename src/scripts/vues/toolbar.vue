<template>
  <section class="item tools" :class="{on:editMode, 'show-tips':showTips}">
    <div class="inner">
      <div class="cell">
        <h3 class="content-title">
          <button class="btn set" @click="toggle"><i class="yqy-shezhi"></i></button>
          <button class="btn btn-primary fr ok" :class="{'btn-disabled': !selected.length}" @click="done" :disabled="!selected.length">确认</button>
          常用工具
        </h3>
        <hr class="m0">
        <div class="content">
          <div class="list" v-show="selected.length">
            <a class="item" :href="item | forward" :target="item.blank?'_blank':null" v-for="item in selected">
              <i class="icon" :class="[item.icon]"></i>
              <p class="name">{{item.name}}</p>
              <div class="pointer-blocker" v-show="editMode" @click.stop.prevent="update(item, false)"></div>
            </a>
          </div>
          <div class="empty" v-show="!selected.length && editMode" v-cloak>
            <i class="yqy-wenxintishi"></i>
            <div>请添加常用工具</div>
          </div>
        </div>
        <div class="content other">
          <h3 class="content-title">其他工具</h3>
          <hr class="m0">
          <div class="list" :class="{full:isFull}">
            <a class="item" v-for="item in unselected">
              <i class="icon" :class="[item.icon]"></i>
              <p class="name">{{item.name}}</p>
              <div class="pointer-blocker" v-show="editMode && !isFull" @click="update(item, true)"></div>
            </a>
          </div>
        </div>
      </div>
      <div class="tips" v-if="showTips">
        <p>请在这里快速查看或使用工具</p>
        <button class="btn" @click="setTipStatus">完成</button>
      </div>
    </div>
  </section>
</template>
<script>
import { toolbar } from 'src/service.js';
import * as config from 'src/config.js';
export default {
  props: ['sessionId'],
  data() {
    return {
      items: [],
      editMode: false,
      showTips: false,
      forwardUrl: ''
    };
  },
  computed: {
    selected () {
      return this.items.filter((item) => { return item.status === config.toolbar.consts.TOOLBAR_SELECTED });
    },
    unselected () {
      return this.items.filter((item) => { return item.status === config.toolbar.consts.TOOLBAR_UNSELECTED});
    },
    isFull () {
      return this.selected.length >= 10;
    },
    tipsKey () {
      return 'toolbar_tips_show_flag_' + this.sessionId;
    }
  },
  methods: {
    getData() {
      toolbar
        .getList(config.toolbar.consts.TOOLBAR_SELECTED)
        .then((res) => {
          if(!res.success) return;
          this.items = res.data;
          this.forwardUrl = res.forwardUrl;
        }, (res) => {
          this.items = [];
        });
    },
    update(item, add) {
      item.status = add ? config.toolbar.consts.TOOLBAR_SELECTED : config.toolbar.consts.TOOLBAR_UNSELECTED;
      if(add){
        var index = this.items.indexOf(this.selected[this.selected.length - 1]);
        this.items.$remove(item);
        this.items.splice(index, 0, item)
      }
    },
    done() {
      var result;
      result = this.selected
        .map((item) => item.id);
      toolbar
        .setList(result)
        .then((res) => {
          res = res.json();
          if (!res.success) return;
          this.editMode = false;
        });
      this.editMode = false;
    },
    toggle() {
      this.showTips && this.setTipStatus();
      this.editMode = true;
    },
    setTipStatus() {
      localStorage.setItem(this.tipsKey, false);
      this.showTips = false;
    }
  },
  filters: {
    forward(item) {
      return this.forwardUrl + item.id;
    }
  },
  ready() {
    this.checkTipStatus = function() {
      var flag = localStorage.getItem(this.tipsKey);
      flag = flag?flag:'true';
      this.showTips = flag === 'true';
    }
    this.getData();
    this.checkTipStatus();
  }
};
</script>
