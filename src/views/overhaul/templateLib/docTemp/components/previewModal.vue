<template>
  <el-dialog draggable
    title="预览"
    width="80%"
    :model-value="visible"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="preview-wrapper" v-html="info.content"></div>
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
      default: false,
    },
    info: {
      type: Object,
      default: null,
    },
  },
  methods: {
    handleClose() {
      this.$emit("closeModal", "preview", false);
    },
  },
};
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
