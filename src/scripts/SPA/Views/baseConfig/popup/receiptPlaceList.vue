<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>收货地址</h2>
        <div class="body">
          <div class="content" style="width:800px;padding:15px 30px;">
            <div class="mb15"><b>{{obj.Name}}</b><b class="ml20" v-if="obj.BranchName">|</b><b class="ml20">{{obj.BranchName}}</b></div>
            <table class="table table-hover table-odd table-bordered">
              <tbody v-if="obj.Details.length!=0">
                <tr v-for="item in obj.Details">
                  <td style="border:none;padding:10px;min-width:9%;">{{item.Receiver}}</td>
                  <td style="border:none;width:15%;">{{item.Phone}}</td>
                  <td style="border:none;padding-right:10px;width:65%;">{{item.AddressDetail}}</td>
                  <td v-if="item.IsDefault==0" style="border:none;width:9%;"><span style="cursor:pointer;color:#999;border:1px solid transparent;display:inline-block;border-radius:2px;background-color:#fff;padding:0 3px;" @click="setDefault_Click(item)">设为默认</span></td>
                  <td v-else style="border:none;width:9%;"><span style="color:#23a8f5;border:1px solid #23a8f5;display:inline-block;border-radius:2px;background-color:#fff;padding:0 3px;">默认地址</span></td>
                </tr>
              </tbody>
              <tbody v-else>
                <td colspan=4>
                  <div class="data-empty">
                    <i class="icon"></i>
                    <p class="font-big text-center">暂无相关数据</p>
                  </div>
                </td>
              </tbody>
            </table>
          </div>
        </div>
        <div class="footer text-center">
          <template v-if="cur.Id!==undefined">
            <button class="btn btn-primary" @click="onSubmit_Click">保存</button>
          </template>
          <template v-else>
            <button class="btn btn-primary btn-disabled" >保存</button>
          </template>
          <button class="btn btn-default" @click="onCancel_Click">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      twoway: true,
      default: false
    },
    dataObj:Object
  },
  data() {
    return {
      obj:{},
      cur:{}
    }
  },
  methods: {
    setDefault_Click(item) {
      item.IsDefault = 1;
      this.obj.Details.forEach(el=>{
        if(el.Id!=item.Id){
          el.IsDefault = 0;
        }
      });
      this.cur = item;
    },
    onSubmit_Click() {
      fetchData({
        API:'/Api/Customer/AddressSetDefault',
        para:{Id:this.cur.Id},
        callback:data=>{
          this.onCancel_Click()
        }
      })
    },
    onCancel_Click() {
      this.show = false;
      //重置
      this.obj = {};
      this.cur = {};
    },
    getDetailById() {
      fetchData({
        api:'/Api/Customer/CustomerView',
        para:{Id:this.dataObj.Id},
        callback:data=>{
          this.obj = data;
        }
      })
    }
  },
  watch: {
    show(newVal) {
      newVal && this.getDetailById()
    }
  }
}
</script>
