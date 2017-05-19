<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content" style="min-width:900px;">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>添加礼品</h2>
        <div class="body">
          <div class="content">
            <table class="table table-bordered table-fixed">
              <thead>
                <tr>
                  <td class=" w50p">
                    <div class="p5">
                      <input type="text" placeholder="输入关键字" class="thin com-ipt  x-large" v-model="dataOut.name">
                      <button class="btn btn-primary small ml5">搜索</button>
                    </div>
                  </td>
                  <td class=" w50p">
                    <div class="p5"><span class="pointer-r"></span> 已选择礼品&#12288;共
                      <b class="text-warning"> {{dataIn.dataSelected.length}} </b>个
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody class="table-v-top">
                <tr>
                  <td class="bg-muted">
                    <div class="compare-list">
                      <ul class="inner">
                        <li class="item" v-for="item in dataIn.dataGift | filterBy dataOut.name in 'Name'" v-show="!item.isSelected">
                          <div class="info">
                            <a href="javascript:;" class="action fr ml20 highlight" @click="add_Click(item)">添加</a>
                            <span class="name">{{item.Name}}</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </td>
                  <td class="bg-muted">
                    <div class="compare-list">
                      <ul class="inner">
                        <li class="item" v-for="item in dataIn.dataSelected">
                          <div class="info">
                            <a href="javascript:;" class="action fr highlight icon icon-del2" @click="del_Click(item)"></a>
                            <span class="action-box style2 fr">
                                              <a href="javascript:;" title="减" class="a-num cart-minus minus" @click="minusNum_Click(item)" :class="{disabled:item.ProCount==1}">-</a>
                                              <input class="amount inp com-ipt x-small" type="text" v-model="item.ProCount" @blur="proCount_Blur($event)">
                                              <a href="javascript:;" title="加" class="a-num cart-plus add" @click="addNum_Click(item)">+</a>
                                          </span>
                            <span class="name">{{item.Name}}</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="footer text-center">
          <button class="btn btn-primary" @click="onOk_Click">提交</button>
          <button class="btn btn-default" @click="onCancel_Click">关闭</button>
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
    code: ''
  },
  data() {
    return {
      dataIn: {
        dataOrder: {},
        dataGift: [],
        dataSelected: []
      },
      dataOut: {
        name: ''
      }
    }
  },
  components: {},
  methods: {
    initPageData() {
      var me = this;
      fetchData({
        API: '/api/Product/List',
        para: {
          proType: 0,
          pageSize: 10000
        },
        callback(data1) {
          // console.log(data1);
          me.dataIn.dataSelected = [];
          fetchData({
            API: '/Api/SO/SCAttsList',
            para: {
              SalesContractCode: me.code
            },
            callback(data2) {

              data1.Data.forEach(item => {
                item.isSelected = false;
                item.ProCount = 1;
                item.ProName = item.Name;
                item.ProId = item.Id;
              });
              data2.forEach(item => {
                let cur = _.find(data1.Data, {
                  Id: item.ProId
                });
                cur.isSelected = true;
                cur.Id = cur.ProId = item.ProId;
                cur.ProCount = item.ProCount;
                me.dataIn.dataSelected.push(cur);
              })

              me.dataIn.dataGift = data1.Data;
              // console.log(me.dataIn.dataGift);
            }
          })
        }
      });

    },
    add_Click(item) {
      item.isSelected = true;
      item.ProCount = 1;
      this.dataIn.dataSelected.push(item);
    },
    del_Click(item) {
      item.isSelected = false;
      this.dataIn.dataSelected.$remove(item);
    },
    //加数量
    addNum_Click(item) {
      let a = item.ProCount;
      item.ProCount = 0;
      item.ProCount = parseInt(a) + 1;
    },
    //减数量
    minusNum_Click(item) {
      item.ProCount = item.ProCount - 0 - 1;
    },
    //失焦
    proCount_Blur(e) {
      let v = parseInt(e.target.value);

      e.target.value = v ? v < 0 ? 1 : v : 1;
    },
    onOk_Click() {
      let me = this;
      fetchData({
        API: '/Api/SO/SCAddAtts',
        para: {
          SalesContractCode: this.code,
          Attachments: this.dataIn.dataSelected
        },
        callback(data) {
          // console.log(data);
          me.show = false;
        }
      })
    },
    onCancel_Click() {
      this.show = false;
    }
  },
  ready() {},
  watch: {
    show(newVal) {
      newVal && this.initPageData();
    }
  }
}
</script>
