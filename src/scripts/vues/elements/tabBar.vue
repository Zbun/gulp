<template>
  <div id="tab-bar">
    <ul>
      <li v-for="(index,item) in computedTabBar" @click="show(item)" :class="{on:1==item.On,home:item.Id=='home'}">
        {{item.Name}}
        <span class="font-big t-del" @click.stop="hide(item,index)">&times;</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  components: {},
  computed: {
    computedTabBar() {
      return this.$store.state.arrTabBar;
    },
    computedMainBox() {
      return $('#main-box');
    }
  },
  methods: {
    link_Click(e) {
      var $mainBox = $('#main-box');
      $mainBox.find('>.home').show().siblings().hide();
      return;
    },
    show(sub) {
      document.title = `${sub.Name}-Z管家`;
      this.$store.state.arrTabBar.forEach(item => {
        item.On = 0;
        if (item.Id == sub.Id) {
          item.On = 1;
        }
      });
      this.computedMainBox.find('>#m' + sub.Id).show().siblings().hide();
    },
    hide(sub, index) {
      this.$store.state.arrTabBar.$remove(sub);
      if (1 == sub.On) {
        var itemPrev = this.$store.state.arrTabBar[index - 1];
        itemPrev.On = 1;
        document.title = `${itemPrev.Name}-Z管家`;
        this.computedMainBox.find('>#m' + itemPrev.Id).show().siblings().hide();
      }
    }
  },
  ready() {}
}
</script>