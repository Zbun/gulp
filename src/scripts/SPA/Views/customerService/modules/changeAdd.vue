<template>
  <div class="main">
    <div class="content-field">
      <div class="content-large w90p ">
        <div class="shadow-box">
          <div class="m20">
            <div class="m30">
              <div class="set w6em text-center font-big">
                <p class="dis-inline-block"><b class="mr5">故障机</b>
                  <input type="search" placeholder="输入串号，回车提交" class="com-ipt high large ipt-warning" v-model="old" maxlength="15" @keydown="checkImei_Keydown($event,0)">
                  <span class="text-muted num-length">{{old.length}}</span></p>
                <div class="mt20">
                  <p class="dis-inline-block">
                    <b class="mr5">&#12288;新机</b>
                    <span class="content">
                          <input type="search" placeholder="输入串号，回车提交" v-model="new" maxlength="15" class="com-ipt high large ipt-ok" @keydown="checkImei_Keydown($event,1)">
                          <span class="text-muted num-length">{{new.length}}</span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div v-show="dataIn.inited" class="mb30">
              <table class="table table-bordered text-center mt30">
                <thead>
                  <tr>
                    <th style="width:90px;"></th>
                    <th style="width:150px">
                      串号
                    </th>
                    <th>
                      商品名称
                    </th>
                    <th style="width:170px;">
                      出库日期
                    </th>
                    <th style="width:100px">
                      客户
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in dataIn.datatable">
                    <template v-if="$index==0">
                      <td class="td-danger">
                        <p>
                          <b>故障机</b>
                        </p>
                      </td>
                      <td>
                        <p class="text-nowrap">{{item.Imei}}</p>
                      </td>
                      <td>
                        {{item.ProName}}
                      </td>
                      <td>
                        <p class="text-nowrap"> {{item.StoreOutDate|datetime}}</p>
                      </td>
                      <td>
                        {{item.Retailer}}
                      </td>
                    </template>
                    <template v-else>
                      <td class="td-ok"><b>新机</b></td>
                      <td>
                        <p class="text-nowrap">{{item.Imei}}</p>
                      </td>
                      <td>
                        {{computedNewProName}}
                      </td>
                      <td>/</td>
                      <td>/</td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="mt10 text-center" v-show="dataIn.inited">
        <button class="btn btn-primary big" :class="{'btn-disabled':dataIn.datatable.length<2}" @click="change_Click($event)">换机</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        old: '',
        new: '',
        dataIn: {
          inited: false,
          datatable: []
        }
      }
    },
    computed: {
      computedNewProName() {
        return this.dataIn.datatable[0] ? this.dataIn.datatable[0].ProName : '';
      }
    },
    components: {},
    methods: {
      //回车校验串号及输出
      checkImei_Keydown(e, isNew) {
        let target = e.target;
        let me = this;
        let v = target.value;
        if (13 == e.keyCode) {
          if (v.length == 0) {
            return;
          } else {
            if (isNew) {
              if (this.dataIn.datatable[0]) {
                if (v.length != this.dataIn.datatable[0].Imei.length) {
                  showTips('新机的串号位数需与故障机保持一致，请检查', 'error');
                  return;
                }
              }
            }
            fetchData({
              API: '/Api/Imei/Info',
              para: {
                imei: v
              },
              callback(data) {
                // console.log(data);

                if (data.Status) {
                  if (!isNew) {
                    if (!_.find(me.dataIn.datatable, {
                        Imei: data.Imei
                      })) {
                      if (typeof me.dataIn.datatable[0] != 'undefined') {
                        me.dataIn.datatable.splice(0, 1, data);
                      } else {
                        me.dataIn.datatable.push(data);
                      }

                    }
                    me.dataIn.inited = true;
                  } else {
                    showTips('该串号已存在库中或已售，请检查', 'error');
                  }
                } else {
                  if (isNew) {
                    let obj = {};
                    obj.Imei = v;
                    if (me.dataIn.datatable.length > 0) {
                      if (typeof me.dataIn.datatable[1] != 'undefined') {
                        me.dataIn.datatable.splice(1, 1, obj);
                      } else {
                        me.dataIn.datatable.push(obj);
                      }

                    }
                    me.dataIn.inited = true;
                  } else {
                    showTips('该串号不存在或已售，请检查', 'error');
                  }
                }
              }
            })
          }
        }
      },
      change_Click(e) {
        let me = this;
        fetchData({
          target: e.target,
          API: 'API/Imei/Change',
          para: {
            OldImei: this.old,
            NewImei: this.new
          },
          callback() {
            me.dataIn.inited = false;
            me.old = '';
            me.new = '';
            me.dataIn.datatable = [];
            me.$dispatch('on-added-ok');
          }
        })
      }
    },
    ready() {}
}
</script>
