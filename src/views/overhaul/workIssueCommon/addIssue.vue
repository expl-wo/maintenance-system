<template>
  <el-dialog
    title="添加问题"
    :model-value="true"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="form"
      label-position="right"
      
      label-width="100px"
    >
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="问题类别" prop="issue">
            <el-select
              v-model="form.issue"
              class="filter-item"
              placeholder="请选择"
            >
              <el-option
                v-for="item in issueOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="异常项">
            <el-select
              v-model="form.exceptionItem"
              class="filter-item"
              placeholder="请选择"
            >
              <el-option
                v-for="item in exceptionItemOptions"
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
          <el-form-item label="通知人">
            <el-select
              v-model="form.notifier"
              class="filter-item"
              placeholder="请选择"
            >
              <el-option
                v-for="item in notifierOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="问题描述" prop="issueDescription">
            <el-input
              v-model="form.issueDescription"
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
import { safeLimit } from "@/common/js/validator";
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
        issue: undefined,
        exceptionItem: undefined,
        notifier: undefined,
        issueDescription: "",
      },
      rules: {
        issue: safeLimit("", true),
        issueDescription: safeLimit("", false),
      },
      issueOptions: [{ label: "刘德华", value: 1 }],
      exceptionItemOptions: [{ label: "张学友", value: 1 }],
      notifierOptions: [{ label: "四大天王", value: 1 }],
    };
  },
  methods: {
    handleOk() {
      debugger;
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>