<template>
  <div class="clearfix action-btn-box">
    <button class="btn btn-warning" @click="action_insert()" :class="{'btn-disabled':!computedIsCanBeInserted}">新增</button>
    <button class="btn btn-primary" @click="save_Click($event)" :class="{'btn-disabled':!computedIsCanBeSaved}">保存</button>
    <button class="btn btn-default" @click="action_delete()" :class="{'btn-disabled':!computedIsCanBeDeleted}">删除</button>
    <button class="btn btn-default" @click="action_print()" :class="{'btn-disabled':!computedIsCanBePrinted}">打印</button>
    <button @click="action_check(3)" class="btn btn-default" :class="{'btn-disabled':!computedIsCanBeChecked}">审核</button>
    <div class="select-style" :class="{'btn-disabled':!computedIsAdvance}">
      <span>高级</span>
      <div class="select-list-box">
        <ul class="list">
          <li><a href="javascript:;" @click="action_close()" :class="{'disabled':!computedIsCanBeClosed}">关闭</a></li>
          <!--           <li><a href="javascript:;" @click="action_check(1)" :class="{disabled:!computedIsCanBeReverse}">反审核</a></li> -->
          <li><a href="javascript:;" @click="action_complete()" :class="{'disabled':!computedIsCanBeCompleted}">强制完成</a></li>
          <li><a href="javascript:;">导入明细</a></li>
          <li><a href="javascript:;">导出明细</a></li>
          <li><a href="javascript:;">复制新建</a></li>
          <li><a href="javascript:;">查看关联单据</a></li>
        </ul>
      </div>
    </div>
    <button class="btn btn-default" :class="{'btn-disabled':!computedIsPrev}" @click="goNext(0)">前一张</button>
    <button class="btn btn-default" :class="{'btn-disabled':!computedIsNext}" @click="goNext(1)">后一张</button>
    <button class="btn btn-default" @click="goBack()">返回</button>
  </div>
</template>
<script>
export default {
  props: {
    pageTitle: '', //页面标题，用于获取接口
    arrChkCode: [], //勾选返回数据
    dataDetail: {}, //列表数据返回值
    curCode: '', //当前单号
    routerName: '', //路由名
    routerEdit: '', //编辑单据路由名
    routerList: '', //列表路由
    routerParams: '', //参数名
    tipsInfo: {}, //预留操作提示信息对象
    actionRights: {}, //直接操作权限禁用与否
    isSingleChecked: '',
  },
  data() {
    return {}
  },
  computed: {
    computedIsCanBeSaved() {
      if (!this.computedAPILIST.Insert && !this.computedAPILIST.Update) {
        return false;
      }
      return this.dataDetail.Code == 0 || this.dataDetail.Status == 1;
    },
    computedIsCanBeClosed() {
      if (!this.computedAPILIST.Close) {
        return false;
      } else {
        return true;
      }
    },
    computedIsCanBePrinted() {
      if (!this.computedAPILIST.Print) {
        return false;
      }
      if (this.dataDetail && this.dataDetail.Code) {
        return true;
      } else {
        return this.arrChkCode.length > 0;
      }
    },
    computedIsAdvance() {
      if (this.dataDetail && this.dataDetail.Code) {
        return true;
      } else {
        return this.arrChkCode.length > 0;
      }
    },
    computedIsCanBeInserted() {
      if (this.actionRights && this.actionRights.insert == 0) {
        return false;
      }
      return !!this.computedAPILIST.Insert;
    },
    computedIsPrev() {
      return this.dataDetail.NextRecord[0];
    },
    computedIsNext() {
      return this.dataDetail.NextRecord[1];
    },
    computedIsCanBeDeleted() {
      if (!this.computedAPILIST.Delete) {
        return false;
      }
      if ((this.dataDetail && this.dataDetail.Code) || (this.arrChkCode && this.arrChkCode.length)) {
        return true;
      } else { return false; }
    },
    computedIsCanBeChecked() { //是否能修改、审核
      let isOk = false;
      if (!this.computedAPILIST.Check) {
        return false;
      }
      if (this.dataDetail && this.dataDetail.Code) {
        return this.dataDetail.Status == 1;
      }
      if (1 == this.isSingleChecked && this.arrChkCode && this.arrChkCode.length > 1) {
        return false;
      }
      for (let i = 0; i < this.arrChkCode.length; i++) {
        if (_.find(this.dataDetail, {
            Code: this.arrChkCode[i]
          }).Status != 1) {
          isOk = false;
          break;
        } else {
          isOk = true;
        }
      }
      return isOk;
    },
    computedIsCanBeCompleted() {
      if (!this.computedAPILIST.Complete) {
        return false;
      }
      return /销售|采购/.test(this.pageTitle) && !/保价|返利/.test(this.pageTitle);
    },
    computedAPILIST() {
      let objTemp = _.find(this.$store.state.action, {
        Item: this.pageTitle
      });
      return objTemp ? objTemp.Details : {};
    },
    computedArrCodes() { //处理关闭或审核时单号问题
      if (this.dataDetail.Code) {
        return [this.dataDetail.Code];
      } else {
        return this.arrChkCode;
      }
    }
  },
  components: {},
  methods: {
    action_insert() {
      if (!this.computedIsCanBeInserted) {
        return;
      }
      let params = {};
      params[this.routerParams] = 0;
      this.$router.go({
        name: this.routerName,
        params
      });
    },
    goBack() {
      this.$router.go({
        name: this.routerList
      });
    },
    save_Click(e) {
      if (!this.computedIsCanBeSaved) {
        return;
      }
      this.$dispatch('save', e);
    },
    action_delete() {
      let me = this;
      if (!this.computedIsCanBeDeleted) {
        return;
      }
      dialog({
        title: '删除单据',
        content: `删除操作不可恢复，请确认？`,
        ok() {
          fetchData({
            API: me.computedAPILIST.Delete,
            para: {
              codes: me.computedArrCodes
            },
            callback(data) {
              if (!me.dataDetail.Code) {
                me.$dispatch('after-action', '');
              } else {
                me.$router.go({
                  name: me.routerList
                });
              }
            }
          })
        },
        cancel() {}
      }).showModal();
    },
    fnDispatch() { //审核，关闭，强制完成时调用
      this.$dispatch('after-action', this.dataDetail.Code || '');
    },
    action_check(i) {
      let me = this;
      let fn = function() {
        fetchData({
          API: me.computedAPILIST.Check,
          para: {
            codes: me.computedArrCodes,
            status: i
          },
          callback(data) {
            me.fnDispatch();
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
      if (!this.computedIsCanBeCompleted) {
        return;
      }
      dialog({
        title: '提示',
        content: '确认强制完成单据？',
        ok() {
          fetchData({
            API: me.computedAPILIST.Complete,
            para: {
              codes: me.computedArrCodes,
            },
            callback(data) {
              me.fnDispatch();
            }
          });
        },
        cancel() {}
      }).showModal();
    },
    action_close() {
      let me = this;
      if (!this.computedIsCanBeClosed) {
        return;
      }
      dialog({
        title: '提示',
        content: '确认关闭单据？',
        ok() {
          fetchData({
            API: me.computedAPILIST.Close,
            para: {
              codes: me.computedArrCodes,
            },
            callback(data) {
              me.fnDispatch();
            }
          });
        },
        cancel() {}
      }).showModal();
    },
    action_print() {
      let me = this;
      if (!this.computedIsCanBePrinted) {
        return;
      }
      fetchData({
        API: this.computedAPILIST.Print,
        para: {
          codes: this.computedArrCodes
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
                        Codes: me.computedArrCodes
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
    goNext(i) { //上下一张
      let code = this.dataDetail.NextRecord[i]
      let params = {};
      params[this.routerParams] = code;
      this.$router.go({
        name: this.routerEdit,
        params
      });
      this.$dispatch('after-action', code);
    },
  },
  ready() {}
}
</script>