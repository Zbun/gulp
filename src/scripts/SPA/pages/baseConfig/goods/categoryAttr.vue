<template>
  <div class="main">
    <div class="content-field goods-category clearfix">
      <div class="z-tree category-tree">
        <ul class="list">
          <li class="item dead m0" v-for="item in arrDataCategoryList" :class="{spread:item._spread}">
            <p class="title" @click.stop="selectItem(item)" :class="{on:curItem.Id==item.Id,spread:item._spread}" :title="item.Item">{{item.Item}}</p>
            <ul class="list">
              <li class="item" v-for="item in item.Child" :class="{on:curItem.Id==item.Id,spread:item._spread}">
                <p class="title" @click.stop="selectItem(item)" :class="{on:curItem.Id==item.Id}" :title="item.Item">{{item.Item}}</p>
                <ul class="list list-end">
                  <li class="item" v-for="item in item.Child" :class="{on:curItem.Id==item.Id}">
                    <p class="title" @click.stop="selectItem(item)" :title="item.Item">
                      {{item.Item}}
                    </p>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="data-content" :class="{disabled:!curItem.PCode||curItem.PCode==0}">
        <div class="clearfix align-btn">
          <span class="crumbs">
        {{curItem.PathName}}
        </span>
        </div>
        <article class="info-list">
          <section class="item">
            <h3 class="title">
              <button class="btn btn-primary fr" @click="add(1)">添加</button>规格属性
            </h3>
            <div class="content">
              <ul class="category-attr">
                <li class="item" v-for="item0 in arrSpecAndAttr.SpecInfo">
                  <div class="title"><b class="text-middle">
                    {{item0.SpecName}}
                  </b><a href="javascript:;" class="ml15 highlight" @click="addAttr($event,item0)">添加</a></div>
                  <div class="content mt10">
                    <span class="tag" @dblclick="modifyAttr(item,'Spec',item0)" v-for="(item,index) in item0.Values">
                      {{item.ValueTitle}}
                      <i class="tag-del" @click="delAttr(item,index,item0,'spec')">&times;</i>
                    </span>
                    <span v-show="item0._isShowValue" class="dis-inline-block mt10">
                      <input type="text" placeholder="" class="com-ipt small" @keydown.enter="saveAttr(item0,'Spec')" v-model="item0._value">
                    <a href="javascript:;" class="highlight ml5" @click="saveAttr(item0,'Spec')">保存</a>
                    <a href="javascript:;" class="ml5" @click="item0._isShowValue=false">取消</a>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </section>
          <section class="item">
            <h3 class="title">
              <button class="btn btn-primary fr" @click="add(0)">添加</button>常规属性
            </h3>
            <div class="content ">
              <ul class="category-attr">
                <li class="item" v-for="item0 in arrSpecAndAttr.AttrInfo">
                  <div class="title"><b class="text-middle">
                    {{item0.AttrName}}
                  </b><a href="javascript:;" class="ml15 highlight" @click="addAttr($event,item0)">添加</a></div>
                  <div class="content mt10">
                    <span class="tag" @dblclick="modifyAttr(item,'Attr',item0)" v-for="(item,index) in item0.Values">
                      {{item.ValueTitle}}
                      <i class="tag-del" @click="delAttr(item,index,item0,'attr')">&times;</i>
                    </span>
                    <span v-show="item0._isShowValue" class="dis-inline-block mb10">
                      <input type="search" placeholder="" class="com-ipt small" @keydown.enter="saveAttr(item0,'Attr')" v-model="item0._value">
                    <a href="javascript:;" class="highlight ml5" @click="saveAttr(item0,'Attr')">保存</a>
                    <a href="javascript:;" class="ml5 text-muted" @click="item0._isShowValue=false">取消</a>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </article>
      </div>
    </div>
    <div class="popup" v-if="isShowAddCategory">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{isEdit==1?'编辑':'新增'}}</h2>
        <div class="body">
          <div class="content" style="width:400px">
            <div class="set">
              <dl class="item" v-show="curItem.PathName">
                <dt class="title text-muted">所属品类</dt>
                <dd class="content">
                  {{curItem.PathName?curItem.PathName:''}}</dd>
              </dl>
              <dl class="item">
                <dt class="title text-muted required-mark">
                  属性名称
                </dt>
                <dd class="content">
                  <input type="text" v-model="name" data-validate="required" placeholder="输入品类" class=" com-ipt large" autofocus @keydown.enter="onSubmit_Click">
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
    <div class="popup" v-if="isShowModifyAttr">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>编辑属性</h2>
        <div class="body">
          <div class="content" style="width:400px">
            <div class="set">
              <dl class="item" v-show="curItem.PathName">
                <dt class="title text-muted">上级属性</dt>
                <dd class="content">
                  {{curAttrParentName}}</dd>
              </dl>
              <dl class="item">
                <dt class="title text-muted required-mark">
                  属性名称
                </dt>
                <dd class="content">
                  <input type="text" v-model="attrName" data-validate="required" placeholder="输入品类" class=" com-ipt large" autofocus @keydown.enter="submitAttr_Click">
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="submitAttr_Click">确定</button>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 基础设置-分类属性
 */
export default {
  data() {
    return {
      isShowAddCategory: false,
      isShowModifyAttr: false,
      arrDataCategoryList: [],
      name: '',
      curAttrParentName: '',
      curAttrItem: {},
      curAttrType: 'Spec',
      attrName: '',
      isSpec: 1,
      arrSpecAndAttr: [],
      curItem: { //分类树选中当前
        Id: '-1', //默认总类
        PCode: '0'
      },
    }
  },
  components: {},
  methods: {
    initPageData() {
      fetchData({
        API: '/api/Goods/GetCategoryALL',
        callback: data => {
          data.forEach(item => {
            item._spread = false;
            item.Child.forEach(item => {
              item._spread = false;
            })
          })
          this.arrDataCategoryList = data;
        }
      })
    },
    selectItem(item) {
      if (!item._spread != undefined) {
        item._spread = !item._spread;
      }
      if (item.PCode != 0) { //顶层不取属性
        fetchData({
          API: '/api/Goods/GetGoodsSpecAndAttr',
          para: {
            CategoryCode: item.Code,
          },
          hideLoading: true,
          callback: data => {
            data.SpecInfo.forEach(it => {
              it._value = '';
              it._isShowValue = false;
            })
            data.AttrInfo.forEach(it => {
              it._value = '';
              it._isShowValue = false;
            })
            this.arrSpecAndAttr = data;
          }
        })
      }
      this.curItem = item;
    },
    addAttr(e, item) {
      item._isShowValue = true;
      setTimeout(() => {

        $(e.target).closest('.item').find('.com-ipt').focus();
      })
    },
    saveAttr(item, type) {
      if (/^\s*$/.test(item._value)) {
        showTips('请填写属性', 'error');
        return;
      }
      fetchData({
        API: `/api/Goods/Goods${type}Add`,
        para: {
          CategoryCode: this.curItem.Code,
          Title: item[type + 'Name'],
          Value: item._value,
        },
        callback: data => {
          item._value = '';
          item.Values.push(data);
        }
      })
    },
    modifyAttr(item, type, itemParent) {
      this.curAttrParentName = itemParent[type + 'Name'];
      this.curAttrItem = item;
      this.curAttrType = type;
      this.attrName = item.ValueTitle
      this.isShowModifyAttr = true;
    },
    submitAttr_Click() {
      if (!zmm_validator(this.$el.querySelector('.popup'))) {
        return;
      }
      fetchData({
        API: `/api/Goods/Goods${this.curAttrType}Modify`,
        para: {
          Id: this.curAttrItem.Id,
          Value: this.attrName,
        },
        callback: data => {
          this.curAttrItem.ValueTitle = this.attrName;
          this.onCancel_Click();
        }
      })
    },
    delAttr(item, i, itemParent, spec) {
      let API = spec == 'spec' ? '/api/Goods/GoodsSpecValueDelete' : '/api/Goods/GoodsAttrValueDelete'
      fetchData({
        API,
        para: {
          Id: item.Id
        },
        callback: () => {
          itemParent.Values.splice(i, 1);
        }
      })
    },
    up(item, index) {
      fetchData({
        API: 'api/Goods/CategoryWeightUP',
        para: {
          Id: item.Id
        },
        callback: data => {
          let arrTemp = this.curItem.Child.splice(index - 1, 1);
          this.curItem.Child.splice(index, 0, arrTemp[0]);
        }
      })
    },
    down(item, index) {
      fetchData({
        API: 'api/Goods/CategoryWeightdown',
        para: {
          Id: item.Id
        },
        callback: data => {
          this.curItem.Child.splice(index, 1);
          this.curItem.Child.splice(index + 1, 0, item);
        }
      })
    },
    del(item, index) {
      dialog({
        title: '删除',
        content: `确认删除“${item.Item}”此条类别？`,
        ok: () => {
          fetchData({
            API: '/api/Goods/CategoryDelete',
            para: {
              Id: item.Id
            },
            callback: data => {
              this.curItem.Child.splice(index, 1);
            }
          })
        },
        cancel() {

        }
      }).showModal();
    },
    add(i) { //i==1规格、==0常规
      this.isShowAddCategory = true;
      this.name = '';
      this.isSpec = i;
    },
    onSubmit_Click() {
      if (!zmm_validator(this.$el.querySelector('.popup'))) {
        return;
      }
      // let API=this.isSpec==1?'/api/Goods/GoodsSpecAdd':'/api/Goods/GoodsAttrAdd';
      let objTemp = {};
      objTemp._value = '';
      objTemp._isShowValue = '';
      objTemp.Values = [];
      if (this.isSpec == 0) { //1是规格，0是属性
        objTemp.AttrName = this.name;
        if (_.find(this.arrSpecAndAttr.AttrInfo, { AttrName: this.name })) {
          showTips('该属性已存在', 'error');
          return;
        }
        this.arrSpecAndAttr.AttrInfo.push(objTemp);
      } else {
        objTemp.SpecName = this.name;
        if (_.find(this.arrSpecAndAttr.SpecInfo, { SpecName: this.name })) {
          showTips('该属性已存在', 'error');
          return;
        }
        this.arrSpecAndAttr.SpecInfo.push(objTemp);
      }
      this.onCancel_Click();
    },
    onCancel_Click() {
      this.isShowAddCategory = false;
      this.isShowModifyAttr = false;
    }
  },
  created() {
    this.initPageData();
  }
}
</script>