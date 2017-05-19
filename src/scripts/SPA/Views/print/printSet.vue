<template>
  <div class="main">
    <p class="text-center p30" v-if="!IMSUPERMAN">
      <input type="password" class="com-ipt" v-model="IPTSUPER" @keydown='kd_Click($event)'>
    </p>
    <div v-if="IMSUPERMAN">
      <h2 class="content-title">设置打印模板</h2>
      <div class="content-field">
        <div class="tab-switcher">
          <div class="title">
            <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex!=1}">库单</span>
            <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">物流单</span>
          </div>
          <div class="content">
            <div class="item" :class="{on:tabIndex!=1}">
              <lib-temp></lib-temp>
            </div>
            <div class="item" :class="{on:tabIndex==1}">
              <log-temp></log-temp>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import libTemp from './modules/library.vue';
import logTemp from './modules/logistics.vue';
export default {
  data() {
      return {
        IMSUPERMAN: false,
        IPTSUPER: '',
        dataOut: {
          search: {}
        }
      }
    },
    components: {
      libTemp,
      logTemp
    },
    methods: {
      toggle_Click(v) {
        this.tabIndex = v;
      },
      kd_Click(e) {
        // console.log(e.keyCode);
        if (e.ctrlKey && e.keyCode == 13 && this.IPTSUPER == 1.0001) {
          this.IMSUPERMAN = true;
        }
      }
    },
    ready() {

    }
}
</script>
