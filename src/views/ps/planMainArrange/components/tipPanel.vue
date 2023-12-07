<template>
  <transition name="el-zoom-in-center" v-if="isShowMsg">
    <div
        class="projectMsg"
        :style="{
            zIndex: 3000,
            left: currentProjectMsg.left + 'px',
            top: currentProjectMsg.top + 'px'
          }"
    >
      <div class="lineMsg">
        <span class="projectName">{{ currentProjectMsg.name }}</span>
      </div>
      <div class="lineMsg">
            <span class="title">计划持续时间:</span
            ><span>{{ currentProjectMsg.allTime }}天</span>
      </div>
      <div class="lineMsg">
            <span class="title">生产进度:</span
            ><span>{{ transform('mainPlanStatus', currentProjectMsg._status) }}</span>
      </div>
      <div class="lineMsg">
            <span class="title">计划开始时间:</span
            ><span>{{ currentProjectMsg.planStartDate }}</span>
      </div>
      <div class="lineMsg">
            <span class="title">计划完工时间:</span
            ><span>{{ currentProjectMsg.planEndDate }}</span>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import {defineComponent, computed, onMounted, ref, reactive, defineEmits, toRef, watch, nextTick} from "vue";
import {transformDictDetail} from "@/components/xui/dictionary";

const props = defineProps({
  currentProjectMsg: Object,
  isShowMsg: Boolean
})

const transform = transformDictDetail;

</script>

<style scoped lang="scss">

</style>
