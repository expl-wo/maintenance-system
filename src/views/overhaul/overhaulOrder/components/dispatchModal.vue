<template>
  <el-dialog
    title="任务指派"
    :model-value="true"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="form"
      label-position="right"
      size="small"
      label-width="100px"
    >
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="项目经理" prop="projectManager">
            <el-select
              v-model="form.projectManager"
              class="filter-item"
              placeholder="请选择"
            >
              <el-option
                v-for="item in projectManagerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目副经理">
            <el-select
              v-model="form.phuocManager"
              class="filter-item"
              placeholder="请选择"
            >
              <el-option
                v-for="item in phuocManagerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="任务班组">
            <el-select
              v-model="form.taskTeam"
              class="filter-item"
              placeholder="请选择"
            >
              <el-option
                v-for="item in taskTeamOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务描述" prop="taskDescription">
            <el-input
              v-model="form.taskDescription"
              type="textarea"
              :rows="2"
              placeholder="请输入任务描述"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click.stop="handleClose"> 取消 </el-button>
        <el-button type="primary" @click="handleOk"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { requiredVerify, safeLimit } from "@/common/js/validator";
export default {
  props: {
    //操作行
    operateRow: {
      type: Object,
      default() {
        return null;
      },
    },
    modalName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        projectManager: undefined,
        phuocManager: undefined,
        taskTeam: undefined,
        taskDescription: "",
      },
      rules: {
        projectManager: safeLimit("", true),
        taskDescription: safeLimit("", false),
      },
      projectManagerOptions: [{ label: "刘德华", value: 1 }],
      phuocManagerOptions: [{ label: "张学友", value: 1 }],
      taskTeamOptions: [{ label: "四大天王", value: 1 }],
    };
  },
  methods: {
    handleOk() {
           this.$emit("onSave", this.modalName);
      this.$emit("closeModal", this.modalName);
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep(.el-input--small .el-input__inner) {
  width: 220px;
}
</style>