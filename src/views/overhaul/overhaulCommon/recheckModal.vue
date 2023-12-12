<template>
  <el-dialog
    draggable
    title="复核"
    :model-value="true"
    :destroy-on-close="true"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="form"
      label-position="right"
      label-width="150px"
    >
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="24">
          <el-form-item label="复核结果" required>
            <el-radio-group v-model="form.result">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">未通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否合入问题库" required>
            <el-select
              v-model="form.isAddLib"
              class="filter-item"
              placeholder="请选择"
            >
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click.stop="handleClose"> 取消 </el-button>
        <el-button type="primary" @click="handleOk"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { checkWorkContent } from "@/api/overhaul/workOrderApi.js";
export default {
  props: {
    //操作行
    operateRow: {
      type: Object,
      default() {
        return null;
      },
    },
    workOrderInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    sceneType: {
      type: String,
      default: "",
    },
    modalName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        result: 1,
        isAddLib: 1,
      },
    };
  },
  methods: {
    //工序保存
    handleOk() {
      let params = {
        workCode: this.workOrderInfo.id,
        craftId: this.operateRow.workProcedureCode,
        pass: this.form.result,
        workScene: this.sceneType,
        isProblem:this.form.isAddLib
      };
      checkWorkContent(params).then((res) => {
        if (res.code !== "0") {
          this.$message.error(res.errMsg);
        } else {
          this.$message.success('操作成功!')
          this.handleClose(true);
        }
      });
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
