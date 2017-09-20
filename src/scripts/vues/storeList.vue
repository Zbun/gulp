<template>
  <div class="popup" v-if="show">
    <div class="content">
      <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>选择仓库</h2>
      <div class="body">
        <div class="content" style="width:900px">
          <button class="btn btn-default fr" @click="reload()">刷新</button>
          <input type="text" placeholder="输入名称关键字" class="com-ipt large" maxlength="50" v-model="dataOut.search.Name" @keydown.enter="initPageData(1)">
          <button class="btn btn-primary ml5">搜索</button>
          <div class="select-box-goods mt10">
            <div class="border-box tree fr">
              <ul class="content list">
                <li class="item" :class="{spread:item.spread,on:item.on}" v-for="item of dataIn.arrBranch">
                  <p class="category  text-ellipsis" :title="item.Name" @click="category_Click($event,item)">
                    {{item.Name}}
                  </p>
                  <ul class="list">
                    <li class="item spread" :class="{on:item1.on}" v-for="item1 of item.Details">
                      <p class="text-ellipsis" @click="category_Click($event,item1,item)" :title="item1.Name">{{item1.Name}}</p>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div class="list-goods">
              <div class="list-table border-box ">
                <table class="text-center table table-hover table-odd">
                  <thead>
                    <tr>
                      <th style="width:180px;">机构</th>
                      <th>仓库名称</th>
                      <th style="width:90px">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item of dataIn.arrStore | filterBy dataOut.search.Name in 'Name'">
                      <td>
                        <p class="text-nowrap">{{item.BranchName}}</p>
                      </td>
                      <td class="text-nowrap">
                        {{item.Name}}
                      </td>
                      <td>
                        <a href="javascript:;" class="highlight" @click="addItem(item)">选择</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    storeSelected: {}, //
    isInPop: '', //是否在弹窗内，在窗内时，接口继续使用IN接口
    action: '',
    branchId: '',
    isOut: 1
  },
  data() {
    return {
      pageIndex: 1,
      APILIST: {
        LISTIN: 'API/USER/STORE',
        LISTOUT: '/Api/Branch/BranchStore',
      },
      dataIn: {
        inited: '',
        dataTable: [],
        arrBranch: [],
        arrStore: []
      },
      dataOut: {
        search: {
          Name: ''
        },
      },
      editInfo: {
        BranchName: '',
        BranchId: ''
      }
    }
  },
  components: {},
  methods: {
    initPageData() {
      this.getBranch();
    }, // 机构获取
    getBranch() {
      let me = this;
      let action = this.action ? this.action : dictionary.storageAttr.forPurchase; //默认采购
      let branchId = this.branchId || 0;
      let API = this.isOut == 1 && !this.isInPop ? this.APILIST.LISTOUT : this.APILIST.LISTIN;
      if (this.isOut == 2) { //转仓或调拨出库
        API = this.APILIST.LISTIN;
      }
      fetchData({
        API,
        para: {
          action,
          branchId,
        },
        callback(data) {
          let arrAllBranch = [];
          let arrAllStore = [];
          let objAll = {};
          objAll.Name = '全部机构';
          data.forEach(item => {
            arrAllStore.push(...item.Store);
            item.on = false;
            item.spread = false;
          });
          objAll.Store = arrAllStore;
          objAll.Details = data;
          objAll.on = objAll.spread = true;
          arrAllBranch.push(objAll);
          me.dataIn.arrBranch = arrAllBranch;
          me.dataIn.arrStore = me.dataIn.arrBranch[0].Store;
        }
      })
    },
    reload() {
      this.getBranch();
    },
    category_Click(e, item) {
      this.dataIn.arrBranch.forEach(el => {
        el.on = false;
        el.Details.forEach(el2 => {
          el2.on = false;
        })
      })
      item.spread = !item.spread;
      item.on = true;
      this.editInfo.BranchId = item.Id;
      this.editInfo.BranchName = item.Name;
      this.dataIn.arrStore = item.Store.length ? item.Store : [];
    },
    addItem(item) {
      this.isOut += '';
      if ('1' === this.isOut || '2' === this.isOut) { //调拨申请出 | 转仓出、调拨出库出
        this.storeSelected.OutBranchId = item.BranchId;
        this.storeSelected.OutBranchName = item.BranchName;
        this.storeSelected.OutStoreId = item.Id;
        this.storeSelected.OutStoreName = item.Name;
      } else {
        this.storeSelected.BranchId = this.storeSelected.InBranchId = item.BranchId;
        this.storeSelected.BranchName = this.storeSelected.InBranchName = item.BranchName;
        this.storeSelected.StoreId = this.storeSelected.InStoreId = item.Id;
        this.storeSelected.StoreName = this.storeSelected.InStoreName = item.Name;
      }
      this.show = false;
      this.$dispatch('on-add-after');
    },
    onSubmit_Click() {},
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.dataOut.search.Name = '';
        this.initPageData()
      }
    }
  }
}
</script>