<template>
  <div class="main">
    <h2 class="content-title">串号对比</h2>
    <div class="content-field">
      <div class="search clearfix mt20">
        <span class="radio-switcher">
          <label class="radio" :class="{on:SNType==0}">
          <input type="radio" name="type" value=0 v-model="SNType"><span class="icon"></span>库存数据
        </label>
        <label class="radio" :class="{on:SNType==1}">
          <input type="radio" name="type" value=1 v-model="SNType"><span class="icon"></span>渠道数据</label>
        </span>
        <span v-show="1==SNType">
             <span class="ml20">
          <span class="mr5 required-mark">区域</span>
        <select v-model="dataOut.search.Area" @change="area_Change()">
          <option value="">请选择</option>
          <option :value="item.Code" v-for="item in dataIn.arrAreaList">{{item.Name}}</option>
        </select>
        </span>
        <span class="ml20">
          <span class="mr5 required-mark">客户</span>
        <span class="intelligent-match">
          <span class="">
                <input type="search" class="select-long" placeholder="输入关键字，点击选择" v-model="intelligentMatch.customerName" @focus="IMIptFocus()" @input="IMIptInput()">
              </span>
        <ul class="list" v-show="intelligentMatch.isShow&&computedFilterCustomerInfo.length>0">
          <li class="item" v-for="item in computedFilterCustomerInfo" @click="selectedThisCustomerId(item)">{{item.Name}}</li>
        </ul>
        </span>
        </span>
        </span>
        <span v-else>
                 <span class="mr5 ml20">机构</span>
        <select class="com-ipt" @change="branch_Change()" v-model="dataOut.search.BranchId">
          <option v-for="item of dataIn.arrBranch" :value="item.Id">
            {{item.Name}}
          </option>
        </select>
        <span class="ml20 mr5">仓库</span>
        <select class="com-ipt" v-model="dataOut.search.StoreId">
          <option value="">请选择</option>
          <option :value="item.Id" v-for="item in computedStoresOfBranch">
            {{item.Name}}
          </option>
        </select>
        </span>
        <span class="ml20">
          <span class="mr5">分类</span>
        <select v-model="dataOut.search.Category">
          <option value="">请选择</option>
          <option v-for="item in dataIn.arrCategoryList" :value="item.Category">{{item.CategoryName}}</option>
        </select>
        </span>
        <span class="ml20">
          <span class="mr5">商品名称</span>
        <input type="search" class="com-ipt" placeholder="输入关键字" v-model="dataOut.search.ProName" @keydown.enter="initPageData()" maxlength="50">
        </span>
        <button class="btn btn-primary ml10" @click="initPageData()">搜索</button>
        <input type="file" class="hidden import-sn">
      </div>
      <section class="sn-compare-wrapper">
        <table class="table table-bordered table-fixed text-center datalist">
          <thead>
            <th class="clearfix color-light text-left" colspan="2">
              <span class="fr mr5">
                <span class="text-warning mr10" v-show="isImportOk">
                  导入成功！
                </span>
              <a href="/dist/files/SN_TEMPLATE.xlsx" class="highlight mr10" v-show="!isImportOk">下载模板</a>
              <button class="btn btn-default btn-import" :class="{'btn-disabled':!dataIn.inited||0==dataIn.objDataList.Details.length}" @click="import_Click()">导入串号</button>
              <button class="btn btn-warning" :class="{'btn-disabled':!isImportOk}" @click="initPageData(1)">
                开始对比
              </button>
              </span>
              <span class="ml10 dis-inline-block mt5">
                <b>对比结果：</b>原数据 <span class="text-warning">{{dataIn.objDataList.ImeiCount||0}}</span> 个，对比数据 <span class="text-warning">{{dataIn.objDataList.ImeiCount1||0}}</span> 个，正常 <span class="text-warning">{{dataIn.objDataList.ImeiRight||0}}</span> 个，异常 <span class="text-warning">{{dataIn.objDataList.ImeiErr||0}}</span> 个
              </span>
            </th>
          </thead>
          <thead>
            <th style="width:50%;"><b>
              原数据
            </b></th>
            <th style="border-left:0">
              <b>对比数据</b>
            </th>
          </thead>
        </table>
        <table class="table table-bordered table-fixed text-center">
          <thead>
            <th style="width:5%">
              序号
            </th>
            <th style="width:12%">
              串号
            </th>
            <th style="width:17%">
              商品名称
            </th>
            <th style="width:8%">
              分仓
            </th>
            <th style="width:8%">
              客户
            </th>
            <th class="" style="width:16%">
              串号
            </th>
            <th style="width:18%">
              商品名称
            </th>
            <th style="width:8%">
              分仓
            </th>
            <th style="width:8%">
              客户
            </th>
          </thead>
          <tbody :class="{'sn-result':isCompared}">
            <tr v-for="item of dataIn.objDataList.Details" :class="{'sn-result-ok':item.Result==1}">
              <td class="color-odd">
                {{$index+1}}
              </td>
              <td class="color-odd">
                <p :title="item.Imei">{{item.Imei}}</p>
              </td>
              <td>
                <p :title="item.ProName"> {{item.ProName}}</p>
              </td>
              <td>
                <p :title="item.StoreName">{{item.StoreName}}</p>
              </td>
              <td>
                <p :title="item.Customer">{{item.Customer}}</p>
              </td>
              <td class="color-odd ">
                <p :title="item.Imei1">{{item.Imei1}} <i class="icon"></i></p>
              </td>
              <td>
                <p :title="item.ProName1">{{item.ProName1}}</p>
              </td>
              <td>
                <p :title="item.StoreName1">{{item.StoreName1}}</p>
              </td>
              <td>
                <p :title="item.Customer1">{{item.Customer1}}</p>
              </td>
            </tr>
          </tbody>
          <tbody v-show="dataIn.objDataList.Details==undefined||0==dataIn.objDataList.Details.length">
            <tr v-for="i in 10">
              <td class="color-odd">{{i+1}}</td>
              <td class="color-odd"></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="color-odd "></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div class="sn-gap"></div>
      </section>
    </div>
  </div>
</template>
<script>
import formDataUpload from 'commonScripts/formDataUpload.js';
export default {
  data() {
      return {
        isImportOk: false,
        isCompared: false,
        SNType: 0,
        dataIn: {
          inited: false,
          SERVER: localStorage.APIServer || window.APISERVER,
          arrStores: [],
          arrCategoryList: [],
          arrDataTable: [],
          objDataList: {},
          customerList: [],
          arrCustomerList: [],
          arrAreaList: [],
          arrBranch: []
        },
        intelligentMatch: {
          isShow: false,
          customerName: ''
        },
        dataOut: {
          search: {
            Category: '',
            BranchId: '',
            StoreId: '',
            Files: '',
            CustomerId: 0,
            Area: '',
            ProName: '',
          }
        }
      }
    },
    components: {},
    computed: {
      computedFilterCustomerInfo() {
        let me = this;
        let newArea = [];
        if (!this.dataOut.search.Area) {
          newArea = this.dataIn.customerList;
        } else {
          newArea = this.dataIn.customerList.filter(function(item) {
            return (item.Area + '').substring(0, 4) == (me.dataOut.search.Area + '').substring(0, 4);
          });
        }
        if (validatorManu.isEmpty(this.intelligentMatch.customerName)) {
          return newArea;
        } else {
          return newArea.filter((item) => {
            return item.Name.indexOf(me.intelligentMatch.customerName.trim()) > -1;
          })
        }
      }, //计算当前所选机构分仓
      computedStoresOfBranch() {
        let arrTemp = [];
        if (this.dataOut.search.BranchId > 0) {
          arrTemp = _.find(this.dataIn.arrBranch, {
            Id: this.dataOut.search.BranchId
          }).Store;
        }
        return arrTemp;
      }
    },
    methods: {
      initPageData(v) {
        var me = this;
        var para = {};
        para.StoreId = this.dataOut.search.StoreId;
        para.CustomerId = this.dataOut.search.CustomerId;
        para.Category = this.dataOut.search.Category;
        para.ProName = this.dataOut.search.ProName;
        para.Files = this.dataOut.search.Files;
        if (this.SNType == 0) {
          if (this.dataOut.search.StoreId == 0) {
            showTips('请先选择分仓', 'error');
            return;
          }
          para.CustomerId = 0;
        } else {
          para.StoreId = 0;
          if (!this.dataOut.search.Area) {
            showTips('请选择区域', 'error');
            return;
          }
          if (this.dataIn.customerList.length == 0) {
            showTips('该区域下暂无客户，请重新选择区域', 'error');
            return;
          }
          if (this.dataOut.search.CustomerId == 0) {
            showTips('请选择客户', 'error');
            return;
          }
        }
        if (!v) {
          para.Files = '';
          // this.isImportOk = false;
          this.isCompared = false;
        }
        this.isImportOk = false;
        fetchData({
          API: '/Api/ Imei/Compare',
          para,
          callback(data) {
            // console.log(data);
            if (v) {
              me.isCompared = true;
            }
            me.dataIn.inited = true;
            me.dataIn.objDataList = data;
          }
        })
      },
      IMIptFocus() {
        this.intelligentMatch.isShow = true;
      },
      IMIptInput() {
        this.dataOut.search.CustomerId = '';
      },
      selectedThisCustomerId(item) {
        this.dataOut.search.CustomerId = item.Id;
        this.intelligentMatch.customerName = item.Name;
        this.intelligentMatch.isShow = false;
      },
      getStores() {
        let me = this;
        fetchData({
          API: '/Api/User/Store',
          para: {},
          callback(data) {
            me.dataIn.arrBranch = data;
            if (data.length) {
              me.dataOut.search.BranchId = data[0].Id;
            }
          }
        })
      },
      branch_Change() {
        this.dataOut.search.StoreId = '';
      },
      getCategory() {
        let me = this;
        fetchData({
          API: 'api/Product/Category',
          callback(data) {
            me.dataIn.arrCategoryList = data;
          }
        })
      },
      getArea() {
        let me = this;
        fetchData({
          API: '/Api/Misc/MyArea',
          callback(data) {
            me.dataIn.arrAreaList = data;
            // if (data.length) {
            //   me.dataOut.search.Area = data[0].Code;
            // }
          }
        })
      },
      //根据区域切换客户
      area_Change() {
        let me = this;
        me.intelligentMatch.isShow = false;
        me.intelligentMatch.customerName = '';
        me.dataOut.search.CustomerId = '';
        // fetchData({
        //   API: 'API/Misc/CustListByArea',
        //   para: {
        //     area: this.dataOut.search.Area
        //   },
        //   callback(data) {
        //     // console.log(data);
        //     me.dataIn.arrCustomerList = data;
        //     me.dataOut.search.CustomerId = 0;
        //   }
        // })
      },
      getCustomerList() {
        let me = this;
        fetchData({
          API: '/Api/Misc/CustList',
          para: {
            pageIndex: 1,
            pageSize: 10000,
          },
          callback(data) {
            // console.log(data);
            // me.dataIn.inited = true;
            me.dataIn.customerList = data.Data;
          }
        })
      },
      import_Click() {
        this.$el.querySelector('.import-sn').click();
      },
      initUpload() {
        let me = this;
        formDataUpload({
          url: this.dataIn.SERVER + '/Api/Imei/Upload',
          obj: this.$el.querySelector('.import-sn'),
          type: 'xlsx,xls',
          callback(data) {
            // showTips('导入成功');
            me.isImportOk = true;
            me.dataOut.search.Files = data.Message;

          }
        })
      }
    },
    ready() {
      this.getStores();
      this.getCategory();
      this.initUpload();
      this.getArea();
      this.getCustomerList();
    }
}
</script>
