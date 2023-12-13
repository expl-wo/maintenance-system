<template>
  <el-dialog
    draggable
    title="工单二维码打印"
    :model-value="true"
    width="500px"
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
        <el-col :span="24">
          <el-form-item label="打印数量" prop="number">
            <el-input-number v-model="form.number" :min="1" :max="100000" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click.stop="handleClose"> 取消 </el-button>
        <el-button type="primary" @click="handleOk"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { requiredVerify } from "@/common/js/validator";
export default {
  props: {
    modalName: {
      type: String,
      default: "",
    },
    //当前工单的详情
    workOrderInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      form: {
        number: 10,
      },
      rules: {
        number: requiredVerify(),
      },
    };
  },
  methods: {
    handleOk() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let resultCode = []
          new Array(this.form.number).fill(1).forEach((item,index)=>{
            resultCode.push({...this.workOrderInfo,codeIndex:index})
          })
          this.$emit("printQrCode", resultCode);
        }
      });
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
  },
};
</script>
