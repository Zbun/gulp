<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <button class="btn btn-primary fr" @click="edit(0)">新增</button>
        <input type="search" placeholder="输入关键字" class="com-ipt ipt-search" v-model="dataOut.search.Key" @keydown.enter="initPageData(1)">
        <!-- <date-picker :data-out.sync="dataOut.search"></date-picker> -->
        <button class="btn btn-primary btn-search ml5" @click="initPageData(1)">搜索</button>
      </div>
      <table class="table table-bordered datalist table-hover">
        <thead>
          <tr>
            <th style="width:160px;">标签ID</th>
            <th>标签名称</th>
            <th style="width:180px;">关联商品的数量</th>
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
              {{item.LabelName}}
            </td>
            <td class="text-nowrap">
              {{item.SkuCount}}
            </td>
            <td class="text-nowrap">
              {{item.DateAdded|datetime}}
            </td>
            <td>
              <div class="action-field">
                <a href="javascript:;" class="item" @click="edit(1,item)">编辑</a>
                <a href="javascript:;" class="item" @click="checkGoods(item)">查看商品详情</a>
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
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{isEdit==1?'编辑':'新增'}}</h2>
        <div class="body">
          <div class="content" style="width:400px">
            <div class="set">
              <dl class="item">
                <dt class="title text-muted required-mark">标签名称</dt>
                <dd class="content">
                  <div class="ipt-with-tips">
                    <input type="text" placeholder="输入名称" data-validate="required" class="com-ipt block" v-model="editItem.LabelName">
                    <span class="tooltips-i tooltips-t">
                    <a class="icon icon-tips" href="javascript:;">!</a>
                    <span class="txt">
                      建议标签只填写5个中文。
                    </span>
                    </span>
                  </div>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title text-muted">
                  标签备注
                </dt>
                <dd class="content">
                  <textarea name="" v-model="editItem.Description" class="com-ipt block" palceholder="输入备注" rows="5"></textarea>
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
          Key: '',
          StartDate: '',
          EndDate: '',
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
  components: {},
  methods: {
    initPageData(pageIndex) {
      let para = this.dataOut.search;
      para.pageIndex = pageIndex = pageIndex || 1;
      para.pageSize = 15;
      fetchData({
        API: '/api/Goods/GetGoodsLabelListAndSkuCount',
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
        content: `确认删除“${item.LabelName}”？`,
        ok: () => {
          fetchData({
            API: '/api/Goods/GoodsLabelDelete',
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
          Id: '',
          LabelName: '',
        };
      }
      this.isShowPop = true;
    },
    checkGoods(item) {
      alert('稍候实现');
    },
    onSubmit_Click() {
      if (!zmm_validator(this.$el.querySelector('.popup'))) {
        return;
      }
      let para = this.editItem;
      if (this.isEdit == 1) { //编辑
        fetchData({
          api: 'api/Goods/GoodsLabelUpdate',
          para,
          callback: () => {
            this.onCancel_Click();
            for (var key in this.editItem) {
              this.curItem[key] = this.editItem[key];
            }
          }
        })
      } else {
        fetchData({
          API: '/api/Goods/GoodsLabelAdd',
          para,
          callback: data => {
            this.onCancel_Click();
            this.dataIn.arrDataList.unshift(data);
          }
        })
      }
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