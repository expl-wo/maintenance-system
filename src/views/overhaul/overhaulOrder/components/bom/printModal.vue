<template>
  <el-dialog
    title="二维码打印"
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
        <el-button type="primary" @click="handleOk"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { createQrCodeText } from "@/api/overhaul/bomApi.js";
import { requiredVerify } from "@/common/js/validator";
export default {
  props: {
    modalName: {
      type: String,
      default: "",
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
          const qrCodeList = ["12313", "4546"];
          createQrCodeText(this.form.number).then((res) => {
            debugger;
            this.$emit("printQrCode", qrCodeList);
          });
        }
      });
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
  },
};
</script>