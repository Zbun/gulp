<template>
  <div class="main toBuy">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <input type="search" placeholder="输入关键字" class="com-ipt ipt-search" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <span class="ml5">
          <input type="text" class="com-ipt x-small" placeholder="开始时间" onclick="WdatePicker()" ref="StartDate" @focus="changeTime()" v-model="dataOut.search.StartDate"> -
          <input type="text" class="com-ipt x-small" placeholder="结束时间" onclick="WdatePicker()" ref="EndDate" @focus="changeTime()" v-model="dataOut.search.EndDate">
        </span>
        <span class="ml5">
          <select v-model="dataOut.search.tobuyStatusId" >
            <option value="" disabled selected>求购状态 </option>
            <option value="1">提交求购 </option>
            <option value="2">匹配中 </option>
            <option value="3">匹配成功 </option>
            <option value="4">匹配失败 </option>
            <option value="0">审核拒绝 </option>
          </select>
        </span>
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table table-bordered datalist table-hover">
        <thead>
          <tr>
            <th style="width:130px;">编号</th>
            <th>求购标题</th>
            <th style="width:180px;">分类</th>
            <th style="width:60px;">采购量</th>
            <th style="width:200px;">地区</th>
            <th style="width:80px;">联系人</th>
            <th style="width:80px;">手机号</th>
            <th style="width:60px;">状态</th>
            <th style="width:180px;">新建时间</th>
            <th style="width:180px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in dataIn.arrDataList">
            <td class="text-nowrap">
              {{item.Id}}
            </td>
            <td>
              {{item.Title}}
            </td>
            <td>
              {{item.CategoryNames}}
            </td>
            <td>
              {{item.WantBuyNum}}
            </td>
            <td>
              {{item.AreaName}}
            </td>
            <td class="text-nowrap">
              {{item.Contacts}}
            </td>
            <td class="text-nowrap">
              {{item.Phone}}
            </td>
            <td class="text-nowrap">
              {{item.Status}}
            </td>
            <td class="text-nowrap">
              {{item.DateAdded|datetime}}
            </td>
            <td>
              <div class="action-field">
                <a href="javascript:;" class="item" @click="match(item)">匹配</a>
                <!-- <a href="javascript:;" class="item" @click="del(item,index)">删除</a> -->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
        暂无相关数据
      </div>
      <div class="pageBox text-right"></div>
    </div>
    <div class="popup" v-if="isShowPop">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click()">&times;</a>求购信息匹配</h2>
        <div class="body " :class="getBuyInfo.Status!=1 ?'info-list':''">
          <div class="set">
            <p class="popupTitle">
              <span>求购信息</span>
            </p>
            <dl class="item">
              <dt class="title">求购标题：</dt>
              <dd class="content">{{getBuyInfo.Title}}</dd>
            </dl>

            <dl class="item">
              <dt class="title">求购分类：</dt>
              <dd class="content">{{getBuyInfo.CategoryName}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">求购数量：</dt>
              <dd class="content">{{getBuyInfo.WantBuyNum}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">求购图片：</dt>
              <dd class="content">
                 <img :src="item" alt="" v-for="item in picArray">
               </dd>
            </dl>
            </dl>
            <dl class="item">
              <dt class="title">求购备注：</dt>
              <dd class="content">{{getBuyInfo.Desc}}</dd>
            </dl>
            </dl>
            <dl class="item">
              <dt class="title">联系人：</dt>
              <dd class="content">{{getBuyInfo.Contacts}}</dd>
            </dl>
            </dl>
            <dl class="item">
              <dt class="title">手机号：</dt>
              <dd class="content">{{getBuyInfo.Phone}}</dd>
            </dl>
            </dl>
            <dl class="item">
              <dt class="title">所在地区：</dt>
              <dd class="content">{{getBuyInfo.AreaNames}}</dd>
            </dl>
            </dl>
            <dl class="item">
              <dt class="title">求购时间：</dt>
              <dd class="content">{{getBuyInfo.DateAdded}}</dd>
            </dl>
            <div class="hr-line"></div>
            <dl class="item">
              <dt class="title">信息状态：</dt>
              <dd class="content">
                <span v-if="getBuyInfo.Status === 1">
                  待审核
                </span>
                <span v-else-if="getBuyInfo.Status === 2">
                  匹配中
                </span>
                <span v-else-if="getBuyInfo.Status === 3" style="color:#0071b6">
                  匹配成功
                </span>
                <span v-else="getBuyInfo.Status === 4" style="color:#dc3500">
                  匹配失败
                </span>
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">审核备注：</dt>
              <dd class="content">
                <span v-if="getBuyInfo.Status === 1">
                  <textarea name="" id="" cols="50" rows="2" v-model="getBuyInfo.AuditingDesc"></textarea>
                </span>
                <span v-else class="shbz">
                  {{getBuyInfo.AuditingDesc}}
                </span>
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">审核人：</dt>
              <dd class="content">{{getBuyInfo.AuditingUserName}}</dd>
            </dl>
            <dl class="item">
              <dt class="title">审核时间：</dt>
              <dd class="content">{{getBuyInfo.AuditingTime}}</dd>
            </dl>
            <div class="item fr" v-if="getBuyInfo.Status === 1">
              <button class="btn btn-primary" @click="buyAuditing(getBuyInfo.Id,1)">审核通过</button>
              <button class="btn btn-default" @click="buyAuditing(getBuyInfo.Id,0)">审核拒绝</button>
            </div>

          </div>
          <div class="set" :class="getBuyInfo.Status==1 ?'disabled':''">
            <p class="popupTitle">
              <span>匹配信息</span>
            </p>
            <dl class="item">
              <dt class="title">公司名称：</dt>
              <dd class="content">
                <input type="text" class="com-ipt x-large" v-model="buyMatchInfo.CompanyName" data-validate="required">
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">匹配状态：</dt>
              <dd class="content">
                <div class="inline-radio">
                  <label class="radio">

                    <input type="radio" name="matchStatus" value="2" v-model="buyMatchInfo.MatchStatus">
                    <span class="icon"></span>匹配中</label>
                  <label class="radio">
                    <input type="radio" name="matchStatus" value="3" v-model="buyMatchInfo.MatchStatus">
                    <span class="icon"></span>匹配成功</label>
                    <label class="radio">
                    <input type="radio" name="matchStatus" value="4" v-model="buyMatchInfo.MatchStatus">
                    <span class="icon"></span>匹配失败</label>
                </div>
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">成交金额：</dt>
              <dd class="content">
                <input type="text" class="com-ipt x-large" v-model="buyMatchInfo.TransactionAmount" data-validate="required money">
              </dd>
            </dl>
            <dl class="item">
              <dt class="title">备注：</dt>
              <dd class="content">
                <textarea name="" id="" cols="52" rows="3" v-model="buyMatchInfo.MatchDesc"></textarea>
              </dd>
            </dl>
            <div class="item fr">
              <button class="btn btn-primary" @click="buyMatch(getBuyInfo.Id)">提交匹配信息</button>
            </div>
            <div class="times" v-if="getBuyInfo.Status!= 1">
             <p class="p_record" :class="{ on: isHidden }"> <a href="javascript:;" @click="togggle()">匹配记录</a>
             <span class="triggle" ></span> </p>
    <ul v-if="isHidden">
        <li v-for="item in getBuyInfo.MatchDetails"><b></b><span>
         </span>
          {{item.DateAdded}}</span><p> 
            <i v-if="item.MatchStatus=='3'">[匹配成功]</i>
           <i v-else-if="item.MatchStatus=='4'" style="color:#dc3500">[匹配失败]</i>
           <i v-else>[匹配中]</i>
           {{item.CompanyName}}|
        </p>
        <p >{{item.MatchDesc}}</p>
        </li>
    </ul> 
</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
/**
 * 基础设置-求购列表
 */
export default {
  data() {
    return {
      isShowPop: false,
      isHidden: false,
      dataIn: {
        inited: false,
        arrDataList: []
      },
      pageIndex: 1,
      dataOut: {
        search: {
          Key: "",
          tobuyStatusId: "",
          StartDate: "",
          EndDate: "",
          CategoryCode: ""
        }
      },
      getBuyInfo:  {},
      buyMatchInfo: {}
    };
  },
  components: {},
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 15;
      fetchData({
        API: "api/Misc/PGetWantBuyList",
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data.Data;
          initPage(
            this.$el,
            data.TotalPages,
            data.TotalRows,
            this.initPageData,
            pageIndex
          );
        }
      });
    },
    changeTime() {
      this.dataOut.search.StartDate = this.$refs.StartDate.value;
      this.dataOut.search.EndDate = this.$refs.EndDate.value;
    },
    match(item) {
      fetchData({
        API: "api/Misc/PGetWantBuyInfo",
        para: {
          Id: item.Id
        },
        callback: data => {
          this.getBuyInfo = data; 
          this.buyMatchInfo={};
        }
      });
      this.isShowPop = true;
    },
    del(item, index) {
      dialog({
        title: "删除",
        content: `确认删除“${item.Title}”？`,
        ok: () => {
          // fetchData({
          //   API: "/api/Goods/PlatformSpuDelete",
          //   para: {
          //     Id: item.Id
          //   },
          //   callback: data => {
          //     this.dataIn.arrDataList.splice(index, 1);
          //   }
          // });
        },
        cancel() {}
      }).showModal();
    },
    buyAuditing(id, itemIndex) {
      fetchData({
        API: "api/Misc/PWantBuyAuditing",
        para: {
          Id: id,
          AuditingStatus: itemIndex,
          AuditingDesc: this.getBuyInfo.AuditingDesc
        },
        callback: data => {
          console.log(data);
              this.isShowPop = false;
        }
      });
    },
    buyMatch(id) {
        if (!zmm_validator(this.$el)) {
        return;
      }

      let para=this.buyMatchInfo;
      para.id=id;
      fetchData({
        API: "api/Misc/PWantBuyMatch",
        para,
        callback: data => {
          console.log(data);
          this.isShowPop = false;
        }
      });
    },
    togggle(){
       this.isHidden=! this.isHidden
    },
    onCancel_Click() {
      this.isShowPop = false;
    }
  },
  computed:{
    picArray:function(){
      if(this.getBuyInfo.Images){
           return this.getBuyInfo.Images.split(',')
      }
}
  },
  created() {
    this.initPageData(1);
  }
};

</script>