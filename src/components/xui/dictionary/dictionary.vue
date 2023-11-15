<template>
  <span v-if="isSimple">{{ dictLabel }}{{suffix}}</span>
  <div v-else class="multi-select-content">
    <span>{{ dictLabel }}{{suffix}}</span>
  </div>
</template>
<script type="text/jsx">
import { transformDictDetail } from './index'

export default {
  name: 'xuiDictionary',
  props: {
    treeDict: {
      type: Boolean,
      default: false
    },
    multiDict: {
      type: Boolean,
      default: false
    },
    isSimple: {
      type: Boolean,
      default: true
    },
    suffix: {
      type: String,
      default: ''
    },
    dataList: Array,
    itemCode: [String, Number],
    code: [String, Number],
    nullToDefault: {
      type: Boolean,
      default: true
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    labelKey: {
      type: String,
      default: 'text'
    },

  },
  data() {
    return {
      dictLabel: ''
    }
  },
  mounted() {
    this.transformContent()
  },
  methods: {
    transformContent() {
      debugger
      let value = transformDictDetail(this.itemCode, this.code)
      if (this.nullToDefault && value === '') {
        this.dictLabel = this.code
      } else {
        this.dictLabel = value
      }
    }
  },
  watch: {
    code(val) {
      this.transformContent()
    }
  }
}
</script>

<style scoped lang="scss">
  .multi-select-content{
    flex: 1;
    font-size: 13px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    padding: 4px;
    margin-right: 10px;
    min-height: 30px;
  }
</style>

