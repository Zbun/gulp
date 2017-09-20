<template>
  <div class="clearfix border-box bg-muted rights-box mt20">
    <div class="fr">
      <button class="btn btn-warning" v-if="computedAPILIST.Insert" @click="action_insert()">新增</button>
      <button class="btn btn-default" v-if="computedAPILIST.Update" @click="action_update()" :class="{'btn-disabled':!computedIsCanBeUpdated}">修改</button>
      <button class="btn btn-default" v-if="computedAPILIST.Delete" @click="action_delete()" :class="{'btn-disabled':computedIsDeleteDisable}">删除</button>
      <div class="select-style" :class="{'btn-disabled':arrChkCode.length==0}" v-if="computedAPILIST.Check">
        <span @click="action_check(3)" :class="{disabled:!computedIsCanBeUpdated}">审核</span>
        <ul class="list">
          <!--           <li><a href="javascript:;" @click="action_check(1)" :class="{disabled:!computedIsCanBeReverse}">反审核</a></li> -->
          <li><a href="javascript:;" @click="action_complete()" v-if="computedIsShowForce">强制完成</a></li>
          <li><a href="javascript:;" @click="action_close()">关闭</a></li>
        </ul>
      </div>
      <button class="btn btn-default" :class="{'btn-disabled':arrChkCode.length==0}" @click="action_print()" v-if="computedAPILIST.Print">打印</button>
      <button class="btn btn-default" v-if="computedAPILIST.Export">导出</button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    pageTitle: '', //页面标题，用于获取接口
    arrChkCode: [], //勾选返回数据
    dataTable: [], //列表数据返回值
    routerName: '', //路由名
    routerParams: '', //参数名
    tipsInfo: {} //预留操作提示信息对象
  },
  data() {
    return {}
  },
  computed: {
    computedIsDeleteDisable() {
      let l = this.arrChkCode.length;
      let is = !!!l;
      for (let i = 0; i < l; i++) {
        if (_.find(this.dataTable, {
            Code: this.arrChkCode[i]
          }).Status > 1) {
          is = true;
          break;
        }
      }
      return is;
    },
    computedIsCanBeUpdated() { //是否能修改、审核
      return this.getCanBeByStatus(1);
    },
    computedIsCanBeReverse() { //是否能反审
      return this.getCanBeByStatus(3);
    },
    computedIsCanBeForced() { //是否能强关
      return this.getCanBeByStatus(16);
    },
    computedIsShowForce() {
      return /销售|采购/.test(this.pageTitle) && !/保价|返利/.test(this.pageTitle);
    },
    computedAPILIST() {
      let objTemp = _.find(this.$store.state.action, {
        Item: this.pageTitle
      });
      return objTemp ? objTemp.Details : {};
    }
  },
  components: {},
  methods: {
    getCanBeByStatus(s) {
      let isOk = false;
      for (let i = 0; i < this.arrChkCode.length; i++) {
        if (_.find(this.dataTable, {
            Code: this.arrChkCode[i]
          }).Status != s) {
          isOk = false;
          break;
        } else {
          isOk = true;
        }
      }
      return isOk;
    },
    action_update() {
      if (!this.computedIsCanBeUpdated) {
        return;
      }
      let params = {};
      params[this.routerParams] = this.arrChkCode[0];
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
              codes: me.arrChkCode
            },
            callback(data) {
              me.$dispatch('after-action');
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
            codes: me.arrChkCode,
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
    action_complete() {
      let me = this;
      dialog({
        title: '提示',
        content: '确认强制完成单据？',
        ok() {
          fetchData({
            API: me.computedAPILIST.Complete,
            para: {
              codes: me.arrChkCode,
            },
            callback(data) {
              me.$dispatch('after-action');
            }
          });
        },
        cancel() {}
      }).showModal();
    },
    action_close() {
      let me = this;
      dialog({
        title: '提示',
        content: '确认关闭单据？',
        ok() {
          fetchData({
            API: me.computedAPILIST.Close,
            para: {
              codes: me.arrChkCode,
            },
            callback(data) {
              me.$dispatch('after-action');
            }
          });
        },
        cancel() {}
      }).showModal();
    },
    action_print() {
      let me = this;
      fetchData({
        API: this.computedAPILIST.Print,
        para: {
          codes: this.arrChkCode
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
                        Codes: me.arrChkCode
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