<template>
  <li class="item" :data-id="computedModel.Id" :class="{'spread':isOpen,on:$store.state[stateName].Id==computedModel.Id}">
    <p @click="toggle_Click(computedModel)" class="category text-ellipsis" :title="computedModel.Name" :code="computedModel.Code">{{(hasCode?computedModel.Code+'-':'')+computedModel.Name}}</p>
    <ul class="list" v-show="isOpen" v-if="isFolder">
      <v-tree :state-name="stateName" :spread-ids="spreadIds" v-for="model in computedModel.Details" :has-code="hasCode" :model="model"></v-tree>
    </ul>
  </li>
</template>
<script>
export default {
  name: 'vTree',
  computed: {
    computedModel() {
      //如果需要对数据进行处理，那么在这里进行。
      if(this.model.Childs && !this.model.Details) {
        this.model.Details = this.model.Childs
      }
      return this.model
    },
    isFolder() {
      return this.computedModel.Details &&
        this.computedModel.Details.length
    },
    isOpen() {
      // return this.open
      if(this.spreadIds==='') {
        return this.open
      }else{
        return this.open || _.indexOf(this.$store.state[this.spreadIds],this.model.Id)>-1
      }
    }
  },
  props: {
    //原始树数据
    model: {
      type: Object
    },
    open: {
      type: Boolean,
      twoway: true,
      default: false
    },
    stateName: {
      type:String,
      default:''
    },
    spreadIds: {
      type:String,
      default: ''
    },
    hasCode: {
      type:Boolean,
      default:false
    }
  },
  methods: {
    toggle_Click(item) {
      
      if (this.isFolder) {
        this.open = !this.open;
        if(this.open && this.spreadIds!=='') {
          if(this.$store.state[this.spreadIds].length===0) {
            this.$store.state[this.spreadIds].push(this.model.Id)
          }else{
            if(_.indexOf(this.$store.state[this.spreadIds],this.model.Id)==-1) {
              this.$store.state[this.spreadIds].push(this.model.Id)
            }
          }
        }
      }
      if(this.stateName!='') {
        this.$store.state[this.stateName] = item;
      }
      this.$dispatch('after-toggle-on', JSON.parse(JSON.stringify(item)));
      
    }
  }
}

</script>