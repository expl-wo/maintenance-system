<template>
  <el-dialog
    title="效果预览"
    width="80%"
    :model-value="visible"
    :close-on-click-modal="false"
    @close="handleClose"
  >
      <div
        class="preview-wrapper"
        v-html="editorHtml">
      </div>
      <template #footer>
            <span class="dialog-footer">
      <el-button type="primary" @click="handleClose">确 定</el-button>
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
    editorHtml: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClose() {
      this.$emit('closeDialog');
    }
  }
}
</script>
<style lang="scss" scoped>
.preview-wrapper {
  border: 1px solid #ccc;
  width: 100%;
  height: 500px;
  padding: 10px;
  overflow-y: auto;
}
</style>