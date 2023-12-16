<template>
  <span>{{ dictName }}</span>
</template>
<script type="text/jsx">
import { getDictNameByItemCode } from './index'

export default {
  name: 'xuiDictName',
  props: {
    itemCode: [String, Number],
    nullToDefault: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dictName: ''
    }
  },
  mounted() {
    this.transformContent()
  },
  methods: {
    transformContent() {
      if(this.itemCode === null || this.itemCode === ''){
        this.dictName = '';
        return;
      }
      let value = getDictNameByItemCode(this.itemCode)
      if (this.nullToDefault && value === '') {
        this.dictName = this.itemCode
      } else {
        this.dictName = value
      }
    }
  },
  watch: {
    itemCode(val) {
      this.transformContent()
    }
  }
}
</script>

