<template>
  <div class='z-tree l-tree'>
    <v-tree-item :treeData='treeData' :checkedData="checkedData" :clickFun='clickFun' :checkBox='checkBox' :class='{tree_root_lonely:treeData.length === 1}' @toggleCheckBox="getCheckedNodes"></v-tree-item>
  </div>
</template>

<script>
export default {
  name: "v-tree",
  props: ["treeData", "checkedData", "clickFun", "checkBox"],
  data() {
    return {
      //userData:this.treeData
      saleCatagary: {}
    };
  },
  mounted() {
    this.initData(true, true, true);
  },
  updated() {
    this.initData(true, true, true);
  },
  created() {
    this.getCheckedData();
  },
  methods: {
    initData(expandInit, activeInit, checkedInit) {
      var modifyDataFun = function(datas, checkedData) {
        if (datas) {
          datas.forEach((m, index) => {
            if (expandInit) {
              Vue.set(m, "expand", true);
            }
            if (activeInit) {
              Vue.set(m, "active", false);
            }
            if (checkedInit) {
              Vue.set(m, "checked", false);
              Vue.set(m, "partchecked", false);
            }
            if (checkedData) {
              checkedData.map(el => {
                if (m.Code == el) {
                  m.checked = true;
                }
              });
            }
            if (m.Child) {
              modifyDataFun(m.Child, checkedData);
            } else {
              Vue.set(m, "last", true);
            }
          });
        }
      };
      modifyDataFun(this.treeData, this.checkedData);
    },
    getCheckedData() {},
    clickNodeWrap() {
      this.initData(false, true, false);
    },
    checkBoxFun(item) {},
    getCheckedNodes() {
      var resultArr = [];
      var getCheckedNodesFun = datas => {
        if (datas) {
          datas.forEach(m => {
            console.log(m);
            if (m.checked === true || m.partchecked === true) {
              resultArr.push(m);
            }
            if (m.Child) {
              getCheckedNodesFun(m.Child);
            }
          });
        }
      };
      getCheckedNodesFun(this.treeData);
      console.log(resultArr);
      return resultArr;
    },
    getSelectedNode() {
      var resultNode = null;
      var getSelectedFun = datas => {
        if (datas) {
          datas.forEach(m => {
            if (m.active === true) {
              resultNode = m;
              return;
            }
            if (m.Child) {
              getSelectedFun(m.Child);
            }
          });
        }
      };
      getSelectedFun(this.treeData);
      return resultNode;
    },
    getParentNode(node) {
      var resultNode = null;
      var getParentNode = (datas, parent) => {
        if (datas) {
          try {
            datas.forEach(m => {
              if (node && m.Id === node.Id) {
                resultNode = parent;
                throw new Error("Stop");
              }
              if (!resultNode && m.Child) {
                getParentNode(m.Child, m);
              }
            });
          } catch (e) {}
        }
      };
      getParentNode(this.treeData, null);
      console.log(resultNode);
      return resultNode;
    },
    getParentNodesArr(node) {
      var resultArr = [];
      var parentNode;
      var getParent = target => {
        parentNode = this.getParentNode(target);
        if (parentNode) {
          resultArr.push(parentNode);
          getParent(parentNode);
        }
      };
      getParent(node);
      return resultArr;
    }
  },
  components: {
    "v-tree-item": {
      name: "v-tree-item",
      template:
        '<ul class="cus_tree_ul" :class="{cus_tree_ulLine:(treeData && treeData.length)}"><li v-for="item in treeData"><div class=" title"  @click.stop="clickNode(item,$event)" :id= item.Id   :class="{active:item.active}">' +
        '<span class="treeExpandBtn"  :class="{butopen:item.expand && item.Child,btnclose:!item.expand && item.Child,line: !item.last && !item.Child,lastLine:item.last&&!item.Child}"></span>' +
        '<label class="checkbox"><input type="checkbox" :name="item.PathName"   @click="checkBoxClick(item,$event)" :checked="item.checked || item.partchecked"><span class="icon"></span></label>{{item.Item}}{{item.last}}</div>' +
        '<v-tree-item :treeData="item.Child"  v-if="item.expand" :clickFun="clickFun" :checkBox="checkBox" :class="{cus_checkbox_allchecked:item.checked}" @toggleCheckBox="checkBoxFun(item)" ></v-tree-item> </li></ul>',

      methods: {
        clickNode(item, e) {
          item.active = true;
          item.expand = !item.expand;
        },
        checkBoxClick(item, e) {
          item.partchecked = false;
          item.checked = !item.checked;
          //设置子元素是否勾选
          var checkChildFun = ChildDatas => {
            ChildDatas.forEach(m => {
              m.checked = item.checked;
              if (m.Child) {
                checkChildFun(m.Child);
              }
            });
          };
          if (item.Child) {
            checkChildFun(item.Child);
          }
          this.$emit("toggleCheckBox");
        },
        checkBoxFun(item) {
          var checkedNum = 0;
          var partCheckedNum = 0;

          item.Child.forEach(li => {
            if (li.checked === true) {
              checkedNum++;
            } else if (li.partchecked === true) {
              partCheckedNum++;
            }
          });

          if (checkedNum === item.Child.length) {
            //全选
            item.checked = true;
            item.partchecked = false;
          } else if (checkedNum > 0 || partCheckedNum > 0) {
            //部分勾选
            item.checked = false;
            item.partchecked = true;
          } else {
            //没有勾选
            item.checked = false;
            item.partchecked = false;
          }
          this.$emit("toggleCheckBox");
        }
      },
      props: ["treeData", "clickFun", "checkBox"]
    }
  }
};
</script>

<style>
ul.cus_tree_ul {
  padding-left: 16px;
}
ul.cus_tree_ul li {
  text-align: left;
  cursor: pointer;
  list-style: none;
}
.z-tree .butopen {
  position: relative;
  top: -1px;
  content: "";
  display: inline-block;
  width: 0;
  height: 0;
  margin-right: 5px;
  margin-top: -2px;
  border-style: solid;
  border-width: 3px 0 3px 4px;
  border-color: transparent;
  border-left-color: inherit;
  transform: rotate(-90deg);
}

.z-tree .btnclose {
  position: relative;
  top: -1px;
  content: "";
  display: inline-block;
  width: 0;
  height: 0;
  margin-right: 5px;
  margin-top: -2px;
  border-style: solid;
  border-width: 3px 0 3px 4px;
  border-color: transparent;
  border-left-color: inherit;
}
</style>