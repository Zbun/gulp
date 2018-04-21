<template>
  <div class="main" id="app">
    <div class="content-field  clearfix addeedBack">
      <div class="data-content">
        <div class="clearfix align-btn">
          <span class="crumbs">
            <a href="javascript:;" @click="onCancel_Click()"> 意见列表</a> > 处理
            <input type="file" class="import-img hidden" :accept="uploadAcceptImg">
          </span>
        </div>
        <div class="two-column-view">
          <div class="item">
            <h2 class="title">反馈内容</h2>
            <div class="content">
              <div class="set displayCon">
                <dl class="item">
                  <dt class="title">
                    反馈类型
                  </dt>
                  <dd class="content">
                    <span v-if="SuggestInfo.SuggestType==1">功能异常</span>
                    <span v-else-if="SuggestInfo.SuggestType==2">平台投诉</span>
                    <span v-else-if="SuggestInfo.SuggestType==3">体验建议</span>
                    <span v-else-if="SuggestInfo.SuggestType==4">其他</span>
                    <span v-else-if="SuggestInfo.SuggestType==5">帐号注册/登录/密码/验证相关</span>
                    <span v-else-if="SuggestInfo.SuggestType==6">交易/支付功能相关</span>
                    <span v-else="SuggestInfo.SuggestType==7">APP相关（卡顿/白屏/闪退)</span>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    联系人
                  </dt>
                  <dd class="content">
                    {{SuggestInfo.Contacts}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    联系电话
                  </dt>
                  <dd class="content">
                    {{SuggestInfo.Phone}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    意见描述
                  </dt>
                  <dd class="content">
                    {{SuggestInfo.Message}}
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title">
                    图片
                  </dt>
                  <dd class="content">
                    <img :src="item" alt="" v-for="item in picArray">
                  </dd>
                </dl>
              </div>

            </div>
          </div>
          <div class="item">
            <h2 class="title">意见处理</h2>
            <div class="content">
              <div class="set">
                <dl class="item">
                  <dt class="title">
                    意见处理
                  </dt>
                  <dd class="content">
                    <div class="inline-radio">
                      <label class="radio"><input type="radio" name="matchStatus" value="1" v-model="SuggestTreat.TreatType" :disabled="SuggestInfo.Status == 3">
                        <span class="icon"></span>待沟通</label>
                      <label class="radio"><input type="radio" name="matchStatus" value="2" v-model="SuggestTreat.TreatType" :disabled="SuggestInfo.Status == 3">
                        <span class="icon"></span>沟通中</label>
                      <label class="radio"><input type="radio" name="matchStatus" value="3" v-model="SuggestTreat.TreatType" :disabled="SuggestInfo.Status == 3">
                        <span class="icon"></span>已解决</label>
                    </div>
                  </dd>
                </dl>
                <dl class="item" v-if="SuggestInfo.Status!=3">
                  <dt class="title">
                    沟通记录
                  </dt>
                  <dd class="content">
                    <textarea name="" id="" style="width:100%" rows="6" data-validate="required" class="com-ipt large" v-model="SuggestTreat.Message"></textarea>
                  </dd>
                </dl>
                <dl class="item" v-if="SuggestInfo.Status!=1">
                  <dt class="title">
                    处理结果
                  </dt>
                  <dd class="content">
                    <textarea name="" id="" style="width:100%" rows="6" class="com-ipt large" v-model="SuggestTreat.Result" v-if="SuggestInfo.Status==2"></textarea>
                    <div v-if="SuggestInfo.Status==3" class="bg-border">{{SuggestInfo.Result}}</div>
                  </dd>
                </dl>
                 <dl class="item" v-if="SuggestInfo.Details.length!=0">
                   <dt class="title">
                     沟通历史
                   </dt>
                   <dd class="content">
                       <div class="clearfix disHistory" >
                  <div class="times">
                    <p class="p_record">
                      <a href="javascript:;"></a>
                    </p>
                    <ul>
                      <li v-for="item in SuggestInfo.Details">
                        <b></b>
                        <span>
                        </span>
                        {{item.DateAdded}}</span>
                        <p>
                          {{item.Communicate}}
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
                   </dd>
                 </dl>
              
              </div>

            </div>
          </div>
        </div>
        <div class="text-center">
          <div class="btn btn-primary large" @click="onSubmit_Click()" v-if="SuggestInfo.Status!=3">保存</div>
          <div class="btn  large" @click="onCancel_Click()">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 *
 */
export default {
  data() {
    return {
      SuggestInfo: {},
      SuggestTreat: {
        TreatType: "",
        Message: "",
        Result: ""
      }
    };
  },
  methods: {
    initPageData() {
      let feedId = this.$route.query.id;
      fetchData({
        //获取文章信息
        API: "api/Misc/GetSuggestInfo",
        para: {
          Id: feedId
        },
        callback: data => {
          console.log(data);
          this.SuggestInfo = data;
        }
      });
    },
    onSubmit_Click() {
      if (!zmm_validator(this.$el)) {
        return;
      }
      let para = JSON.parse(JSON.stringify(this.SuggestTreat));
      para.Id = this.SuggestInfo.Id;
      fetchData({
        //获取栏目列表
        API: "api/Misc/PSuggestTreat",
        para,
        callback: data => {
          this.$router.push("feedback");
        }
      });
    },
    onCancel_Click() {
      this.$router.push("agentList");
    }
  },
  created() {
    this.initPageData();
  },
  computed: {
    picArray: function() {
      if (this.SuggestInfo.Images) {
        return this.SuggestInfo.Images.split(",");
      }
    }
  },
  watch: {}
};
</script>