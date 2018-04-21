<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>颜色</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <div class="info-list">
              <div class="item">
                <h3 class="title">
                <button class="btn btn-primary fr" @click="addColor">添加</button>
                <select v-model="colorType" @change="changeColorType">
                  <option :value="item.Id" v-for="item in arrColor">
                    {{item.Name}}
                  </option>
                </select>
              </h3>
                <div class="content">
                  <span class="tag tag-pure" :class="{on:item._isActive}" v-for="(item,index) in arrColorList" @click="selectColor(item)">
                  {{item.ColorName}}
                  <i class="tag-del" @click="delColor(item,index)">&times;</i>
                </span>
                  <span class="text-nowrap mb10" v-show="isShowAdd">
                  <input type="search" placeholder="输入颜色" v-model="colorName" class="com-ipt x-small" @keydown.enter="save">
                  <a href="javascript:;" class="highlight ml5" @click="save">保存</a>
                  <a href="javascript:;" class="text-muted ml5" @click="cancel">取消</a>
                </span>
                </div>
              </div>
            </div>
            <div class="text-muted mt10">
              已选择（<span :class="{'text-danger':chkItem&&chkItem.length>0}">{{chkItem?chkItem.length:0}}</span>个）：{{chkItem?chkItem.map(c=>c.ColorName).join('、'):''}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: { twoway: true, default: false },
    chkItem: [],
    isEdit: { type: Boolean, default: false }, //编辑时，需要初始化已选中的颜色
  },
  data() {
    return {
      arrChkItem: [],
      isShowAdd: false,
      colorType: '',
      arrColor: [],
      colorName: '',
      arrColorList: []
    }
  },
  computed: {},
  components: {},
  methods: {
    initPageData() {
      fetchData({
        API: '/api/Goods/GetColorList',
        callback: data => {
          data.forEach(item => {
            item.ColorList.forEach(color => {
              color._on = false; //生成SPU时使用，判断当前是否选中
              color._isActive = false; //是否选择加入
              if (this.isEdit) { //编辑时勾选已选中的颜色
                this.chkItem.forEach(chked => {
                  if (chked.Id == color.Id) {
                    color._on = true;
                    color._isActive = true;
                  }
                })
              }
            })
          })
          this.arrColor = data;
          if (this.arrColor.length) {
            this.colorType = this.arrColor[0].Id; //选中第一个颜色分类
            this.arrColorList = this.arrColor[0].ColorList; //第一个颜色分类作为颜色列表
          }
        }
      })
    },
    changeColorType() {
      this.arrColorList = _.find(this.arrColor, {
        Id: this.colorType
      }).ColorList;
    },
    addColor() {
      this.isShowAdd = true;
    },
    save() {
      if (!this.colorName) {
        showTips('请填写颜色名称', 'error');
        return;
      }
      fetchData({
        API: '/api/Goods/ColorAdd',
        para: {
          ColorTypeId: this.colorType,
          ColorName: this.colorName
        },
        callback: data => {
          data._on = false; //父级页面是否选中，此时已加入父级数组
          data._isActive = false; //当前颜色是否加入父级数组
          this.colorName = '';
          this.arrColor.forEach(item => {
            if (item.Id == this.colorType) {
              item.ColorList.push(data);
            }
          })
        }
      })
    },
    delColor(item, index) {
      fetchData({
        API: '/api/Goods/ColorDelete',
        para: {
          Id: item.Id
        },
        callback: data => {
          item._on = false;
          this.arrColor.forEach(item => {
            if (item.Id == this.colorType) {
              item.ColorList.splice(index, 1);
            }
          })
          this.updateSelectedColor();
          if (item._on) {
            this.updateSPUTable();
          }
        }
      })
    },
    updateSPUTable() {
      this.$emit('update-table');
    },
    cancel() {
      this.isShowAdd = false;
    },
    updateSelectedColor() { //选中标签后，更新已选颜色
      let arrTemp = [];
      this.arrColor.forEach(item => {
        item.ColorList.forEach(color => {
          if (color._isActive) { //加入父级数组列
            arrTemp.push(color);
          }
        })
      })
      this.$emit('update:chkItem', arrTemp);
    },
    selectColor(item) {
      if (item._on) {
        item._on = false;
        this.updateSPUTable();
      }
      item._isActive = !item._isActive;
      this.updateSelectedColor();
    },
    onSubmit_Click() {},
    onCancel_Click() {
      this.show = false;
      this.$emit('update:show', false);
    }
  },
  created() {},
  watch: {
    show(newVal) {
      if (newVal) {
        if (this.arrColor.length == 0) {
          this.initPageData();
        }
      }
    }
  }
}
</script>