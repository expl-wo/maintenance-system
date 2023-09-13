<template>
  <el-select v-bind="$attrs"
             v-model.trim="currentValue"
             placeholder="请选择"
             :multiple="multiple"
             :class="{'width100Percent':widthFull}"
             :collapse-tags="showMultipleCheckbox || collapseTags"
             @change="handleChange"
  >
    <el-checkbox class="xui-select-all-box" v-if="showMultipleCheckbox"
                 :indeterminate="indeterminate"
                 v-model="checked" @change="selectAll"
    >全选
    </el-checkbox>
    <el-option v-for="item in dictDataList"
               :key="item[code]" :label="item[name]"
               :value="item[code]"
    ></el-option>
  </el-select>
</template>

<script type="text/jsx">
import {getDictListByKey} from '../dictionary/index'
import constants from "@/_public/utils/constants";

export default {
  name: 'xuiDictSelect',
  props: {
    widthFull: {
      type: Boolean,
      default: true
    },
    itemCode: String,
    value: [String, Number, Array],
    split: {
      type: String,
      default: ','
    },
    multiple: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      default: 'code'
    },
    name: {
      type: String,
      default: 'name'
    },
    includeAll: {
      type: Boolean,
      default: false
    },
    allValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dictDataList: [],
      currentValue: this.value,
      checked: false,
      indeterminate: false
    }
  },
  computed: {
    showMultipleCheckbox() {
      return this.includeAll && this.multiple
    }
  },
  created() {
    let dataList = getDictListByKey(this.itemCode)
    if (this.includeAll && !this.multiple) {
      dataList = [{
        code: this.allValue,
        name: '全部'
      }].concat(dataList)
    }
    this.dictDataList = dataList
    this.updateCheckboxStatus();
  },
  watch: {
    currentValue(newVal) {
      this.$emit('input', newVal)
    },
    value(newVal) {
      this.currentValue = newVal
      this.updateCheckboxStatus();
    }
  },
  methods: {
    updateCheckboxStatus() {
      //有全选勾选框时
      if (this.showMultipleCheckbox) {
        if (this.currentValue.length === this.dictDataList.length) {
          this.checked = true;
          this.indeterminate = false;
        } else if (this.currentValue.length > 0) {
          this.checked = false;
          this.indeterminate = true;
        } else {
          this.checked = false;
          this.indeterminate = false;
        }
      }
    },
    selectAll() {
      this.indeterminate = false
      if (this.checked) {
        let currentValue = []
        this.dictDataList.map((item) => {
          currentValue.push(item[this.code])
        })
        this.currentValue = currentValue
      } else {
        this.currentValue = []
      }
      this.$nextTick(() => {
        this.$emit('changeAll', this.currentValue)
      })
    },
    handleChange(val, label) {
      if (val.length === this.dictDataList.length) {
        this.checked = true
        this.indeterminate = false
      } else if (val.length > 0) {
        this.checked = false
        this.indeterminate = true
      } else {
        this.checked = false
        this.indeterminate = false
      }
      this.$nextTick(() => {
        this.$emit('change', val, label)
      })
    },
    getSelectLabel() {
      if (constants.isEmpty(this.currentValue)) {
        return '';
      }
      let valueArr = this.currentValue.split(',');
      let selectLabelList = [];
      valueArr.forEach(item => {
        this.dictDataList.some(subItem => {
          if (item == subItem[this.code]) {
            selectLabelList.push(subItem[this.name])
            return true;
          } else {
            return false;
          }
        })
      })
      return selectLabelList.join(',');
    }
  }
}
</script>


<style lang="scss" scoped>
.el-select-dropdown__wrap .xui-select-all-box {
  margin-left: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

</style>
