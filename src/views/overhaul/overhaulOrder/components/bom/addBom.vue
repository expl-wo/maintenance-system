<template>
  <el-dialog
    :title="operateTypeTitle"
    :model-value="true"
    class="overhaul-bom-modal"
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
        <el-col :span="24">
          <el-form-item label="节点类型" prop="bomNode">
            <el-select v-model="form.bomNode" placeholder="请选择" clearable>
              <el-option
                v-for="item in bomNodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="24">
          <el-form-item label="名称" prop="bomNodeName">
            <el-input v-model="form.bomNodeName" />
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
    operateType: {
      type: String,
      default: "add",
    },
    modalName: {
      type: String,
      default: "",
    },
  },
  computed: {
    operateTypeTitle() {
      return this.operateType === "add" ? "新增BOM节点" : "修改BOM节点";
    },
  },
  data() {
    return {
      form: {
        bomNode: undefined,
        bomNodeName: "",
      },
      rules: {
        bomNode: requiredVerify(),
        bomNodeName: safeLimit("", true),
      },
      bomNodeOptions: [{ label: "大部件", value: 1 }],
    };
  },
  mounted() {
    if (this.operateType === "update") {
      this.form.bomNode = 1;
      this.form.bomNodeName = this.operateRow.data.procedureName;
    }
  },
  methods: {
    handleOk() {
      this.$refs["dataForm"].validate((valid) => {
        debugger;
        this.$emit("closeModal", this.modalName);
      });
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
  },
};
</script>

<style lang="scss">
div.overhaul-bom-modal {
  width: 600px !important;
}
</style>