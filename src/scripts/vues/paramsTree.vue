<template>
  <li v-for="(index,item) in model">
    <p>
      {{initStart(index,item)}}
      <span class="fr params-action">
        <a href="javascript:;" class="font-small ml5" title="添加子级" @click.stop="add(item,$event)" v-if="canAdd(item)">添加</a>
        <a href="javascript:;" class="font-small ml5" @click.stop="del(item,$event)">删除</a>
        <a href="javascript:;" class="font-small ml5" @click.stop="update(item,$event)">修改</a>
      </span>
    </p>
    <template v-if="haveChildren(item)">
      <ul>
        <params-tree :model="item.Childs"></params-tree>
      </ul>
      <p >
        <!--{{initEnd(item)}}-->
        {{initEnd(item)+hasComma(index,item)}}
      </p>
    </template>
  </li>
</template>
<script>
import _ from 'lodash';
export default {
  name: 'params-tree',
  computed: {
    varTypeList: () => dictionary['VarType'],
  },
  props: {
    //参数
    model: {
      type: Array
    },
    open: {
      type: Boolean,
      twoway: true,
      default: false
    }
  },
  methods: {
    canAdd(item){
      return item.ParaType==3 || item.ParaType ==4
    },
    initStart(index,item) {
      let str = '';
      if(item.ParaType == 1) {
        str = `${item.ParaName}:"${item.ParaValue}"${this.hasComma1(index,item)}`
      }else if(item.ParaType == 2) {
        str = `${item.ParaName}:"${this.varTypeList[item.ParaValue]}"${this.hasComma1(index,item)}`
      }else if(item.ParaType == 3) {
        str = `${item.ParaName}:[{`
      }else if(item.ParaType == 4) {
        str = `${item.ParaName}:{`
      }
      return str
    },
    initEnd(item) {
      if(item.ParaType == 3) {
        return '}]'
      }
      return '}'
    },
    del(item, e) {
      this.$dispatch('to-del', item)
    },
    add(item, e) {
      this.$dispatch('to-add', item)
    },
    update(item,e) {
      this.$dispatch('to-update',item)
    },
    haveChildren(item) {
      return (item.ParaType==3 || item.ParaType==4) && item.Childs
    },
    hasComma(index,item) {
      if(item.ParaType==3) {
        if(index==this.model.length-1) {
          return ''
        }
        return ','
      }else if(item.ParaType==4){
        let arr = Object.keys(this.model);
        if (arr[arr.length - 1] != item.ParaName) {
          return ','
        }
        return ''

      }else{
        return ''
      }
    },
    hasComma1(index,item) {
      if(_.isArray(this.model)) {
        if(index===this.model.length-1) {
          return ''
        }else{
          return ','
        }
      }
      return ''
    }
  }
}

</script>