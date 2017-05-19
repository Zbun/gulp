<template>
  <div>
    <div class="popup" v-if="show">
      <div class="content">
        <h2 class="title"><a href="javascript:;" class="close" title="关闭" @click="onCancel_Click">&times;</a>充值</h2>
        <div class="body">
          <div class="content" style="width:700px">
            <div class="tab-switcher">
              <div class="title">
                <span class="item" @click="toggle_Click(0)" :class="{on:tabIndex==0}">现金充值</span>
                <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==1}">返利充值</span>
                <span class="item" @click="toggle_Click(1)" :class="{on:tabIndex==2}">额度充值</span>
              </div>
              <div class="content p20">
                <div class="item" :class="{on:tabIndex==0}">
                  <ac-cash :data-added-info="dataAddedInfo" :is-Supplier="isSupplier" :obj-cur-item="objCurItem" :show.sync="show" @on-add-ok="dispatchAddOk()"></ac-cash>
                </div>
                <div class="item" :class="{on:tabIndex==1}">
                  <ac-rebate :data-added-info="dataAddedInfo" :is-Supplier="isSupplier" :obj-cur-item="objCurItem" :show.sync="show" @on-add-ok="dispatchAddOk()"></ac-rebate>
                </div>
                <div class="item" :class="{on:tabIndex==2}">
                  <ac-credit :data-added-info="dataAddedInfo" :is-Supplier="isSupplier" :obj-cur-item="objCurItem" :show.sync="show" @on-add-ok="dispatchAddOk()"></ac-credit>
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
import acCash from './modules/acCash.vue';
import acRebate from './modules/acRebate.vue';
import acCredit from './modules/acCredit.vue';
export default {
  props: {
    show: {
      twoway: true,
      default: false
    },
    isSupplier: 0,
    objCurItem: {}
  },
  data() {
    return {
      tabIndex: 0,
      APILIST: {
        SUPPLIERCHARGE: '/Api/Finance/SupplierCharge',
        CUSTOMERCHARGE: '/Api/Finance/CustomerCharge',
      },
      dataAddedInfo: {
        time: '',
        name: '',
        chargeAPI: ''
      }
    }
  },
  components: {
    acCash,
    acRebate,
    acCredit,
  },
  computed: {},
  methods: {
    toggle_Click(v) {
      this.tabIndex = v;
    },
    onCancel_Click() {
      this.show = false;
    },
    dispatchAddOk() {
      this.$dispatch('on-add-ok');
    }
  },
  ready() {},
  watch: {
    show(newVal) {
      if (newVal) {
        this.tabIndex = 0;
        this.dataAddedInfo.chargeAPI = this.isSupplier ? this.APILIST.SUPPLIERCHARGE : this.APILIST.CUSTOMERCHARGE;
        this.dataAddedInfo.time = zmm_date.nowDate().ymdhmms;
        this.dataAddedInfo.name = localStorage.userName;
      }
    }
  }
}
