<template>
  <div style="margin:5px 0 10px 0;">
    <div style="margin-bottom: -8px;">{{sliderHoverData.k}}-{{sliderHoverData.v}}</div>
    <el-slider 
      v-model="s"
      range 
      @change="handleChange($event)" 
      size="mini" 
      :min="min" 
      :max="max" 
      :class="{'maxSlider': maxSlider}"
    />
  </div>
</template>

<script>
export default {
  name: 'TableSimple',
  props: {
    // 最小值
    min: {
      required: true,
      type: Number
    },
    // 最大值
    max: {
      required: true,
      type: Number
    },
    // 修改的这行数据
    sliderData: {
      required: true,
      type: Object
    },
    // 整个查出来的数据
    sliderHoverData: {
      required: true,
      type: Object
    },
    // 选中的最小值
    intervalMin: {
      required: true,
      type: Number
    },
    // 选中的最大值
    intervalMax: {
      required: true,
      type: Number
    },
    maxSlider: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      s: [ this.intervalMin, this.intervalMin+this.intervalMax ]
    }
  },
  mounted(){
    // this.checkboxClick()
  },
  methods: {
    handleChange(event) {
      this.$emit('handleOnChange', { event: event, data: this.sliderData, sliderHoverData: this.sliderHoverData })
    }
  }
}
</script>

<style lang="scss" scoped>
.fileCls {
  height: 26px;
  width: 30px;
  position: absolute;
  filter: alpha(opacity = 0);
  -moz-opacity: 0;
  opacity: 0;
  z-index: 110;
  cursor: pointer;
  float: right;
  margin-top: -26px;
  position: relative;
  left: -12px;
}
</style>
