<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a><span style="color:#333;">修改密码</span></h2>
        <div class="body" style="width:400px;min-height:auto;height:180px;">
          <div class="content mt20">
            <div class="set" >
              <div class="item" style="padding:5px;">
                <div class="title" style="color:#333;">原密码</div>
                <div class="content">
                  <input type="password" style="width:86%" 
                    v-model="Password">
                </div>
              </div>
            </div>
            <div class="set">
              <div class="item"style="padding:5px;">
                <div class="title" style="color:#333;">新密码</div>
                <div class="content">
                  <input type="password" style="width:86%"
                    v-model="NewPassword">
                </div>
              </div>
            </div>
            <div class="set">
              <div class="item"style="padding:5px;">
                <div class="title" style="color:#333;">确认密码</div>
                <div class="content">
                  <input type="password" style="width:86%"
                    v-model="NewPassword1">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <button class="btn btn-primary" @click="update_Click">确认</button>
          <button class="btn btn-default" @click='onCancel_Click'>取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  // import md5 from 'commonScripts/md5';
  export default {
    data(){
      return {
        Password:'',
        NewPassword:'',
        NewPassword1:''
      }
    },
    props:{
      show:{
        type:Boolean,
        default:false,
        twoway:true
      }
    },
    methods: {
      onCancel_Click(){this.show = false},
      update_Click(){
        const me = this;
        if(this.Password=='' 
          || this.NewPassword1=='' 
          || this.NewPassword==''){
          showTips('请输入密码！','error');
          return ;
        }
        if(this.NewPassword1 != this.NewPassword) {
          showTips('两次输入的密码不一致！','error');
          return;
        }
        let para = {
          OldPwd:this.Password,
          NewPwd:this.NewPassword
        };
        fetchData({
          api:'/Api/User/EditPwd',
          para,
          callback(data){
            me.show = false;
            showTips('密码修改成功，请重新登录！','',2000);
            setTimeout(()=>{
              me.$dispatch('after:update');
            },1000)
          }
        })
      }
    }
  }
</script>
