<template>
  <div class="rights-group-for-check">
    <button class="btn btn-warning" v-if="computedAPILIST.Insert" @click="action_insert()">新增</button>
    <button class="btn btn-default" v-if="computedAPILIST.Update&&computedIsToAudit" @click="action_update()" :class="{'btn-disabled':!computedIsToAudit}">修改</button>
    <button class="btn btn-default" v-if="computedAPILIST.Delete&&computedIsToAudit" @click="action_delete()" :class="{'btn-disabled':!computedIsToAudit}">删除</button>
    <button class="btn btn-default" v-if="computedAPILIST.Check&&computedIsToAudit" @click="action_check(3)">
      审核
    </button>
    <button class="btn btn-default" v-if="computedAPILIST.Check&&computedIsAudited" @click="action_check(1)">
      反审核
    </button>
    <button class="btn btn-default" @click="action_print()" v-if="computedAPILIST.Print">打印</button>
  </div>
</template>
<script>
/**
 * 订单查看页面，操作按钮组
 * zhao.liubin@zol.com.cn
 * 2017-06-09
 */
export default {
  props: {
    pageTitle: '', //页面标题，用于判断权限
    dataDetail: {}, //列表详情数据，包含状态等
    routerName: '', //路由名
    routerParams: '', //参数名
    tipsInfo: {} //预留操作提示信息对象
  },
  data() {
    return {}
  },
  computed: {
    computedIsToAudit() {
      return this.dataDetail.Status == 1;
    },
    computedIsAudited() {
      return this.dataDetail.Status == 3;
    },
    computedAPILIST() {
      let objTemp = _.find(this.$store.state.action, {
        Item: this.pageTitle
      });
      return objTemp ? objTemp.Details : {};
    },
    computedArrChkCode() {
      return [this.dataDetail.Code];
    }
  },
  components: {},
  methods: {
    action_update() {
      if (this.computedIsUpdateDisable) {
        return;
      }
      let params = {};
      params[this.routerParams] = this.computedArrChkCode[0];
      this.$router.go({
        name: this.routerName,
        params,
      });
    },
    action_insert() {
      let params = {};
      params[this.routerParams] = 0;
      this.$router.go({
        name: this.routerName,
        params,
      });
    },
    action_delete() {
      let me = this;
      if (!this.computedAPILIST.Delete || this.computedIsDeleteDisable) {
        return;
      }
      dialog({
        title: '删除单据',
        content: `删除操作不可恢复，请确认？`,
        ok() {
          fetchData({
            API: me.computedAPILIST.Delete,
            para: {
              codes: me.computedArrChkCode
            },
            callback(data) {
              window.history.back();
            }
          })
        },
        cancel() {}
      }).showModal();
    },
    action_check(i) {
      let me = this;
      let fn = function() {
        fetchData({
          API: me.computedAPILIST.Check,
          para: {
            codes: me.computedArrChkCode,
            status: i
          },
          callback(data) {
            me.$dispatch('after-action');
          }
        });
      };
      if (me.tipsInfo && me.tipsInfo.check && me.tipsInfo.check[i]) {
        dialog({
          title: '提示',
          content: me.tipsInfo.check[i],
          ok() {
            fn();
          },
          cancel() {}
        }).showModal();
        return;
      }
      fn();
    },
    action_print() {
      let me = this;
      fetchData({
        API: this.computedAPILIST.Print,
        para: {
          codes: this.computedArrChkCode
        },
        callback(data) {
          try {
            var LODOP = getLodop();
            if (LODOP) {
              LODOP.PRINT_INIT("打印采购订单");
              LODOP.SET_PRINT_STYLE("FontSize", 14);
              LODOP.SET_PRINT_STYLE("Bold", 1);
              for (let i = 0; i < data.length; i++) {
                LODOP.NewPage();
                LODOP.ADD_PRINT_HTM(5, '5%', '90%', '130mm', data[i].PrintContent);
              }
              // LODOP.PREVIEW();
              if (LODOP.CVERSION) {
                LODOP.On_Return = function(taskID, Value) {
                  if (Value > 0) {
                    fetchData({
                      API: '/API/MISC/PrintCountUpdate',
                      para: {
                        Codes: me.computedArrChkCode
                      },
                      hideTips: true
                    })
                  } else {
                    alert('放弃打印');
                  }
                };
                LODOP.PREVIEW();
              } else {
                if (LODOP.PRINTA()) {
                  alert('直接加入打印队列');
                } else {
                  alert('直接放弃打印');
                }
              }
            }
          } catch (e) {
            console.log(e);
          }
        }
      })
    },
  },
  ready() {}
}
</script>
