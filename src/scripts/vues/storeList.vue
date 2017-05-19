<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>选择分仓</h2>
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
                        <th>分仓名称</th>
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
                          <a href="javascript:;" class="highlight" @click="addItem(item)">添加</a>
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
    action: '',
    isOut: 1
  },
  data() {
    return {
      pageIndex: 1,
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
      fetchData({
        API: 'api/USER/STORE',
        para: {
          action,
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
      if (1 == this.isOut) { //调拨出
        this.storeSelected.OutBranchId = item.BranchId;
        this.storeSelected.OutBranchName = item.BranchName;
        this.storeSelected.OutStore = item.Id;
        this.storeSelected.OutStoreName = item.Name;
      } else if (0 == this.isOut) { //调拨入
        this.storeSelected.InBranchId = item.BranchId;
        this.storeSelected.InBranchName = item.BranchName;
        this.storeSelected.InStore = item.Id;
        this.storeSelected.InStoreName = item.Name;
      } else {
        this.storeSelected.BranchId = item.BranchId;
        this.storeSelected.BranchName = item.BranchName;
        this.storeSelected.StoreId = item.Id;
        this.storeSelected.StoreName = item.Name;
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
          // if (this.dataIn.arrBranch.length) {
          //   this.dataIn.arrBranch.forEach(item => {
          //     item.on = false;
          //   });
          //   this.dataIn.arrBranch[0].on = true;
          //   this.editInfo.BranchId = this.dataIn.arrBranch[0].Id;
          //   this.editInfo.BranchName = this.dataIn.arrBranch[0].Name;
          //   this.dataIn.arrStore = this.dataIn.arrBranch[0].Store.length ? this.dataIn.arrBranch[0].Store : [];
          // } else {


        // }
      }
    }
  }
}
</script>
