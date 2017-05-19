<template>
<div>
  <div class="popup" v-if="show">
    <div class="content">
      <h2 class="title">
        <a href="javascript:;" class="close" title="关闭" @click.stop="cancel_Click">×</a>选择机构</h2>
      <div class="body">
        <div class="content" style="width:900px">
          <!--<button class="btn btn-default fr">刷新</button>-->
          <input type="text" placeholder="输入关键字" class="com-ipt large" maxlength="50" v-model="searchText">
          <button class="btn btn-primary ml5">搜索</button>
          <div class="select-box-goods mt10" style="padding-right:280px;">
            <div class="border-box tree fr" style="width:265px;">
              <ul class="content list v-tree" style="margin-left:0;margin-top:3px;">
                <v-tree :model="dataIn.objDataTree" :open.sync="isOpen" @after-toggle-on="afterToggleOn"></v-tree>
              </ul>
            </div>
            <div class="list-goods">
              <div class="list-table border-box ">
                <table class="text-center table table-hover table-odd">
                  <tbody v-if="curDetails.length!==0">
                    <tr v-for="item in curDetails | filterBy searchText in 'Name'">
                      <td class="text-nowrap">{{item.BranchCode}}</td>
                      <td>
                        <p class="text-nowrap">{{item.Name}}</p>
                      </td>
                      <td>
                        <p class="text-nowrap">
                          <a href="javascript:;" class="highlight" @click.stop="add_Click(item)">添加</a>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td colspan=3>
                        <div class="data-empty">
                          <i class="icon"></i>
                          <p class="text-center">暂无相关数据</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--<div class="footer text-center">
        <button class="btn btn-primary" @click.stop="ok_Click">确认</button>
        <button class="btn btn-default" @click.stop="cancel_Click">取消</button>
      </div>-->
    </div>
  </div>
</div>
</template>
<script>
import vTree from 'commonVues/vTreeSimple.vue';
export default {
  components: {
    vTree
  },
  data() {
    return {
      isOpen:true,
      element:null,
      curDetails:[],
      searchText:'',
      dataIn: {
        objDataTree:{}
      }
      
    }
  },
  props:{
    show:{
      type:Boolean,
      twoway:true,
      default:false
    }
  },
  methods: {
    getTreePath(treeData,item) {
      let arr = [
        {
          Id:item.Id,Name:item.Name,PId:item.PId
        }
      ];
      let fn = (data)=>{
        if(data.Id == arr[0].PId) {
          arr.unshift({Id:data.Id,Name:data.Name,PId:data.PId});
          fn(treeData);
        }else{
          if(data.Details && data.Details.length) {
            for(let i=0;i<data.Details.length;i++) {
              fn(data.Details[i]);
            }
          }
        }
      }
      fn(treeData);
      return arr;
    },
    cancel_Click() {
      this.show = false;
    },
    add_Click(item) {
      this.$dispatch('after-select-branch',item,this.getTreePath(this.dataIn.objDataTree,item));
      this.cancel_Click();
      //数据重置
      this.curDetails = [];
    },
    afterToggleOn(item) {
      this.curDetails = item.Details;
    },
    getBranchTree() {
      fetchData({
        api:'/Api/Branch/BranchStoreTree',
        para:{},
        callback:data=>{
          this.dataIn.objDataTree = data;
          this.curDetails = data.Details;
          this.$nextTick(()=>{
            this.element.find('li[data-id=0]').addClass('on')
          })
        }
      })
    }
  },
  watch: {
    show(newValue) {
      if(newValue){
        this.getBranchTree();
        const me = this;
        this.element = $(this.$el).find('.v-tree');
        this.element
          .on('click', 'li.item', function(e) {
            me.element.find('li.item').removeClass('on');
            $(this).addClass('on');
            e.stopPropagation();
        })
      }else {
        this.isOpen = true;
        this.element.off('click');
      }
    }
  }
}
</script>
