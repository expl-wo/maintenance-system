<template>
  <el-dialog draggable
    title="复制模板"
    width="40%"
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
        <el-col :span="12">
          <el-form-item  label="模板名称" prop="templateName">
            <el-input v-model="copyForm.templateName"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="cust-select-wrapper">
          <el-form-item
            label="型号"
            prop="templateModels"
            :rules="requiredVerify('型号', true)"
          >
            <select-page
              ref="modelSelectRef"
              v-model="copyForm.templateModels"
              collapse-tags
              :multiple="true"
              :collapse-tags-tooltip="true"
              :defaultSelectVal="defaultSelectVal"
              :getOptions="getOptions"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
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

import SelectPage from "@/components/SelectPage/selectPage";

import { safeLimit } from "@/common/js/validator";
import { copyBomTemplate, getModelList, getUsedModelList } from "@/api/overhaul/templateLib";
import { requiredVerify } from "@/common/js/validator";

export default {
  components: {
    SelectPage
  },
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
        templateModels: []
      },
      rules: {
        templateName: safeLimit("名称", true),
      },
      loading: false,
      usedModelList: [],
      defaultSelectVal: [],
    };
  },
  watch: {
    visible(newVal) {
      let params = {bomTemplateId: null};
      newVal && this.getUsedModel(params);
      if (newVal && this.info) {
        this.copyForm.templateName = this.info.templateName + "_副本";
      }
    },
  },
  methods: {
    requiredVerify,
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
          newTemplateModels: this.copyForm.templateModels,
          oldTemplateId: this.info.id,
        };
        copyBomTemplate(params)
          .then((res) => {
            if (res.success) {
              this.$message.success("操作成功");
              this.$refs.copyForm.resetFields();
              this.$emit("closeModal", "copy", true);
            } else {
              this.$message.error(res.errMsg || '操作失败');
            }
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    async getUsedModel(params) {
      let res = await getUsedModelList(params);
      if (res.success && res.data) {
        this.usedModelList = res.data.value;
      }
    },
    //获取下拉选择项
    getOptions(params) {
      return new Promise((resolve, reject) => {
        const { pageNum, pageSize, searchKey } = params;
        let queryParms = {
          pageNum,
          pageSize,
          searchKey,
          accountId: localStorage.getItem('userId')
        };
        getModelList(queryParms).then((res) => {
          let usedModelList = this.usedModelList.map(item => item.modelId);
          let options = (res.data.pageList || []).map((item) => ({
            label: item.model,
            value: item.model,
            timeLimitId: item.timeLimitId,
            disabled: usedModelList.includes(item.model)
          }));
          resolve({
            options: options,
            totalPage: res.data.allPageNum,
          });
        });
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.cust-select-wrapper ::v-deep(.el-select) {
  width: 100%;
}
</style>
