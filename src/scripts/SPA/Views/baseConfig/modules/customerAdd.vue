<template>
  <div class="main" v-cloak>
    <div class="content-title" v-if="cid.length>0">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div>
      编辑客户
    </div>
    <div :class="{'content-field':cid.length>0}">
      <div class="content-small border-box">
        <div class="set">
          <dl class="item">
            <dt class="title required-mark">
              客户名称
            </dt>
            <dd class="content" :class="{disabled:dataIn.isFrom2B}">
              <input class="com-ipt large" data-validate="required" type="text" maxlength="100" placeholder="请输入客户名称" v-model="editInfo.Name">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title required-mark">
              所属机构
            </dt>
            <dd class="content">
              <select v-model="editInfo.BranchId">
                <option v-for="item in dataIn.arrBranch" :value="item.Id">
                  {{item.Name}}
                </option>
              </select>
            </dd>
          </dl>
          <dl class="item area-box">
            <dt class="title required-mark">
              区域
            </dt>
            <dd class="content area-box" :class="{disabled:dataIn.isFrom2B}">
              <input class="com-ipt large area" data-validate="required" type="text" maxlength="100" placeholder="请选择" v-model="editInfo.Area">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title required-mark">
              地址
            </dt>
            <dd class="content" :class="{disabled:dataIn.isFrom2B}">
              <input class="com-ipt large" data-validate="required  down" type="text" maxlength="100" style="width:100%" placeholder="请输入地址" v-model="editInfo.Address">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title required-mark">
              联系人
            </dt>
            <dd class="content" :class="{disabled:dataIn.isFrom2B}">
              <input class="com-ipt large" data-validate="required" type="text" maxlength="100" placeholder="请输入联系人" v-model="editInfo.Contact">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title required-mark">
              电话
            </dt>
            <dd class="content" :class="{disabled:dataIn.isFrom2B}">
              <input class="com-ipt large" data-validate="required phone" type="text" maxlength="11" placeholder="请输入电话号码" v-model="editInfo.Phone">
            </dd>
          </dl>
        </div>
      </div>
      <p class="text-center mb10">
        <button class="btn btn-primary big" @click="save_Click($event)">提交</button>
      </p>
    </div>
  </div>
</template>
<script>
/**
 * 客户添加编辑
 * zhao.liubin@zol.com.cn
 * 2016-12-13
 */

export default {
  data() {
      return {
        APIS: {
          INSERT: '/Api/Misc/CustInsert', //默认添加新数据
          PREVIEW: '/Api/Misc/CustPreview', //编辑时读取数据
          UPDATE: '/Api/Misc/CustUpdate', //编辑更新时接口
        },
        curAPI: '',
        dataIn: {
          isFrom2B: false,
          arrBranch: []
        },
        cid: '', //编辑时，用户ID
        editInfo: {
          Name: '',
          Phone: '',
          Address: '',
          Area: '',
          Contact: '',
          BranchId: ''
        }
      }
    },
    components: {

    },
    computed: {

    },
    methods: {
      initPageData() {
        this.cid = this.$route.params.cid || '';
        var me = this;
        this.curAPI = this.APIS.INSERT;
        if (this.cid) {
          fetchData({
            API: this.APIS.PREVIEW,
            para: {
              id: this.cid
            },
            callback(data) {
              // console.log(data);
              me.curAPI = me.APIS.UPDATE;
              me.editInfo = data;
              me.dataIn.isFrom2B = data.Source == 1;
              setTimeout(me.initAreaSelector, 10);
            }
          })
        } else {
          this.initData();
        }
      },
      //添加成功后初始数据
      initData() {
        this.editInfo.Name = '';
        this.editInfo.Contact = '';
        this.editInfo.Phone = '';
        this.editInfo.Address = '';
        this.editInfo.Area = '';
        setTimeout(this.initAreaSelector, 10);
      },
      //初始化区域选择
      initAreaSelector() {
        this.$el && areaSelector(this.$el.querySelector('.area'));
      },
      // 机构获取
      getBranch() {
        let me = this;
        fetchData({
          API: 'api/USER/STORE',
          callback(data) {
            me.dataIn.arrBranch = data;
            if (!me.cid) {
              me.editInfo.BranchId = data[0].Id;
            }
          }
        })
      },
      save_Click(e) {
        let me = this;
        var para = this.editInfo;
        if (!zmm_validator(this.$el)) {
          return;
        }
        // console.log(para)

        fetchData({
          API: this.curAPI,
          target: e.target,
          para,
          callback(data) {
            if (!/update/i.test(me.API)) {
              me.$dispatch('on-added-ok');
              me.initData();
            }
            me.$router.go({
              name: 'customerMNG',
              params: {
                bcTabIndex: 1
              }
            })
          }
        })
      }
    },
    ready() {
      this.initPageData();

      this.getBranch();
    }
}
</script>
