<template>
  <el-dialog draggable
    title="复制模板"
    width="30%"
    :model-value="visible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <el-form
      ref="copyForm"
      :model="copyForm"
      :rules="rules"
      label-width="100px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item  label="模板名称" prop="templateName">
            <el-input v-model="copyForm.templateName"> </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button  @click="handleClose">取 消</el-button>
        <el-button

          type="primary"
          :loading="loading"
          @click="handleConfirm"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { safeLimit } from "@/common/js/validator";
import { copyBomTemplate } from "@/api/overhaul/templateLib";

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
  data() {
    return {
      copyForm: {
        templateName: "",
      },
      rules: {
        templateName: safeLimit("名称", true),
      },
      loading: false,
    };
  },
  watch: {
    visible(newVal) {
      if (newVal && this.info) {
        this.copyForm.templateName = this.info.templateName + "_副本";
      }
    },
  },
  methods: {
    // 关闭
    handleClose() {
      this.$refs.copyForm.resetFields();
      this.$emit("closeModal", "copy", false);
    },
    // 确定
    handleConfirm() {
      this.$refs.copyForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        let params = {
          newTemplateName: this.copyForm.templateName,
          oldTemplateId: this.info.id,
        };
        copyBomTemplate(params)
          .then((res) => {
            if (res.success) {
              this.$message.success("操作成功");
              this.$refs.copyForm.resetFields();
              this.$emit("closeModal", "copy", true);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
};
</script>
