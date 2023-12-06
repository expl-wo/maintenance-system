<template>
<span>{{content}}</span>
</template>

<script>
import { transformDictDetail } from '@/components/xui/dictionary'
export default {
  name: 'cell_transform',
  props:{
    property: String,
    data: Object,
    item: Object,
    item3: Object
  },
  data(){
    return {
      content: ''
    }
  },
  mounted(){
    debugger
    //如果是生产模块的
    if(this.item.opType === this.$constants.opType.product) {
      let content = this.data[this.property];
      if(this.$constants.isEmpty(content)){
        this.content = this.$constants.defaultContent;
      }else{
        if(this.property.indexOf('_status')>=0){
          let content = this.data[this.item3.progressProperty]
          this.content = transformDictDetail('nodeWeekDeStatus', content);
        }else{
          this.content = this.data[this.property];
        }
      }
    }else {
      let content = this.data[this.property];
      if(this.$constants.isNotEmpty(content)){
        if(this.property.indexOf('_status')>=0){
          let date = this.data[this.item3.propertyId + '_finishDate'];
          if(date){
            this.content = date.substr(0, 10);
          }else{
            this.content = date;
          }
        }else{
          this.content =  content;
        }
      }else{
        this.content = this.$constants.defaultContent;
      }
    }
  }
}
</script>

<style scoped>

</style>
