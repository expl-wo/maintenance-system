<template>
  <span>{{ filterValue }}</span>
</template>
<script type="text/jsx">

export default {
  name: 'xuiFilter',
  props: {
    type: {
      type: String,
      default: 'date'
    },
    subLen: {
      type: Number,
      default: 10
    },
    value: String
  },
  data() {
    return {
      filterValue: ''
    }
  },
  mounted() {
    this.filterForm()
  },
  methods: {
    filterForm() {
      if(this.type){//如果是日期 YYYY-MM-DD
        if(this.value){
          this.filterValue = this.value.substr(0, this.subLen)
        }
      }else{
        this.filterValue = this.value;
      }
    }
  },
  watch: {
    value() {
      this.filterForm()
    }
  }
}
</script>

