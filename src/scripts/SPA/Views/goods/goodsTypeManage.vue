<template>
  <div class="main">
    <div class="content-title">商品管理</div>
    <div class="content-field">
      <div class="m0a w70p">
        <div class="mt5">
          <button class="btn btn-primary" @click="syncData($event)">同步数据</button>
          <span class="ml10 font-small">最近同步时间：<b>{{dataIn.finalSyncTime|datetime}}</b></span>
        </div>
        <div class="border-box mt14">
          <div class="tree mr20">
            <div class="fr" style="position:relative;z-index:3">
              <button class="btn btn-default" @click="fold_Click(0)">展开</button>
              <button class="btn btn-default" @click="fold_Click(1)">折叠</button>
              <button class="btn btn-warning" @click="add_Goods()">添加商品</button>
            </div>
            <ul class="content list" v-cloak>
              <li class="item" :class="{spread: item.spread}" v-for="item of dataIn.datalist">
                <h2 class="category" :title="item.Item" @click="category_Click($event,item)">
                  {{item.Item}}
                </h2>
                <ul class="list">
                  <li class="item" :class="{spread: item1.spread}" v-for="item1 of item.Details">
                    <h3 class="category" :title="item1.Item" @click="category_Click($event,item1)">
                      {{item1.Item}}
                    </h3>
                    <ul class="list">
                      <li class="item">
                        <p v-for="item2 of item1.Details" :title="item2.Item">
                          {{item2.Item}}
                        </p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        dataIn: {
          datalist: [],
          finalSyncTime: ''
        },
      }
    },
    methods: {
      initPageData() {
        let me = this;
        fetchData({
          API: 'api/Product/TreeView',
          callback(data) {
            // console.log(data);
            data.forEach((item) => {
              // item.readonly = true;
              item.spread = false;
              item.Details.forEach(item2 => {
                item2.spread = false;
              })
            });
            me.dataIn.datalist = data;
            me.getFinalSyncTime();
          }
        })
      },
      getFinalSyncTime() {
        let me = this;
        fetchData({
          API: '/Api/di/LastSyncDateTime',
          hideLoading: true,
          callback(data) {
            me.dataIn.finalSyncTime = data;
          }
        })
      },
      syncData(e) {
        let me = this;
        fetchData({
          api: '/Api/di/SyncProduct',
          target: e.target,
          callback(data) {
            if (data > 0) {
              me.initPageData()
            } else {
              me.getFinalSyncTime();
            }
          },
        })
      },
      fold_Click(v) {
        var boolV = !!!v;

        this.dataIn.datalist.forEach((item) => {
          // item.readonly = true;
          item.spread = boolV;
          item.Details.forEach(item2 => {
            item2.spread = boolV;
          })
        });
      },
      add_Goods() {
        dialog({
          title: '添加商品',
          content: '需要到B2B添加，请知悉',
          ok() {}
        }).showModal();
      },
      category_Click(e, item) {
        item.spread = !item.spread;
      },
      synchronize_Click() {
        this.initPageData();
      },
    },
    ready() {
      this.initPageData();
    }
}
</script>
