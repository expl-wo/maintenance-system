<template>
  <el-dialog
    title="上传文件"
    v-model="dialogVisible"
    width="700px"
    :close-on-click-modal="false">
    <div>
        <xui-upload @uploadSuccess="uploadSuccess"></xui-upload>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'uploadFileDialog',
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    init() {
      this.dialogVisible = true;
    },
    uploadSuccess(){
      this.$emit('refresh', {});
      this.dialogVisible = false;
    },
    cancel() {
      this.closeDialog();
    },
    closeDialog() {
      this.dialogVisible = false;
    }
  },
};
</script>


<style scoped lang="scss">
.downloadFileTemplate {
  text-decoration: underline;
  color: #1890ff;
}

</style>
