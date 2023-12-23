<template>
  <el-dialog
    draggable
    title="报工"
    :model-value="true"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="dataForm"
      :model="form"
      label-position="right"
      label-width="100px"
    >
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="24">
          <el-form-item label="工作进度" required>
            <el-slider v-model="form.value" show-input />
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
import { reportWorkContent } from "@/api/overhaul/workOrderApi.js";
export default {
  props: {
    contentInfo:{
     type: Object,
      default() {
        return {};
      },
    },
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
  watch:{
    contentInfo:{
      handler(val){
        this.form.value =val.progress
        
      },
      immediate:true
    }
  },
  data() {
    return {
      form: {
        value: 0,
      },
    };
  },
  methods: {
    //工序保存
    handleOk() {
      let params = {
        workCode: this.workOrderInfo.id,
        workProcedureCode: this.operateRow.procedureCode,
        progress: this.form.value,
        workScene: this.sceneType,
        operator:localStorage.getItem("userId")
      };
      reportWorkContent(params).then((res) => {
        if (res.code !== "0") {
          this.$message.error(res.errMsg);
        } else {
          this.$message.success('操作成功！');
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
