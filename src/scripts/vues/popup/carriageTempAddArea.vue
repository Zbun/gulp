<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title">
          <a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>选择地区</h2>
        <div class="body">
          <div class="content" style="width:600px">
            <table class="table table-bordered-all thin">
              <thead>
                <tr>
                  <th style="width:100px;">
                    省份
                  </th>
                  <th>
                    市县
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in arrDataList">
                  <td class="text-nowrap">
                    <label class="checkbox">
                      <input type="checkbox" :checked="item._arrChkedItem.length==item.Child.length" @change="changePArea($event,item)">{{item.AreaName}}
                      <span class="icon"></span>
                    </label>
                  </td>
                  <td>
                    <label class="checkbox" v-for="el in item.Child">
                      <input type="checkbox" :value="el" v-model="item._arrChkedItem">{{el.AreaName}}
                      <span class="icon"></span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
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
  export default {
    props: {
      show: { twoway: true, default: false },
      curItem: {}
    },
    data() {
      return {
        arrDataList: []
      }
    },
    components: {},
    methods: {
      initPageData() {
        fetchData({
          API: '/api/Misc/GetAreaLevel12',
          callback: data => {
            data.forEach(item => {
              item._arrChkedItem = [];
            })
            this.arrDataList = data;
            this.handleData();
          }
        })
      },
      handleData() {
        this.arrDataList.forEach(item => {
          item._arrChkedItem = [];
          if (this.curItem.PlaceAreaCodes && this.curItem.PlaceAreaCodes.length) {//编辑时处理选中
            if (this.curItem.PlaceAreaCodes.indexOf(item.AreaCode) > -1) {//全部选择时
              item._arrChkedItem = item.Child.map(el => el);
            }
            else {
              item.Child.forEach(area => {
                if (this.curItem.PlaceAreaCodes.indexOf(area.AreaCode) > -1) {
                  item._arrChkedItem.push(area);
                }
              })
            }
          }
        });

      },
      changePArea(e, item) {
        let isChked = e.target.checked;
        if (isChked) {
          item._arrChkedItem = item.Child.map(el => el);
        } else {
          item._arrChkedItem = [];
        }
      },
      onSubmit_Click() {
        let arrTemp = JSON.parse(JSON.stringify(this.arrDataList.filter(el => {
          return el._arrChkedItem.length > 0;
        })));

        arrTemp.forEach(item => {//组装数据
          item.arrAreaCode = [];
          item.arrAreaName = [];
          if (item._arrChkedItem.length == item.Child.length) {//全选时
            item.arrAreaCode = [item.AreaCode];
            item.arrAreaName = [item.AreaName];
          } else {
            item._arrChkedItem.forEach(area => {
              item.arrAreaCode.push(area.AreaCode);
              item.arrAreaName.push(`${item.AreaName}${area.AreaName}`);
            })
          }
        })
        this.$emit('save', arrTemp);
        this.onCancel_Click()
      },
      onCancel_Click() {
        this.show = false;
        this.$emit('update:show', false);
      }
    },
    created() { },
    watch: {
      show(newVal) {
        if (newVal) {
          if (this.arrDataList.length == 0) {
            this.initPageData();
          }
          this.handleData();
        }
      }
    }
  }
</script>