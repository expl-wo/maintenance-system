<template>
  <div class="multi-select-content">
    <slot/>
  </div>
</template>

<script lang="ts" setup>
import {defineComponent, computed, onMounted, ref, reactive, defineEmits, toRef, watch, nextTick} from "vue";

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