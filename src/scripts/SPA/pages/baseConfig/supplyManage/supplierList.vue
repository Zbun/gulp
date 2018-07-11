<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <button class="btn btn-primary fr" @click="edit(0)">新增</button>
        <input type="search" placeholder="输入供应商名称" class="com-ipt ipt-search" v-model="dataOut.search.KeyName" @keydown.enter="initPageData(1)">
        <input type="search" placeholder="主营品牌" class="com-ipt ipt-search ml5" v-model="dataOut.search.KeyBrand" @keydown.enter="initPageData(1)">
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table table-bordered datalist table-hover">
        <thead>
          <tr>
            <th>供应商名称</th>
            <th style="width:160px">联系人</th>
            <th style="width:160px;">联系电话</th>
            <th style="width:160px;">主营系列</th>
            <th style="width:160px;">主营品牌</th>
            <th style="width:160px;">关联仓库数</th>
            <th style="width:160px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in dataIn.arrDataList">
            <td>
              {{item.Name}}
            </td>
            <td class="text-nowrap">
              {{item.Contacts}}
            </td>
            <td class="text-nowrap">
              {{item.Phone}}
            </td>
            <td>
              {{item.MajorCategory}}
            </td>
            <td>
              {{item.MajorBrand}}
            </td>
            <td class="text-nowrap">
              {{item.StoreCount}}
            </td>
            <td>
              <div class="action-field">
                <a href="javascript:;" class="item" @click="checkGoods(item)">详情</a>
                <a href="javascript:;" class="item" @click="edit(1,item)">编辑</a>
                <a href="javascript:;" class="item" @click="del(item,index)">删除</a>
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
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{isEdit==1?'编辑':'新增'}}供应商</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <div class="set w6em">
              <dl class="item">
                <dt class="title required-mark">供应商名称</dt>
                <dd class="content">
                  <div class="ipt-with-tips">
                    <input type="text" placeholder="请输入供应商名称" maxlength="50" data-validate="required" class="com-ipt x-large" v-model="editItem.Name">
                  </div>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  主营分类
                </dt>
                <dd class="content">
                  <input type="text" placeholder="请输入主营分类" class="com-ipt x-large" v-model="editItem.MajorCategory">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  主营品牌
                </dt>
                <dd class="content">
                  <input type="text" placeholder="请输入主营品牌" class="com-ipt x-large" v-model="editItem.MajorBrand">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  联系人
                </dt>
                <dd class="content">
                  <input type="text" placeholder="请输入联系人" class="com-ipt x-large" v-model="editItem.Contacts">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  联系电话
                </dt>
                <dd class="content">
                  <input type="text" placeholder="请输入联系电话" data-validate="phone" class="com-ipt x-large" v-model="editItem.Phone">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  联系邮箱
                </dt>
                <dd class="content">
                  <input type="text" placeholder="请输入联系邮箱" data-validate="email" class="com-ipt x-large" v-model="editItem.Email">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  区域
                </dt>
                <dd class="content">
                  <area-box :area-codes="editItem.AreaCode1+','+editItem.AreaCode2+','+editItem.AreaCode3+','+editItem.AreaCode4" :area-code.sync="editItem.AreaCode4"></area-box>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  详细地址
                </dt>
                <dd class="content">
                  <input type="text" placeholder="请输入详细地址" class="com-ipt block" v-model="editItem.Address">
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
    <div class="popup" v-if="isShowPreview">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_preview_Click">&times;</a>查看供应商</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <div class="set w6em thin">
              <dl class="item">
                <dt class="title">供应商名称：</dt>
                <dd class="content">
                  <div class="ipt-with-tips">
                    {{editItem.Name}}
                  </div>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  主营分类：
                </dt>
                <dd class="content">
                  {{editItem.MajorCategory}}
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  主营品牌：
                </dt>
                <dd class="content">
                  {{editItem.MajorBrand}}
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  联系人：
                </dt>
                <dd class="content">
                  {{editItem.Contacts}}
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  联系电话：
                </dt>
                <dd class="content">
                  {{editItem.Phone}}
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  联系邮箱：
                </dt>
                <dd class="content">
                  {{editItem.Email}}
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  区域：
                </dt>
                <dd class="content">
                  {{editItem.AreaName1}}-{{editItem.AreaName2}}-{{editItem.AreaName3}}-{{editItem.AreaName4}}
                </dd>
              </dl>
              <dl class="item">
                <dt class="title">
                  详细地址：
                </dt>
                <dd class="content">
                  {{editItem.Address}}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 供应管理--供应商列表
 */
import areaBox from 'vues/components/areaBox.vue';
export default {
  data() {
    return {
      isShowPop: false,
      isShowPreview: false,
      pageIndex: 1,
      dataIn: {
        inited: false,
        arrDataList: []
      },
      dataOut: {
        search: {
          KeyName: '', //供应商
          KeyBrand: '', //主营品牌
        }
      },
      isEdit: 0,
      curItem: {
        Id: '',
        LabelName: '',
      },
      editItem: {}
    }
  },
  components: {
    areaBox
  },
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = this.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 10;
      fetchData({
        API: '/api/Supplier/GetSupplierCompanyList',
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data.Data;
          initPage(this.$el, data.TotalPages, data.TotalRows, this.initPageData, pageIndex);
        }
      })
    },
    del(item, index) {
      dialog({
        title: '删除',
        content: `确认删除“${item.Name}”？`,
        ok: () => {
          fetchData({
            API: '/api/Supplier/SupplierCompanyDelete',
            para: {
              Id: item.Id
            },
            callback: data => {
              this.dataIn.arrDataList.splice(index, 1);
            }
          })
        },
        cancel() {

        }
      }).showModal();
    },
    edit(i, item) { //i为1时编辑，0时添加
      this.isEdit = i;
      if (i == 1) {
        this.editItem = Object.assign({}, item);
        this.curItem = item;
      } else {
        this.editItem = {
          Id: 0,
        };
      }
      this.isShowPop = true;
    },
    checkGoods(item) {
      this.editItem = Object.assign({}, item);
      this.isShowPreview = true;
    },
    onCancel_preview_Click() {
      this.isShowPreview = false;
    },
    onSubmit_Click() {
      if (!zmm_validator(this.$el.querySelector('.popup'))) {
        return;
      }
      let para = this.editItem;

      fetchData({
        api: '/api/Supplier/SupplierCompanyEdit',
        para,
        callback: (data) => {
          this.onCancel_Click();
          this.initPageData(this.pageIndex);
        }
      })

    },
    onCancel_Click() {
      this.isShowPop = false;
    }
  },
  created() {
    this.initPageData(1);

  }
}
</script>