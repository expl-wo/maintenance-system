<template>
  <div class="slider" v-if="item.widthMe"
       ref="slider" :style="{ width: (item.ratios && item.ratios != '0') ? item.ratios + '%': 0 ,zIndex: 1000}">
    <div class="contentWrapper" :class="[item.sliderClz,{'slider-half': item.ratios != 100 }]">
    </div>
  </div>
</template>
<script lang="ts" setup>
import {defineComponent, computed, onMounted, ref, reactive, nextTick, defineEmits} from "vue";
import {getDictListByKey} from '@/components/xui/dictionary'

//状态说明


const props = defineProps({
  item: Object,
  value: [String, Number]
})

const slider = ref();
const isMove = ref(false);
const minWidth = ref(70);

const showTimeDetail = computed(() => {
  return props.item.widthMe >= minWidth.value
})

const substr = () => {

}

const getStatus = () => {
  //判断状态
  let dictList = getDictListByKey('mainPlanStatus');
  let clz = '';
  dictList.forEach(item => {
    if (item.code == props.item._status) {
      clz = item.remark ? item.remark : 'normal';
    }
  })
  // return clz;
  return "normal"
}

</script>
<style lang="scss">


.slider-half{
  border-radius: 5px 0 0 5px!important;
}


.contentWrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2000;
  height: 100%;
  padding: 0 2px;
  color: #FFF;
  font-size: 12px;
  border-radius: 5px;
  &.celladvance {
    color: #000;
  }
}

.box {
  margin: 100px auto 0;
  width: 80%;
}

.clear:after {
  content: "";
  display: block;
  clear: both;
}

.slider {
  position: relative;
  height: 30px;
  background: #e4e7ed;
  cursor: pointer;
  user-select: none;
  border-radius: 5px;
}

.slider .process {
  position: absolute;
  left: 0;
  top: 0;
  width: 112px;
  height: 100%;
  border-radius: 3px;
  background: #409eff;
}

.slider .thunk {
  position: absolute;
  left: 100px;
  top: -7px;
  width: 20px;
  height: 20px;
}

.slider .block {
  transition: 0.2s all;
}

.slider .block i {
  font-size: 25px;
  position: relative;
  left: -3px;
  top: 15px;
  cursor: pointer;
}

.slider .tips {
  position: absolute;
  left: -3px;
  bottom: 0px;
  font-size: 12px;
  line-height: 24px;
  min-width: 15px;
  text-align: center;
  padding: 1px 5px;
  background: #000;
  border-radius: 5px;
  height: 24px;
  color: #fff;
}

.slider .tips i {
  position: absolute;
  margin-left: -5px;
  left: 50%;
  bottom: -9px;
  font-size: 16px;
  color: #000;
}

.slider .block:hover {
  transform: scale(1.1);
  opacity: 0.6;
}
</style>
