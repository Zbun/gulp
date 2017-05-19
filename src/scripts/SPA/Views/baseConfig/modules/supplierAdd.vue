<template>
  <div class="main" v-cloak>
    <h1 class="content-title" v-if="sid.length>0">
      <div class="action">
        <a href="javascript:history.go(-1)" class="item">返回</a>
      </div>
      编辑供应商
    </h1>
    <div :class="{'content-field':sid.length>0}">
      <div class="content-small border-box">
        <div class="set w6em">
          <dl class="item">
            <dt class="title required-mark">
              供应商名称
            </dt>
            <dd class="content">
              <input class="com-ipt large" data-validate="required" type="text" maxlength="100" placeholder="请输入供应商名称" v-model="editInfo.Name">
            </dd>
          </dl>
          <dl class="item">
            <dt class="title required-mark">
              区域
            </dt>
            <dd class="content area-box">
              <input class="com-ipt large area" data-validate="required" type="text" maxlength="100" placeholder="请选择" v-model="editInfo.Area">
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
              电话
            </dt>
            <dd class="content">
              <input class="com-ipt large" data-validate="required phone" type="text" maxlength="11" placeholder="请输入电话号码" v-model="editInfo.Phone">
            </dd>
          </dl>
        </div>
      </div>
      <p class="text-center mb10">
        <button class="btn btn-primary big" @click="save_Click()">提交</button>
      </p>
    </div>
  </div>
</template>
<script>
/**
 * 供应商添加编辑
 * zhao.liubin@zol.com.cn
 * 2016-12-13
 */

export default {
  data() {
      return {
        APIS: {
          INSERT: '/Api/Misc/supplierInsert', //默认添加新数据
          PREVIEW: '/Api/Misc/supplierPreview', //编辑时读取数据
          UPDATE: '/Api/Misc/supplierUpdate', //编辑更新时接口
        },
        curAPI: '',
        dataIn: {},
        sid: '', //编辑时，用户ID
        editInfo: {
          Name: '',
          Phone: '',
          Address: '',
          Area: '',
          Contact: ''
        }
      }
    },
    components: {

    },
    computed: {

    },
    methods: {
      initPageData() {
        this.sid = this.$route.params.sid || '';
        var me = this;
        this.curAPI = this.APIS.INSERT;
        if (this.sid) {
          fetchData({
            API: this.APIS.PREVIEW,
            para: {
              id: this.sid
            },
            callback(data) {
              // console.log(data);
              me.curAPI = me.APIS.UPDATE;
              me.editInfo = data;
              setTimeout(me.initAreaSelector, 10);
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
        setTimeout(this.initAreaSelector, 10);
      },
      initAreaSelector() {
        this.$el && areaSelector(this.$el.querySelector('.area'));
      },
      save_Click(v) {
        let me = this;
        var para = this.editInfo;
        if (!zmm_validator(this.$el)) {
          return;
        }
        // console.log(para)

        fetchData({
          API: this.curAPI,
          para,
          callback(data) {
            if (!/update/i.test(me.API)) {
              me.$dispatch('on-added-ok');
              me.initData();
            }
            me.$router.go({
              name: 'supplierMNG',
              params: {
                bsTabIndex: 1
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
