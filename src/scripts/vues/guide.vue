<template>
  <article class="item" v-if="showGuide && remainItems.length" v-cloak>
    <h2 class="content-title title">新手引导</h2>
    <section class="content">
      <ul class="step col col4">
        <li class="item" v-for="item in items">
          <div class="inner" :class="'i' + $index">
            <div class="l">
              <strong class="title">{{ item.taskName }}</strong>
              <div class="status" :class="stateClass(item)" v-if="handled(item)"></div>
              <div class="op" v-else>
                <a :href.once="item | forward" class="btn btn-o" :target.once="item.blank?'_blank':null">去完成</a>
                <span class="ignore" @click="ignore(item)">忽略</span>
              </div>
            </div>
            <div class="content">{{ item.taskDesc }}</div>
          </div>
        </li>
      </ul>
    </section>
  </article>
</template>
<script>
  import { guide } from 'src/config.js';
  import { guideTask, htmlTemplate } from 'src/service.js';
  export default {
    data() {
        return {
          items: [],
          showGuide: false
        };
      },
      computed: {
        remainItems () {
          return this.items.filter((item) => item.taskState === guide.consts.GUIDE_UNFINISHED);
        }
      },
      methods: {
        getData () {
          // TODO PARSE RESPONSE IN SERVICE.JS
          guideTask
            .getList()
            .then((res) => {
              res = res.json();
              if (!res.success) return;
              this.showGuide = res.withGuideTask;
              this.items = res.data;
            }, () => {
              this.items = [];
            });
        },
        ignore(item) {
          // TODO PARSE RESPONSE IN SERVICE.JS
          guideTask
            .ignore(item.id)
            .then((res) => {
              res = res.json();
              if (!res.success) return;
              this.showGuide = res.withGuideTask;
              this.items = res.data;
            }, () => {
              this.getData();
            });
        },
        handled(item) {
          return item.taskState !== guide.consts.GUIDE_UNFINISHED;
        },
        stateClass(item) {
          switch (item.taskState) {
            case guide.consts.GUIDE_DONE:
              {
                return 'end';
              };
              break;
            case guide.consts.GUIDE_IGNORE:
              {
                return 'ignored';
              };
              break;
            default:
              {
                return '';
              }
          }
        }
      },
      filters: {
        forward(item) {
          return htmlTemplate(guide.consts.GUIDE_FORWARD_URL, {id: item.taskOrder});
        }
      },
      ready: function() {
        this.getData();
      }
  };
</script>
