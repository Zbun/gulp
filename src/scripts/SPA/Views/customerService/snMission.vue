<template>
  <div class="main">
    <h2 class="content-title">串号查询</h2>
    <div class="content-field">
      <div class="">
        <div class="sn-query-box">
          <a href="/dist/files/SN_TEMPLATE.xlsx" class="highlight fr">下载模板</a>
          <div class="m20 sn-query">
            <div class="text-area">
              <textarea name="" id="" cols="30" rows="5" class="com-ipt x-large" v-model="strImeis" placeholder="输入串号，空格或回车输入多个"></textarea>
              <div class="text-right mt5">
                <span class="fl text-warning ml20" v-show="dataIn.dataTable.length>0">共查询到{{dataIn.dataTable.length}}个串号</span>
                <a href="javascript:;" class="mr10" @click="empty_Click()">
                  <i class="icon icon-del"></i>清空
                </a>
              </div>
            </div>
            <div class="btn-area">
              <input type="file" class="hidden import-sn">
              <button class="btn btn-default btn-import" @click="import_Click()">Excel导入</button>
              <button class="btn btn-primary btn-search" @click="search_Click()" :class="{disabled:strImeis.length==0}">查询</button>
            </div>
          </div>
        </div>
        <table class="table text-center  table-bordered table-fixed" v-show="dataIn.inited">
          <thead>
            <tr>
              <th style="width:80px;">序号</th>
              <th style="width:220px;">
                串号
              </th>
              <th style="width:150px">
                分类
              </th>
              <th>
                商品名称
              </th>
              <th style="width:200px;">
                供应商
              </th>
              <th style="width:200px">
                客户
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item of dataIn.dataTable">
              <tr class="sn-query-head" v-if="-1==item.Status">
                <td>{{$index+1}}</td>
                <td>
                  <p class="text-ellipsis" :title="item.Imei"><b>{{item.Imei}}</b></p>
                </td>
                <td colspan="4">
                  <p class="text-warning">
                    没有查询到该串号信息
                  </p>
                </td>
              </tr>
              <template v-else>
                <tr class="sn-query-head">
                  <td>{{$index+1}}</td>
                  <td>
                    <p class="text-ellipsis" :title="item.Imei"><b>{{item.Imei}}</b></p>
                    <div v-if="item.Imei!=item.SubImei">
                      <p class="font-small" v-for="item2 in item.SubImei.split(' ').slice(1)">
                        {{item2}}
                      </p>
                    </div>
                  </td>
                  <td>
                    <p class="text-ellipsis" :title="item.CategoryName">{{item.CategoryName}}</p>
                  </td>
                  <td>
                    <p class="text-ellipsis" :title="item.ProName">{{item.ProName}}</p>
                  </td>
                  <td>
                    <p class="text-ellipsis" :title="item.ReceivingSupplierName">{{item.ReceivingSupplierName}}</p>
                  </td>
                  <td>
                    <p class="text-ellipsis" :title="item.Retailer">{{item.Retailer}}</p>
                  </td>
                </tr>
                <tr v-if="item.Details.length>0" style="vertical-align:top">
                  <td>&nbsp;</td>
                  <td>
                    <p style="margin-top:3px;">流转历史</p>
                  </td>
                  <td colspan="4" style="border-left:0;padding-left:20px;">
                    <ul class="sn-history">
                      <li v-for="item2 of item.Details">
                        <div class="detail text-left">
                          <p class="dis-inline-block pl20" style="width:130px;">
                            {{item2.Status|SNStatus}}
                          </p>
                          <span class="ml10">
                          {{item2.DateAdded|datetime}}
                        </span>
                          <span class="ml30">
                        <template v-if="item2.Status==6||item2.Status==12">
                          {{item2.Description}}
                        </template>
                        <template v-else>
                          {{item2.BillCode}}
                        </template>
                          </span>
                          <span class="ml30 text-warning" v-if="item2.ImeiPrice>0">
                              {{item2.ImeiPrice|money}}
                            </span>
                        </div>
                      </li>
                    </ul>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
        <!--         <table class="table text-center color-light table-bordered table-fixed mt5" >
          <tbody>

          </tbody>
        </table> -->
      </div>
    </div>
  </div>
</template>
<script>
import formDataUpload from 'commonScripts/formDataUpload.js';
export default {
  data() {
      return {
        strImeis: '',
        dataIn: {
          inited: false,
          SERVER: localStorage.APIServer || window.APISERVER,
          dataTable: []
        },
        filter: {

        }
      }
    },
    components: {},
    methods: {
      initPageData() {
        let me = this;
        formDataUpload({
          url: this.dataIn.SERVER + '/Api/Imei/Upload',
          obj: this.$el.querySelector('.import-sn'),
          type: 'xlsx,xls',
          callback(data) {
            let Details = [];
            me.strImeis = '';
            // console.log(data);
            fetchData({
              API: '/Api/Imei/ImportQuery',
              para: {
                files: data.Message
              },
              callback(dataT) {
                me.dataIn.inited = true;
                me.dataIn.dataTable = dataT;
              }
            })
          }
        })
      },
      empty_Click() {
        this.strImeis = '';
      },
      import_Click() {
        this.$el.querySelector('.import-sn').click();
      },
      search_Click() {
        if (!this.strImeis) {
          showTips('请先输入串号', 'error');
          return;
        }
        let me = this;
        fetchData({
          API: '/Api/Imei/Query',
          para: {
            Imeis: this.strImeis.replace(/^(\s*|\n*)|(\s*|\n*)$/g, '').split(/\s+|\n/).join(',')
          },
          callback(data) {
            // console.log(data);
            me.dataIn.inited = true;
            me.dataIn.dataTable = data;
          }
        })
      },

    },
    ready() {
      this.initPageData();
    }
}
</script>
