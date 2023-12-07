<template>
  <el-dialog
    draggable
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
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="24">
          <el-form-item label="空白二维码" prop="bomNodeType">
            <el-select v-model="form.bomType" placeholder="请选择">
              <el-option label="否" :value="2" />
              <el-option label="是" :value="1" />
            </el-select>
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
        bomType: 1, //空白二维码携带生产号
      },
      rules: {
        number: requiredVerify(),
        bomType: requiredVerify(),
      },
    };
  },
  methods: {
    handleOk() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let params = {};
          //是否空白二维码
          params = {
            generateNum: this.form.number,
            prodNumber:
              this.form.bomType === 2 || !this.workOrderInfo.prodNumber
                ? undefined
                : this.workOrderInfo.prodNumber,
          };
          createQrCodeText(params).then((res) => {
            if (res.code !== "0") {
              this.$message.error(res.errMsg);
              return;
            }
            this.$emit("printQrCode", res.data.value);
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
