<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{isEdit==1?'编辑':'新增'}}仓库</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <div class="set">
              <dl class="item">
                <dt class="title">关联供应商</dt>
                <dd class="content">
                  <select-supplier :i-d.sync="editItem.SCId"></select-supplier>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title required-mark">仓库名称</dt>
                <dd class="content">
                  <div class="ipt-with-tips">
                    <input type="text" placeholder="输入名称" data-validate="required" class="com-ipt x-large" v-model="editItem.Name">
                  </div>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  仓库联系人
                </dt>
                <dd class="content">
                  <input type="text" placeholder="请输入" class="com-ipt x-large" v-model="editItem.Contacts">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  联系人电话
                </dt>
                <dd class="content">
                  <input type="text" placeholder="请输入" data-validate="phone" class="com-ipt x-large" v-model="editItem.Phone">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  仓库地址
                </dt>
                <dd class="content">
                  <area-box :area-codes="editItem.AreaCode1+','+editItem.AreaCode2+','+editItem.AreaCode3+','+editItem.AreaCode4" :area-code.sync="editItem.AreaCode4"></area-box>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  详细地址
                </dt>
                <dd class="content">
                  <input type="text" placeholder="请输入" class="com-ipt block" v-model="editItem.Address">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  配送区域
                </dt>
                <dd class="content">
                  <div class="info-list">
                    <div class="item">
                      <div class="title" style="display:flex;padding:10px;">
                        <select style="flex:1" class="mr10" v-model="objAreas.code1" @change="getAreaList(1)">
                          <option value="">省</option>
                          <option value="0">全国</option>
                          <option :value="item.AreaCode" v-for="item in objAreas.arrList1">{{item.AreaName}}</option>
                        </select>
                        <select style="flex:1" class="mr10" v-model="objAreas.code2" @change="getAreaList(2)">
                          <option value="">市</option>
                          <option :value="item.AreaCode" v-for="item in objAreas.arrList2">{{item.AreaName}}</option>
                        </select>
                        <select style="flex:1" class="mr10" v-model="objAreas.code3" @change="getAreaList(3)">
                          <option value="">区</option>
                          <option :value="item.AreaCode" v-for="item in objAreas.arrList3">{{item.AreaName}}</option>
                        </select>
                        <button class="btn btn-primary mr5 iconfont icon-tianjia" @click="addArea">
                        </button>
                      </div>
                      <div class="content" style="padding:10px;">
                        <ul>
                          <li style="display:flex;" v-for="(item,index) in editItem.Areas">
                            <span style="flex:1" v-for="area in item.AreaName">{{area}}</span>
                            <span style="width:50px;">
                              <a href="javascript:;" class="highlight" @click="delArea(item,index)">删除</a>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onSubmit_Click">确定</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 仓库添加
 */
import areaBox from "vues/components/areaBox.vue";
import selectSupplier from "vues/components/selectSupplier.vue";
export default {
  props: {
    show: { twoway: true, default: false },
    curItem: {}
  },
  data() {
    return {
      editItem: {
        Areas: []
      },

      arrCurAreas: [], //当前配送区域选中数组

      objAreas: {
        code0: 0,
        code1: "",
        code2: "",
        code3: "",

        arrList1: [],
        arrList2: [],
        arrList3: []
      }
    };
  },
  components: { areaBox, selectSupplier },
  methods: {
    initPageData() {
      let para = {};
      para.Id = this.curItem.Id;
      fetchData({
        api: "/api/Supplier/GetSupplierStorehouseInfo",
        para,
        callback: data => {
          this.editItem = data;
        }
      });
    },
    getAreaList(order) {
      //获取配送区域下拉，包含change时，写入选中的数据组合
      let pCode = this.objAreas["code" + order];
      if (order < 3) {
        this.objAreas.code3 = "";
      }
      for (let i = order; i < 3; i++) {
        //清除后续下拉
        this.objAreas["code" + (i + 1)] = "";
        this.objAreas["arrList" + (i + 1)] = [];
      }
      //拼装选中的组合数据
      for (let j = order; j < 3; j++) {
        this.arrCurAreas[j] = { AreaCode: "", AreaName: "全部" };
      }
      if (pCode) {
        if (pCode === '0') {
          this.arrCurAreas[0] = {
            AreaCode: '0',
            AreaName: '全国'
          };
          this.arrCurAreas[1] = this.arrCurAreas[2] = {
            AreaCode: '',
            AreaName: '--'
          };
        } else {
          this.arrCurAreas[order - 1] = Object.assign({},
            _.find(this.objAreas["arrList" + order], {
              AreaCode: pCode
            })
          );
        }

      } else {
        this.arrCurAreas[order] = { AreaCode: "", AreaName: "全部" };
      }
      if (pCode === "" || order == 3 || pCode === '0') {
        return;
      }

      fetchData({
        hideLoading: true,
        API: "/api/Supplier/GetSupplierChannelArea",
        para: {
          pCode
        },
        callback: data => {
          this.objAreas["arrList" + (order + 1)] = data;
        }
      });
    },
    addArea() { //添加配送区域
      if (!this.editItem.Areas) {
        this.editItem.Areas = [];
      }
      let objTemp = {
        AreaCode: "",
        AreaName: []
      };
      for (let i = 2; i >= 0; i--) {
        objTemp.AreaName.unshift(this.arrCurAreas[i].AreaName);
        if (!objTemp.AreaCode) {
          objTemp.AreaCode = this.arrCurAreas[i].AreaCode;
        }
      }
      if (!objTemp.AreaCode) {
        showTips("请先选择区域", "error");
        return;
      }
      if (
        _.find(this.editItem.Areas, {
          AreaCode: objTemp.AreaCode - 0
        })
      ) {
        showTips("配送区域已存在", "error");
        return;
      }
      this.editItem.Areas.push(Object.assign({}, objTemp));
    },

    delArea(item, i) {
      //删除配送区域
      this.editItem.Areas.splice(i, 1);
    },
    onSubmit_Click() {
      if (!zmm_validator(this.$el.querySelector(".popup"))) {
        return;
      }
      if (!this.editItem.SCId) {
        showTips("请选择供应商", "error");
        return;
      }
      let para = this.editItem;
      if (!para.AreaCode4) {
        showTips("请选择仓库地址", "error");
        return;
      }
      if (para.Areas.length == 0) {
        showTips("请选择配送区域", "error");
        return;
      }
      para.AreaCodes = para.Areas.map(item => {
        return item.AreaCode - 0;
      });
      if (!para.Id) {
        para.Id = 0;
      }

      fetchData({
        api: "/api/Supplier/SupplierStorehouseEdit",
        para,
        callback: data => {
          this.$emit("save-ok");
          this.onCancel_Click();
        }
      });
    },
    onCancel_Click() {
      this.show = false;
      this.$emit("update:show", false);
    }
  },
  created() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.editItem = this.curItem;
        this.getAreaList(0);
        if (this.curItem && this.curItem.Id) {
          this.initPageData();
        }
      }
    }
  }
};
</script>