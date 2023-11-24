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
            <span class="title">持续时间:</span
            ><span>{{ currentProjectMsg.allTime }}天</span>
      </div>
      <div class="lineMsg">
            <span class="title">当前进度:</span
            ><span>{{ currentProjectMsg.stateName }}</span>
      </div>
      <div class="lineMsg">
            <span class="title">生产计划完工时间:</span
            ><span>{{ currentProjectMsg.planCompletime }}</span>
      </div>
      <div class="lineMsg">
            <span class="title">厂内完工时间:</span
            ><span>{{ currentProjectMsg.dateEnd }}</span>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import {defineComponent, computed, onMounted, ref, reactive, defineEmits, toRef, watch, nextTick} from "vue";

</script>

<style scoped lang="scss">

</style>
