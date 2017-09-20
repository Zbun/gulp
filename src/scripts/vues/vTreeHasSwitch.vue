<template>
  <li class="item" :data-id="computedModel.Id" :class="{'spread':computedModel.__open,on:$store.state[stateName].Id==computedModel.Id}">
    <p @click="toggle_Click(computedModel)" class="category text-ellipsis" :title="computedModel.Name" :code="computedModel.Code">{{(hasCode?computedModel.Code+'-':'')+computedModel.Name}}</p>
    <ul class="list" v-show="computedModel.__open" v-if="isFolder">
      <v-tree :state-name="stateName" :spread-ids="spreadIds" v-for="model in computedModel.Childs" :has-code="hasCode" :model="model"></v-tree>
    </ul>
  </li>
</template>
<script>
export default {
  name: 'vTree',
  computed: {
    computedModel() {
      //如果需要对数据进行处理，那么在这里进行。
      // if(this.model.Childs && !this.model.Details) {
      //   this.model.Details = this.model.Childs
      // }
      return this.model
    },
    isFolder() {
      return this.computedModel.Childs &&
        this.computedModel.Childs.length
    },
    isOpen() {
      return this.computedModel.__open
    }
  },
  props: {
    //原始树数据
    model: {
      type: Object
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
      
      // if (this.isFolder) {
        item.__open = !item.__open;
        
        if(this.spreadIds!=='') {
          if(item.__open) {
            if(this.$store.state[this.spreadIds].length===0) {
              this.$store.state[this.spreadIds].push(this.model.Id)
            }else{
              if(_.indexOf(this.$store.state[this.spreadIds],this.model.Id)==-1) {
                this.$store.state[this.spreadIds].push(this.model.Id)
              }
            }
          }else{
            let i = _.indexOf(this.$store.state[this.spreadIds],this.model.Id);
            this.$store.state[this.spreadIds].splice(i,1)
          }
        }
      // }
      if(this.stateName!='') {
        this.$store.state[this.stateName] = item;
      }
      this.$dispatch('after-toggle-on', JSON.parse(JSON.stringify(item)));
      
    }
  }
}

</script>