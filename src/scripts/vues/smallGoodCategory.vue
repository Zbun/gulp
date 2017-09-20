<template>
  <div :style="styles">
    <div style="position:relative;">
      <input type="text" :value="$store.state.cuCategory.Name" readonly placeholder="请选择" @click="onGet">
      <!-- <input type="text" :value="curCategory.Name" readonly placeholder="请选择"  @click="onGet"> -->
      <i class="icon-dropdown nohover" style="position:absolute;color:#666;margin-left:-25px;margin-top:8px;pointer-events:none;"></i>
      <div style="background-color:#fff;border:1px solid #dcdcdc;border-radius:2px;max-height:242px;overflow:auto;margin-top:2px;position:absolute;width:15em;z-index:9;"
        v-if="show" v-show="categoryList.length>0" @click.stop>
        <v-tree-box state-name="cuCategory" spread-ids="spreadGoodsListIds" :model="categoryList" @after-toggle-on="afterToggle"></v-tree-box>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {
      vTreeBox: require('vues/vTreeBox.vue')
    },
    props: {
      dataArr: Array,
      styles: {
        type: Object,
        default () {
          return {
            display: 'inline-block'
          }
        }
      },
      show: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        curCategory: {},
        categoryList: []
      }
    },
    methods: {
      afterToggle(item) {
        // console.log(item)
        this.curCategory = item;
        this.$dispatch('after-update', item);
      },
      getCategoryList() {
        fetchData({
          API: '/Api/Product/CategoryList',
          para: {
            pageIndex: 1,
            pageSize: 10000
          },
          callback: data => {
            this.initData(data);
            this.categoryList = data;
          }
        })
      },
      initData(data) {
        data.forEach(item => {
          if (_.indexOf(this.$store.state.spreadGoodsListIds, item.Id) > -1) {
            item.__open = true
          } else {
            item.__open = false
          }
          if (item.Childs && item.Childs.length) {
            this.initData(item.Childs)
          }
        })
      },
      onGet(e) {
        this.show = !this.show
        if (this.categoryList.length === 0) {
          this.getCategoryList()
        }
        e.stopPropagation()
      },
      onclick(e) {
        let parents = $(e.target).parents();
        let has = false;
        parents.each(item => {
          if (item === this.$el) {
            has = true
          }
        })
        if (!has) {
          this.show = false
        }
        e.stopImmediatePropagation()
      },
      esc(e) {
        if (e.keyCode == 27) {
          this.show = false
        }
        e.stopImmediatePropagation()
      }
    },
    ready() {
      $(document).on('click', this.onclick).on('keyup', this.esc)
    },
    destroyed() {
      $(document).off('click', this.onclick).off('keyup', this.esc)
    }


  }
</script>