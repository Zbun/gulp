<template>
  <span>
		  <span class="date-field ml5">
        <input type="text" v-model="StartDate" readonly="" placeholder="开始时间" id="startDate" onclick="WdatePicker({onpicked:function(){updateDate()},maxDate: '#F{$dp.$D(\'endDate\')}'})">
        <i class="fa fa-calendar icon"></i>
      </span>
  <span> - </span>
  <span class="date-field">
        <input type="text" v-model="EndDate" readonly="" placeholder="结束时间" id="endDate" onclick="WdatePicker({minDate: '#F{$dp.$D(\'startDate\')}',maxDate:'%y-%M-%d'})">
        <i class="fa fa-calendar icon"></i>
      </span>
  </span>
  </span>
</template>
<script>
function updateDate() {
  alert(3);
}
export default {
  props: {
    dataOut: {
      StartDate: '',
      EndDate: '',
    }
  },
  data() {
    return {
      StartDate: '',
      EndDate: '',
    }
  },
  components: {},
  methods: {
    updateDate() {
      this.$emit('dataOut.StartDate', this.StartDate);
      this.$emit('dataOut.EndDate', this.EndDate);
    },
  },
  created() {}
}
</script>