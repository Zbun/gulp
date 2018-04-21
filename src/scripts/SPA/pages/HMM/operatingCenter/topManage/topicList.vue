<template>
  <div class="main">
    <div class="content-field  clearfix topList">
      <div class="data-content">
        <div class="clearfix align-btn">
          <div class="fr">
            <button class="btn btn-primary fr" @click="edit(0)">
              新增
            </button>
          </div>
          <span class="crumbs">
            <a href="javascript:;" @click="goArticle()"> 慧头条</a> > 栏目管理
          </span>
        </div>
        <table class="table table-bordered table-hover datalist">
          <thead>
            <tr>
              <th style="width:30px;">
                编号
              </th>
              <th style="width:100px;">
                项目名
              </th>
              <th style="width:30px;">
                项目值
              </th>
              <th style="width:130px;">
                排序
              </th>
              <th style="width:30px">
                备注
              </th>
              <th style="width:130px;">
                状态
              </th>
              <th style="width:160px;">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in dataIn.arrDataList">
              <td>
                {{item.Id}}
              </td>
              <td>
                {{item.SectionTitle}}
              </td>
              <td>
                {{item.SectionTitle2}}
              </td>
              <td>
                <a href="javascript:;" class="icon icon-up" @click="up(item, index)" :class="{disabled:index==0}"></a>
                <a href="javascript:;" class="icon icon-down" @click="down(item, index)" :class="{disabled:index+1==item.length}"></a>
              </td>
              <td>
                {{item.SectionDesc}}
              </td>
              <td>
                <label class="switcher">
                  {{item.SectionStatus}}
                  <!-- <input type="checkbox" v-model="item.SectionStatus" @change="enable($event,item)" checked> -->
                  <input type="checkbox" v-model="item.SectionStatus">
                  <span class="icon"></span>
                </label>
              </td>
              <td>
                <a href="javascript:;" class="item" @click="edit(1,item)">编辑</a>
                <a href="javascript:;" class="item" @click="del(item,index)">删除</a>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
          暂无相关数据
        </div>
      </div>
      <div class="popup" v-if="isShowPop">
        <div class="content">
          <h2 class="title">
            <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{isEdit==1?'编辑':'新增'}}栏目</h2>
          <div class="body">
            <div class="content" style="width:400px">
              <div class="set">
                <dl class="item">
                  <dt class="title text-muted required-mark">项目名</dt>
                  <dd class="content">
                    <div class="ipt-with-tips">
                      <input type="text" placeholder="输入名称" data-validate="required" class="com-ipt block" v-model="editItem.SectionTitle">
                    </div>
                  </dd>
                </dl>
                <dl class="item">
                  <dt class="title text-muted required-mark">项目值</dt>
                  <dd class="content">
                    <div class="ipt-with-tips">
                      <input type="text" placeholder="输入名称" data-validate="required" class="com-ipt block" v-model="editItem.SectionTitle2">
                    </div>
                  </dd>
                </dl>
                <!-- <dl class="item">
                <dt class="title text-muted required-mark">状态</dt>
                <dd class="content">
                  <div class="ipt-with-tips">
                      <div class="inline-radio">
              <label class="radio">
               
                <input type="radio" name="sex" value="1"  v-model="editItem.SectionStatus" >
                <span class="icon"></span>启用</label>
              <label class="radio">
                <input type="radio" name="sex" value="0" v-model="editItem.SectionStatus">
                <span class="icon"></span>禁用</label>
            </div>
                  </div>
                </dd>
              </dl> -->
                <dl class="item">
                  <dt class="title text-muted">
                    标签备注
                  </dt>
                  <dd class="content">
                    <textarea name="" v-model="editItem.SectionDesc" class="com-ipt block" palceholder="输入备注" rows="5"></textarea>
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
  </div>
</template>
<script>
/**
 * 基础设置-品类管理
 */
export default {
  data() {
    return {
      isShowPop: false,
      dataIn: {
        inited: false,
        arrDataList: []
      },
      dataOut: {
        search: {
          Key: "",
          StartDate: "",
          EndDate: ""
        }
      },
      isEdit: 0,
      curItem: {
        Id: "",
        SectionTitle: ""
      },
      editItem: {}
    };
  },
  components: {},
  methods: {
    initPageData() {
      fetchData({
        API: "api/Misc/GetArticleSectionList",
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data;
        }
      });
    },
    del(item, index) {
      console.log(item);
      dialog({
        title: "删除",
        content: `确认删除“${item.SectionTitle}”？`,
        ok: () => {
          fetchData({
            API: "api/Misc/ArticleSectionDelete",
            para: {
              Id: item.Id
            },
            callback: data => {
              this.dataIn.arrDataList.splice(index, 1);
            }
          });
        },
        cancel() {}
      }).showModal();
    },
    edit(i, item) {
      //i为1时编辑，0时添加
      this.isEdit = i;

      if (i == 1) {
        this.editItem = Object.assign({}, item);
        this.curItem = item;
      } else {
        this.editItem = {
          Id: "",
          SectionTitle: ""
        };
      }
      this.isShowPop = true;
    },
    enable(e, item) {
      let isChked = e.target.checked;
      fetchData({
        API: "api/Misc/ArticleSectionStatus",
        para: {
          Id: item.Id,
          SectionStatus: isChked - 0
        },
        callback: data => {
          item.SectionStatus = isChked;
        }
      });
    },
    up(item, index) {
      fetchData({
        API: "api/Misc/ArticleSectionWeightUP",
        para: {
          Id: item.Id
        },
        callback: data => {
          let arrTemp = this.dataIn.arrDataList.splice(index - 1, 1);
          this.dataIn.arrDataList.splice(index, 0, arrTemp[0]);
        }
      });
    },
    down(item, index) {
      fetchData({
        API: "api/Misc/ArticleSectionWeightUP",
        para: {
          Id: item.Id
        },
        callback: data => {
          this.dataIn.arrDataList.splice(index, 1);
          this.dataIn.arrDataList.splice(index + 1, 0, item);
        }
      });
    },
    onSubmit_Click() {
      if (!zmm_validator(this.$el.querySelector(".popup"))) {
        return;
      }
      let para = this.editItem;
      if (this.isEdit == 1) {
        //1:编辑
      } else {
        para.Id = "0";
      }
      fetchData({
        api: "api/Misc/ArticleSectionEdit",
        para,
        callback: data => {
          if (this.isEdit == 1) {
            for (var key in this.editItem) {
              this.curItem[key] = this.editItem[key];
            }
          } else {
            this.dataIn.arrDataList.unshift(data);
          }
          this.onCancel_Click();
        }
      });
      // this.$nextTick(function() {
      //    this.$router.push('topicList')
      // })
    },
    onCancel_Click() {
      this.isShowPop = false;
    },
    goArticle() {
      this.$router.push("topList");
    }
  },
  watch: {
    "dataIn.arrDataList.SectionStatus": function(val) {
      console.log(val);
    }
  },
  created() {
    this.initPageData();
  }
};
</script>