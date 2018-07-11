<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <span class="fr">
          <a href="#/bc/cs/qqServiceHelp" class="highlight">客服使用说明</a>
          <a href="http://shang.qq.com/v3/widget.html" target="_blank" class="ml10 highlight">QQ推广设置</a>
        </span>
        <button class="btn btn-primary ml5" @click="edit('',0)">添加</button>
      </div>
      <table class="table table-bordered datalist table-hover">
        <thead>
          <tr>
            <th>QQ号码</th>
            <th>类型</th>
            <th style="width:180px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataIn.arrDataList">
            <td :title="item.Name">
              <i class="iconfont icon-qq" style="color:#00AFDF"></i> {{item.QQ}}
            </td>
            <td class="text-nowrap">
              {{item.CSTypeName}}
            </td>
            <td class="text-nowrap">
              <div class="action-field">
                <a href="javascript:;" class="item" @click="edit(item,1)">修改</a>
                <a href="javascript:;" class="item" @click="del(item)">删除</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="table-data-empty" v-show="dataIn.inited&&dataIn.arrDataList.length==0">
        暂无相关数据
      </div>
    </div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="cancelClick">&times;</a>QQ客服{{isEdit==1?'修改':'添加'}}</h2>
        <div class="body">
          <div class="content" style="width:400px">
            <div class="set w4em">
              <dl class="item">
                <dt class="title required-mark">QQ号</dt>
                <dd class="content">
                  <input type="search" placeholder="请输入QQ号" class="com-ipt large" v-model="objEditItem.QQ" maxlength="50" data-validate="required">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">类型</dt>
                <dd class="content">
                  <select class="com-ipt large" v-model="objEditItem.CSTypeName">
                    <option value="售前">售前</option>
                    <option value="售后">售后</option>
                  </select>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="submitClick">确定</button>
          <button class="btn btn-default" @click="cancelClick">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 基础设置-物流工具
 */
export default {
  data() {
    return {
      show: false,
      isEdit: 0,
      objEditItem: {},
      dataIn: {
        inited: false,
        arrDataList: []
      },

    }
  },
  components: {

  },
  methods: {
    initPageData() {
      let para = {};
      fetchData({
        API: '/api/Supplier/ShopCustomerServiceQQList',
        hideLoading: true,
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data;
        }
      })
    },
    edit(item, isEdit) {
      this.isEdit = isEdit;
      if (isEdit == 1) {
        this.objEditItem = JSON.parse(JSON.stringify(item));
      } else {
        this.objEditItem = {
          Id: 0,
          CSTypeName: '售前',
          QQ: '',
        }
      }
      this.show = true;
    },
    submitClick() {
      if (!zmm_validator(this.$el.querySelector('.popup'))) {
        return;
      }
      fetchData({
        API: '/api/Supplier/ShopCustomerServiceQQEdit',
        para: this.objEditItem,
        callback: () => {
          this.initPageData();
          this.cancelClick();
        }
      })
    },
    cancelClick() {
      this.show = false;
    },
    del(item) {
      dialog({
        title: '删除',
        content: `确认删除"${item.QQ}"？`,
        ok: () => {
          fetchData({
            API: '/api/Supplier/ShopCustomerServiceQQDelete',
            para: {
              Id: item.Id
            },
            callback: () => {
              this.initPageData();
            }
          })
        },
        cancel() {}
      }).showModal();
    }
  },
  created() {
    this.initPageData();
  }
}
</script>