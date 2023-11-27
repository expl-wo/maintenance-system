<template>
  <el-dialog draggable
    title="查看问题"
    width="40%"
    :model-value="visible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="handleClose"
    >
    <span>这是一段信息</span>
    <template #footer>
      <span  class="dialog-footer">
      <el-button  type="primary" @click="handleClose">确 定</el-button>
    </span>
    </template>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
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
