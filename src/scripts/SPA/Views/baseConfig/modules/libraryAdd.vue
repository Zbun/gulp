<template>
  <div class="main" v-cloak>
    <h1 class="content-title" v-if="lId.length>0">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div>
      编辑分仓
    </h1>
    <div :class="{'content-field':lId.length>0}">
      <div class="content-small border-box">
        <div class="set ">
          <dl class="item">
            <dt class="title required-mark">
              名称
            </dt>
            <dd class="content">
              <input class="com-ipt large" data-validate="required" type="text" maxlength="100" placeholder="请输入仓库名称" v-model="editInfo.Name">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title required-mark">
              区域
            </dt>
            <dd class="content area-box">
              <input class="com-ipt area" data-validate="required  " type="text" maxlength="100" placeholder="请输入区域" v-model="editInfo.Area">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title required-mark">
              地址
            </dt>
            <dd class="content">
              <input class="com-ipt large" data-validate="required  down" type="text" maxlength="100" style="width:100%" placeholder="请输入地址" v-model="editInfo.Address">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title required-mark">
              联系人
            </dt>
            <dd class="content">
              <input class="com-ipt large" data-validate="required" type="text" maxlength="100" placeholder="请输入联系人" v-model="editInfo.Contact">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title required-mark">
              身份证
            </dt>
            <dd class="content">
              <input class="com-ipt large" data-validate="required" type="text" maxlength="18" placeholder="请输入身份证号" v-model="editInfo.ContactCard">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title">
              电话
            </dt>
            <dd class="content">
              <input class="com-ipt large" data-validate="phone" type="text" maxlength="11" placeholder="请输入电话号码" v-model="editInfo.Phone">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title">
              邮编
            </dt>
            <dd class="content">
              <input class="com-ipt large" type="text" maxlength="10" placeholder="请输入邮编" v-model="editInfo.Zip">
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
          INSERT: '/Api/Misc/StoreInsert', //默认添加新数据
          PREVIEW: '/Api/Misc/StorePreview', //编辑时读取数据
          UPDATE: '/Api/Misc/StoreUpdate', //编辑更新时接口
        },
        curAPI: '',
        dataIn: {},
        lId: '', //编辑时，用户ID
        editInfo: {
          Name: '',
          Phone: '',
          Address: '',
          Area: '',
          Contact: '',
          ContactCard: '',
          Zip: '',
        }
      }
    },
    components: {

    },
    computed: {

    },
    methods: {
      initPageData() {
        this.lId = this.$route.params.lId || '';
        var me = this;
        this.curAPI = this.APIS.INSERT;
        if (this.lId) {
          fetchData({
            API: this.APIS.PREVIEW,
            para: {
              id: this.lId
            },
            callback(data) {
              // console.log(data);
              me.curAPI = me.APIS.UPDATE;
              me.editInfo = data;
              me.initAreaSelector();
            }
          })
        } else {
          this.initData();
        }
      },
      //初始化清空输入框
      initData() {
        this.editInfo.Name = '';
        this.editInfo.Contact = '';
        this.editInfo.ContactCard = '';
        this.editInfo.Zip = '';
        this.editInfo.Phone = '';
        this.editInfo.Address = '';
        this.editInfo.Area = '';
        this.initAreaSelector();
      },
      //
      initAreaSelector() {
        let me = this;
        setTimeout(function() {
          me.$el && areaSelector(me.$el.querySelector('.area'));
        }, 10);
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
              name: 'libraryMNG',
              params: {
                blTabIndex: 1
              }
            })
          }
        })
      }
    },
    ready() {
      this.initPageData();
    }
}
</script>
