<template>
  <el-dialog draggable
    title="查看"
    width="40%"
    :model-value="visible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="handleClose"
    >
    <div>
      <div v-for="item in contentInfo" :key="item.id">
        <div>执行项：{{item.operationName}}</div>
        <div v-if="+item.operationType === 0">

          <div>执行结果:{{item.contentInfo}}</div>
          <div>附件内容：</div>
        </div>
        <div v-if="+item.operationType === 1">
          <div>执行结果:{{item.contentInfo}}</div>
        </div>
        <div v-if="+item.operationType === 2">
          <div>执行结果:{{item.contentInfo}}</div>
        </div>
        <div v-if="+item.operationType === 3">
          <div>执行结果:{{item.contentInfo}}</div>
        </div>
        <div v-if="+item.operationType === 4">
          <div>执行结果:{{item.contentInfo}}</div>
        </div>
      </div>
    </div>
    <template #footer>
      <span  class="dialog-footer">
      <el-button  type="primary" @click="handleClose">确 定</el-button>
    </span>
    </template>
  </el-dialog>
</template>
<script>
import { getExecutionResult } from '@/api/overhaul/problemLabApi';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      contentInfo: []
    }
  },
  watch: {
    visible(newVal) {
      if (newVal && this.info) {
        let { workCode, workProcedureId: craftCode, workScene } = this.info;
        let params = {
          workCode,
          craftCode,
          workScene,
          executionFrequency: 2
        }
        getExecutionResult(params)
        .then(res => {
          if (res.success && res.data)
          this.contentInfo = res.data.value || [];
        })
      }
    }
  },
  methods: {
    // 关闭
    handleClose() {
      this.$emit('closeModal', 'preview', false);
    },
  }
}
</script>
<style lang="scss" scoped>

</style>
