<template>
  <div class="main">
    <div class="content-field  clearfix">
      <div class="search-box clearfix">
        <button class="btn btn-primary fr" @click="edit(0)">新增</button>
        <input type="text" placeholder="输入关键字" class="com-ipt ipt-search" v-model="dataOut.search.BrandName" @keydown.enter="initPageData">
        <button class="btn btn-primary btn-search" @click="initPageData">搜索</button>
      </div>
      <table class="table table-bordered datalist table-hover">
        <thead>
          <tr>
            <th style="width:130px;">品牌编码</th>
            <th>品牌名称</th>
            <th style="width:130px;">品牌字母</th>
            <th style="width:130px;">logo图片</th>
            <th style="width:130px;">添加日期</th>
            <th style="width:130px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in dataIn.arrDataList">
            <td class="text-nowrap">
              {{item.Id}}
            </td>
            <td>
              {{item.BrandName}}
            </td>
            <td>
              {{item.FirstLetter}}
            </td>
            <td>
              <img :src="item.Logo" alt="">
            </td>
            <td class="text-nowrap">
              {{item.DateAdded|datetime}}
            </td>
            <td>
              <div class="action-field">
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
    </div>
    <div class="popup" v-show="isShowPop">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>{{isEdit==1?'编辑':'新增'}}</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <div class="set">
              <dl class="item">
                <dt class="title text-muted required-mark">品牌名称</dt>
                <dd class="content">
                  <input type="text" placeholder="输入名称" data-validate="required" class="com-ipt large" v-model="editItem.BrandName">
                </dd>
              </dl>
              <dl class="item">
                <dt class="title text-muted">
                  简拼首字母
                </dt>
                <dd class="content">
                  <select v-model="editItem.FirstLetter" class="com-ipt large">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                    <option value="H">H</option>
                    <option value="I">I</option>
                    <option value="J">J</option>
                    <option value="K">K</option>
                    <option value="L">L</option>
                    <option value="M">M</option>
                    <option value="N">N</option>
                    <option value="O">O</option>
                    <option value="P">P</option>
                    <option value="Q">Q</option>
                    <option value="R">R</option>
                    <option value="S">S</option>
                    <option value="T">T</option>
                    <option value="U">U</option>
                    <option value="V">V</option>
                    <option value="W">W</option>
                    <option value="X">X</option>
                    <option value="Y">Y</option>
                    <option value="Z">Z</option>
                  </select>
                </dd>
              </dl>
              <dl class="item">
                <dt class="title text-muted">
                  品牌标志
                </dt>
                <dd class="content">
                  <upload-file @upload-ok="uploadOk" v-if="!editItem.Logo"></upload-file>
                  <ul class="upload-img-list" v-else>
                    <li class="item">
                      <sup class="del" @click="delLogo"></sup>
                      <img :src="editItem.Logo" alt="">
                    </li>
                  </ul>
                  <p class="text-muted">
                    图片宽高为122 X 42像素，仅支持jpg、jpeg、gif、png，文件小于10M。
                  </p>
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
import uploadFile from 'vues/components/uploadFile.vue';
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
          BrandName: '',
        }
      },
      isEdit: 0,
      curItem: {
        Id: '',
        FirstLetter: 'A',
        BrandName: '',
        Logo: ''
      },
      editItem: {}
    }
  },
  components: { uploadFile },
  methods: {
    initPageData() {
      let para = this.dataOut.search;
      fetchData({
        API: '/api/Goods/GetAllBrandList',
        para,
        callback: data => {
          this.dataIn.inited = true;
          this.dataIn.arrDataList = data;
        }
      })
    },
    del(item, index) {
      dialog({
        title: '删除',
        content: `确认删除“${item.BrandName}”？`,
        ok: () => {
          fetchData({
            API: '/api/Goods/BrandDelete',
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
          FirstLetter: 'A',
          BrandName: '',
          Logo: ''
        };
      }
      this.isShowPop = true;
    },
    uploadOk(data) {
      this.editItem.Logo = data.Data;
    },
    delLogo() {
      this.editItem.Logo = '';
    },
    onSubmit_Click() {
      if (!zmm_validator(this.$el.querySelector('.popup'))) {
        return;
      }
      let para = this.editItem;
      if (this.isEdit == 1) { //编辑
        fetchData({
          api: 'api/Goods/BrandModify',
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
          API: '/api/Goods/BrandAdd',
          para,
          callback: data => {
            this.onCancel_Click();
            this.dataIn.arrDataList.push(data);
          }
        })
      }
    },
    onCancel_Click() {
      this.isShowPop = false;
    }
  },
  created() {
    this.initPageData();

  }
}
</script>